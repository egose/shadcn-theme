import { Component } from '@angular/core';
import { HlmToggleGroup, HlmToggleGroupItem } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'app-toggle-group-page',
  imports: [HlmToggleGroup, HlmToggleGroupItem],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Toggle Group</h3>
    <p class="tw:text-gray-500 tw:mb-4">A set of two-state buttons.</p>
    <div hlmToggleGroup>
      <button hlmToggleGroupItem>Bold</button>
      <button hlmToggleGroupItem>Italic</button>
      <button hlmToggleGroupItem>Underline</button>
    </div>
  `,
})
export class ToggleGroupPage {}
