import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { BrnTabsImports } from '@spartan-ng/brain/tabs';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'app-tabs-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, BrnTabsImports, HlmTabsImports],
  template: `
    <app-demo-header title="Tabs" description="Switch between panels of content." />

    <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Two tabs" description="Account and password panels.">
        <div hlmTabs tab="account" class="tw:w-full tw:max-w-md">
          <div hlmTabsList class="tw:grid tw:grid-cols-2">
            <button hlmTabsTrigger value="account" type="button">Account</button>
            <button hlmTabsTrigger value="password" type="button">Password</button>
          </div>
          <div hlmTabsContent value="account" class="tw:rounded-md tw:border tw:p-4">Account settings</div>
          <div hlmTabsContent value="password" class="tw:rounded-md tw:border tw:p-4">Password settings</div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Panels" title="Three tabs" description="Profile, messages, and settings panels.">
        <div hlmTabs tab="profile" class="tw:w-full tw:max-w-md">
          <div hlmTabsList class="tw:grid tw:grid-cols-3">
            <button hlmTabsTrigger value="profile" type="button">Profile</button>
            <button hlmTabsTrigger value="messages" type="button">Messages</button>
            <button hlmTabsTrigger value="settings" type="button">Settings</button>
          </div>
          <div hlmTabsContent value="profile" class="tw:rounded-md tw:border tw:p-4">Profile details</div>
          <div hlmTabsContent value="messages" class="tw:rounded-md tw:border tw:p-4">Message inbox</div>
          <div hlmTabsContent value="settings" class="tw:rounded-md tw:border tw:p-4">App settings</div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Disabled tab" description="One tab is unavailable.">
        <div hlmTabs tab="overview" class="tw:w-full tw:max-w-md">
          <div hlmTabsList class="tw:grid tw:grid-cols-3">
            <button hlmTabsTrigger value="overview" type="button">Overview</button>
            <button hlmTabsTrigger value="analytics" type="button">Analytics</button>
            <button hlmTabsTrigger value="reports" type="button" disabled>Reports</button>
          </div>
          <div hlmTabsContent value="overview" class="tw:rounded-md tw:border tw:p-4">Overview content</div>
          <div hlmTabsContent value="analytics" class="tw:rounded-md tw:border tw:p-4">Analytics content</div>
          <div hlmTabsContent value="reports" class="tw:rounded-md tw:border tw:p-4">Reports content</div>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class TabsPage {}
