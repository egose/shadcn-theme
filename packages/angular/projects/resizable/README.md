# Resizable (`@egose/shadcn-theme-ng/resizable`)

A shadcn/ui-style **Resizable** panel layout — draggable split views (side-by-side or stacked) with collapsible panels. This is the Angular equivalent of shadcn/ui `ResizablePanelGroup` / `ResizablePanel` / `ResizableHandle`.

The behavior comes from **spartan-ng/brain** (`BrnResizableGroup`, `BrnResizablePanel`, `BrnResizableHandle`): pointer-drag resizing, panel size constraints, and layout events. This package is a thin styling/directive layer — a flex group container, constraint-forwarding panel directive with a `setSize` helper, and a handle with an optional grip pill.

> **Ships as:** `@egose/shadcn-theme-ng/resizable` and `@egose/shadcn-theme-ng-tw/resizable` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';
// tw variant:
// import { HlmResizableImports } from '@egose/shadcn-theme-ng-tw/resizable';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain`.

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                | Kind          | Description                                                                           |
| --------------------- | ------------- | ------------------------------------------------------------------------------------- |
| `HlmResizableGroup`   | Directive     | Flex row/column container; forwards `BrnResizableGroup`                               |
| `HlmResizablePanel`   | Directive     | Size-constrained panel; forwards `BrnResizablePanel`, `exportAs: 'hlmResizablePanel'` |
| `HlmResizableHandle`  | Component     | Drag handle with optional grip pill; `exportAs: 'hlmResizableHandle'`                 |
| `HlmResizableImports` | `const` array | `[HlmResizableGroup, HlmResizablePanel, HlmResizableHandle]` standalone imports       |
| `HlmResizableModule`  | `NgModule`    | NgModule wrapper re-exporting the three above                                         |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmResizableImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmResizableModule } from '@egose/shadcn-theme-ng/resizable';

