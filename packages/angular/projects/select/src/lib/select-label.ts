import { Directive, computed, inject, input } from '@angular/core';
import { BrnSelectLabel } from '@spartan-ng/brain/select';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { EgSelectContent } from './select-content';

@Directive({
  selector: '[egSelectLabel], eg-select-label',
  hostDirectives: [BrnSelectLabel],
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgSelectLabel {
  private readonly _selectContent = inject(EgSelectContent);
  private readonly _stickyLabels = computed(() => this._selectContent.stickyLabels());
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:text-muted-foreground tw:px-2 tw:py-1.5 tw:text-xs',
      this._stickyLabels() ? 'tw:bg-popover tw:sticky tw:top-0 tw:z-[2] tw:block' : '',
      this.userClass(),
    ),
  );
}
