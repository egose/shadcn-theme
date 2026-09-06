import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnTabsImports } from '@spartan-ng/brain/tabs';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'app-tabs-page',
  imports: [DemoHeaderComponent, BrnTabsImports, HlmTabsImports],
  template: `
    <app-demo-header title="Tabs" description="Switch between panels of content." />

    <div hlmTabs tab="account" class="tw:w-full tw:max-w-md">
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
