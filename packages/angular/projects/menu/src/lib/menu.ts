import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnMenu } from '@spartan-ng/brain/menu';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const menuVariants = cva(
  'tw:bg-popover tw:text-popover-foreground tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:zoom-in-95 tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:z-50 tw:min-w-[8rem] tw:origin-top tw:overflow-y-auto tw:overflow-x-hidden tw:rounded-md tw:border tw:p-1 tw:shadow-md',
  {
    variants: {
      variant: {
        default: 'tw:my-0.5',
        menubar: 'tw:my-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
type MenuVariants = VariantProps<typeof menuVariants>;

@Component({
  selector: 'hlm-menu',
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [BrnMenu],
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenu {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm(menuVariants({ variant: this.variant() }), this.userClass()));

  public readonly variant = input<MenuVariants['variant']>('default');
}
