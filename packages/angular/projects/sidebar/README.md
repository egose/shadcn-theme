# Sidebar (`@egose/shadcn-theme-ng/sidebar`)

A shadcn/ui-style **Sidebar** application shell — collapsible app navigation with header/content/footer regions, grouped menus, sub-menus, badges, search input, trigger, and a hover rail. This is the Angular equivalent of shadcn/ui `Sidebar` (`SidebarProvider`, `SidebarTrigger`, `SidebarMenu`, …).

Unlike the shadcn React version there is no `*Provider` component here: global state lives in the root-provided **`HlmSidebarService`** (open/collapsed, mobile detection, variant, cookie persistence), configured via **`provideHlmSidebarConfig`**. On desktop `HlmSidebar` renders a persistent gap + fixed container; on mobile it renders through `hlm-sheet`. Menu buttons show icon tooltips (via `BrnTooltip`) when collapsed to icon mode.

> **Ships as:** `@egose/shadcn-theme-ng/sidebar` and `@egose/shadcn-theme-ng-tw/sidebar` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';
// tw variant:
// import { HlmSidebarImports } from '@egose/shadcn-theme-ng-tw/sidebar';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain`. Icons use `@ng-icons` (`lucidePanelLeft` in the trigger), installed transitively; `HlmSidebarMenuSkeleton` depends on the `skeleton` subpath and `HlmSidebarSeparator` on the `separator` subpath.

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                                                                     | Kind                               | Selector                                                      |
| -------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `HlmSidebarWrapper`                                                        | Directive                          | `[hlmSidebarWrapper],hlm-sidebar-wrapper`                     |
| `HlmSidebar`                                                               | Component                          | `hlm-sidebar`                                                 |
| `HlmSidebarHeader`                                                         | Directive                          | `[hlmSidebarHeader],hlm-sidebar-header`                       |
| `HlmSidebarContent`                                                        | Directive                          | `[hlmSidebarContent],hlm-sidebar-content`                     |
| `HlmSidebarFooter`                                                         | Directive                          | `[hlmSidebarFooter],hlm-sidebar-footer`                       |
| `HlmSidebarGroup`                                                          | Directive                          | `[hlmSidebarGroup],hlm-sidebar-group`                         |
| `HlmSidebarGroupLabel`                                                     | Directive                          | `div[hlmSidebarGroupLabel], button[hlmSidebarGroupLabel]`     |
| `HlmSidebarGroupAction`                                                    | Directive                          | `button[hlmSidebarGroupAction]`                               |
| `HlmSidebarGroupContent`                                                   | Directive                          | `div[hlmSidebarGroupContent]`                                 |
| `HlmSidebarMenu`                                                           | Directive                          | `ul[hlmSidebarMenu]`                                          |
| `HlmSidebarMenuItem`                                                       | Directive                          | `li[hlmSidebarMenuItem]`                                      |
| `HlmSidebarMenuButton`                                                     | Directive                          | `button[hlmSidebarMenuButton], a[hlmSidebarMenuButton]`       |
| `HlmSidebarMenuAction`                                                     | Directive                          | `button[hlmSidebarMenuAction]`                                |
| `HlmSidebarMenuBadge`                                                      | Directive                          | `[hlmSidebarMenuBadge],hlm-sidebar-menu-badge`                |
| `HlmSidebarMenuSkeleton`                                                   | Component                          | `hlm-sidebar-menu-skeleton,div[hlmSidebarMenuSkeleton]`       |
| `HlmSidebarMenuSub`                                                        | Directive                          | `ul[hlmSidebarMenuSub]`                                       |
| `HlmSidebarMenuSubItem`                                                    | Directive                          | `li[hlmSidebarMenuSubItem]`                                   |
| `HlmSidebarMenuSubButton`                                                  | Directive                          | `a[hlmSidebarMenuSubButton], button[hlmSidebarMenuSubButton]` |
| `HlmSidebarSeparator`                                                      | Directive                          | `[hlmSidebarSeparator],hlm-sidebar-separator`                 |
| `HlmSidebarTrigger`                                                        | Component                          | `button[hlmSidebarTrigger]`                                   |
| `HlmSidebarRail`                                                           | Directive                          | `button[hlmSidebarRail]`                                      |
| `HlmSidebarInput`                                                          | Directive                          | `input[hlmSidebarInput]`                                      |
| `HlmSidebarInset`                                                          | Directive                          | `main[hlmSidebarInset]`                                       |
| `HlmSidebarService`                                                        | `@Injectable({providedIn:'root'})` | State store (no selector)                                     |
| `HlmSidebarConfig` (+ `provideHlmSidebarConfig`, `injectHlmSidebarConfig`) | Interface + functions              | Global config (no selector)                                   |
| `HlmSidebarImports`                                                        | `const` array                      | All directives/components above, for standalone `imports`     |
| `HlmSidebarModule`                                                         | `NgModule`                         | NgModule wrapper re-exporting `HlmSidebarImports`             |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [HlmSidebarImports],
  template: `...`,
})
export class ShellComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSidebarModule } from '@egose/shadcn-theme-ng/sidebar';

