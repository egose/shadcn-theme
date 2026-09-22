# Radio Group (`@egose/shadcn-theme-ng/radio-group`)

A shadcn/ui-style **Radio Group** for Angular — a set of mutually exclusive options where exactly one can be selected. This is the Angular equivalent of shadcn/ui `RadioGroup` / `RadioGroupItem`.

The primitives come from **spartan-ng/brain** (`BrnRadioGroup`, `BrnRadio`, `BrnFieldControlDescribedBy`): keyboard navigation (arrow keys), roving tabindex, and form integration are handled by `BrnRadioGroup`/`BrnRadio`, while this package adds the shadcn look (grid layout, circular indicator, focus ring, error styling).

> **Ships as:** `@egose/shadcn-theme-ng/radio-group` and `@egose/shadcn-theme-ng-tw/radio-group` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Import from the subpath (not the package root):

```ts
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';
// tw variant:
// import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng-tw/radio-group';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain`. `@angular/cdk` is required transitively by `HlmRadio` (boolean coercion).

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                 | Kind          | Description                                                       |
| ---------------------- | ------------- | ----------------------------------------------------------------- |
| `HlmRadioGroup`        | Directive     | Group container; forwards `BrnRadioGroup`                         |
| `HlmRadio`             | Component     | Single radio item (`hlm-radio`), wraps `BrnRadio`                 |
| `HlmRadioIndicator`    | Component     | Circular visual indicator dot                                     |
| `HlmRadioGroupImports` | `const` array | `[HlmRadioGroup, HlmRadio, HlmRadioIndicator]` standalone imports |
| `HlmRadioGroupModule`  | `NgModule`    | NgModule wrapper re-exporting the three above                     |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmRadioGroupImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmRadioGroupModule } from '@egose/shadcn-theme-ng/radio-group';

@NgModule({ imports: [HlmRadioGroupModule] })
export class DemoModule {}
```

You can also import the pieces individually (`import { HlmRadioGroup, HlmRadio, HlmRadioIndicator } from '...'`).

## Anatomy / Structure

```html
<!-- Attribute form on a div -->
<div hlmRadioGroup name="plan" [value]="plan()" (valueChange)="plan.set($event)">
  <hlm-radio value="free" inputId="plan-free">
    <hlm-radio-indicator />
    Free
  </hlm-radio>

  <hlm-radio value="pro" inputId="plan-pro">
    <hlm-radio-indicator />
    Pro
  </hlm-radio>
</div>

<!-- Element form also works -->
<hlm-radio-group name="plan">
  <hlm-radio value="free"><hlm-radio-indicator />Free</hlm-radio>
</hlm-radio-group>
```

Real selectors:

| Selector                             | Class               | Notes                                                                                                                                                    |
| ------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[hlmRadioGroup]`, `hlm-radio-group` | `HlmRadioGroup`     | Group host; `data-slot="radio-group"`                                                                                                                    |
| `hlm-radio`                          | `HlmRadio<T>`       | Item host; `data-slot="radio-group-item"`; projects `[target],[indicator],hlm-radio-indicator` into the indicator slot, everything else as label content |
| `hlm-radio-indicator`                | `HlmRadioIndicator` | Visual dot; `data-slot="radio-group-indicator"`                                                                                                          |

## API reference

### HlmRadioGroup (directive)

Thin directive wrapper over `BrnRadioGroup` (plus `BrnFieldControlDescribedBy` for form-field `aria-describedby` wiring). Own inputs:

| Input                 | Type         | Default | Description                                  |
| --------------------- | ------------ | ------- | -------------------------------------------- |
| `class` (`userClass`) | `ClassValue` | `''`    | Extra classes appended to `tw:grid tw:gap-3` |

Forwarded `BrnRadioGroup` host-directive bindings:

| Binding       | Kind   | Description                              |
| ------------- | ------ | ---------------------------------------- |
| `name`        | input  | Radio group name (native input grouping) |
| `value`       | input  | Currently selected value                 |
| `disabled`    | input  | Disables the whole group                 |
| `required`    | input  | Marks the group as required              |
| `valueChange` | output | Emits the newly selected value           |

The host also reflects form state as attributes: `aria-invalid`/`data-invalid` when the bound control is invalid, plus `data-dirty` and `data-touched`.

### HlmRadio\<T\> (component)

