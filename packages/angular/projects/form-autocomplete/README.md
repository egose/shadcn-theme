# Form Autocomplete (`@egose/shadcn-theme-ng/form-autocomplete`)

A ready-made reactive-form autocomplete field: label + `hlm-autocomplete` text input with suggestion list + validation error/hint display in one tag. The model is a `string`.

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and the `HlmAutocomplete*` parts from `@egose/shadcn-theme-ng/autocomplete`. The autocomplete root is bound with `[formControlName]="controlName()"` (`BrnAutocomplete` implements `ControlValueAccessor`), so the parent `FormGroup` owns the value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-autocomplete` and `@egose/shadcn-theme-ng-tw/form-autocomplete`
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
`@egose/shadcn-theme-ng/autocomplete`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-autocomplete/src/public-api.ts`):

```ts
import { EgFormAutocomplete, provideEgFormAutocompleteConfig } from '@egose/shadcn-theme-ng/form-autocomplete';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-autocomplete'
```

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-autocomplete
    controlName="fruit"
    label="Fruit"
    [options]="fruits"
    [required]="true"
    error="Fruit is required."
  />
</form>
```

Selector (from source): `eg-form-autocomplete` (standalone component, host `tw:w-full`).

## API reference

### `EgFormAutocomplete` — `eg-form-autocomplete`

| Input          | Type                  | Default             | Description                                                                                                                                                                                      |
| -------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `controlName`  | `string`              | `''`                | `formControlName` key inside the parent `FormGroup`. **Required.**                                                                                                                               |
| `label`        | `string \| undefined` | —                   | Label text (hidden when omitted).                                                                                                                                                                |
| `error`        | `string \| undefined` | —                   | Error text shown when invalid.                                                                                                                                                                   |
| `autoError`    | `boolean`             | `true`              | Auto-resolve the message from the control's `ValidationErrors` when `error` is unset. Explicit `error` always wins; `error=""` counts as unset. Global wording via `provideEgFormErrorMessages`. |
| `hint`         | `string \| undefined` | —                   | Hint text shown otherwise.                                                                                                                                                                       |
| `controlId`    | `string \| undefined` | —                   | Explicit id (first priority for `effectiveId`).                                                                                                                                                  |
| `id`           | `string \| undefined` | —                   | Fallback id (second priority).                                                                                                                                                                   |
| `placeholder`  | `string`              | `'Type to search…'` | Input placeholder.                                                                                                                                                                               |
| `emptyText`    | `string`              | `'No result.'`      | Text shown when no option matches.                                                                                                                                                               |
| `disabled`     | `boolean`             | `false`             | Locks interaction (form control stays enabled).                                                                                                                                                  |
| `required`     | `boolean`             | `false`             | Shows a red `*` next to the label.                                                                                                                                                               |
| `options`      | `string[]`            | `[]`                | Rendered as `hlm-autocomplete-item` entries.                                                                                                                                                     |
| `class`        | `ClassValue`          | `''`                | Extra host classes (base `tw:w-full`).                                                                                                                                                           |
| `labelClass`   | `string`              | `''`                | Extra label classes (base `tw:mb-1`).                                                                                                                                                            |
| `controlClass` | `string`              | `''`                | Extra autocomplete-root classes.                                                                                                                                                                 |
| `inputClass`   | `string`              | `''`                | Extra text-input classes.                                                                                                                                                                        |
| `errorClass`   | `string`              | `''`                | Extra error classes (base `tw:mt-0`).                                                                                                                                                            |
| `hintClass`    | `string`              | `''`                | Extra hint classes (base `tw:mt-0`).                                                                                                                                                             |

| Member               | Description                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to input `inputId` and label `for`. |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic required autocomplete

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormAutocomplete } from '@egose/shadcn-theme-ng/form-autocomplete';

@Component({
  selector: 'app-fruit',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormAutocomplete],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-autocomplete
        controlName="fruit"
        label="Fruit"
        [options]="fruits"
        [required]="true"
        error="Fruit is required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class FruitComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ fruit: ['', Validators.required] });
  readonly fruits = ['Apple', 'Banana', 'Cherry'];
  submit() {
    console.log(this.form.value.fruit);
  }
}
```

### 2. Custom empty text + hint

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormAutocomplete } from '@egose/shadcn-theme-ng/form-autocomplete';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormAutocomplete],
  template: `
    <form [formGroup]="form">
      <eg-form-autocomplete
        controlName="city"
        label="City"
        [options]="cities"
        placeholder="Start typing…"
        emptyText="No matching city."
        hint="We ship to these cities."
      />
    </form>
  `,
})
export class CityComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ city: [''] });
  readonly cities = ['Berlin', 'Paris', 'Rome'];
}
```

## Accessibility notes

- Label `for` ↔ input `inputId` wiring is automatic via `effectiveId` — always pass a `label`.
- The autocomplete input exposes no `aria-describedby`, so error/hint ids render without an input-level link.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `controlClass` / `inputClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormAutocompleteConfig } from '@egose/shadcn-theme-ng/form-autocomplete';

await bootstrapApplication(App, {
  providers: [provideEgFormAutocompleteConfig({ inputClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` (e.g. `tw:max-w-sm`) or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/autocomplete` — raw `HlmAutocomplete*` parts for custom layouts.
- `@egose/shadcn-theme-ng/form-combobox` — multi-select counterpart with chips (`eg-form-combobox`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose controls by hand.
