import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideUser } from '@ng-icons/lucide';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuGroup,
  HlmDropdownMenuItem,
  HlmDropdownMenuLabel,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuTrigger,
} from '@egose/shadcn-theme-ng/dropdown-menu';
import { NgIcon } from '@ng-icons/core';
import { navigationMatchOptions, type MenuItem } from './navigation';

// Interface for menu items
export type UserMenuItem = MenuItem;

// Interface for menu sections
export interface UserMenuSection {
  label?: string;
  separator?: boolean;
  items?: readonly UserMenuItem[];
}

@Component({
  selector: 'eg-layout-simple-user-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HlmDropdownMenu,
    HlmDropdownMenuTrigger,
    HlmDropdownMenuItem,
    HlmDropdownMenuLabel,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuGroup,
    HlmButton,
    NgIcon,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [
    provideIcons({
      lucideUser,
    }),
  ],
  template: `
    <ng-template #iconTemplate>
      <ng-icon [svg]="userIcon" size="1.25rem" aria-hidden="true" />
    </ng-template>

    @let customTrigger = triggerTemplate();

    <div class="tw:flex tw:w-full tw:items-center tw:justify-center">
      @if (customTrigger) {
        <button
          type="button"
          [hlmDropdownMenuTrigger]="menu"
          [attr.aria-label]="triggerLabel()"
          class="tw:min-h-11 tw:min-w-11 tw:rounded-full tw:cursor-pointer tw:bg-transparent tw:border-0 tw:p-0 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-ring"
        >
          <ng-container *ngTemplateOutlet="customTrigger" />
        </button>
      } @else {
        <button
          hlmButton
          type="button"
          variant="secondary"
          appearance="outline"
          size="icon"
          [hlmDropdownMenuTrigger]="menu"
          [icon]="iconTemplate"
          [attr.aria-label]="triggerLabel()"
          class="tw:size-11 tw:rounded-full tw:border tw:border-border tw:text-foreground"
        ></button>
      }

      <ng-template #menu>
        <div hlmDropdownMenu class="tw:w-56">
          @for (section of sections(); track $index) {
            @if (section.label) {
              <div hlmDropdownMenuLabel>{{ section.label }}</div>
            }
            @if (section.items?.length) {
              <div hlmDropdownMenuGroup>
                @for (item of section.items; track item) {
                  @if (item.link && !item.disabled) {
                    <a
                      hlmDropdownMenuItem
                      [routerLink]="item.link"
                      routerLinkActive="tw:bg-foreground/10 tw:font-semibold"
                      [routerLinkActiveOptions]="navigationMatchOptions(item)"
                      ariaCurrentWhenActive="page"
                      [class]="hlm('tw:min-h-11 tw:cursor-pointer tw:no-underline', item.class)"
                    >
                      @if (item.icon) {
                        <ng-icon
                          [svg]="item.icon"
                          aria-hidden="true"
                          size="1rem"
                          [class]="
                            hlm(
                              'tw:[_svg]:text-[inherit]! tw:[_svg]:bg-[inherit]! tw:cursor-pointer tw:mr-2',
                              item.class
                            )
                          "
                        />
                      }
                      <span>{{ item.label }}</span>
                    </a>
                  } @else {
                    <button
                      hlmDropdownMenuItem
                      type="button"
                      [disabled]="item.disabled || !item.action"
                      (click)="item.action?.()"
                      [class]="hlm('tw:min-h-11 tw:cursor-pointer tw:no-underline', item.class)"
                    >
                      @if (item.icon) {
                        <ng-icon
                          [svg]="item.icon"
                          aria-hidden="true"
                          size="1rem"
                          [class]="
                            hlm(
                              'tw:[_svg]:text-[inherit]! tw:[_svg]:bg-[inherit]! tw:cursor-pointer tw:mr-2',
                              item.class
                            )
                          "
                        />
                      }
                      <span>{{ item.label }}</span>
                    </button>
                  }
                }
              </div>
            }
            @if (section.separator) {
              <div hlmDropdownMenuSeparator></div>
            }
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class EgLayoutSimpleUserMenu {
  protected readonly hlm = hlm;
  protected readonly navigationMatchOptions = navigationMatchOptions;
  protected readonly userIcon = lucideUser;

  readonly sections = input<readonly UserMenuSection[]>([]);
  readonly triggerTemplate = input<TemplateRef<unknown>>();
  readonly triggerLabel = input('Open account menu');
}
