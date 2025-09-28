import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-menu-label',
  template: ` <ng-content /> `,
  host: {
    '[class]': '_computedClass()',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuLabel {
  public readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm('tw:block tw:px-2 tw:py-1.5 tw:text-sm tw:font-medium tw:data-[inset]:pl-8', this.userClass()),
  );
}
