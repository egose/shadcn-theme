import { Component } from '@angular/core';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-sheet-page',
  imports: [BrnSheetImports, HlmSheetImports, HlmButtonImports, HlmLabelImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Sheet</h3>
    <p class="tw:text-gray-500 tw:mb-4">A side panel that slides in.</p>

    <hlm-sheet side="right">
      <button id="sheet-trigger" hlmButton brnSheetTrigger type="button">Open sheet</button>
      <hlm-sheet-content *brnSheetContent="let ctx" class="tw:gap-0">
        <hlm-sheet-header>
          <h3 hlmSheetTitle>Edit Profile</h3>
          <p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
        <div class="tw:grid tw:flex-1 tw:auto-rows-min tw:gap-6 tw:px-4">
          <div class="tw:grid tw:gap-3">Field 1</div>
          <div class="tw:grid tw:gap-3">Field 2</div>
        </div>
        <hlm-sheet-footer>
          <button hlmButton type="submit">Save Changes</button>
          <button hlmSheetClose hlmButton variant="secondary" appearance="outline">Close</button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class SheetPage {}
