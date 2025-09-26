import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';

@Component({
  selector: 'sheet-example',
  imports: [BrnSheetImports, HlmSheetImports, HlmButtonImports, HlmLabelImports],
  providers: [provideIcons({ lucideCross })],
  template: `
    <hlm-sheet side="right">
      <button id="edit-profile" variant="primary" brnSheetTrigger hlmButton>Open</button>
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h3 hlmSheetTitle>Edit Profile</h3>
          <p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
        <div class="tw:grid tw:flex-1 tw:auto-rows-min tw:gap-6 tw:px-4">
          <div class="tw:grid tw:gap-3">Grid 1</div>
          <div class="tw:grid tw:gap-3">Grid 2</div>
        </div>
        <hlm-sheet-footer>
          <button hlmButton type="submit">Save Changes</button>
          <button brnSheetClose hlmButton variant="secondary" appearance="outline">Close</button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class SheetExample {}
