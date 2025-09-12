import { Directive, computed, input } from '@angular/core';
import { BrnSelectGroup } from '@spartan-ng/brain/select';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egSelectGroup], eg-select-group',
  hostDirectives: [BrnSelectGroup],
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgSelectGroup {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn(this.userClass()));
}
