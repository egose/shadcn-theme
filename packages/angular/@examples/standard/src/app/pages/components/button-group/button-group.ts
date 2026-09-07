import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-group-page',
  imports: [DemoHeaderComponent, HlmButtonGroupImports, HlmButton],
  template: `
    <app-demo-header title="Button Group" description="A grouped cluster of buttons." />

    <div hlmButtonGroup class="tw:inline-flex">
      <button hlmButton variant="secondary" appearance="outline">Left</button>
      <button hlmButton variant="secondary" appearance="outline">Center</button>
      <button hlmButton variant="secondary" appearance="outline">Right</button>
    </div>

    <div hlmButtonGroup class="tw:mt-4 tw:inline-flex">
      <span hlmButtonGroupText>Section</span>
      <button hlmButton variant="secondary" appearance="outline">A</button>
      <span hlmButtonGroupSeparator></span>
      <button hlmButton variant="secondary" appearance="outline">B</button>
    </div>
  `,
})
export class ButtonGroupPage {}
