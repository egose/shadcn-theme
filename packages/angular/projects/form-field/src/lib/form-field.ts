import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DoCheck,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';
import { BrnField, BrnFieldControl } from '@spartan-ng/brain/field';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { HlmError } from './error';

@Component({
  selector: 'hlm-form-field',
  template: `
    <ng-content />

    @switch (_hasDisplayedMessage()) {
      @case ('error') {
        <ng-content select="hlm-error" />
      }
      @default {
        <ng-content select="hlm-hint" />
      }
    }
  `,
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  hostDirectives: [BrnField],
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmFormField implements DoCheck {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('tw:block tw:space-y-2', this.userClass()));
  public readonly control = contentChild(BrnFieldControl);

  public readonly errorChildren = contentChildren(HlmError);

  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _ngForm = inject(NgForm, { optional: true });
  /**
   * Tracks parent submit state. `FormGroupDirective.submitted` / `NgForm.submitted`
   * are plain booleans (not signals), so mirror them into a signal via `ngDoCheck`
   * to keep `_hasDisplayedMessage` reactive under OnPush.
   */
  protected readonly _submitted = signal(false);

  ngDoCheck(): void {
    const submitted = !!this._formGroupDirective?.submitted || !!this._ngForm?.submitted;
    if (this._submitted() !== submitted) this._submitted.set(submitted);
  }

  protected readonly _hasDisplayedMessage = computed<'error' | 'hint'>(() => {
    const ctrl = this.control();
    const errors = ctrl?.errors();
    const hasErrors = !!errors && Object.keys(errors).length > 0;
    const interacted = !!ctrl?.touched() || !!ctrl?.dirty() || this._submitted();
    return this.errorChildren() && this.errorChildren().length > 0 && hasErrors && interacted ? 'error' : 'hint';
  });

  constructor() {
    effect(() => {
      if (!this.control()) {
        throw new Error('hlm-form-field must contain a BrnFieldControl.');
      }
    });
  }
}
