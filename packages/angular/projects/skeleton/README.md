# Skeleton (`@egose/shadcn-theme-ng/skeleton`)

A shadcn/ui-style **Skeleton** — a pulsing placeholder block shown while content loads. This is the Angular equivalent of shadcn/ui `Skeleton`.

It has **no behavior and no primitive underneath**: a single thin directive (`[hlmSkeleton]` / `hlm-skeleton`) that paints any host element with the muted pulse styling (`bg-muted`, rounded, `motion-safe:animate-pulse`). Size it with your own utilities.

> **Ships as:** `@egose/shadcn-theme-ng/skeleton` and `@egose/shadcn-theme-ng-tw/skeleton` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmSkeletonImports } from '@egose/shadcn-theme-ng/skeleton';
// tw variant:
// import { HlmSkeletonImports } from '@egose/shadcn-theme-ng-tw/skeleton';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain` (declared peer; the directive itself uses none of its APIs).

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol               | Kind          | Description                                                    |
| -------------------- | ------------- | -------------------------------------------------------------- |
| `HlmSkeleton`        | Directive     | The placeholder styling; selector `[hlmSkeleton],hlm-skeleton` |
| `HlmSkeletonImports` | `const` array | `[HlmSkeleton]` standalone imports                             |
| `HlmSkeletonModule`  | `NgModule`    | NgModule wrapper re-exporting `HlmSkeleton`                    |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmSkeletonImports } from '@egose/shadcn-theme-ng/skeleton';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmSkeletonImports],
  template: `<hlm-skeleton class="tw:h-12 tw:w-full" />`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSkeletonModule } from '@egose/shadcn-theme-ng/skeleton';

