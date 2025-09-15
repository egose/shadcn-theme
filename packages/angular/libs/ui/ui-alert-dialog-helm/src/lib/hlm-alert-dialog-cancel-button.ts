import { Directive } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';

@Directive({
  selector: 'button[hlmAlertDialogCancel]',
  hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
  providers: [provideBrnButtonConfig({ variant: 'outline' })],
})
export class HlmAlertDialogCancelButton {}
