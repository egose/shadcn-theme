# Menubar (`@egose/shadcn-theme-ng/menubar`)

Desktop app-style menu bar (shadcn/ui `menubar` equivalent): a horizontal `hlm-menubar` strip whose `hlmMenubarTrigger` buttons each open a floating menu (in practice, an `hlm-menu` / `hlm-dropdown-menu` surface). The bar and trigger are thin shadcn wrappers around Angular CDK `CdkMenuBar` / `CdkMenuItem` + `CdkMenuTrigger`, with spartan-ng menu-position helpers (`align`/`side`, global config token) for popup placement.

Ships as `@egose/shadcn-theme-ng/menubar` and `@egose/shadcn-theme-ng-tw/menubar` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency; at runtime it also uses `@angular/cdk/menu` and `@spartan-ng/brain/core` position helpers, and you will typically pair it with `@egose/shadcn-theme-ng/menu` or `.../dropdown-menu` for the popup surfaces. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmMenubar, // directive: [hlmMenubar],hlm-menubar
  HlmMenubarTrigger, // directive: button[hlmMenubarTrigger]
  HlmMenubarConfig, // interface { align, side }
  provideHlmMenubarConfig, // (config: Partial<HlmMenubarConfig>) => ValueProvider
  injectHlmMenubarConfig, // () => HlmMenubarConfig
  HlmMenubarImports, // readonly [HlmMenubar, HlmMenubarTrigger]
  HlmMenubarModule, // NgModule wrapping HlmMenubarImports
} from '@egose/shadcn-theme-ng/menubar';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmMenubarImports } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmMenubarImports, ...HlmMenuImports],
  template: `
    <hlm-menubar>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="fileMenu">File</button>
    </hlm-menubar>
    <ng-template #fileMenu>
      <hlm-menu><button hlmMenuItem>New</button></hlm-menu>
    </ng-template>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmMenubarModule } from '@egose/shadcn-theme-ng/menubar';

@NgModule({ imports: [HlmMenubarModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/menubar`. Symbol names are identical.

## Anatomy / Structure

```html
<hlm-menubar>
  <button hlmMenubarTrigger [hlmMenubarTrigger]="fileTpl">File</button>
  <button hlmMenubarTrigger [hlmMenubarTrigger]="editTpl" [hlmMenubarTriggerData]="{ user: me }">Edit</button>
  <button hlmMenubarTrigger [disabled]="locked()">View</button>
</hlm-menubar>

<ng-template #fileTpl>
  <hlm-menu variant="menubar">
    <button hlmMenuItem>New file</button>
    <hlm-menu-separator />
    <button hlmMenuItem variant="destructive">Delete</button>
  </hlm-menu>
</ng-template>
```

| Class               | Selector                    | Host requirements                        | Role                                                                                          |
| ------------------- | --------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `HlmMenubar`        | `[hlmMenubar],hlm-menubar`  | any element or the `hlm-menubar` element | Bar container (`CdkMenuBar` host directive, `data-slot="menubar"`)                            |
| `HlmMenubarTrigger` | `button[hlmMenubarTrigger]` | `<button>` only                          | Menu button (`CdkMenuItem` + `CdkMenuTrigger` host directives, `data-slot="menubar-trigger"`) |

The trigger wires two CDK inputs under shadcn aliases: `hlmMenubarTrigger` → `cdkMenuTriggerFor` (the template), `hlmMenubarTriggerData` → `cdkMenuTriggerData` (context passed to the template). It also re-emits `cdkMenuOpened`/`cdkMenuClosed` as `hlmDropdownMenuOpened`/`hlmDropdownMenuClosed` (names inherited from the dropdown-menu lineage — bind those names, not the `cdk*` ones).

## API reference

### `HlmMenubar` (`[hlmMenubar],hlm-menubar`)

No inputs/outputs/methods. Host directives: `CdkMenuBar`. Styling: `bg-background h-9 gap-1 rounded-md border p-1 shadow-xs flex items-center`.

### `HlmMenubarTrigger` (`button[hlmMenubarTrigger]`)

