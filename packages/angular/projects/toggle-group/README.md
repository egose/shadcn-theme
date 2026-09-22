# Toggle Group (`@egose/shadcn-theme-ng/toggle-group`)

A set of related two-state buttons, equivalent to [shadcn/ui Toggle Group](https://ui.shadcn.com/docs/components/toggle-group). This subpath ships `HlmToggleGroup` (container, `[hlmToggleGroup]` / `<hlm-toggle-group>`) and `HlmToggleGroupItem` (member, `button[hlmToggleGroupItem]`) over spartan-ng's `BrnToggleGroup` / `BrnToggleGroupItem` primitives, plus the `HlmToggleGroupToken` injection context (`injectHlmToggleGroup()`, `provideHlmToggleGroup()`). Sizing/variant cascade from the group to items via DI; item-level inputs override the group.

> **Ships as:** `@egose/shadcn-theme-ng/toggle-group` and `@egose/shadcn-theme-ng-tw/toggle-group` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@spartan-ng/brain` and `@egose/shadcn-theme-ng/toggle` (for `toggleVariants`) arrive transitively. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/toggle-group/src/public-api.ts`:

```ts
import {
  HlmToggleGroup,
  HlmToggleGroupImports,
  HlmToggleGroupItem,
  HlmToggleGroupModule,
  HlmToggleGroupToken,
  injectHlmToggleGroup,
  provideHlmToggleGroup,
} from '@egose/shadcn-theme-ng/toggle-group';
import type { HlmToggleGroupContext } from '@egose/shadcn-theme-ng/toggle-group';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/toggle-group'
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmToggleGroupImports } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmToggleGroupImports],
  template: `
    <div hlmToggleGroup>
      <button hlmToggleGroupItem value="a">A</button>
    </div>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmToggleGroupModule } from '@egose/shadcn-theme-ng/toggle-group';

@NgModule({ imports: [HlmToggleGroupModule] })
export class FeatureModule {}
```

| Symbol                    | Kind             | Description                                                              |
| ------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `HlmToggleGroup`          | Directive        | Container: `[hlmToggleGroup], hlm-toggle-group`. Provides group context. |
| `HlmToggleGroupItem`      | Directive        | Member: `button[hlmToggleGroupItem]`. Inherits group variant/size.       |
| `HlmToggleGroupToken`     | `InjectionToken` | DI token for `HlmToggleGroupContext` (variant/size/spacing).             |
| `injectHlmToggleGroup()`  | Function         | Injects the parent group context (for custom items).                     |
| `provideHlmToggleGroup()` | Function         | Provides the group context for a custom container.                       |
| `HlmToggleGroupContext`   | Interface (type) | `{ variant, size, spacing }` input signals shared via DI.                |
| `HlmToggleGroupImports`   | `const` array    | `[HlmToggleGroup, HlmToggleGroupItem]`.                                  |
| `HlmToggleGroupModule`    | NgModule         | Imports + re-exports both directives.                                    |

## Anatomy / Structure

```html
<!-- single-select formatting group -->
<div hlmToggleGroup type="single" variant="outline" size="default">
  <button hlmToggleGroupItem value="bold" aria-label="Toggle bold">B</button>
  <button hlmToggleGroupItem value="italic" aria-label="Toggle italic">I</button>
  <button hlmToggleGroupItem value="underline" aria-label="Toggle underline">U</button>
</div>

<!-- multi-select with spacing + vertical orientation -->
<div hlmToggleGroup type="multiple" variant="outline" [spacing]="1" orientation="vertical">
  <button hlmToggleGroupItem value="left" aria-label="Align left">L</button>
  <button hlmToggleGroupItem value="center" aria-label="Align center">C</button>
  <button hlmToggleGroupItem value="right" aria-label="Align right">R</button>
