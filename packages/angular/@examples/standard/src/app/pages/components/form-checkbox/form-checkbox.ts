import { Component } from '@angular/core';
import { EgFormCheckbox } from '@egose/shadcn-theme-ng/form-checkbox';

@Component({
  selector: 'app-form-checkbox-page',
  imports: [EgFormCheckbox],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Checkbox</h3>
    <p class="tw:text-gray-500 tw:mb-4">Checkbox wrapper with label, error, hint.</p>

    <div class="tw:w-[300px]">
      <eg-form-checkbox label="Accept terms and conditions" hint="Required to continue." [required]="true" />
    </div>
  `,
})
export class FormCheckboxPage {}
