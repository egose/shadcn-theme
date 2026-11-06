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
      description="Reactive-form multiselect with typeahead search, label, and hint. The search field and the selected chips row are independently hideable, per instance or via global config."
    />

    <form class="tw:flex tw:flex-col tw:gap-6 tw:w-full tw:max-w-sm" [formGroup]="form">
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

      <eg-form-searchable-multiselect
        label="Categories (no chips)"
        placeholder="Pick categories..."
        hint="The trigger count summarizes the selection."
        controlName="categories"
        [showSelectedChips]="false"
        [options]="[
          { label: 'Frontend', value: 'frontend' },
          { label: 'Backend', value: 'backend' },
          { label: 'DevOps', value: 'devops' },
        ]"
      />
    </form>
  `,
})
export class FormSearchableMultiselectPage {
  readonly form = new FormGroup({
    tags: new FormControl<string[]>([], { nonNullable: true }),
    categories: new FormControl<string[]>(['frontend'], { nonNullable: true }),
  });
}
