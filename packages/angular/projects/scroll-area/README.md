# Scroll Area (`@egose/shadcn-theme-ng/scroll-area`)

A shadcn/ui-style **Scroll Area** — a themed scrollable container with hover-reveal scrollbars. This is the Angular equivalent of shadcn/ui `ScrollArea`.

Unlike most subpaths in this library it is **not** built on spartan-ng/brain: it is a thin directive wrapper over `NgScrollbar` from **ngx-scrollbar**. The directive matches `ng-scrollbar[hlm]` (or `ng-scrollbar[hlmScrollbar]`), forces `visibility: 'hover'` scrollbar options, and pins the shadcn scrollbar CSS variables (thumb color, track color/thickness) so every scroll area looks consistent with the theme.

> **Ships as:** `@egose/shadcn-theme-ng/scroll-area` and `@egose/shadcn-theme-ng-tw/scroll-area` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmScrollAreaImports } from '@egose/shadcn-theme-ng/scroll-area';
// tw variant:
// import { HlmScrollAreaImports } from '@egose/shadcn-theme-ng-tw/scroll-area';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain`. Runtime `ngx-scrollbar` is installed transitively — but note you must import `NgScrollbar` itself (from `ngx-scrollbar`) wherever you use the directive, since this package only provides the `hlm` styling layer.

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                 | Kind          | Description                                                                                       |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `HlmScrollArea`        | Directive     | Styling/behavior layer for `NgScrollbar`; selector `ng-scrollbar[hlm],ng-scrollbar[hlmScrollbar]` |
| `HlmScrollAreaImports` | `const` array | `[HlmScrollArea]` standalone imports                                                              |
| `HlmScrollAreaModule`  | `NgModule`    | NgModule wrapper re-exporting `HlmScrollArea`                                                     |

Standalone usage (you almost always pair it with `NgScrollbar`):

```ts
import { Component } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@egose/shadcn-theme-ng/scroll-area';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [NgScrollbar, HlmScrollAreaImports],
  template: ` <ng-scrollbar hlm class="tw:h-64"> ... </ng-scrollbar> `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaModule } from '@egose/shadcn-theme-ng/scroll-area';

@NgModule({ imports: [NgScrollbar, HlmScrollAreaModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<ng-scrollbar hlm class="tw:h-72 tw:w-80 tw:rounded-md tw:border">
  <div class="tw:p-4">
    <h4>Title</h4>
    <p>Scrollable content…</p>
  </div>
</ng-scrollbar>
```

Real selectors:

| Selector                                          | Class           | Notes                                                                                                    |
| ------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| `ng-scrollbar[hlm]`, `ng-scrollbar[hlmScrollbar]` | `HlmScrollArea` | `data-slot="scroll-area"`; requires the `NgScrollbar` component from `ngx-scrollbar` as the host element |

The directive sets these host bindings: `--scrollbar-thumb-color` and `--scrollbar-thumb-hover-color` to `var(--border)`, `--scrollbar-track-color: transparent`, `--scrollbar-track-thickness: 0.625rem`, `--scrollbar-track-offset: 1.5px`, plus a rounded/pill thumb shape and block layout classes. Scrollbars appear on hover (`visibility: 'hover'`).

## API reference

`HlmScrollArea` declares **no inputs, outputs, or methods of its own** — it is a pure styling directive. All scrolling behavior/inputs (e.g. `orientation`, `visibility` overrides, viewport access) come from the host `NgScrollbar` component itself; consult the `ngx-scrollbar` API for those.

| Host CSS variables set by the directive | Value                |
| --------------------------------------- | -------------------- |
| `--scrollbar-thumb-color`               | `var(--border)`      |
| `--scrollbar-thumb-hover-color`         | `var(--border)`      |
| `--scrollbar-track-color`               | `transparent`        |
| `--scrollbar-track-thickness`           | `0.625rem`           |
| `--scrollbar-track-offset`              | `1.5px`              |
| `--scrollbar-thumb-shape`               | `9999px` (via class) |

## Examples

### 1. Basic vertical scroll area

```ts
import { Component } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@egose/shadcn-theme-ng/scroll-area';

@Component({
  selector: 'app-basic-scroll',
  standalone: true,
  imports: [NgScrollbar, HlmScrollAreaImports],
  template: `
    <ng-scrollbar hlm class="tw:h-64 tw:w-80 tw:rounded-md tw:border">
      <div class="tw:p-4 tw:space-y-2">
        @for (item of items; track item) {
          <p class="tw:text-sm">{{ item }}</p>
        }
      </div>
    </ng-scrollbar>
  `,
})
export class BasicScrollComponent {
  readonly items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
}
```

