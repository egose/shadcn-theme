import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, signal } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HlmTooltip } from '@egose/shadcn-theme-ng/tooltip';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { cva } from 'class-variance-authority';
import { tap } from 'rxjs/operators';
import { HlmStep } from './hlm-step';
import { HlmStepHeader } from './hlm-step-header';
import {
  injectHlmStepperConfig,
  type HlmStepTooltipPosition,
  type HlmStepperHeaderPosition,
  type HlmStepperIndicatorMode,
  type HlmStepperLabelPosition,
} from './stepper.token';

const stepTransition = cva('', {
  variants: {
    motion: {
      none: '',
      'enter-forward': 'tw:animate-in tw:fade-in tw:slide-in-from-right-8 tw:fill-mode-both',
      'enter-backward': 'tw:animate-in tw:fade-in tw:slide-in-from-left-8 tw:fill-mode-both',
      'leave-forward':
        'tw:animate-out tw:fade-out tw:slide-out-to-left-8 tw:fill-mode-both tw:absolute tw:top-0 tw:right-0 tw:left-0',
      'leave-backward':
        'tw:animate-out tw:fade-out tw:slide-out-to-right-8 tw:fill-mode-both tw:absolute tw:top-0 tw:right-0 tw:left-0',
      'enter-bottom':
        'tw:animate-in tw:fade-in tw:slide-in-from-bottom-2 tw:fill-mode-both tw:duration-400 tw:[animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)]',
    },
  },
  defaultVariants: { motion: 'none' },
});

