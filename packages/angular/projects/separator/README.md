# Separator (`@egose/shadcn-theme-ng/separator`)

A shadcn/ui-style **Separator** — a thin horizontal or vertical divider line between content. This is the Angular equivalent of shadcn/ui `Separator`.

It is a thin directive wrapper over `BrnSeparator` from **spartan-ng/brain** (which supplies the `separator` role semantics, orientation handling, and the `decorative` flag). Styling is a 1px `bg-border` line that stretches horizontally or vertically based on `data-[orientation]`-style state attributes.

> **Ships as:** `@egose/shadcn-theme-ng/separator` and `@egose/shadcn-theme-ng-tw/separator` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmSeparatorImports } from '@egose/shadcn-theme-ng/separator';
// tw variant:
// import { HlmSeparatorImports } from '@egose/shadcn-theme-ng-tw/separator';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`.

## Imports

Real exported symbols (from `src/public-api.ts` plus `lib/hlm-separator.ts`):

| Symbol                | Kind           | Description                                                                 |
| --------------------- | -------------- | --------------------------------------------------------------------------- |
| `HlmSeparator`        | Directive      | The divider; selector `[hlmSeparator],hlm-separator`                        |
| `hlmSeparatorClass`   | `const string` | The raw class string the directive applies — reuse it for custom separators |
| `HlmSeparatorImports` | `const` array  | `[HlmSeparator]` standalone imports                                         |
| `HlmSeparatorModule`  | `NgModule`     | NgModule wrapper re-exporting `HlmSeparator`                                |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmSeparatorImports } from '@egose/shadcn-theme-ng/separator';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmSeparatorImports],
  template: `
    <p>Above</p>
    <hlm-separator />
    <p>Below</p>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSeparatorModule } from '@egose/shadcn-theme-ng/separator';

@NgModule({ imports: [HlmSeparatorModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<div>
  <h4>Account</h4>
  <p class="tw:text-muted-foreground tw:text-sm">Manage your settings.</p>
</div>

<hlm-separator class="tw:my-4" />

<div>
  <h4>Notifications</h4>
</div>
```

Real selectors:

| Selector                       | Class          | Notes                                                                |
| ------------------------------ | -------------- | -------------------------------------------------------------------- |
| `[hlmSeparator],hlm-separator` | `HlmSeparator` | `data-slot="separator"`; inline-flex 1px line, horizontal by default |

## API reference

### HlmSeparator (directive)

Thin wrapper — no own inputs. Forwarded `BrnSeparator` bindings:

| Binding       | Kind  | Description                                                                              |
| ------------- | ----- | ---------------------------------------------------------------------------------------- |
| `orientation` | input | `'horizontal' \| 'vertical'` — line direction (default horizontal)                       |
| `decorative`  | input | When true, the separator is presentational (`aria-hidden`) instead of `role="separator"` |

The applied classes: `inline-flex shrink-0 bg-border`, full-width 1px height when horizontal, full-stretch 1px width when vertical. Add spacing (e.g. `tw:my-4` / `tw:mx-2`) via the `class` attribute — the directive has no `class` input of its own, it merges host classes.

## Examples

### 1. Basic horizontal divider

```ts
import { Component } from '@angular/core';
import { HlmSeparatorImports } from '@egose/shadcn-theme-ng/separator';

@Component({
  selector: 'app-basic-separator',
  standalone: true,
  imports: [HlmSeparatorImports],
  template: `
    <div class="tw:space-y-1">
      <h4 class="tw:font-medium">shadcn-theme</h4>
      <p class="tw:text-muted-foreground tw:text-sm">An Angular shadcn/ui port.</p>
    </div>
    <hlm-separator class="tw:my-4" />
    <div class="tw:flex tw:h-5 tw:items-center tw:gap-4 tw:text-sm">
      <span>Docs</span>
      <hlm-separator orientation="vertical" />
      <span>API</span>
    </div>
  `,
})
export class BasicSeparatorComponent {}
```

### 2. Attribute form on a plain div

```html
<section>
  <h2>Profile</h2>
  <div hlmSeparator class="tw:my-4"></div>
  <h2>Security</h2>
</section>
```

### 3. Vertical separator in a toolbar / breadcrumb row

```ts
import { Component } from '@angular/core';
import { HlmSeparatorImports } from '@egose/shadcn-theme-ng/separator';

@Component({
  selector: 'app-toolbar-separator',
  standalone: true,
  imports: [HlmSeparatorImports],
  template: `
    <div class="tw:flex tw:h-8 tw:items-center tw:gap-2 tw:rounded-md tw:border tw:px-2">
      <button type="button">Bold</button>
      <hlm-separator orientation="vertical" class="tw:h-4" />
      <button type="button">Italic</button>
      <hlm-separator orientation="vertical" class="tw:h-4" />
      <button type="button">Underline</button>
    </div>
  `,
})
export class ToolbarSeparatorComponent {}
```

Constrain the height (`tw:h-4`) so the vertical line doesn't stretch the whole toolbar.

### 4. Decorative vs semantic

```html
<!-- Purely visual: hidden from assistive tech -->
<hlm-separator decorative class="tw:my-6" />

<!-- Meaningful section break: exposed as role="separator" -->
<hlm-separator orientation="horizontal" class="tw:my-6" />
```

### 5. Sidebar / menu dividers

```html
<nav class="tw:flex tw:flex-col tw:gap-1">
  <a href="/dashboard">Dashboard</a>
  <a href="/settings">Settings</a>
  <hlm-separator class="tw:my-2" />
  <a href="/logout">Log out</a>
</nav>
```

(For the app-sidebar layout, `hlm-sidebar-separator` from the `sidebar` subpath already wraps this directive with sidebar tokens — prefer it there.)

### 6. Reusing `hlmSeparatorClass` in a custom component

```ts
import { Component } from '@angular/core';
import { hlmSeparatorClass } from '@egose/shadcn-theme-ng/separator';
import { hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'app-fancy-divider',
  standalone: true,
  template: `<div role="separator" [class]="dividerClass">✦</div>`,
})
export class FancyDividerComponent {
  protected readonly dividerClass = hlm(
    hlmSeparatorClass,
    'tw:my-6 tw:items-center tw:justify-center tw:gap-2 tw:bg-transparent',
  );
}
```

## Accessibility notes

- By default the separator exposes `role="separator"` with the correct orientation — use it for real section breaks.
- Pass `decorative` when the line is purely visual (repeated card dividers, toolbar ticks) so screen readers skip it.
- Never put content _inside_ the separator and never make it focusable — it is a boundary, not a control.

## Theming / CSS variables

One token: `bg-border` for the line color (follows light/dark theme automatically). Thickness/spacing come from utilities you add via `class`.

## Related subpaths

- `@egose/shadcn-theme-ng/sidebar` — `hlm-sidebar-separator` (sidebar-token variant of this divider)
- `@egose/shadcn-theme-ng/select` — `hlm-select-separator` (dropdown-section divider)
- `@egose/shadcn-theme-ng/card` — sectioned containers where separators commonly appear
- `@egose/shadcn-theme-ng/breadcrumb` — inline navigation that often uses vertical separators
