import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormAutocomplete } from './form-autocomplete';
import { provideEgFormAutocompleteConfig } from './form-autocomplete.token';

@Component({
  imports: [ReactiveFormsModule, EgFormAutocomplete],
  template: `<form [formGroup]="form">
    <eg-form-autocomplete
      controlName="value"
      label="Fruit"
      [id]="id()"
      [disabled]="disabled()"
      [options]="options"
      error="Fruit required"
      hint="Type a fruit"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('fruit');
  readonly disabled = signal(false);
  readonly options = ['Apple', 'Banana', 'Cherry'];
}

@Component({
  imports: [ReactiveFormsModule, EgFormAutocomplete],
  template: `<form [formGroup]="form">
    <eg-form-autocomplete
      controlName="value"
      label="Fruit"
      [labelClass]="labelClass()"
      [inputClass]="inputClass()"
      [options]="options"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly inputClass = signal('');
  readonly options = ['Apple'];
}

describe('EgFormAutocomplete', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('renders one item per option with label, error, and hint', () => {
    const items = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-autocomplete-item')) as HTMLElement[];
    expect(items().length).toBe(3);
    const control = () => fixture.nativeElement.querySelector('hlm-autocomplete-input input') as HTMLInputElement;
    expect(control().id).toBe('fruit');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('fruit');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Fruit required');
    fixture.componentInstance.form.controls.value.setValue('Apple');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Type a fruit');
  });

  it('writes an item selection back to the control', () => {
    const items = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-autocomplete-item')) as HTMLElement[];
    expect(items().length).toBe(3);
    items()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBe('Banana');
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-autocomplete-input input') as HTMLInputElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });
});

describe('EgFormAutocomplete global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormAutocompleteConfig({ labelClass: 'tw:text-xs', inputClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('hlm-autocomplete-input') as HTMLElement;
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
