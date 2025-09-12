import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnSelectOption } from '@spartan-ng/brain/select';
import { EgIcon } from '@egose/shadcn-theme-ng/icon';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'eg-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnSelectOption, inputs: ['disabled', 'value'] }],
  providers: [provideIcons({ lucideCheck })],
  host: {
    '[class]': '_computedClass()',
  },
  template: `
    <span class="tw:absolute tw:right-2 tw:flex tw:size-3.5 tw:items-center tw:justify-center">
      @if (this._brnSelectOption.selected()) {
        <ng-icon eg size="sm" aria-hidden="true" name="lucideCheck" />
      }
    </span>

    <ng-content />
  `,
  imports: [NgIcon, EgIcon],
})
export class EgSelectOption {
  protected readonly _brnSelectOption = inject(BrnSelectOption, { host: true });
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:data-[active]:bg-accent tw:data-[active]:text-accent-foreground tw:[&>ng-icon]:text-muted-foreground tw:*:[span]:last:flex tw:*:[span]:last:items-center tw:*:[span]:last:gap-2 tw:relative tw:flex tw:w-full tw:cursor-default tw:select-none tw:items-center tw:gap-2 tw:rounded-sm tw:py-1.5 tw:pl-2 tw:pr-8 tw:text-sm tw:outline-none tw:data-[disabled]:pointer-events-none tw:data-[disabled]:opacity-50 tw:[&>ng-icon]:pointer-events-none tw:[&>ng-icon]:size-4 tw:[&>ng-icon]:shrink-0',
      this.userClass(),
    ),
  );
}
