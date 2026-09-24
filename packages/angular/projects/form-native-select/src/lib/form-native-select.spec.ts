import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormNativeSelect } from './form-native-select';
import { provideEgFormNativeSelectConfig } from './form-native-select.token';

@Component({
  imports: [ReactiveFormsModule, EgFormNativeSelect],
  template: `<form [formGroup]="form">
    <eg-form-native-select
      controlName="value"
      label="Country"
      [id]="id()"
      [disabled]="disabled()"
      [options]="options"
      error="Country required"
      hint="Choose one"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('country');
  readonly disabled = signal(false);
  readonly options = [
    { value: '', label: 'Select…' },
    { value: 'de', label: 'Germany' },
  ];
}

@Component({
  imports: [ReactiveFormsModule, EgFormNativeSelect],
  template: `<form [formGroup]="form">
    <eg-form-native-select
      controlName="value"
      label="Country"
      [labelClass]="labelClass()"
      [selectClass]="selectClass()"
      [options]="options"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly selectClass = signal('');
  readonly options = [{ value: 'de', label: 'Germany' }];
}

describe('EgFormNativeSelect', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated select IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(control().id).toBe('country');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('country');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('country-error');
    expect(fixture.nativeElement.querySelector('#country-error').textContent).toContain('Country required');
    fixture.componentInstance.form.controls.value.setValue('de');
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('country-hint');
    expect(fixture.nativeElement.querySelector('#country-hint').textContent).toContain('Choose one');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-native-select-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('forwards the control name to the native name attribute', () => {
    const control = () => fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(control().getAttribute('name')).toBe('value');
  });
});

describe('EgFormNativeSelect global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormNativeSelectConfig({ labelClass: 'tw:text-xs', selectClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.selectClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().className).not.toContain('tw:text-xs');
  });
});
