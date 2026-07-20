import { Component, signal } from '@angular/core';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-field-page',
  imports: [HlmFieldImports, HlmInput],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Field</h3>
    <p class="tw:text-gray-500 tw:mb-4">Form field wrapper with label, description, error.</p>

    <div class="tw:w-[320px]">
      <div hlmField>
        <label hlmFieldLabel>Email</label>
        <input hlmInput placeholder="email@example.com" type="email" />
        <p hlmFieldDescription>Enter your email address.</p>
      </div>
    </div>
  `,
})
export class FieldPage {}
