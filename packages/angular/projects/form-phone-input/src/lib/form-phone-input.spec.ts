import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormPhoneInput } from './form-phone-input';
import { provideEgFormPhoneInputConfig } from './form-phone-input.token';

@Component({
  imports: [ReactiveFormsModule, EgFormPhoneInput],
  template: `<form [formGroup]="form">
    <eg-form-phone-input
      controlName="value"
      label="Phone"
      [id]="id()"
      [disabled]="disabled()"
      [inputClass]="inputClass()"
      [readonly]="readonly()"
      [class]="userClass()"
      [modelFormat]="modelFormat()"
      error="Phone required"
      hint="US format"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl<string | null>(null, Validators.required) });
  readonly id = signal<string | undefined>('phone');
  readonly disabled = signal(false);
  readonly inputClass = signal('');
  readonly readonly = signal(false);
  readonly userClass = signal('');
  readonly modelFormat = signal<'digits' | 'formatted'>('digits');
}

@Component({
  imports: [ReactiveFormsModule, EgFormPhoneInput],
  template: `<form [formGroup]="form">
    <eg-form-phone-input controlName="value" label="Phone" [labelClass]="labelClass()" [inputClass]="inputClass()" />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl<string | null>(null) });
  readonly labelClass = signal('');
  readonly inputClass = signal('');
}

describe('EgFormPhoneInput', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated input IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-phone-input input') as HTMLInputElement;
    expect(control().id).toBe('phone');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('phone');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('phone-error');
    expect(fixture.nativeElement.querySelector('#phone-error').textContent).toContain('Phone required');
    fixture.componentInstance.form.controls.value.setValue('4155552671');
    fixture.detectChanges();
    expect(control().value).toBe('(415) 555-2671');
    expect(control().getAttribute('aria-describedby')).toBe('phone-hint');
    expect(fixture.nativeElement.querySelector('#phone-hint').textContent).toContain('US format');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-phone-input-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-phone-input input') as HTMLInputElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('applies userClass to the host and forwards inputClass, name, and readonly', () => {
    const host = () => fixture.nativeElement.querySelector('eg-form-phone-input') as HTMLElement;
    const control = () => fixture.nativeElement.querySelector('hlm-phone-input input') as HTMLInputElement;
    fixture.componentInstance.userClass.set('tw:max-w-xs');
    fixture.componentInstance.inputClass.set('tw:text-lg');
    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();
    expect(host().className).toContain('tw:max-w-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().readOnly).toBeTrue();
    expect(control().getAttribute('name')).toBe('value');
  });

  it('forwards modelFormat to the inner input', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-phone-input input') as HTMLInputElement;
    fixture.componentInstance.modelFormat.set('formatted');
    fixture.detectChanges();
    control().focus();
    control().value = '4155552671';
    control().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(control().value).toBe('(415) 555-2671');
    expect(fixture.componentInstance.form.controls.value.value).toBe('(415) 555-2671');
  });
});

describe('EgFormPhoneInput global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormPhoneInputConfig({ labelClass: 'tw:text-xs', inputClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('hlm-phone-input input') as HTMLInputElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.inputClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().className).not.toContain('tw:text-xs');
  });
});
