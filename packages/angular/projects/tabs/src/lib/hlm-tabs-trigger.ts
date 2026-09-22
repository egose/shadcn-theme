import { Directive, input } from '@angular/core';
import { BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmTabsTrigger]',
  hostDirectives: [{ directive: BrnTabsTrigger, inputs: ['brnTabsTrigger: hlmTabsTrigger', 'disabled'] }],
  host: {
    'data-slot': 'tabs-trigger',
  },
})
export class HlmTabsTrigger {
  public readonly triggerFor = input.required<string>({ alias: 'hlmTabsTrigger' });
  constructor() {
    classes(() => [
      `tw:gap-1.5 tw:rounded-md tw:border tw:border-transparent tw:px-2 tw:py-1 tw:text-sm tw:font-medium tw:group-data-[variant=default]/tabs-list:data-active:shadow-sm tw:group-data-[variant=line]/tabs-list:data-active:shadow-none tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:focus-visible:outline-ring tw:text-foreground/60 tw:hover:text-foreground tw:dark:text-muted-foreground tw:dark:hover:text-foreground tw:relative tw:inline-flex tw:h-[calc(100%-1px)] tw:flex-1 tw:items-center tw:justify-center tw:whitespace-nowrap tw:transition-all tw:group-data-[orientation=vertical]/tabs:w-full tw:group-data-[orientation=vertical]/tabs:justify-start tw:focus-visible:ring-[3px] tw:focus-visible:outline-1 tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0`,
      'tw:group-data-[variant=line]/tabs-list:bg-transparent tw:group-data-[variant=line]/tabs-list:data-active:bg-transparent tw:dark:group-data-[variant=line]/tabs-list:data-active:border-transparent tw:dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
      'tw:data-active:bg-background tw:dark:data-active:text-foreground tw:dark:data-active:border-input tw:dark:data-active:bg-input/30 tw:data-active:text-foreground',
      'tw:after:bg-foreground tw:after:absolute tw:after:opacity-0 tw:after:transition-opacity tw:group-data-[orientation=horizontal]/tabs:after:inset-x-0 tw:group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] tw:group-data-[orientation=horizontal]/tabs:after:h-0.5 tw:group-data-[orientation=vertical]/tabs:after:inset-y-0 tw:group-data-[orientation=vertical]/tabs:after:-right-1 tw:group-data-[orientation=vertical]/tabs:after:w-0.5 tw:group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
    ]);
  }
}
