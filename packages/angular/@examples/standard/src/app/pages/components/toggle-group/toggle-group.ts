import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmToggleGroup, HlmToggleGroupItem } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'app-toggle-group-page',
  imports: [DemoHeaderComponent, HlmToggleGroup, HlmToggleGroupItem],
  template: `
    <app-demo-header title="Toggle Group" description="A set of two-state buttons." />
    <div hlmToggleGroup>
      <button hlmToggleGroupItem>Bold</button>
      <button hlmToggleGroupItem>Italic</button>
      <button hlmToggleGroupItem>Underline</button>
    </div>
  `,
})
export class ToggleGroupPage {}
