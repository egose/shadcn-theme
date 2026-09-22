# Slider (`@egose/shadcn-theme-ng/slider`)

A shadcn/ui-style **Slider** — a draggable track with one or more thumbs for picking numeric value(s). This is the Angular equivalent of shadcn/ui `Slider`.

Behavior comes from **spartan-ng/brain** (`BrnSlider` + `BrnSliderImports`: track/range/thumb/tick structural pieces, keyboard support, min/max/step, multi-thumb, orientation, ticks formatting). This package is the shadcn skin: a `hlm-slider` (or `brn-slider [hlm]`) component that forwards the full brain slider API via host directives and renders the muted track, primary range fill, circular thumbs, and optional tick labels.

> **Ships as:** `@egose/shadcn-theme-ng/slider` and `@egose/shadcn-theme-ng-tw/slider` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';
// tw variant:
// import { HlmSliderImports } from '@egose/shadcn-theme-ng-tw/slider';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain`.

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol             | Kind          | Description                                                               |
| ------------------ | ------------- | ------------------------------------------------------------------------- |
| `HlmSlider`        | Component     | The slider; selector `hlm-slider, brn-slider [hlm]`; forwards `BrnSlider` |
| `HlmSliderImports` | `const` array | `[HlmSlider]` standalone imports                                          |
| `HlmSliderModule`  | `NgModule`    | NgModule wrapper re-exporting `HlmSlider`                                 |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmSliderImports],
  template: `<hlm-slider [value]="[50]" />`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSliderModule } from '@egose/shadcn-theme-ng/slider';

@NgModule({ imports: [HlmSliderModule] })
export class DemoModule {}
```

## Anatomy / Structure

You only write the host element — track, range, thumbs, and ticks render from the component template:

```html
<!-- Single value -->
<hlm-slider [value]="[50]" [min]="0" [max]="100" (valueChange)="volume.set($event)" />

<!-- Range (two thumbs) -->
<hlm-slider [value]="[20, 80]" [min]="0" [max]="100" />

<!-- Attribute form on an element inside a brain slider host -->
<brn-slider [value]="[30]">
  <div hlm></div>
</brn-slider>
```

Real selectors:

| Selector                         | Class       | Notes                                                                                                                                                                       |
| -------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hlm-slider`, `brn-slider [hlm]` | `HlmSlider` | Renders `brnSliderTrack` > `brnSliderRange`, one `brnSliderThumb` per `thumbIndexes()`, and optional `*brnSliderTick` labels (`hlm` goes on an element inside `brn-slider`) |

## API reference

### HlmSlider (component)

Thin wrapper — no own inputs. All bindings are forwarded to the `BrnSlider` host directive:

| Binding                 | Kind   | Description                                                                         |
| ----------------------- | ------ | ----------------------------------------------------------------------------------- |
| `id`                    | input  | Slider id                                                                           |
| `value`                 | input  | Thumb values as array (e.g. `[50]`, `[20, 80]`); use `[(value)]` or `(valueChange)` |
| `disabled`              | input  | Disables interaction (dims + `pointer-events-none`)                                 |
| `min`                   | input  | Minimum value                                                                       |
| `max`                   | input  | Maximum value                                                                       |
| `step`                  | input  | Step increment                                                                      |
| `minStepsBetweenThumbs` | input  | Minimum gap (in steps) between thumbs                                               |
| `inverted`              | input  | Flip the axis direction                                                             |
| `orientation`           | input  | `'horizontal' \| 'vertical'`                                                        |
| `showTicks`             | input  | Render tick labels under/beside the track                                           |
| `maxTicks`              | input  | Cap on rendered tick count                                                          |
| `tickLabelInterval`     | input  | Label every Nth tick                                                                |
| `formatTick`            | input  | `(tick: number) => string` label formatter                                          |
| `draggableRange`        | input  | Allow dragging the range fill between thumbs                                        |
| `draggableRangeOnly`    | input  | Only the range (not thumbs) is draggable                                            |
| `aria-label`            | input  | Accessible name                                                                     |
| `aria-labelledby`       | input  | Id(s) of labelling element(s)                                                       |
| `valueChange`           | output | Emits the new value array on change                                                 |

Vertical mode needs height from you (`tw:h-40` on the host pulls in `data-vertical:min-h-40` styling); horizontal is full-width by default.

## Examples

### 1. Basic single slider

