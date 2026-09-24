import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCheck, lucideRocket, lucideSearch } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-icon-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideRocket, lucideBell, lucideCheck, lucideSearch })],
  template: `
    <app-demo-header title="Icon" description="Styled icon directive with size options." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Basic" description="Rocket icon at xl size.">
        <ng-icon hlm name="lucideRocket" size="xl" />
      </app-demo-section>

      <app-demo-section kicker="Sizes" title="xs to xl" description="Density options.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <ng-icon hlm name="lucideBell" size="xs" />
          <ng-icon hlm name="lucideBell" size="sm" />
          <ng-icon hlm name="lucideBell" size="base" />
          <ng-icon hlm name="lucideBell" size="lg" />
          <ng-icon hlm name="lucideBell" size="xl" />
        </div>
      </app-demo-section>

      <app-demo-section kicker="Set" title="Common icons" description="Search, check, and notification icons.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <ng-icon hlm name="lucideSearch" size="lg" />
          <ng-icon hlm name="lucideCheck" size="lg" />
          <ng-icon hlm name="lucideBell" size="lg" />
        </div>
      </app-demo-section>
    </div>
  `,
})
export class IconPage {}