| Input                                  | Type                  | Default      | Description                                                                                        |
| -------------------------------------- | --------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| `value`                                | `T`                   | **required** | The value this item represents                                                                     |
| `inputId`                              | `string \| undefined` | `undefined`  | `id` placed on the underlying `brn-radio` element; also used to find an associated `<label [for]>` |
| `aria-label` (`ariaLabel`)             | `string \| undefined` | `undefined`  | Accessible name when there is no visible label                                                     |
| `aria-labelledby` (`ariaLabelledby`)   | `string \| undefined` | `undefined`  | Id(s) of labelling element(s)                                                                      |
| `aria-describedby` (`ariaDescribedby`) | `string \| undefined` | `undefined`  | Id(s) of describing element(s)                                                                     |
| `required`                             | `boolean`             | `false`      | Native required flag (boolean-coerced)                                                             |
| `disabled`                             | `boolean`             | `false`      | Disables this item (boolean-coerced); mirrors `data-disabled` onto an associated `<label>`         |
| `class` (`userClass`)                  | `ClassValue`          | `''`         | Extra classes                                                                                      |

| Output   | Type                | Description                                    |
| -------- | ------------------- | ---------------------------------------------- |
| `change` | `BrnRadioChange<T>` | Emitted when this item's checked state changes |

Label association detail: on init the component looks for `closest('label')`, falling back to `document.querySelector('label[for=inputId]')`, and mirrors `data-disabled="true"/"false"` onto that label so label styling follows the disabled state. IDs containing special characters (e.g. quotes/brackets) are matched safely via `htmlFor` comparison, not a CSS selector.

### HlmRadioIndicator (component)

No inputs/outputs. Renders the styled outer circle; the inner dot fills via `group-data-[checked=true]` when the parent `brn-radio` reports checked. Always place it inside `hlm-radio` (it matches the `hlm-radio-indicator` content slot).

## Examples

### 1. Basic usage

```ts
import { Component, signal } from '@angular/core';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-basic-radio',
  standalone: true,
  imports: [HlmRadioGroupImports],
  template: `
    <div hlmRadioGroup name="fruit" [value]="fruit()" (valueChange)="fruit.set($event)">
      <hlm-radio value="apple" inputId="fruit-apple">
        <hlm-radio-indicator />
        Apple
      </hlm-radio>
      <hlm-radio value="banana" inputId="fruit-banana">
        <hlm-radio-indicator />
        Banana
      </hlm-radio>
      <hlm-radio value="orange" inputId="fruit-orange">
        <hlm-radio-indicator />
        Orange
      </hlm-radio>
    </div>
    <p>Selected: {{ fruit() }}</p>
  `,
})
export class BasicRadioComponent {
  readonly fruit = signal('apple');
}
```

### 2. Element selector form + external labels

`hlm-radio-group` works as an element, and labels can live outside the item via `for`/`inputId`:

```ts
import { Component, signal } from '@angular/core';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-labelled-radio',
  standalone: true,
  imports: [HlmRadioGroupImports],
  template: `
    <hlm-radio-group name="contact">
      <label for="c-email">Email me</label>
      <hlm-radio value="email" inputId="c-email"><hlm-radio-indicator /></hlm-radio>

      <label for="c-sms">Text me</label>
      <hlm-radio value="sms" inputId="c-sms"><hlm-radio-indicator /></hlm-radio>
    </hlm-radio-group>
  `,
})
export class LabelledRadioComponent {}
```

Wrapping the item in a `<label>` also works — the item finds it with `closest('label')`:

```html
<hlm-radio-group name="contact">
  <label>
    <hlm-radio value="email"><hlm-radio-indicator /></hlm-radio>
    Email me
  </label>
</hlm-radio-group>
```

### 3. Reactive forms

