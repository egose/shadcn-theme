import { Directive, computed, input } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egLabel]',
  hostDirectives: [
    {
      directive: BrnLabel,
      inputs: ['id'],
    },
  ],
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgLabel {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly _computedClass = computed(() =>
    cn(
      'tw:flex tw:select-none tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:leading-none tw:peer-disabled:cursor-not-allowed tw:peer-disabled:opacity-50 tw:has-[[disabled]]:cursor-not-allowed tw:has-[[disabled]]:opacity-50 tw:group-data-[disabled=true]:pointer-events-none tw:group-data-[disabled=true]:opacity-50 tw:peer-data-[disabled]:cursor-not-allowed tw:peer-data-[disabled]:opacity-50',
      this.userClass(),
    ),
  );
}
