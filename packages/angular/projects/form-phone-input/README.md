# Form Phone Input (`@egose/shadcn-theme-ng/form-phone-input`)

A ready-made reactive-form phone field: label + `hlm-phone-input` + validation error/hint display in one tag. The model holds raw digits; the visible text is masked.

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and `HlmPhoneInput` from `@egose/shadcn-theme-ng/phone-input`. The inner input is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the digit string. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-phone-input` and `@egose/shadcn-theme-ng-tw/form-phone-input`
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
`@egose/shadcn-theme-ng/phone-input`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-phone-input/src/public-api.ts`):

```ts
import { EgFormPhoneInput, provideEgFormPhoneInputConfig } from '@egose/shadcn-theme-ng/form-phone-input';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-phone-input'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormPhoneInput } from '@egose/shadcn-theme-ng/form-phone-input';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormPhoneInput],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormPhoneInput` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-phone-input` itself is not a `ControlValueAccessor`; the
inner `hlm-phone-input` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form. Validate
against digit length (`Validators.minLength(10)`) since the model holds raw digits.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-phone-input controlName="phone" label="Phone" [required]="true" error="Enter a 10-digit number." />
</form>
```

Selector (from source): `eg-form-phone-input` (standalone component, host `tw:w-full`).

## API reference

### `EgFormPhoneInput` — `eg-form-phone-input`

| Input               | Type                         | Default                 | Description                                                                                                                                                                                      |
| ------------------- | ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `controlName`       | `string`                     | `''`                    | `formControlName` key inside the parent `FormGroup`. **Required.**                                                                                                                               |
| `label`             | `string \| undefined`        | —                       | Label text (hidden when omitted).                                                                                                                                                                |
| `error`             | `string \| undefined`        | —                       | Error text shown when invalid.                                                                                                                                                                   |
| `autoError`         | `boolean`                    | `true`                  | Auto-resolve the message from the control's `ValidationErrors` when `error` is unset. Explicit `error` always wins; `error=""` counts as unset. Global wording via `provideEgFormErrorMessages`. |
| `hint`              | `string \| undefined`        | —                       | Hint text shown otherwise.                                                                                                                                                                       |
| `controlId`         | `string \| undefined`        | —                       | Explicit id (first priority for `effectiveId`).                                                                                                                                                  |
| `id`                | `string \| undefined`        | —                       | Fallback id (second priority).                                                                                                                                                                   |
| `name`              | `string \| undefined`        | —                       | Native `name` forwarded to the inner input (`controlName` wins).                                                                                                                                 |
| `placeholder`       | `string`                     | `'(555) 123-4567'`      | Input placeholder.                                                                                                                                                                               |
| `autocomplete`      | `string`                     | `'tel'`                 | Native autocomplete token.                                                                                                                                                                       |
| `readonly`          | `boolean`                    | `false`                 | Native `readonly` forwarded to the inner input.                                                                                                                                                  |
| `disabled`          | `boolean`                    | `false`                 | Locks interaction (form control stays enabled).                                                                                                                                                  |
| `required`          | `boolean`                    | `false`                 | Shows a red `*` next to the label.                                                                                                                                                               |
| `maxDigits`         | `number`                     | `10`                    | Maximum digit count kept in the model.                                                                                                                                                           |
| `modelFormat`       | `'digits' \| 'formatted'`    | `'digits'`              | Model shape: raw digits or formatted display text.                                                                                                                                               |
| `formatPhoneNumber` | `(digits: string) => string` | `formatNanpPhoneNumber` | Display formatter forwarded to the input.                                                                                                                                                        |
| `class`             | `ClassValue`                 | `''`                    | Extra host classes (base `tw:w-full`).                                                                                                                                                           |
| `labelClass`        | `string`                     | `''`                    | Extra label classes (base `tw:mb-1 tw:gap-0`).                                                                                                                                                   |
| `inputClass`        | `string`                     | `''`                    | Extra inner-input classes.                                                                                                                                                                       |
| `errorClass`        | `string`                     | `''`                    | Extra error classes (base `tw:mt-0`).                                                                                                                                                            |
| `hintClass`         | `string`                     | `''`                    | Extra hint classes (base `tw:mt-0`).                                                                                                                                                             |

| Member               | Description                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to input `inputId` and label `for`.                                                                          |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                         |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to input `ariaDescribedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Required US number

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormPhoneInput } from '@egose/shadcn-theme-ng/form-phone-input';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormPhoneInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-phone-input
        controlName="phone"
        label="Callback number"
        [required]="true"
        error="Enter a 10-digit number."
      />
      <button type="submit" [disabled]="form.invalid">Request callback</button>
    </form>
  `,
})
export class CallbackComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ phone: [null as string | null, [Validators.required, Validators.minLength(10)]] });
  submit() {
    console.log(this.form.value.phone); // raw digits, e.g. "4155552671"
  }
}
```

### 2. Optional with hint

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormPhoneInput } from '@egose/shadcn-theme-ng/form-phone-input';

@Component({
  selector: 'app-profile-phone',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormPhoneInput],
  template: `
    <form [formGroup]="form">
      <eg-form-phone-input controlName="mobile" label="Mobile (optional)" hint="US format, digits only in storage." />
    </form>
  `,
})
export class ProfilePhoneComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ mobile: [null as string | null] });
}
```

## Accessibility notes

- Label `for` ↔ input `inputId` wiring is automatic via `effectiveId`; the input also receives `name`, `autocomplete="tel"`, and `ariaDescribedby` — always pass a `label`.
- The required `*` is visual; pair with `Validators.required` (plus `minLength`) so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables; the inner input carries the shared `HlmInput` base. Style per-instance via `class` / `labelClass` / `inputClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormPhoneInputConfig } from '@egose/shadcn-theme-ng/form-phone-input';

await bootstrapApplication(App, {
  providers: [provideEgFormPhoneInputConfig({ inputClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` (e.g. `tw:max-w-xs`) or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/phone-input` — raw `hlm-phone-input` + `formatNanpPhoneNumber` for custom layouts.
- `@egose/shadcn-theme-ng/form-text-input` — the plain-text counterpart (`eg-form-text-input`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose controls by hand.
