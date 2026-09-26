# Dropdown Menu (`@egose/shadcn-theme-ng/dropdown-menu`)

A dropdown action menu in the shadcn/ui DropdownMenu style: trigger button + floating panel with items, labels, separators, shortcuts, checkbox/radio items, groups, and nested sub-menus. Equivalent to shadcn/ui `DropdownMenu` (Radix).

The Angular implementation is a styling layer over the Angular CDK menu primitives (`CdkMenu`, `CdkMenuTrigger`, `CdkMenuItem`, `CdkMenuItemCheckbox`, `CdkMenuItemRadio`, `CdkMenuGroup`) plus position helpers (`createMenuPosition`, `MENU_SIDE`) and focus handling from `@spartan-ng/brain/core`. An internal `HlmDropdownMenuFocusOnHover` directive moves DOM focus on hover (Radix/shadcn behavior) and is applied automatically to every item type.

> **Ships as:** `@egose/shadcn-theme-ng/dropdown-menu` and `@egose/shadcn-theme-ng-tw/dropdown-menu`
> (the `tw:`-prefixed Tailwind variant). Both expose the identical TypeScript surface; only the
> emitted Tailwind class strings differ. See the [package README](../../README.md) for install
> steps, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# tw:-prefixed Tailwind variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@spartan-ng/brain`, `@ng-icons/*`, `rxjs`, …) are documented in the
[package README](../../README.md#peer-dependencies). This subpath additionally relies at runtime on
`@angular/cdk/menu`, `@egose/shadcn-theme-ng/utils`, and `@ng-icons/lucide` (check / chevron icons).

## Imports

All symbols are exported from the subpath root (`projects/dropdown-menu/src/public-api.ts`):

```ts
import {
  HlmDropdownMenu,
  HlmDropdownMenuTrigger,
  HlmDropdownMenuItem,
  HlmDropdownMenuCheckbox,
  HlmDropdownMenuCheckboxIndicator,
  HlmDropdownMenuRadio,
  HlmDropdownMenuRadioIndicator,
  HlmDropdownMenuLabel,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuShortcut,
  HlmDropdownMenuGroup,
  HlmDropdownMenuSub,
  HlmDropdownMenuSubTrigger,
  HlmDropdownMenuItemSubIndicator,
  provideHlmDropdownMenuConfig,
  injectHlmDropdownMenuConfig,
  HlmDropdownMenuImports,
  HlmDropdownMenuModule,
} from '@egose/shadcn-theme-ng/dropdown-menu';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/dropdown-menu'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmDropdownMenuImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmDropdownMenuModule } from '@egose/shadcn-theme-ng/dropdown-menu';

@NgModule({ imports: [HlmDropdownMenuModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

<ng-template #menu>
  <div hlmDropdownMenu>
    <div hlmDropdownMenuLabel>My Account</div>
    <div hlmDropdownMenuSeparator></div>
    <div hlmDropdownMenuGroup>
      <button hlmDropdownMenuItem (triggered)="profile()">
        Profile
        <span hlmDropdownMenuShortcut>⇧⌘P</span>
      </button>
      <button hlmDropdownMenuItem variant="destructive" (triggered)="logout()">Log out</button>
    </div>
  </div>
</ng-template>
```

Real selectors (from source):

| Class                              | Selector(s)                                                | Kind                                |
| ---------------------------------- | ---------------------------------------------------------- | ----------------------------------- |
| `HlmDropdownMenu`                  | `[hlmDropdownMenu], hlm-dropdown-menu`                     | Directive (hosts `CdkMenu`)         |
| `HlmDropdownMenuTrigger`           | `[hlmDropdownMenuTrigger]`                                 | Directive (hosts `CdkMenuTrigger`)  |
| `HlmDropdownMenuItem`              | `[hlmDropdownMenuItem], hlm-dropdown-menu-item`            | Directive (hosts `CdkMenuItem`)     |
| `HlmDropdownMenuCheckbox`          | `[hlmDropdownMenuCheckbox], [hlmDropdownMenuCheckboxItem]` | Directive (hosts checkbox CDK item) |
| `HlmDropdownMenuCheckboxIndicator` | `hlm-dropdown-menu-checkbox-indicator`                     | Component (`lucideCheck`)           |
| `HlmDropdownMenuRadio`             | `[hlmDropdownMenuRadio]`                                   | Directive (hosts radio CDK item)    |
| `HlmDropdownMenuRadioIndicator`    | `hlm-dropdown-menu-radio-indicator`                        | Component (`lucideCheck`)           |
| `HlmDropdownMenuLabel`             | `[hlmDropdownMenuLabel], hlm-dropdown-menu-label`          | Directive                           |
| `HlmDropdownMenuSeparator`         | `[hlmDropdownMenuSeparator], hlm-dropdown-menu-separator`  | Directive                           |
| `HlmDropdownMenuShortcut`          | `[hlmDropdownMenuShortcut], hlm-dropdown-menu-shortcut`    | Directive                           |
| `HlmDropdownMenuGroup`             | `[hlmDropdownMenuGroup], hlm-dropdown-menu-group`          | Directive (hosts `CdkMenuGroup`)    |
| `HlmDropdownMenuSub`               | `[hlmDropdownMenuSub], hlm-dropdown-menu-sub`              | Directive (nested `CdkMenu`)        |
| `HlmDropdownMenuSubTrigger`        | `[hlmDropdownMenuSubTrigger]`                              | Directive (hosts `CdkMenuTrigger`)  |
| `HlmDropdownMenuItemSubIndicator`  | `hlm-dropdown-menu-item-sub-indicator`                     | Component (`lucideChevronRight`)    |

## API reference

### `HlmDropdownMenu` — `[hlmDropdownMenu], hlm-dropdown-menu`

Menu panel. Hosts `CdkMenu`. Place inside an `ng-template` referenced by the trigger.

| Input        | Type     | Default | Description                                      |
| ------------ | -------- | ------- | ------------------------------------------------ |
| `sideOffset` | `number` | `1`     | Gap (`--side-offset`) between trigger and panel. |

Host exposes `data-state`, `data-side`, and animation classes derived from the trigger's resolved position.

### `HlmDropdownMenuTrigger` — `[hlmDropdownMenuTrigger]`

| Input   | Type        | Default             | Description           |
| ------- | ----------- | ------------------- | --------------------- |
| `align` | `MenuAlign` | config (`'start'`)  | Horizontal alignment. |
| `side`  | `MenuSide`  | config (`'bottom'`) | Preferred side.       |

CDK bindings (via `hostDirectives`): `cdkMenuTriggerFor: hlmDropdownMenuTrigger` (the `ng-template`), `cdkMenuTriggerData: hlmDropdownMenuTriggerData`; outputs `cdkMenuOpened: hlmDropdownMenuOpened`, `cdkMenuClosed: hlmDropdownMenuClosed`.

> Do not nest the trigger inside another `hlmDropdownMenu` element. The outer element acts as a parent `CdkMenu`, turning the trigger into a submenu trigger that ignores menu-stack close events — the panel will no longer dismiss on outside clicks. Keep root triggers as siblings of their `ng-template` (see Anatomy above).

### `HlmDropdownMenuItem` — `[hlmDropdownMenuItem], hlm-dropdown-menu-item`

| Input      | Type                         | Default     | Description                                                  |
| ---------- | ---------------------------- | ----------- | ------------------------------------------------------------ |
| `disabled` | `boolean`                    | `false`     | Disables the item (forwarded to `cdkMenuItemDisabled`).      |
| `variant`  | `'default' \| 'destructive'` | `'default'` | Destructive red styling.                                     |
| `inset`    | `boolean`                    | `false`     | Indents content (`ps-8`), e.g. to align with checkable rows. |

Output `triggered` (forwarded from `cdkMenuItemTriggered`) fires on select.

### `HlmDropdownMenuCheckbox` — `[hlmDropdownMenuCheckbox], [hlmDropdownMenuCheckboxItem]`

Checkable row. Hosts an internal `HlmDropdownMenuCheckboxCdk extends CdkMenuItemCheckbox` (selector `[hlmDropdownMenuCheckboxCdk]`, internal — use the public selector instead).

| Input      | Type      | Default | Description                                                               |
| ---------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled` | `boolean` | —       | Forwarded to `cdkMenuItemDisabled`.                                       |
| `checked`  | `boolean` | —       | Forwarded to `cdkMenuItemChecked`. Bind with `[checked]` + `(triggered)`. |
| `keepOpen` | `boolean` | `true`  | Keep the menu open after toggling (CDK trigger override).                 |
| `inset`    | `boolean` | `false` | Indentation.                                                              |

Pair with `<hlm-dropdown-menu-checkbox-indicator />` (check icon, shown when `data-checked`).

### `HlmDropdownMenuRadio` — `[hlmDropdownMenuRadio]`

Same contract as checkbox but single-select within its group (hosts `HlmDropdownMenuRadioCdk`, selector `[hlmDropdownMenuRadioCdk]`, internal). Inputs: `disabled`, `checked`, `keepOpen` (default `true`). Pair with `<hlm-dropdown-menu-radio-indicator />`.

### Label / separator / shortcut / group

| Class                      | Inputs                               | Notes                                                       |
| -------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| `HlmDropdownMenuLabel`     | `inset` (`boolean`, default `false`) | Muted section heading.                                      |
| `HlmDropdownMenuSeparator` | —                                    | Hairline divider.                                           |
| `HlmDropdownMenuShortcut`  | —                                    | Right-aligned kbd hint; place inside an item.               |
| `HlmDropdownMenuGroup`     | —                                    | Hosts `CdkMenuGroup` for labelled sections / radio scoping. |

### Sub-menus

| Class                       | Inputs                                                                                                                                                 | Notes                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `HlmDropdownMenuSubTrigger` | `align`, `side` (config defaults); CDK `hlmDropdownMenuSubTrigger` (template), `hlmDropdownMenuTriggerData`; outputs `hlmDropdownMenuSubOpened/Closed` | Row that opens a nested menu. Include `<hlm-dropdown-menu-item-sub-indicator />` chevron. |
| `HlmDropdownMenuSub`        | —                                                                                                                                                      | Nested panel inside the sub-template.                                                     |

### Config

`HlmDropdownMenuConfig = { align: MenuAlign; side: MenuSide }`, defaults `{ align: 'start', side: 'bottom' }`. Override globally with `provideHlmDropdownMenuConfig({ align, side })`, read with `injectHlmDropdownMenuConfig()`.

## Examples

### 1. Basic account menu

```ts
import { Component } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [...HlmDropdownMenuImports, HlmButton],
  template: `
    <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <div hlmDropdownMenuLabel>My Account</div>
        <div hlmDropdownMenuSeparator></div>
        <button hlmDropdownMenuItem (triggered)="go('profile')">Profile</button>
        <button hlmDropdownMenuItem (triggered)="go('billing')">Billing</button>
        <button hlmDropdownMenuItem variant="destructive" (triggered)="go('logout')">Log out</button>
      </div>
    </ng-template>
  `,
})
export class AccountMenuComponent {
  go(where: string) {
    console.log(where);
  }
}
```

### 2. Shortcuts, inset, and disabled items

```ts
import { Component } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-shortcuts',
  standalone: true,
  imports: [...HlmDropdownMenuImports, HlmButton],
  template: `
    <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Edit</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <div hlmDropdownMenuLabel inset>Editor</div>
        <button hlmDropdownMenuItem inset (triggered)="noop('undo')">
          Undo <span hlmDropdownMenuShortcut>⌘Z</span>
        </button>
        <button hlmDropdownMenuItem inset (triggered)="noop('redo')">
          Redo <span hlmDropdownMenuShortcut>⇧⌘Z</span>
        </button>
        <div hlmDropdownMenuSeparator></div>
        <button hlmDropdownMenuItem inset disabled>Cut (disabled)</button>
      </div>
    </ng-template>
  `,
})
export class ShortcutsComponent {
  noop(what: string) {
    console.log(what);
  }
}
```

### 3. Checkbox filters (keep-open toggles)

```ts
import { Component, signal } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [...HlmDropdownMenuImports, HlmButton],
  template: `
    <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Filter</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <div hlmDropdownMenuLabel>Show</div>
        <button hlmDropdownMenuCheckbox [checked]="open()" (triggered)="open.set(!open())">
          Open issues
          <hlm-dropdown-menu-checkbox-indicator />
        </button>
        <button hlmDropdownMenuCheckbox [checked]="closed()" (triggered)="closed.set(!closed())">
          Closed issues
          <hlm-dropdown-menu-checkbox-indicator />
        </button>
      </div>
    </ng-template>
    <p class="tw:text-sm">open={{ open() }} closed={{ closed() }}</p>
  `,
})
export class FiltersComponent {
  readonly open = signal(true);
  readonly closed = signal(false);
}
```

### 4. Radio sort order

```ts
import { Component, signal } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [...HlmDropdownMenuImports, HlmButton],
  template: `
    <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Sort: {{ order() }}</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <div hlmDropdownMenuGroup>
          <div hlmDropdownMenuLabel>Sort by</div>
          @for (opt of options; track opt) {
            <button hlmDropdownMenuRadio [checked]="order() === opt" (triggered)="order.set(opt)">
              {{ opt }}
              <hlm-dropdown-menu-radio-indicator />
            </button>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class SortComponent {
  readonly options = ['Newest', 'Oldest', 'Most starred'] as const;
  readonly order = signal<(typeof this.options)[number]>('Newest');
}
```

