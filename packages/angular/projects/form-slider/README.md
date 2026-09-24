# Form Slider (`@egose/shadcn-theme-ng/form-slider`)

A ready-made reactive-form numeric field: label + `hlm-slider` + validation error/hint display in one tag. The model is a `number[]` (one entry per thumb), matching `BrnSlider`.

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and `HlmSlider` from `@egose/shadcn-theme-ng/slider`. The slider is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-slider` and `@egose/shadcn-theme-ng-tw/form-slider`
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

Peer dependencies (Angular, `@spartan-ng/brain`, `rxjs`, …) are documented in the
[package README](../../README.md#peer-dependencies). This subpath additionally relies at runtime on
`@egose/shadcn-theme-ng/slider`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-slider/src/public-api.ts`):

```ts
import { EgFormSlider, provideEgFormSliderConfig } from '@egose/shadcn-theme-ng/form-slider';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-slider'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormSlider } from '@egose/shadcn-theme-ng/form-slider';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSlider],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormSlider` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-slider` itself is not a `ControlValueAccessor`; the
inner `hlm-slider` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form. Thumb count
follows the model array length (e.g. `[20, 80]` renders two thumbs).

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-slider controlName="volume" label="Volume" [min]="0" [max]="100" [step]="5" />
</form>
```

Selector (from source): `eg-form-slider` (standalone component, host `tw:w-full`).

## API reference

### `EgFormSlider` — `eg-form-slider`

| Input         | Type                  | Default | Description                                                        |
| ------------- | --------------------- | ------- | ------------------------------------------------------------------ |
| `controlName` | `string`              | `''`    | `formControlName` key inside the parent `FormGroup`. **Required.** |
| `label`       | `string \| undefined` | —       | Label text (hidden when omitted).                                  |
| `error`       | `string \| undefined` | —       | Error text shown when invalid.                                     |
| `hint`        | `string \| undefined` | —       | Hint text shown otherwise.                                         |
| `controlId`   | `string \| undefined` | —       | Explicit id (first priority for `effectiveId`).                    |
| `id`          | `string \| undefined` | —       | Fallback id (second priority).                                     |
| `min`         | `number`              | `0`     | Minimum value forwarded to the slider.                             |
| `max`         | `number`              | `100`   | Maximum value forwarded to the slider.                             |
| `step`        | `number`              | `1`     | Step value forwarded to the slider.                                |
| `disabled`    | `boolean`             | `false` | Locks interaction (form control stays enabled).                    |
| `required`    | `boolean`             | `false` | Shows a red `*` next to the label.                                 |
| `class`       | `ClassValue`          | `''`    | Extra host classes (base `tw:w-full`).                             |
| `labelClass`  | `string`              | `''`    | Extra label classes (base `tw:mb-1`).                              |
| `sliderClass` | `string`              | `''`    | Extra slider classes (base `tw:w-full`).                           |
| `errorClass`  | `string`              | `''`    | Extra error classes (base `tw:mt-0`).                              |
| `hintClass`   | `string`              | `''`    | Extra hint classes (base `tw:mt-0`).                               |

| Member               | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to slider `id`. |
| `labelId`            | `effectiveId + '-label'` — referenced by `aria-labelledby`.    |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                            |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic volume slider

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormSlider } from '@egose/shadcn-theme-ng/form-slider';

@Component({
  selector: 'app-volume',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSlider],
  template: `
    <form [formGroup]="form">
      <eg-form-slider controlName="volume" label="Volume" [min]="0" [max]="100" [step]="5" />
      <p>Volume is {{ form.value.volume?.[0] }}.</p>
    </form>
  `,
})
export class VolumeComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ volume: [[20] as number[]] });
}
```

### 2. Price range (two thumbs)

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormSlider } from '@egose/shadcn-theme-ng/form-slider';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSlider],
  template: `
    <form [formGroup]="form">
      <eg-form-slider
        controlName="price"
        label="Price range"
        [min]="0"
        [max]="500"
        [step]="10"
        hint="Drag either thumb."
      />
    </form>
  `,
})
export class PriceComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ price: [[50, 300] as number[]] });
}
```

## Accessibility notes

- The label is linked via `aria-labelledby` (sliders have no `for`-compatible control); always pass a `label`.
- `BrnSlider` currently accepts but does not render `aria-labelledby` on its host — the binding documents intent and activates if upstream renders it. Error/hint ids render without an input-level `describedby` link for the same reason.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `sliderClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormSliderConfig } from '@egose/shadcn-theme-ng/form-slider';

await bootstrapApplication(App, {
  providers: [provideEgFormSliderConfig({ labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` (e.g. `tw:max-w-sm`) or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/slider` — raw `hlm-slider` for custom layouts.
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose controls by hand.
