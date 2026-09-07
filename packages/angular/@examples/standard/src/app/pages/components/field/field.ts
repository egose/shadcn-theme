import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-field-page',
  imports: [DemoHeaderComponent, HlmFieldImports, HlmInput],
  template: `
    <app-demo-header title="Field" description="Form field wrapper with label, description, error." />

    <div class="tw:w-full tw:max-w-sm">
      <div hlmField>
        <label hlmFieldLabel for="field-email">Email</label>
        <input hlmInput id="field-email" placeholder="email@example.com" type="email" />
        <p hlmFieldDescription>Enter your email address.</p>
      </div>
    </div>
  `,
})
export class FieldPage {}
