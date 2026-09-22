# Context Menu (`@egose/shadcn-theme-ng/context-menu`)

A right-click menu trigger — the Angular port of shadcn/ui `Context Menu`. The entire subpath is one thin directive, `HlmContextMenuTrigger` (`[hlmContextMenuTrigger]`), which wraps the CDK `CdkContextMenuTrigger` and positions a shared menu panel via `@spartan-ng/brain/core` (`createMenuPosition`, `MENU_SIDE`). The visible menu content itself is **not** in this package — you render it with `@egose/shadcn-theme-ng/dropdown-menu` (or `menu`) primitives; this directive only owns the right-click anchoring, `align`/`side` placement, `disabled` locking, and open/close outputs.

Ships as `@egose/shadcn-theme-ng/context-menu` and `@egose/shadcn-theme-ng-tw/context-menu` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/context-menu/package.json`); at runtime it also needs `@angular/cdk/menu` and a menu-content package (`dropdown-menu`).

## Imports

```ts
import {
  HlmContextMenuTrigger,
  HlmContextMenuImports,
  HlmContextMenuModule,
  HlmContextMenuConfig,
  provideHlmContextMenuConfig,
  injectHlmContextMenuConfig,
} from '@egose/shadcn-theme-ng/context-menu';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/context-menu';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmContextMenuImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmContextMenuModule } from '@egose/shadcn-theme-ng/context-menu';