### 5. Nested sub-menu

```ts
import { Component } from '@angular/core';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-submenu',
  standalone: true,
  imports: [...HlmDropdownMenuImports, HlmButton],
  template: `
    <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Share</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <button hlmDropdownMenuItem (triggered)="copy()">Copy link</button>
        <button hlmDropdownMenuSubTrigger [hlmDropdownMenuSubTrigger]="invite">
          Invite users
          <hlm-dropdown-menu-item-sub-indicator />
        </button>
      </div>
    </ng-template>
    <ng-template #invite>
      <div hlmDropdownMenuSub>
        <button hlmDropdownMenuItem (triggered)="inviteBy('email')">Email</button>
        <button hlmDropdownMenuItem (triggered)="inviteBy('sms')">SMS</button>
      </div>
    </ng-template>
  `,
})
export class SubmenuComponent {
  copy() {
    console.log('copied');
  }
  inviteBy(channel: string) {
    console.log(channel);
  }
}
```

### 6. Async data menu + global position config

```ts
import { Component, inject, signal } from '@angular/core';
import { HlmDropdownMenuImports, provideHlmDropdownMenuConfig } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-async-menu',
  standalone: true,
  imports: [...HlmDropdownMenuImports, HlmButton],
  providers: [provideHlmDropdownMenuConfig({ align: 'end', side: 'bottom' })],
  template: `
    <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" (click)="load()">Projects</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <div hlmDropdownMenuLabel>Recent</div>
        @if (loading()) {
          <button hlmDropdownMenuItem disabled>Loading…</button>
        }
        @for (p of projects(); track p) {
          <button hlmDropdownMenuItem (triggered)="open(p)">{{ p }}</button>
        }
      </div>
    </ng-template>
  `,
})
export class AsyncMenuComponent {
  readonly projects = signal<string[]>([]);
  readonly loading = signal(false);
  load() {
    if (this.projects().length || this.loading()) return;
    this.loading.set(true);
    setTimeout(() => {
      this.projects.set(['website', 'mobile', 'docs']);
      this.loading.set(false);
    }, 600);
  }
  open(p: string) {
    console.log('open', p);
  }
}
```

