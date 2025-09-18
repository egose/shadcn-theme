import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { BrnDialogClose, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { HlmDialogClose } from './dialog-close';

@Component({
  selector: 'hlm-dialog-content',
  imports: [NgComponentOutlet, BrnDialogClose, HlmDialogClose, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideX })],
  host: {
    '[class]': '_computedClass()',
    '[attr.data-state]': 'state()',
  },
  template: `
    @if (component) {
      <ng-container [ngComponentOutlet]="component" />
    } @else {
      <ng-content />
    }

    <button brnDialogClose hlm>
      <span class="tw:sr-only">Close</span>
      <ng-icon hlm size="sm" name="lucideX" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HlmDialogContent {
  private readonly _dialogRef = inject(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext({ optional: true });

  public readonly state = computed(() => this._dialogRef?.state() ?? 'closed');

  public readonly component = this._dialogContext?.$component;
  private readonly _dynamicComponentClass = this._dialogContext?.$dynamicComponentClass;

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:bg-background tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:zoom-in-95 tw:relative tw:z-50 tw:mx-auto tw:grid tw:w-full tw:max-w-[calc(100%-2rem)] tw:gap-4 tw:rounded-lg tw:border tw:p-6 tw:shadow-lg tw:data-[state=closed]:duration-200 tw:data-[state=open]:duration-200 tw:sm:mx-0 tw:sm:max-w-lg',
      this.userClass(),
      this._dynamicComponentClass,
    ),
  );
}
