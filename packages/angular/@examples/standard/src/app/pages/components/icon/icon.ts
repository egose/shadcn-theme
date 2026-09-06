import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-icon-page',
  imports: [DemoHeaderComponent, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideRocket })],
  template: `
    <app-demo-header title="Icon" description="Styled icon directive." />

    <ng-icon hlm name="lucideRocket" size="xl" />
  `,
})
export class IconPage {}
