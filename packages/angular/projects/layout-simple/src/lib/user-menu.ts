import { Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUser } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmMenu, HlmMenuGroup, HlmMenuItem, HlmMenuLabel, HlmMenuSeparator } from '@egose/shadcn-theme-ng/menu';
import { NgIcon } from '@ng-icons/core';

// Interface for menu items
export interface UserMenuItem {
  label: string;
  icon?: any;
  action?: () => void;
  link?: string;
  class?: string;
}

// Interface for menu sections
export interface UserMenuSection {
  label?: string;
  separator?: boolean;
  items?: UserMenuItem[];
}

@Component({
  selector: 'eg-layout-simple-user-menu',
  imports: [
    BrnMenuTrigger,
    HlmMenu,
    HlmMenuItem,
    HlmMenuLabel,
    HlmMenuSeparator,
    HlmMenuGroup,
    HlmButton,
    NgIcon,
    RouterLink,
  ],
  providers: [
    provideIcons({
      lucideUser,
    }),
  ],
  template: `
    <ng-template #iconTemplate>
      <ng-icon [svg]="lucideUser" size="1.5rem" />
    </ng-template>

    <div class="tw:flex tw:w-full tw:items-center tw:justify-center tw:pt-[20%]">
      <button
        hlmButton
        variant="primary"
        size="icon"
        align="end"
        [brnMenuTriggerFor]="menu"
        [icon]="iconTemplate"
        class="tw:rounded-full tw:border tw:border-gray-400"
      ></button>
    </div>

    <ng-template #menu>
      <hlm-menu class="tw:w-56">
        @for (section of menus(); track section) {
          @if (section.label) {
            <hlm-menu-label>{{ section.label }}</hlm-menu-label>
          }
          @if (section.items?.length) {
            <hlm-menu-group>
              @for (item of section.items; track item) {
                @if (item.link) {
                  <a hlmMenuItem [routerLink]="item.link" [class]="hlm(item.class, 'tw:cursor-pointer')">
                    @if (item.icon) {
                      <ng-icon [svg]="item.icon" size="1rem" [class]="hlm(item.class, 'tw:cursor-pointer tw:mr-2')" />
                    }
                    <span>{{ item.label }}</span>
                  </a>
                } @else {
                  <button hlmMenuItem (click)="item.action?.()" [class]="hlm(item.class, 'tw:cursor-pointer')">
                    @if (item.icon) {
                      <ng-icon [svg]="item.icon" size="1rem" [class]="hlm(item.class, 'tw:cursor-pointer tw:mr-2')" />
                    }
                    <span>{{ item.label }}</span>
                  </button>
                }
              }
            </hlm-menu-group>
          }
          @if (section.separator) {
            <hlm-menu-separator />
          }
        }
      </hlm-menu>
    </ng-template>
  `,
})
export class EgLayoutSimpleUserMenu {
  menus = input<UserMenuSection[]>([]);

  hlm = hlm;
  lucideUser = lucideUser;
}
