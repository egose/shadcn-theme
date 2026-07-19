import { Directive, input } from '@angular/core';
import { HlmBtn } from '@egose/shadcn-theme-ng/button';

@Directive({
  selector: 'button[hlmAlertDialogAction]',
  hostDirectives: [{ directive: HlmBtn, inputs: ['variant', 'size'] }],
  host: { 'data-slot': 'alert-dialog-action', '[type]': 'type()' },
})
export class HlmAlertDialogAction {
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
}
