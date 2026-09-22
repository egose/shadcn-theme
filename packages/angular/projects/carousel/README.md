# Carousel (`@egose/shadcn-theme-ng/carousel`)

An Embla-powered content carousel — the Angular port of shadcn/ui `Carousel`. `hlm-carousel` wraps `embla-carousel-angular` (`EmblaCarouselDirective`) with an `orientation`-aware shell (`horizontal | vertical`, RTL-aware via CDK `Directionality`), exposes Embla state as read-only signals (`canScrollPrev/Next`, `currentSlide`, `slideCount`), and ships `hlm-carousel-content` / `hlm-carousel-item` layout directives, `button[hlm-carousel-previous]` / `button[hlm-carousel-next]` controls, and an `hlm-carousel-slide-display` counter. No spartan-ng brain primitive is used; scrolling, snapping, and plugins are pure Embla.

Ships as `@egose/shadcn-theme-ng/carousel` and `@egose/shadcn-theme-ng-tw/carousel` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/carousel/package.json`); at runtime it also needs `embla-carousel`, `embla-carousel-angular` (transitive implementation deps — do not install directly unless you import them), plus `@egose/shadcn-theme-ng/button` styles for the nav buttons.

## Imports

```ts
import {
  HlmCarousel,
  HlmCarouselContent,
  HlmCarouselItem,
  HlmCarouselPrevious,
  HlmCarouselNext,
  HlmCarouselSlideDisplay,
  HlmCarouselImports,
  HlmCarouselModule,
} from '@egose/shadcn-theme-ng/carousel';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/carousel';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmCarouselImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmCarouselModule } from '@egose/shadcn-theme-ng/carousel';

