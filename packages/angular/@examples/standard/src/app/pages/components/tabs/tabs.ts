import { Component } from '@angular/core';
import { BrnTabsImports } from '@spartan-ng/brain/tabs';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'app-tabs-page',
  imports: [BrnTabsImports, HlmTabsImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Tabs</h3>
    <p class="tw:text-gray-500 tw:mb-4">Switch between panels of content.</p>

    <div hlmTabs tab="account" class="tw:w-[400px]">
      <div hlmTabsList class="tw:grid tw:grid-cols-2">
        <button hlmTabsTrigger value="account" type="button">Account</button>
        <button hlmTabsTrigger value="password" type="button">Password</button>
      </div>
      <div hlmTabsContent value="account">Account settings</div>
      <div hlmTabsContent value="password">Password settings</div>
    </div>
  `,
})
export class TabsPage {}
