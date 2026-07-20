import { Component, signal } from '@angular/core';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-collapsible-page',
  imports: [BrnCollapsibleImports, HlmCollapsibleImports, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Collapsible</h3>
    <p class="tw:text-gray-500 tw:mb-4">Toggle content visibility.</p>

    <div hlmCollapsible>
      <button hlmButton hlmCollapsibleTrigger variant="secondary" appearance="outline" type="button">Toggle</button>
      <div hlmCollapsibleContent class="tw:mt-2 tw:p-4 tw:border tw:rounded-md">Hidden content revealed here.</div>
    </div>
  `,
})
export class CollapsiblePage {}