@NgModule({ imports: [HlmSkeletonModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<!-- Element form -->
<hlm-skeleton class="tw:h-4 tw:w-48" />

<!-- Attribute form on any element -->
<div hlmSkeleton class="tw:h-24 tw:w-full"></div>
```

Real selectors:

| Selector                     | Class         | Notes                                                                                  |
| ---------------------------- | ------------- | -------------------------------------------------------------------------------------- |
| `[hlmSkeleton],hlm-skeleton` | `HlmSkeleton` | `data-slot="skeleton"`; `block`, `rounded-md`, `bg-muted`, `motion-safe:animate-pulse` |

The directive declares **no inputs, outputs, or methods**. All sizing/spacing comes from classes you add.

## API reference

`HlmSkeleton` has no API surface beyond its selector — it only applies styling classes to its host. There are no inputs (use the `class` attribute directly), no outputs, and no methods.

## Examples

### 1. Basic placeholders

```html
<hlm-skeleton class="tw:h-4 tw:w-48" />
<hlm-skeleton class="tw:h-8 tw:w-full" />
<div hlmSkeleton class="tw:size-12 tw:rounded-full"></div>
```

### 2. Card loading state

```ts
import { Component, signal } from '@angular/core';
import { HlmSkeletonImports } from '@egose/shadcn-theme-ng/skeleton';

@Component({
  selector: 'app-card-loading',
  standalone: true,
  imports: [HlmSkeletonImports],
  template: `
    @if (loading()) {
      <div class="tw:flex tw:items-center tw:gap-4">
        <div hlmSkeleton class="tw:size-12 tw:rounded-full"></div>
        <div class="tw:space-y-2">
          <hlm-skeleton class="tw:h-4 tw:w-48" />
          <hlm-skeleton class="tw:h-4 tw:w-32" />
        </div>
      </div>
    } @else {
      <div class="tw:flex tw:items-center tw:gap-4">
        <img [src]="user().avatar" alt="" class="tw:size-12 tw:rounded-full" />
        <div>
          <p>{{ user().name }}</p>
          <p class="tw:text-muted-foreground tw:text-sm">{{ user().email }}</p>
        </div>
      </div>
    }
  `,
})
export class CardLoadingComponent {
  readonly loading = signal(true);
  readonly user = signal({ name: 'Ada', email: 'ada@example.com', avatar: '/avatar.png' });
}
```

Match skeleton sizes to the real content sizes to avoid layout shift when data arrives.

### 3. List / table rows

```html
<ul class="tw:space-y-2">
  @for (i of [1, 2, 3, 4, 5]; track i) {
  <li class="tw:flex tw:items-center tw:gap-3">
    <div hlmSkeleton class="tw:size-8 tw:rounded-md"></div>
    <hlm-skeleton class="tw:h-4 tw:flex-1" />
    <hlm-skeleton class="tw:h-4 tw:w-16" />
  </li>
  }
</ul>
```

### 4. Async data with `resource`

```ts
import { Component, resource } from '@angular/core';
import { HlmSkeletonImports } from '@egose/shadcn-theme-ng/skeleton';

@Component({
  selector: 'app-async-profile',
  standalone: true,
  imports: [HlmSkeletonImports],
  template: `
    @if (profile.isLoading()) {
      <div class="tw:space-y-3">
        <hlm-skeleton class="tw:h-6 tw:w-1/3" />
        <hlm-skeleton class="tw:h-4 tw:w-full" />
        <hlm-skeleton class="tw:h-4 tw:w-2/3" />
      </div>
    } @else if (profile.error()) {
      <p class="tw:text-destructive tw:text-sm">Failed to load profile.</p>
    } @else {
      <h2>{{ profile.value()?.name }}</h2>
      <p>{{ profile.value()?.bio }}</p>
    }
  `,
})
export class AsyncProfileComponent {
  readonly profile = resource({
    loader: async () => {
      const res = await fetch('/api/profile');
      return (await res.json()) as { name: string; bio: string };
    },
  });
}
```

### 5. Form skeleton

```html
<form aria-busy="true" aria-label="Loading form">
  <div class="tw:grid tw:gap-4">
    <hlm-skeleton class="tw:h-4 tw:w-24" />
    <hlm-skeleton class="tw:h-9 tw:w-full" />
    <hlm-skeleton class="tw:h-4 tw:w-24" />
    <hlm-skeleton class="tw:h-20 tw:w-full" />
    <hlm-skeleton class="tw:h-9 tw:w-28" />
  </div>
</form>
```

### 6. Sidebar menu skeletons (composition)

The `sidebar` subpath reuses this directive in `HlmSidebarMenuSkeleton` — but you can also compose manually:

```html
<div hlmSidebarContent>
  <hlm-skeleton class="tw:mb-2 tw:h-8 tw:w-full" />
  <hlm-skeleton class="tw:mb-2 tw:h-8 tw:w-full" />
  <hlm-skeleton class="tw:h-8 tw:w-3/4" />
</div>
```

## Accessibility notes

- Skeletons are visual placeholders: hide them from assistive tech (`aria-hidden="true"` on the skeleton container) and expose a single loading status instead (`role="status"` + `aria-busy="true"` on the loading region, or an `aria-live` announcement).
- The pulse animation is gated behind `motion-safe:` — users with reduced-motion preferences see a static block. Do not add your own infinite animations on top.
- Keep skeleton geometry close to the final content so focus order and scroll position don't jump when content swaps in; move focus deliberately (e.g. to an error message) on load failure.

## Theming / CSS variables

One token: `bg-muted` block color (follows light/dark theme). Shape via border-radius utilities, motion via the built-in `motion-safe:animate-pulse`.

## Related subpaths

- `@egose/shadcn-theme-ng/sidebar` — `HlmSidebarMenuSkeleton` composes this directive for nav loading states
- `@egose/shadcn-theme-ng/card` — containers commonly filled with skeleton rows while loading
- `@egose/shadcn-theme-ng/table` — tables that show skeleton rows during fetches
- `@egose/shadcn-theme-ng/spinner` — determinate/indeterminate activity indicator alternative
