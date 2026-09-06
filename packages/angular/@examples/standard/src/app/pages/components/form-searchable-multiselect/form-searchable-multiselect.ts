import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-searchable-multiselect-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <app-demo-header
      title="Form Searchable Multiselect"
      description="Reactive-form multiselect with typeahead search, label, and hint."
    />

    <form class="tw:w-full tw:max-w-sm" [formGroup]="form">
      <eg-form-searchable-multiselect
        label="Tags"
        placeholder="Add tags..."
        hint="Search and select."
        controlName="tags"
        [options]="[
          { label: 'Angular', value: 'angular' },
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
        ]"
      />
    </form>
  `,
})
export class FormSearchableMultiselectPage {
  readonly form = new FormGroup({
    tags: new FormControl<string[]>([], { nonNullable: true }),
  });
}