@NgModule({ imports: [HlmContextMenuModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<!-- Trigger area: right-click anywhere inside the div -->
<div
  [hlmContextMenuTrigger]="menu"
  [hlmContextMenuTriggerData]="{ id: file.id }"
  (hlmContextMenuOpened)="onOpen()"
  (hlmContextMenuClosed)="onClose()"
>
  Right-click me
</div>

<!-- Shared menu content (dropdown-menu subpath) -->
<ng-template #menu let-id="id">
  <hlm-dropdown-menu>
    <hlm-dropdown-menu-group>
      <button hlmDropdownMenuItem (click)="open(id)">Open</button>
      <button hlmDropdownMenuItem (click)="rename(id)">Rename</button>
      <hlm-dropdown-menu-separator></hlm-dropdown-menu-separator>
      <button hlmDropdownMenuItem variant="destructive" (click)="remove(id)">Delete</button>
    </hlm-dropdown-menu-group>
  </hlm-dropdown-menu>
</ng-template>
```

> Exact `hlm-dropdown-menu` selectors/composition live in that subpath's README — the sketch above shows intent. What this package guarantees: `[hlmContextMenuTrigger]` anchors whatever `Menu` template you pass, sets `transformOriginSelector` so the panel animates from the click corner, and derives `data-side` from the resolved position.

Real selector: `[hlmContextMenuTrigger]` (attribute only, on any element). Host carries `data-slot="context-menu-trigger"`, `data-disabled` when locked, and `tw:select-none`.

## API reference

### `HlmContextMenuTrigger` (`[hlmContextMenuTrigger]`)

Host-directive mapping to `CdkContextMenuTrigger`:

| CDK input (aliased)         | Directive-facing name       | Description                                           |
| --------------------------- | --------------------------- | ----------------------------------------------------- |
| `cdkContextMenuTriggerFor`  | `hlmContextMenuTrigger`     | The `<ng-template>` menu panel to open. **Required.** |
| `cdkContextMenuTriggerData` | `hlmContextMenuTriggerData` | Data passed to the menu template (`let-*` bindings).  |
| `cdkContextMenuDisabled`    | `disabled`                  | Locks right-click opening.                            |

| CDK output (aliased)   | Payload | Description                                             |
| ---------------------- | ------- | ------------------------------------------------------- |
| `cdkContextMenuOpened` | —       | Emitted as `hlmContextMenuOpened` when the menu opens.  |
| `cdkContextMenuClosed` | —       | Emitted as `hlmContextMenuClosed` when the menu closes. |

Own inputs (placement, defaulting from injected config):

| Input      | Type        | Default                     | Description                                                                                                                                          |
| ---------- | ----------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | `boolean`   | CDK trigger's current value | Locks the menu (boolean-coerced). Reflected as `data-disabled`.                                                                                      |
| `align`    | `MenuAlign` | `'start'` (or configured)   | Cross-axis alignment of the panel.                                                                                                                   |
| `side`     | `MenuSide`  | `'bottom'` (or configured)  | Preferred side relative to the click point. Combined via `createMenuPosition(align, side)` and assigned to `cdkTrigger.menuPosition` in an `effect`. |

### Config token (`hlm-context-menu-token.ts`)

| Member                        | Type                                                       | Description                                                                                                    |
| ----------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `HlmContextMenuConfig`        | `{ align: MenuAlign; side: MenuSide }`                     | Shape of the global default.                                                                                   |
| `provideHlmContextMenuConfig` | `(config: Partial<HlmContextMenuConfig>) => ValueProvider` | Provide app- or route-level defaults (`{ side: 'right' }`, …). Defaults: `{ align: 'start', side: 'bottom' }`. |
| `injectHlmContextMenuConfig`  | `() => HlmContextMenuConfig`                               | Reads the configured (or default) config — used internally by the trigger.                                     |

## Examples

### 1. Basic right-click area + dropdown menu

```ts
import { Component } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-basic-context-menu',
  standalone: true,
  imports: [...HlmContextMenuImports, ...HlmDropdownMenuImports],
  template: `
    <div
      [hlmContextMenuTrigger]="menu"
      class="border-border flex h-40 items-center justify-center rounded-lg border border-dashed text-sm"
    >
      Right-click here
    </div>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem (click)="action('cut')">Cut</button>
          <button hlmDropdownMenuItem (click)="action('copy')">Copy</button>
          <button hlmDropdownMenuItem (click)="action('paste')">Paste</button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class BasicContextMenuComponent {
  action(a: string) {
    console.log(a);
  }
}
```

### 2. Per-row data (`hlmContextMenuTriggerData`)

Pass the row into the template with `let-*` bindings.

```ts
import { Component, signal } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

interface File {
  id: string;
  name: string;
}

@Component({
  selector: 'app-row-context-menu',
  standalone: true,
  imports: [...HlmContextMenuImports, ...HlmDropdownMenuImports],
  template: `
    @for (f of files(); track f.id) {
      <div
        [hlmContextMenuTrigger]="menu"
        [hlmContextMenuTriggerData]="{ file: f }"
        class="rounded px-3 py-2 text-sm hover:bg-muted"
      >
        {{ f.name }}
      </div>
    }

    <ng-template #menu let-file="file">
      <hlm-dropdown-menu>
        <button hlmDropdownMenuItem (click)="open(file)">Open "{{ file.name }}"</button>
        <button hlmDropdownMenuItem (click)="rename(file)">Rename</button>
        <hlm-dropdown-menu-separator></hlm-dropdown-menu-separator>
        <button hlmDropdownMenuItem variant="destructive" (click)="remove(file)">Delete</button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class RowContextMenuComponent {
  readonly files = signal<File[]>([
    { id: '1', name: 'report.pdf' },
    { id: '2', name: 'photo.png' },
  ]);
  open(f: File) {
    console.log('open', f);
  }
  rename(f: File) {
    console.log('rename', f);
  }
  remove(f: File) {
    this.files.update((fs) => fs.filter((x) => x.id !== f.id));
  }
}
```

### 3. Placement (`align` / `side`) + global config

```ts
import { Component } from '@angular/core';
import { HlmContextMenuImports, provideHlmContextMenuConfig } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-placement-context-menu',
  standalone: true,
  imports: [...HlmContextMenuImports, ...HlmDropdownMenuImports],
  // Open to the right of the click everywhere in this subtree by default:
  providers: [provideHlmContextMenuConfig({ side: 'right', align: 'start' })],
  template: `
    <!-- Override per trigger when needed: -->
    <div [hlmContextMenuTrigger]="menu" side="bottom" align="center" class="rounded border p-8 text-sm">
      Right-click (bottom-center panel)
    </div>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <button hlmDropdownMenuItem>Item one</button>
        <button hlmDropdownMenuItem>Item two</button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class PlacementContextMenuComponent {}
```

### 4. Disabled state + open/close tracking

```ts
import { Component, signal } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-disabled-context-menu',
  standalone: true,
  imports: [...HlmContextMenuImports, ...HlmDropdownMenuImports],
  template: `
    <label class="mb-2 flex items-center gap-2 text-sm">
      <input type="checkbox" [checked]="locked()" (change)="locked.set(!locked())" /> Disable menu
    </label>
    <div
      [hlmContextMenuTrigger]="menu"
      [disabled]="locked()"
      (hlmContextMenuOpened)="status.set('open')"
      (hlmContextMenuClosed)="status.set('closed')"
      class="rounded border p-8 text-sm"
    >
      Right-click (status: {{ status() }})
    </div>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <button hlmDropdownMenuItem>Action</button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class DisabledContextMenuComponent {
  readonly locked = signal(false);
  readonly status = signal('closed');
}
```

### 5. Card / list with per-item menus (composition)

```ts
import { Component } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-card-context-menu',
  standalone: true,
  imports: [...HlmContextMenuImports, ...HlmCardImports, ...HlmDropdownMenuImports],
  template: `
    <div hlmCard class="w-80" [hlmContextMenuTrigger]="menu">
      <div hlmCardHeader>
        <h3 hlmCardTitle>Q3 report.pdf</h3>
        <p hlmCardDescription>Right-click for file actions.</p>
      </div>
      <div hlmCardContent class="text-sm">2.4 MB · Modified yesterday</div>
    </div>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <button hlmDropdownMenuItem>Preview</button>
        <button hlmDropdownMenuItem>Download</button>
        <button hlmDropdownMenuItem>Share…</button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class CardContextMenuComponent {}
```

### 6. Full custom menu content (icons + shortcuts + submenu hints)

```ts
import { Component } from '@angular/core';
import { HlmContextMenuImports } from '@egose/shadcn-theme-ng/context-menu';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideScissors, lucideClipboardPaste } from '@ng-icons/lucide';

@Component({
  selector: 'app-rich-context-menu',
  standalone: true,
  imports: [...HlmContextMenuImports, ...HlmDropdownMenuImports, NgIcon],
  providers: [provideIcons({ lucideCopy, lucideScissors, lucideClipboardPaste })],
  template: `
    <div [hlmContextMenuTrigger]="menu" class="bg-muted rounded-lg p-10 text-sm">Right-click for a rich menu</div>

    <ng-template #menu>
      <hlm-dropdown-menu class="w-56">
        <hlm-dropdown-menu-label>Clipboard</hlm-dropdown-menu-label>
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem>
            <ng-icon name="lucideScissors" /> Cut <span hlmDropdownMenuShortcut>⌘X</span>
          </button>
          <button hlmDropdownMenuItem>
            <ng-icon name="lucideCopy" /> Copy <span hlmDropdownMenuShortcut>⌘C</span>
          </button>
          <button hlmDropdownMenuItem>
            <ng-icon name="lucideClipboardPaste" /> Paste <span hlmDropdownMenuShortcut>⌘V</span>
          </button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class RichContextMenuComponent {}
```

## Accessibility notes

- Right-click is pointer-only: always provide a keyboard-accessible equivalent (a `…` button opening the same menu template via `hlm-dropdown-menu-trigger`, or visible action buttons) — otherwise keyboard/SR users lose the actions entirely.
- The trigger area keeps `select-none` but remains focusable content; do not set `disabled` without explaining why (adjacent hint or tooltip).
- Menu content comes from `dropdown-menu`/`menu` primitives with roving-focus, Escape-to-close, and arrow-key navigation — keep those behaviors; do not trap focus in the trigger.
- `hlmContextMenuOpened/Closed` let you mirror state (e.g. highlight the trigger area while open) so sighted keyboard users get the same context.

## Theming / CSS variables

No component-specific CSS variables in this subpath. The trigger only adds `select-none`; all panel styling (surface, animations from the click corner via `transformOriginSelector`, `data-side` variants) lives in the `dropdown-menu`/`menu` content components.

## Related subpaths

- `@egose/shadcn-theme-ng/dropdown-menu` — the menu panel content (`hlm-dropdown-menu`, items, separators, shortcuts).
- `@egose/shadcn-theme-ng/menu` — lower-level menu primitives if you build custom panels.
- `@egose/shadcn-theme-ng/popover` — click-triggered floating panels (vs right-click here).
- `@egose/shadcn-theme-ng/tooltip` — hints for the keyboard-accessible equivalents of context actions.
