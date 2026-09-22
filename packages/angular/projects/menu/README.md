# Menu (`@egose/shadcn-theme-ng/menu`)

Headless menu building blocks (CDK `CdkMenu` family) with shadcn styling: container, bar, items, checkbox/radio items, indicators, labels, separators, shortcuts, and sub-menus. This is the styling/behavior layer underneath `dropdown-menu`, `context-menu`, and `menubar` — use it directly when you need a custom menu surface (e.g. an always-visible `hlm-menu-bar` toolbar or a CDK-triggered floating menu) rather than one of the opinionated wrappers.

Ships as `@egose/shadcn-theme-ng/menu` and `@egose/shadcn-theme-ng-tw/menu` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core` as peers plus a `tslib` runtime dependency; at runtime it also uses `@angular/cdk/menu` and `@egose/shadcn-theme-ng/icon` / `.../utils`. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmMenu,
  HlmSubMenu,
  HlmMenuBar,
  HlmMenuBarItem,
  HlmMenuGroup,
  HlmMenuItem,
  HlmMenuItemCheck,
  HlmMenuItemCheckbox,
  HlmMenuItemIcon,
  HlmMenuItemRadio,
  HlmMenuItemRadioIndicator,
  HlmMenuItemSubIndicator,
  HlmMenuLabel,
  HlmMenuSeparator,
  HlmMenuShortcut,
  menuVariants, // cva variants for HlmMenu
  HlmMenuItemImports, // items + icons + checks + shortcuts
  HlmMenuStructureImports, // [HlmMenuLabel, HlmMenuSeparator]
  HlmMenuImports, // item + structure + HlmMenu + HlmSubMenu
  HlmMenuBarImports, // HlmMenuImports + HlmMenuBar + HlmMenuBarItem
  HlmMenuItemModule,
  HlmMenuModule,
  HlmMenuBarModule,
} from '@egose/shadcn-theme-ng/menu';
```

Standalone usage (full bar):

```ts
import { Component } from '@angular/core';
import { HlmMenuBarImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmMenuBarImports],
  template: `
    <hlm-menu-bar>
      <button hlmMenuBarItem>File</button>
    </hlm-menu-bar>
  `,
})
export class DemoComponent {}
```

Standalone usage (floating menu only):

```ts
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  standalone: true,
  imports: [...HlmMenuImports],
  template: `
    <hlm-menu>
      <hlm-menu-label>Actions</hlm-menu-label>
      <button hlmMenuItem>Edit</button>
    </hlm-menu>
  `,
})
export class MenuOnlyComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmMenuModule, HlmMenuBarModule, HlmMenuItemModule } from '@egose/shadcn-theme-ng/menu';

@NgModule({ imports: [HlmMenuModule, HlmMenuBarModule, HlmMenuItemModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/menu`. Symbol names are identical.

## Anatomy / Structure

```html
<!-- Static bar -->
<hlm-menu-bar>
  <button hlmMenuBarItem [cdkMenuTriggerFor]="fileMenu">File</button>
</hlm-menu-bar>

<!-- Floating menu (anchored via CDK trigger) -->
<ng-template #fileMenu>
  <hlm-menu variant="default">
    <hlm-menu-label>File</hlm-menu-label>
    <button hlmMenuItem>
      <ng-icon hlmMenuIcon name="lucidePencil" />
      Rename
      <hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
    </button>
    <button hlmMenuItem variant="destructive">Delete</button>
    <hlm-menu-separator />
    <hlm-menu-group>
      <button hlmMenuItemCheckbox>
        <hlm-menu-item-check />
        Word wrap
      </button>
      <button hlmMenuItemRadio>
        <hlm-menu-item-radio />
        Option A
      </button>
    </hlm-menu-group>
    <button hlmMenuItem>
      More
      <hlm-menu-item-sub-indicator />
    </button>
  </hlm-menu>
</ng-template>

<hlm-sub-menu><!-- nested submenu surface --></hlm-sub-menu>
```

