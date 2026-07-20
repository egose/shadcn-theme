import { Component } from '@angular/core';
import { BrnAutocompleteImports } from '@spartan-ng/brain/autocomplete';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-autocomplete-page',
  imports: [BrnAutocompleteImports, HlmAutocompleteImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Autocomplete</h3>
    <p class="tw:text-gray-500 tw:mb-4">An input with suggestions.</p>

    <div hlmAutocomplete class="tw:w-[300px]">
      <hlm-autocomplete-input placeholder="Type a fruit..." />
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
