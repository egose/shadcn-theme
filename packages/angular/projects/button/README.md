# Button (`@egose/shadcn-theme-ng/button`)

The shadcn/ui Button: a consistently styled clickable control for actions, links-that-look-like
buttons, and form submits — with tones, sizes, outline appearances, icon slots, and a built-in
loading spinner.

This subpath exports **two** controls over the headless `BrnButton` from
`@spartan-ng/brain/button`:

- `HlmButton` (`button[hlmButton], a[hlmButton]`) — the full-featured component: `variant`,
  `size`, `appearance`, `loading` (overlay spinner via `HlmSpinner`), `icon` template + position,
  `disabled`, `type`, and `class` merging through `buttonVariants` (`cva`) + `hlm()`.
- `HlmBtn` (`button[hlmBtn], a[hlmBtn]`, `exportAs: hlmBtn`) — a thin `BrnButton` wrapper with only
  `variant` / `size` / `type` (defaults injectable via `provideBrnButtonConfig`). Used internally
  by footer-style consumers (e.g. `alert-dialog`) and handy when you need the tones without the
  spinner/icon machinery.

> **Ships as:** `@egose/shadcn-theme-ng/button` and `@egose/shadcn-theme-ng-tw/button`
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
[package README](../../README.md#peer-dependencies). This subpath additionally relies at runtime on
`@egose/shadcn-theme-ng/utils` (`hlm()`) and `@egose/shadcn-theme-ng/spinner` (`HlmSpinner`,
used by the `HlmButton` loading state).

## Imports

All symbols are exported from the subpath root (`projects/button/src/public-api.ts`):

```ts
import {
  HlmButton,
  HlmBtn,
  buttonVariants,
  provideBrnButtonConfig,
  injectBrnButtonConfig,
  HlmButtonImports, // [HlmButton, HlmBtn]
  HlmButtonModule,
  type ButtonVariants,
  type VariantType,
  type SizeType,
  type AppearanceType,
  type BrnButtonConfig,
} from '@egose/shadcn-theme-ng/button';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/button'
```

Standalone component — spread the `*Imports` array (both controls):

```ts
import { Component } from '@angular/core';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmButtonImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmButtonModule } from '@egose/shadcn-theme-ng/button';

@NgModule({ imports: [HlmButtonModule] })
export class DemoModule {}
```

Global defaults — provide a `BrnButtonConfig` once (consumed by `HlmBtn`):

```ts
import { Component } from '@angular/core';
import { HlmButtonImports, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [...HlmButtonImports],
  providers: [provideBrnButtonConfig({ variant: 'secondary', size: 'sm' })],
  template: `...`,
})
export class ShellComponent {}
```

## Anatomy / Structure

```html
<!-- full-featured -->
<button hlmButton variant="primary" size="default" appearance="solid">Save</button>
<a hlmButton variant="outline" href="/docs">Docs</a>

<!-- thin wrapper -->
<button hlmBtn variant="ghost" size="sm">Cancel</button>
```

Real selectors (from source):

| Class       | Selector(s)                                      | Kind      |
| ----------- | ------------------------------------------------ | --------- |
| `HlmButton` | `button[hlmButton], a[hlmButton]`                | Component |
| `HlmBtn`    | `button[hlmBtn], a[hlmBtn]` (`exportAs: hlmBtn`) | Directive |

`HlmButton` loading template (from source): when `loading()` is true, the projected content is
kept invisible for sizing while an absolutely centered `<hlm-spinner>` overlays it; otherwise the
content renders in a flex row with the optional `icon()` template on the `left`/`right`.

## API reference

### `HlmButton` — `button[hlmButton], a[hlmButton]`

| Input                          | Type                                | Default     | Description                                                                                                                |
| ------------------------------ | ----------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `variant`                      | `VariantType`                       | `'primary'` | Semantic color tone, plus legacy `default`, `outline`, `link`, and `ghost` variants (15 values).                           |
| `size`                         | `SizeType`                          | `'default'` | Height/padding scale (13 values, see below).                                                                               |
| `appearance`                   | `AppearanceType`                    | `'solid'`   | `'solid'`, `'outline'` (theme background + tone border/text), `'outline-filled'` (fills on hover), `'ghost'`, or `'link'`. |
| `loading`                      | `boolean`                           | `false`     | Shows the spinner overlay; sets `aria-busy`, forces `disabled`, adds `pointer-events-none`.                                |
| `icon`                         | `TemplateRef<unknown> \| undefined` | `undefined` | Icon template rendered beside the label.                                                                                   |
| `iconPosition`                 | `'left' \| 'right'`                 | `'left'`    | Which side the `icon()` renders on.                                                                                        |
| `disabled`                     | `boolean`                           | `false`     | Disables the control (also forwarded to `BrnButton`).                                                                      |
| `type`                         | `'button' \| 'submit' \| 'reset'`   | `'button'`  | Native button type (reflected as `type` attr).                                                                             |
| `class` (alias of `userClass`) | `ClassValue`                        | `''`        | Extra classes merged via `hlm()`.                                                                                          |
| `spinnerUserClass`             | `ClassValue`                        | `''`        | Extra classes for the loading `<hlm-spinner>` (defaults to the button's current text color).                               |

| Method     | Signature                         | Description                         |
| ---------- | --------------------------------- | ----------------------------------- |
| `setClass` | `setClass(classes: string): void` | Imperatively appends extra classes. |

`variant` values: `default` · `primary` · `secondary` · `success` · `warning` · `danger` ·
`info` · `light` · `dark` · `accent` · `destructive` · `muted` · `outline` · `link` · `ghost`.

`size` values: `xs` · `sm` · `default` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg` ·
`compact-xs` · `compact-sm` · `compact-default` · `compact-lg` · `compact-icon`.

`appearance` values: `solid` · `outline` · `outline-filled` · `ghost` · `link`.

Prefer a semantic `variant` with an independent `appearance`, for example
`variant="success" appearance="ghost"` or `variant="danger" appearance="link"`.
`ghost` is transparent with a subtle tone-colored hover background; `link` is transparent
with an underline on hover. Both have no border or shadow.
Legacy `variant="outline"`, `variant="link"`, and `variant="ghost"` remain supported;
`default` remains an alias for the primary color. The legacy ghost variant retains its
light-colored hover treatment.

### `HlmBtn` — `button[hlmBtn], a[hlmBtn]`

Thin wrapper: only `variant` / `size` / `type` (+ `class`), no `appearance`, `loading`, or icon
support. Its `variant`/`size` defaults come from `injectBrnButtonConfig()` (global default
`{ variant: 'default', size: 'default' }`, overridable per subtree with
`provideBrnButtonConfig()`).

| Input                          | Type                              | Default                       | Description         |
| ------------------------------ | --------------------------------- | ----------------------------- | ------------------- |
| `variant`                      | `ButtonVariants['variant']`       | injected config (`'default'`) | Tone.               |
| `size`                         | `ButtonVariants['size']`          | injected config (`'default'`) | Size.               |
| `type`                         | `'button' \| 'submit' \| 'reset'` | `'button'`                    | Native button type. |
| `class` (alias of `userClass`) | `ClassValue`                      | `''`                          | Extra classes.      |

| Method     | Signature                         | Description                         |
| ---------- | --------------------------------- | ----------------------------------- |
| `setClass` | `setClass(classes: string): void` | Imperatively appends extra classes. |

### Config helpers (`button.token.ts`)

| Symbol                   | Signature                                             | Description                                                  |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| `BrnButtonConfig`        | `{ variant; size }`                                   | Shape of the button defaults object.                         |
| `provideBrnButtonConfig` | `(config: Partial<BrnButtonConfig>) => ValueProvider` | Provide subtree defaults for `HlmBtn`.                       |
| `injectBrnButtonConfig`  | `() => BrnButtonConfig`                               | Read the effective config (falls back to built-in defaults). |

Exported styling/types: `buttonVariants` (`cva` table — reuse for custom hosts), `ButtonVariants`,
`VariantType`, `SizeType`, `AppearanceType`.

## Examples

### 1. Basic usage

```ts
import { Component } from '@angular/core';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-basic',
  standalone: true,
  imports: [...HlmButtonImports],
  template: `
    <div class="tw:flex tw:gap-2">
      <button hlmButton>Primary</button>
      <button hlmBtn variant="secondary">Thin wrapper</button>
      <a hlmButton variant="outline" href="/docs">Docs link</a>
    </div>
  `,
})
export class ButtonBasicComponent {}
```

```html
<app-button-basic />
```

### 2. All variants and sizes

```ts
import { Component } from '@angular/core';
import { HlmButton, type VariantType, type SizeType } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-matrix',
  standalone: true,
  imports: [HlmButton],
  template: `
    <div class="tw:flex tw:flex-wrap tw:gap-2">
      @for (v of variants; track v) {
        <button hlmButton [variant]="v">{{ v }}</button>
      }
    </div>
    <div class="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
      @for (s of sizes; track s) {
        <button hlmButton variant="secondary" [size]="s">{{ s }}</button>
      }
    </div>
  `,
})
export class ButtonMatrixComponent {
  readonly variants: VariantType[] = [
    'default',
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
    'outline',
    'link',
    'ghost',
  ];
  readonly sizes: SizeType[] = [
    'xs',
    'sm',
    'default',
    'lg',
    'icon',
    'compact-xs',
    'compact-sm',
    'compact-default',
    'compact-lg',
  ];
}
```

### 3. Outline appearances + icon buttons

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideTrash } from '@ng-icons/lucide';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-button-appearance',
  standalone: true,
  imports: [HlmButton, NgIcon, HlmIcon],
  providers: [provideIcons({ lucidePlus, lucideTrash })],
  template: `
    <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
      <button hlmButton variant="success" appearance="outline">Outline</button>
      <button hlmButton variant="destructive" appearance="outline-filled">Outline-filled (hover me)</button>
      <button hlmButton variant="success" appearance="ghost">Ghost</button>
      <button hlmButton variant="danger" appearance="link">Link appearance</button>
      <button hlmButton size="icon" aria-label="Create">
        <ng-icon hlm name="lucidePlus" />
      </button>
      <button hlmButton variant="destructive" size="icon-sm" aria-label="Delete">
        <ng-icon hlm name="lucideTrash" size="sm" />
      </button>
    </div>
  `,
})
export class ButtonAppearanceComponent {}
```

