import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkStep } from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  contentChild,
  DestroyRef,
  effect,
  inject,
  input,
  untracked,
  ViewContainerRef,
  type TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Subscription } from 'rxjs';
import { HlmStepContent } from './hlm-step-content';
import { HlmStepLabel } from './hlm-step-label';
import type { HlmStepTooltipPosition } from './stepper.token';

@Component({
  selector: 'hlm-step',
  exportAs: 'hlmStep',
  imports: [CdkPortalOutlet],
  providers: [
    {
      provide: CdkStep,
      useExisting: HlmStep,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hidden: '',
  },
  template: `
    <ng-template>
      <ng-content></ng-content>
      <ng-template [cdkPortalOutlet]="portal"></ng-template>
    </ng-template>
  `,
})
export class HlmStep extends CdkStep {
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);
  private _hasCompletionOverride = false;
  private _controlSubscription?: Subscription;

  override ngOnChanges(): void {
    super.ngOnChanges();
    this._controlSubscription?.unsubscribe();
    const control = this.stepControl;
    if (control && typeof control !== 'function') {
      // Classic form status getters are not reactive template dependencies, unlike Signal Fields.
      this._controlSubscription = control.statusChanges
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => this._stepper._stateChanged());
    }
  }

  override get completed(): boolean {
    return super.completed;
  }

  override set completed(value: boolean) {
    // Track input presence through the supported accessor, not CDK's internal override field.
    this._hasCompletionOverride = value != null;
    super.completed = value;
  }

  /** @internal Read-only preview of CDK's predecessor check after leaving the current step. */
  public _canExit(leaving: boolean): boolean {
    if (this.optional || this.completed) {
      return true;
    }

    const interacted = this.interacted || leaving;
    const control = this.stepControl;
    if (!control) {
      return interacted && !this._hasCompletionOverride;
    }

    const invalid = typeof control === 'function' ? control().invalid() : control.invalid;
    const pending = typeof control === 'function' ? control().pending() : control.pending;
    return interacted && !invalid && !pending;
  }

  public readonly icon = input<string | null>(null);

  /** Styled header tooltip override. Falls back to the full string label when unset. */
  public readonly tooltip = input<string | TemplateRef<unknown> | null>(null);
  public readonly tooltipPosition = input<HlmStepTooltipPosition>('bottom');
  public readonly tooltipDisabled = input(false, { transform: booleanAttribute });

  /** Content for step label given by `<ng-template hlmStepLabel>`. */
  public readonly stepLabelContent = contentChild(HlmStepLabel);

  /** Content that will be rendered lazily. */
  private readonly _lazyContent = contentChild(HlmStepContent);

  /** Currently-attached portal containing the lazy content. */
  public portal: TemplatePortal<unknown> | null = null;

  constructor() {
    super();

    effect(() => {
      const isSelected = this.isSelected();
      const lazyContent = this._lazyContent();

      untracked(() => {
        if (isSelected && lazyContent && !this.portal) {
          this.portal = new TemplatePortal(lazyContent.template, this._viewContainerRef);
        }
      });
    });

    this._destroyRef.onDestroy(() => {
      if (this.portal?.isAttached) {
        this.portal.detach();
      }
    });
  }
}
