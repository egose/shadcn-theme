import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnComboboxImports } from '@spartan-ng/brain/combobox';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-combobox-page',
  imports: [DemoHeaderComponent, BrnComboboxImports, HlmComboboxImports, HlmButton],
  template: `
    <app-demo-header
      title="Combobox"
      description="A searchable dropdown selector with its visible label bound to the search field."
    />

    <div class="tw:flex tw:items-center tw:gap-2">
      <div hlmCombobox class="tw:grid tw:gap-2">
        <label for="combobox-fruit" class="tw:text-sm tw:font-medium tw:text-slate-700">Fruit</label>
        <button hlmButton hlmComboboxTrigger variant="secondary" appearance="outline" type="button">
          Select option
        </button>
        <hlm-combobox-content class="tw:w-64">
          <hlm-combobox-input inputId="combobox-fruit" placeholder="Search..." />
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
