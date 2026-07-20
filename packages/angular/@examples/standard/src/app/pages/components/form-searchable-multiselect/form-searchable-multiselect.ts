import { Component } from '@angular/core';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  selector: 'app-form-searchable-multiselect-page',
  imports: [EgFormSearchableMultiselect],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Searchable Multiselect</h3>
    <p class="tw:text-gray-500 tw:mb-4">Reactive-form bound searchable multiselect.</p>

    <div class="tw:w-[300px]">
      <eg-form-searchable-multiselect
        label="Tags"
        placeholder="Add tags..."
        hint="Search and select."
        [options]="[
          { label: 'Angular', value: 'angular' },
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
        ]"
      />
    </div>
  `,
})
export class FormSearchableMultiselectPage {}
