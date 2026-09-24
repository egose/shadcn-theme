# Form Date Range Picker (`@egose/shadcn-theme-ng/form-date-range-picker`)

A ready-made reactive-form date-range field: label + `hlm-date-range-picker` + validation error/hint display in one tag. Equivalent to shadcn/ui `Form` + date-range-picker composition.

The Angular implementation is a standalone wrapper (not a brain primitive): it renders
`HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and
`HlmDateRangePicker` + `HlmDateRangeInput` from `@egose/shadcn-theme-ng/date-picker`. The inner
`hlm-date-range-picker` is bound with `[formControlName]="controlName()"`, so the parent `FormGroup`
owns the `[Date, Date] | null` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent);
ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-date-range-picker` and `@egose/shadcn-theme-ng-tw/form-date-range-picker`
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

Exported from the subpath root (`projects/form-date-range-picker/src/public-api.ts`). Note: this subpath
exports a single standalone component — there is no `*Imports` array or `*Module`:

```ts
import { EgFormDateRangePicker } from '@egose/shadcn-theme-ng/form-date-range-picker';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-date-range-picker'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormDateRangePicker } from '@egose/shadcn-theme-ng/form-date-range-picker';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDateRangePicker],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormDateRangePicker` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-date-range-picker` itself is not a `ControlValueAccessor`; the
inner `hlm-date-range-picker` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, `disabled` state from the control, and `dateChange` values (`[Date, Date] | null`) all flow
through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-date-range-picker
    controlName="stay"
    label="Stay dates"
    placeholder="Pick a date range"
    [required]="true"
    hint="Pick check-in and check-out."
    error="Stay dates are required."
  />
</form>
```

Selector (from source): `eg-form-date-range-picker` (standalone component, host `tw:w-full`).

## API reference

### `EgFormDateRangePicker` — `eg-form-date-range-picker`

| Input                     | Type                                              | Default               | Description                                                                                                       |
| ------------------------- | ------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `controlName`             | `string`                                          | `''`                  | `formControlName` key inside the parent `FormGroup`. **Required.**                                                |
| `label`                   | `string \| undefined`                             | —                     | Label text (hidden when omitted).                                                                                 |
| `error`                   | `string \| undefined`                             | —                     | Error text shown when invalid.                                                                                    |
| `hint`                    | `string \| undefined`                             | —                     | Hint text shown otherwise.                                                                                        |
| `controlId`               | `string \| undefined`                             | —                     | Explicit id (first priority for `effectiveId`).                                                                   |
| `id`                      | `string \| undefined`                             | —                     | Fallback id (second priority).                                                                                    |
| `name`                    | `string \| undefined`                             | —                     | Native `name` forwarded to the inner input (`controlName` wins when set, like `eg-form-text-input`).              |
| `placeholder`             | `string`                                          | `'Pick a date range'` | Input placeholder.                                                                                                |
| `readonly`                | `boolean`                                         | `false`               | Native `readonly` forwarded to the inner input (locks typed text; use `disabled` to lock the calendar too).       |
| `disabled`                | `boolean`                                         | `false`               | Locks interaction via picker `disabled` (form control stays enabled).                                             |
| `required`                | `boolean`                                         | `false`               | Shows a red `*` next to the label.                                                                                |
| `min`                     | `Date \| string \| null`                          | `null`                | Minimum date forwarded to `hlm-date-range-picker`.                                                                |
| `max`                     | `Date \| string \| null`                          | `null`                | Maximum date forwarded to `hlm-date-range-picker`.                                                                |
| `autoCloseOnEndSelection` | `boolean`                                         | config default        | Forwarded to `hlm-date-range-picker` (falls back to `provideHlmDateRangePickerConfig`, default `false`).          |
| `captionLayout`           | union                                             | `'label'`             | Forwarded to `hlm-date-range-picker` (`'dropdown' \| 'label' \| 'dropdown-months' \| 'dropdown-years'`).          |
| `formatDates`             | `(dates: [Date \| null, Date \| null]) => string` | config default        | Display format, forwarded to `hlm-date-range-picker` (falls back to `provideHlmDateRangePickerConfig`).           |
| `transformDates`          | `(dates: [Date, Date]) => [Date, Date]`           | config default        | Model transform, forwarded to `hlm-date-range-picker` (falls back to `provideHlmDateRangePickerConfig`).          |
| `parseDate`               | `(value: string) => [Date, Date] \| null`         | config default        | Input parsing, forwarded to `hlm-date-range-input` (falls back to `provideHlmDateRangePickerConfig`).             |
| `formatInputDates`        | `(dates: [Date \| null, Date \| null]) => string` | config default        | Edit format while focused, forwarded to `hlm-date-range-input` (falls back to `provideHlmDateRangePickerConfig`). |
| `class`                   | `ClassValue`                                      | `''`                  | Extra host classes (base `tw:w-full`).                                                                            |
| `labelClass`              | `string`                                          | `''`                  | Extra label classes (base `tw:mb-1`).                                                                             |
| `pickerClass`             | `string`                                          | `''`                  | Extra picker-container classes (base `tw:mb-1`).                                                                  |
| `inputClass`              | `string`                                          | `''`                  | Extra inner-input classes (e.g. `tw:text-lg` for text size).                                                      |
| `errorClass`              | `string`                                          | `''`                  | Extra error classes (base `tw:mt-0`).                                                                             |
| `hintClass`               | `string`                                          | `''`                  | Extra hint classes (base `tw:mt-0`).                                                                              |

