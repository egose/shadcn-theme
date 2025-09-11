import { Component } from '@angular/core';
import { EgSpinner } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'app-spinner',
  imports: [EgSpinner],
  template: `<div class="p-10"><eg-spinner /></div>`,
})
export class SpinnerPage {}
