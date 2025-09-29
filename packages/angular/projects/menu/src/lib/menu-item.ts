import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { BrnMenuItem } from '@spartan-ng/brain/menu';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmMenuItem]',
  host: {
    '[class]': '_computedClass()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  hostDirectives: [
    {
      directive: BrnMenuItem,
      inputs: ['disabled: disabled'],
      outputs: ['triggered: triggered'],
    },
  ],
})
export class HlmMenuItem {
  public readonly variant = input<'default' | 'destructive'>('default');

  public readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      `tw:hover:bg-secondary tw:hover:text-secondary-foreground tw:data-[variant=destructive]:text-destructive tw:data-[variant=destructive]:focus:bg-destructive/10 tw:dark:data-[variant=destructive]:focus:bg-destructive/20 tw:data-[variant=destructive]:focus:text-destructive tw:data-[variant=destructive]:*:[ng-icon]:!text-destructive tw:[&_ng-icon]:text-muted-foreground tw:relative tw:flex tw:w-full tw:cursor-default tw:select-none tw:items-center tw:gap-2 tw:rounded-sm tw:px-2 tw:py-1.5 tw:text-sm tw:outline-none tw:data-[disabled]:pointer-events-none tw:data-[inset]:pl-8 tw:data-[disabled]:opacity-50 tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0`,
      this.userClass(),
    ),
  );
}
