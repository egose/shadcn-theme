# Form Radio Group (`@egose/shadcn-theme-ng/form-radio-group`)

A ready-made reactive-form radio field: group label + `hlm-radio-group` options + validation error/hint display in one tag.

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and `HlmRadioGroup` / `HlmRadio` / `HlmRadioIndicator` from `@egose/shadcn-theme-ng/radio-group`. The group is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the `string` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-radio-group` and `@egose/shadcn-theme-ng-tw/form-radio-group`
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
`@egose/shadcn-theme-ng/radio-group`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-radio-group/src/public-api.ts`):

```ts
import { EgFormRadioGroup, provideEgFormRadioGroupConfig } from '@egose/shadcn-theme-ng/form-radio-group';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-radio-group'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormRadioGroup } from '@egose/shadcn-theme-ng/form-radio-group';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormRadioGroup],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormRadioGroup` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

`ControlValueAccessor` behavior: `eg-form-radio-group` itself is not a `ControlValueAccessor`; the
inner `hlm-radio-group` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-radio-group controlName="plan" label="Plan" [options]="plans" [required]="true" error="Plan is required." />
</form>
```

Selector (from source): `eg-form-radio-group` (standalone component, host `tw:w-full`).

## API reference

### `EgFormRadioGroup` — `eg-form-radio-group`

| Input         | Type                            | Default | Description                                                                                                                                                                                      |
| ------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `controlName` | `string`                        | `''`    | `formControlName` key inside the parent `FormGroup`. **Required.**                                                                                                                               |
| `label`       | `string \| undefined`           | —       | Group label text (hidden when omitted).                                                                                                                                                          |
| `error`       | `string \| undefined`           | —       | Error text shown when invalid.                                                                                                                                                                   |
| `autoError`   | `boolean`                       | `true`  | Auto-resolve the message from the control's `ValidationErrors` when `error` is unset. Explicit `error` always wins; `error=""` counts as unset. Global wording via `provideEgFormErrorMessages`. |
| `hint`        | `string \| undefined`           | —       | Hint text shown otherwise.                                                                                                                                                                       |
| `controlId`   | `string \| undefined`           | —       | Explicit id prefix (first priority for `effectiveId`).                                                                                                                                           |
| `id`          | `string \| undefined`           | —       | Fallback id prefix (second priority).                                                                                                                                                            |
| `name`        | `string \| undefined`           | —       | Native group `name` (`controlName` wins when set).                                                                                                                                               |
| `disabled`    | `boolean`                       | `false` | Locks interaction (form control stays enabled).                                                                                                                                                  |
| `required`    | `boolean`                       | `false` | Shows a red `*` next to the label; forwarded to the group.                                                                                                                                       |
| `options`     | `{ value, label, disabled? }[]` | `[]`    | Rendered as labelled `hlm-radio` options.                                                                                                                                                        |
| `class`       | `ClassValue`                    | `''`    | Extra host classes (base `tw:w-full`).                                                                                                                                                           |
| `labelClass`  | `string`                        | `''`    | Extra group-label classes (base `tw:mb-1`).                                                                                                                                                      |
| `groupClass`  | `string`                        | `''`    | Extra group classes (base `tw:flex tw:flex-col tw:gap-2`).                                                                                                                                       |
| `errorClass`  | `string`                        | `''`    | Extra error classes (base `tw:mt-0`).                                                                                                                                                            |
| `hintClass`   | `string`                        | `''`    | Extra hint classes (base `tw:mt-0`).                                                                                                                                                             |

| Member               | Description                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — id prefix for `errorId` / `hintId`.                                                                                        |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                                 |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to each radio's `aria-describedby`. |

Each option renders inside a native `<label>`, so every radio is implicitly labelled by its option text. Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Basic required group

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormRadioGroup } from '@egose/shadcn-theme-ng/form-radio-group';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormRadioGroup],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-radio-group
        controlName="plan"
        label="Plan"
        [options]="plans"
        [required]="true"
        error="Plan is required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class PlanComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ plan: ['', Validators.required] });
  readonly plans = [
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ];
  submit() {
    console.log(this.form.value.plan);
  }
}
```

### 2. Hint + horizontal layout

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormRadioGroup } from '@egose/shadcn-theme-ng/form-radio-group';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormRadioGroup],
  template: `
    <form [formGroup]="form">
      <eg-form-radio-group
        controlName="cycle"
        label="Billing cycle"
        [options]="cycles"
        groupClass="tw:flex-row tw:gap-4"
        hint="Switch or cancel anytime."
      />
    </form>
  `,
})
export class BillingComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ cycle: ['monthly'] });
  readonly cycles = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];
}
```

## Accessibility notes

- Each radio is wrapped in a native `<label>` with its option text (implicit association), and receives `aria-describedby` (error/hint id) — the group label is visual.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `groupClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormRadioGroupConfig } from '@egose/shadcn-theme-ng/form-radio-group';

await bootstrapApplication(App, {
  providers: [provideEgFormRadioGroupConfig({ groupClass: 'tw:gap-3', labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/radio-group` — raw `hlm-radio-group` / `hlm-radio` / `hlm-radio-indicator` for custom layouts.
- `@egose/shadcn-theme-ng/form-select` — single-choice alternative with a popover (`eg-form-select`).
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — alternative minimal wrapper when you compose controls by hand.
