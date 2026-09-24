import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormSelect } from './form-select';
import { provideEgFormSelectConfig } from './form-select.token';

@Component({
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `<form [formGroup]="form">
    <eg-form-select
      controlName="value"
      label="Role"
      [id]="id()"
      [disabled]="disabled()"
      error="Role required"
      hint="Choose one"
      [options]="options"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('role');
  readonly disabled = signal(false);
  readonly options = [{ value: 'admin', label: 'Admin' }];
}

describe('EgFormSelect', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated trigger IDs, label, error, and hint', () => {
    const trigger = () => fixture.nativeElement.querySelector('hlm-select-trigger button') as HTMLButtonElement;
    expect(trigger().id).toBe('role');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('role');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-describedby')).toBe('role-error');
    expect(fixture.nativeElement.querySelector('#role-error').textContent).toContain('Role required');
    fixture.componentInstance.form.controls.value.setValue('admin');
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-describedby')).toBe('role-hint');
    expect(fixture.nativeElement.querySelector('#role-hint').textContent).toContain('Choose one');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(trigger().id).toMatch(/^eg-form-select-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(trigger().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const trigger = () => fixture.nativeElement.querySelector('hlm-select-trigger button') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(trigger().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(trigger().disabled).toBeTrue();
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `<form [formGroup]="form">
    <eg-form-select
      controlName="value"
      label="Role"
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
  readonly options = [{ value: 'admin', label: 'Admin' }];
}

describe('EgFormSelect global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormSelectConfig({ labelClass: 'tw:text-xs', selectClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    // selectClass binds HlmSelectTrigger's `class` input alias and lands on its inner button.
    const trigger = () => fixture.nativeElement.querySelector('hlm-select-trigger button') as HTMLButtonElement;
    expect(label().className).toContain('tw:text-xs');
    expect(trigger().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.selectClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(trigger().className).toContain('tw:text-lg');
    expect(trigger().className).not.toContain('tw:text-xs');
  });
});