### 4. Loading state with `HlmButton` (async submit)

`loading` overlays a tone-matched spinner, keeps the button width stable, sets `aria-busy`, and
blocks interaction until done:

```ts
import { Component, signal } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-loading',
  standalone: true,
  imports: [HlmButton],
  template: `
    <form (ngSubmit)="submit()">
      <button hlmButton type="submit" [loading]="saving()">Save changes</button>
      <button hlmButton variant="ghost" type="button" [disabled]="saving()">Cancel</button>
    </form>
  `,
})
export class ButtonLoadingComponent {
  readonly saving = signal(false);

  async submit() {
    this.saving.set(true);
    try {
      await fetch('/api/save', { method: 'POST' });
    } finally {
      this.saving.set(false);
    }
  }
}
```

### 5. Icon templates with `icon` / `iconPosition`

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-icons',
  standalone: true,
  imports: [HlmButton, NgIcon],
  providers: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
  template: `
    <ng-template #backIcon><ng-icon name="lucideArrowLeft" /></ng-template>
    <ng-template #nextIcon><ng-icon name="lucideArrowRight" /></ng-template>

    <div class="tw:flex tw:gap-2">
      <button hlmButton variant="outline" [icon]="backIcon" iconPosition="left">Back</button>
      <button hlmButton [icon]="nextIcon" iconPosition="right">Next</button>
    </div>
  `,
})
export class ButtonIconsComponent {}
```

### 6. Reactive form submit + global `HlmBtn` defaults

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-button-form',
  standalone: true,
  imports: [...HlmButtonImports, ReactiveFormsModule],
  // Every hlmBtn in this subtree defaults to compact secondary unless overridden.
  providers: [provideBrnButtonConfig({ variant: 'secondary', size: 'compact-default' })],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="tw:flex tw:flex-col tw:gap-3">
      <input formControlName="name" placeholder="Project name" />
      <div class="tw:flex tw:gap-2">
        <button hlmButton [disabled]="form.invalid || saving">Create project</button>
        <button hlmBtn type="button" (click)="form.reset()">Reset</button>
      </div>
    </form>
  `,
})
export class ButtonFormComponent {
  readonly form = new FormGroup({ name: new FormControl('', { validators: Validators.required, nonNullable: true }) });
  saving = false;

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    setTimeout(() => (this.saving = false), 800);
  }
}
```

## Accessibility notes

- These are native `<button>` / `<a>` elements enhanced by `BrnButton`: keyboard focus,
  `Enter`/`Space` activation, and `disabled` semantics work out of the box. Never render a
  `div` with `hlmButton` — the selector only matches `button`/`a` for exactly this reason.
- `loading` sets `aria-busy="true"` and disables the control; announce completion with adjacent
  text or a toast (see `.../sonner`) since the spinner itself is silent.
- Icon-only buttons (`size="icon*"`) **must** have an `aria-label`. Keep visible labels verb-led
  and unique per context ("Delete project", not "Delete" × 5).
- `disabled` uses `pointer-events-none` + reduced opacity — pair disabled states with a visible
  explanation (e.g. "Complete the required fields") rather than leaving users guessing.

## Theming / CSS variables

Buttons use shared semantic Tailwind color tokens, so the consumer controls their palette in
global CSS. Define each tone and its `-foreground` partner: `primary`, `secondary`, `success`,
`warning`, `danger`, `info`, `light`, `dark`, `accent`, `destructive`, and `muted`. Also provide
`background` for outline surfaces and `ring` for keyboard focus.

For example, add these mappings to your Tailwind v4 stylesheet (alongside the package source
scan described in the package README):

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-background: hsl(var(--background));
  --color-ring: hsl(var(--ring));
  /* Map the remaining semantic tones in the same way. */
}

:root {
  --primary: #228be6;
  --primary-foreground: #ffffff;
  --success: #28a745;
  --success-foreground: #ffffff;
  --background: 0 0% 100%;
  --ring: 0 0% 3.9%;
}

.dark {
  --primary: #74c0fc;
  --primary-foreground: #102a43;
  --success: #75b798;
  --success-foreground: #0a3622;
  --background: 0 0% 3.9%;
  --ring: 0 0% 83.1%;
}

.brand-theme {
  --primary: #7950f2;
  --primary-foreground: #ffffff;
}
```

