import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

const FRUIT_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

@Component({
  selector: 'app-form-select-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, ReactiveFormsModule, EgFormSelect],
  template: `
    <app-demo-header
      title="Form Select"
      description="Reactive-form select wrapper that renders label, hint, and validation error for single and multi select."
    />

    <form class="tw:grid tw:w-full tw:max-w-sm tw:gap-8" [formGroup]="form">
      <app-demo-section title="Single select">
        <eg-form-select
          label="Fruit"
          placeholder="Select a fruit"
          hint="Choose one."
          controlName="fruit"
          [options]="options"
        />
      </app-demo-section>

      <app-demo-section title="Multi select">
        <eg-form-select
          label="Fruits"
          placeholder="Select"
          [multiple]="true"
          hint="Pick all that apply."
          controlName="fruits"
          [options]="options"
        />
      </app-demo-section>
    </form>
  `,
})
export class FormSelectPage {
  readonly options = FRUIT_OPTIONS;
  readonly form = new FormGroup({
    fruit: new FormControl('', { nonNullable: true }),
    fruits: new FormControl<string[]>([], { nonNullable: true }),
  });
}
