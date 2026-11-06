import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-searchable-multiselect-page',
  imports: [DemoHeaderComponent, EgSearchableMultiselect],
  template: `
    <app-demo-header
      title="Searchable Multiselect"
      description="Chips-style multiselect with searchable dropdown, paired with a visible label bound to the search field. The search field and the selected chips row are independently hideable."
    />

    <div class="tw:flex tw:flex-col tw:gap-6">
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

      <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
        <label for="multiselect-colors" class="tw:text-sm tw:font-medium tw:text-slate-700">
          Colors (no search field)
        </label>
        <eg-searchable-multiselect
          id="multiselect-colors"
          placeholder="Pick colors..."
          [showSearch]="false"
          [options]="[
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
          ]"
        />
      </div>

      <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
        <label for="multiselect-cuisines" class="tw:text-sm tw:font-medium tw:text-slate-700">
          Cuisines (no selected chips; the trigger count summarizes the selection)
        </label>
        <eg-searchable-multiselect
          id="multiselect-cuisines"
          placeholder="Pick cuisines..."
          [showSelectedChips]="false"
          [value]="['italian']"
          [options]="[
            { label: 'Italian', value: 'italian' },
            { label: 'Mexican', value: 'mexican' },
            { label: 'Japanese', value: 'japanese' },
          ]"
        />
      </div>
    </div>
  `,
})
export class SearchableMultiselectPage {}
