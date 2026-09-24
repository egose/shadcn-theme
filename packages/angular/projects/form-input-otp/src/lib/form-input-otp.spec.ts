import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormInputOtp } from './form-input-otp';
import { provideEgFormInputOtpConfig } from './form-input-otp.token';

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
      hint="Six digits"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('code');
  readonly disabled = signal(false);
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

  it('renders one slot per length unit with label, error, and hint', () => {
    const slots = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-input-otp-slot')) as HTMLElement[];
    expect(slots().length).toBe(6);
    const control = () => fixture.nativeElement.querySelector('brn-input-otp input') as HTMLInputElement;
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
    const control = () => fixture.nativeElement.querySelector('brn-input-otp input') as HTMLInputElement;
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
    const control = () => fixture.nativeElement.querySelector('brn-input-otp') as HTMLElement;
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