@NgModule({ imports: [HlmCarouselModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<hlm-carousel orientation="horizontal" [options]="{ loop: true }" [plugins]="plugins">
  <hlm-carousel-content>
    <hlm-carousel-item>Slide 1</hlm-carousel-item>
    <hlm-carousel-item>Slide 2</hlm-carousel-item>
    <hlm-carousel-item>Slide 3</hlm-carousel-item>
  </hlm-carousel-content>

  <button hlm-carousel-previous></button>
  <button hlm-carousel-next></button>
  <hlm-carousel-slide-display />
</hlm-carousel>
```

Real selectors:

| Class                     | Selector                                                       | Notes                                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HlmCarousel`             | `hlm-carousel`                                                 | `role="region"`, `aria-roledescription="carousel"`. Projects `[hlmCarouselContent]` into the Embla viewport; everything else into the outer shell (position nav buttons here). |
| `HlmCarouselContent`      | `[hlmCarouselContent]`, `hlm-carousel-content`                 | Flex track (`-ml-4` / `-mt-4 flex-col` by orientation). Must be inside `hlm-carousel` (injects it).                                                                            |
| `HlmCarouselItem`         | `[hlmCarouselItem]`, `hlm-carousel-item`                       | `basis-full`, `role="group"`, `aria-roledescription="slide"`.                                                                                                                  |
| `HlmCarouselPrevious`     | `button[hlm-carousel-previous]`, `button[hlmCarouselPrevious]` | Outline icon-sm button; auto-disabled at start; `(click)` → `scrollPrev()`.                                                                                                    |
| `HlmCarouselNext`         | `button[hlm-carousel-next]`, `button[hlmCarouselNext]`         | Same, wired to `scrollNext()`.                                                                                                                                                 |
| `HlmCarouselSlideDisplay` | `hlm-carousel-slide-display`                                   | `N / total` counter + sr-only label.                                                                                                                                           |

## API reference

### `HlmCarousel` (`hlm-carousel`)

| Input         | Type                                          | Default        | Description                                                                                                                                                 |
| ------------- | --------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'`                  | `'horizontal'` | Embla `axis` (`x`/`y`), track layout, and nav-button placement.                                                                                             |
| `options`     | `Omit<EmblaOptionsType, 'axis'> \| undefined` | `undefined`    | Raw Embla options (`loop`, `align`, `slidesToScroll`, `direction`, …). `direction` defaults to the ambient CDK `Directionality`; explicit `direction` wins. |
| `plugins`     | `EmblaPluginType[]`                           | `[]`           | Embla plugins (e.g. Autoplay). Passed straight to the directive.                                                                                            |

| Signal (read-only) | Type              | Description                                                                         |
| ------------------ | ----------------- | ----------------------------------------------------------------------------------- |
| `canScrollPrev`    | `Signal<boolean>` | Updated on Embla `init`/`select`/`reInit`. Drives the previous button's `disabled`. |
| `canScrollNext`    | `Signal<boolean>` | Same for next.                                                                      |
| `currentSlide`     | `Signal<number>`  | Zero-based `selectedScrollSnap()`.                                                  |
| `slideCount`       | `Signal<number>`  | `scrollSnapList().length`.                                                          |

| Method         | Description                                         |
| -------------- | --------------------------------------------------- |
| `scrollPrev()` | Delegates to `EmblaCarouselDirective.scrollPrev()`. |
| `scrollNext()` | Delegates to `EmblaCarouselDirective.scrollNext()`. |

Host `(keydown)`: `ArrowLeft` → `scrollPrev()`, `ArrowRight` → `scrollNext()` (with `preventDefault`).

### Nav buttons

Both are `HlmBtn` host-directive components (`inputs: ['variant', 'size']`, defaulted via `provideBrnButtonConfig({ variant: 'outline', size: 'icon-sm' })`). Position classes are computed from the parent orientation (absolute `-start-12`/`-end-12` horizontal, `-top-12`/`-bottom-12` rotated vertical). Overriding `variant`/`size` is supported but replaces the outline icon look.

### `HlmCarouselSlideDisplay` (`hlm-carousel-slide-display`)

| Input        | Type         | Default                           | Description                                                        |
| ------------ | ------------ | --------------------------------- | ------------------------------------------------------------------ |
| `slideClass` | `ClassValue` | `'text-muted-foreground text-sm'` | Class for the visible `N / total` div (`aria-hidden`).             |
| `label`      | `string`     | `'Slide'`                         | Prefix for the sr-only `"{{label}} N of total is displayed"` text. |

## Examples

### 1. Basic horizontal carousel

```ts
import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';

@Component({
  selector: 'app-basic-carousel',
  standalone: true,
  imports: [...HlmCarouselImports, ...HlmCardImports],
  template: `
    <hlm-carousel class="mx-12 max-w-xl">
      <hlm-carousel-content>
        @for (n of [1, 2, 3, 4]; track n) {
          <hlm-carousel-item>
            <div hlmCard class="m-1">
              <div hlmCardContent class="flex aspect-video items-center justify-center text-3xl font-semibold">
                {{ n }}
              </div>
            </div>
          </hlm-carousel-item>
        }
      </hlm-carousel-content>
      <button hlm-carousel-previous></button>
      <button hlm-carousel-next></button>
    </hlm-carousel>
  `,
})
export class BasicCarouselComponent {}
```

> Nav buttons are absolutely positioned outside the viewport (`-start-12`/`-end-12`) — leave horizontal margin on the carousel or wrap it in padded layout.

### 2. Vertical carousel

```ts
import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-vertical-carousel',
  standalone: true,
  imports: [...HlmCarouselImports],
  template: `
    <hlm-carousel orientation="vertical" class="my-12 h-96 w-64">
      <hlm-carousel-content class="h-96">
        @for (n of [1, 2, 3]; track n) {
          <hlm-carousel-item>
            <div class="bg-muted flex h-full items-center justify-center rounded-lg text-2xl">
              {{ n }}
            </div>
          </hlm-carousel-item>
        }
      </hlm-carousel-content>
      <button hlm-carousel-previous></button>
      <button hlm-carousel-next></button>
    </hlm-carousel>
  `,
})
export class VerticalCarouselComponent {}
```

### 3. Looping + aligned + multi-slide options

Any Embla option except `axis` (owned by `orientation`) passes through.

```ts
import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-loop-carousel',
  standalone: true,
  imports: [...HlmCarouselImports],
  template: `
    <hlm-carousel [options]="{ loop: true, align: 'start', slidesToScroll: 1 }" class="mx-12 max-w-2xl">
      <hlm-carousel-content>
        @for (n of [1, 2, 3, 4, 5, 6]; track n) {
          <hlm-carousel-item class="md:basis-1/2 lg:basis-1/3">
            <div class="bg-card m-1 rounded-lg p-6 text-center ring-1">Card {{ n }}</div>
          </hlm-carousel-item>
        }
      </hlm-carousel-content>
      <button hlm-carousel-previous></button>
      <button hlm-carousel-next></button>
    </hlm-carousel>
  `,
})
export class LoopCarouselComponent {}
```

> Override item basis per breakpoint with your own `class` — the directive merges it with `min-w-0 shrink-0 grow-0 basis-full`.

### 4. Slide counter display

```ts
import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-counter-carousel',
  standalone: true,
  imports: [...HlmCarouselImports],
  template: `
    <hlm-carousel class="mx-12 max-w-xl">
      <hlm-carousel-content>
        @for (src of images; track src) {
          <hlm-carousel-item>
            <img [src]="src" alt="Carousel image" class="aspect-video w-full rounded-lg object-cover" />
          </hlm-carousel-item>
        }
      </hlm-carousel-content>
      <div class="mt-2 flex items-center justify-between">
        <div class="flex gap-2">
          <button hlm-carousel-previous class="static! translate-none! rotate-0!"></button>
          <button hlm-carousel-next class="static! translate-none! rotate-0!"></button>
        </div>
        <hlm-carousel-slide-display label="Photo" slideClass="text-sm font-medium" />
      </div>
    </hlm-carousel>
  `,
})
export class CounterCarouselComponent {
  readonly images = [
    'https://picsum.photos/800/450?1',
    'https://picsum.photos/800/450?2',
    'https://picsum.photos/800/450?3',
  ];
}
```

### 5. Programmatic control via template ref

`scrollPrev/scrollNext` plus the state signals are public — wire custom dots or external buttons.

```ts
import { Component } from '@angular/core';
import { HlmCarouselImports, HlmCarousel } from '@egose/shadcn-theme-ng/carousel';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-controlled-carousel',
  standalone: true,
  imports: [...HlmCarouselImports, ...HlmButtonImports],
  template: `
    <hlm-carousel #car class="mx-12 max-w-xl">
      <hlm-carousel-content>
        @for (n of [1, 2, 3, 4]; track n) {
          <hlm-carousel-item>
            <div class="bg-muted m-1 flex aspect-video items-center justify-center rounded-lg">Slide {{ n }}</div>
          </hlm-carousel-item>
        }
      </hlm-carousel-content>
    </hlm-carousel>

    <div class="mt-3 flex items-center gap-2">
      <button hlmBtn variant="outline" (click)="car.scrollPrev()" [disabled]="!car.canScrollPrev()">Prev</button>
      <button hlmBtn variant="outline" (click)="car.scrollNext()" [disabled]="!car.canScrollNext()">Next</button>
      <span class="text-sm">Slide {{ car.currentSlide() + 1 }} / {{ car.slideCount() }}</span>
    </div>
  `,
})
export class ControlledCarouselComponent {}
```

### 6. Autoplay plugin (advanced)

```ts
import { Component } from '@angular/core';
import Autoplay from 'embla-carousel-autoplay';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-autoplay-carousel',
  standalone: true,
  imports: [...HlmCarouselImports],
  template: `
    <hlm-carousel [plugins]="plugins" [options]="{ loop: true }" class="mx-12 max-w-xl">
      <hlm-carousel-content>
        @for (n of [1, 2, 3]; track n) {
          <hlm-carousel-item>
            <div class="bg-muted m-1 flex aspect-video items-center justify-center rounded-lg text-2xl">
              {{ n }}
            </div>
          </hlm-carousel-item>
        }
      </hlm-carousel-content>
      <button hlm-carousel-previous></button>
      <button hlm-carousel-next></button>
    </hlm-carousel>
  `,
})
export class AutoplayCarouselComponent {
  readonly plugins = [Autoplay({ delay: 3000, stopOnInteraction: true })];
}
```

## Accessibility notes

- The shell is `role="region"` / `aria-roledescription="carousel"` and each item is `role="group"` / `aria-roledescription="slide"` — give the carousel an `aria-label` (e.g. `aria-label="Product photos"`) so regions are distinguishable.
- Nav buttons include sr-only `"Previous slide"` / `"Next slide"` text and auto-disable at the ends; keep the `disabled` binding intact.
- `hlm-carousel-slide-display` renders both a visible `aria-hidden` counter and an sr-only `"Slide N of T is displayed"` live-region-friendly label.
- Arrow-key handling is on the host (`ArrowLeft/Right` → prev/next). For vertical carousels, consider adding your own Up/Down handling — the built-in handler only maps Left/Right.

## Theming / CSS variables

No component-specific CSS variables. Track/item geometry comes from Tailwind (`basis-full`, `-ml-4`/`pl-4` gutters, `rounded-full` nav buttons). RTL flips automatically via CDK `Directionality` (chevron icons use `rtl:rotate-180`).

## Related subpaths

- `@egose/shadcn-theme-ng/button` — `HlmBtn` powers the prev/next buttons (`variant`/`size` host inputs).
- `@egose/shadcn-theme-ng/card` — typical slide content wrapper.
- `@egose/shadcn-theme-ng/icon` — `ng-icon` chevrons inside nav buttons (provide your own icons for custom controls).
- `@egose/shadcn-theme-ng/utils` — `hlm` class merging used by the nav-button positioning.
