import { Component } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-page',
  imports: [EgBasicAlert],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Basic Alert</h3>
    <p class="tw:text-gray-500 tw:mb-4">A simple alert with variants.</p>

    <div class="tw:flex tw:flex-col tw:gap-2">
      <eg-basic-alert variant="info" title="Info" description="Information message." />
      <eg-basic-alert variant="success" title="Success" description="Operation completed." />
      <eg-basic-alert variant="warning" title="Warning" description="Please verify." />
      <eg-basic-alert variant="danger" title="Danger" appearance="solid" description="Action failed." />
    </div>
  `,
})
export class BasicAlertPage {}
