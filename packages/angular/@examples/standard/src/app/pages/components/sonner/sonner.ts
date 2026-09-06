import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { toast } from 'ngx-sonner';
import { HlmToaster } from '@egose/shadcn-theme-ng/sonner';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-sonner-page',
  imports: [DemoHeaderComponent, HlmToaster, HlmButton],
  template: `
    <app-demo-header title="Sonner" description="Toast notifications." />

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