The semantic palette variables above contain complete CSS colors; `background` and `ring`
use HSL channels with `hsl(...)` mappings. `@theme inline` ensures a `.dark` or `.brand-theme`
ancestor can override colors for just its subtree. The example app's `src/styles.css` supplies
the full light/dark palette. Keep the existing `prefix(tw)` import when using the `-tw` package;
the `@theme` token names stay unprefixed.

```html
<section class="brand-theme">
  <button hlmButton variant="primary" appearance="outline">Branded outline</button>
  <button hlmButton variant="success" appearance="ghost">Save changes</button>
</section>
```

Adding a CSS token such as `--color-brand` does **not** register `variant="brand"`;
variant names remain a fixed typed API. Customize an existing semantic token or supply
utility classes through `class` instead.

`class` overrides are merged after the variant/appearance styles; `setClass()` appends
imperative overrides. The loading spinner inherits the button's resolved text color, and
`spinnerUserClass` can override it. For custom hosts, use
`hlm(buttonVariants({ variant: 'success', appearance: 'outline' }), customClasses)`;
the shared variant function includes all appearance styles.

## Related subpaths

- `@egose/shadcn-theme-ng/spinner` — the loader rendered in the `loading` state
- `@egose/shadcn-theme-ng/badge` — counts/status chips composed inside buttons
- `@egose/shadcn-theme-ng/button-group` — joined button rows
- `@egose/shadcn-theme-ng/alert-dialog` — footer `hlmAlertDialogAction` / `hlmAlertDialogCancel` (built on `HlmBtn`)
