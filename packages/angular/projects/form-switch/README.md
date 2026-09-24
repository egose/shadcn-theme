# Form Switch (`@egose/shadcn-theme-ng/form-switch`)

A ready-made reactive-form boolean field: `hlm-switch` + label + validation error/hint display in one tag. The switch equivalent of `eg-form-checkbox` for on/off settings.

The Angular implementation is a standalone wrapper: it renders `EgFormField` from `@egose/shadcn-theme-ng/form-field-simple` (like `eg-form-checkbox`, because `hlm-switch` exposes no `BrnFieldControl`), `HlmError` / `HlmHint`, `HlmLabel`, and `HlmSwitch` from `@egose/shadcn-theme-ng/switch`. The inner switch is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the `boolean` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-switch` and `@egose/shadcn-theme-ng-tw/form-switch`
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
`@egose/shadcn-theme-ng/switch`, `@egose/shadcn-theme-ng/form-field`, `@egose/shadcn-theme-ng/form-field-simple`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-switch/src/public-api.ts`):

```ts
import { EgFormSwitch, provideEgFormSwitchConfig } from '@egose/shadcn-theme-ng/form-switch';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-switch'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormSwitch } from '@egose/shadcn-theme-ng/form-switch';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSwitch],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormSwitch` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-switch` itself is not a `ControlValueAccessor`; the
inner `hlm-switch` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-switch controlName="notifications" label="Email notifications" hint="Toggle to subscribe." />
</form>
```

Selector (from source): `eg-form-switch` (standalone component, host `tw:w-full`).

## API reference

### `EgFormSwitch` — `eg-form-switch`

| Input         | Type                  | Default | Description                                                        |
| ------------- | --------------------- | ------- | ------------------------------------------------------------------ |
| `controlName` | `string`              | `''`    | `formControlName` key inside the parent `FormGroup`. **Required.** |
| `label`       | `string \| undefined` | —       | Label text beside the switch (hidden when omitted).                |
| `error`       | `string \| undefined` | —       | Error text shown when invalid.                                     |
| `hint`        | `string \| undefined` | —       | Hint text shown otherwise.                                         |
| `controlId`   | `string \| undefined` | —       | Explicit id (first priority for `effectiveId`).                    |
| `id`          | `string \| undefined` | —       | Fallback id (second priority).                                     |
| `disabled`    | `boolean`             | `false` | Locks interaction (form control stays enabled).                    |
| `required`    | `boolean`             | `false` | Shows a red `*` next to the label; forwarded to the switch.        |
| `class`       | `ClassValue`          | `''`    | Extra host classes (base `tw:w-full`).                             |
| `switchClass` | `string`              | `''`    | Extra switch classes, merged into `HlmSwitch.userClass`.           |
| `labelClass`  | `string`              | `''`    | Extra label classes.                                               |
| `errorClass`  | `string`              | `''`    | Extra error classes (base `tw:mt-0`).                              |
| `hintClass`   | `string`              | `''`    | Extra hint classes (base `tw:mt-0`).                               |

| Member               | Description                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to switch `id` and label `for`.                                                                                |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                           |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to switch `aria-describedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic settings toggle

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormSwitch } from '@egose/shadcn-theme-ng/form-switch';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSwitch],
  template: `
    <form [formGroup]="form">
      <eg-form-switch controlName="notifications" label="Email notifications" hint="Toggle to subscribe." />
    </form>
  `,
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ notifications: [true] });
}
```

### 2. Required opt-in with error

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormSwitch } from '@egose/shadcn-theme-ng/form-switch';

@Component({
  selector: 'app-consent',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSwitch],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-switch controlName="consent" label="I accept the terms" [required]="true" error="Consent is required." />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class ConsentComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ consent: [false, Validators.requiredTrue] });
  submit() {
    console.log(this.form.value.consent);
  }
}
```

## Accessibility notes

- Label `for` ↔ switch `id` wiring is automatic via `effectiveId`; the switch also receives `aria-describedby` (error/hint id) — always pass a `label`.
- The required `*` is visual; pair with `Validators.requiredTrue` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `switchClass` / `labelClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance). The row layout (`flex items-center gap-1`) is fixed in the template.

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormSwitchConfig } from '@egose/shadcn-theme-ng/form-switch';

await bootstrapApplication(App, {
  providers: [provideEgFormSwitchConfig({ labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/switch` — raw `hlm-switch` for custom layouts.
- `@egose/shadcn-theme-ng/form-checkbox` — the checkbox counterpart (`eg-form-checkbox`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — `eg-form-field` used internally.
