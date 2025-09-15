import { Directive } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Directive({
  selector: 'button[hlmAlertDialogAction]',
  hostDirectives: [{ directive: HlmButton, inputs: ['variant', 'size'] }],
})
export class HlmAlertDialogActionButton {}
