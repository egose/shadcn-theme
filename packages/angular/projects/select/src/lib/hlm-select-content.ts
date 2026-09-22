import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnSelectContent } from '@spartan-ng/brain/select';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmSelectScrollDown } from './hlm-select-scroll-down';
import { HlmSelectScrollUp } from './hlm-select-scroll-up';

@Component({
  selector: 'hlm-select-content',
  imports: [HlmSelectScrollUp, HlmSelectScrollDown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnSelectContent],
  template: `
    @if (showScroll()) {
      <hlm-select-scroll-up />
    }

    <div role="listbox" [class]="_computedListboxClasses()">
      <ng-content />
    </div>

    @if (showScroll()) {
      <hlm-select-scroll-down />
    }
  `,
})
export class HlmSelectContent {
  protected readonly _computedListboxClasses = computed(() => hlm('tw:flex tw:flex-col'));

  public readonly showScroll = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  constructor() {
    classes(
      () =>
        'tw:bg-popover no-scrollbar tw:text-popover-foreground tw:data-open:animate-in tw:data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 tw:data-closed:zoom-out-95 tw:data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 tw:ring-foreground/10 tw:max-h-72 tw:min-w-36 tw:flex-col tw:rounded-md tw:shadow-md tw:ring-1 tw:duration-100 tw:relative tw:flex tw:w-(--brn-select-width) tw:overflow-x-hidden tw:overflow-y-auto',
    );
  }
}
