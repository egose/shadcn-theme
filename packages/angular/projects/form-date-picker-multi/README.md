# Form Date Picker Multi (`@egose/shadcn-theme-ng/form-date-picker-multi`)

A ready-made reactive-form multi-date field: label + `hlm-date-picker-multi` + validation error/hint display in one tag. The model is a `Date[] | null`.

The Angular implementation is a standalone wrapper (not a brain primitive): it renders
`HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and
`HlmDatePickerMulti` + `HlmDateMultiInput` from `@egose/shadcn-theme-ng/date-picker`. The inner
picker is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the value.
It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator`
unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-date-picker-multi` and `@egose/shadcn-theme-ng-tw/form-date-picker-multi`
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
`@egose/shadcn-theme-ng/date-picker`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-date-picker-multi/src/public-api.ts`):

```ts
import { EgFormDatePickerMulti } from '@egose/shadcn-theme-ng/form-date-picker-multi';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-date-picker-multi'
```

`ControlValueAccessor` behavior: `eg-form-date-picker-multi` itself is not a `ControlValueAccessor`;
the inner `hlm-date-picker-multi` is (bound via `formControlName`), so `formControlName`/`formGroup`
handling, `Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-date-picker-multi
    controlName="holidays"
    label="Holidays"
    placeholder="Pick dates"
    [required]="true"
    error="Pick at least one day."
  />
</form>
```

Selector (from source): `eg-form-date-picker-multi` (standalone component, host `tw:w-full`).

## API reference

### `EgFormDatePickerMulti` — `eg-form-date-picker-multi`

| Input                           | Type                                | Default        | Description                                                                                                                                                                                      |
| ------------------------------- | ----------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `controlName`                   | `string`                            | `''`           | `formControlName` key inside the parent `FormGroup`. **Required.**                                                                                                                               |
| `label`                         | `string \| undefined`               | —              | Label text (hidden when omitted).                                                                                                                                                                |
| `error`                         | `string \| undefined`               | —              | Error text shown when invalid.                                                                                                                                                                   |
| `autoError`                     | `boolean`                           | `true`         | Auto-resolve the message from the control's `ValidationErrors` when `error` is unset. Explicit `error` always wins; `error=""` counts as unset. Global wording via `provideEgFormErrorMessages`. |
| `hint`                          | `string \| undefined`               | —              | Hint text shown otherwise.                                                                                                                                                                       |
| `controlId`                     | `string \| undefined`               | —              | Explicit id (first priority for `effectiveId`).                                                                                                                                                  |
| `id`                            | `string \| undefined`               | —              | Fallback id (second priority).                                                                                                                                                                   |
| `name`                          | `string \| undefined`               | —              | Native `name` forwarded to the inner input (`controlName` wins).                                                                                                                                 |
| `placeholder`                   | `string`                            | `'Pick dates'` | Input placeholder.                                                                                                                                                                               |
| `readonly`                      | `boolean`                           | `false`        | Native `readonly` forwarded to the inner input.                                                                                                                                                  |
| `disabled`                      | `boolean`                           | `false`        | Locks interaction (form control stays enabled).                                                                                                                                                  |
| `required`                      | `boolean`                           | `false`        | Shows a red `*` next to the label.                                                                                                                                                               |
| `min` / `max`                   | `Date \| string \| null`            | `null`         | Date bounds forwarded to the picker.                                                                                                                                                             |
| `minSelection` / `maxSelection` | `number \| undefined`               | —              | Selection-count bounds forwarded to the picker.                                                                                                                                                  |
| `autoCloseOnMaxSelection`       | `boolean`                           | config default | Forwarded to the picker (falls back to `provideHlmDatePickerMultiConfig`, default `false`).                                                                                                      |
| `captionLayout`                 | union                               | `'label'`      | Forwarded to the picker (`'dropdown' \| 'label' \| 'dropdown-months' \| 'dropdown-years'`).                                                                                                      |
| `formatDates`                   | `(dates: Date[]) => string`         | config default | Display format (falls back to `provideHlmDatePickerMultiConfig`).                                                                                                                                |
| `transformDates`                | `(dates: Date[]) => Date[]`         | config default | Model transform (falls back to `provideHlmDatePickerMultiConfig`).                                                                                                                               |
| `parseDate`                     | `(value: string) => Date[] \| null` | config default | Input parsing, forwarded to the input (falls back to `provideHlmDatePickerMultiConfig`).                                                                                                         |
| `formatInputDates`              | `(dates: Date[]) => string`         | config default | Edit format while focused (falls back to `provideHlmDatePickerMultiConfig`).                                                                                                                     |
| `class`                         | `ClassValue`                        | `''`           | Extra host classes (base `tw:w-full`).                                                                                                                                                           |
| `labelClass`                    | `string`                            | `''`           | Extra label classes (base `tw:mb-1`).                                                                                                                                                            |
| `pickerClass`                   | `string`                            | `''`           | Extra picker-container classes (base `tw:mb-1`).                                                                                                                                                 |
| `inputClass`                    | `string`                            | `''`           | Extra inner-input classes (e.g. `tw:text-lg`).                                                                                                                                                   |
| `errorClass`                    | `string`                            | `''`           | Extra error classes (base `tw:mt-0`).                                                                                                                                                            |
| `hintClass`                     | `string`                            | `''`           | Extra hint classes (base `tw:mt-0`).                                                                                                                                                             |

| Member               | Description                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to input `inputId` and label `for`.                                                                          |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                         |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to input `ariaDescribedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic multi-date field

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormDatePickerMulti } from '@egose/shadcn-theme-ng/form-date-picker-multi';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePickerMulti],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-date-picker-multi
        controlName="holidays"
        label="Holidays"
        [required]="true"
        error="Pick at least one day."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class HolidaysComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ holidays: [null as Date[] | null, Validators.required] });
  submit() {
    console.log(this.form.value.holidays);
  }
}
```

### 2. Capped selection with hint

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormDatePickerMulti } from '@egose/shadcn-theme-ng/form-date-picker-multi';

@Component({
  selector: 'app-blackout',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePickerMulti],
  template: `
    <form [formGroup]="form">
      <eg-form-date-picker-multi
        controlName="blackout"
        label="Blackout dates"
        [maxSelection]="5"
        [autoCloseOnMaxSelection]="true"
        hint="Up to five days, comma-separated."
      />
    </form>
  `,
})
export class BlackoutComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ blackout: [null as Date[] | null] });
}
```

## Accessibility notes

- Label `for` ↔ input `inputId` wiring is automatic via `effectiveId`; the input also receives `ariaLabel` and `ariaDescribedby` — always pass a `label`.
- Closing the picker popover marks the control touched, so errors appear after interaction even without typing.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `pickerClass` / `inputClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults via the multi picker config:

```ts
import { provideHlmDatePickerMultiConfig } from '@egose/shadcn-theme-ng/date-picker';

await bootstrapApplication(App, {
  providers: [provideHlmDatePickerMultiConfig({ inputClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/date-picker` — raw `hlm-date-picker-multi` + input/trigger/config tokens for custom layouts.
- `@egose/shadcn-theme-ng/form-date-picker` — the single-date counterpart (`eg-form-date-picker`).
- `@egose/shadcn-theme-ng/form-date-range-picker` — the range counterpart (`eg-form-date-range-picker`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
