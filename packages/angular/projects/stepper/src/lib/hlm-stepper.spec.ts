import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, type ValidationErrors } from '@angular/forms';
import { form, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';
import { Subject, take } from 'rxjs';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmStep } from './hlm-step';
import { HlmStepHeader } from './hlm-step-header';
import { HlmStepper } from './hlm-stepper';
import { HlmStepperNext } from './hlm-stepper-button-next';
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
  imports: [ReactiveFormsModule, HlmStepper, HlmStep, HlmStepperNext],
  template: `
    <hlm-stepper [linear]="linear()" [animationsEnabled]="false">
      <hlm-step [stepControl]="hasControl() ? form : undefined" [optional]="optional()" label="Details">
        <form [formGroup]="form">
          <input formControlName="name" aria-label="Name" />
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <p data-error>Name is required</p>
          }
          <button hlmStepperNext type="button">Next</button>
        </form>
      </hlm-step>
      <hlm-step label="Review" [completed]="true"><p data-review>Review details</p></hlm-step>
    </hlm-stepper>
  `,
})
class NavigationStepperHost {
  readonly linear = signal(true);
  readonly optional = signal(false);
  readonly hasControl = signal(true);
  readonly form = new FormGroup({ name: new FormControl('', Validators.required) });
  readonly stepper = viewChild.required(HlmStepper);
}

