import { Component } from '@angular/core';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'app-spinner',
  imports: [HlmSpinner],
  template: `<div class="p-10"><hlm-spinner /></div>`,
})
export class SpinnerPage {}