@NgModule({ imports: [HlmResizableModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<div hlmResizableGroup direction="horizontal">
  <div hlmResizablePanel defaultSize="25">Sidebar</div>

  <hlm-resizable-handle withHandle />

  <div hlmResizablePanel defaultSize="75">Main content</div>
</div>
```

Real selectors:

| Selector                                     | Class                | Notes                                                                                            |
| -------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| `[hlmResizableGroup]`, `hlm-resizable-group` | `HlmResizableGroup`  | `data-slot="resizable-group"`; row by default, column when the panel-group direction is vertical |
| `[hlmResizablePanel]`, `hlm-resizable-panel` | `HlmResizablePanel`  | `data-slot="resizable-panel"`                                                                    |
| `hlm-resizable-handle`                       | `HlmResizableHandle` | `data-slot="resizable-handle"`; renders a grip `<div>` only when `withHandle` is true            |

## API reference

### HlmResizableGroup (directive)

Thin directive wrapper — no own inputs. Forwarded `BrnResizableGroup` bindings:

| Binding        | Kind   | Description                                   |
| -------------- | ------ | --------------------------------------------- |
| `direction`    | input  | `'horizontal' \| 'vertical'` layout direction |
| `layout`       | input  | Controlled panel layout (sizes)               |
| `dragStart`    | output | Emitted when a drag resize starts             |
| `dragEnd`      | output | Emitted when a drag resize ends               |
| `layoutChange` | output | Emitted when the panel layout changes         |

### HlmResizablePanel (directive)

Thin directive wrapper plus one helper method. No own inputs. Forwarded `BrnResizablePanel` inputs:

| Input         | Description                                      |
| ------------- | ------------------------------------------------ |
| `defaultSize` | Initial size (percentage of the group)           |
| `id`          | Panel id (used for persisted/controlled layouts) |
| `collapsible` | Whether the panel can collapse to zero           |
| `minSize`     | Minimum size (percentage)                        |
| `maxSize`     | Maximum size (percentage)                        |

| Method    | Signature                     | Description                                                                 |
| --------- | ----------------------------- | --------------------------------------------------------------------------- |
| `setSize` | `setSize(size: number): void` | Programmatically resize the panel; delegates to `BrnResizablePanel.setSize` |

Because the directive is `exportAs: 'hlmResizablePanel'`, grab it with a template reference: `<div hlmResizablePanel #panel="hlmResizablePanel">` then call `panel.setSize(50)`.

### HlmResizableHandle (component)

| Input (forwarded to `BrnResizableHandle`) | Description                          |
| ----------------------------------------- | ------------------------------------ |
| `withHandle`                              | Show the grip pill inside the handle |
| `disabled`                                | Disable dragging on this handle      |

When `withHandle` is true the component renders a short rounded pill (`<div class="...">`) centered in the handle; otherwise the handle is just the thin hover/drag strip. Hover cursors adapt to direction (`ew-resize` horizontal, `ns-resize` vertical).

## Examples

### 1. Basic horizontal split

```ts
import { Component } from '@angular/core';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-basic-resizable',
  standalone: true,
  imports: [HlmResizableImports],
  template: `
    <div hlmResizableGroup direction="horizontal" class="tw:h-64 tw:rounded-lg tw:border">
      <div hlmResizablePanel defaultSize="30" class="tw:p-4">Nav</div>
      <hlm-resizable-handle />
      <div hlmResizablePanel defaultSize="70" class="tw:p-4">Content</div>
    </div>
  `,
})
export class BasicResizableComponent {}
```

### 2. Handle with grip pill

```html
<div hlmResizableGroup direction="horizontal" class="tw:h-64 tw:rounded-lg tw:border">
  <div hlmResizablePanel defaultSize="25" class="tw:p-4">Files</div>

  <hlm-resizable-handle withHandle />

  <div hlmResizablePanel defaultSize="75" class="tw:p-4">Editor</div>
</div>
```

### 3. Vertical stacking

```ts
import { Component } from '@angular/core';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-vertical-resizable',
  standalone: true,
  imports: [HlmResizableImports],
  template: `
    <div hlmResizableGroup direction="vertical" class="tw:h-96 tw:rounded-lg tw:border">
      <div hlmResizablePanel defaultSize="40" class="tw:p-4">Preview</div>
      <hlm-resizable-handle withHandle />
      <div hlmResizablePanel defaultSize="60" class="tw:p-4">Console</div>
    </div>
  `,
})
export class VerticalResizableComponent {}
```

The group flips to `flex-col` automatically for vertical direction, and the handle renders horizontally with an `ns-resize` cursor.

### 4. Constrained + collapsible panels

```html
<div hlmResizableGroup direction="horizontal" class="tw:h-64 tw:rounded-lg tw:border">
  <div hlmResizablePanel defaultSize="20" minSize="10" maxSize="40" collapsible class="tw:p-4">
    Collapsible sidebar (10–40%)
  </div>
  <hlm-resizable-handle withHandle />
  <div hlmResizablePanel defaultSize="80" minSize="30" class="tw:p-4">Main (≥30%)</div>
</div>
```

### 5. Programmatic control via `setSize`

```ts
import { Component } from '@angular/core';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-controlled-resizable',
  standalone: true,
  imports: [HlmResizableImports],
  template: `
    <div class="tw:mb-2 tw:flex tw:gap-2">
      <button type="button" (click)="left.setSize(20)">Sidebar 20%</button>
      <button type="button" (click)="left.setSize(50)">Split 50/50</button>
    </div>
    <div hlmResizableGroup direction="horizontal" class="tw:h-64 tw:rounded-lg tw:border">
      <div hlmResizablePanel #left="hlmResizablePanel" defaultSize="30" class="tw:p-4">Nav</div>
      <hlm-resizable-handle withHandle />
      <div hlmResizablePanel defaultSize="70" class="tw:p-4">Content</div>
    </div>
  `,
})
export class ControlledResizableComponent {}
```

### 6. Layout events + three-pane IDE layout

```ts
import { Component, signal } from '@angular/core';
import { HlmResizableImports } from '@egose/shadcn-theme-ng/resizable';

@Component({
  selector: 'app-ide-resizable',
  standalone: true,
  imports: [HlmResizableImports],
  template: `
    <div
      hlmResizableGroup
      direction="horizontal"
      class="tw:h-96 tw:rounded-lg tw:border"
      (dragStart)="dragging.set(true)"
      (dragEnd)="dragging.set(false)"
      (layoutChange)="onLayout($event)"
    >
      <div hlmResizablePanel defaultSize="20" minSize="12" collapsible class="tw:p-4">Explorer</div>
      <hlm-resizable-handle withHandle />
      <div hlmResizablePanel defaultSize="55" minSize="30" class="tw:p-4">Editor</div>
      <hlm-resizable-handle />
      <div hlmResizablePanel defaultSize="25" minSize="15" collapsible class="tw:p-4">Outline</div>
    </div>
    @if (dragging()) {
      <p class="tw:text-muted-foreground tw:text-sm">Resizing…</p>
    }
  `,
})
export class IdeResizableComponent {
  readonly dragging = signal(false);

  onLayout(layout: unknown): void {
    console.log('panel layout:', layout);
  }
}
```

## Accessibility notes

- The drag handle is keyboard-focusable via the underlying `BrnResizableHandle` — ensure handles remain in the tab order (do not set `tabindex="-1"` on them).
- A handle without `withHandle` is only a 1px strip visually; prefer `withHandle` when pointer users need a bigger grab target, and keep `disabled` handles out of confusing layouts (they still occupy space).
- Give each region a landmark or label (`role="region"` + `aria-label`, or headings) so screen-reader users understand the pane structure, since drag-to-resize itself is pointer/keyboard driven on the handle.

## Theming / CSS variables

Class-driven only (flex direction, borders, cursors). Size the group with your own height/width utilities — panels size themselves as percentages of it.

## Related subpaths

- `@egose/shadcn-theme-ng/card` — paneled content inside resizable regions
- `@egose/shadcn-theme-ng/scroll-area` — scrollable overflow inside fixed-size panels
- `@egose/shadcn-theme-ng/sidebar` — app-level collapsible navigation (alternative to a resizable nav pane)
- `@egose/shadcn-theme-ng/separator` — static visual dividers where resizing is not needed
