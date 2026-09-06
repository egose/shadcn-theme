import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-searchable-multiselect-page',
  imports: [DemoHeaderComponent, EgSearchableMultiselect],
  template: `
    <app-demo-header
      title="Searchable Multiselect"
      description="Chips-style multiselect with searchable dropdown, paired with a visible label bound to the search field."
    />

    <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
      <label for="multiselect-fruits" class="tw:text-sm tw:font-medium tw:text-slate-700">Fruits</label>
      <eg-searchable-multiselect
        id="multiselect-fruits"
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
