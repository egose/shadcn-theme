# Form Date Picker (`@egose/shadcn-theme-ng/form-date-picker`)

A ready-made reactive-form date field: label + `hlm-date-picker` + validation error/hint display in one tag. Equivalent to shadcn/ui `Form` + date-picker composition.

The Angular implementation is a standalone wrapper (not a brain primitive): it renders
`HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and
`HlmDatePicker` + `HlmDatePickerInput` from `@egose/shadcn-theme-ng/date-picker`. The inner
`hlm-date-picker` is bound with `[formControlName]="controlName()"`, so the parent `FormGroup`
owns the `Date | null` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent);
ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-date-picker` and `@egose/shadcn-theme-ng-tw/form-date-picker`
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

Exported from the subpath root (`projects/form-date-picker/src/public-api.ts`). Note: this subpath
exports a single standalone component — there is no `*Imports` array or `*Module`:

```ts
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-date-picker'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormDatePicker` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-date-picker` itself is not a `ControlValueAccessor`; the
inner `hlm-date-picker` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, `disabled` state from the control, and `dateChange` values (`Date | null`) all flow
through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-date-picker
    controlName="birthday"
    label="Date of birth"
    placeholder="Pick a date"
    [required]="true"
    hint="We use this to verify your age."
    error="Birth date is required."
  />
</form>
```

Selector (from source): `eg-form-date-picker` (standalone component, host `tw:w-full`).

## API reference

### `EgFormDatePicker` — `eg-form-date-picker`

| Input               | Type                     | Default         | Description                                                                                                 |
| ------------------- | ------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------- |
| `controlName`       | `string`                 | `''`            | `formControlName` key inside the parent `FormGroup`. **Required.**                                          |
| `label`             | `string \| undefined`    | —               | Label text (hidden when omitted).                                                                           |
| `error`             | `string \| undefined`    | —               | Error text shown when invalid.                                                                              |
| `hint`              | `string \| undefined`    | —               | Hint text shown otherwise.                                                                                  |
| `controlId`         | `string \| undefined`    | —               | Explicit id (first priority for `effectiveId`).                                                             |
| `id`                | `string \| undefined`    | —               | Fallback id (second priority).                                                                              |
| `name`              | `string \| undefined`    | —               | Declared input; **not bound** to the inner picker in the current template (surprise — see below).           |
| `placeholder`       | `string`                 | `'Pick a date'` | Input placeholder.                                                                                          |
| `readonly`          | `boolean`                | `false`         | Declared input; **not bound** in the current template.                                                      |
| `disabled`          | `boolean`                | `false`         | Locks interaction via picker `wrapperDisabled` (form control stays enabled).                                |
| `required`          | `boolean`                | `false`         | Shows a red `*` next to the label.                                                                          |
| `min`               | `Date \| string \| null` | `null`          | Minimum date forwarded to `hlm-date-picker`.                                                                |
| `max`               | `Date \| string \| null` | `null`          | Maximum date forwarded to `hlm-date-picker`.                                                                |
| `autoCloseOnSelect` | `boolean`                | `true`          | Declared input; **not bound** to the inner picker in the current template (picker default `false` applies). |
| `class`             | `ClassValue`             | `''`            | Declared but **not applied** to the host in the current template (host is fixed `tw:w-full`).               |
| `labelClass`        | `string`                 | `''`            | Extra label classes (base `tw:mb-1`).                                                                       |
| `pickerClass`       | `string`                 | `''`            | Extra picker classes (base `tw:mb-1`).                                                                      |
| `errorClass`        | `string`                 | `''`            | Extra error classes (base `tw:mt-0`).                                                                       |
| `hintClass`         | `string`                 | `''`            | Extra hint classes (base `tw:mt-0`).                                                                        |

| Member               | Description                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to input `inputId` and label `for`.                                                                          |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                         |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to input `ariaDescribedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic required date field

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-birthday',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-date-picker
        controlName="birthday"
        label="Date of birth"
        [required]="true"
        error="Birth date is required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class BirthdayComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ birthday: [null as Date | null, Validators.required] });
  submit() {
    console.log(this.form.value.birthday);
  }
}
```

### 2. Hint + min/max bounds

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-bounds',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `
    <form [formGroup]="form">
      <eg-form-date-picker
        controlName="departure"
        label="Departure"
        placeholder="Select departure"
        [min]="today"
        [max]="nextYear"
        hint="Bookings open up to one year ahead."
        error="Pick a valid departure date."
      />
    </form>
  `,
})
export class BoundsComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ departure: [null as Date | null] });
  readonly today = new Date();
  readonly nextYear = new Date(new Date().getFullYear() + 1, 11, 31);
}
```

### 3. Booking range (two fields, cross-validation)

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `
    <form [formGroup]="form" class="tw:grid tw:gap-4">
      <eg-form-date-picker controlName="checkIn" label="Check-in" [required]="true" error="Check-in is required." />
      <eg-form-date-picker
        controlName="checkOut"
        label="Check-out"
        [required]="true"
        [min]="form.value.checkIn"
        error="Check-out must be after check-in."
      />
    </form>
  `,
})
export class BookingComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group(
    { checkIn: [null as Date | null, Validators.required], checkOut: [null as Date | null, Validators.required] },
    {
      validators: (g: AbstractControl) =>
        (g.get('checkOut')?.value ?? 0) >= (g.get('checkIn')?.value ?? 0) ? null : { order: true },
    },
  );
}
```

### 4. Disabled / read-only preview

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-locked-date',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `
    <form [formGroup]="form">
      <eg-form-date-picker
        controlName="founded"
        label="Founded"
        [disabled]="true"
        hint="Managed by workspace admins."
      />
    </form>
  `,
})
export class LockedDateComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ founded: [new Date(2020, 0, 15)] });
}
```

### 5. Submit-gated validation + value preview

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-submit-date',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-date-picker controlName="start" label="Start date" [required]="true" error="Start date is required." />
      <button type="submit">Save</button>
    </form>
    <p class="tw:text-sm">ISO: {{ form.value.start?.toISOString() ?? '—' }}</p>
  `,
})
export class SubmitDateComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ start: [null as Date | null, Validators.required] });
  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) console.log('saving', this.form.value.start);
  }
}
```

### 6. Custom label/picker styling

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-styled-date',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormDatePicker],
  template: `
    <form [formGroup]="form">
      <eg-form-date-picker
        controlName="event"
        controlId="event-date"
        label="Event date"
        labelClass="tw:font-semibold"
        pickerClass="tw:max-w-xs"
        hint="Doors open one hour earlier."
      />
    </form>
  `,
})
export class StyledDateComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ event: [null as Date | null] });
}
```

## Accessibility notes

- Label `for` ↔ input `inputId` wiring is automatic via `effectiveId`; the input also receives `ariaLabel` (the label text) and `ariaDescribedby` (error/hint id) — always pass a `label`.
- Closing the picker popover marks the control touched, so errors appear after interaction even without typing.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.
- Arrow-down opens the calendar from the input; the calendar/popup primitives handle focus trap, escape, and outside-click dismissal.

## Theming / CSS variables

No component-specific CSS variables. Style via `labelClass` / `pickerClass` / `errorClass` / `hintClass` and global tokens. The host is fixed `tw:w-full`; constrain width with a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/date-picker` — raw `hlm-date-picker` + input/trigger/config tokens for custom layouts.
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/calendar` — calendars rendered inside the picker popover.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose pickers by hand.
