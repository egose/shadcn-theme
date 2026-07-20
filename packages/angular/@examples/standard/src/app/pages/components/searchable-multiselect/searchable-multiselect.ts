import { Component } from '@angular/core';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-searchable-multiselect-page',
  imports: [EgSearchableMultiselect],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Searchable Multiselect</h3>
    <p class="tw:text-gray-500 tw:mb-4">Chips-style multiselect with searchable dropdown.</p>

    <div class="tw:w-[300px]">
      <eg-searchable-multiselect
        placeholder="Add fruits..."
        [options]="[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
        ]"
      />
    </div>
  `,
})
export class SearchableMultiselectPage {}
