import { Component, signal } from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

/**
 * Consumer demo for the public `@egose/shadcn-theme-ng/menu` primitives.
 *
 * Only public exports are used (`HlmMenuImports` plus `HlmMenu`/`HlmSubMenu`
 * through that same barrel, and `CdkMenuTrigger` from `@angular/cdk/menu` for
 * overlay positioning — the same trigger contract the package's own
 * dropdown-menu wrapper builds on). The overlay menu below demonstrates
 * standard items, shortcuts, groups, separators, checkbox and radio items,
 * a disabled item, and a submenu. Every choice records a deterministic local
 * outcome instead of logging to the console.
 *
 * Note: the package's check/radio indicators become visible through the
 * `.checked` class on the item, so the demo binds that class from the same
 * signal that drives each item's `checked` state.
 */
@Component({
  selector: 'app-menu-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmMenuImports, HlmButton, CdkMenuTrigger],
  template: `
    <app-demo-header
      title="Menu"
      description="A button-triggered overlay menu built from the public menu primitives: standard items with shortcuts, grouped checkbox and radio items, a disabled item, and a submenu."
    />

    <app-demo-section
      title="Account menu"
      description="Open the menu, move with the arrow keys, and choose an item. Toggles update their own state and every choice is announced below."
    >
      <div class="tw:w-full tw:max-w-xs">
        <button hlmButton type="button" [cdkMenuTriggerFor]="accountMenu">Open account menu</button>

        <ng-template #accountMenu>
          <hlm-menu aria-label="Account">
            <hlm-menu-label>My account</hlm-menu-label>
            <button hlmMenuItem type="button" (triggered)="choose('Profile')">
              Profile
              <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
            </button>
            <button hlmMenuItem type="button" (triggered)="choose('Settings')">
              Settings
              <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
            </button>

            <hlm-menu-separator />

            <hlm-menu-label>Preferences</hlm-menu-label>
            <hlm-menu-group aria-label="Preferences">
              <button
                hlmMenuItemCheckbox
                type="button"
                [checked]="showBookmarks()"
                [class.checked]="showBookmarks()"
                (triggered)="toggleBookmarks()"
              >
                <hlm-menu-item-check />
                Show bookmarks bar
              </button>
              <button
                hlmMenuItemCheckbox
                type="button"
                [checked]="showFullUrls()"
                [class.checked]="showFullUrls()"
                (triggered)="toggleFullUrls()"
              >
                <hlm-menu-item-check />
                Show full URLs
              </button>
            </hlm-menu-group>

            <hlm-menu-separator />

            <hlm-menu-label>Profile visibility</hlm-menu-label>
            <hlm-menu-group aria-label="Profile visibility">
              <button
                hlmMenuItemRadio
                type="button"
                [checked]="visibility() === 'public'"
                [class.checked]="visibility() === 'public'"
                (triggered)="setVisibility('public')"
              >
                <hlm-menu-item-radio />
                Public
              </button>
              <button
                hlmMenuItemRadio
                type="button"
                [checked]="visibility() === 'private'"
                [class.checked]="visibility() === 'private'"
                (triggered)="setVisibility('private')"
              >
                <hlm-menu-item-radio />
                Private
              </button>
            </hlm-menu-group>

            <hlm-menu-separator />

            <button hlmMenuItem type="button" [cdkMenuTriggerFor]="shareMenu">
              Share
              <hlm-menu-item-sub-indicator />
            </button>
            <button
              hlmMenuItem
              type="button"
              disabled
              title="Disabled demo item: billing management needs an admin account"
              (triggered)="choose('Manage billing')"
            >
              Manage billing
            </button>
            <button hlmMenuItem type="button" (triggered)="choose('Log out')">Log out</button>
          </hlm-menu>
        </ng-template>

        <ng-template #shareMenu>
          <hlm-sub-menu aria-label="Share">
            <button hlmMenuItem type="button" (triggered)="choose('Copy invite link')">Copy invite link</button>
            <button hlmMenuItem type="button" (triggered)="choose('Email invite')">Email invite</button>
          </hlm-sub-menu>
        </ng-template>
      </div>
    </app-demo-section>

    @if (menuMessage()) {
      <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">{{ menuMessage() }}</p>
    }
  `,
})
export class MenuPage {
  readonly showBookmarks = signal(true);
  readonly showFullUrls = signal(false);
  readonly visibility = signal<'public' | 'private'>('public');
  readonly menuMessage = signal<string | null>(null);

  choose(label: string) {
    this.menuMessage.set(`${label} selected from the account menu.`);
  }

  toggleBookmarks() {
    this.showBookmarks.update((visible) => !visible);
    this.menuMessage.set(`Bookmarks bar ${this.showBookmarks() ? 'shown' : 'hidden'}.`);
  }

  toggleFullUrls() {
    this.showFullUrls.update((visible) => !visible);
    this.menuMessage.set(`Full URLs ${this.showFullUrls() ? 'shown' : 'hidden'}.`);
  }

  setVisibility(visibility: 'public' | 'private') {
    this.visibility.set(visibility);
    this.menuMessage.set(`Profile visibility set to ${visibility}.`);
  }
}
