import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmStep } from './hlm-step';
import { HlmStepHeader } from './hlm-step-header';
import { HlmStepper } from './hlm-stepper';
import { provideHlmStepperConfig } from './stepper.token';

@Component({
  imports: [ReactiveFormsModule, HlmStepper, HlmStep],
  template: `
    <hlm-stepper [linear]="linear()">
      <hlm-step [stepControl]="form" label="One">
        <p>First</p>
      </hlm-step>
      <hlm-step label="Two">
        <p>Second</p>
      </hlm-step>
    </hlm-stepper>
  `,
})
class StepperHost {
  readonly linear = signal(false);
  readonly form = new FormGroup({ name: new FormControl('', Validators.required) });
  readonly stepper = viewChild.required(HlmStepper);
}

describe('HlmStepper', () => {
  let fixture: ComponentFixture<StepperHost>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [StepperHost] }).compileComponents();
    fixture = TestBed.createComponent(StepperHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('advances and retreats with next() and previous()', () => {
    const stepper = fixture.componentInstance.stepper();
    expect(stepper.selectedIndex).toBe(0);
    stepper.next();
    expect(stepper.selectedIndex).toBe(1);
    stepper.previous();
    expect(stepper.selectedIndex).toBe(0);
  });

  it('denies linear next() while the step control is invalid and marks it touched', () => {
    fixture.componentInstance.linear.set(true);
    fixture.detectChanges();
    const stepper = fixture.componentInstance.stepper();
    stepper.next();
    expect(stepper.selectedIndex).toBe(0);
    expect(fixture.componentInstance.form.controls.name.touched).toBeTrue();

    fixture.componentInstance.form.controls.name.setValue('Ada');
    stepper.next();
    expect(stepper.selectedIndex).toBe(1);
  });

  it('selects a step when its header is clicked', () => {
    const headers = fixture.nativeElement.querySelectorAll('hlm-step-header') as NodeListOf<HTMLElement>;
    expect(headers.length).toBe(2);
    headers[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.stepper().selectedIndex).toBe(1);
  });
});

@Component({
  imports: [HlmStepper, HlmStep],
  providers: [provideHlmStepperConfig({ animationDuration: 123, defaultIndicatorMode: 'number' })],
  template: `
    <hlm-stepper>
      <hlm-step label="One"><p>First</p></hlm-step>
    </hlm-stepper>
  `,
})
class ConfiguredStepperHost {
  readonly stepper = viewChild.required(HlmStepper);
}

describe('provideHlmStepperConfig', () => {
  it('supplies animation defaults to the stepper and indicator defaults to headers', async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [ConfiguredStepperHost] }).compileComponents();
    const fixture = TestBed.createComponent(ConfiguredStepperHost);
    fixture.detectChanges();
    expect(fixture.componentInstance.stepper().animationDuration()).toBe(123);
    const header = fixture.debugElement.query(By.directive(HlmStepHeader)).componentInstance as HlmStepHeader;
    expect(header.indicatorMode()).toBe('number');
    fixture.destroy();
  });
});

@Component({
  imports: [HlmStepper, HlmStep],
  template: `
    <hlm-stepper>
      <hlm-step label="Account"><p>A</p></hlm-step>
      <hlm-step label="Profile" tooltip="Add a photo so teammates recognize you" tooltipPosition="right">
        <p>B</p>
      </hlm-step>
      <hlm-step label="Silent" [tooltipDisabled]="true"><p>C</p></hlm-step>
    </hlm-stepper>
  `,
})
class TooltipStepperHost {}

describe('HlmStepper header tooltips', () => {
  it('falls back to the full string label, prefers overrides, and honors tooltipDisabled', async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [TooltipStepperHost] }).compileComponents();
    const fixture = TestBed.createComponent(TooltipStepperHost);
    fixture.detectChanges();
    const tooltips = fixture.debugElement
      .queryAll(By.directive(BrnTooltip))
      .map((node) => node.injector.get(BrnTooltip));
    expect(tooltips.length).toBe(3);
    expect(tooltips[0].brnTooltip()).toBe('Account');
    expect(tooltips[0].tooltipDisabled()).toBeFalse();
    expect(tooltips[1].brnTooltip()).toBe('Add a photo so teammates recognize you');
    expect(tooltips[1].position()).toBe('right');
    expect(tooltips[2].tooltipDisabled()).toBeTrue();
    fixture.destroy();
  });
});