</div>
```

> Items must be `<button hlmToggleGroupItem value="…">`. The group `type` is `'single' | 'multiple'` (from Brn); omit `type` only for uncontrolled demos.

## API reference

### `HlmToggleGroup` — selector `[hlmToggleGroup], hlm-toggle-group` (directive, hosts `BrnToggleGroup`)

Own styling inputs:

| Input         | Type                                                   | Default        | Description                                                                                                       |
| ------------- | ------------------------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| `variant`     | `ToggleVariants['variant']` (`'default' \| 'outline'`) | `'default'`    | Cascades to items (item input wins when set). Reflected to `data-variant`.                                        |
| `size`        | `ToggleVariants['size']` (`'default' \| 'sm' \| 'lg'`) | `'default'`    | Cascades to items. Reflected to `data-size`.                                                                      |
| `spacing`     | `number` (coerced with `numberAttribute`)              | `0`            | Gap level. Reflected to `data-spacing` + `--gap` (`gap-[--spacing(var(--gap))]`). `0` = joined segmented control. |
| `orientation` | `'horizontal' \| 'vertical'`                           | `'horizontal'` | Layout direction. Reflected to `data-orientation`.                                                                |

Forwarded to `BrnToggleGroup` via `hostDirectives`:

| Input / Output | Direction | Description                                                   |
| -------------- | --------- | ------------------------------------------------------------- |
| `type`         | input     | `'single' \| 'multiple'` selection mode.                      |
| `value`        | input     | Current value(s). Supports two-way binding.                   |
| `nullable`     | input     | (single mode) whether deselecting the active item is allowed. |
| `disabled`     | input     | Disables the whole group.                                     |
| `valueChange`  | output    | Emits when the group value changes.                           |

Host: `data-slot="toggle-group"`, `flex w-fit` (column when `data-vertical`).

### `HlmToggleGroupItem` — selector `button[hlmToggleGroupItem]` (directive, hosts `BrnToggleGroupItem`)

| Input     | Type                        | Default     | Description                                                                                           |
| --------- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| `variant` | `ToggleVariants['variant']` | `'default'` | Overrides the group variant when set (group wins when the group value is truthy — see surprise note). |
| `size`    | `ToggleVariants['size']`    | `'default'` | Overrides the group size when set (same precedence rule).                                             |

Forwarded to `BrnToggleGroupItem`: `id`, `value` (required per item), `disabled`, `state`, `aria-label`, `type` inputs and `stateChange` output.

Host: `data-slot="toggle-group-item"`, reflects resolved `data-variant` / `data-size` and group `data-spacing`. Styling = item overrides + `toggleVariants({ variant, size })`.

### Token helpers — `hlm-toggle-group.token.ts`

```ts
interface HlmToggleGroupContext {
  readonly variant: InputSignal<ToggleVariants['variant']>;
  readonly size: InputSignal<ToggleVariants['size']>;
  readonly spacing: InputSignalWithTransform<number, NumberInput>;
}
```

`provideHlmToggleGroup(HlmToggleGroup)` is wired automatically on the group directive; call it manually only for custom container components. `injectHlmToggleGroup()` reads the parent context (throws outside a group).

## Examples

### 1. Basic single-select formatting group

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmToggleGroupImports } from '@egose/shadcn-theme-ng/toggle-group';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmToggleGroupImports, NgIcon],
  providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
  template: `
    <div hlmToggleGroup type="single" variant="outline">
      <button hlmToggleGroupItem value="bold" aria-label="Toggle bold"><ng-icon name="lucideBold" /></button>
      <button hlmToggleGroupItem value="italic" aria-label="Toggle italic"><ng-icon name="lucideItalic" /></button>
      <button hlmToggleGroupItem value="underline" aria-label="Toggle underline">
        <ng-icon name="lucideUnderline" />
      </button>
    </div>
  `,
})
export class DemoBasic {}
```

### 2. Controlled value (`value` / `valueChange`)

```ts
// demo-controlled.component.ts
import { Component, signal } from '@angular/core';
import { HlmToggleGroupImports } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'demo-controlled',
  standalone: true,
  imports: [...HlmToggleGroupImports],
  template: `
    <div hlmToggleGroup type="single" [value]="align()" (valueChange)="align.set($event)" variant="outline">
      <button hlmToggleGroupItem value="left">Left</button>
      <button hlmToggleGroupItem value="center">Center</button>
      <button hlmToggleGroupItem value="right">Right</button>
    </div>
    <p class="text-sm text-muted-foreground">Align: {{ align() ?? 'none' }}</p>
  `,
})
export class DemoControlled {
  readonly align = signal<string | null>('left');
}
```

Multi-select holds an array:

```html
<div hlmToggleGroup type="multiple" [value]="picked()" (valueChange)="picked.set($event)">
  <button hlmToggleGroupItem value="a">A</button>
  <button hlmToggleGroupItem value="b">B</button>
  <button hlmToggleGroupItem value="c">C</button>
</div>
```

```ts
readonly picked = signal<string[]>(['a']);
```

### 3. Sizes, spacing, and orientation

