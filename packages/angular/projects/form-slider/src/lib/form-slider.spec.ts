import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrnSlider } from '@spartan-ng/brain/slider';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormSlider } from './form-slider';
import { provideEgFormSliderConfig } from './form-slider.token';

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
      hint="Drag the thumb"
    />
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl<number[]>([20]) });
  readonly disabled = signal(false);
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

  const slider = () => fixture.debugElement.query(By.css('hlm-slider')).injector.get(BrnSlider);

  it('wires the label to the slider and forwards min/max/step', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(slider().min()).toBe(0);
    expect(slider().max()).toBe(100);
    expect(slider().step()).toBe(5);
    // BrnSlider accepts aria-labelledby but does not render it yet; assert the wiring at the instance level.
    expect(slider().ariaLabelledby()).toBe(label().id);
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
