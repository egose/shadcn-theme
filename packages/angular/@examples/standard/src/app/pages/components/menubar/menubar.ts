import { Component } from '@angular/core';
import { HlmMenubar, HlmMenubarTrigger } from '@egose/shadcn-theme-ng/menubar';

@Component({
  selector: 'app-menubar-page',
  imports: [HlmMenubar, HlmMenubarTrigger],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Menubar</h3>
    <p class="tw:text-gray-500 tw:mb-4">A horizontal menu with trigger items.</p>

    <div hlmMenubar class="tw:flex tw:gap-1">
      <button hlmMenubarTrigger type="button">File</button>
      <button hlmMenubarTrigger type="button">Edit</button>
      <button hlmMenubarTrigger type="button">View</button>
    </div>
  `,
})
export class MenubarPage {}
