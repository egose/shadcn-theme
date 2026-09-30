import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrnSlider } from '@spartan-ng/brain/slider';
import { configureLibraryTestBed, settleDom } from '../../../../test/setup';
import { EgFormSlider } from './form-slider';
import { provideEgFormSliderConfig } from './form-slider.token';
import { expectDescriptions, verifyValidationDescriptions } from '../../../../test/validation-descriptions';

@Component({
  imports: [ReactiveFormsModule, EgFormSlider],
  template: `<form [formGroup]="form">
    <eg-form-slider
      controlName="value"
      label="Volume"
      [min]="0"
      [max]="100"
      [step]="5"
      [disabled]="disabled()"
      [id]="id()"
      [hint]="hint()"
      [aria-describedby]="descriptions()"
      error="Choose a minimum of 30"
      required
    />
    <p id="volume-external">External volume instructions</p>
  </form>`,
})
class Host {
  readonly form = new FormGroup({
    value: new FormControl<number[]>([20], {
      nonNullable: true,
      validators: (control) => (control.value[0] < 30 ? { min: true } : null),
    }),
  });
  readonly disabled = signal(false);
  readonly id = signal('volume');
  readonly hint = signal<string | undefined>('Drag the thumb');
  readonly descriptions = signal<string | null>(null);
}

@Component({
  imports: [ReactiveFormsModule, EgFormSlider],
  template: `<form [formGroup]="form">
    <eg-form-slider controlName="value" label="Volume" [labelClass]="labelClass()" [sliderClass]="sliderClass()" />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl<number[]>([20]) });
  readonly labelClass = signal('');
  readonly sliderClass = signal('');
}

describe('EgFormSlider', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('describes every focusable thumb with the visible hint', () => {
    fixture.componentInstance.form.controls.value.setValue([20, 80]);
    fixture.detectChanges();
    const thumbs = Array.from(fixture.nativeElement.querySelectorAll('[role="slider"]')) as HTMLElement[];
    expect(thumbs.length).toBe(2);
    const hint = fixture.nativeElement.querySelector('hlm-hint') as HTMLElement;
    for (const thumb of thumbs) expect(thumb.getAttribute('aria-describedby')).toBe(hint.id);
  });

  for (const interaction of ['touch', 'submit'] as const) {
    it(`keeps both thumbs described through ${interaction}, correction and reset`, async () => {
      fixture.componentInstance.form.controls.value.setValue([20, 80]);
      fixture.detectChanges();
      // Focus requires measured thumbs; the focused runner does not load Tailwind CSS.
      for (const thumb of fixture.nativeElement.querySelectorAll('[role="slider"]') as NodeListOf<HTMLElement>) {
        thumb.style.display = 'inline-block';
        thumb.style.width = '16px';
        thumb.style.height = '16px';
      }
      await settleDom();
      await settleDom();
      fixture.detectChanges();
      await verifyValidationDescriptions(
        fixture,
        () => Array.from(fixture.nativeElement.querySelectorAll('[role="slider"]')),
        fixture.componentInstance.form.controls.value,
        [40, 80],
        interaction,
      );
    });
  }

  it('merges external descriptions across thumb-count, hint and ID changes', () => {
    const host = fixture.componentInstance;
    const thumbs = () => Array.from(fixture.nativeElement.querySelectorAll('[role="slider"]')) as HTMLElement[];
    host.descriptions.set('volume-external volume-external');
    host.form.markAllAsTouched();
    fixture.detectChanges();
    expectDescriptions(thumbs(), ['volume-external', 'volume-error']);
    host.form.controls.value.setValue([20, 80]);
    host.id.set('new-volume');
    host.hint.set(undefined);
    fixture.detectChanges();
    expect(thumbs().length).toBe(2);
    expectDescriptions(thumbs(), ['volume-external', 'new-volume-error']);
    for (const thumb of thumbs()) expect(thumb.getAttribute('aria-labelledby')).toBe('new-volume-label');
    host.form.controls.value.setValue([40]);
    host.descriptions.set(null);
    fixture.detectChanges();
    expect(thumbs().length).toBe(1);
    expectDescriptions(thumbs(), []);
  });

  const slider = () => fixture.debugElement.query(By.css('hlm-slider')).injector.get(BrnSlider);

  it('wires the label to the slider and forwards min/max/step', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(slider().min()).toBe(0);
    expect(slider().max()).toBe(100);
    expect(slider().step()).toBe(5);
    expect(slider().ariaLabelledby()).toBe(label().id);
    expect(fixture.nativeElement.querySelector('[role="slider"]').getAttribute('aria-labelledby')).toBe(label().id);
  });

  it('writes control values through to the slider', () => {
    fixture.componentInstance.form.controls.value.setValue([40]);
    fixture.detectChanges();
    expect(slider().value()).toEqual([40]);
  });

  it('honors wrapper and reactive-form disabled state', () => {
    const host = () => fixture.nativeElement.querySelector('hlm-slider') as HTMLElement;
    expect(host().hasAttribute('data-disabled')).toBeFalse();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(host().hasAttribute('data-disabled')).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(host().hasAttribute('data-disabled')).toBeTrue();
  });
});

describe('EgFormSlider global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormSliderConfig({ labelClass: 'tw:text-xs', sliderClass: 'tw:opacity-90' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const control = () => fixture.nativeElement.querySelector('hlm-slider') as HTMLElement;
    expect(label().className).toContain('tw:text-xs');
    expect(control().className).toContain('tw:opacity-90');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.sliderClass.set('tw:opacity-100');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(control().className).toContain('tw:opacity-100');
    expect(control().className).not.toContain('tw:opacity-90');
  });
});
