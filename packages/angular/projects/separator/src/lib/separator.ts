import { computed, Directive, input } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmSeparator],hlm-separator',
  hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSeparator {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm(
      'tw:bg-border tw:inline-flex tw:shrink-0 tw:data-[orientation=horizontal]:h-px tw:data-[orientation=vertical]:h-full tw:data-[orientation=horizontal]:w-full tw:data-[orientation=vertical]:w-px',
      this.userClass(),
    ),
  );
}
