import { Directive, computed, effect, input, untracked } from '@angular/core';
import { injectCustomClassSettable } from '@spartan-ng/brain/core';
import { BrnDrawerOverlay } from '@spartan-ng/brain/drawer';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmDrawerOverlay],hlm-drawer-overlay',
  hostDirectives: [BrnDrawerOverlay],
})
export class HlmDrawerOverlay {
  private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:data-open:animate-in tw:data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 tw:bg-black/10 tw:supports-backdrop-filter:backdrop-blur-xs tw:transition-opacity tw:duration-150 tw:data-ending-style:opacity-0 tw:data-starting-style:opacity-0',
      this.userClass(),
    ),
  );

  constructor() {
    effect(() => {
      const classValue = this._computedClass();
      untracked(() => this._classSettable?.setClassToCustomElement(classValue));
    });
  }
}
