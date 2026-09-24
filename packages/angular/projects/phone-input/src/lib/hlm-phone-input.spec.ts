import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  it('masks typed digits and stores raw digits in the model', () => {
    typeText('4155552671');
    expect(control().value).toBe('(415) 555-2671');
    expect(fixture.componentInstance.form.controls.value.value).toBe('4155552671');
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
