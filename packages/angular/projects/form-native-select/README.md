# Form Native Select (`@egose/shadcn-theme-ng/form-native-select`)

A ready-made reactive-form select field using the platform `<select>`: label + `hlm-native-select` + validation error/hint display in one tag. Prefer `eg-form-select` for the popover experience; use this where a native control is required (mobile, no-JS fallbacks, minimal bundles).

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and `HlmNativeSelect` from `@egose/shadcn-theme-ng/native-select`. The inner select is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the `string` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-native-select` and `@egose/shadcn-theme-ng-tw/form-native-select`
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
`@egose/shadcn-theme-ng/native-select`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-native-select/src/public-api.ts`):

```ts
import { EgFormNativeSelect, provideEgFormNativeSelectConfig } from '@egose/shadcn-theme-ng/form-native-select';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-native-select'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormNativeSelect } from '@egose/shadcn-theme-ng/form-native-select';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormNativeSelect],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormNativeSelect` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-native-select` itself is not a `ControlValueAccessor`; the
inner `hlm-native-select` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-native-select
    controlName="country"
    label="Country"
    [options]="countries"
    [required]="true"
    error="Country is required."
  />
</form>
```

Selector (from source): `eg-form-native-select` (standalone component, host `tw:w-full`).

## API reference

### `EgFormNativeSelect` — `eg-form-native-select`

| Input         | Type                            | Default | Description                                                                                                                                                                                      |
| ------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `controlName` | `string`                        | `''`    | `formControlName` key inside the parent `FormGroup`. **Required.**                                                                                                                               |
| `label`       | `string \| undefined`           | —       | Label text (hidden when omitted).                                                                                                                                                                |
| `error`       | `string \| undefined`           | —       | Error text shown when invalid.                                                                                                                                                                   |
| `autoError`   | `boolean`                       | `true`  | Auto-resolve the message from the control's `ValidationErrors` when `error` is unset. Explicit `error` always wins; `error=""` counts as unset. Global wording via `provideEgFormErrorMessages`. |
| `hint`        | `string \| undefined`           | —       | Hint text shown otherwise.                                                                                                                                                                       |
| `controlId`   | `string \| undefined`           | —       | Explicit id (first priority for `effectiveId`).                                                                                                                                                  |
| `id`          | `string \| undefined`           | —       | Fallback id (second priority).                                                                                                                                                                   |
| `name`        | `string \| undefined`           | —       | Native `name` forwarded to the inner `<select>` (`controlName` wins).                                                                                                                            |
| `disabled`    | `boolean`                       | `false` | Locks interaction (form control stays enabled).                                                                                                                                                  |
| `required`    | `boolean`                       | `false` | Shows a red `*` next to the label.                                                                                                                                                               |
| `options`     | `{ value, label, disabled? }[]` | `[]`    | Rendered as native `<option>` elements.                                                                                                                                                          |
| `class`       | `ClassValue`                    | `''`    | Extra host classes (base `tw:w-full`).                                                                                                                                                           |
| `labelClass`  | `string`                        | `''`    | Extra label classes (base `tw:mb-1 tw:gap-0`).                                                                                                                                                   |
| `selectClass` | `string`                        | `''`    | Extra inner-select classes, merged into `HlmNativeSelect.selectClass`.                                                                                                                           |
| `errorClass`  | `string`                        | `''`    | Extra error classes (base `tw:mt-0`).                                                                                                                                                            |
| `hintClass`   | `string`                        | `''`    | Extra hint classes (base `tw:mt-0`).                                                                                                                                                             |

| Member               | Description                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to select `selectId` and label `for`.                                                                         |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                          |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to select `ariaDescribedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic required select

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormNativeSelect } from '@egose/shadcn-theme-ng/form-native-select';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormNativeSelect],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-native-select
        controlName="country"
        label="Country"
        [options]="countries"
        [required]="true"
        error="Country is required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class CountryComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ country: ['', Validators.required] });
  readonly countries = [
    { value: '', label: 'Select…' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];
  submit() {
    console.log(this.form.value.country);
  }
}
```

### 2. Hint + custom styling

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormNativeSelect } from '@egose/shadcn-theme-ng/form-native-select';

@Component({
  selector: 'app-locale',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormNativeSelect],
  template: `
    <form [formGroup]="form">
      <eg-form-native-select
        controlName="locale"
        label="Language"
        [options]="locales"
        selectClass="tw:text-lg"
        hint="Used for emails and invoices."
      />
    </form>
  `,
})
export class LocaleComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ locale: ['en'] });
  readonly locales = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
  ];
}
```

## Accessibility notes

- Label `for` ↔ select `selectId` wiring is automatic via `effectiveId`; the select also receives `name` and `ariaDescribedby` (error/hint id) — always pass a `label`.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.
- Native `<select>` brings platform keyboard/screen-reader behavior for free.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `selectClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormNativeSelectConfig } from '@egose/shadcn-theme-ng/form-native-select';

await bootstrapApplication(App, {
  providers: [provideEgFormNativeSelectConfig({ selectClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` (e.g. `tw:max-w-xs`) or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/native-select` — raw `hlm-native-select` for custom layouts.
- `@egose/shadcn-theme-ng/form-select` — the popover-based counterpart (`eg-form-select`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose controls by hand.
