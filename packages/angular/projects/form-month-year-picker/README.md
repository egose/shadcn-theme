# Form Month Year Picker (`@egose/shadcn-theme-ng/form-month-year-picker`)

A ready-made reactive-form month/year field: label + `hlm-month-year-picker` + validation error/hint display in one tag. Dates default to the `MM/YYYY` display/edit format.

The Angular implementation is a standalone wrapper (not a brain primitive): it renders
`HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and
`HlmMonthYearPicker` + `HlmMonthYearInput` from `@egose/shadcn-theme-ng/date-picker`. The inner
picker is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the
`Date | null` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from
`HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-month-year-picker` and `@egose/shadcn-theme-ng-tw/form-month-year-picker`
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

Exported from the subpath root (`projects/form-month-year-picker/src/public-api.ts`):

```ts
import { EgFormMonthYearPicker } from '@egose/shadcn-theme-ng/form-month-year-picker';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-month-year-picker'
```

`ControlValueAccessor` behavior: `eg-form-month-year-picker` itself is not a `ControlValueAccessor`;
the inner `hlm-month-year-picker` is (bound via `formControlName`), so `formControlName`/`formGroup`
handling, `Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-month-year-picker
    controlName="start"
    label="Start month"
    [required]="true"
    error="Start month is required."
  />
</form>
```

Selector (from source): `eg-form-month-year-picker` (standalone component, host `tw:w-full`).

## API reference

### `EgFormMonthYearPicker` — `eg-form-month-year-picker`

| Input               | Type                              | Default        | Description                                                                                 |
| ------------------- | --------------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| `controlName`       | `string`                          | `''`           | `formControlName` key inside the parent `FormGroup`. **Required.**                          |
| `label`             | `string \| undefined`             | —              | Label text (hidden when omitted).                                                           |
| `error`             | `string \| undefined`             | —              | Error text shown when invalid.                                                              |
| `hint`              | `string \| undefined`             | —              | Hint text shown otherwise.                                                                  |
| `controlId`         | `string \| undefined`             | —              | Explicit id (first priority for `effectiveId`).                                             |
| `id`                | `string \| undefined`             | —              | Fallback id (second priority).                                                              |
| `name`              | `string \| undefined`             | —              | Native `name` forwarded to the inner input (`controlName` wins).                            |
| `placeholder`       | `string`                          | `'MM/YYYY'`    | Input placeholder.                                                                          |
| `readonly`          | `boolean`                         | `false`        | Native `readonly` forwarded to the inner input.                                             |
| `disabled`          | `boolean`                         | `false`        | Locks interaction (form control stays enabled).                                             |
| `required`          | `boolean`                         | `false`        | Shows a red `*` next to the label.                                                          |
| `min` / `max`       | `Date \| string \| null`          | `null`         | Date bounds forwarded to the picker.                                                        |
| `autoCloseOnSelect` | `boolean`                         | config default | Forwarded to the picker (falls back to `provideHlmMonthYearPickerConfig`, default `false`). |
| `formatDate`        | `(date: Date) => string`          | config default | Display format (falls back to `provideHlmMonthYearPickerConfig`, default `MM/YYYY`).        |
| `transformDate`     | `(date: Date) => Date`            | config default | Model transform (falls back to `provideHlmMonthYearPickerConfig`).                          |
| `parseDate`         | `(value: string) => Date \| null` | config default | Input parsing, forwarded to the input (falls back to `provideHlmMonthYearPickerConfig`).    |
| `formatInputDate`   | `(date: Date) => string`          | config default | Edit format while focused (falls back to `provideHlmMonthYearPickerConfig`).                |
| `class`             | `ClassValue`                      | `''`           | Extra host classes (base `tw:w-full`).                                                      |
| `labelClass`        | `string`                          | `''`           | Extra label classes (base `tw:mb-1`).                                                       |
| `pickerClass`       | `string`                          | `''`           | Extra picker-container classes (base `tw:mb-1`).                                            |
| `inputClass`        | `string`                          | `''`           | Extra inner-input classes (e.g. `tw:text-lg`).                                              |
| `errorClass`        | `string`                          | `''`           | Extra error classes (base `tw:mt-0`).                                                       |
| `hintClass`         | `string`                          | `''`           | Extra hint classes (base `tw:mt-0`).                                                        |

| Member               | Description                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to input `inputId` and label `for`.                                                                          |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                         |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to input `ariaDescribedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic required month field

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormMonthYearPicker } from '@egose/shadcn-theme-ng/form-month-year-picker';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormMonthYearPicker],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-month-year-picker
        controlName="start"
        label="Start month"
        [required]="true"
        error="Start month is required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class StartComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ start: [null as Date | null, Validators.required] });
  submit() {
    console.log(this.form.value.start);
  }
}
```

### 2. Card expiry with hint

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormMonthYearPicker } from '@egose/shadcn-theme-ng/form-month-year-picker';

@Component({
  selector: 'app-expiry',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormMonthYearPicker],
  template: `
    <form [formGroup]="form">
      <eg-form-month-year-picker
        controlName="expiry"
        label="Expiry"
        [min]="today"
        hint="As printed on the card."
        error="Enter a valid future month."
      />
    </form>
  `,
})
export class ExpiryComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ expiry: [null as Date | null] });
  readonly today = new Date();
}
```

## Accessibility notes

- Label `for` ↔ input `inputId` wiring is automatic via `effectiveId`; the input also receives `ariaLabel` and `ariaDescribedby` — always pass a `label`.
- Closing the picker popover marks the control touched, so errors appear after interaction even without typing.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `pickerClass` / `inputClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults via the month-year picker config:

```ts
import { provideHlmMonthYearPickerConfig } from '@egose/shadcn-theme-ng/date-picker';

await bootstrapApplication(App, {
  providers: [provideHlmMonthYearPickerConfig({ inputClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/date-picker` — raw `hlm-month-year-picker` + input/trigger/config tokens for custom layouts.
- `@egose/shadcn-theme-ng/form-date-picker` — the full-date counterpart (`eg-form-date-picker`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