@NgModule({ imports: [HlmSidebarModule] })
export class ShellModule {}
```

## Anatomy / Structure

```html
<div hlmSidebarWrapper>
  <hlm-sidebar>
    <div hlmSidebarHeader>
      <input hlmSidebarInput placeholder="Search…" />
    </div>

    <div hlmSidebarContent>
      <div hlmSidebarGroup>
        <div hlmSidebarGroupLabel>Platform</div>
        <div hlmSidebarGroupContent>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton isActive tooltip="Dashboard">
                <ng-icon name="lucideLayoutDashboard" />
                <span>Dashboard</span>
              </button>
              <span hlmSidebarMenuBadge>3</span>
            </li>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton tooltip="Settings">
                <ng-icon name="lucideSettings" />
                <span>Settings</span>
              </button>
              <ul hlmSidebarMenuSub>
                <li hlmSidebarMenuSubItem>
                  <a hlmSidebarMenuSubButton href="/settings/profile">Profile</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div hlmSidebarFooter>…user card…</div>

    <button hlmSidebarRail aria-label="Toggle Sidebar"></button>
  </hlm-sidebar>

  <main hlmSidebarInset>
    <button hlmSidebarTrigger></button>
    <router-outlet />
  </main>
</div>
```

Host-element rules matter: menus must be `ul[hlmSidebarMenu]` / `li[hlmSidebarMenuItem]`, sub-menus `ul[hlmSidebarMenuSub]` / `li[hlmSidebarMenuSubItem]`, group content exactly `div[hlmSidebarGroupContent]`, the inset exactly `main[hlmSidebarInset]`, trigger/rail exactly `<button>`.

## API reference

### Layout: HlmSidebarWrapper / HlmSidebar / HlmSidebarInset

| Class               | Inputs                                                                                                                                                                                                                        | Description                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `HlmSidebarWrapper` | `sidebarWidth?: string` (default from config `'16rem'`), `sidebarWidthIcon?: string` (default `'3rem'`)                                                                                                                       | Root flex shell; sets `--sidebar-width` / `--sidebar-width-icon` CSS vars                |
| `HlmSidebar`        | `side?: 'left' \| 'right'` (`'left'`), `variant?: SidebarVariant` (synced with service), `collapsible?: 'offcanvas' \| 'icon' \| 'none'` (`'offcanvas'`), `sidebarWidthMobile?: string`, `sidebarContainerClass?: ClassValue` | The sidebar itself; desktop = gap + fixed container, mobile = `hlm-sheet`                |
| `HlmSidebarInset`   | —                                                                                                                                                                                                                             | `main` content area beside the sidebar; inset-variant rounding/shadow via peer selectors |

`SidebarVariant = 'sidebar' | 'floating' | 'inset'`. With `collapsible="none"` the sidebar is a plain static column (no gap/container machinery, no mobile sheet). With `"icon"`, collapsing shrinks to `--sidebar-width-icon` and labels hide; with `"offcanvas"` it slides out of view.

### HlmSidebarService (state)

Readonly signals: `open`, `openMobile`, `isMobile`, `variant`, plus `state` (`'expanded' | 'collapsed'` computed from `open`).

| Method          | Signature                                   | Description                                                         |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `setOpen`       | `setOpen(open: boolean): void`              | Expand/collapse desktop sidebar; persists to cookie                 |
| `setOpenMobile` | `setOpenMobile(open: boolean): void`        | Open/close the mobile sheet (no-op on desktop)                      |
| `setVariant`    | `setVariant(variant: SidebarVariant): void` | Switch layout variant (also synced from `HlmSidebar.variant` input) |
| `toggleSidebar` | `toggleSidebar(): void`                     | Toggles mobile sheet on mobile, desktop open state otherwise        |

Desktop state persists via cookie (`sidebar_state`, 7-day max-age by default) and restores on boot (server reads the request cookie when available). `Ctrl/Cmd+B` toggles the sidebar (configurable shortcut). Mobile is determined by `matchMedia('(max-width: <mobileBreakpoint>)')`.

### Global config: HlmSidebarConfig

Provide overrides once (e.g. in `app.config.ts`):

```ts
import { provideHlmSidebarConfig } from '@egose/shadcn-theme-ng/sidebar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHlmSidebarConfig({
      sidebarWidth: '18rem',
      sidebarWidthIcon: '3.5rem',
      mobileBreakpoint: '1024px',
      closeMobileSidebarOnMenuButtonClick: true,
    }),
  ],
};
```

| Key                                   | Default                | Description                                                 |
| ------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| `sidebarWidth`                        | `'16rem'`              | Desktop width (`--sidebar-width`)                           |
| `sidebarWidthMobile`                  | `'18rem'`              | Mobile sheet width                                          |
| `sidebarWidthIcon`                    | `'3rem'`               | Width when collapsed to icon                                |
| `sidebarCookieName`                   | `'sidebar_state'`      | Persistence cookie name                                     |
| `sidebarCookieMaxAge`                 | `604800` (7d, seconds) | Cookie max-age                                              |
| `sidebarKeyboardShortcut`             | `'b'`                  | `Ctrl/Cmd+<key>` toggle                                     |
| `mobileBreakpoint`                    | `'768px'`              | `max-width` media query for mobile mode                     |
| `closeMobileSidebarOnMenuButtonClick` | `false`                | Auto-close mobile sheet when a menu (sub-)button is clicked |

`HlmSidebarMenuButton` / `HlmSidebarMenuSubButton` expose the same flag as a per-button `closeMobileSidebarOnClick` input defaulting to the config value.

### Menu pieces

| Class                     | Inputs                                                                                                                                                                                               | Notes                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `HlmSidebarMenuButton`    | `variant?: 'default' \| 'outline'`, `size?: 'default' \| 'sm' \| 'lg'`, `isActive?: boolean`, `closeMobileSidebarOnClick?: boolean`, `tooltip` (via `BrnTooltip` host directive, `brnTooltip` alias) | Tooltip auto-shows only when collapsed to icon on desktop                        |
| `HlmSidebarMenuAction`    | `showOnHover?: boolean`                                                                                                                                                                              | Small overlay action at the row end; hidden until hover/focus when `showOnHover` |
| `HlmSidebarMenuBadge`     | —                                                                                                                                                                                                    | Count pill at the row end; hidden in icon mode                                   |
| `HlmSidebarMenuSkeleton`  | `showIcon?: boolean`                                                                                                                                                                                 | Loading row (icon _or_ text skeleton, random 50–90% width)                       |
| `HlmSidebarMenuSubButton` | `size?: 'sm' \| 'md'` (`'md'`), `isActive?: boolean`, `closeMobileSidebarOnClick?: boolean`                                                                                                          | Nested link style; hidden in icon mode                                           |
| `HlmSidebarGroupLabel`    | —                                                                                                                                                                                                    | `div` or `button` host; collapses away in icon mode                              |
| `HlmSidebarGroupAction`   | —                                                                                                                                                                                                    | `<button>` only; e.g. "+" affordance at group top-right                          |
| `HlmSidebarSeparator`     | — (wraps `HlmSeparator`)                                                                                                                                                                             | Sidebar-border divider                                                           |
| `HlmSidebarInput`         | — (wraps `HlmInput`)                                                                                                                                                                                 | `<input>` only; search-style `h-8` field                                         |
| `HlmSidebarTrigger`       | `srOnlyText?: string` (`'Toggle Sidebar'`), plus `HlmBtn` `variant`/`size` (default ghost `icon-sm`)                                                                                                 | `<button>` only; toggles via service                                             |
| `HlmSidebarRail`          | `aria-label` (`ariaLabel`, default `'Toggle Sidebar'`)                                                                                                                                               | `<button>` only; invisible hover strip that toggles collapse                     |

Header/content/footer/group/menu/item/sub/sub-item/sub-content directives take no inputs — they are pure layout slots (`data-sidebar` attributes drive the collapse CSS).

## Examples

### 1. Minimal app shell

```ts
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [HlmSidebarImports],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader><strong>Acme</strong></div>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton isActive href="/dashboard"><span>Dashboard</span></a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton href="/reports"><span>Reports</span></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div hlmSidebarFooter><span class="tw:text-xs">v1.0</span></div>
      </hlm-sidebar>

      <main hlmSidebarInset>
        <button hlmSidebarTrigger></button>
        <div class="tw:p-4">Page content</div>
      </main>
    </div>
  `,
})
export class ShellComponent {}
```

