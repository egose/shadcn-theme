# Icon (`@egose/shadcn-theme-ng/icon`)

`HlmIcon` is a thin directive that sizes `@ng-icons/core` icons consistently with the shadcn theme. It applies to `ng-icon` elements (`selector: 'ng-icon[hlm]'`) and maps t-shirt sizes (`xs`–`xl`) to pixel values via the `--ng-icon__size` CSS variable — the shadcn/ui equivalent of the `size-*` icon convention. A global default size can be set once with `provideHlmIconConfig`.

> **Ships as:** `@egose/shadcn-theme-ng/icon` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/icon` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@ng-icons/core`, …) are documented in the [package README](../../README.md#peer-dependencies). You must also register the icons you use with `provideIcons` from `@ng-icons/core` (see examples).

```ts
import { HlmIconImports } from '@egose/shadcn-theme-ng/icon';
// tw variant:
// import { HlmIconImports } from '@egose/shadcn-theme-ng-tw/icon';
```

## Imports

```ts
// Standalone component — spread the imports array:
import { HlmIconImports } from '@egose/shadcn-theme-ng/icon';

@Component({
  standalone: true,
  imports: [NgIcon, ...HlmIconImports], // or just [NgIcon, HlmIcon]
  providers: [provideIcons({ lucidePlus })],
  template: `<ng-icon hlm name="lucidePlus" size="sm" />`,
})
export class MyComp {}
```

```ts
// NgModule-based — import the module:
import { HlmIconModule } from '@egose/shadcn-theme-ng/icon';

@NgModule({ imports: [HlmIconModule] })
export class MyModule {}
```

Exported from `src/public-api.ts`: `HlmIcon`, `IconSize`, `HlmIconConfig`, `provideHlmIconConfig`, `injectHlmIconConfig`, plus `HlmIconImports` and `HlmIconModule`.

> Note: `HlmIcon` decorates `ng-icon` — you still import `NgIcon` itself from `@ng-icons/core` and register glyphs with `provideIcons`.

## Anatomy / Structure

```html
<!-- hlm attribute activates the sizing directive on any ng-icon -->
<ng-icon hlm name="lucidePlus" size="sm" />
```

The directive sets `[style.--ng-icon__size]` from the `size` input; named sizes resolve to pixels, anything else passes through verbatim as CSS.

## API reference

### `ng-icon[hlm]` — `HlmIcon`

| Input  | Type       | Default                 | Description                                                                                                                                              |
| ------ | ---------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size` | `IconSize` | config default (`base`) | `xs` → `12px`, `sm` → `16px`, `base` → `24px`, `lg` → `32px`, `xl` → `48px`, `none` → `none`, or any custom CSS size string (e.g. `'20px'`, `'1.5rem'`). |

No outputs. `IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'none' | (string & {})`.

### Config — `HlmIconConfig` / `provideHlmIconConfig` / `injectHlmIconConfig`

| API                                                    | Signature               | Description                                                                           |
| ------------------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------- |
| `HlmIconConfig`                                        | `{ size: IconSize }`    | Global icon config shape (default `{ size: 'base' }`).                                |
| `provideHlmIconConfig(config: Partial<HlmIconConfig>)` | returns `ValueProvider` | Provide once (root or feature) to change the default `size` for every `ng-icon[hlm]`. |
| `injectHlmIconConfig()`                                | returns `HlmIconConfig` | Reads the ambient config (falls back to defaults).                                    |

## Examples

### 1. Basic icon with registered glyph

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucidePlus })],
  template: `<ng-icon hlm name="lucidePlus" />`,
})
export class BasicExample {}
```

### 2. All named sizes

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmIconImports } from '@egose/shadcn-theme-ng/icon';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIconImports],
  providers: [provideIcons({ lucideSearch })],
  template: `
    <div class="tw:flex tw:items-center tw:gap-4">
      <ng-icon hlm name="lucideSearch" size="xs" />
      <ng-icon hlm name="lucideSearch" size="sm" />
      <ng-icon hlm name="lucideSearch" size="base" />
      <ng-icon hlm name="lucideSearch" size="lg" />
      <ng-icon hlm name="lucideSearch" size="xl" />
    </div>
  `,
})
export class SizesExample {}
```

### 3. Custom CSS sizes (any string passes through)

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideBell })],
  template: `
    <div class="tw:flex tw:items-center tw:gap-4">
      <ng-icon hlm name="lucideBell" size="20px" />
      <ng-icon hlm name="lucideBell" size="1.5rem" />
      <ng-icon hlm name="lucideBell" size="none" />
    </div>
  `,
})
export class CustomSizeExample {}
```

### 4. Global default via `provideHlmIconConfig`

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideX } from '@ng-icons/lucide';
import { HlmIcon, provideHlmIconConfig } from '@egose/shadcn-theme-ng/icon';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideCheck, lucideX }), provideHlmIconConfig({ size: 'sm' })],
  template: `
    <!-- both inherit size="sm" unless overridden -->
    <ng-icon hlm name="lucideCheck" />
    <ng-icon hlm name="lucideX" size="lg" />
  `,
})
export class ConfigExample {}
```

### 5. Icons inside buttons and inputs (composition)

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucidePlus } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon, HlmButton, HlmInputGroupImports],
  providers: [provideIcons({ lucideSearch, lucidePlus })],
  template: `
    <button hlmBtn type="button"><ng-icon hlm name="lucidePlus" size="sm" /> New item</button>

    <div hlmInputGroup>
      <span hlmInputGroupText><ng-icon hlm name="lucideSearch" size="sm" /></span>
      <input hlmInputGroupInput placeholder="Search…" aria-label="Search" />
    </div>
  `,
})
export class CompositionExample {}
```

> The input-group addon styles (`[&>ng-icon…]` hooks) assume icons sized through this directive — prefer `size="sm"` or smaller inside addons/buttons so text and glyph align.

### 6. Dynamic icon + size with signals

```ts
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle, lucideCheck } from '@ng-icons/lucide';
import { HlmIcon, type IconSize } from '@egose/shadcn-theme-ng/icon';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideLoaderCircle, lucideCheck })],
  template: `
    <p>
      <ng-icon hlm [name]="saving() ? 'lucideLoaderCircle' : 'lucideCheck'" [size]="iconSize()" />
      {{ saving() ? 'Saving…' : 'Saved' }}
    </p>
    <button type="button" (click)="toggleSize()">Toggle size</button>
  `,
})
export class DynamicExample {
  readonly saving = signal(true);
  readonly iconSize = signal<IconSize>('sm');

  toggleSize() {
    this.iconSize.update((s) => (s === 'sm' ? 'lg' : 'sm'));
  }
}
```

## Accessibility notes

- `ng-icon` renders decorative SVG — screen readers ignore it by default. When an icon is the _only_ content of a button/link, put the accessible name on the control (`aria-label="Search"`), not on the icon.
- Never convey status by icon alone (e.g. a lone red `x` for errors); pair it with text or an `role="status"` message.
- Icon buttons need a visible focus indicator and at least a 24px (ideally 44px) hit area — use the button size variants rather than shrinking the control to the glyph.

## Theming / CSS variables

Sizing flows through the `--ng-icon__size` CSS variable set by the directive; color inherits `currentColor`, so icons follow surrounding text/foreground tokens automatically. No component-specific theme variables.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — icon buttons and icon+label composition.
- `@egose/shadcn-theme-ng/input-group` — addon slots with `ng-icon` styling hooks.
- `@egose/shadcn-theme-ng/badge` — common icon+text pill composition.
- `@egose/shadcn-theme-ng/spinner` — animated loading indicator alternative.
