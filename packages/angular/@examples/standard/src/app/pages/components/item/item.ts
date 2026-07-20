import { Component } from '@angular/core';
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';

@Component({
  selector: 'app-item-page',
  imports: [HlmItemImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Item</h3>
    <p class="tw:text-gray-500 tw:mb-4">A list item with header, content, description, footer.</p>

    <div hlmItem class="tw:rounded-md tw:border tw:p-4">
      <div hlmItemHeader>
        <p hlmItemTitle>Task title</p>
        <p hlmItemDescription>Task description</p>
      </div>
      <div hlmItemContent class="tw:mt-2">Task content body</div>
    </div>
  `,
})
export class ItemPage {}
