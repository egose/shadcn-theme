import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { BrnResizableGroup, BrnResizableHandle, BrnResizablePanel } from '@spartan-ng/brain/resizable';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-resizable-page',
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
    BrnResizableGroup,
    BrnResizableHandle,
    BrnResizablePanel,
    HlmResizableImports,
  ],
  template: `
    <app-demo-header title="Resizable" description="Draggable panels with horizontal and vertical layouts." />

    <div class="tw:grid tw:gap-6">
      <app-demo-section kicker="Horizontal" title="Two panels" description="Drag the handle to resize.">
        <div hlmResizableGroup class="tw:flex tw:h-[200px] tw:w-full tw:max-w-md tw:rounded-md tw:border">
          <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">One</div>
          <hlm-resizable-handle />
          <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">Two</div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Horizontal" title="Three panels" description="Two handles, three sections.">
        <div hlmResizableGroup class="tw:flex tw:h-[200px] tw:w-full tw:max-w-lg tw:rounded-md tw:border">
          <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">Sidebar</div>
          <hlm-resizable-handle />
          <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">Content</div>
          <hlm-resizable-handle />
          <div hlmResizablePanel class="tw:flex tw:items-center tw:justify-center tw:p-6">Inspector</div>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class ResizablePage {}