@Component({
  selector: 'hlm-stepper',
  imports: [CdkStepperModule, NgTemplateOutlet, HlmStepHeader, HlmTooltip],
  providers: [{ provide: CdkStepper, useExisting: HlmStepper }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (orientation) {
      @case ('horizontal') {
        <div class="tw:flex tw:w-full tw:flex-col tw:gap-6">
          @if (headerPosition() === 'top') {
            <ng-container [ngTemplateOutlet]="horizontalStepsTemplate" [ngTemplateOutletContext]="{ steps: steps }" />
            <ng-container [ngTemplateOutlet]="horizontalPanelTemplate" />
          } @else {
            <ng-container [ngTemplateOutlet]="horizontalPanelTemplate" />
            <ng-container [ngTemplateOutlet]="horizontalStepsTemplate" [ngTemplateOutletContext]="{ steps: steps }" />
          }
        </div>
      }

      @case ('vertical') {
        <div class="tw:flex tw:w-full tw:flex-col tw:gap-3">
          @for (step of steps; track step; let i = $index) {
            <div class="tw:flex tw:flex-col tw:gap-2">
              <ng-container [ngTemplateOutlet]="stepHeaderTemplate" [ngTemplateOutletContext]="{ step: step }" />

              <div
                [class]="_gridContainerClass(selectedIndex === i)"
                [style.transition-duration.ms]="animationDuration()"
              >
                <section
                  [class]="_verticalStepClass(!$last, i)"
                  role="region"
                  [id]="_getStepContentId(i)"
                  [attr.aria-labelledby]="_getStepLabelId(i)"
                >
                  <ng-container [ngTemplateOutlet]="step.content" />
                </section>
              </div>

              @if (!$last) {
                <div class="tw:ms-4 tw:h-6 tw:w-px" aria-hidden="true">
                  <span [class]="_connectorClass(step.index())"></span>
                </div>
              }
            </div>
          }
        </div>
      }
    }

    <ng-template #stepHeaderTemplate let-step="step">
      <hlm-step-header
        cdkStepHeader
        class="tw:min-w-0"
        (click)="step.select()"
        (keydown)="_onKeydown($event)"
        [tabIndex]="_getFocusIndex() === step.index() ? 0 : -1"
        [id]="_getStepLabelId(step.index())"
        [attr.role]="orientation === 'horizontal' ? 'tab' : 'button'"
        [attr.aria-posinset]="orientation === 'horizontal' ? step.index() + 1 : null"
        [attr.aria-setsize]="orientation === 'horizontal' ? steps.length : null"
        [attr.aria-selected]="orientation === 'horizontal' ? step.isSelected() : null"
        [attr.aria-current]="orientation === 'vertical' && step.isSelected() ? 'step' : null"
        [attr.aria-expanded]="orientation === 'vertical' ? step.isSelected() : null"
        [attr.aria-controls]="_getStepContentId(step.index())"
        [attr.aria-label]="step.ariaLabel || null"
        [attr.aria-labelledby]="!step.ariaLabel && step.ariaLabelledby ? step.ariaLabelledby : null"
        [attr.aria-disabled]="!step.isNavigable() || (orientation === 'vertical' && step.isSelected()) ? 'true' : null"
        [index]="step.index()"
        [state]="step.indicatorType()"
        [label]="step.stepLabelContent() || step.label"
        [selected]="step.isSelected()"
        [reached]="step.index() < selectedIndex"
        [active]="step.isNavigable()"
        [optional]="step.optional"
        [errorMessage]="step.errorMessage"
        [disabled]="linear && !step.isNavigable()"
        [labelPosition]="orientation === 'horizontal' ? labelPosition() : 'end'"
        [indicatorMode]="indicatorMode()"
        [icon]="stepIcon(step)"
        [hlmTooltip]="_headerTooltip(step)"
        [position]="_headerTooltipPosition(step)"
        [tooltipDisabled]="_headerTooltipDisabled(step)"
      />
    </ng-template>

    <ng-template #horizontalStepsTemplate let-steps="steps">
      <ol
        class="tw:flex tw:w-full tw:items-center"
        role="tablist"
        aria-orientation="horizontal"
        [attr.aria-label]="stepperAriaLabelledby() ? null : (stepperAriaLabel() ?? null)"
        [attr.aria-labelledby]="stepperAriaLabelledby()"
      >
        @for (step of steps; track step) {
          <li class="tw:flex tw:min-w-0 tw:items-center">
            <ng-container [ngTemplateOutlet]="stepHeaderTemplate" [ngTemplateOutletContext]="{ step: step }" />
          </li>

          @if (!$last) {
            <li class="tw:mx-3 tw:flex tw:min-w-8 tw:flex-1 tw:items-center" aria-hidden="true">
              <span class="tw:bg-border tw:relative tw:h-px tw:w-full tw:overflow-hidden tw:rounded">
                <span
                  class="tw:bg-primary tw:absolute tw:inset-y-0 tw:inset-s-0 tw:transition-[width] tw:duration-200"
                  [style.width.%]="step.index() < selectedIndex ? 100 : 0"
                ></span>
              </span>
            </li>
          }
        }
      </ol>
    </ng-template>

    <ng-template #horizontalPanelTemplate>
      <div class="tw:relative tw:min-h-0 tw:overflow-hidden">
        @for (activeIndex of [selectedIndex]; track activeIndex) {
          <section
            role="tabpanel"
            [id]="_getStepContentId(activeIndex)"
            [attr.aria-labelledby]="_getStepLabelId(activeIndex)"
            [style.animation-duration.ms]="animationDuration()"
            [animate.enter]="animationsEnabled() ? _enterAnimationClass() : ''"
            [animate.leave]="animationsEnabled() ? _leaveAnimationClass() : ''"
          >
            <ng-container [ngTemplateOutlet]="steps.get(activeIndex)?.content" />
          </section>
        }
      </div>
    </ng-template>
  `,
})
export class HlmStepper extends CdkStepper {
  private readonly _config = injectHlmStepperConfig();

  public readonly labelPosition = input<HlmStepperLabelPosition>('end');
  public readonly headerPosition = input<HlmStepperHeaderPosition>('top');
  public readonly indicatorMode = input<HlmStepperIndicatorMode>(this._config.defaultIndicatorMode);
  public readonly stepperAriaLabel = input<string | null>('Progress');
  public readonly stepperAriaLabelledby = input<string | null>(null);
  public readonly animationsEnabled = input(this._config.animationEnabled, { transform: booleanAttribute });
  public readonly animationDuration = input(this._config.animationDuration, { transform: numberAttribute });

  protected readonly _animationDirection = signal<'forward' | 'backward'>('forward');
  protected readonly _hasSelectionChanged = signal(false);

  constructor() {
    super();

    this.selectionChange
      .pipe(
        tap((event) => {
          if (event.previouslySelectedIndex >= 0 && event.selectedIndex !== event.previouslySelectedIndex) {
            this._hasSelectionChanged.set(true);
          }
          this._animationDirection.set(event.selectedIndex < event.previouslySelectedIndex ? 'backward' : 'forward');
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  override next(): void {
    const stepControl = this.selected?.stepControl;

    if (stepControl && typeof stepControl !== 'function') {
      // Classic reactive-forms control: surface validation errors before a denied linear transition.
      // Signal `Field` controls expose validity through invocation and need no touch pass.
      stepControl.markAllAsTouched();
      stepControl.updateValueAndValidity();
    }

    const invalid =
      !!stepControl && (typeof stepControl === 'function' ? stepControl().invalid() : stepControl.invalid);
    if (this.linear && invalid) {
      return;
    }

    super.next();
  }

  protected stepIcon(step: CdkStep): string | null {
    return step instanceof HlmStep ? step.icon() : null;
  }

  protected _headerTooltip(step: CdkStep): string | TemplateRef<void> | null {
    const override = step instanceof HlmStep ? step.tooltip() : null;
    if (override === null || override === undefined) {
      return step.label || null;
    }
    // BrnTooltip types templates as TemplateRef<void>; any template renders the same at runtime.
    return override as string | TemplateRef<void> | null;
  }

  protected _headerTooltipPosition(step: CdkStep): HlmStepTooltipPosition {
    return step instanceof HlmStep ? step.tooltipPosition() : 'bottom';
  }

  protected _headerTooltipDisabled(step: CdkStep): boolean {
    if (step instanceof HlmStep && step.tooltipDisabled()) {
      return true;
    }
    return !this._headerTooltip(step);
  }

  protected _enterAnimationClass(): string {
    if (!this._hasSelectionChanged()) {
      return '';
    }
    return stepTransition({ motion: this._animationDirection() === 'forward' ? 'enter-forward' : 'enter-backward' });
  }

  protected _leaveAnimationClass(): string {
    if (!this._hasSelectionChanged()) {
      return '';
    }
    return stepTransition({ motion: this._animationDirection() === 'forward' ? 'leave-forward' : 'leave-backward' });
  }

  protected _gridContainerClass(expanded: boolean): string {
    return hlm(
      'tw:grid',
      expanded ? 'tw:grid-rows-[1fr]' : 'tw:grid-rows-[0fr]',
      this.animationsEnabled() && 'tw:transition-[grid-template-rows]',
    );
  }

  protected _connectorClass(index: number): string {
    return hlm(
      'tw:block tw:h-full tw:w-px tw:transition-colors tw:duration-200 tw:motion-reduce:transition-none',
      index < this.selectedIndex ? 'tw:bg-primary' : 'tw:bg-border',
    );
  }

  protected _verticalStepClass(showConnector: boolean, index: number): string {
    return hlm(
      'tw:ms-4 tw:overflow-hidden tw:ps-6',
      showConnector && 'tw:border-s',
      this.animationsEnabled() && this.selectedIndex === index && stepTransition({ motion: 'enter-bottom' }),
    );
  }
}
