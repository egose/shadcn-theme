import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { BrnCommandInput } from '@spartan-ng/brain/command';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-command-input',
  imports: [HlmInputGroupImports, NgIcon, BrnCommandInput],
  providers: [provideIcons({ lucideSearch })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'command-input-wrapper',
  },
  template: `
    <hlm-input-group
      class="tw:bg-input/30 tw:border-input/30 tw:h-8! tw:rounded-lg! tw:shadow-none! tw:*:data-[slot=input-group-addon]:pl-2!"
    >
      <input
        brnCommandInput
        data-slot="command-input"
        class="tw:w-full tw:text-sm tw:outline-hidden tw:disabled:cursor-not-allowed tw:disabled:opacity-50"
        [id]="inputId()"
        [placeholder]="placeholder()"
      />

      <hlm-input-group-addon>
        <ng-icon name="lucideSearch" class="tw:shrink-0 tw:text-[length:--spacing(4)] tw:opacity-50" />
      </hlm-input-group-addon>
    </hlm-input-group>
  `,
})
export class HlmCommandInput {
  public readonly inputId = input<string | undefined>();
  public readonly placeholder = input<string>('');

  constructor() {
    classes(() => 'tw:p-1 tw:pb-0');
  }
}
