import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HlmDatePickerMulti, provideHlmDatePickerMultiConfig } from '@egose/shadcn-theme-ng/date-picker';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormDatePickerMulti } from './form-date-picker-multi';

@Component({
  imports: [ReactiveFormsModule, EgFormDatePickerMulti],
  template: `<form [formGroup]="form">
    <eg-form-date-picker-multi
      controlName="value"
      label="Holidays"
      [id]="id()"
      [disabled]="disabled()"
      [inputClass]="inputClass()"
      [readonly]="readonly()"
      [class]="userClass()"
      [autoCloseOnMaxSelection]="autoClose()"
      error="Pick at least one day"
      hint="Comma-separated days"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl<Date[] | null>(null, Validators.required) });
  readonly id = signal<string | undefined>('holidays');
  readonly disabled = signal(false);
  readonly inputClass = signal('');
  readonly readonly = signal(false);
  readonly userClass = signal('');
  readonly autoClose = signal(true);
}

@Component({
  imports: [ReactiveFormsModule, EgFormDatePickerMulti],
  template: `<form [formGroup]="form">
    <eg-form-date-picker-multi
      controlName="value"
      label="Holidays"
      [labelClass]="labelClass()"
      [inputClass]="inputClass()"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl<Date[] | null>(null) });
  readonly labelClass = signal('');
  readonly inputClass = signal('');
}

describe('EgFormDatePickerMulti', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated input IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-date-multi-input input') as HTMLInputElement;
    expect(control().id).toBe('holidays');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('holidays');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('holidays-error');
    expect(fixture.nativeElement.querySelector('#holidays-error').textContent).toContain('Pick at least one day');
    fixture.componentInstance.form.controls.value.setValue([new Date(2026, 7, 23)]);
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('holidays-hint');
    expect(fixture.nativeElement.querySelector('#holidays-hint').textContent).toContain('Comma-separated days');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-date-picker-multi-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('honors wrapper and reactive-form disabled state on every input action', () => {
    const controls = () => Array.from(fixture.nativeElement.querySelectorAll('input, button')) as HTMLInputElement[];
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(controls().every((control) => control.disabled)).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(controls().every((control) => control.disabled)).toBeTrue();
  });

  it('applies userClass to the host while keeping the full-width base', () => {
    const host = () => fixture.nativeElement.querySelector('eg-form-date-picker-multi') as HTMLElement;
    expect(host().className).toContain('tw:w-full');
    fixture.componentInstance.userClass.set('tw:max-w-xs');
    fixture.detectChanges();
    expect(host().className).toContain('tw:w-full');
    expect(host().className).toContain('tw:max-w-xs');
  });

  it('forwards inputClass, name, and readonly to the inner input', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-date-multi-input input') as HTMLInputElement;
    fixture.componentInstance.inputClass.set('tw:text-lg');
    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();
    expect(control().className).toContain('tw:text-lg');
    expect(control().readOnly).toBeTrue();
    expect(control().getAttribute('name')).toBe('value');
  });

  it('forwards autoCloseOnMaxSelection to the inner picker', () => {
    const picker = () =>
      fixture.debugElement.query(By.directive(HlmDatePickerMulti)).componentInstance as HlmDatePickerMulti<Date>;
    expect(picker().autoCloseOnMaxSelection()).toBeTrue();
    fixture.componentInstance.autoClose.set(false);
    fixture.detectChanges();
    expect(picker().autoCloseOnMaxSelection()).toBeFalse();
  });
});

describe('EgFormDatePickerMulti global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideHlmDatePickerMultiConfig({ labelClass: 'tw:text-xs', inputClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('hlm-date-multi-input input') as HTMLInputElement;
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
