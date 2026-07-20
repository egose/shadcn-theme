import { Component } from '@angular/core';
import { BrnResizableGroup, BrnResizableHandle, BrnResizablePanel } from '@spartan-ng/brain/resizable';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-resizable-page',
  imports: [BrnResizableGroup, BrnResizableHandle, BrnResizablePanel, HlmResizableImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Resizable</h3>
    <p class="tw:text-gray-500 tw:mb-4">Draggable panels.</p>

    <div hlmResizableGroup class="tw:flex tw:h-[200px] tw:w-full tw:max-w-md tw:rounded-md tw:border">
      <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">One</div>
      <hlm-resizable-handle />
      <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">Two</div>
    </div>
  `,
})
export class ResizablePage {}
