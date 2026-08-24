import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormDatePicker } from './form-date-picker';

@Component({
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `<form [formGroup]="form">
    <eg-form-date-picker
      controlName="value"
      label="Date"
      [id]="id()"
      [disabled]="disabled()"
      error="Date required"
      hint="Use the calendar"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl<Date | null>(null, Validators.required) });
  readonly id = signal<string | undefined>('date');
  readonly disabled = signal(false);
}

describe('EgFormDatePicker', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated input IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('hlm-date-picker-input input') as HTMLInputElement;
    expect(control().id).toBe('date');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('date');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('date-error');
    expect(fixture.nativeElement.querySelector('#date-error').textContent).toContain('Date required');
    fixture.componentInstance.form.controls.value.setValue(new Date(2026, 7, 23));
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('date-hint');
    expect(fixture.nativeElement.querySelector('#date-hint').textContent).toContain('Use the calendar');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-date-picker-.+-\d+$/);
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
});
