import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparator } from '@egose/shadcn-theme-ng/separator';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-field-separator',
  imports: [HlmSeparator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'field-separator' },
  template: `
    <hlm-separator class="tw:absolute tw:inset-0 tw:top-1/2" />
    <span
      data-slot="field-separator-content"
      class="tw:text-muted-foreground tw:px-2 tw:bg-background tw:relative tw:mx-auto tw:block tw:w-fit"
    >
      <ng-content />
    </span>
  `,
})
export class HlmFieldSeparator {
  constructor() {
    classes(() => 'tw:-my-2 tw:h-5 tw:text-sm tw:group-data-[variant=outline]/field-group:-mb-2 tw:relative');
  }
}
