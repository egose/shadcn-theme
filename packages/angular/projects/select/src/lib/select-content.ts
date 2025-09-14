import { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';

import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmSelectContent], hlm-select-content',
  host: {
    '[class]': '_computedClass()',
    '[attr.data-state]': '_stateProvider?.state() ?? "open"',
    '[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
  },
})
export class HlmSelectContent {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly stickyLabels = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });
  protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
  protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

  protected readonly _computedClass = computed(() =>
    cn(
      'tw:border-border tw:bg-popover tw:text-popover-foreground tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:zoom-in-95 tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:relative tw:z-50 tw:w-full tw:min-w-[8rem] tw:overflow-hidden tw:rounded-md tw:border tw:p-1 tw:shadow-md tw:data-[side=bottom]:top-[2px] tw:data-[side=top]:bottom-[2px]',
      this.userClass(),
    ),
  );
}