| Class                       | Selector                      | Element                        | Role                                           |
| --------------------------- | ----------------------------- | ------------------------------ | ---------------------------------------------- |
| `HlmMenu`                   | `hlm-menu`                    | component                      | Floating menu surface (`CdkMenu`)              |
| `HlmSubMenu`                | `hlm-sub-menu`                | component                      | Nested submenu surface (`CdkMenu`)             |
| `HlmMenuBar`                | `hlm-menu-bar`                | component                      | Static bar (`CdkMenuBar`)                      |
| `HlmMenuBarItem`            | `[hlmMenuBarItem]`            | any (usually `<button>`)       | Bar item (`CdkMenuItem`)                       |
| `HlmMenuItem`               | `[hlmMenuItem]`               | any (usually `<button>`/`<a>`) | Menu row (`CdkMenuItem`)                       |
| `HlmMenuGroup`              | `hlm-menu-group`              | component                      | Grouping (`CdkMenuGroup`)                      |
| `HlmMenuLabel`              | `hlm-menu-label`              | component                      | Section heading                                |
| `HlmMenuSeparator`          | `hlm-menu-separator`          | component                      | Divider                                        |
| `HlmMenuShortcut`           | `hlm-menu-shortcut`           | component                      | Right-aligned hint text                        |
| `HlmMenuItemIcon`           | `[hlmMenuIcon]`               | icon host                      | Leading-icon sizing (`sm` icon config)         |
| `HlmMenuItemCheckbox`       | `[hlmMenuItemCheckbox]`       | any                            | Checkable row (`CdkMenuItemCheckbox`)          |
| `HlmMenuItemRadio`          | `[hlmMenuItemRadio]`          | any                            | Radio row (`CdkMenuItemRadio`)                 |
| `HlmMenuItemCheck`          | `hlm-menu-item-check`         | component                      | Check glyph (shows when parent has `.checked`) |
| `HlmMenuItemRadioIndicator` | `hlm-menu-item-radio` (!)     | component                      | Dot glyph (shows when parent has `.checked`)   |
| `HlmMenuItemSubIndicator`   | `hlm-menu-item-sub-indicator` | component                      | Chevron-right for submenu parents              |

> API surprise: the radio indicator's selector is `hlm-menu-item-radio` while its class is `HlmMenuItemRadioIndicator`. The attribute directive `[hlmMenuItemRadio]` (class `HlmMenuItemRadio`) is the _row_; the element `<hlm-menu-item-radio>` is the _dot_. Read selectors carefully when composing radio rows.

CDK passthroughs (via `hostDirectives`): `HlmMenuItem` forwards `cdkMenuItemDisabled: disabled` input and `cdkMenuItemTriggered: triggered` output; checkbox/radio variants forward `disabled`/`checked` inputs and `triggered` outputs. `menuVariants` exposes `variant: 'default' | 'menubar'` (`default` adds `my-0.5`, `menubar` adds `my-2`).

## API reference

| Selector                                       | Inputs                                                                                                                                              | Notes                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `hlm-menu` (`HlmMenu`)                         | `variant: 'default' \| 'menubar'` (default `'default'`), `class`                                                                                    | `menuVariants({ variant })` merged with `class`                                      |
| `hlm-sub-menu` (`HlmSubMenu`)                  | `class`                                                                                                                                             | Static popover-look surface                                                          |
| `hlm-menu-bar` (`HlmMenuBar`)                  | `class`                                                                                                                                             | `h-9` bar, `rounded-md border shadow-xs`                                             |
| `[hlmMenuBarItem]`                             | `class`                                                                                                                                             | Forwards full `CdkMenuItem` API via host directive                                   |
| `[hlmMenuItem]`                                | `variant: 'default' \| 'destructive'` (default `'default'`), `inset: boolean` (default `false`), `class`; CDK `disabled` input + `triggered` output | `data-variant` / `data-inset` reflected; `inset` adds `pl-8` for icon-less alignment |
| `hlm-menu-label`                               | `inset: boolean` (default `false`), `class`                                                                                                         | `data-inset` reflected; semibold section text                                        |
| `hlm-menu-separator`                           | `class`                                                                                                                                             | `h-px bg-border`                                                                     |
| `hlm-menu-shortcut`                            | `class`                                                                                                                                             | `ml-auto text-xs tracking-widest text-muted-foreground`                              |
| `[hlmMenuIcon]`                                | `class`                                                                                                                                             | Provides `sm` icon config; adds `mr-2`                                               |
| `[hlmMenuItemCheckbox]` / `[hlmMenuItemRadio]` | `class`; CDK `disabled`/`checked` inputs, `triggered` output                                                                                        | Rows reserve `pl-8` for the indicator                                                |
| `hlm-menu-item-check`                          | `class`                                                                                                                                             | Check icon; `opacity-0` until ancestor has `.checked`                                |
| `hlm-menu-item-radio` (indicator)              | `class`                                                                                                                                             | Dot icon; same `.checked` reveal rule                                                |
| `hlm-menu-item-sub-indicator`                  | `class`                                                                                                                                             | Chevron-right, `ml-auto size-4`                                                      |
| `hlm-menu-group`                               | —                                                                                                                                                   | `CdkMenuGroup` only                                                                  |

