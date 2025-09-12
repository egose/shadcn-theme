import { Directive, computed, input } from '@angular/core';
import { BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egTabsTrigger]',
  hostDirectives: [{ directive: BrnTabsTrigger, inputs: ['brnTabsTrigger: egTabsTrigger', 'disabled'] }],
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgTabsTrigger {
  public readonly triggerFor = input.required<string>({ alias: 'egTabsTrigger' });
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:data-[state=active]:bg-background tw:dark:data-[state=active]:text-foreground tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:focus-visible:outline-ring tw:dark:data-[state=active]:border-input tw:dark:data-[state=active]:bg-input/30 tw:text-foreground tw:dark:text-muted-foreground tw:inline-flex tw:h-[calc(100%-1px)] tw:flex-1 tw:items-center tw:justify-center tw:gap-1.5 tw:whitespace-nowrap tw:rounded-md tw:border tw:border-transparent tw:px-2 tw:py-1 tw:text-sm tw:font-medium tw:transition-[color,box-shadow] tw:focus-visible:outline-1 tw:focus-visible:ring-[3px] tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:data-[state=active]:shadow-sm tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0 tw:[&_ng-icon]:text-base',
      this.userClass(),
    ),
  );
}
