import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormSelect } from './form-select';

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
