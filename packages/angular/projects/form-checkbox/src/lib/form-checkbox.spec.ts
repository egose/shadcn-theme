import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormCheckbox } from './form-checkbox';

@Component({
  imports: [ReactiveFormsModule, EgFormCheckbox],
  template: `<form [formGroup]="form">
    <eg-form-checkbox
      controlName="value"
      label="Accept"
      [controlId]="id()"
      [disabled]="disabled()"
      error="Acceptance required"
      hint="Review terms"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({
    value: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
  readonly id = signal<string | undefined>('accept');
  readonly disabled = signal(false);
}

describe('EgFormCheckbox', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('uses one explicit/generated ID for checkbox, label, error, and hint', () => {
    const control = () =>
      fixture.nativeElement.querySelector('brn-checkbox button[role="checkbox"]') as HTMLButtonElement;
    expect(control().id).toBe('accept');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('accept');
    fixture.componentInstance.form.controls.value.setValue(true);
    fixture.componentInstance.form.controls.value.setValue(false);
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('accept-error');
    expect(fixture.nativeElement.querySelector('#accept-error').textContent).toContain('Acceptance required');
    fixture.componentInstance.form.controls.value.setValue(true);
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('accept-hint');
    expect(fixture.nativeElement.querySelector('#accept-hint').textContent).toContain('Review terms');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-checkbox-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () =>
      fixture.nativeElement.querySelector('brn-checkbox button[role="checkbox"]') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });
});
