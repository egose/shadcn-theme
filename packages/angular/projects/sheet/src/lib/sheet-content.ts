import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnSheetClose } from '@spartan-ng/brain/sheet';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { HlmSheetClose } from './sheet-close';

export const sheetVariants = cva(
  'tw:bg-background tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:fixed tw:z-50 tw:flex tw:flex-col tw:gap-4 tw:shadow-lg tw:transition tw:ease-in-out tw:data-[state=closed]:duration-300 tw:data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'tw:data-[state=closed]:slide-out-to-top tw:data-[state=open]:slide-in-from-top tw:inset-x-0 tw:top-0 tw:h-auto tw:border-b',
        bottom:
          'tw:data-[state=closed]:slide-out-to-bottom tw:data-[state=open]:slide-in-from-bottom tw:inset-x-0 tw:bottom-0 tw:h-auto tw:border-t',
        left: 'tw:data-[state=closed]:slide-out-to-left tw:data-[state=open]:slide-in-from-left tw:inset-y-0 tw:left-0 tw:h-full tw:w-3/4 tw:border-r tw:sm:max-w-sm',
        right:
          'tw:data-[state=closed]:slide-out-to-right tw:data-[state=open]:slide-in-from-right tw:inset-y-0 tw:right-0 tw:h-full tw:w-3/4 tw:border-l tw:sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

@Component({
  selector: 'hlm-sheet-content',
  imports: [HlmSheetClose, BrnSheetClose, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideX })],
  host: {
    '[class]': '_computedClass()',
    '[attr.data-state]': 'state()',
  },
  template: `
    <ng-content />
    <button brnSheetClose hlm class="tw:cursor-pointer">
      <span class="tw:sr-only">Close</span>
      <ng-icon hlm size="sm" name="lucideX" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSheetContent {
  private readonly _stateProvider = injectExposesStateProvider({ host: true });
  private readonly _sideProvider = injectExposedSideProvider({ host: true });
  public readonly state = this._stateProvider.state ?? signal('closed');
  private readonly _renderer = inject(Renderer2);
  private readonly _element = inject(ElementRef);

  constructor() {
    effect(() => {
      this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
    });
  }

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(sheetVariants({ side: this._sideProvider.side() }), this.userClass()),
  );
}