| Member                  | Kind               | Type / Default                                           | Notes                                                                                               |
| ----------------------- | ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `disabled`              | input              | `boolean`, `false` (boolean coercion)                    | Forwarded to `CdkMenuItem` (`cdkMenuItemDisabled`); also sets host `[disabled]` and `data-disabled` |
| `align`                 | input              | `MenuAlign`, default from `HlmMenubarConfig` (`'start'`) | Menu alignment; drives `menuPosition` via `createMenuPosition(align, side)`                         |
| `side`                  | input              | `MenuSide`, default from config (`'bottom'`)             | Menu side; drives `menuPosition`                                                                    |
| `hlmMenubarTrigger`     | input (CDK alias)  | `Menu` template ref                                      | `cdkMenuTriggerFor`: the popup template                                                             |
| `hlmMenubarTriggerData` | input (CDK alias)  | `unknown`                                                | `cdkMenuTriggerData`: context for the popup template                                                |
| `hlmDropdownMenuOpened` | output (CDK alias) | `void`                                                   | Re-emits `cdkMenuOpened`                                                                            |
| `hlmDropdownMenuClosed` | output (CDK alias) | `void`                                                   | Re-emits `cdkMenuClosed`                                                                            |

The constructor sets the CDK `transformOriginSelector` to `'[data-slot="dropdown-menu"]'` and syncs `menuPosition` in an `effect`.

### `HlmMenubarConfig` + providers

| Symbol                            | Shape                                          | Notes                                                                  |
| --------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| `HlmMenubarConfig`                | `{ align: MenuAlign; side: MenuSide }`         | Defaults `{ align: 'start', side: 'bottom' }`                          |
| `provideHlmMenubarConfig(config)` | `(Partial<HlmMenubarConfig>) => ValueProvider` | Provide at component/root to change defaults for all triggers in scope |
| `injectHlmMenubarConfig()`        | `() => HlmMenubarConfig`                       | Reads the token, falls back to defaults                                |

## Examples

### 1. Basic File/Edit bar

```ts
import { Component } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HlmMenubarImports } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menubar-basic',
  standalone: true,
  imports: [CdkMenuModule, ...HlmMenubarImports, ...HlmMenuImports],
  template: `
    <hlm-menubar>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="fileTpl">File</button>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="editTpl">Edit</button>
    </hlm-menubar>

    <ng-template #fileTpl>
      <hlm-menu variant="menubar">
        <button hlmMenuItem (cdkMenuItemTriggered)="onNew()">New file</button>
        <button hlmMenuItem>Open…</button>
        <hlm-menu-separator />
        <button hlmMenuItem variant="destructive">Delete</button>
      </hlm-menu>
    </ng-template>

    <ng-template #editTpl>
      <hlm-menu variant="menubar">
        <button hlmMenuItem>Undo</button>
        <button hlmMenuItem>Redo</button>
      </hlm-menu>
    </ng-template>
  `,
})
export class MenubarBasicComponent {
  onNew(): void {
    console.log('new file');
  }
}
```

```html
<hlm-menubar>
  <button hlmMenubarTrigger [hlmMenubarTrigger]="fileTpl">File</button>
  <button hlmMenubarTrigger [hlmMenubarTrigger]="editTpl">Edit</button>
</hlm-menubar>
```

### 2. Disabled trigger + open/close events

```ts
import { Component, signal } from '@angular/core';
import { HlmMenubarImports } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menubar-events',
  standalone: true,
  imports: [...HlmMenubarImports, ...HlmMenuImports],
  template: `
    <hlm-menubar>
      <button
        hlmMenubarTrigger
        [hlmMenubarTrigger]="viewTpl"
        [disabled]="locked()"
        (hlmDropdownMenuOpened)="onOpen()"
        (hlmDropdownMenuClosed)="onClose()"
      >
        View
      </button>
    </hlm-menubar>

    <ng-template #viewTpl>
      <hlm-menu variant="menubar">
        <button hlmMenuItemCheckbox [cdkMenuItemChecked]="true">
          <hlm-menu-item-check />
          Show sidebar
        </button>
      </hlm-menu>
    </ng-template>

    <p class="tw:text-sm tw:text-muted-foreground">Menu is {{ open() ? 'open' : 'closed' }}.</p>
  `,
})
export class MenubarEventsComponent {
  readonly locked = signal(false);
  readonly open = signal(false);

  onOpen(): void {
    this.open.set(true);
  }
  onClose(): void {
    this.open.set(false);
  }
}
```

### 3. Placement: align/side per trigger