### 2. Icon-collapse with tooltips + toggle from code

```ts
import { Component, inject } from '@angular/core';
import { HlmSidebarImports, HlmSidebarService } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-icon-sidebar',
  standalone: true,
  imports: [HlmSidebarImports],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar collapsible="icon">
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <button hlmSidebarMenuButton tooltip="Dashboard" (click)="go('/dashboard')">
                    <span aria-hidden="true">▦</span><span>Dashboard</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button hlmSidebarRail aria-label="Toggle Sidebar"></button>
      </hlm-sidebar>
      <main hlmSidebarInset>
        <button hlmSidebarTrigger></button>
        <p>Collapsed: {{ sidebar.open() ? 'no' : 'yes' }} (state: {{ sidebar.state() }})</p>
        <button type="button" (click)="sidebar.toggleSidebar()">Toggle from code</button>
      </main>
    </div>
  `,
})
export class IconSidebarComponent {
  protected readonly sidebar = inject(HlmSidebarService);

  go(path: string): void {
    console.log('navigate', path);
  }
}
```

When `state() === 'collapsed'` the button labels collapse and the `tooltip` text appears on hover via `BrnTooltip`.

### 3. Groups, sub-menus, badges, actions

```html
<div hlmSidebarGroup>
  <div hlmSidebarGroupLabel>Projects</div>
  <button hlmSidebarGroupAction aria-label="Add project">+</button>
  <div hlmSidebarGroupContent>
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <button hlmSidebarMenuButton tooltip="Website">
          <span>Website</span>
        </button>
        <span hlmSidebarMenuBadge>12</span>
        <button hlmSidebarMenuAction showOnHover aria-label="More actions">…</button>
        <ul hlmSidebarMenuSub>
          <li hlmSidebarMenuSubItem>
            <a hlmSidebarMenuSubButton href="/p/site/overview">Overview</a>
          </li>
          <li hlmSidebarMenuSubItem>
            <a hlmSidebarMenuSubButton isActive href="/p/site/deploys">Deploys</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>

