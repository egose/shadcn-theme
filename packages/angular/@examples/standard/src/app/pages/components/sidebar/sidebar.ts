import { Component } from '@angular/core';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-sidebar-page',
  imports: [HlmSidebarImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Sidebar</h3>
    <p class="tw:text-gray-500 tw:mb-4">A composable sidebar layout.</p>

    <div hlmSidebarWrapper class="tw:relative tw:flex tw:h-[400px] tw:w-full tw:rounded-md tw:border">
      <hlm-sidebar>
        <div hlmSidebarHeader class="tw:p-4 tw:font-semibold">My App</div>
        <div hlmSidebarContent class="tw:p-2">
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton type="button">Home</button>
            </li>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton type="button">Settings</button>
            </li>
          </ul>
        </div>
        <div hlmSidebarFooter class="tw:p-4 tw:text-sm tw:text-gray-500">v1.0.0</div>
      </hlm-sidebar>
      <main hlmSidebarInset class="tw:flex tw:items-center tw:justify-center tw:p-4">Main content area</main>
    </div>
  `,
})
export class SidebarPage {}
