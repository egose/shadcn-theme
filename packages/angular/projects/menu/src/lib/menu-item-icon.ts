import { Directive, computed, input } from '@angular/core';
import { provideHlmIconConfig } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmMenuIcon]',
  providers: [provideHlmIconConfig({ size: 'sm' })],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmMenuItemIcon {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() => hlm('tw:mr-2', this.userClass()));
}
