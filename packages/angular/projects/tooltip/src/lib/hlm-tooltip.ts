import { Directive } from '@angular/core';
import { BrnTooltip, BrnTooltipPosition, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { cva } from 'class-variance-authority';

export const DEFAULT_TOOLTIP_SVG_CLASS =
  'bg-foreground fill-foreground z-50 block size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]';

export const DEFAULT_TOOLTIP_CONTENT_CLASSES = hlm(
  'tw:data-open:animate-in data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 tw:data-[state=delayed-open]:zoom-in-95 tw:data-closed:animate-out data-closed:fade-out-0 tw:data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 tw:rounded-md tw:px-3 tw:py-1.5 tw:text-xs tw:bg-foreground tw:text-background tw:data-open:animate-in data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 tw:data-[state=delayed-open]:zoom-in-95 tw:data-closed:animate-out data-closed:fade-out-0 tw:data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 tw:z-50 tw:w-fit tw:origin-(--radix-tooltip-content-transform-origin) tw:text-balance',
);

export const tooltipPositionVariants = cva('tw:absolute', {
  variants: {
    position: {
      top: 'tw:bottom-0 tw:left-[calc(50%-5px)] tw:translate-y-full',
      bottom: 'tw:-top-2.5 tw:left-[calc(50%-5px)] tw:translate-y-0 tw:rotate-180',
      left: 'tw:-end-2.5 tw:top-[calc(50%-5px)] tw:translate-y-0 tw:rotate-270 tw:rtl:-rotate-270',
      right: 'tw:-start-2.5 tw:top-[calc(50%-5px)] tw:translate-y-0 tw:rotate-90 tw:rtl:-rotate-90',
    },
  },
});

@Directive({
  selector: '[hlmTooltip]',
  providers: [
    provideBrnTooltipDefaultOptions({
      svgClasses: DEFAULT_TOOLTIP_SVG_CLASS,
      tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES,
      arrowClasses: (position: BrnTooltipPosition) => hlm(tooltipPositionVariants({ position })),
    }),
  ],
  hostDirectives: [
    {
      directive: BrnTooltip,
      inputs: ['brnTooltip: hlmTooltip', 'position', 'hideDelay', 'showDelay', 'tooltipDisabled'],
    },
  ],
})
export class HlmTooltip {}
