# Badge (`@egose/shadcn-theme-ng/badge`)

A compact status/count chip in the shadcn/ui Badge style: a small pill for labels like "New",
"Beta", unread counts, or role tags. Use it inline in headings, list rows, tabs, and buttons where
a full [Alert](https://ui.shadcn.com/docs/components/alert) would be too heavy.

This is a **standalone component with no brain primitive and no `*Imports`/`*Module` wrapper** —
import `HlmBadge` itself. Variants come from a `cva` table (`badgeVariants`), merged with
`hlm()`; the `outline` / `outline-filled` appearances add per-tone border/hover classes computed
by private helpers. An imperative `setClass()` escape hatch appends extra classes.

> **Ships as:** `@egose/shadcn-theme-ng/badge` and `@egose/shadcn-theme-ng-tw/badge`
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
[package README](../../README.md#peer-dependencies). Runtime styling helper:
`@egose/shadcn-theme-ng/utils` (`hlm()`).

## Imports

`HlmBadge` is exported from the subpath root (`projects/badge/src/public-api.ts`). Note there is
**no** `HlmBadgeImports` array and **no** `HlmBadgeModule` — import the component directly:

```ts
import {
  HlmBadge,
  badgeVariants,
  type BadgeVariants,
  type BadgeVariantType,
  type BadgeSizeType,
  type BadgeAppearanceType,
} from '@egose/shadcn-theme-ng/badge';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/badge'
```

Standalone component usage:

```ts
import { Component } from '@angular/core';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmBadge],
  template: `<span hlmBadge>New</span>`,
})
export class DemoComponent {}
```

NgModule-based consumer — list the component in the module imports (it is standalone):

```ts
import { NgModule } from '@angular/core';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';

@NgModule({ imports: [HlmBadge] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<span hlmBadge variant="success" size="default" appearance="solid">Active</span>
<a hlmBadge variant="link" href="/changelog">v2.4.1</a>
```

Real selector (from source):

| Class      | Selector(s)                   | Kind      |
| ---------- | ----------------------------- | --------- |
| `HlmBadge` | `span[hlmBadge], a[hlmBadge]` | Component |

Only `<span>` and `<a>` hosts match — the component projects its content (`<ng-content>`) and
computes its host class from `variant` + `size` + `appearance` + `userClass`.

## API reference

### `HlmBadge` — `span[hlmBadge], a[hlmBadge]`

| Input        | Type                  | Default     | Description                                                                                                                                            |
| ------------ | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `variant`    | `BadgeVariantType`    | `'primary'` | Color tone (13 values, see below).                                                                                                                     |
| `size`       | `BadgeSizeType`       | `'default'` | `sm` (`h-5 px-2 text-xs`), `default` (`h-6 px-3 text-sm`), `lg` (`h-7 px-4 text-base`).                                                                |
| `appearance` | `BadgeAppearanceType` | `'solid'`   | `solid` (filled), `outline` (white bg + tone border/text), `outline-filled` (outline + fills with the tone on hover).                                  |
| `userClass`  | `ClassValue`          | `''`        | Extra classes merged into the `cva` call. **Note:** unlike most `hlm*` pieces this input has **no `class` alias** — bind `[userClass]`, not `[class]`. |

| Method     | Signature                         | Description                                                                      |
| ---------- | --------------------------------- | -------------------------------------------------------------------------------- |
| `setClass` | `setClass(classes: string): void` | Imperatively appends extra classes (stored in a private signal and merged last). |

`variant` values: `primary` · `secondary` · `success` · `warning` · `danger` · `info` ·
`light` · `dark` · `accent` · `destructive` · `muted` · `link` · `ghost`.

Exported helpers: `badgeVariants` (the `cva` table — reuse it for custom badge-like hosts),
`BadgeVariants`, `BadgeVariantType`, `BadgeSizeType`, `BadgeAppearanceType`.

## Examples

### 1. Basic badge

```ts
import { Component } from '@angular/core';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-badge-basic',
  standalone: true,
  imports: [HlmBadge],
  template: `<span hlmBadge>New</span>`,
})
export class BadgeBasicComponent {}
```

```html
<app-badge-basic />
```

### 2. All variants × solid

```ts
import { Component } from '@angular/core';
import { HlmBadge, type BadgeVariantType } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-badge-variants',
  standalone: true,
  imports: [HlmBadge],
  template: `
    <div class="tw:flex tw:flex-wrap tw:gap-2">
      @for (v of variants; track v) {
        <span hlmBadge [variant]="v">{{ v }}</span>
      }
    </div>
  `,
})
export class BadgeVariantsComponent {
  readonly variants: BadgeVariantType[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
    'accent',
    'destructive',
    'muted',
    'link',
    'ghost',
  ];
}
```

### 3. Sizes and outline appearances

```ts
import { Component } from '@angular/core';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-badge-sizes',
  standalone: true,
  imports: [HlmBadge],
  template: `
    <div class="tw:flex tw:items-center tw:gap-2">
      <span hlmBadge size="sm">small</span>
      <span hlmBadge size="default">default</span>
      <span hlmBadge size="lg">large</span>
    </div>
    <div class="tw:mt-3 tw:flex tw:items-center tw:gap-2">
      <span hlmBadge variant="success" appearance="outline">outline</span>
      <span hlmBadge variant="destructive" appearance="outline-filled">outline-filled (hover me)</span>
    </div>
  `,
})
export class BadgeSizesComponent {}
```

### 4. Link badge + count badge composed with other components

`a[hlmBadge]` is a real link host; badges also sit naturally inside buttons and headings:

```ts
import { Component, signal } from '@angular/core';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-badge-composed',
  standalone: true,
  imports: [HlmBadge, ...HlmButtonImports],
  template: `
    <h2 class="tw:flex tw:items-center tw:gap-2 tw:text-lg tw:font-semibold">
      Inbox <span hlmBadge variant="secondary" size="sm">{{ unread() }}</span>
    </h2>
    <p class="tw:mt-2">
      <a hlmBadge variant="link" href="/changelog">v2.4.1 — see what's new</a>
    </p>
    <button hlmButton variant="outline" size="sm" class="tw:mt-3" (click)="unread.set(0)">
      Mark all read <span hlmBadge variant="muted" size="sm">{{ unread() }}</span>
    </button>
  `,
})
export class BadgeComposedComponent {
  readonly unread = signal(7);
}
```

### 5. Status mapping from domain state (signal-driven)

```ts
import { Component, computed, signal } from '@angular/core';
import { HlmBadge, type BadgeVariantType } from '@egose/shadcn-theme-ng/badge';

type OrderState = 'pending' | 'shipped' | 'delivered' | 'cancelled';

const tone: Record<OrderState, BadgeVariantType> = {
  pending: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'destructive',
};

@Component({
  selector: 'app-badge-status',
  standalone: true,
  imports: [HlmBadge],
  template: `
    <ul class="tw:flex tw:flex-col tw:gap-2">
      @for (o of orders(); track o.id) {
        <li class="tw:flex tw:items-center tw:gap-2 tw:text-sm">
          Order #{{ o.id }}
          <span hlmBadge [variant]="toneFor(o.state)" [userClass]="'tw:capitalize'">
            {{ o.state }}
          </span>
        </li>
      }
    </ul>
  `,
})
export class BadgeStatusComponent {
  readonly orders = signal<{ id: number; state: OrderState }[]>([
    { id: 101, state: 'pending' },
    { id: 102, state: 'shipped' },
    { id: 103, state: 'delivered' },
    { id: 104, state: 'cancelled' },
  ]);
  toneFor = (s: OrderState) => tone[s];
}
```

### 6. Advanced: `badgeVariants()` for custom hosts + imperative `setClass`

Reuse the exported `cva` table for elements that cannot host the directive, and use `setClass`
for runtime class injection (e.g. from a directive or test harness):

```ts
import { Component, viewChild } from '@angular/core';
import { HlmBadge, badgeVariants } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-badge-advanced',
  standalone: true,
  imports: [HlmBadge],
  template: `
    <!-- custom host styled identically without the directive -->
    <mark [class]="markClass">review</mark>
    <!-- imperative escape hatch -->
    <span hlmBadge #imp variant="info">runtime-tinted</span>
    <button (click)="tint()">Tint via setClass()</button>
  `,
})
export class BadgeAdvancedComponent {
  readonly markClass = badgeVariants({ variant: 'warning', size: 'sm' });
  private readonly badge = viewChild<HlmBadge>('imp');

  tint() {
    this.badge()?.setClass('tw:tracking-widest tw:uppercase');
  }
}
```

## Accessibility notes

- Badges are visual labels, not live regions: dynamic counts ("7 unread") should live next to
  properly labelled content (e.g. an `aria-label="Inbox, 7 unread"` heading) rather than relying
  on the badge text alone.
- Never convey state by color only — the examples above pair each tone with explicit text
  ("delivered", "cancelled"). The `light`/`ghost` tones are low-contrast by design; reserve them
  for large/bold text or decorative contexts.
- `a[hlmBadge]` must have a real `href` (or be replaced by a `<button>`); do not use a link badge
  as a click-handler span — keyboard users lose focusability.

## Theming / CSS variables

Class-based `cva` theming over shadcn tokens (`bg-*/text-*`); no component-specific CSS variables.
Extend per-instance with `[userClass]` (note: no `class` alias on this component) or reuse
`badgeVariants()` for custom hosts.

## Related subpaths

- `@egose/shadcn-theme-ng/alert` — full banner alerts for non-inline feedback
- `@egose/shadcn-theme-ng/basic-alert` — ready-made icon + title + description alert
- `@egose/shadcn-theme-ng/button` — action buttons badges decorate
- `@egose/shadcn-theme-ng/avatar` — identity visuals that pair with role/status badges
