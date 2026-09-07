import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmMenubar, HlmMenubarTrigger } from '@egose/shadcn-theme-ng/menubar';

@Component({
  selector: 'app-menubar-page',
  imports: [DemoHeaderComponent, HlmMenubar, HlmMenubarTrigger],
  template: `
    <app-demo-header
      title="Menubar"
      description="A horizontal menu bar. These triggers are explicitly disabled here: they show trigger styling only, without menu panels."
    />

    <div hlmMenubar class="tw:flex tw:gap-1">
      <button hlmMenubarTrigger type="button" disabled title="Demo only: no menu panel attached">File</button>
      <button hlmMenubarTrigger type="button" disabled title="Demo only: no menu panel attached">Edit</button>
      <button hlmMenubarTrigger type="button" disabled title="Demo only: no menu panel attached">View</button>
    </div>
    <p class="tw:mt-4 tw:text-sm tw:text-slate-500">
      Demo-only triggers: pair each trigger with a menu panel in a real application.
    </p>
  `,
})
export class MenubarPage {}
