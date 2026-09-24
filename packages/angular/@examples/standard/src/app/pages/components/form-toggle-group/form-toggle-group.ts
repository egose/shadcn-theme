import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormToggleGroup } from '@egose/shadcn-theme-ng/form-toggle-group';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-toggle-group-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormToggleGroup],
  template: `
    <app-demo-header
      title="Form Toggle Group"
      description="Reactive-form toggle-group wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-toggle-group
        label="Align"
        hint="Choose alignment"
        controlName="align"
        [options]="options"
        [required]="true"
        error="Pick one."
      />
    </form>
  `,
})
export class FormToggleGroupPage {
  readonly form = new FormGroup({
    align: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  readonly options = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];
}
