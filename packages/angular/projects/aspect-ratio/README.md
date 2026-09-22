# Aspect Ratio (`@egose/shadcn-theme-ng/aspect-ratio`)

A layout helper in the shadcn/ui Aspect Ratio style: it forces a box to keep a fixed
width-to-height proportion (16:9 video embeds, square thumbnails, 4:3 cards) regardless of the
viewport. Content placed inside simply fills the ratio-locked frame.

This is a **standalone utility directive with no brain primitive**. `HlmAspectRatio` writes the
numeric ratio to a `--ratio` CSS custom property and applies the `aspect-(--ratio)` Tailwind class;
it accepts plain numbers, coercible values, or `"W/H"` strings such as `"16/9"`.

> **Ships as:** `@egose/shadcn-theme-ng/aspect-ratio` and `@egose/shadcn-theme-ng-tw/aspect-ratio`
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

Peer dependencies (Angular core/common) are documented in the
[package README](../../README.md#peer-dependencies). Runtime styling helper:
`@egose/shadcn-theme-ng/utils` (`classes()`).

## Imports

All symbols are exported from the subpath root (`projects/aspect-ratio/src/public-api.ts`):

```ts
import { HlmAspectRatio, HlmAspectRatioImports, HlmAspectRatioModule } from '@egose/shadcn-theme-ng/aspect-ratio';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/aspect-ratio'
```

Standalone component — spread the `*Imports` array (single entry):

```ts
import { Component } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmAspectRatioImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmAspectRatioModule } from '@egose/shadcn-theme-ng/aspect-ratio';

@NgModule({ imports: [HlmAspectRatioModule] })
export class DemoModule {}
```

You can also import `HlmAspectRatio` itself directly — it is a standalone directive.

## Anatomy / Structure

```html
<div [hlmAspectRatio]="16 / 9">
  <img src="hero.jpg" alt="Hero" class="tw:h-full tw:w-full tw:object-cover tw:rounded-md" />
</div>
```

Real selector (from source):

| Class            | Selector           | Kind      |
| ---------------- | ------------------ | --------- |
| `HlmAspectRatio` | `[hlmAspectRatio]` | Directive |

The host gets `data-slot="aspect-ratio"`, `[style.--ratio]` bound to the coerced value, and the
`tw:relative tw:aspect-(--ratio)` classes. Anything projected inside lays out against that frame.

## API reference

### `HlmAspectRatio` — `[hlmAspectRatio]`

| Input                                   | Type                    | Default | Description                                                                                                                                                                     |
| --------------------------------------- | ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hlmAspectRatio` (aliased as `ratio()`) | `number \| NumberInput` | `1`     | Width ÷ height. Accepts numbers (`1.777`), numeric strings (`"1.5"`), or `"W/H"` strings (`"16/9"`, `"4/3"`, `"1/1"`). Values that coerce to `≤ 0` (or `NaN`) fall back to `1`. |

Coercion details (read from source): `"W/H"` strings are split on `/`, each side parsed with
`parseInt`, then divided; the result passes through `coerceNumberProperty` from
`@angular/cdk/coercion`. So `[hlmAspectRatio]="'16/9'"` ⇒ `16 / 9 ≈ 1.778`.

No outputs, no methods — purely presentational.

## Examples

### 1. Basic 16:9 embed

```ts
import { Component } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-ratio-basic',
  standalone: true,
  imports: [...HlmAspectRatioImports],
  template: `
    <div [hlmAspectRatio]="16 / 9" class="tw:overflow-hidden tw:rounded-md tw:bg-muted">
      <img src="https://picsum.photos/800/450" alt="Landscape" class="tw:h-full tw:w-full tw:object-cover" />
    </div>
  `,
})
export class RatioBasicComponent {}
```

```html
<app-ratio-basic />
```

### 2. String ratios: square, portrait, cinematic

```ts
import { Component } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-ratio-strings',
  standalone: true,
  imports: [...HlmAspectRatioImports],
  template: `
    <div class="tw:grid tw:grid-cols-3 tw:gap-4">
      <div hlmAspectRatio="1/1" class="tw:overflow-hidden tw:rounded-md tw:bg-muted">
        <img src="https://picsum.photos/400/400" alt="Square" class="tw:h-full tw:w-full tw:object-cover" />
      </div>
      <div hlmAspectRatio="3/4" class="tw:overflow-hidden tw:rounded-md tw:bg-muted">
        <img src="https://picsum.photos/300/400" alt="Portrait" class="tw:h-full tw:w-full tw:object-cover" />
      </div>
      <div hlmAspectRatio="21/9" class="tw:overflow-hidden tw:rounded-md tw:bg-muted">
        <img src="https://picsum.photos/630/270" alt="Cinematic" class="tw:h-full tw:w-full tw:object-cover" />
      </div>
    </div>
  `,
})
export class RatioStringsComponent {}
```

### 3. Video / iframe embed

```ts
import { Component } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-ratio-video',
  standalone: true,
  imports: [...HlmAspectRatioImports],
  template: `
    <div [hlmAspectRatio]="16 / 9" class="tw:overflow-hidden tw:rounded-lg tw:border">
      <iframe
        class="tw:absolute tw:inset-0 tw:h-full tw:w-full"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Product tour"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `,
})
export class RatioVideoComponent {}
```

(The host is `relative`, so absolute-positioned media pins to the frame.)

### 4. Dynamic ratio from a signal (user-selectable)

```ts
import { Component, signal } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-ratio-dynamic',
  standalone: true,
  imports: [...HlmAspectRatioImports],
  template: `
    <div class="tw:mb-3 tw:flex tw:gap-2">
      @for (preset of presets; track preset.label) {
        <button (click)="ratio.set(preset.value)" [disabled]="ratio() === preset.value">
          {{ preset.label }}
        </button>
      }
    </div>
    <div [hlmAspectRatio]="ratio()" class="tw:overflow-hidden tw:rounded-md tw:bg-muted">
      <img src="https://picsum.photos/800/600" alt="Preview" class="tw:h-full tw:w-full tw:object-cover" />
    </div>
  `,
})
export class RatioDynamicComponent {
  readonly presets = [
    { label: 'Square', value: 1 },
    { label: '16:9', value: 16 / 9 },
    { label: '4:3', value: 4 / 3 },
  ];
  readonly ratio = signal<number>(16 / 9);
}
```

### 5. Card media header with overlay content

```ts
import { Component } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-ratio-card',
  standalone: true,
  imports: [...HlmAspectRatioImports, HlmBadge],
  template: `
    <article class="tw:overflow-hidden tw:rounded-lg tw:border">
      <div hlmAspectRatio="16/9" class="tw:bg-muted">
        <img src="https://picsum.photos/640/360" alt="Post cover" class="tw:h-full tw:w-full tw:object-cover" />
        <span hlmBadge class="tw:absolute tw:top-2 tw:left-2">New</span>
      </div>
      <div class="tw:p-4">
        <h3 class="tw:font-semibold">Ratio-locked covers</h3>
        <p class="tw:text-sm tw:text-muted-foreground">Every card image lines up, whatever the source size.</p>
      </div>
    </article>
  `,
})
export class RatioCardComponent {}
```

### 6. Invalid values fall back to square

```ts
import { Component } from '@angular/core';
import { HlmAspectRatioImports } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-ratio-fallback',
  standalone: true,
  imports: [...HlmAspectRatioImports],
  template: `
    <!-- 0, negatives, and NaN coerce to ratio 1 (square) instead of breaking layout -->
    <div [hlmAspectRatio]="userValue" class="tw:bg-muted tw:rounded-md">
      <p class="tw:p-4 tw:text-sm">ratio input: {{ userValue }} → renders square</p>
    </div>
  `,
})
export class RatioFallbackComponent {
  userValue = 0; // try -2, Number.NaN, or a valid number
}
```

## Accessibility notes

- The directive adds no semantics (`data-slot` only) — the _content_ carries meaning. Always give
  images real `alt` text and iframes a `title`.
- Do not use aspect-ratio boxes as click targets by themselves; put a real `<button>` or `<a>`
  inside or around them so keyboard users get a focusable control.
- Avoid extreme ratios for text content (e.g. `21/9` with paragraphs) — zoomed text can overflow
  the locked frame. Prefer images/video, or allow the frame to grow with `min-h` utilities.

## Theming / CSS variables

The directive sets one custom property on its host: `--ratio` (unitless number). The frame size
comes from the `aspect-(--ratio)` utility reading that property. You can read or override
`--ratio` in your own CSS if you need derived sizing (e.g. `height: calc(100vw / var(--ratio))`).

## Related subpaths

- `@egose/shadcn-theme-ng/avatar` — fixed-size ratio-locked identity images
- `@egose/shadcn-theme-ng/card` — cards whose media headers use ratio frames
- `@egose/shadcn-theme-ng/carousel` — slides with consistent media proportions
- `@egose/shadcn-theme-ng/skeleton` — ratio-shaped loading placeholders
