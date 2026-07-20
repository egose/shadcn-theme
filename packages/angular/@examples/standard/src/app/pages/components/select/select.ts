import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-select-page',
  imports: [BrnSelectImports, HlmSelectImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Select</h3>
    <p class="tw:text-gray-500 tw:mb-4">A dropdown selector.</p>

    <div class="tw:w-[280px]">
      <div hlmSelect class="tw:inline-flex">
        <hlm-select-trigger class="tw:w-full">
          <hlm-select-value placeholder="Select a fruit" />
        </hlm-select-trigger>
        <hlm-select-content>
          <hlm-select-item value="apple">Apple</hlm-select-item>
          <hlm-select-item value="banana">Banana</hlm-select-item>
          <hlm-select-item value="cherry">Cherry</hlm-select-item>
        </hlm-select-content>
      </div>
    </div>
  `,
})
export class SelectPage {}