## Accessibility notes

- Triggers are native buttons hosting `CdkMenuTrigger`: enter/space/arrows open the menu, escape closes, and focus returns to the trigger.
- Items are `CdkMenuItem`s with roving focus: arrows move, typeahead jumps, enter/space activates. `disabled` items are skipped.
- Checkbox/radio rows expose checked state via `data-checked` + icon indicators; screen readers announce them as menu item checkboxes/radios through the CDK roles.
- Hover moves focus (`HlmDropdownMenuFocusOnHover`) so pointer and keyboard highlight stay in sync — do not add competing `mouseenter` focus handlers.

## Theming / CSS variables

No component-specific CSS variables. Panel, item, and indicator styling derives from global tokens (`--popover`, `--accent`, `--muted`, `--destructive`, …) with `data-state` / `data-side` / `data-variant` / `data-checked` hooks for custom CSS. Tune placement globally via `provideHlmDropdownMenuConfig`.

## Related subpaths

- `@egose/shadcn-theme-ng/context-menu` — right-click variant of the same CDK menu system.
- `@egose/shadcn-theme-ng/menubar` — menubar with the same item/label/separator vocabulary.
- `@egose/shadcn-theme-ng/popover` — generic floating panel alternative for non-menu content.
- `@egose/shadcn-theme-ng/button` — `hlmBtn` trigger styling.
