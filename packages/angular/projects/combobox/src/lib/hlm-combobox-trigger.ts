import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnComboboxAnchor, BrnComboboxPopoverTrigger, BrnComboboxTrigger } from '@spartan-ng/brain/combobox';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { ButtonVariants, HlmBtn } from '@egose/shadcn-theme-ng/button';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-combobox-trigger',
  imports: [
    NgIcon,
    HlmBtn,
    BrnComboboxAnchor,
    BrnComboboxTrigger,
    BrnComboboxPopoverTrigger,
    BrnFieldControlDescribedBy,
  ],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnComboboxTrigger
      brnComboboxAnchor
      brnComboboxPopoverTrigger
      brnFieldControlDescribedBy
      hlmBtn
      data-slot="combobox-trigger"
      [id]="buttonId()"
      [aria-describedby]="ariaDescribedBy()"
      [attr.aria-required]="required() || null"
      [class]="_computedClass()"
      [variant]="variant()"
      [forceInvalid]="forceInvalid()"
    >
      <ng-content />
      <ng-icon name="lucideChevronDown" class="tw:text-muted-foreground tw:text-[length:--spacing(4)]" />
    </button>
  `,
})
export class HlmComboboxTrigger {
  private static _id = 0;

  public readonly userClass = input<ClassValue>('', {
    alias: 'class',
  });
  protected readonly _computedClass = computed(() =>
    hlm('tw:data-placeholder:text-muted-foreground', this.userClass()),
  );

  public readonly buttonId = input<string>(`hlm-combobox-trigger-${HlmComboboxTrigger._id++}`);

  /** Native button description IDs, merged with enclosing Spartan field descriptions. */
  public readonly ariaDescribedBy = input<string | null>(null, { alias: 'aria-describedby' });
  public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  public readonly variant = input<ButtonVariants['variant']>('outline');

  public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