Every `class` input above is `input<ClassValue>('', { alias: 'class' })` merged after the base classes via `hlm()`.

## Examples

### 1. Static menu bar + floating menu (CDK triggers)

```ts
import { Component } from '@angular/core';
import { CdkMenuTrigger, CdkMenuModule } from '@angular/cdk/menu';
import { HlmMenuBarImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CdkMenuModule, CdkMenuTrigger, ...HlmMenuBarImports],
  template: `
    <hlm-menu-bar>
      <button hlmMenuBarItem [cdkMenuTriggerFor]="fileTpl">File</button>
      <button hlmMenuBarItem [cdkMenuTriggerFor]="editTpl">Edit</button>
    </hlm-menu-bar>

    <ng-template #fileTpl>
      <hlm-menu>
        <hlm-menu-label>File</hlm-menu-label>
        <button hlmMenuItem (cdkMenuItemTriggered)="onNew()">New file</button>
        <button hlmMenuItem>Open…</button>
        <hlm-menu-separator />
        <button hlmMenuItem variant="destructive" (cdkMenuItemTriggered)="onDelete()">Delete</button>
      </hlm-menu>
    </ng-template>

    <ng-template #editTpl>
      <hlm-menu>
        <button hlmMenuItem>Undo</button>
        <button hlmMenuItem>Redo</button>
      </hlm-menu>
    </ng-template>
  `,
})
export class MenuBarComponent {
  onNew(): void {
    console.log('new file');
  }
  onDelete(): void {
    console.log('delete');
  }
}
```

### 2. Variants, inset, shortcuts, icons

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menu-variants',
  standalone: true,
  imports: [NgIcon, ...HlmMenuImports],
  providers: [provideIcons({ lucidePencil, lucideTrash })],
  template: `
    <hlm-menu>
      <hlm-menu-label>Actions</hlm-menu-label>
      <button hlmMenuItem>
        <ng-icon hlmMenuIcon name="lucidePencil" />
        Rename
        <hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
      </button>
      <button hlmMenuItem inset>Aligned without icon</button>
      <button hlmMenuItem variant="destructive">
        <ng-icon hlmMenuIcon name="lucideTrash" />
        Delete
        <hlm-menu-shortcut>⌫</hlm-menu-shortcut>
      </button>
    </hlm-menu>
  `,
})
export class MenuVariantsComponent {}
```

### 3. Checkbox and radio rows

```ts
import { Component, signal } from '@angular/core';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menu-checks',
  standalone: true,
  imports: [...HlmMenuImports],
  template: `
    <hlm-menu>
      <hlm-menu-label inset>View</hlm-menu-label>
      <hlm-menu-group>
        <button hlmMenuItemCheckbox [cdkMenuItemChecked]="wordWrap()" (cdkMenuItemTriggered)="toggleWrap()">
          <hlm-menu-item-check />
          Word wrap
        </button>
        <button hlmMenuItemCheckbox [cdkMenuItemChecked]="minimap()" (cdkMenuItemTriggered)="toggleMap()">
          <hlm-menu-item-check />
          Minimap
        </button>
      </hlm-menu-group>
      <hlm-menu-separator />
      <hlm-menu-label inset>Theme</hlm-menu-label>
      <hlm-menu-group>
        <button hlmMenuItemRadio [cdkMenuItemChecked]="theme() === 'light'" (cdkMenuItemTriggered)="theme.set('light')">
          <hlm-menu-item-radio />
          Light
        </button>
        <button hlmMenuItemRadio [cdkMenuItemChecked]="theme() === 'dark'" (cdkMenuItemTriggered)="theme.set('dark')">
          <hlm-menu-item-radio />
          Dark
        </button>
      </hlm-menu-group>
    </hlm-menu>
  `,
})
export class MenuChecksComponent {
  readonly wordWrap = signal(true);
  readonly minimap = signal(false);
  readonly theme = signal<'light' | 'dark'>('light');

