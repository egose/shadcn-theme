import { NumberInput } from '@angular/cdk/coercion';
import { Directive, input, numberAttribute } from '@angular/core';
import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
import { ToggleVariants } from '@egose/shadcn-theme-ng/toggle';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { provideHlmToggleGroup } from './hlm-toggle-group.token';

@Directive({
  selector: '[hlmToggleGroup],hlm-toggle-group',
  providers: [provideHlmToggleGroup(HlmToggleGroup)],
  hostDirectives: [
    {
      directive: BrnToggleGroup,
      inputs: ['type', 'value', 'nullable', 'disabled'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    'data-slot': 'toggle-group',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-spacing]': 'spacing()',
    '[attr.data-orientation]': 'orientation()',
    '[style.--gap]': 'spacing()',
  },
})
export class HlmToggleGroup {
  public readonly variant = input<ToggleVariants['variant']>('default');
  public readonly size = input<ToggleVariants['size']>('default');
  public readonly spacing = input<number, NumberInput>(0, { transform: numberAttribute });
  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  constructor() {
    classes(
      () =>
        'tw:rounded-md tw:data-[spacing=0]:data-[variant=outline]:shadow-xs tw:group/toggle-group tw:flex tw:w-fit tw:flex-row tw:items-center tw:gap-[--spacing(var(--gap))] tw:data-vertical:flex-col tw:data-vertical:items-stretch',
    );
  }
}
