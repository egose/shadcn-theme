import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnResizableGroup, BrnResizableHandle, BrnResizablePanel } from '@spartan-ng/brain/resizable';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-resizable-page',
  imports: [DemoHeaderComponent, BrnResizableGroup, BrnResizableHandle, BrnResizablePanel, HlmResizableImports],
  template: `
    <app-demo-header title="Resizable" description="Draggable panels." />

    <div hlmResizableGroup class="tw:flex tw:h-[200px] tw:w-full tw:max-w-md tw:rounded-md tw:border">
      <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">One</div>
      <hlm-resizable-handle />
      <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">Two</div>
    </div>
  `,
})
export class ResizablePage {}