// Keep ABH-04's completed-destination coverage alongside the unvisited-destination regressions below.
for (const path of ['direct next', 'rendered Next', 'header'] as const) {
  describe(`HlmStepper CDK navigation through ${path}`, () => {
    let fixture: ComponentFixture<NavigationStepperHost>;
    let host: NavigationStepperHost;
    let selectedIndices: number[];

    beforeEach(async () => {
      configureLibraryTestBed();
      await TestBed.configureTestingModule({ imports: [NavigationStepperHost] }).compileComponents();
      fixture = TestBed.createComponent(NavigationStepperHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
      selectedIndices = [];
      host.stepper().selectedIndexChange.subscribe((index) => selectedIndices.push(index));
    });
    afterEach(() => fixture.destroy());

    function advance(allowed = true): void {
      fixture.detectChanges();
      if (path === 'direct next') {
        host.stepper().next();
      } else if (path === 'rendered Next') {
        const button = fixture.nativeElement.querySelector('button[hlmStepperNext]') as HTMLButtonElement;
        expect(button.disabled).toBeFalse();
        button.click();
      } else {
        const header = fixture.nativeElement.querySelectorAll('hlm-step-header')[1] as HTMLElement;
        expect(header.getAttribute('aria-disabled')).toBe(allowed ? null : 'true');
        expect(header.getAttribute('data-disabled')).toBe(allowed ? null : 'true');
        header.click();
      }
      fixture.detectChanges();
    }

    function expectSelection(index: number): void {
      expect(host.stepper().selectedIndex).toBe(index);
      expect(selectedIndices).toEqual(index === 0 ? [] : [1]);
      expect(host.stepper().steps.first.interacted).toBeTrue();
      expect(fixture.nativeElement.querySelector('[data-review]') !== null).toBe(index === 1);
      const headers = fixture.nativeElement.querySelectorAll('hlm-step-header');
      expect(headers[index].getAttribute('aria-selected')).toBe('true');
    }

    function expectTouchFeedback(): void {
      // Headers preserve CDK interaction semantics; only Next adds form touching.
      expect(host.form.touched).toBe(path !== 'header');
      expect(host.form.controls.name.touched).toBe(path !== 'header');
    }

    function startPendingValidation(): Subject<ValidationErrors | null> {
      const result = new Subject<ValidationErrors | null>();
      host.form.controls.name.setAsyncValidators(() => result.pipe(take(1)));
      host.form.controls.name.setValue('Ada');
      expect(host.form.pending).toBeTrue();
      expect(host.form.invalid).toBeFalse();
      return result;
    }

    it('skips an optional invalid step and preserves Next touch feedback', () => {
      host.optional.set(true);
      advance();
      expectSelection(1);
      expect(host.form.invalid).toBeTrue();
      expectTouchFeedback();
    });

    it('honors explicit completion of an invalid required step', () => {
      host.stepper().steps.first.completed = true;
      advance();
      expectSelection(1);
      expect(host.form.invalid).toBeTrue();
      expectTouchFeedback();
    });

    it('blocks a required invalid step, then advances after correction', () => {
      advance(false);
      expectSelection(0);
      expectTouchFeedback();
      expect(fixture.nativeElement.querySelector('[data-error]') !== null).toBe(path !== 'header');

      host.form.controls.name.setValue('Ada');
      advance();
      expectSelection(1);
    });

    it('blocks required pending validation, then advances after it resolves valid', () => {
      const result = startPendingValidation();
      advance(false);
      expectSelection(0);
      expect(host.form.pending).toBeTrue();
      expectTouchFeedback();

      result.next(null);
      result.complete();
      expect(host.form.valid).toBeTrue();
      advance();
      expectSelection(1);
    });

    it('keeps blocking when required pending validation resolves invalid', () => {
      const result = startPendingValidation();
      advance(false);
      expectSelection(0);
      result.next({ unavailable: true });
      result.complete();
      expect(host.form.invalid).toBeTrue();
      advance(false);
      expectSelection(0);
      expectTouchFeedback();
    });

    it('permits an optional pending step', () => {
      const result = startPendingValidation();
      host.optional.set(true);
      advance();
      expectSelection(1);
      expect(host.form.pending).toBeTrue();
      result.complete();
    });

    it('honors explicit completion while validation is pending', () => {
      const result = startPendingValidation();
      host.stepper().steps.first.completed = true;
      advance();
      expectSelection(1);
      expect(host.form.pending).toBeTrue();
      result.complete();
    });

    it('permits invalid required steps in non-linear mode', () => {
      host.linear.set(false);
      advance();
      expectSelection(1);
      expect(host.form.invalid).toBeTrue();
      expectTouchFeedback();
    });

    it('permits pending required steps in non-linear mode', () => {
      const result = startPendingValidation();
      host.linear.set(false);
      advance();
      expectSelection(1);
      expect(host.form.pending).toBeTrue();
      expectTouchFeedback();
      result.complete();
    });

    it('uses explicit completion when no step control is supplied', () => {
      host.hasControl.set(false);
      host.stepper().steps.first.completed = false;
      advance(false);
      expectSelection(0);
      expect(host.form.untouched).toBeTrue();

      host.stepper().steps.first.completed = true;
      advance();
      expectSelection(1);
      expect(host.form.untouched).toBeTrue();
    });

    it('preserves CDK control precedence when completed is explicitly false', () => {
      host.stepper().steps.first.completed = false;
      host.form.controls.name.setValue('Ada');
      advance();
      expectSelection(1);
      expect(host.stepper().steps.first.completed).toBeFalse();
    });
  });
}

@Component({
  imports: [HlmStepper, HlmStep],
  template: `
    <hlm-stepper [linear]="linear()" [orientation]="orientation()" [animationsEnabled]="false">
      <hlm-step [stepControl]="useSignalControl() ? fields.name : hasControl() ? first : undefined" label="Details">
        <p>Details</p>
      </hlm-step>
      <hlm-step [stepControl]="middle" label="Options"><p>Options</p></hlm-step>
      <hlm-step [stepControl]="last" label="Review"><p>Review</p></hlm-step>
    </hlm-stepper>
  `,
})
class HeaderEligibilityHost {
  readonly linear = signal(true);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly hasControl = signal(true);
  readonly first = new FormControl('Ada', Validators.required);
  readonly useSignalControl = signal(false);
  readonly signalModel = signal({ name: '' });
  readonly fields = form(this.signalModel, (path) => required(path.name));
  readonly middle = new FormControl('Ready', Validators.required);
  readonly last = new FormControl('', Validators.required);
  readonly stepper = viewChild.required(HlmStepper);
}

for (const orientation of ['horizontal', 'vertical'] as const) {
  for (const path of ['click', 'Enter', 'Space'] as const) {
    describe(`HlmStepper ${orientation} header eligibility through ${path}`, () => {
      let fixture: ComponentFixture<HeaderEligibilityHost>;
      let host: HeaderEligibilityHost;
      let selectedIndices: number[];

      beforeEach(async () => {
        configureLibraryTestBed();
        await TestBed.configureTestingModule({ imports: [HeaderEligibilityHost] }).compileComponents();
        fixture = TestBed.createComponent(HeaderEligibilityHost);
        host = fixture.componentInstance;
        host.orientation.set(orientation);
        fixture.detectChanges();
        selectedIndices = [];
        host.stepper().selectedIndexChange.subscribe((index) => selectedIndices.push(index));
      });
      afterEach(() => fixture.destroy());

      function render(): void {
        host.stepper()._stateChanged();
        fixture.detectChanges();
      }

      function headers(): HTMLElement[] {
        return Array.from(fixture.nativeElement.querySelectorAll('hlm-step-header'));
      }

      function key(header: HTMLElement, name: string, keyCode: number): void {
        header.dispatchEvent(new KeyboardEvent('keydown', { key: name, keyCode, bubbles: true, cancelable: true }));
        fixture.detectChanges();
      }

      function expectEligibility(index: number, allowed: boolean): void {
        render();
        const header = headers()[index];
        expect(header.getAttribute('aria-disabled'))
          .withContext('ARIA eligibility')
          .toBe(allowed ? null : 'true');
        expect(header.getAttribute('data-disabled'))
          .withContext('pointer styling eligibility')
          .toBe(allowed ? null : 'true');
        const component = fixture.debugElement.queryAll(By.directive(HlmStepHeader))[index]
          .componentInstance as HlmStepHeader;
        expect(component.disabled()).toBe(!allowed);
        expect(component.active()).toBe(allowed);
      }

      function activate(index: number, allowed: boolean): void {
        expectEligibility(index, allowed);
        const previous = host.stepper().selectedIndex;
        const before = [...selectedIndices];
        if (path === 'click') {
          // Synthetic clicks also exercise CDK's guard even when pointer CSS suppresses real clicks.
          headers()[index].click();
        } else {
          headers()[previous].focus();
          key(headers()[previous], 'Home', 36);
          for (let i = 0; i < index; i++) {
            key(
              headers()[i],
              orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown',
              orientation === 'horizontal' ? 39 : 40,
            );
          }
          expect(document.activeElement).toBe(headers()[index]);
          expect(headers()[index].tabIndex).toBe(0);
          expect(host.stepper().selectedIndex).withContext('arrows only move focus').toBe(previous);
          key(headers()[index], path === 'Enter' ? 'Enter' : ' ', path === 'Enter' ? 13 : 32);
        }
        fixture.detectChanges();
        const expected = allowed ? index : previous;
        expect(host.stepper().selectedIndex).toBe(expected);
        expect(selectedIndices).toEqual(allowed && index !== previous ? [...before, index] : before);
        expect(headers()[expected].getAttribute(orientation === 'horizontal' ? 'aria-selected' : 'aria-current')).toBe(
          orientation === 'horizontal' ? 'true' : 'step',
        );
        expect([host.first.touched, host.middle.touched, host.last.touched]).toEqual([false, false, false]);
      }

      function pending(control: FormControl): Subject<ValidationErrors | null> {
        const result = new Subject<ValidationErrors | null>();
        control.setAsyncValidators(() => result.pipe(take(1)));
        control.updateValueAndValidity();
        expect(control.pending).toBeTrue();
        return result;
      }

      it('enables an unvisited incomplete destination without mutating interaction during rendering', () => {
        expectEligibility(1, true);
        expect(host.stepper().steps.get(1)!.completed).toBeFalse();
        expect(
          host
            .stepper()
            .steps.toArray()
            .map((step) => step.interacted),
        ).toEqual([false, false, false]);
        expect(selectedIndices).toEqual([]);
        activate(1, true);
        expect(host.stepper().steps.first.interacted).toBeTrue();
        // The destination's own invalid control does not prevent entering it.
        activate(2, true);
      });

      it('blocks invalid predecessors even for explicitly completed destinations and recovers after correction', async () => {
        host.first.setValue('');
        host.stepper().steps.get(1)!.completed = true;
        activate(1, false);
        host.first.setValue('Ada');
        await fixture.whenStable();
        expect(headers()[1].getAttribute('aria-disabled')).toBeNull();
        activate(1, true);
      });

      it('blocks pending predecessors, then updates when validation resolves valid', async () => {
        const result = pending(host.first);
        activate(1, false);
        result.next(null);
        result.complete();
        await fixture.whenStable();
        expect(headers()[1].getAttribute('aria-disabled')).toBeNull();
        activate(1, true);
      });

      it('keeps a predecessor blocked when pending validation resolves invalid', () => {
        const result = pending(host.first);
        activate(1, false);
        result.next({ unavailable: true });
        result.complete();
        activate(1, false);
      });

      for (const exception of ['optional', 'completed'] as const) {
        it(`allows ${exception} invalid and pending predecessors`, () => {
          host.first.setValue('');
          host.stepper().steps.first[exception] = true;
          activate(1, true);
          const result = pending(host.middle);
          host.stepper().steps.get(1)![exception] = true;
          activate(2, true);
          result.complete();
        });
      }

      it('blocks skipping a valid but unvisited required intermediate step', () => {
        activate(2, false);
        expect(host.stepper().steps.get(1)!.interacted).toBeFalse();
        activate(1, true);
        activate(2, true);
      });

      for (const exception of ['optional', 'completed'] as const) {
        it(`allows skipping a step marked ${exception}`, () => {
          host.middle.setValue('');
          host.stepper().steps.get(1)![exception] = true;
          activate(2, true);
        });
      }

      it('allows leaving a default control-less current step but honors explicit false and true', () => {
        host.hasControl.set(false);
        expectEligibility(1, true);
        expect(host.stepper().steps.first.interacted).toBeFalse();
        host.stepper().steps.first.completed = false;
        activate(1, false);
        host.stepper().steps.first.completed = true;
        activate(1, true);
      });

      it('actually leaves a default control-less current step on its first attempt', () => {
        host.hasControl.set(false);
        activate(1, true);
      });

      it('gives a valid control precedence over explicit completion false', () => {
        host.stepper().steps.first.completed = false;
        activate(1, true);
      });

      it('preserves default versus explicit control-less completion after reset', () => {
        host.hasControl.set(false);
        activate(1, true);
        host.stepper().reset();
        activate(1, true);
        host.stepper().steps.first.completed = true;
        host.stepper().reset();
        activate(1, false);
        expect(host.stepper().steps.first.completed).toBeFalse();
      });

      it('previews real Signal Field validation without touching the field', async () => {
        host.useSignalControl.set(true);
        activate(1, false);
        expect(host.fields.name().touched()).toBeFalse();
        host.signalModel.set({ name: 'Ada' });
        await fixture.whenStable();
        expect(headers()[1].getAttribute('aria-disabled')).toBeNull();
        activate(1, true);
        expect(host.fields.name().touched()).toBeFalse();
      });

      if (path === 'click') {
        it('detaches status subscriptions when controls are removed or the step is destroyed', () => {
          host.hasControl.set(false);
          render();
          const changed = spyOn(host.stepper(), '_stateChanged').and.callThrough();
          host.first.setValue('');
          expect(changed).not.toHaveBeenCalled();
          host.hasControl.set(true);
          render();
          changed.calls.reset();
          host.first.setValue('Ada');
          expect(changed).toHaveBeenCalledTimes(1);
          fixture.destroy();
          changed.calls.reset();
          host.first.setValue('');
          expect(changed).not.toHaveBeenCalled();
        });
      }

      for (const linear of [true, false]) {
        it(`honors backward editable in ${linear ? 'linear' : 'non-linear'} mode, regardless of current validity`, () => {
          host.linear.set(linear);
          activate(1, true);
          host.middle.setValue('');
          host.stepper().steps.first.editable = false;
          activate(0, false);
          host.stepper().steps.first.editable = true;
          activate(0, true);
        });
      }

      it('checks earlier predecessors even for backward navigation, not the destination control', () => {
        activate(1, true);
        activate(2, true);
        host.first.setValue('');
        activate(1, false);
        host.first.setValue('Ada');
        host.middle.setValue('');
        activate(1, true);
      });

      it('ignores invalid, pending and unvisited predecessors in non-linear mode', () => {
        host.linear.set(false);
        host.first.setValue('');
        const result = pending(host.middle);
        activate(2, true);
        result.complete();
      });

      it('keeps the selected header enabled as a no-op in either orientation', () => {
        host.first.setValue('');
        host.stepper().steps.first.editable = false;
        activate(0, true);
        expect(host.stepper().steps.first.interacted).toBeFalse();
      });
    });
  }
}

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
