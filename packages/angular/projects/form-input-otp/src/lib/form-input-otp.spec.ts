import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormInputOtp } from './form-input-otp';
import { provideEgFormInputOtpConfig } from './form-input-otp.token';
import { expectDescriptions, verifyValidationDescriptions } from '../../../../test/validation-descriptions';

@Component({
  imports: [ReactiveFormsModule, EgFormInputOtp],
  template: `<form [formGroup]="form">
    <eg-form-input-otp
      controlName="value"
      label="Code"
      [id]="id()"
      [length]="6"
      [disabled]="disabled()"
      error="Code required"
      [hint]="hint()"
      [aria-describedby]="descriptions()"
      [required]="required()"
    />
    <p id="code-external">External code instructions</p>
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('code');
  readonly disabled = signal(false);
  readonly hint = signal<string | undefined>('Six digits');
  readonly descriptions = signal<string | null>(null);
  readonly required = signal(true);
}

@Component({
  imports: [ReactiveFormsModule, EgFormInputOtp],
  template: `<form [formGroup]="form">
    <eg-form-input-otp
      controlName="value"
      label="Code"
      [length]="4"
      [labelClass]="labelClass()"
      [otpClass]="otpClass()"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly otpClass = signal('');
}

describe('EgFormInputOtp', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('describes the native OTP input with the visible hint', () => {
    const control = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(control.getAttribute('aria-describedby')).toBe('code-hint');
  });

  for (const interaction of ['touch', 'submit'] as const) {
    it(`keeps native OTP descriptions current through ${interaction}, correction and reset`, async () => {
      await verifyValidationDescriptions(
        fixture,
        () => [fixture.nativeElement.querySelector('input')],
        fixture.componentInstance.form.controls.value,
        '123456',
        interaction,
      );
    });
  }

  it('retains external descriptions through hint removal and ID/required changes', () => {
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    host.descriptions.set('code-external code-external');
    host.form.markAllAsTouched();
    fixture.detectChanges();
    expectDescriptions([input], ['code-external', 'code-error']);
    expect(input.getAttribute('aria-required')).toBe('true');
    host.id.set('new-code');
    host.hint.set(undefined);
    host.required.set(false);
    fixture.detectChanges();
    expectDescriptions([input], ['code-external', 'new-code-error']);
    expect(input.labels?.[0].htmlFor).toBe('new-code');
    expect(input.getAttribute('aria-required')).toBeNull();
    host.form.controls.value.setValue('123456');
    host.descriptions.set(null);
    fixture.detectChanges();
    expectDescriptions([input], []);
  });

  it('preserves native input, paste, slot/caret, blur and reset behavior in the adapter', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const control = fixture.componentInstance.form.controls.value;
    input.focus();
    input.value = '12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(control.value).toBe('12');
    const slots = Array.from(fixture.nativeElement.querySelectorAll('hlm-input-otp-slot')) as HTMLElement[];
    expect(slots[0].textContent?.trim()).toBe('1');
    expect(slots[1].textContent?.trim()).toBe('2');
    expect(slots[2].querySelector('hlm-input-otp-fake-caret')).not.toBeNull();
    const data = new DataTransfer();
    data.setData('text/plain', '6543210');
    input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(control.value).toBe('654321');
    expect(input.value).toBe('654321');
    input.blur();
    fixture.detectChanges();
    expect(control.touched).toBeTrue();
    expect(fixture.nativeElement.querySelector('hlm-input-otp-fake-caret')).toBeNull();
    control.reset();
    fixture.detectChanges();
    expect(input.value).toBe('');
    expect(slots.every((slot) => !slot.textContent?.trim())).toBeTrue();
  });

  it('renders one slot per length unit with label, error, and hint', () => {
    const slots = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-input-otp-slot')) as HTMLElement[];
    expect(slots().length).toBe(6);
    const control = () => fixture.nativeElement.querySelector('hlm-input-otp input') as HTMLInputElement;
    expect(control().id).toBe('code');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('code');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Code required');
    fixture.componentInstance.form.controls.value.setValue('123456');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Six digits');
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-input-otp input') as HTMLInputElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });
});

describe('EgFormInputOtp global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormInputOtpConfig({ labelClass: 'tw:text-xs', otpClass: 'tw:gap-1' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('hlm-input-otp') as HTMLElement;
    const slots = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-input-otp-slot')) as HTMLElement[];
    expect(slots().length).toBe(4);
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:gap-1');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.otpClass.set('tw:gap-4');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:gap-4');
    expect(control().className).not.toContain('tw:gap-1');
  });
});
