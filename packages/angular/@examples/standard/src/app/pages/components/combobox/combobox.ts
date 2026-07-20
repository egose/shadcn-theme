import { Component } from '@angular/core';
import { BrnComboboxImports } from '@spartan-ng/brain/combobox';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-combobox-page',
  imports: [BrnComboboxImports, HlmComboboxImports, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Combobox</h3>
    <p class="tw:text-gray-500 tw:mb-4">A searchable dropdown selector.</p>

    <div class="tw:flex tw:items-center tw:gap-2">
      <div hlmCombobox>
        <button hlmButton hlmComboboxTrigger variant="secondary" appearance="outline" type="button">
          Select option
        </button>
        <hlm-combobox-content class="tw:w-[200px]">
          <hlm-combobox-input placeholder="Search..." />
          <div hlmComboboxEmpty>No results.</div>
          <div hlmComboboxGroup>
            <div hlmComboboxLabel>Items</div>
            <button hlmComboboxItem type="button">Apple</button>
            <button hlmComboboxItem type="button">Banana</button>
            <button hlmComboboxItem type="button">Cherry</button>
          </div>
        </hlm-combobox-content>
      </div>
    </div>
  `,
})
export class ComboboxPage {}
