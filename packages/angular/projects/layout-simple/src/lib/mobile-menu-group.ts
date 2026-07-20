import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'eg-layout-simple-mobile-menu-group',
  imports: [NgIcon, RouterLink],
  providers: [],
  template: `
    @let _label = label();
    @let _items = items();

    @if (_items && _items.length > 0) {
      @if (_label) {
        <div class="tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-muted-foreground">{{ _label }}</div>
      }
      <div class="tw:flex tw:flex-col">
        @for (item of _items; track item.label) {
          @if (item.link) {
            <a
              [routerLink]="item.link"
              [class]="
                hlm(
                  'tw:cursor-pointer tw:no-underline tw:px-3 tw:py-2 tw:text-sm tw:hover:bg-secondary tw:rounded-sm tw:flex tw:items-center tw:gap-2'
                )
              "
              (click)="handleClick(item)"
            >
              @if (item.icon) {
                <ng-icon [svg]="item.icon" size="1rem" [class]="hlm('tw:cursor-pointer tw:mr-2')"> </ng-icon>
              }
              <span>{{ item.label }}</span>
            </a>
          } @else {
            <button
              type="button"
              (click)="handleClick(item)"
              [class]="
                hlm(
                  'tw:cursor-pointer tw:no-underline tw:px-3 tw:py-2 tw:text-sm tw:hover:bg-secondary tw:rounded-sm tw:flex tw:items-center tw:gap-2 tw:bg-transparent tw:border-0 tw:text-left tw:w-full'
                )
              "
            >
              @if (item.icon) {
                <ng-icon [svg]="item.icon" size="1rem" [class]="hlm('tw:cursor-pointer tw:mr-2')"> </ng-icon>
              }
              <span>{{ item.label }}</span>
            </button>
          }
        }
      </div>
    }
  `,
})
export class EgLayoutSimpleMobileMenuGroup {
  hlm = hlm;

  label = input<string | undefined>('');
  items = input<
    {
      label: string;
      link?: string;
      icon?: string;
      action?: () => void;
    }[]
  >();

  itemClick = output<any>();

  handleClick(item: any) {
    item.action?.();
    this.itemClick.emit(item);
  }
}
