import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormToggleGroup } from './form-toggle-group';
import { provideEgFormToggleGroupConfig } from './form-toggle-group.token';

@Component({
  imports: [ReactiveFormsModule, EgFormToggleGroup],
  template: `<form [formGroup]="form">
    <eg-form-toggle-group
      controlName="value"
      label="Align"
      [disabled]="disabled()"
      [options]="options"
      error="Pick one"
      hint="Choose alignment"
      required
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly disabled = signal(false);
  readonly options = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];
}

@Component({
  imports: [ReactiveFormsModule, EgFormToggleGroup],
  template: `<form [formGroup]="form">
    <eg-form-toggle-group
      controlName="value"
      label="Align"
      [labelClass]="labelClass()"
      [groupClass]="groupClass()"
      [options]="options"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly groupClass = signal('');
  readonly options = [{ value: 'left', label: 'Left' }];
}

describe('EgFormToggleGroup', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('renders one item per option with label, error, and hint', () => {
    const items = () =>
      Array.from(fixture.nativeElement.querySelectorAll('button[hlmToggleGroupItem]')) as HTMLButtonElement[];
    expect(items().length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Align');
    // Flap validity so the status-driven error switch re-evaluates.
    fixture.componentInstance.form.controls.value.setValue('center');
    fixture.componentInstance.form.controls.value.setValue('');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Pick one');
    fixture.componentInstance.form.controls.value.setValue('center');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Choose alignment');
  });

  it('writes user selection back to the control', () => {
    const items = () =>
      Array.from(fixture.nativeElement.querySelectorAll('button[hlmToggleGroupItem]')) as HTMLButtonElement[];
    items()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBe('center');
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const items = () =>
      Array.from(fixture.nativeElement.querySelectorAll('button[hlmToggleGroupItem]')) as HTMLButtonElement[];
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(items().every((item) => item.disabled)).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(items().every((item) => item.disabled)).toBeTrue();
  });
});

describe('EgFormToggleGroup global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormToggleGroupConfig({ labelClass: 'tw:text-xs', groupClass: 'tw:gap-1' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('[hlmLabel]') as HTMLElement;
    const group = () => fixture.nativeElement.querySelector('hlm-toggle-group') as HTMLElement;
    expect(label().className).toContain('tw:text-xs');
    expect(group().className).toContain('tw:gap-1');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.groupClass.set('tw:gap-4');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(group().className).toContain('tw:gap-4');
    expect(group().className).not.toContain('tw:gap-1');
  });
});
