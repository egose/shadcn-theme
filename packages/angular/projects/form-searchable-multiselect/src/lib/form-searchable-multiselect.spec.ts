import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormSearchableMultiselect } from './form-searchable-multiselect';
import { provideEgFormSearchableMultiselectConfig } from './form-searchable-multiselect.token';
import { SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `<form [formGroup]="form">
    <eg-form-searchable-multiselect
      controlName="value"
      label="Tags"
      [id]="id()"
      [disabled]="disabled()"
      [class]="userClass()"
      error="Tags required"
      hint="Choose tags"
      [options]="options()"
      searchLabel="Find tags"
      searchPlaceholder="Filter tags…"
      emptyMessage="No tags found"
      [removeLabel]="removeLabel"
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
  readonly userClass = signal('');
  readonly options = signal([{ value: 'angular', label: 'Angular' }]);
  readonly removeLabel = (option: SelectOption) => `Unassign ${option.label}`;
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

  it('forwards search copy and preserves async form assignments across filters, locks and reset', async () => {
    const host = fixture.componentInstance;
    const control = host.form.controls.value;
    host.options.set([]);
    control.setValue(['missing', 'angular']);
    await fixture.whenStable();
    const changes = jasmine.createSpy('valueChanges');
    control.valueChanges.subscribe(changes);
    (fixture.nativeElement.querySelector('button[hlmpopovertrigger]') as HTMLButtonElement).click();
    await fixture.whenStable();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const search = overlay.querySelector<HTMLInputElement>('input[type="search"]')!;
    const searchFor = async (value: string) => {
      search.value = value;
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
    };
    const options = () => Array.from(overlay.querySelectorAll<HTMLButtonElement>('[role="checkbox"]'));
    expect(search.labels![0].textContent).toContain('Find tags');
    expect(search.placeholder).toBe('Filter tags…');
    expect(overlay.querySelector('[role="status"]')!.textContent).toContain('No tags found');
    await searchFor('react');
    host.options.set([
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React' },
    ]);
    await fixture.whenStable();
    expect(options().length).toBe(1);
    expect(fixture.nativeElement.querySelector('button[aria-label="Unassign Angular"]')).not.toBeNull();
    expect(changes).not.toHaveBeenCalled();
    expect(control.untouched).toBeTrue();
    options()[0].click();
    await fixture.whenStable();
    expect(control.value).toEqual(['missing', 'angular', 'react']);
    expect(changes).toHaveBeenCalledOnceWith(['missing', 'angular', 'react']);
    expect(control.touched).toBeTrue();
    await searchFor('angular');
    expect(options()[0].getAttribute('aria-checked')).toBe('true');
    host.disabled.set(true);
    await fixture.whenStable();
    expect(search.disabled).toBeTrue();
    options()[0].click();
    await searchFor('no-match');
    expect(options().length).toBe(1);
    expect(changes).toHaveBeenCalledTimes(1);
    host.disabled.set(false);
    control.disable({ emitEvent: false });
    await fixture.whenStable();
    expect(search.disabled).toBeTrue();
    control.enable({ emitEvent: false });
    await fixture.whenStable();
    expect(search.disabled).toBeFalse();
    control.reset();
    await fixture.whenStable();
    expect(options()[0].getAttribute('aria-checked')).toBe('false');
    expect(control.value).toEqual([]);
    expect(control.untouched).toBeTrue();
    expect(changes.calls.allArgs()).toEqual([[['missing', 'angular', 'react']], [[]]]);
    await searchFor('');
    expect(options().length).toBe(2);
    expect(changes).toHaveBeenCalledTimes(2);
  });

  it('applies userClass to the host while keeping the full-width base', () => {
    const host = () => fixture.nativeElement.querySelector('eg-form-searchable-multiselect') as HTMLElement;
    expect(host().className).toContain('tw:w-full');
    fixture.componentInstance.userClass.set('tw:max-w-xs');
    fixture.detectChanges();
    expect(host().className).toContain('tw:w-full');
    expect(host().className).toContain('tw:max-w-xs');
  });

  it('keeps async assignments through relabeling and chip edits, then renders external writes and reset', async () => {
    const host = fixture.componentInstance;
    const control = host.form.controls.value;
    const values = Object.freeze(['missing', 'angular']) as unknown as string[];
    host.options.set([]);
    control.setValue(values);
    await fixture.whenStable();
    const changes = jasmine.createSpy('valueChanges');
    control.valueChanges.subscribe(changes);
    expect(fixture.nativeElement.textContent).toContain('2 selected');
    host.options.set([{ value: 'angular', label: 'Angular updated' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Angular updated');
    expect(changes).not.toHaveBeenCalled();
    expect(control.untouched).toBeTrue();
    const chips = fixture.nativeElement.querySelectorAll('eg-searchable-multiselect button:not([hlmpopovertrigger])');
    (chips[1] as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(control.value).toEqual(['missing']);
    expect(control.touched).toBeTrue();
    expect(changes).toHaveBeenCalledOnceWith(['missing']);
    expect(values).toEqual(['missing', 'angular']);
    control.setValue(['angular']);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Angular updated');
    expect(fixture.nativeElement.textContent).not.toContain('missing');
    control.reset();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('0 selected');
    expect(control.untouched).toBeTrue();
    expect(changes.calls.allArgs()).toEqual([[['missing']], [['angular']], [[]]]);
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `<form [formGroup]="form">
    <eg-form-searchable-multiselect
      controlName="value"
      label="Tags"
      [labelClass]="labelClass()"
      [controlClass]="controlClass()"
      [options]="options"
    />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl<string[]>([]) });
  readonly labelClass = signal('');
  readonly controlClass = signal('');
  readonly options = [{ value: 'angular', label: 'Angular' }];
}

describe('EgFormSearchableMultiselect global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([
      provideEgFormSearchableMultiselectConfig({ labelClass: 'tw:text-xs', controlClass: 'tw:text-xs' }),
    ]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    // controlClass binds EgSearchableMultiselect's `class` input alias and lands on its host.
    const control = () => fixture.nativeElement.querySelector('eg-searchable-multiselect') as HTMLElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.controlClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:text-lg');
    expect(control().className).not.toContain('tw:text-xs');
  });
});
