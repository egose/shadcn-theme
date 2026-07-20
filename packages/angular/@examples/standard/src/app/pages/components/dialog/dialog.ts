import { Component } from '@angular/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import {
  HlmDialog,
  HlmDialogTrigger,
  HlmDialogContent,
  HlmDialogHeader,
  HlmDialogTitle,
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogClose,
} from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-dialog-page',
  imports: [
    BrnDialogImports,
    HlmDialog,
    HlmDialogTrigger,
    HlmDialogContent,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogClose,
    HlmButton,
  ],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Dialog</h3>
    <p class="tw:text-gray-500 tw:mb-4">A modal dialog.</p>

    <hlm-dialog>
      <button hlmButton hlmDialogTrigger type="button">Open dialog</button>
      <hlm-dialog-content class="tw:max-w-[425px]">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Edit profile</h3>
          <p hlmDialogDescription>Make changes to your profile here.</p>
        </hlm-dialog-header>
        <div class="tw:grid tw:gap-4 tw:py-4">
          <p class="tw:text-sm">Add your form here.</p>
        </div>
        <hlm-dialog-footer>
          <button hlmDialogClose hlmButton variant="secondary" appearance="outline">Cancel</button>
          <button hlmButton variant="primary">Save</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class DialogPage {}
