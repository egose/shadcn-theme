import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { HlmComboboxMultiple, HlmCombobox } from '@egose/shadcn-theme-ng/combobox';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormCombobox } from './form-combobox';
import { provideEgFormComboboxConfig } from './form-combobox.token';
import { expectDescriptions, verifyValidationDescriptions } from '../../../../test/validation-descriptions';

@Component({
  imports: [ReactiveFormsModule, EgFormCombobox],
  template: `<form [formGroup]="form">
    <eg-form-combobox
      controlName="value"
      label="Tags"
      [id]="id()"
      [disabled]="disabled()"
      [options]="options"
      error="Pick at least one"
      [hint]="hint()"
      [aria-describedby]="descriptions()"
      [required]="required()"
    />
    <p id="tags-external">External tag instructions</p>
  </form>`,
})
class Host {
  readonly form = new FormGroup({
    value: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
  });
  readonly id = signal<string | undefined>('tags');
  readonly disabled = signal(false);
  readonly options = ['Angular', 'React', 'Vue'];
  readonly hint = signal<string | undefined>('Add tags');
  readonly descriptions = signal<string | null>(null);
  readonly required = signal(true);
}

@Component({
  imports: [ReactiveFormsModule, EgFormCombobox],
  template: `<form [formGroup]="form">
    <eg-form-combobox
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
  readonly options = ['Angular'];
}

describe('EgFormCombobox', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('describes the multiple-mode chip input with the visible hint', () => {
    const control = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(control.getAttribute('aria-describedby')).toBe('tags-hint');
  });

  for (const interaction of ['touch', 'submit'] as const) {
    it(`keeps the multiple input described through ${interaction}, correction and reset`, async () => {
      await verifyValidationDescriptions(
        fixture,
        () => [fixture.nativeElement.querySelector('input')],
        fixture.componentInstance.form.controls.value,
        ['Angular'],
        interaction,
      );
    });
  }

  it('preserves multiple-mode consumer descriptions across hint, ID and required changes', () => {
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    host.descriptions.set('tags-external tags-external');
    host.form.markAllAsTouched();
    fixture.detectChanges();
    expectDescriptions([input], ['tags-external', 'tags-error']);
    expect(input.getAttribute('aria-required')).toBe('true');
    host.id.set('new-tags');
    host.hint.set(undefined);
    host.required.set(false);
    fixture.detectChanges();
    expectDescriptions([input], ['tags-external', 'new-tags-error']);
    expect(input.labels?.[0].htmlFor).toBe('new-tags');
    expect(input.getAttribute('aria-required')).toBeNull();
    host.form.controls.value.setValue(['Angular']);
    host.descriptions.set(null);
    fixture.detectChanges();
    expectDescriptions([input], []);
  });

  it('renders one item per option with label, error, and hint', async () => {
    // Portaled content only renders once the popover opens; open programmatically.
    fixture.debugElement.query(By.directive(HlmComboboxMultiple)).injector.get(BrnPopover).open();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    // Portaled content renders in the overlay container outside the fixture element.
    const items = () => Array.from(document.querySelectorAll('hlm-combobox-item')) as HTMLElement[];
    const texts = () => items().map((item) => item.textContent?.trim());
    expect(items().length).toBeGreaterThanOrEqual(3);
    for (const option of ['Angular', 'React', 'Vue']) {
      expect(texts()).toContain(option);
    }
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('tags');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Pick at least one');
    fixture.componentInstance.form.controls.value.setValue(['Angular']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-hint').textContent).toContain('Add tags');
  });

  it('renders selected values as chips', () => {
    const chips = () => Array.from(fixture.nativeElement.querySelectorAll('hlm-combobox-chip')) as HTMLElement[];
    expect(chips().length).toBe(0);
    fixture.componentInstance.form.controls.value.setValue(['Angular', 'Vue']);
    fixture.detectChanges();
    expect(chips().length).toBe(2);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const control = () => fixture.nativeElement.querySelector('input[hlmComboboxChipInput]') as HTMLInputElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(control().disabled).toBeTrue();
  });
});

describe('EgFormCombobox global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormComboboxConfig({ labelClass: 'tw:text-xs', controlClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('hlm-combobox-multiple') as HTMLElement;
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

@Component({
  imports: [ReactiveFormsModule, EgFormCombobox],
  template: `<form [formGroup]="form">
    <eg-form-combobox
      controlName="value"
      label="Fruit"
      mode="single"
      [id]="id()"
      [options]="options"
      error="Fruit required"
      [hint]="hint()"
      [aria-describedby]="descriptions()"
      [required]="required()"
    />
    <p id="single-external">External choice instructions</p>
  </form>`,
})
class SingleHost {
  readonly form = new FormGroup({ value: new FormControl<string | null>(null, Validators.required) });
  readonly options = ['Apple', 'Banana', 'Cherry'];
  readonly id = signal('single-fruit');
  readonly hint = signal<string | undefined>('Pick one');
  readonly descriptions = signal<string | null>(null);
  readonly required = signal(true);
}

describe('EgFormCombobox single mode', () => {
  let fixture: ComponentFixture<SingleHost>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [SingleHost] }).compileComponents();
    fixture = TestBed.createComponent(SingleHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('describes the single-mode trigger with the visible hint', () => {
    const control = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const hint = fixture.nativeElement.querySelector('hlm-hint') as HTMLElement;
    expect(control.getAttribute('aria-describedby')).toBe(hint.id);
  });

  const trigger = () => fixture.nativeElement.querySelector('hlm-combobox-trigger button') as HTMLButtonElement;
  const search = () => document.querySelector('hlm-combobox-input input') as HTMLInputElement;
  async function open() {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(search()).not.toBeNull();
  }

  for (const interaction of ['touch', 'submit'] as const) {
    it(`keeps trigger and portaled search described through ${interaction}, correction and reset`, async () => {
      await open();
      search().focus();
      expect(document.activeElement).toBe(search());
      // Moving focus outside closes the popup; exercise its live descriptions while it stays open.
      await verifyValidationDescriptions(
        fixture,
        () => [trigger(), search()],
        fixture.componentInstance.form.controls.value,
        'Apple',
        interaction,
        false,
        () => [trigger()],
      );
      expect(trigger().id).not.toBe(search().id);
      expect(trigger().labels?.[0].htmlFor).toBe(trigger().id);
      expect(search().getAttribute('aria-labelledby')).toBe('single-fruit-label');
      expect(search().getAttribute('aria-invalid')).toBeNull();
    });
  }

  it('updates external descriptions and conditional IDs on both open single-mode controls', async () => {
    await open();
    const host = fixture.componentInstance;
    host.descriptions.set('single-external single-external');
    host.form.markAllAsTouched();
    fixture.detectChanges();
    expectDescriptions([trigger(), search()], ['single-external', 'single-fruit-error']);
    expect(trigger().getAttribute('aria-required')).toBe('true');
    // The popup search filters options; required/invalid belong to the selected-value trigger.
    expect(search().getAttribute('aria-required')).toBeNull();
    host.id.set('new-single');
    host.hint.set(undefined);
    host.required.set(false);
    fixture.detectChanges();
    expectDescriptions([trigger(), search()], ['single-external', 'new-single-error']);
    expect(trigger().id).toBe('new-single');
    expect(search().id).toBe('new-single-search');
    expect(search().getAttribute('aria-labelledby')).toBe('new-single-label');
    for (const element of [trigger(), search()]) expect(element.getAttribute('aria-required')).toBeNull();
    host.form.controls.value.setValue('Apple');
    host.descriptions.set(null);
    fixture.detectChanges();
    expectDescriptions([trigger(), search()], []);
  });

  it('shows the selected value in the trigger', () => {
    const trigger = () => fixture.nativeElement.querySelector('hlm-combobox-trigger button') as HTMLButtonElement;
    expect(trigger().textContent).toContain('Pick…');
    fixture.componentInstance.form.controls.value.setValue('Banana');
    fixture.detectChanges();
    expect(trigger().textContent).toContain('Banana');
  });

  it('writes an item selection back to the control', async () => {
    fixture.debugElement.query(By.directive(HlmCombobox)).injector.get(BrnPopover).open();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    const items = () => Array.from(document.querySelectorAll('hlm-combobox-item')) as HTMLElement[];
    expect(items().length).toBeGreaterThanOrEqual(3);
    items()
      .find((item) => item.textContent?.trim() === 'Cherry')
      ?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.value.value).toBe('Cherry');
  });

  it('honors wrapper disabled state on the trigger', () => {
    const trigger = () => fixture.nativeElement.querySelector('hlm-combobox-trigger button') as HTMLButtonElement;
    expect(trigger().disabled).toBeFalse();
  });
});
