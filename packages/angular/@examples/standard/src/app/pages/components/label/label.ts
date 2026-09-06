import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-label-page',
  imports: [DemoHeaderComponent, HlmLabel],
  template: `
    <app-demo-header title="Label" description="A label for form controls." />
    <label hlmLabel>Username</label>
  `,
})
export class LabelPage {}
