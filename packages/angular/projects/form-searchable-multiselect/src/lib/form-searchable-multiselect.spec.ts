import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormSearchableMultiselect } from './form-searchable-multiselect';

@Component({
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `<form [formGroup]="form">
    <eg-form-searchable-multiselect
      controlName="value"
      label="Tags"
      [id]="id()"
      [disabled]="disabled()"
      error="Tags required"
      hint="Choose tags"
      [options]="options"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({
    value: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
  });
  readonly id = signal<string | undefined>('tags');
  readonly disabled = signal(false);
  readonly options = [{ value: 'angular', label: 'Angular' }];
}

describe('EgFormSearchableMultiselect', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated trigger IDs, label, error, and hint', () => {
    const trigger = () => fixture.nativeElement.querySelector('button[hlmpopovertrigger]') as HTMLButtonElement;
    expect(trigger().id).toBe('tags');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('tags');
    fixture.componentInstance.form.controls.value.setValue(['angular']);
    fixture.componentInstance.form.controls.value.setValue([]);
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-describedby')).toBe('tags-error');
    expect(fixture.nativeElement.querySelector('#tags-error').textContent).toContain('Tags required');
    fixture.componentInstance.form.controls.value.setValue(['angular']);
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-describedby')).toBe('tags-hint');
    expect(fixture.nativeElement.querySelector('#tags-hint').textContent).toContain('Choose tags');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(trigger().id).toMatch(/^eg-form-searchable-multiselect-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(trigger().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const trigger = () => fixture.nativeElement.querySelector('button[hlmpopovertrigger]') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(trigger().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(trigger().disabled).toBeTrue();
  });
});
