import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnTabs } from '@spartan-ng/brain/tabs';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'eg-tabs',
  hostDirectives: [
    {
      directive: BrnTabs,
      inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
      outputs: ['tabActivated'],
    },
  ],
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgTabs {
  public readonly tab = input.required<string>();

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn('tw:flex tw:flex-col tw:gap-2', this.userClass()));
}
