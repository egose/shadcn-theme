import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EgLayoutSimple, type FlyoutMenuGroup } from '@egose/shadcn-theme-ng/layout-simple';
import {
  lucideLayers,
  lucideLayoutDashboard,
  lucideMousePointer2,
  lucidePanelTop,
  lucideTable,
  lucideTextCursorInput,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-layout-simple-page',
  imports: [DemoHeaderComponent, EgLayoutSimple],
  template: `
    <app-demo-header
      title="Layout Simple"
      description="A complete app shell with card-style fly-out navigation, search, mobile menus, and an optional sidebar."
    />

    <div class="tw:rounded-xl tw:border tw:border-border tw:shadow-sm">
      <eg-layout-simple
        [fullHeight]="false"
        brandName="Acme workspace"
        headerClass="tw:rounded-t-xl"
        footerClass="tw:rounded-b-xl"
        [flyoutNavigationGroups]="flyoutGroups"
        [primaryNavigation]="[
          { label: 'Buttons', link: '/components/button' },
          { label: 'Forms', link: '/components/form-field' },
          { label: 'Cards', link: '/components/card' },
        ]"
        [utilityNavigation]="[{ label: 'Tables', link: '/components/table' }]"
        [navigationGroups]="[
          {
            label: 'Resources',
            items: [
              { label: 'Typography', link: '/components/typography' },
              { label: 'Coming soon', disabled: true },
            ],
          },
        ]"
        [footerEnabled]="true"
        footerText="A responsive shell, ready for your app."
        logoLink="/"
      >
        <div class="tw:space-y-3 tw:py-10">
          <span class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-foreground/75"
            >Workspace overview</span
          >
          <h3 class="tw:text-2xl tw:font-semibold tw:tracking-tight">A clearer place to work</h3>
          <p class="tw:max-w-lg tw:text-sm tw:leading-6 tw:text-foreground/75">
            Open Explore components for a card-style fly-out, navigate with the keyboard, or resize the window to
            explore expandable mobile categories.
          </p>
        </div>
      </eg-layout-simple>
    </div>
  `,
})
export class LayoutSimplePage {
  readonly flyoutGroups: FlyoutMenuGroup[] = [
    {
      label: 'Explore components',
      description: 'Everything you need to create a thoughtful interface.',
      items: [
        {
          label: 'Buttons & actions',
          description: 'Clear, accessible controls for every interaction.',
          icon: lucideMousePointer2,
          link: '/components/button',
        },
        {
          label: 'Forms & inputs',
          description: 'Collect information with helpful validation and feedback.',
          icon: lucideTextCursorInput,
          link: '/components/form-field',
        },
        {
          label: 'Overlays & dialogs',
          description: 'Keep focused tasks close without losing context.',
          icon: lucideLayers,
          link: '/components/dialog',
        },
        {
          label: 'Layout & navigation',
          description: 'Give every page a clear structure and a place to go.',
          icon: lucideLayoutDashboard,
          link: '/components/layout-simple',
        },
        {
          label: 'Data display',
          description: 'Make detailed information easier to scan and understand.',
          icon: lucideTable,
          link: '/components/table',
        },
        {
          label: 'Cards & surfaces',
          description: 'Group related content into approachable, reusable views.',
          icon: lucidePanelTop,
          link: '/components/card',
        },
      ],
    },
  ];
}