```ts
import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-basic-slider',
  standalone: true,
  imports: [HlmSliderImports],
  template: `
    <label id="vol-label" class="tw:mb-2 tw:block tw:text-sm">Volume: {{ volume()[0] }}</label>
    <hlm-slider
      aria-labelledby="vol-label"
      [min]="0"
      [max]="100"
      [step]="1"
      [value]="volume()"
      (valueChange)="volume.set($event)"
    />
  `,
})
export class BasicSliderComponent {
  readonly volume = signal<number[]>([50]);
}
```

### 2. Range slider (two thumbs)

```ts
import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [HlmSliderImports],
  template: `
    <hlm-slider
      aria-label="Price range"
      [min]="0"
      [max]="500"
      [step]="10"
      [minStepsBetweenThumbs]="1"
      [(value)]="range"
    />
    <p class="tw:mt-2 tw:text-sm">Between ${{ range()[0] }} and ${{ range()[1] }}</p>
  `,
})
export class RangeSliderComponent {
  readonly range = signal<number[]>([50, 300]);
}
```

### 3. Reactive forms

`BrnSlider` is a `ControlValueAccessor` — bind `formControlName` directly on the host:

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-form-slider',
  standalone: true,
  imports: [HlmSliderImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <label for="brightness" class="tw:mb-2 tw:block tw:text-sm">Brightness</label>
      <hlm-slider id="brightness" formControlName="brightness" [min]="0" [max]="100" />
      <button type="button" (click)="form.controls.brightness.setValue([100])">Max</button>
    </form>
  `,
})
export class FormSliderComponent {
  readonly form = new FormGroup({
    brightness: new FormControl<number[]>([70]),
  });
}
```

### 4. Disabled + tick labels

```ts
import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-ticks-slider',
  standalone: true,
  imports: [HlmSliderImports],
  template: `
    <hlm-slider
      aria-label="Quality"
      [min]="0"
      [max]="100"
      [step]="10"
      showTicks
      [maxTicks]="6"
      [tickLabelInterval]="2"
      [formatTick]="format"
      [(value)]="quality"
    />

    <hlm-slider class="tw:mt-6" aria-label="Locked setting" [value]="[40]" disabled />
  `,
})
export class TicksSliderComponent {
  readonly quality = signal<number[]>([60]);
  readonly format = (tick: number): string => `${tick}%`;
}
```

### 5. Vertical + inverted

```html
<div class="tw:flex tw:gap-8">
  <hlm-slider class="tw:h-48" aria-label="Balance" orientation="vertical" [min]="0" [max]="100" [(value)]="balance" />

  <hlm-slider aria-label="Inverted level" inverted [min]="0" [max]="100" [(value)]="level" />
</div>
```

Vertical sliders size along the block axis — always give the host an explicit height (e.g. `tw:h-48`).

### 6. Draggable range (select a window, move it whole)

```ts
import { Component, signal } from '@angular/core';
import { HlmSliderImports } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-window-slider',
  standalone: true,
  imports: [HlmSliderImports],
  template: `
    <hlm-slider aria-label="Visible window" [min]="0" [max]="24" [step]="1" draggableRange [(value)]="window" />
    <p class="tw:mt-2 tw:text-sm">Showing hours {{ window()[0] }}–{{ window()[1] }}</p>
  `,
})
export class WindowSliderComponent {
  readonly window = signal<number[]>([8, 17]);
}
```

## Accessibility notes

- Always name the slider: `aria-label` for standalone use or `aria-labelledby` pointing at a visible label. Without a name, screen-reader users get an anonymous slider.
- Thumbs are keyboard-operable (arrows/Home/End, per brain) — keep the host focusable (default) and never wrap thumbs in extra focus stops.
- `disabled` removes interaction and dims the control; for temporarily-unavailable-but-explainable states, prefer keeping it enabled with a described constraint instead.
- Tick labels are visual annotations; don't rely on them as the only value readout — mirror the current value in text (as in examples 1–2) or an `aria-valuetext` equivalent where the primitive supports it.

## Theming / CSS variables

Class-driven (`bg-muted` track, `bg-primary` range, white thumbs with primary border and focus rings). No component-specific CSS variables; density follows the default `size-4` thumbs.

## Related subpaths

- `@egose/shadcn-theme-ng/label` — visible labels referenced via `aria-labelledby`
- `@egose/shadcn-theme-ng/field` / `form-field` — form rows pairing labels, sliders, and hints/errors
- `@egose/shadcn-theme-ng/progress` — read-only fill-bar counterpart
- `@egose/shadcn-theme-ng/input` — precise numeric entry to pair with coarse slider input
