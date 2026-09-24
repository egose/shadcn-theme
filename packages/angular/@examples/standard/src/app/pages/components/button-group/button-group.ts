import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmButtonGroupImports } from '@egose/shadcn-theme-ng/button-group';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-group-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmButtonGroupImports, HlmButton],
  template: `
    <app-demo-header title="Button Group" description="A grouped cluster of buttons with separators and labels." />

    <div class="tw:grid tw:gap-6">
      <app-demo-section kicker="Default" title="Segmented" description="Left / center / right cluster.">
        <div hlmButtonGroup class="tw:inline-flex">
          <button hlmButton variant="secondary" appearance="outline">Left</button>
          <button hlmButton variant="secondary" appearance="outline">Center</button>
          <button hlmButton variant="secondary" appearance="outline">Right</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Mixed" title="With label and separator" description="Text label plus divided actions.">
        <div hlmButtonGroup class="tw:inline-flex">
          <span hlmButtonGroupText>Section</span>
          <button hlmButton variant="secondary" appearance="outline">A</button>
          <span hlmButtonGroupSeparator></span>
          <button hlmButton variant="secondary" appearance="outline">B</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Orientation" title="Vertical" description="Stacked group.">
        <div hlmButtonGroup orientation="vertical" class="tw:inline-flex">
          <button hlmButton variant="secondary" appearance="outline">Top</button>
          <button hlmButton variant="secondary" appearance="outline">Middle</button>
          <button hlmButton variant="secondary" appearance="outline">Bottom</button>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class ButtonGroupPage {}
