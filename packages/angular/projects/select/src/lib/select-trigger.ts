import { ChangeDetectionStrategy, Component, computed, contentChild, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelect, BrnSelectTrigger } from '@spartan-ng/brain/select';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const selectTriggerVariants = cva(
  `tw:border-input tw:[&>ng-icon]:text-muted-foreground tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:dark:bg-input/10 tw:dark:hover:bg-input/50 tw:shadow-xs tw:flex tw:w-fit tw:items-center tw:justify-between tw:gap-2 tw:whitespace-nowrap tw:rounded-md tw:border tw:bg-transparent tw:px-3 tw:py-2 tw:text-sm tw:outline-none tw:transition-[color,box-shadow] tw:focus-visible:ring-[3px] tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:data-[size=default]:h-9 tw:data-[size=sm]:h-8 tw:[&>ng-icon]:pointer-events-none tw:[&>ng-icon]:size-4 tw:[&>ng-icon]:shrink-0`,
  {
    variants: {
      error: {
        auto: 'tw:[&.ng-invalid.ng-touched]:text-destructive tw:[&.ng-invalid.ng-touched]:border-destructive tw:[&.ng-invalid.ng-touched]:focus-visible:ring-destructive/20 tw:dark:[&.ng-invalid.ng-touched]:focus-visible:ring-destructive/40',
        true: 'tw:text-destructive tw:border-destructive tw:focus-visible:ring-destructive/20 tw:dark:focus-visible:ring-destructive/40',
      },
    },
    defaultVariants: {
      error: 'auto',
    },
  },
);

@Component({
  selector: 'hlm-select-trigger',
  imports: [BrnSelectTrigger, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <button [class]="_computedClass()" #button egInput brnSelectTrigger type="button" [attr.data-size]="size()">
      <ng-content />
      @if (_icon()) {
        <ng-content select="ng-icon" />
      } @else {
        <ng-icon hlm size="sm" class="tw:ml-2 tw:flex-none" name="lucideChevronDown" />
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSelectTrigger {
  protected readonly _icon = contentChild(HlmIcon);

  protected readonly _brnSelect = inject(BrnSelect, { optional: true });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  public readonly size = input<'default' | 'sm'>('default');

  protected readonly _computedClass = computed(() =>
    hlm(selectTriggerVariants({ error: this._brnSelect?.errorState() }), this.userClass()),
  );
}
