import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { editPhoneInput } from '../../../../test/phone-input-edit';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmPhoneInput, formatNanpPhoneNumber } from './hlm-phone-input';

describe('formatNanpPhoneNumber', () => {
  it('formats partial and full digit strings', () => {
    expect(formatNanpPhoneNumber('')).toBe('');
    expect(formatNanpPhoneNumber('4')).toBe('(4');
    expect(formatNanpPhoneNumber('415')).toBe('(415');
    expect(formatNanpPhoneNumber('4155')).toBe('(415) 5');
    expect(formatNanpPhoneNumber('415555')).toBe('(415) 555');
    expect(formatNanpPhoneNumber('4155552')).toBe('(415) 555-2');
    expect(formatNanpPhoneNumber('4155552671')).toBe('(415) 555-2671');
    expect(formatNanpPhoneNumber('415555267199')).toBe('(415) 555-2671');
  });
});

@Component({
  imports: [ReactiveFormsModule, HlmPhoneInput],
  template: `<form [formGroup]="form">
    <hlm-phone-input
      formControlName="value"
      [inputId]="id()"
      [maxDigits]="maxDigits()"
      [modelFormat]="modelFormat()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [formatPhoneNumber]="formatter()"
      placeholder="(555) 123-4567"
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl<string | null>(null) });
  readonly id = signal('phone');
  readonly maxDigits = signal(10);
  readonly modelFormat = signal<'digits' | 'formatted'>('digits');
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly formatter = signal(formatNanpPhoneNumber);
}

describe('HlmPhoneInput', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  const control = () => fixture.nativeElement.querySelector('hlm-phone-input input') as HTMLInputElement;

  function typeText(text: string): void {
    const input = control();
    input.focus();
    for (const char of text) {
      const caret = input.value.length;
      input.setSelectionRange(caret, caret);
      input.value = `${input.value}${char}`;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    }
  }

  for (const [direction, positions, expected, caret] of [
    ['deleteContentForward', [4, 5, 6], '415552671', 4],
    ['deleteContentBackward', [4, 5, 6], '415552671', 3],
    ['deleteContentForward', [9, 10], '415555671', 9],
    ['deleteContentBackward', [9, 10], '415552671', 8],
  ] as const) {
    for (const position of positions) {
      it(`${direction} at ${position} deletes the adjacent logical digit`, () => {
        const model = fixture.componentInstance.form.controls.value;
        model.setValue('4155552671');
        fixture.detectChanges();
        const changes: (string | null)[] = [];
        model.valueChanges.subscribe((value) => changes.push(value));
        control().focus();
        control().setSelectionRange(position, position);
        editPhoneInput(control(), direction);
        fixture.detectChanges();
        expect(model.value).toBe(expected);
        expect(changes).toEqual([expected]);
        expect(control().value).toBe(formatNanpPhoneNumber(expected));
        expect(control().selectionStart).toBe(caret);
        expect(control().selectionEnd).toBe(caret);
      });
    }
  }

  for (const direction of ['deleteContentForward', 'deleteContentBackward']) {
    for (const [start, end, expected, caret] of [
      [3, 7, '41552671', 3],
      [4, 6, '4155552671', 4],
      [9, 10, '4155552671', 9],
      [0, 14, null, 0],
    ] as const) {
      it(`${direction} only removes digits selected in [${start}, ${end})`, () => {
        const model = fixture.componentInstance.form.controls.value;
        model.setValue('4155552671');
        fixture.detectChanges();
        const changes: (string | null)[] = [];
        model.valueChanges.subscribe((value) => changes.push(value));
        control().setSelectionRange(start, end);
        editPhoneInput(control(), direction);
        fixture.detectChanges();
        expect(model.value).toBe(expected);
        expect(changes).toEqual(expected === '4155552671' ? [] : [expected]);
        expect(control().value).toBe(formatNanpPhoneNumber(expected ?? ''));
        expect(control().selectionStart).toBe(caret);
        expect(control().selectionEnd).toBe(caret);
      });
    }
  }

  it('masks typed digits and stores raw digits in the model', () => {
    typeText('4155552671');
    expect(control().value).toBe('(415) 555-2671');
    expect(fixture.componentInstance.form.controls.value.value).toBe('4155552671');
  });

  for (const modelFormat of ['digits', 'formatted'] as const) {
    it(`preserves replacement, paste, clear and silent writes in ${modelFormat} mode`, () => {
      fixture.componentInstance.modelFormat.set(modelFormat);
      const model = fixture.componentInstance.form.controls.value;
      model.setValue('4155552671');
      fixture.detectChanges();
      const changes: (string | null)[] = [];
      model.valueChanges.subscribe((value) => changes.push(value));
      control().focus();
      control().setSelectionRange(3, 7);
      editPhoneInput(control(), 'insertText', '9');
      fixture.detectChanges();
      expect(control().value).toBe('(419) 552-671');
      expect(control().selectionStart).toBe(4);
      expect(model.value).toBe(modelFormat === 'digits' ? '419552671' : '(419) 552-671');
      control().setSelectionRange(0, control().value.length);
      editPhoneInput(control(), 'insertFromPaste', '+1 (202) 867-5309');
      fixture.detectChanges();
      expect(control().value).toBe('(120) 286-7530');
      expect(control().selectionStart).toBe(14);
      expect(model.value).toBe(modelFormat === 'digits' ? '1202867530' : '(120) 286-7530');
      control().setSelectionRange(0, control().value.length);
      editPhoneInput(control(), 'deleteContentBackward');
      fixture.detectChanges();
      expect(model.value).toBeNull();
      expect(control().value).toBe('');
      expect(control().selectionStart).toBe(0);
      editPhoneInput(control(), 'deleteContentForward');
      expect(changes.length).toBe(3);
      expect(model.touched).toBeFalse();
      control().blur();
      expect(model.touched).toBeTrue();
      model.setValue('(212) 345-6789', { emitEvent: false });
      fixture.detectChanges();
      expect(control().value).toBe('(212) 345-6789');
      expect(changes.length).toBe(3);
    });
  }

  for (const lock of ['readonly', 'disabled', 'formDisabled'] as const) {
    it(`guards beforeinput and input under ${lock}`, () => {
      const host = fixture.componentInstance;
      const model = host.form.controls.value;
      model.setValue('4155552671');
      if (lock === 'formDisabled') model.disable();
      else host[lock].set(true);
      fixture.detectChanges();
      const changes: (string | null)[] = [];
      model.valueChanges.subscribe((value) => changes.push(value));
      control().setSelectionRange(9, 9);
      editPhoneInput(control(), 'deleteContentForward');
      editPhoneInput(control(), 'insertFromPaste', '99');
      control().value = '123';
      control().dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
      fixture.detectChanges();
      expect(control().value).toBe('(415) 555-2671');
      expect(model.value).toBe('4155552671');
      expect(changes).toEqual([]);
    });
  }

  it('uses logical positions for custom multi-character separators and distinct digits', () => {
    fixture.componentInstance.formatter.set((digits) => digits.match(/.{1,3}/g)?.join(' / ') ?? '');
    const model = fixture.componentInstance.form.controls.value;
    model.setValue('1234567890');
    fixture.detectChanges();
    control().setSelectionRange(4, 4);
    editPhoneInput(control(), 'deleteContentForward');
    fixture.detectChanges();
    expect(model.value).toBe('123567890');
    expect(control().value).toBe('123 / 567 / 890');
    expect(control().selectionStart).toBe(3);
    control().setSelectionRange(6, 6);
    editPhoneInput(control(), 'deleteContentBackward');
    fixture.detectChanges();
    expect(model.value).toBe('12567890');
    expect(control().selectionStart).toBe(2);
  });

  it('keeps boundary deletions idempotent and does not retain canceled edit intent', () => {
    const model = fixture.componentInstance.form.controls.value;
    model.setValue('1234567890');
    fixture.detectChanges();
    const changes: (string | null)[] = [];
    model.valueChanges.subscribe((value) => changes.push(value));
    control().setSelectionRange(0, 0);
    editPhoneInput(control(), 'deleteContentBackward');
    control().setSelectionRange(14, 14);
    editPhoneInput(control(), 'deleteContentForward');
    expect(changes).toEqual([]);
    control().setSelectionRange(9, 9);
    const canceled = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'deleteContentForward',
    });
    canceled.preventDefault();
    control().dispatchEvent(canceled);
    expect(model.value).toBe('1234567890');
    control().setSelectionRange(0, 14);
    editPhoneInput(control(), 'insertFromPaste', '9876543210');
    fixture.detectChanges();
    expect(model.value).toBe('9876543210');
    expect(changes).toEqual(['9876543210']);
  });

  it('keeps the caret after the last typed digit', () => {
    typeText('415');
    expect(control().value).toBe('(415');
    expect(control().selectionStart).toBe(4);
  });

  it('truncates beyond maxDigits', () => {
    fixture.componentInstance.maxDigits.set(3);
    fixture.detectChanges();
    typeText('4155552671');
    expect(control().value).toBe('(415');
    expect(fixture.componentInstance.form.controls.value.value).toBe('415');
  });

  it('formats a programmatic value and honors disabled state', () => {
    fixture.componentInstance.form.controls.value.setValue('4155552671');
    fixture.detectChanges();
    expect(control().value).toBe('(415) 555-2671');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('stores formatted text when modelFormat is formatted', () => {
    fixture.componentInstance.modelFormat.set('formatted');
    fixture.detectChanges();
    typeText('4155552671');
    expect(control().value).toBe('(415) 555-2671');
    expect(fixture.componentInstance.form.controls.value.value).toBe('(415) 555-2671');
    fixture.componentInstance.form.controls.value.setValue('(415) 555-2671');
    fixture.detectChanges();
    expect(control().value).toBe('(415) 555-2671');
  });
});
