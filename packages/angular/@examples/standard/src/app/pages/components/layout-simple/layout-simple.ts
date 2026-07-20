import { Component } from '@angular/core';
import { EgLayoutSimple } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-layout-simple-page',
  imports: [EgLayoutSimple],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Layout (Simple)</h3>
    <p class="tw:text-gray-500 tw:mb-4">A complete app shell: header, menus, content, optional sidebar.</p>

    <div class="tw:tw-rounded-md tw:border tw:overflow-hidden tw:h-[400px]">
      <eg-layout-simple
        [sidebarEnabled]="true"
        sidebarTitle="Menu"
        [leftMenus]="[
          { label: 'Home', link: '#' },
          { label: 'Docs', link: '#' },
          { label: 'About', link: '#' },
        ]"
        [rightMenus]="[{ label: 'Login', link: '#' }]"
        logo=""
        logoLink="/"
      >
        <div class="tw:p-8">Page content goes here.</div>
      </eg-layout-simple>
    </div>
  `,
})
export class LayoutSimplePage {}