```ts
// demo-layout.component.ts
import { Component } from '@angular/core';
import { HlmToggleGroupImports } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'demo-layout',
  standalone: true,
  imports: [...HlmToggleGroupImports],
  template: `
    <!-- joined segmented control (spacing 0) -->
    <div hlmToggleGroup type="single" variant="outline" size="sm">
      <button hlmToggleGroupItem value="day">Day</button>
      <button hlmToggleGroupItem value="week">Week</button>
      <button hlmToggleGroupItem value="month">Month</button>
    </div>

    <!-- separated pills -->
    <div hlmToggleGroup type="multiple" variant="default" [spacing]="2" class="mt-4">
      <button hlmToggleGroupItem value="a">A</button>
      <button hlmToggleGroupItem value="b">B</button>
      <button hlmToggleGroupItem value="c">C</button>
    </div>

    <!-- vertical stack -->
    <div hlmToggleGroup type="single" variant="outline" orientation="vertical" class="mt-4">
      <button hlmToggleGroupItem value="top">Top</button>
      <button hlmToggleGroupItem value="mid">Middle</button>
      <button hlmToggleGroupItem value="bot">Bottom</button>
    </div>
  `,
})
export class DemoLayout {}
```

### 4. Disabled group / disabled item

```ts
// demo-disabled.component.ts
import { Component } from '@angular/core';
import { HlmToggleGroupImports } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'demo-disabled',
  standalone: true,
  imports: [...HlmToggleGroupImports],
  template: `
    <div hlmToggleGroup type="single" disabled variant="outline">
      <button hlmToggleGroupItem value="a">A</button>
      <button hlmToggleGroupItem value="b">B</button>
    </div>
    <div hlmToggleGroup type="single" variant="outline" class="mt-2">
      <button hlmToggleGroupItem value="a">A</button>
      <button hlmToggleGroupItem value="b" disabled>B (off)</button>
    </div>
  `,
})
export class DemoDisabled {}
```

### 5. Per-item variant/size override

```ts
// demo-override.component.ts
import { Component } from '@angular/core';
import { HlmToggleGroupImports } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'demo-override',
  standalone: true,
  imports: [...HlmToggleGroupImports],
  template: `
    <div hlmToggleGroup type="single" variant="outline" size="sm">
      <button hlmToggleGroupItem value="a">A (group sm)</button>
      <button hlmToggleGroupItem value="b" size="lg">B (own lg)</button>
    </div>
  `,
})
export class DemoOverride {}
```

> Precedence surprise: `_variant = group.variant() || item.variant()` — the **group value wins whenever truthy**. Since both default to `'default'` (truthy), item overrides only take effect when the group variant/size is set to a falsy value or the group input is removed. In practice, set variant/size on the group _or_ per item, not both.

### 6. Advanced: custom item via `injectHlmToggleGroup()`

Build your own item that still follows the group:

```ts
// custom-item.component.ts
import { Component, computed } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { toggleVariants } from '@egose/shadcn-theme-ng/toggle';
import { injectHlmToggleGroup } from '@egose/shadcn-theme-ng/toggle-group';

@Component({
  selector: 'button[customGroupItem]',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
})
export class CustomGroupItem {
  private readonly group = injectHlmToggleGroup(); // must sit inside [hlmToggleGroup]
  protected classes = computed(() =>
    hlm(toggleVariants({ variant: this.group.variant(), size: this.group.size() }), 'uppercase'),
  );
}
```

```html
<div hlmToggleGroup type="single" variant="outline">
  <button customGroupItem value="a">A</button>
</div>
```

## Accessibility notes

- Give the group an accessible name (`aria-label` on the group element) when its purpose is not obvious from surrounding headings.
- Icon-only items need `aria-label` each; text items get names from content.
- Keyboard follows the toolbar pattern via the Brn primitive (arrows move, Space/Enter toggle). Keep DOM order = visual order, especially in `vertical` orientation.
- `disabled` on the group disables all items; a single `disabled` item is skipped in navigation — explain why when it blocks a workflow.
- Single-select groups should allow a null/empty state or document that one option is always active (`nullable` input).

## Theming / CSS variables

Group and items share the toggle token set (`bg-muted` pressed, `border-input` outline, `ring-ring/50` focus). `spacing="0"` + `outline` renders a joined segmented control with `shadow-xs`; non-zero spacing renders separated pills with `--gap`. Follows your shadcn theme automatically.

## Related subpaths

- `@egose/shadcn-theme-ng/toggle` — standalone toggle button + `toggleVariants` reused here.
- `@egose/shadcn-theme-ng/button-group` — action button groups (vs. pressed-state groups).
- `@egose/shadcn-theme-ng/tooltip` — labels for icon-only items.
- `@egose/shadcn-theme-ng/utils` — `hlm()` merger used for custom items.
