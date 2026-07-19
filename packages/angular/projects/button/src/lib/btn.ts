import { BrnButton } from '@spartan-ng/brain/button';
import { computed, Directive, input, signal } from '@angular/core';
import { type ClassValue } from 'clsx';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { buttonVariants, type ButtonVariants } from './button';
import { injectBrnButtonConfig } from './button.token';

@Directive({
  selector: 'button[hlmBtn], a[hlmBtn]',
  exportAs: 'hlmBtn',
  standalone: true,
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    '[class]': '_computedClass()',
    '[attr.type]': 'type()',
    'data-slot': 'button',
  },
})
export class HlmBtn {
  private readonly _config = injectBrnButtonConfig();
  private readonly _additionalClasses = signal<ClassValue>('');

  public readonly variant = input<ButtonVariants['variant']>(this._config.variant);
  public readonly size = input<ButtonVariants['size']>(this._config.size);
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly type = input<'button' | 'submit' | 'reset'>('button');

  protected readonly _computedClass = computed(() =>
    hlm(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
      }),
      this.userClass(),
      this._additionalClasses(),
    ),
  );

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }
}
