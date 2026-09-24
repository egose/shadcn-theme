import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormToggle } from './form-toggle';
import { provideEgFormToggleConfig } from './form-toggle.token';

@Component({
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `<form [formGroup]="form">
    <eg-form-toggle
      formControlName="value"
      label="Notifications"
      [id]="id()"
      [disabled]="disabled()"
      error="Read the policy first"
      hint="Toggle to subscribe"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl(false, Validators.requiredTrue) });
  readonly id = signal<string | undefined>('notify');
  readonly disabled = signal(false);
}

@Component({
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `<form [formGroup]="form">
    <eg-form-toggle
      formControlName="value"
      label="Notifications"
      [labelClass]="labelClass()"
      [toggleClass]="toggleClass()"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl(false) });
  readonly labelClass = signal('');
  readonly toggleClass = signal('');
}

describe('EgFormToggle', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('aligns explicit/generated IDs, label, error, and hint', () => {
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    expect(control().id).toBe('notify');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('notify');
    // Flap validity so the status-driven error switch re-evaluates.
    fixture.componentInstance.form.controls.value.setValue(true);
    fixture.componentInstance.form.controls.value.setValue(false);
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Read the policy first');
    fixture.componentInstance.form.controls.value.setValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Toggle to subscribe');
    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(control().id).toMatch(/^eg-form-toggle-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(control().id);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });

  it('writes toggle changes back to the control', () => {
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    control().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBeTrue();
  });
});

describe('EgFormToggle global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormToggleConfig({ labelClass: 'tw:text-xs', toggleClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('button[hlmToggle]') as HTMLButtonElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.toggleClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().className).not.toContain('tw:text-xs');
  });
});