<hlm-sidebar-separator />
```

### 4. Search input + loading skeletons

```ts
import { Component, signal } from '@angular/core';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-search-sidebar',
  standalone: true,
  imports: [HlmSidebarImports],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader>
          <input hlmSidebarInput placeholder="Search…" [(value)]="query" aria-label="Search menu" />
        </div>
        <div hlmSidebarContent>
          @if (loading()) {
            <hlm-sidebar-menu-skeleton />
            <hlm-sidebar-menu-skeleton />
            <hlm-sidebar-menu-skeleton showIcon />
          } @else {
            <div hlmSidebarGroup>
              <div hlmSidebarGroupContent>
                <ul hlmSidebarMenu>
                  @for (item of filtered(); track item) {
                    <li hlmSidebarMenuItem>
                      <button hlmSidebarMenuButton>
                        <span>{{ item }}</span>
                      </button>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </hlm-sidebar>
      <main hlmSidebarInset>…</main>
    </div>
  `,
})
export class SearchSidebarComponent {
  readonly query = signal('');
  readonly loading = signal(false);
  readonly filtered = signal(['Inbox', 'Sent', 'Archive']);
}
```

### 5. Right-side inset variant

```html
<div hlmSidebarWrapper>
  <main hlmSidebarInset>
    <button hlmSidebarTrigger></button>
    Content first in DOM…
  </main>

  <hlm-sidebar side="right" variant="inset">
    <div hlmSidebarHeader>Inspector</div>
    <div hlmSidebarContent>…</div>
  </hlm-sidebar>
</div>
```

`variant="inset"` (or `"floating"`) adjusts gap math, rounding, and ring styling; the input syncs to `HlmSidebarService.variant` so menu buttons and peers react consistently.

### 6. Router integration with active state

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-router-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, RouterLink, RouterLinkActive],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a
                    hlmSidebarMenuButton
                    routerLink="/dashboard"
                    routerLinkActive
                    #rla="routerLinkActive"
                    [isActive]="rla.isActive"
                    tooltip="Dashboard"
                  >
                    <span>Dashboard</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </hlm-sidebar>
      <main hlmSidebarInset>
        <router-outlet />
      </main>
    </div>
  `,
})
export class RouterSidebarComponent {}
```

`[isActive]` drives `data-active` styling; `tooltip` keeps icon-mode navigation discoverable.

## Accessibility notes

- Landmarks: the sidebar content should read as complementary navigation — add `aria-label` to `hlm-sidebar`/nav regions when multiple navs exist; the inset `main` gives the primary content landmark.
- `HlmSidebarTrigger` renders an icon-only ghost button with an sr-only label (`srOnlyText`, default "Toggle Sidebar") — keep that text meaningful and don't remove it.
- Collapsed icon mode hides labels visually but exposes them via tooltips; ensure every icon button passes `tooltip` text, otherwise icon-mode buttons have no accessible name beyond their (hidden) `<span>`.
- The `Ctrl/Cmd+B` shortcut toggles the sidebar — document it in your app's keyboard-shortcut help and avoid colliding bindings.
- Mobile renders a real `hlm-sheet` dialog with focus trap and overlay dismissal; menu-button clicks can auto-close it via `closeMobileSidebarOnMenuButtonClick`.

## Theming / CSS variables

Sidebar tokens (`--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`, …) drive all colors; geometry via `--sidebar-width` / `--sidebar-width-icon` on the wrapper. Dark mode follows the theme tokens. Menu-button density via `size` (`default`/`sm`/`lg`) and style via `variant` (`default`/`outline`).

## Related subpaths

- `@egose/shadcn-theme-ng/sheet` — the mobile sidebar renders through `hlm-sheet`
- `@egose/shadcn-theme-ng/separator` — wrapped by `HlmSidebarSeparator`
- `@egose/shadcn-theme-ng/skeleton` — used by `HlmSidebarMenuSkeleton`
- `@egose/shadcn-theme-ng/tooltip` — tooltip defaults reused for collapsed menu-button tooltips
