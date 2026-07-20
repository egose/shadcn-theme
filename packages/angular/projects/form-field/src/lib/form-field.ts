import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  input,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
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
export class HlmFormField {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('tw:block tw:space-y-2', this.userClass()));
  public readonly control = contentChild(BrnFieldControl);

  public readonly errorChildren = contentChildren(HlmError);

  protected readonly _hasDisplayedMessage = computed<'error' | 'hint'>(() => {
    const errors = this.control()?.errors();
    const hasErrors = !!errors && Object.keys(errors).length > 0;
    return this.errorChildren() && this.errorChildren().length > 0 && hasErrors ? 'error' : 'hint';
  });

  constructor() {
    effect(() => {
      if (!this.control()) {
        throw new Error('hlm-form-field must contain a BrnFieldControl.');
      }
    });
  }
}
