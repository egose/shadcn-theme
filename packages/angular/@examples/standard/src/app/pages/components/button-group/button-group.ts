import { Component } from '@angular/core';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-group-page',
  imports: [HlmButtonGroupImports, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Button Group</h3>
    <p class="tw:text-gray-500 tw:mb-4">A grouped cluster of buttons.</p>

    <div hlmButtonGroup class="tw:inline-flex">
      <button hlmButton variant="secondary" appearance="outline">Left</button>
      <button hlmButton variant="secondary" appearance="outline">Center</button>
      <button hlmButton variant="secondary" appearance="outline">Right</button>
    </div>

    <div hlmButtonGroup class="tw:mt-4 tw:inline-flex">
      <span hlmButtonGroupText>Section</span>
      <button hlmButton variant="secondary" appearance="outline">A</button>
      <span hlmButtonGroupSeparator></span>
      <button hlmButton variant="secondary" appearance="outline">B</button>
    </div>
  `,
})
export class ButtonGroupPage {}
