import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-collapsible-page',
  imports: [DemoHeaderComponent, BrnCollapsibleImports, HlmCollapsibleImports, HlmButton],
  template: `
    <app-demo-header title="Collapsible" description="Toggle content visibility." />

    <div hlmCollapsible>
      <button hlmButton hlmCollapsibleTrigger variant="secondary" appearance="outline" type="button">Toggle</button>
      <div hlmCollapsibleContent class="tw:mt-2 tw:p-4 tw:border tw:rounded-md">Hidden content revealed here.</div>
    </div>
  `,
})
export class CollapsiblePage {}
