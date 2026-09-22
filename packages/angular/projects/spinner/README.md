# Spinner (`@egose/shadcn-theme-ng/spinner`)

A loading spinner, equivalent to [shadcn/ui Spinner](https://ui.shadcn.com/docs/components/spinner). This subpath ships a single standalone component, `HlmSpinner`, that renders an animated [`@ng-icons`](https://www.ng-icons.dev/) `tablerLoader2` icon (spinning via `animate-spin`) inside a flex container with `role="status"`. There is no spartan-ng primitive underneath — it is a pure styled icon wrapper with `size`/`show` inputs.

> **Ships as:** `@egose/shadcn-theme-ng/spinner` and `@egose/shadcn-theme-ng-tw/spinner` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

No extra runtime install is needed — `@ng-icons/core` / `@ng-icons/tabler-icons` and `clsx`/`tailwind-merge` (via `utils`) arrive transitively. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/spinner/src/public-api.ts`:

```ts
import { HlmSpinner, HlmSpinnerImports, HlmSpinnerModule } from '@egose/shadcn-theme-ng/spinner';
// tw variant:
// import { HlmSpinner, HlmSpinnerImports, HlmSpinnerModule } from '@egose/shadcn-theme-ng-tw/spinner';
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmSpinnerImports],
  template: `<hlm-spinner />`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSpinnerModule } from '@egose/shadcn-theme-ng/spinner';

@NgModule({ imports: [HlmSpinnerModule] })
export class FeatureModule {}
```

| Symbol              | Kind                 | Description                                    |
| ------------------- | -------------------- | ---------------------------------------------- |
| `HlmSpinner`        | Standalone component | The `<hlm-spinner>` loading indicator.         |
| `HlmSpinnerImports` | `const` array        | `[HlmSpinner]` — spread into `imports: [...]`. |
| `HlmSpinnerModule`  | NgModule             | Imports + re-exports `HlmSpinner`.             |

## Anatomy / Structure

```html
<!-- host element: <hlm-spinner role="status" class="flex … | hidden"> -->
<hlm-spinner />
<hlm-spinner size="2rem" />
<hlm-spinner [show]="loading()" class="my-4" spinnerClass="text-primary" />
```

The host carries `role="status"` and toggles `flex`/`hidden` from `show()`. The inner `<ng-icon>` always renders the fixed `tablerLoader2` glyph at `size()` with `animate-spin`.

## API reference

### `HlmSpinner` — selector `hlm-spinner` (component)

| Input          | Type                                        | Default    | Description                                                                                                                      |
| -------------- | ------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `size`         | `string`                                    | `'1.5rem'` | Passed as `[size]` to the inner `<ng-icon>`; any CSS length (`'1rem'`, `'24px'`, …).                                             |
| `show`         | `boolean`                                   | `true`     | Toggles the host between `flex` (visible) and `hidden`.                                                                          |
| `class`        | `ClassValue` (aliased input `wrapperClass`) | `''`       | Extra classes merged onto the **host container** via `hlm('flex-col items-center justify-center', show ? 'flex' : 'hidden', …)`. |
| `spinnerClass` | `ClassValue`                                | `''`       | Extra classes merged onto the **inner icon** (`animate-spin`, primary color, inherit sizing).                                    |

Public field:

| Member | Type                  | Description                                                                                               |
| ------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `icon` | `tablerLoader2` glyph | Fixed icon data bound to the inner `<ng-icon [svg]>`. Not an input — the glyph cannot be swapped via API. |

No outputs, no methods. Host attributes: `role="status"`.

## Examples

### 1. Basic usage

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmSpinnerImports],
  template: `<hlm-spinner />`,
})
export class DemoBasic {}
```

```html
<hlm-spinner />
```

### 2. Sizes

`size` accepts any CSS length string passed straight to `<ng-icon [size]>`.

```ts
// demo-sizes.component.ts
import { Component } from '@angular/core';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'demo-sizes',
  standalone: true,
  imports: [...HlmSpinnerImports],
  template: `
    <div class="flex items-end gap-6">
      <hlm-spinner size="1rem" />
      <hlm-spinner size="1.5rem" />
      <hlm-spinner size="2.5rem" />
      <hlm-spinner size="48px" />
    </div>
  `,
})
export class DemoSizes {}
```

### 3. Async loading state with `show`

