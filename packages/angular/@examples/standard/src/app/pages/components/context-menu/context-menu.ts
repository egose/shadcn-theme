import { Component } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-context-menu-page',
  imports: [HlmContextMenuImports, HlmDropdownMenuImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Context Menu</h3>
    <p class="tw:text-gray-500 tw:mb-4">Right-click to open a context menu.</p>

    <div
      hlmContextMenuTrigger="menu"
      class="tw:flex tw:h-40 tw:w-full tw:items-center tw:justify-center tw:rounded-md tw:border tw:border-dashed tw:text-sm tw:text-gray-500"
    >
      Right-click here
    </div>

    <ng-template #menu>
      <div hlmDropdownMenu>
        <button hlmDropdownMenuItem type="button">Cut</button>
        <button hlmDropdownMenuItem type="button">Copy</button>
        <button hlmDropdownMenuItem type="button">Paste</button>
      </div>
    </ng-template>
  `,
})
export class ContextMenuPage {}
