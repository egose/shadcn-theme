import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-checkbox-page',
  imports: [DemoHeaderComponent, HlmCheckbox],
  template: `
    <app-demo-header title="Checkbox" description="A control that allows the user to toggle between two states." />
    <div class="tw:flex tw:flex-col tw:gap-3">
      <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <hlm-checkbox />
        <span>Accept terms and conditions</span>
      </label>
      <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <hlm-checkbox disabled />
        <span>Disabled checkbox</span>
      </label>
    </div>
  `,
})
export class CheckboxPage {}
