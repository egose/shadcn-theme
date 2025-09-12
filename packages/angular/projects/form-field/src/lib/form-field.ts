import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  input,
} from '@angular/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { EgError } from './error';

@Component({
  selector: 'eg-form-field',
  template: `
    <ng-content />

    @switch (_hasDisplayedMessage()) {
      @case ('error') {
        <ng-content select="eg-error" />
      }
      @default {
        <ng-content select="eg-hint" />
      }
    }
  `,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgFormField {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn('tw:block tw:space-y-2', this.userClass()));
  public readonly control = contentChild(BrnFormFieldControl);

  public readonly errorChildren = contentChildren(EgError);

  protected readonly _hasDisplayedMessage = computed<'error' | 'hint'>(() =>
    this.errorChildren() && this.errorChildren().length > 0 && this.control()?.errorState() ? 'error' : 'hint',
  );

  constructor() {
    effect(() => {
      if (!this.control()) {
        throw new Error('eg-form-field must contain a BrnFormFieldControl.');
      }
    });
  }
}
