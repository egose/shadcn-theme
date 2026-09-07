import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnDrawerImports } from '@spartan-ng/brain/drawer';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-drawer-page',
  imports: [DemoHeaderComponent, BrnDrawerImports, HlmDrawerImports, HlmButton],
  template: `
    <app-demo-header title="Drawer" description="A panel that slides in from the bottom." />

    <hlm-drawer>
      <button hlmButton hlmDrawerTrigger type="button">Open drawer</button>
      <!-- Structural brain content registers this panel with the drawer: without
        *brnDrawerContent the content has no state provider and the trigger would
        silently do nothing. -->
      <hlm-drawer-content *brnDrawerContent="let ctx">
        <hlm-drawer-header>
          <h3 hlmDrawerTitle>Move task</h3>
          <p hlmDrawerDescription>Select a project to move this task to.</p>
        </hlm-drawer-header>
        <div class="tw:p-4">Drawer content</div>
        <hlm-drawer-footer>
          <button hlmButton type="button" (click)="submit()">Submit</button>
          <button hlmDrawerClose hlmButton variant="secondary" appearance="outline" type="button">Cancel</button>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>

    @if (drawerMessage()) {
      <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">{{ drawerMessage() }}</p>
    }
  `,
})
export class DrawerPage {
  readonly drawerMessage = signal<string | null>(null);

  submit() {
    this.drawerMessage.set('Task moved to the selected project.');
  }
}
