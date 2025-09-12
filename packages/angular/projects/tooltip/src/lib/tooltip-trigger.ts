import { Directive } from '@angular/core';
import { BrnTooltipTrigger, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';

const DEFAULT_TOOLTIP_CONTENT_CLASSES =
  'tw:bg-primary tw:text-primary-foreground tw:animate-in tw:fade-in-0 tw:zoom-in-95 tw:z-50 tw:w-fit tw:rounded-md tw:px-3 tw:py-1.5 tw:text-xs tw:text-balance ' +
  'tw:data-[state=open]:animate-in ' +
  'tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95 ' +
  'tw:data-[side=below]:slide-in-from-top-2 tw:data-[side=above]:slide-in-from-bottom-2 ' +
  'tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 ';

@Directive({
  selector: '[egTooltipTrigger]',
  providers: [
    provideBrnTooltipDefaultOptions({
      showDelay: 150,
      hideDelay: 300,
      exitAnimationDuration: 150,
      tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES,
    }),
  ],
  hostDirectives: [
    {
      directive: BrnTooltipTrigger,
      inputs: [
        'brnTooltipDisabled: egTooltipDisabled',
        'brnTooltipTrigger: egTooltipTrigger',
        'aria-describedby',
        'position',
        'positionAtOrigin',
        'hideDelay',
        'showDelay',
        'exitAnimationDuration',
        'touchGestures',
      ],
    },
  ],
})
export class EgTooltipTrigger {}
