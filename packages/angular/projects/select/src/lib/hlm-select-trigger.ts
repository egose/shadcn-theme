import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnSelectTrigger } from '@spartan-ng/brain/select';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-select-trigger',
  imports: [NgIcon, BrnSelectTrigger, BrnFieldControlDescribedBy],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnSelectTrigger
      brnFieldControlDescribedBy
      [forceInvalid]="forceInvalid()"
      [id]="buttonId()"
      [aria-describedby]="ariaDescribedby()"
      [attr.disabled]="wrapperDisabled() ? '' : null"
      [class]="_computedClass()"
      [attr.data-size]="size()"
      data-slot="select-trigger"
    >
      <ng-content />
      <ng-icon name="lucideChevronDown" class="tw:text-muted-foreground tw:text-[length:--spacing(4)] tw:ms-auto" />
    </button>
  `,
})
export class HlmSelectTrigger {
  private static _id = 0;

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:border-input tw:data-placeholder:text-muted-foreground tw:dark:bg-input/30 tw:dark:hover:bg-input/50 tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:dark:data-[matches-spartan-invalid=true]:border-destructive/50 tw:gap-1.5 tw:rounded-md tw:border tw:bg-transparent tw:py-2 tw:ps-2.5 tw:pe-2 tw:text-sm tw:shadow-xs tw:transition-[color,box-shadow] tw:focus-visible:ring-3 tw:data-[matches-spartan-invalid=true]:ring-3 tw:data-[size=default]:h-9 tw:data-[size=sm]:h-8 tw:*:data-[slot=select-value]:gap-1.5 tw:flex tw:w-fit tw:items-center tw:justify-between tw:whitespace-nowrap tw:outline-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:*:data-[slot=select-value]:line-clamp-1 tw:*:data-[slot=select-value]:flex tw:*:data-[slot=select-value]:items-center tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0',
      this.userClass(),
    ),
  );

  public readonly buttonId = input<string>(`hlm-select-trigger-${HlmSelectTrigger._id++}`);

  public readonly ariaDescribedby = input<string | null>(null);

  public readonly wrapperDisabled = input(false);

  public readonly size = input<'default' | 'sm'>('default');

  /** Whether to force the trigger into an invalid state. */
  public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
