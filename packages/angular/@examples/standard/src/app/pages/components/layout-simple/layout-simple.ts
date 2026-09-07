import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EgLayoutSimple } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-layout-simple-page',
  imports: [DemoHeaderComponent, EgLayoutSimple],
  template: `
    <app-demo-header
      title="Layout Simple"
      description="A complete app shell: header, menus, content, optional sidebar."
    />

    <div class="tw:tw-rounded-md tw:border tw:overflow-hidden tw:h-[400px]">
      <eg-layout-simple
        [sidebarEnabled]="true"
        sidebarTitle="Menu"
        [leftMenus]="[
          { label: 'Buttons', link: '/components/button' },
          { label: 'Forms', link: '/components/form-field' },
          { label: 'Cards', link: '/components/card' },
        ]"
        [rightMenus]="[{ label: 'Tables', link: '/components/table' }]"
        logo=""
        logoLink="/"
      >
        <div class="tw:p-8">Page content goes here.</div>
      </eg-layout-simple>
    </div>
  `,
})
export class LayoutSimplePage {}
