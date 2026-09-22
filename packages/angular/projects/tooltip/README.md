# Tooltip (`@egose/shadcn-theme-ng/tooltip`)

Contextual hints, equivalent to [shadcn/ui Tooltip](https://ui.shadcn.com/docs/components/tooltip). This subpath ships a single thin directive, `HlmTooltip` (`[hlmTooltip]`), that configures spartan-ng's `BrnTooltip` primitive with shadcn styling: it provides default content classes (`DEFAULT_TOOLTIP_CONTENT_CLASSES`), arrow SVG classes (`DEFAULT_TOOLTIP_SVG_CLASS`), and per-position arrow placement (`tooltipPositionVariants`). All show/hide behavior comes from `BrnTooltip` — this package only themes it.

> **Ships as:** `@egose/shadcn-theme-ng/tooltip` and `@egose/shadcn-theme-ng-tw/tooltip` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@spartan-ng/brain` and `class-variance-authority` arrive transitively. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/tooltip/src/public-api.ts`:

```ts
import {
  DEFAULT_TOOLTIP_CONTENT_CLASSES,
  DEFAULT_TOOLTIP_SVG_CLASS,
  HlmTooltip,
  HlmTooltipImports,
  HlmTooltipModule,
  tooltipPositionVariants,
} from '@egose/shadcn-theme-ng/tooltip';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/tooltip'
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmTooltipImports],
  template: `<button [hlmTooltip]="'Save document'">Save</button>`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmTooltipModule } from '@egose/shadcn-theme-ng/tooltip';

@NgModule({ imports: [HlmTooltipModule] })
export class FeatureModule {}
```

| Symbol                            | Kind             | Description                                                                                                                                          |
| --------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HlmTooltip`                      | Directive        | `[hlmTooltip]` — themed `BrnTooltip` with shadcn defaults.                                                                                           |
| `DEFAULT_TOOLTIP_CONTENT_CLASSES` | `const` (string) | Default bubble classes (`bg-foreground text-background rounded-md px-3 py-1.5 text-xs …`).                                                           |
| `DEFAULT_TOOLTIP_SVG_CLASS`       | `const` (string) | Default arrow classes (`bg-foreground fill-foreground size-2.5 rotate-45 …`). (Note: unprefixed utilities; overridden by the provider with `hlm()`.) |
| `tooltipPositionVariants`         | cva fn           | `tooltipPositionVariants({ position })` — arrow placement for `top/bottom/left/right`.                                                               |
| `HlmTooltipImports`               | `const` array    | `[HlmTooltip]` — spread into `imports: [...]`.                                                                                                       |
| `HlmTooltipModule`                | NgModule         | Imports + re-exports `HlmTooltip`.                                                                                                                   |

## Anatomy / Structure

```html
<!-- basic: string content -->
<button hlmBtn [hlmTooltip]="'Add to library'">Add</button>

<!-- positioned, delayed -->
<button hlmBtn [hlmTooltip]="'Settings'" position="right" [showDelay]="300" [hideDelay]="100">Settings</button>

<!-- disabled tooltip -->
<button hlmBtn [hlmTooltip]="'Hidden hint'" [tooltipDisabled]="true">No tooltip</button>
```

The directive takes the tooltip **text as its input value** (`brnTooltip: hlmTooltip`) and renders the floating bubble + arrow via the CDK overlay. No extra outlet component is needed.

## API reference

### `HlmTooltip` — selector `[hlmTooltip]` (directive, hosts `BrnTooltip`)

The directive declares **no own inputs** — everything is forwarded to `BrnTooltip` (plus provider defaults):

| Input             | Type                                                            | Default (via provider) | Description                                                          |
| ----------------- | --------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| `hlmTooltip`      | `string` (forwarded as `brnTooltip`)                            | —                      | Tooltip text content. Required to show anything.                     |
| `position`        | `BrnTooltipPosition` (`'top' \| 'bottom' \| 'left' \| 'right'`) | — (Brn default)        | Bubble side + arrow placement (arrow via `tooltipPositionVariants`). |
| `showDelay`       | `number` (forwarded)                                            | — (Brn default)        | ms before the tooltip appears on hover/focus.                        |
| `hideDelay`       | `number` (forwarded)                                            | — (Brn default)        | ms before the tooltip hides on leave/blur.                           |
| `tooltipDisabled` | `boolean` (forwarded)                                           | — (Brn default)        | Suppress the tooltip entirely.                                       |

Provider defaults (`provideBrnTooltipDefaultOptions`, applied automatically): `svgClasses: DEFAULT_TOOLTIP_SVG_CLASS`, `tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES`, `arrowClasses: (position) => hlm(tooltipPositionVariants({ position }))`.

No outputs. Can attach to any element (buttons, icons, toggles, links).

## Examples

### 1. Basic usage

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmTooltipImports, ...HlmButtonImports],
  template: ` <button hlmBtn variant="outline" [hlmTooltip]="'Add to library'">Add</button> `,
})
export class DemoBasic {}
```

### 2. All positions

```ts
// demo-positions.component.ts
import { Component } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-positions',
  standalone: true,
  imports: [...HlmTooltipImports, ...HlmButtonImports],
  template: `
    <div class="flex flex-wrap gap-2">
      <button hlmBtn variant="outline" [hlmTooltip]="'On top'" position="top">Top</button>
      <button hlmBtn variant="outline" [hlmTooltip]="'Below'" position="bottom">Bottom</button>
      <button hlmBtn variant="outline" [hlmTooltip]="'On the left'" position="left">Left</button>
      <button hlmBtn variant="outline" [hlmTooltip]="'On the right'" position="right">Right</button>
    </div>
  `,
})
export class DemoPositions {}
```

The arrow repositions automatically per side via `tooltipPositionVariants({ position })`.

### 3. Delays + disabled state

```ts
// demo-delays.component.ts
import { Component, signal } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-delays',
  standalone: true,
  imports: [...HlmTooltipImports, ...HlmButtonImports],
  template: `
    <div class="flex gap-2">
      <button hlmBtn variant="outline" [hlmTooltip]="'Slow to appear'" [showDelay]="600" [hideDelay]="100">
        Hover me
      </button>
      <button hlmBtn variant="outline" [hlmTooltip]="'Never shows'" [tooltipDisabled]="muted()">
        {{ muted() ? 'Muted (no tip)' : 'Unmuted' }}
      </button>
      <button hlmBtn size="sm" (click)="muted.set(!muted())">Toggle mute</button>
    </div>
  `,
})
export class DemoDelays {
  readonly muted = signal(false);
}
```

### 4. Icon-only buttons and toggles (accessible names still required)

```ts
// demo-icons.component.ts
import { Component } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic } from '@ng-icons/lucide';

@Component({
  selector: 'demo-icons',
  standalone: true,
  imports: [...HlmTooltipImports, ...HlmToggleImports, NgIcon],
  providers: [provideIcons({ lucideBold, lucideItalic })],
  template: `
    <div class="flex gap-1">
      <button hlmToggle aria-label="Toggle bold" [hlmTooltip]="'Bold (Ctrl+B)'">
        <ng-icon name="lucideBold" />
      </button>
      <button hlmToggle aria-label="Toggle italic" [hlmTooltip]="'Italic (Ctrl+I)'" position="bottom">
        <ng-icon name="lucideItalic" />
      </button>
    </div>
  `,
})
export class DemoIcons {}
```

> The tooltip is a visual hint only — icon buttons still need `aria-label` (tooltips are not reliably announced).

### 5. Dynamic content from signals

```ts
// demo-dynamic.component.ts
import { Component, computed, signal } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-dynamic',
  standalone: true,
  imports: [...HlmTooltipImports, ...HlmButtonImports],
  template: `
    <button hlmBtn variant="outline" [hlmTooltip]="tip()" (click)="count.set(count() + 1)">
      Clicked {{ count() }}×
    </button>
  `,
})
export class DemoDynamic {
  readonly count = signal(0);
  readonly tip = computed(() => (this.count() === 0 ? 'Click to start' : `Clicked ${this.count()} times`));
}
```

### 6. Advanced: reusing the class constants

```ts
// demo-classes.component.ts
import { Component } from '@angular/core';
import { DEFAULT_TOOLTIP_CONTENT_CLASSES, tooltipPositionVariants } from '@egose/shadcn-theme-ng/tooltip';
import { hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'demo-classes',
  standalone: true,
  template: `<p class="text-sm">Content classes length: {{ len }}</p>`,
})
export class DemoClasses {
  readonly len = DEFAULT_TOOLTIP_CONTENT_CLASSES.length;

  arrowFor(position: 'top' | 'bottom' | 'left' | 'right') {
    return hlm(tooltipPositionVariants({ position }));
  }
}
```

## Accessibility notes

- Tooltips appear on hover **and** focus (via Brn) — keyboard users get them automatically; do not gate hints behind hover-only behavior.
- Never put essential information _only_ in a tooltip: screen-reader and touch support is best-effort. Mirror critical hints as visible text or `aria-label`s.
- Icon-only triggers need `aria-label` regardless of tooltip text.
- Keep tooltip text short (a few words); long prose belongs in a popover/dialog.
- `tooltipDisabled` removes the hint entirely — only use it when the control is self-explanatory in that state, not to hide errors.

## Theming / CSS variables

The bubble uses `bg-foreground text-background` with entrance/exit animations per side and theme-aware shadows; the arrow inherits the same fill. Follows your shadcn theme automatically. Override globally by providing your own `provideBrnTooltipDefaultOptions`, or per case by wrapping triggers with custom classes.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — most common tooltip anchor.
- `@egose/shadcn-theme-ng/toggle` / `@egose/shadcn-theme-ng/toggle-group` — icon toggles that pair well with hints.
- `@egose/shadcn-theme-ng/popover` / `@egose/shadcn-theme-ng/hover-card` — richer floating content (vs. short tooltip text).
- `@egose/shadcn-theme-ng/utils` — `hlm()` used to compose arrow/content classes.