```ts
// demo-async.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-async',
  standalone: true,
  imports: [...HlmSpinnerImports, ...HlmButtonImports],
  template: `
    <button hlmBtn (click)="reload()" [disabled]="loading()">Reload</button>
    <hlm-spinner [show]="loading()" class="my-4" />
    @if (!loading()) {
      <p hlmP>Data: {{ data() ?? '—' }}</p>
    }
  `,
})
export class DemoAsync {
  private readonly http = inject(HttpClient);
  readonly loading = signal(false);
  readonly data = signal<string | null>(null);

  reload() {
    this.loading.set(true);
    this.http.get('/api/status', { responseType: 'text' }).subscribe({
      next: (v) => {
        this.data.set(v);
        this.loading.set(false);
      },
      error: () => {
        this.data.set('error');
        this.loading.set(false);
      },
    });
  }
}
```

> `show` hides with `display: none` (`hidden`) — the icon stays in the DOM. For conditional mounting instead, use `@if (loading()) { <hlm-spinner /> }`.

### 4. Inside a button (inline submitting state)

The spinner inherits font sizing from `spinnerClass`; pair it with a disabled button.

```ts
// demo-button.component.ts
import { Component, signal } from '@angular/core';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-button',
  standalone: true,
  imports: [...HlmSpinnerImports, ...HlmButtonImports],
  template: `
    <button hlmBtn [disabled]="saving()">
      @if (saving()) {
        <hlm-spinner size="1rem" spinnerClass="[&>svg]:text-primary-foreground" />
      }
      {{ saving() ? 'Saving…' : 'Save changes' }}
    </button>
  `,
})
export class DemoButton {
  readonly saving = signal(false);

  save() {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }
}
```

### 5. Custom colors and layout via `class` / `spinnerClass`

```ts
// demo-styled.component.ts
import { Component } from '@angular/core';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'demo-styled',
  standalone: true,
  imports: [...HlmSpinnerImports],
  template: `
    <!-- centered page loader -->
    <hlm-spinner size="3rem" class="min-h-40 w-full" spinnerClass="[&>svg]:text-muted-foreground" />

    <!-- destructive-tinted spinner -->
    <hlm-spinner size="1.25rem" spinnerClass="[&>svg]:text-destructive" />
  `,
})
export class DemoStyled {}
```

`class` targets the outer flex container; `spinnerClass` targets the inner `<ng-icon>`/`<svg>`. Both merge through `hlm()` so Tailwind conflicts resolve.

### 6. Overlay + empty-state composition

```ts
// demo-overlay.component.ts
import { Component, signal } from '@angular/core';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';

@Component({
  selector: 'demo-overlay',
  standalone: true,
  imports: [...HlmSpinnerImports, ...HlmCardImports],
  template: `
    <section hlmCard class="relative min-h-48 p-6">
      <h3 hlmH3>Dashboard</h3>
      @if (loading()) {
        <div class="absolute inset-0 flex items-center justify-center rounded-md bg-background/70 backdrop-blur-[1px]">
          <hlm-spinner size="2rem" />
          <span class="sr-only">Loading dashboard…</span>
        </div>
      } @else {
        <p hlmP>Dashboard content goes here.</p>
      }
    </section>
  `,
})
export class DemoOverlay {
  readonly loading = signal(true);
}
```

## Accessibility notes

- The host has `role="status"` so assistive tech announces the loading state; add adjacent text (visible or `.sr-only`, e.g. “Loading…”) describing _what_ is loading — the icon alone conveys nothing to screen readers.
- Keep `show`-hidden spinners out of the tab order (they contain no focusable elements by default — do not add any).
- For actions that take >1s, disable the triggering control while `show` is true to prevent duplicate submissions.
- Avoid stacking multiple spinners in one view; a single `role="status"` region per async region is enough.

## Theming / CSS variables

The icon inherits `text-primary` by default (`[&>svg]:text-primary`); override with `spinnerClass` (e.g. `spinnerClass="[&>svg]:text-muted-foreground"`). Sizing is fully controlled by `size`. No additional CSS variables.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — inline submitting states.
- `@egose/shadcn-theme-ng/skeleton` — content placeholders to pair with spinners.
- `@egose/shadcn-theme-ng/sonner` — notify on async completion (`toast.promise()`).
- `@egose/shadcn-theme-ng/card` — surfaces to overlay a spinner on.
