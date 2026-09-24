import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmToggleGroup, HlmToggleGroupItem } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'app-toggle-group-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmToggleGroup, HlmToggleGroupItem],
  template: `
    <app-demo-header title="Toggle Group" description="A set of two-state buttons." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Single" title="Default" description="One selection at a time.">
        <div hlmToggleGroup type="single">
          <button hlmToggleGroupItem value="bold">Bold</button>
          <button hlmToggleGroupItem value="italic">Italic</button>
          <button hlmToggleGroupItem value="underline">Underline</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Multiple" title="Multi-select" description="Several options can be on at once.">
        <div hlmToggleGroup type="multiple">
          <button hlmToggleGroupItem value="bold">Bold</button>
          <button hlmToggleGroupItem value="italic">Italic</button>
          <button hlmToggleGroupItem value="underline">Underline</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Variant" title="Outline" description="Bordered group with no spacing.">
        <div hlmToggleGroup type="single" variant="outline" [spacing]="0">
          <button hlmToggleGroupItem value="left">Left</button>
          <button hlmToggleGroupItem value="center">Center</button>
          <button hlmToggleGroupItem value="right">Right</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Orientation" title="Vertical" description="Stacked layout.">
        <div hlmToggleGroup type="single" orientation="vertical">
          <button hlmToggleGroupItem value="top">Top</button>
          <button hlmToggleGroupItem value="middle">Middle</button>
          <button hlmToggleGroupItem value="bottom">Bottom</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Disabled" description="Non-interactive group.">
        <div hlmToggleGroup type="single" disabled>
          <button hlmToggleGroupItem value="bold">Bold</button>
          <button hlmToggleGroupItem value="italic">Italic</button>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class ToggleGroupPage {}
