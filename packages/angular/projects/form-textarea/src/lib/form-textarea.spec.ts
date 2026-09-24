import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormTextarea } from './form-textarea';
import { provideEgFormTextareaConfig } from './form-textarea.token';

@Component({
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `<form [formGroup]="form">
    <eg-form-textarea
      controlName="value"
      label="Notes"
      [id]="id()"
      [disabled]="disabled()"
      [class]="userClass()"
      error="Notes required"
      hint="Add details"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('notes');
  readonly disabled = signal(false);
  readonly userClass = signal('');
}

describe('EgFormTextarea', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(control().id).toBe('notes');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('notes');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('notes-error');
    expect(fixture.nativeElement.querySelector('#notes-error').textContent).toContain('Notes required');
    fixture.componentInstance.form.controls.value.setValue('Details');
    fixture.detectChanges();
    expect(control().getAttribute('aria-describedby')).toBe('notes-hint');
    expect(fixture.nativeElement.querySelector('#notes-hint').textContent).toContain('Add details');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-textarea-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('applies userClass to the host while keeping the full-width base', () => {
    const host = () => fixture.nativeElement.querySelector('eg-form-textarea') as HTMLElement;
    expect(host().className).toContain('tw:w-full');
    fixture.componentInstance.userClass.set('tw:max-w-xs');
    fixture.detectChanges();
    expect(host().className).toContain('tw:w-full');
    expect(host().className).toContain('tw:max-w-xs');
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `<form [formGroup]="form">
    <eg-form-textarea controlName="value" label="Notes" [labelClass]="labelClass()" [textareaClass]="textareaClass()" />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly textareaClass = signal('');
}

describe('EgFormTextarea global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormTextareaConfig({ labelClass: 'tw:text-xs', textareaClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.textareaClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().className).not.toContain('tw:text-xs');
  });
});
