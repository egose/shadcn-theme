import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnResizableHandle } from '@spartan-ng/brain/resizable';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-resizable-handle',
  exportAs: 'hlmResizableHandle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnResizableHandle, inputs: ['withHandle', 'disabled'] }],
  host: {
    'data-slot': 'resizable-handle',
  },
  template: `
    @if (_brnResizableHandle.withHandle()) {
      <div class="tw:bg-border tw:h-6 tw:w-1 tw:rounded-lg tw:z-10 tw:flex tw:shrink-0"></div>
    }
  `,
})
export class HlmResizableHandle {
  protected readonly _brnResizableHandle = inject(BrnResizableHandle);

  constructor() {
    classes(() => [
      'tw:bg-border tw:ring-offset-background tw:focus-visible:ring-ring tw:relative tw:flex tw:w-px tw:items-center tw:justify-center tw:after:absolute tw:after:inset-y-0 tw:after:left-1/2 tw:after:w-1 tw:after:-translate-x-1/2 tw:focus-visible:ring-1 tw:focus-visible:outline-hidden tw:data-[panel-group-direction=vertical]:h-px tw:data-[panel-group-direction=vertical]:w-full tw:data-[panel-group-direction=vertical]:after:left-0 tw:data-[panel-group-direction=vertical]:after:h-1 tw:data-[panel-group-direction=vertical]:after:w-full tw:data-[panel-group-direction=vertical]:after:translate-x-0 tw:data-[panel-group-direction=vertical]:after:-translate-y-1/2 tw:[&[data-panel-group-direction=vertical]>div]:rotate-90',
      'tw:data-[panel-group-direction=horizontal]:hover:cursor-ew-resize tw:data-[panel-group-direction=vertical]:hover:cursor-ns-resize',
    ]);
  }
}
