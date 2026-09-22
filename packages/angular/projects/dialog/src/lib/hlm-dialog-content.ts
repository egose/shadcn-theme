import type { BooleanInput } from '@angular/cdk/coercion';
import type { ComponentType } from '@angular/cdk/portal';
import { NgComponentOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmBtn } from '@egose/shadcn-theme-ng/button';

import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmDialogClose } from './hlm-dialog-close';

type HlmDialogContentContext = {
  $component?: ComponentType<unknown>;
  $dynamicComponentClass?: string;
  $showCloseButton?: boolean;
};

@Component({
  selector: 'hlm-dialog-content',
  imports: [NgComponentOutlet, HlmBtn, HlmDialogClose, NgIcon],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'dialog-content',
    '[attr.data-state]': 'state()',
  },
  template: `
    @if (component) {
      <ng-container [ngComponentOutlet]="component" />
    } @else {
      <ng-content />
    }

    @if (showCloseButton()) {
      <button hlmBtn variant="ghost" size="icon-sm" class="tw:absolute tw:end-4 tw:top-4" hlmDialogClose>
        <span class="tw:sr-only">close</span>
        <ng-icon name="lucideX" />
      </button>
    }
  `,
})
export class HlmDialogContent {
  private readonly _dialogRef = inject(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<HlmDialogContentContext | null>({ optional: true });

  public readonly showCloseButton = input<boolean, BooleanInput>(this._dialogContext?.$showCloseButton ?? true, {
    transform: booleanAttribute,
  });

  public readonly state = computed(() => this._dialogRef?.state() ?? 'closed');

  public readonly component = this._dialogContext?.$component;
  private readonly _dynamicComponentClass = this._dialogContext?.$dynamicComponentClass;

  constructor() {
    classes(() => [
      'tw:bg-popover tw:text-popover-foreground tw:data-open:animate-in tw:data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 tw:data-closed:zoom-out-95 tw:data-open:zoom-in-95 tw:ring-foreground/10 tw:grid tw:max-w-[calc(100%-2rem)] tw:gap-6 tw:rounded-xl tw:p-6 tw:text-sm tw:ring-1 tw:duration-100 tw:sm:max-w-md tw:relative tw:mx-auto tw:w-full tw:outline-none tw:sm:mx-0',
      this._dynamicComponentClass,
    ]);
  }
}
