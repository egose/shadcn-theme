# Form Input OTP (`@egose/shadcn-theme-ng/form-input-otp`)

A ready-made reactive-form one-time-code field: label + `brn-input-otp` slots + validation error/hint display in one tag. The model is a plain `string`.

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and `BrnInputOtp` + `HlmInputOtp*` parts from `@egose/shadcn-theme-ng/input-otp` and `@spartan-ng/brain/input-otp`. The OTP input is bound with `[formControlName]="controlName()"` and renders one `hlm-input-otp-slot` per `length` unit in a single group. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-input-otp` and `@egose/shadcn-theme-ng-tw/form-input-otp`
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
`@egose/shadcn-theme-ng/input-otp`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-input-otp/src/public-api.ts`):

```ts
import { EgFormInputOtp, provideEgFormInputOtpConfig } from '@egose/shadcn-theme-ng/form-input-otp';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-input-otp'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormInputOtp } from '@egose/shadcn-theme-ng/form-input-otp';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormInputOtp],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormInputOtp` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-input-otp` itself is not a `ControlValueAccessor`; the
inner `brn-input-otp` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-input-otp
    controlName="code"
    label="Verification code"
    [length]="6"
    [required]="true"
    error="Enter the 6-digit code."
  />
</form>
```

Selector (from source): `eg-form-input-otp` (standalone component, host `tw:w-full`).

## API reference

### `EgFormInputOtp` — `eg-form-input-otp`

| Input         | Type                  | Default | Description                                                        |
| ------------- | --------------------- | ------- | ------------------------------------------------------------------ |
| `controlName` | `string`              | `''`    | `formControlName` key inside the parent `FormGroup`. **Required.** |
| `label`       | `string \| undefined` | —       | Label text (hidden when omitted).                                  |
| `error`       | `string \| undefined` | —       | Error text shown when invalid.                                     |
| `hint`        | `string \| undefined` | —       | Hint text shown otherwise.                                         |
| `controlId`   | `string \| undefined` | —       | Explicit id (first priority for `effectiveId`).                    |
| `id`          | `string \| undefined` | —       | Fallback id (second priority).                                     |
| `length`      | `number`              | `6`     | Slot count; one `hlm-input-otp-slot` is rendered per unit.         |
| `disabled`    | `boolean`             | `false` | Locks interaction (form control stays enabled).                    |
| `required`    | `boolean`             | `false` | Shows a red `*` next to the label.                                 |
| `class`       | `ClassValue`          | `''`    | Extra host classes (base `tw:w-full`).                             |
| `labelClass`  | `string`              | `''`    | Extra label classes (base `tw:mb-1`).                              |
| `otpClass`    | `string`              | `''`    | Extra OTP container classes.                                       |
| `errorClass`  | `string`              | `''`    | Extra error classes (base `tw:mt-0`).                              |
| `hintClass`   | `string`              | `''`    | Extra hint classes (base `tw:mt-0`).                               |

| Member               | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to OTP `inputId` and label `for`. |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                              |
| `slotIndexes`        | `0..length-1` — drives slot rendering.                                           |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic verification code

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormInputOtp } from '@egose/shadcn-theme-ng/form-input-otp';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormInputOtp],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-input-otp
        controlName="code"
        label="Verification code"
        [length]="6"
        [required]="true"
        error="Enter the 6-digit code."
      />
      <button type="submit" [disabled]="form.invalid">Verify</button>
    </form>
  `,
})
export class VerifyComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ code: ['', [Validators.required, Validators.minLength(6)]] });
  submit() {
    console.log(this.form.value.code);
  }
}
```

### 2. Short PIN with hint

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormInputOtp } from '@egose/shadcn-theme-ng/form-input-otp';

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormInputOtp],
  template: `
    <form [formGroup]="form">
      <eg-form-input-otp
        controlName="pin"
        label="PIN"
        [length]="4"
        hint="Check your authenticator app."
        error="PIN is required."
      />
    </form>
  `,
})
export class PinComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ pin: [''] });
}
```

## Accessibility notes

- Label `for` ↔ OTP `inputId` wiring is automatic via `effectiveId` — always pass a `label`.
- `BrnInputOtp` exposes no `aria-describedby`, so error/hint ids render without an input-level link.
- The required `*` is visual; pair with `Validators.required` (plus `minLength`) so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `otpClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormInputOtpConfig } from '@egose/shadcn-theme-ng/form-input-otp';

await bootstrapApplication(App, {
  providers: [provideEgFormInputOtpConfig({ labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/input-otp` — raw `brn-input-otp` + slot/group/separator parts for custom layouts.
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose controls by hand.
