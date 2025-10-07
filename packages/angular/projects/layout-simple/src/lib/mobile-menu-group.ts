import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmMenuLabel, HlmMenuGroup, HlmMenuItem } from '@egose/shadcn-theme-ng/menu';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'eg-layout-simple-mobile-menu-group',
  imports: [HlmMenuItem, HlmMenuLabel, HlmMenuGroup, NgIcon, RouterLink],
  providers: [],
  template: `
    @let _label = label();
    @let _items = items();

    @if (_items && _items.length > 0) {
      @if (_label) {
        <hlm-menu-label>{{ _label }}</hlm-menu-label>
      }
      <hlm-menu-group>
        @for (item of _items; track item.label) {
          @if (item.link) {
            <a hlmMenuItem [routerLink]="item.link" [class]="hlm('tw:cursor-pointer')">
              @if (item.icon) {
                <ng-icon
                  [svg]="item.icon"
                  size="1rem"
                  [class]="hlm('tw:[_svg]:text-[inherit]! tw:[_svg]:bg-[inherit]! tw:cursor-pointer tw:mr-2')"
                >
                </ng-icon>
              }
              <span>{{ item.label }}</span>
            </a>
          } @else {
            <button hlmMenuItem (click)="item.action?.()" [class]="hlm('tw:cursor-pointer')">
              @if (item.icon) {
                <ng-icon
                  [svg]="item.icon"
                  size="1rem"
                  [class]="hlm('tw:[_svg]:text-[inherit]! tw:[_svg]:bg-[inherit]! tw:cursor-pointer tw:mr-2')"
                >
                </ng-icon>
              }
              <span>{{ item.label }}</span>
            </button>
          }
        }
      </hlm-menu-group>
    }
  `,
})
export class EgLayoutSimpleMobileMenuGroup {
  label = input<string | undefined>('');
  items = input<
    {
      label: string;
      link?: string;
      icon?: string;
      action?: () => void;
    }[]
  >();

  hlm = hlm;
}
