import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { BrnAccordionContent } from '@spartan-ng/brain/accordion';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-accordion-content',
  template: `
    <div [attr.inert]="_addInert()" style="tw:overflow:hidden">
      <div class="tw:flex tw:flex-col tw:gap-4 tw:text-balance tw:pb-4 tw:pt-0">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmAccordionContent extends BrnAccordionContent {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => {
    const gridRows = this.state() === 'open' ? 'tw:grid-rows-[1fr]' : 'tw:hidden';
    return hlm('tw:grid tw:text-sm tw:transition-all', gridRows, this.userClass());
  });
}
