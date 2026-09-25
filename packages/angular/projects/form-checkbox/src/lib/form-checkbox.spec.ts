import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormCheckbox } from './form-checkbox';
import { provideEgFormCheckboxConfig } from './form-checkbox.token';

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

  it('writes user toggles back to the control', () => {
    const control = () =>
      fixture.nativeElement.querySelector('brn-checkbox button[role="checkbox"]') as HTMLButtonElement;
    control().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBeTrue();
  });

  it('coerces the bare required attribute (shows the * marker)', () => {
    // `Host` binds `required` without a value; without boolean coercion the
    // input would stay '' (falsy) and the marker would never render.
    expect(fixture.nativeElement.querySelector('label span').textContent).toContain('*');
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormCheckbox],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <eg-form-checkbox
        controlName="value"
        label="Accept"
        controlId="accept-submit"
        error="Acceptance required"
        hint="Review terms"
        required
      />
      <button type="submit">Submit</button>
    </form>
  `,
})
class SubmitHost {
  readonly form = new FormGroup({
    value: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
  onSubmit() {}
}

describe('EgFormCheckbox submit behavior', () => {
  let fixture: ComponentFixture<SubmitHost>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [SubmitHost] }).compileComponents();
    fixture = TestBed.createComponent(SubmitHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('shows the error after submit even when the checkbox was never touched', () => {
    const control = () =>
      fixture.nativeElement.querySelector('brn-checkbox button[role="checkbox"]') as HTMLButtonElement;
    // Invalid from creation, but untouched and unsubmitted -> hint only, no error element.
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
    expect(control().getAttribute('aria-describedby')).toBe('accept-submit-hint');

    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#accept-submit-error').textContent).toContain('Acceptance required');
    expect(control().getAttribute('aria-describedby')).toBe('accept-submit-error');
  });

  it('clears the submit error once the checkbox becomes valid', () => {
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error')).not.toBeNull();

    fixture.componentInstance.form.controls.value.setValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormCheckbox],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <eg-form-checkbox controlName="value" label="Accept" controlId="accept-auto" hint="Review terms" required />
      <button type="submit">Submit</button>
    </form>
  `,
})
class AutoErrorSubmitHost {
  readonly form = new FormGroup({
    value: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
  onSubmit() {}
}

describe('EgFormCheckbox auto error on submit', () => {
  let fixture: ComponentFixture<AutoErrorSubmitHost>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [AutoErrorSubmitHost] }).compileComponents();
    fixture = TestBed.createComponent(AutoErrorSubmitHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('auto-resolves the requiredTrue message after submit without touching the control', () => {
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();

    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#accept-auto-error').textContent).toContain('Accept is required');
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormCheckbox],
  template: `<form [formGroup]="form">
    <eg-form-checkbox
      controlName="value"
      label="Accept"
      [labelClass]="labelClass()"
      [checkboxClass]="checkboxClass()"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl(false) });
  readonly labelClass = signal('');
  readonly checkboxClass = signal('');
}

describe('EgFormCheckbox global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormCheckboxConfig({ labelClass: 'tw:text-xs', checkboxClass: 'tw:size-3' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    // checkboxClass travels HlmCheckbox.userClass -> BrnCheckbox.class input -> inner button.
    const control = () =>
      fixture.nativeElement.querySelector('brn-checkbox button[role="checkbox"]') as HTMLButtonElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:size-3');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.checkboxClass.set('tw:size-5');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:size-5');
    expect(control().className).not.toContain('tw:size-3');
  });
});
