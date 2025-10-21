import { Component } from '@angular/core';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'app-spinner',
  imports: [HlmSpinner],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Spinner</h3>
    <div class="p-10"><hlm-spinner /></div>
  `,
})
export class SpinnerPage {}