| Member               | Description                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to input `inputId` and label `for`.                                                                          |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                         |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to input `ariaDescribedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic required range field

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormDateRangePicker } from '@egose/shadcn-theme-ng/form-date-range-picker';

@Component({
  selector: 'app-stay',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDateRangePicker],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-date-range-picker
        controlName="stay"
        label="Stay dates"
        [required]="true"
        error="Stay dates are required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class StayComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ stay: [null as [Date, Date] | null, Validators.required] });
  submit() {
    console.log(this.form.value.stay);
  }
}
```

### 2. Hint + min bound

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormDateRangePicker } from '@egose/shadcn-theme-ng/form-date-range-picker';

@Component({
  selector: 'app-bounds',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDateRangePicker],
  template: `
    <form [formGroup]="form">
      <eg-form-date-range-picker
        controlName="booking"
        label="Booking"
        placeholder="Select your stay"
        [min]="today"
        hint="Stays start today or later."
        error="Pick a valid stay."
      />
    </form>
  `,
})
export class BoundsComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ booking: [null as [Date, Date] | null] });
  readonly today = new Date();
}
```

### 3. Custom label/input styling

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormDateRangePicker } from '@egose/shadcn-theme-ng/form-date-range-picker';

@Component({
  selector: 'app-styled-range',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDateRangePicker],
  template: `
    <form [formGroup]="form">
      <eg-form-date-range-picker
        controlName="event"
        controlId="event-range"
        label="Event range"
        labelClass="tw:font-semibold"
        pickerClass="tw:max-w-md"
        inputClass="tw:text-lg"
        hint="Doors open one hour earlier on day one."
      />
    </form>
  `,
})
export class StyledRangeComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ event: [null as [Date, Date] | null] });
}
```

## Accessibility notes

- Label `for` ↔ input `inputId` wiring is automatic via `effectiveId`; the input also receives `ariaLabel` (the label text) and `ariaDescribedby` (error/hint id) — always pass a `label`.
- Closing the picker popover marks the control touched, so errors appear after interaction even without typing.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.
- Arrow-down opens the calendar from the input; the calendar/popup primitives handle focus trap, escape, and outside-click dismissal.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `pickerClass` / `inputClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults (styling analogue of `formatDates`) via the range picker config:

```ts
import { provideHlmDateRangePickerConfig } from '@egose/shadcn-theme-ng/date-picker';

await bootstrapApplication(App, {
  providers: [
    provideHlmDateRangePickerConfig({
      inputClass: 'tw:text-sm', // every range input; per-instance inputClass still wins on conflict
      labelClass: 'tw:font-medium',
    }),
  ],
});
```

The host keeps `tw:w-full`; constrain width with `class` (e.g. `tw:max-w-md`) or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/date-picker` — raw `hlm-date-range-picker` + input/trigger/config tokens for custom layouts.
- `@egose/shadcn-theme-ng/form-date-picker` — the single-date counterpart (`eg-form-date-picker`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/calendar` — calendars rendered inside the picker popover.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose pickers by hand.
