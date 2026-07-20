import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmToaster } from '@egose/shadcn-theme-ng/sonner';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-sonner-page',
  imports: [HlmToaster, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Sonner</h3>
    <p class="tw:text-gray-500 tw:mb-4">Toast notifications.</p>

    <div class="tw:flex tw:gap-2">
      <button hlmButton variant="primary" type="button" (click)="showDefault()">Default</button>
      <button hlmButton variant="success" type="button" (click)="showSuccess()">Success</button>
      <button hlmButton variant="danger" type="button" (click)="showError()">Error</button>
    </div>

    <hlm-toaster />
  `,
})
export class SonnerPage {
  showDefault() {
    toast('My toast message');
  }
  showSuccess() {
    toast.success('Saved successfully.');
  }
  showError() {
    toast.error('Something went wrong.');
  }
}
