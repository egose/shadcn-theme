import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { EgButtonModule } from '@egose/shadcn-theme-ng/button';
import { EgFormFieldModule } from '@egose/shadcn-theme-ng/form-field';
import { EgInput } from '@egose/shadcn-theme-ng/input';
import { EgSelectImports, EgSelectModule } from '@egose/shadcn-theme-ng/select';
import { BrnSelectImports, BrnSelectModule } from '@spartan-ng/brain/select';

@Component({
  selector: 'app-form-field',
  imports: [
    ReactiveFormsModule,
    EgFormFieldModule,
    EgSelectModule,
    EgInput,
    EgButtonModule,
    BrnSelectModule,
    EgSelectImports,
    BrnSelectImports,
  ],
  template: `
    <form [formGroup]="form" class="tw:space-y-6">
      <eg-form-field>
        <input
          aria-label="Your Name"
          formControlName="name"
          class="tw:w-80"
          egInput
          type="text"
          placeholder="Your Name"
        />
        <eg-error>Your name is required</eg-error>
      </eg-form-field>
      <eg-form-field>
        <brn-select class="tw:inline-block" placeholder="Select some fruit" formControlName="fruit">
          <eg-select-trigger class="tw:w-80">
            <eg-select-value />
          </eg-select-trigger>
          <eg-select-content>
            <eg-select-label>Fruits</eg-select-label>
            @for (option of options; track option.value) {
              <eg-option>{{ option.label }}</eg-option>
            }
          </eg-select-content>
        </brn-select>
        <eg-error>The fruit is required</eg-error>
      </eg-form-field>

      <button type="submit" egBtn>Submit</button>
    </form>
  `,
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class FormFieldPage {
  private readonly _formBuilder = inject(FormBuilder);

  public form = this._formBuilder.group({
    name: ['', Validators.required],
    fruit: ['', Validators.required],
  });

  public options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
  ];
}

export const providerShowOnDirtyErrorStateMatcher = `
 providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
`;
