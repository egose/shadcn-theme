import { Component } from '@angular/core';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  selector: 'app-form-select-page',
  imports: [EgFormSelect],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Select</h3>
    <p class="tw:text-gray-500 tw:mb-4">Select wrapper with label, error, hint.</p>

    <div class="tw:w-[300px]">
      <eg-form-select
        label="Fruit"
        placeholder="Select a fruit"
        hint="Choose one."
        [options]="[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
        ]"
      />
    </div>

    <div class="tw:mt-6 tw:w-[300px]">
      <h4>Multi-select</h4>
      <eg-form-select
        label="Fruits"
        placeholder="Select"
        [multiple]="true"
        hint="Pick all that apply."
        [options]="[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
        ]"
      />
    </div>
  `,
})
export class FormSelectPage {}