### 2. Fixed-height log / chat window

```ts
import { Component, signal } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollAreaImports } from '@egose/shadcn-theme-ng/scroll-area';

@Component({
  selector: 'app-log-scroll',
  standalone: true,
  imports: [NgScrollbar, HlmScrollAreaImports],
  template: `
    <ng-scrollbar hlm class="tw:h-72 tw:rounded-md tw:border tw:bg-muted/30">
      <div class="tw:p-4 tw:font-mono tw:text-xs tw:space-y-1">
        @for (line of lines(); track $index) {
          <div>{{ line }}</div>
        }
      </div>
    </ng-scrollbar>
    <button type="button" (click)="addLine()">Add line</button>
  `,
})
export class LogScrollComponent {
  readonly lines = signal(['[ok] booted', '[ok] connected']);

  addLine(): void {
    this.lines.update((ls) => [...ls, `[log] event ${ls.length}`]);
  }
}
```

### 3. Horizontal scrolling row

`NgScrollbar` supports horizontal viewports — the `hlm` styling applies the same way:

```html
<ng-scrollbar hlm orientation="horizontal" class="tw:w-full tw:max-w-xl tw:rounded-md tw:border">
  <div class="tw:flex tw:gap-3 tw:p-4 tw:w-max">
    @for (card of cards; track card) {
    <div class="tw:h-24 tw:w-40 tw:shrink-0 tw:rounded-md tw:bg-muted tw:p-2">{{ card }}</div>
    }
  </div>
</ng-scrollbar>
```

### 4. Scroll area inside a card

```html
<div class="tw:rounded-lg tw:border tw:p-4">
  <h3 class="tw:mb-2 tw:font-semibold">Recent activity</h3>
  <ng-scrollbar hlm class="tw:h-48">
    <ul class="tw:space-y-2 tw:pe-4">
      @for (event of activity; track event.id) {
      <li class="tw:flex tw:justify-between tw:text-sm">
        <span>{{ event.label }}</span>
        <span class="tw:text-muted-foreground">{{ event.at }}</span>
      </li>
      }
    </ul>
  </ng-scrollbar>
</div>
```

Leave end-padding (`pe-4`) so text never slides under the hover scrollbar.

### 5. Long select/popover content

Scrollable dropdown content with the themed thumb:

```html
<ng-scrollbar hlm class="tw:max-h-60 tw:w-64 tw:rounded-md tw:border">
  <div class="tw:p-1">
    @for (option of options; track option.value) {
    <button
      type="button"
      (click)="pick(option)"
      class="tw:w-full tw:rounded-sm tw:px-2 tw:py-1.5 tw:text-left tw:text-sm tw:hover:bg-accent"
    >
      {{ option.label }}
    </button>
    }
  </div>
</ng-scrollbar>
```

### 6. Overriding thumb color per instance

The colors are CSS variables, so any instance can be re-themed inline:

```html
<ng-scrollbar
  hlm
  class="tw:h-64 tw:rounded-md tw:border"
  style="--scrollbar-thumb-color: var(--primary); --scrollbar-thumb-hover-color: var(--primary);"
>
  <div class="tw:p-4">Brand-colored scrollbar…</div>
</ng-scrollbar>
```

## Accessibility notes

- `NgScrollbar` keeps native scroll semantics; keyboard users can scroll the region with arrows/PageUp/PageDown when it has focus — make sure scrollable regions with important content are focusable (`tabindex="0"`) and labelled (`aria-label`/`role="region"`).
- Hover-only scrollbars can be hard to discover for pointer users and invisible to some low-vision users — for primary page-level scrolling prefer native overflow; reserve this component for secondary panes (sidebars, dropdowns, logs).
- Do not nest scroll areas with competing orientations unless each has a clear label; nested scroll traps confuse both keyboard and screen-reader users.

## Theming / CSS variables

The component is driven by `--scrollbar-*` variables (see table above) plus the theme's `--border` token. Override per instance with inline `style` as shown in example 6; dark mode follows automatically through the theme tokens.

## Related subpaths

- `@egose/shadcn-theme-ng/resizable` — fixed-size panes that pair well with internal scroll areas
- `@egose/shadcn-theme-ng/select` — its dropdown content scrolls internally for long option lists
- `@egose/shadcn-theme-ng/sidebar` — sidebar content areas that often need themed scrolling
- `@egose/shadcn-theme-ng/card` — bordered containers frequently wrapped around scroll areas
