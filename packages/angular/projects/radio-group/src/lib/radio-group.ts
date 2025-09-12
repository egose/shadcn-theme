import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'eg-radio-group',
  hostDirectives: [
    {
      directive: BrnRadioGroup,
      inputs: ['name', 'value', 'disabled', 'required', 'direction'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    '[class]': '_computedClass()',
  },
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgRadioGroup {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn('tw:grid tw:gap-3', this.userClass()));
}
