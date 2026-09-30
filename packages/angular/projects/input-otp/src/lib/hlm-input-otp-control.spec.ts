import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrnField, BrnFieldA11yService } from '@spartan-ng/brain/field';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '../public-api';
import { configureLibraryTestBed } from '../../../../test/setup';
import { expectDescriptions } from '../../../../test/validation-descriptions';

@Component({
  imports: [ReactiveFormsModule, BrnField, BrnInputOtp, HlmInputOtpImports],
  template: `
    <div brnField>
      <label for="otp">Verification code</label>
      <hlm-input-otp
        inputId="otp"
        [length]="4"
        [formControl]="control"
        [aria-describedby]="description()"
        required
        [autofocus]="true"
        [transformPaste]="strip"
        (valueChange)="values.push($event)"
        (completed)="completed.push($event)"
      >
        <div hlmInputOtpGroup>
          @for (i of indexes; track i) {
            <hlm-input-otp-slot [index]="i" />
          }
        </div>
      </hlm-input-otp>
      <p id="manual">Manual instructions</p>
      <p id="field">Field instructions</p>
    </div>
    <brn-input-otp hlmInputOtp [length]="4" inputId="legacy" [value]="legacy()">
      <div hlmInputOtpGroup>
        @for (i of indexes; track i) {
          <hlm-input-otp-slot [index]="i" />
        }
      </div>
    </brn-input-otp>
  `,
})
class Host {
  readonly control = new FormControl('', { nonNullable: true, validators: Validators.required });
  readonly description = signal<string | null>('manual');
  readonly legacy = signal('1234');
  readonly indexes = [0, 1, 2, 3];
  readonly strip = (text: string) => text.replace(/-/g, '');
  readonly values: string[] = [];
  readonly completed: string[] = [];
}

describe('HlmInputOtpControl declarative adapter', () => {
  let fixture: ComponentFixture<Host>;
  const input = () => fixture.nativeElement.querySelector('hlm-input-otp input') as HTMLInputElement;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
  });
  afterEach(() => fixture.destroy());

  it('merges manual and registered field descriptions and removes each independently', () => {
    const service = fixture.debugElement.query(By.directive(BrnField)).injector.get(BrnFieldA11yService);
    service.registerDescription('field');
    fixture.detectChanges();
    expectDescriptions([input()], ['manual', 'field']);
    fixture.componentInstance.description.set('field manual field');
    fixture.detectChanges();
    expectDescriptions([input()], ['field', 'manual']);
    fixture.componentInstance.description.set(null);
    fixture.detectChanges();
    expectDescriptions([input()], ['field']);
    service.unregisterDescription('field');
    fixture.detectChanges();
    expectDescriptions([input()], []);
  });

  it('preserves inherited autofocus, labeling, input attributes and CVA invalid state', () => {
    expect(document.activeElement).toBe(input());
    expect(input().labels?.[0].textContent).toContain('Verification code');
    expect(input().autocomplete).toBe('one-time-code');
    expect(input().inputMode).toBe('numeric');
    expect(input().getAttribute('aria-required')).toBe('true');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect((fixture.nativeElement.querySelector('hlm-input-otp') as HTMLElement).style.position).toBe('relative');
    fixture.componentInstance.control.setValue('1234');
    fixture.detectChanges();
    expect(input().getAttribute('aria-invalid')).toBeNull();
    expect(fixture.componentInstance.values).toEqual([]);
  });

  it('delegates transformed paste, user outputs, completion and slot rendering to the brain model', () => {
    const data = new DataTransfer();
    data.setData('text/plain', '12-345');
    input().dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('1234');
    expect(fixture.componentInstance.values).toEqual(['1234']);
    expect(fixture.componentInstance.completed).toEqual(['1234']);
    const slots = Array.from(
      fixture.nativeElement.querySelectorAll('hlm-input-otp hlm-input-otp-slot'),
    ) as HTMLElement[];
    expect(slots.map((slot) => slot.textContent?.trim())).toEqual(['1', '2', '3', '4']);
  });

  it('delegates disabled state, blur touching and null reset without user value emissions', () => {
    input().blur();
    expect(fixture.componentInstance.control.touched).toBeTrue();
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(input().disabled).toBeTrue();
    fixture.componentInstance.control.enable();
    fixture.componentInstance.control.reset();
    fixture.detectChanges();
    expect(input().disabled).toBeFalse();
    expect(input().value).toBe('');
    expect(fixture.componentInstance.control.untouched).toBeTrue();
    expect(fixture.componentInstance.values).toEqual([]);
  });

  it('retains legacy BrnInputOtp slot rendering and its native input path', () => {
    const legacy = fixture.nativeElement.querySelector('brn-input-otp input') as HTMLInputElement;
    const slots = Array.from(
      fixture.nativeElement.querySelectorAll('brn-input-otp hlm-input-otp-slot'),
    ) as HTMLElement[];
    expect(legacy.value).toBe('1234');
    expect(slots.map((slot) => slot.textContent?.trim())).toEqual(['1', '2', '3', '4']);
    expect(slots.every((slot) => !!slot.querySelector('brn-input-otp-slot'))).toBeTrue();
    fixture.componentInstance.legacy.set('');
    fixture.detectChanges();
    expect(legacy.value).toBe('');
    expect(slots.every((slot) => !slot.textContent?.trim())).toBeTrue();
  });
});
