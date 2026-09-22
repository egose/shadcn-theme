import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrnAvatar } from '@spartan-ng/brain/avatar';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'avatar',
    '[attr.data-size]': 'size()',
  },
  template: `
    @if (_image()?.canShow()) {
      <ng-content select="[hlmAvatarImage],[brnAvatarImage]" />
    } @else {
      <ng-content select="[hlmAvatarFallback],[brnAvatarFallback]" />
    }
    <ng-content />
  `,
})
export class HlmAvatar extends BrnAvatar {
  public readonly size = input<'default' | 'sm' | 'lg'>('default');

  constructor() {
    super();
    classes(
      () =>
        'tw:size-8 tw:rounded-full tw:after:rounded-full tw:data-[size=lg]:size-10 tw:data-[size=sm]:size-6 tw:group/avatar tw:after:border-border tw:relative tw:flex tw:shrink-0 tw:select-none tw:after:absolute tw:after:inset-0 tw:after:border tw:after:mix-blend-darken tw:dark:after:mix-blend-lighten',
    );
  }
}