```ts
import { Component } from '@angular/core';
import { HlmMenubarImports } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menubar-placement',
  standalone: true,
  imports: [...HlmMenubarImports, ...HlmMenuImports],
  template: `
    <hlm-menubar>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="aTpl" align="start" side="bottom">Start/Bottom</button>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="bTpl" align="end" side="bottom">End/Bottom</button>
    </hlm-menubar>

    <ng-template #aTpl>
      <hlm-menu variant="menubar"><button hlmMenuItem>Item A</button></hlm-menu>
    </ng-template>
    <ng-template #bTpl>
      <hlm-menu variant="menubar"><button hlmMenuItem>Item B</button></hlm-menu>
    </ng-template>
  `,
})
export class MenubarPlacementComponent {}
```

### 4. Global defaults via `provideHlmMenubarConfig`

```ts
import { Component } from '@angular/core';
import { HlmMenubarImports, provideHlmMenubarConfig } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menubar-config',
  standalone: true,
  imports: [...HlmMenubarImports, ...HlmMenuImports],
  providers: [provideHlmMenubarConfig({ align: 'end', side: 'bottom' })],
  template: `
    <hlm-menubar>
      <!-- inherits align=end from the provider; side can still be overridden per trigger -->
      <button hlmMenubarTrigger [hlmMenubarTrigger]="tpl">File</button>
    </hlm-menubar>
    <ng-template #tpl>
      <hlm-menu variant="menubar"><button hlmMenuItem>New</button></hlm-menu>
    </ng-template>
  `,
})
export class MenubarConfigComponent {}
```

### 5. Passing data into the menu template

```ts
import { Component, signal } from '@angular/core';
import { HlmMenubarImports } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuImports } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menubar-data',
  standalone: true,
  imports: [...HlmMenubarImports, ...HlmMenuImports],
  template: `
    <hlm-menubar>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="shareTpl" [hlmMenubarTriggerData]="{ file: file() }">Share</button>
    </hlm-menubar>

    <ng-template #shareTpl let-file="file">
      <hlm-menu variant="menubar">
        <hlm-menu-label>Share “{{ file }}”</hlm-menu-label>
        <button hlmMenuItem>Email link</button>
        <button hlmMenuItem>Copy link</button>
      </hlm-menu>
    </ng-template>
  `,
})
export class MenubarDataComponent {
  readonly file = signal('proposal.docx');
}
```

### 6. NgModule consumer + attribute selector form

```ts
import { NgModule, Component } from '@angular/core';
import { HlmMenubarModule } from '@egose/shadcn-theme-ng/menubar';
import { HlmMenuModule } from '@egose/shadcn-theme-ng/menu';

@Component({
  selector: 'app-menubar-legacy',
  template: `
    <div hlmMenubar>
      <button hlmMenubarTrigger [hlmMenubarTrigger]="tpl">File</button>
    </div>
    <ng-template #tpl>
      <hlm-menu variant="menubar"><button hlmMenuItem>New</button></hlm-menu>
    </ng-template>
  `,
})
export class MenubarLegacyComponent {}

@NgModule({
  declarations: [MenubarLegacyComponent],
  imports: [HlmMenubarModule, HlmMenuModule],
  exports: [MenubarLegacyComponent],
})
export class MenubarLegacyModule {}
```

## Accessibility notes

- `CdkMenuBar` provides the menubar role, roving tabindex across triggers, arrow-key movement, and `aria-expanded` on open triggers — keep triggers as real `<button>` elements inside the bar so the pattern holds.
- The trigger selector requires `<button>`; do not attach `hlmMenubarTrigger` to `<a>`/`<div>`.
- Disabled triggers expose `disabled` + `data-disabled` and are skipped by keyboard navigation.
- Popup content (`hlm-menu`) carries menu semantics; label open/close state changes if you add extra status text (see example 2) with `aria-live` where appropriate.

## Theming / CSS variables

No theming inputs. The bar uses `bg-background border shadow-xs`; triggers use `hover:bg-muted aria-expanded:bg-muted data-disabled:opacity-50`. Override placement globally with `provideHlmMenubarConfig`, per-trigger with `align`/`side`.

## Related subpaths

- `@egose/shadcn-theme-ng/menu` (`HlmMenu`, `HlmMenuItem`, …) — popup surfaces and rows for menubar templates.
- `@egose/shadcn-theme-ng/dropdown-menu` — alternative trigger/menu pair when you need a single button menu instead of a bar.
- `@egose/shadcn-theme-ng/navigation-menu` — site-navigation pattern (links + content panels) vs the menubar's action-menu pattern.
