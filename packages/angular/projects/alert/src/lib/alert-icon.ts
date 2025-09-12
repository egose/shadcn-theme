import { Directive } from '@angular/core';
import { provideEgIconConfig } from '@egose/shadcn-theme-ng/icon';

@Directive({
  selector: '[egAlertIcon]',
  providers: [provideEgIconConfig({ size: 'sm' })],
})
export class EgAlertIcon {}
