import { Component } from '@angular/core';
import { BrnDrawerImports } from '@spartan-ng/brain/drawer';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-drawer-page',
  imports: [BrnDrawerImports, HlmDrawerImports, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Drawer</h3>
    <p class="tw:text-gray-500 tw:mb-4">A panel that slides in from the bottom.</p>

    <hlm-drawer>
      <button hlmButton hlmDrawerTrigger type="button">Open drawer</button>
      <hlm-drawer-content>
        <hlm-drawer-header>
          <h3 hlmDrawerTitle>Move task</h3>
          <p hlmDrawerDescription>Select a project to move this task to.</p>
        </hlm-drawer-header>
        <div class="tw:p-4">Drawer content</div>
        <hlm-drawer-footer>
          <button hlmButton>Submit</button>
          <button hlmDrawerClose hlmButton variant="secondary" appearance="outline">Cancel</button>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class DrawerPage {}
