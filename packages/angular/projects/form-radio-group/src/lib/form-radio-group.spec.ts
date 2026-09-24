import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormRadioGroup } from './form-radio-group';
import { provideEgFormRadioGroupConfig } from './form-radio-group.token';

@Component({
  imports: [ReactiveFormsModule, EgFormRadioGroup],
  template: `<form [formGroup]="form">
    <eg-form-radio-group
      controlName="value"
      label="Plan"
      [disabled]="disabled()"
      [options]="options"
      error="Plan required"
      hint="Pick one"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly disabled = signal(false);
  readonly options = [
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Pro' },
  ];
}

@Component({
  imports: [ReactiveFormsModule, EgFormRadioGroup],
  template: `<form [formGroup]="form">
    <eg-form-radio-group
      controlName="value"
      label="Plan"
      [labelClass]="labelClass()"
      [groupClass]="groupClass()"
      [options]="options"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly groupClass = signal('');
  readonly options = [{ value: 'starter', label: 'Starter' }];
}

describe('EgFormRadioGroup', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('renders one radio per option with label, error, and hint', () => {
    const radios = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-radio')) as HTMLElement[];
    expect(radios().length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Plan');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Plan required');
    fixture.componentInstance.form.controls.value.setValue('pro');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Pick one');
  });

  it('writes user selection back to the control', () => {
    const inputs = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-radio input')) as HTMLInputElement[];
    expect(inputs().length).toBe(2);
    inputs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBe('pro');
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const inputs = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-radio input')) as HTMLInputElement[];
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(inputs().every((input) => input.disabled)).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(inputs().every((input) => input.disabled)).toBeTrue();
  });
});

describe('EgFormRadioGroup global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormRadioGroupConfig({ labelClass: 'tw:text-xs', groupClass: 'tw:gap-1' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('[hlmLabel]') as HTMLElement;
    const group = () => fixture.nativeElement.querySelector('hlm-radio-group') as HTMLElement;
    expect(label().className).toContain('tw:text-xs');
    expect(group().className).toContain('tw:gap-1');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.groupClass.set('tw:gap-4');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(group().className).toContain('tw:gap-4');
    expect(group().className).not.toContain('tw:gap-1');
  });
});
