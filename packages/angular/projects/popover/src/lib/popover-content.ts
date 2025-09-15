import { Directive, ElementRef, Renderer2, computed, effect, inject, input, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmPopoverContent],[brnPopoverContent][hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmPopoverContent {
  private readonly _stateProvider = injectExposesStateProvider({ host: true });
  public state = this._stateProvider.state ?? signal('closed');
  private readonly _renderer = inject(Renderer2);
  private readonly _element = inject(ElementRef);

  constructor() {
    effect(() => {
      this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
    });
  }

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:border-border tw:bg-popover tw:text-popover-foreground tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:zoom-in-95 tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:relative tw:w-72 tw:rounded-md tw:border tw:p-4 tw:shadow-md tw:outline-none',
      this.userClass(),
    ),
  );
}
