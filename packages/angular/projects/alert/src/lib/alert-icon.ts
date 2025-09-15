import { Directive } from '@angular/core';
import { provideHlmIconConfig } from '@egose/shadcn-theme-ng/icon';

@Directive({
  selector: '[hlmAlertIcon]',
  providers: [provideHlmIconConfig({ size: 'sm' })],
})
export class HlmAlertIcon {}