`BrnRadioGroup` is a `ControlValueAccessor`, so `formControlName`/`formControl` bind on the group host:

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-reactive-radio',
  standalone: true,
  imports: [HlmRadioGroupImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div hlmRadioGroup formControlName="plan">
        <hlm-radio value="hobby"><hlm-radio-indicator />Hobby</hlm-radio>
        <hlm-radio value="pro"><hlm-radio-indicator />Pro</hlm-radio>
        <hlm-radio value="enterprise"><hlm-radio-indicator />Enterprise</hlm-radio>
      </div>
      @if (form.controls.plan.invalid && form.controls.plan.touched) {
        <p class="tw:text-destructive tw:text-sm">Please pick a plan.</p>
      }
      <button type="submit">Continue</button>
    </form>
  `,
})
export class ReactiveRadioComponent {
  readonly form = new FormGroup({
    plan: new FormControl<string | null>(null, Validators.required),
  });

  submit(): void {
    this.form.markAllAsTouched();
    console.log(this.form.value);
  }
}
```

When the control is invalid + touched, the group automatically gets `data-invalid="true"` (and destructive text styling) via the forwarded control state — no manual class juggling needed.

### 4. Disabled states (group vs item)

```ts
import { Component, signal } from '@angular/core';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-disabled-radio',
  standalone: true,
  imports: [HlmRadioGroupImports],
  template: `
    <!-- Whole group disabled -->
    <div hlmRadioGroup name="a" value="one" disabled>
      <hlm-radio value="one"><hlm-radio-indicator />One</hlm-radio>
      <hlm-radio value="two"><hlm-radio-indicator />Two</hlm-radio>
    </div>

    <!-- Single item disabled; its <label> gets data-disabled="true" -->
    <div hlmRadioGroup name="b" [value]="choice()" (valueChange)="choice.set($event)">
      <label for="b-one">One (soon unavailable)</label>
      <hlm-radio value="one" inputId="b-one" disabled><hlm-radio-indicator /></hlm-radio>
      <label for="b-two">Two</label>
      <hlm-radio value="two" inputId="b-two"><hlm-radio-indicator /></hlm-radio>
    </div>
  `,
})
export class DisabledRadioComponent {
  readonly choice = signal('two');
}
```

### 5. Per-item change events + typed values

`HlmRadio` is generic — `value` can be any type, and `change` emits `BrnRadioChange<T>`:

```ts
import { Component, signal } from '@angular/core';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';
import type { BrnRadioChange } from '@spartan-ng/brain/radio-group';

interface Tier {
  id: string;
  price: number;
}

@Component({
  selector: 'app-typed-radio',
  standalone: true,
  imports: [HlmRadioGroupImports],
  template: `
    <div hlmRadioGroup name="tier" (valueChange)="onGroupChange($event)">
      @for (tier of tiers; track tier.id) {
        <hlm-radio [value]="tier" (change)="onItemChange($event)">
          <hlm-radio-indicator />
          {{ tier.id }} — ${{ tier.price }}/mo
        </hlm-radio>
      }
    </div>
  `,
})
export class TypedRadioComponent {
  readonly tiers: Tier[] = [
    { id: 'starter', price: 0 },
    { id: 'growth', price: 29 },
  ];

  onGroupChange(value: Tier): void {
    console.log('group selected:', value.id);
  }

  onItemChange(event: BrnRadioChange<Tier>): void {
    console.log('item checked:', event.value.id, event.checked);
  }
}
```

### 6. Custom indicator content (target slot)

Anything projected with `[target]` or `[indicator]` goes into the indicator slot instead of the default label position:

```html
<div hlmRadioGroup name="layout">
  <hlm-radio value="grid">
    <span target class="tw:flex tw:items-center tw:gap-2">
      <hlm-radio-indicator />
      <strong>Grid</strong>
    </span>
    <span class="tw:text-muted-foreground tw:text-sm">Cards in a grid</span>
  </hlm-radio>
</div>
```

## Accessibility notes

- The group uses the native `radiogroup` semantics from `BrnRadioGroup`, including arrow-key navigation and roving tabindex — keep all `hlm-radio` items inside one group container.
- Always provide `name` so assistive tech (and native form serialization) treats the items as one group.
- Prefer visible text content inside `hlm-radio`; use `aria-label`/`aria-labelledby` only when the item has no visible label.
- Disabled items expose `data-disabled` (and the native disabled state on the inner input) and are skipped in keyboard navigation.
- Invalid form state is announced via `aria-invalid="true"` on the group host.

## Theming / CSS variables

Styling is class-driven (no component-specific CSS variables). Override via the `class` input on any of the three pieces; the indicator's checked dot keys off `group-data-[checked=true]`, and the group invalid state off `data-[invalid=true]`.

## Related subpaths

- `@egose/shadcn-theme-ng/label` — labelling radio items and form rows
- `@egose/shadcn-theme-ng/field` / `form-field` — form rows, descriptions, and error text wired via `BrnFieldControlDescribedBy`
- `@egose/shadcn-theme-ng/checkbox` — multi-select counterpart
- `@egose/shadcn-theme-ng/form-field-simple` — lightweight wrapper for reactive-form controls
