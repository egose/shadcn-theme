import { Directive, computed, inject, input } from '@angular/core';
import { BrnSelectLabel } from '@spartan-ng/brain/select';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { HlmSelectContent } from './select-content';

@Directive({
  selector: '[hlmSelectLabel], hlm-select-label',
  hostDirectives: [BrnSelectLabel],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSelectLabel {
  private readonly _selectContent = inject(HlmSelectContent);
  private readonly _stickyLabels = computed(() => this._selectContent.stickyLabels());
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:text-muted-foreground tw:px-2 tw:py-1.5 tw:text-xs',
      this._stickyLabels() ? 'tw:bg-popover tw:sticky tw:top-0 tw:z-[2] tw:block' : '',
      this.userClass(),
    ),
  );
}
