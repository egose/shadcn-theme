import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnAutocompleteImports } from '@spartan-ng/brain/autocomplete';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-autocomplete-page',
  imports: [DemoHeaderComponent, BrnAutocompleteImports, HlmAutocompleteImports],
  template: `
    <app-demo-header
      title="Autocomplete"
      description="An input with suggestions, paired with a visible label bound to the search field."
    />

    <div hlmAutocomplete class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
      <label for="autocomplete-fruit" class="tw:text-sm tw:font-medium tw:text-slate-700">Fruit</label>
      <hlm-autocomplete-input inputId="autocomplete-fruit" placeholder="Type a fruit..." />
      <hlm-autocomplete-content>
        <div hlmAutocompleteEmpty>No result.</div>
        <div hlmAutocompleteList>
          <div hlmAutocompleteGroup>
            <div hlmAutocompleteLabel>Fruits</div>
            <button hlmAutocompleteItem type="button">Apple</button>
            <button hlmAutocompleteItem type="button">Banana</button>
            <button hlmAutocompleteItem type="button">Cherry</button>
          </div>
        </div>
      </hlm-autocomplete-content>
    </div>
  `,
})
export class AutocompletePage {}
