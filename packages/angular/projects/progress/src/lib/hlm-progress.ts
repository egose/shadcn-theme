import { Directive } from '@angular/core';
import { BrnProgress } from '@spartan-ng/brain/progress';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'hlm-progress,[hlmProgress]',
  hostDirectives: [{ directive: BrnProgress, inputs: ['value', 'max', 'getValueLabel'] }],
  host: { 'data-slot': 'progress' },
})
export class HlmProgress {
  constructor() {
    classes(() => 'tw:bg-muted tw:h-1.5 tw:rounded-full tw:relative tw:inline-flex tw:w-full tw:overflow-hidden');
  }
}
