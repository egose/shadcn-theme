import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EgLayoutNavigationItem } from './navigation-item';
import type { MenuItem } from './navigation';

@Component({
  selector: 'eg-layout-simple-mobile-menu-group',
  imports: [EgLayoutNavigationItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tw:block tw:empty:hidden' },
  template: `
    @if (items()?.length) {
      @if (label()) {
        <div class="tw:px-3 tw:pb-2 tw:text-xs tw:font-semibold tw:text-foreground/75">{{ label() }}</div>
      }
      <div class="tw:grid tw:gap-1">
        @for (item of items(); track $index) {
          <eg-layout-navigation-item [item]="item" (selected)="itemSelected.emit($event)" />
        }
      </div>
    }
  `,
})
export class EgLayoutSimpleMobileMenuGroup {
  readonly label = input<string>();
  readonly items = input<readonly MenuItem[]>();
  readonly itemSelected = output<MenuItem>();
}
