import { computed, Directive, input } from '@angular/core';
import { BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';
import { toggleVariants, ToggleVariants } from '@egose/shadcn-theme-ng/toggle';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { type HlmToggleGroupContext, injectHlmToggleGroup } from './hlm-toggle-group.token';

@Directive({
  selector: 'button[hlmToggleGroupItem]',
  hostDirectives: [
    {
      directive: BrnToggleGroupItem,
      inputs: ['id', 'value', 'disabled', 'state', 'aria-label', 'type'],
      outputs: ['stateChange'],
    },
  ],
  host: {
    'data-slot': 'toggle-group-item',
    '[attr.data-variant]': '_variant()',
    '[attr.data-size]': '_size()',
    '[attr.data-spacing]': '_toggleGroup.spacing()',
  },
})
export class HlmToggleGroupItem {
  protected readonly _toggleGroup: HlmToggleGroupContext = injectHlmToggleGroup();

  public readonly variant = input<ToggleVariants['variant']>('default');
  public readonly size = input<ToggleVariants['size']>('default');

  protected readonly _variant = computed(() => this._toggleGroup.variant() || this.variant());
  protected readonly _size = computed(() => this._toggleGroup.size() || this.size());

  constructor() {
    classes(() => [
      'tw:data-[state=on]:bg-muted tw:group-data-[spacing=0]/toggle-group:rounded-none tw:group-data-[spacing=0]/toggle-group:px-2 tw:group-data-[spacing=0]/toggle-group:shadow-none tw:group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-s-md tw:group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md tw:group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-e-md tw:group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md tw:shrink-0 tw:focus:z-10 tw:focus-visible:z-10 tw:group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-s-0 tw:group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 tw:group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-s tw:group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
      toggleVariants({
        variant: this._variant(),
        size: this._size(),
      }),
    ]);
  }
}
