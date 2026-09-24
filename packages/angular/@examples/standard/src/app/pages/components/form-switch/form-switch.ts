import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSwitch } from '@egose/shadcn-theme-ng/form-switch';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-switch-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormSwitch],
  template: `
    <app-demo-header
      title="Form Switch"
      description="Reactive-form switch wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-switch label="Email notifications" hint="Toggle to subscribe" controlName="notifications" />
    </form>
  `,
})
export class FormSwitchPage {
  readonly form = new FormGroup({
    notifications: new FormControl(true),
  });
}
