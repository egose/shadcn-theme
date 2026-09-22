import { ChangeDetectionStrategy, Component } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-radio-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'radio-group-indicator',
  },
  template: ` <div class="tw:group-data-[checked=true]:bg-primary tw:size-2 tw:rounded-full tw:bg-transparent"></div> `,
})
export class HlmRadioIndicator {
  constructor() {
    classes(
      () =>
        'tw:border-input tw:text-primary tw:group-has-[:focus-visible]:border-ring tw:group-has-[:focus-visible]:ring-ring/50 tw:dark:bg-input/30 tw:group-data-[disabled=true]:cursor-not-allowed tw:group-data-[disabled=true]:opacity-50 tw:relative tw:flex tw:aspect-square tw:size-4 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:shadow-xs tw:transition-[color,box-shadow] tw:outline-none tw:group-has-[:focus-visible]:ring-[3px]',
    );
  }
}