  toggleWrap(): void {
    this.wordWrap.update((v) => !v);
  }
  toggleMap(): void {
    this.minimap.update((v) => !v);
  }
}
```

> The check/dot indicators reveal via the CDK-added `.checked` class (`group-[.checked]:opacity-100`). Bind `[cdkMenuItemChecked]` — the `checked` alias exposed through the host directive — and toggle on `(cdkMenuItemTriggered)` (exposed as `triggered`).

### 4. Submenu with indicator

```ts
import { Component } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menu-sub',
  standalone: true,
  imports: [CdkMenuModule, ...HlmMenuImports],
  template: `
    <hlm-menu>
      <button hlmMenuItem [cdkMenuTriggerFor]="shareTpl">
        Share
        <hlm-menu-item-sub-indicator />
      </button>
    </hlm-menu>

    <ng-template #shareTpl>
      <hlm-sub-menu>
        <button hlmMenuItem>Email</button>
        <button hlmMenuItem>Copy link</button>
      </hlm-sub-menu>
    </ng-template>
  `,
})
export class MenuSubComponent {}
```

### 5. Menubar-variant floating menu + disabled rows

```ts
import { Component } from '@angular/core';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menu-menubar-variant',
  standalone: true,
  imports: [...HlmMenuImports],
  template: `
    <hlm-menu variant="menubar">
      <hlm-menu-label>Help</hlm-menu-label>
      <button hlmMenuItem>Documentation</button>
      <button hlmMenuItem [cdkMenuItemDisabled]="true">Release notes (soon)</button>
    </hlm-menu>
  `,
})
export class MenuMenubarVariantComponent {}
```

Note: `variant="menubar"` on `hlm-menu` only adjusts vertical margin (`my-2` vs `my-0.5`); it does not wire menubar behavior — pair it with `hlm-menu-bar` / `HlmMenubar` triggers as in example 1 for the real thing.

### 6. Async list + programmatic template menu

```ts
import { Component, signal } from '@angular/core';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menu-async',
  standalone: true,
  imports: [...HlmMenuImports],
  template: `
    <hlm-menu>
      <hlm-menu-label>Recent files</hlm-menu-label>
      @for (f of files(); track f) {
        <button hlmMenuItem (cdkMenuItemTriggered)="open(f)">
          {{ f }}
          <hlm-menu-shortcut>{{ $index + 1 }}</hlm-menu-shortcut>
        </button>
      } @empty {
        <hlm-menu-label>No recent files</hlm-menu-label>
      }
    </hlm-menu>
  `,
})
export class MenuAsyncComponent {
  readonly files = signal<string[]>(['proposal.docx', 'budget.xlsx', 'notes.md']);

  open(name: string): void {
    console.log('open', name);
  }
}
```

## Accessibility notes

- CDK `CdkMenu`/`CdkMenuBar` own roving-focus, arrow-key navigation, typeahead, and `aria` roles — keep the prescribed nesting (`menu-bar` → trigger → `menu` → items) so keyboard behavior holds.
- Use `hlm-menu-label` for headings and `hlm-menu-separator` for dividers rather than disabled items; separators are presentational, labels are announced.
- `variant="destructive"` is color-only — pair destructive actions with explicit text ("Delete") and, for irreversible actions, a confirmation step.
- Disabled rows (`[cdkMenuItemDisabled]`) are skipped by arrow navigation and announced as disabled.

## Theming / CSS variables

No theming inputs. Surfaces use `bg-popover text-popover-foreground border shadow-md` and items use `hover:bg-secondary`; all flow from shadcn tokens. Extend per-instance via `class`.

## Related subpaths

- `@egose/shadcn-theme-ng/dropdown-menu` — opinionated trigger + menu wrapper built on this layer.
- `@egose/shadcn-theme-ng/context-menu` — right-click variant of the same CDK foundation.
- `@egose/shadcn-theme-ng/menubar` — desktop app-style menu bar with its own trigger primitive.
- `@egose/shadcn-theme-ng/icon` — `HlmMenuItemIcon` consumes its `sm` icon config.
