# Form Toggle (`@egose/shadcn-theme-ng/form-toggle`)

A ready-made reactive-form boolean field: toggle button + label + validation error/hint display in one tag. For on/off settings where a button-style toggle fits better than a switch or checkbox.

The Angular implementation is a standalone wrapper: it renders `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and a `button[hlmToggle]` from `@egose/shadcn-theme-ng/toggle`.

> **Structural note:** unlike the other `eg-form-*` wrappers, the toggle itself is the
> `ControlValueAccessor` (`BrnToggle` exposes no CVA, speaking `'on'`/`'off'` strings while the
> form model stays `boolean`). Bind `formControlName` **directly on this element** instead of
> using a `controlName` input:
>
> ```html
> <eg-form-toggle formControlName="bold" label="Bold" />
> ```

> **Ships as:** `@egose/shadcn-theme-ng/form-toggle` and `@egose/shadcn-theme-ng-tw/form-toggle`
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
`@egose/shadcn-theme-ng/toggle`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-toggle/src/public-api.ts`):

```ts
import { EgFormToggle, provideEgFormToggleConfig } from '@egose/shadcn-theme-ng/form-toggle';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-toggle'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormToggle } from '@egose/shadcn-theme-ng/form-toggle';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormToggle` (and `ReactiveFormsModule`) to the module's
`imports` — it is a standalone component, not a module.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-toggle formControlName="bold" label="Bold" hint="Toggle rich-text formatting." />
</form>
```

Selector (from source): `eg-form-toggle` (standalone component, host `tw:w-full`).

## API reference

### `EgFormToggle` — `eg-form-toggle`

Bind `formControlName` on the element; there is no `controlName` input.

| Input         | Type                        | Default     | Description                                         |
| ------------- | --------------------------- | ----------- | --------------------------------------------------- |
| `label`       | `string \| undefined`       | —           | Label text beside the toggle (hidden when omitted). |
| `error`       | `string \| undefined`       | —           | Error text shown when invalid.                      |
| `hint`        | `string \| undefined`       | —           | Hint text shown otherwise.                          |
| `controlId`   | `string \| undefined`       | —           | Explicit id (first priority for `effectiveId`).     |
| `id`          | `string \| undefined`       | —           | Fallback id (second priority).                      |
| `disabled`    | `boolean`                   | `false`     | Locks interaction (form control stays enabled).     |
| `required`    | `boolean`                   | `false`     | Shows a red `*` next to the label.                  |
| `variant`     | `'default' \| 'outline'`    | `'default'` | Toggle variant forwarded to `hlmToggle`.            |
| `size`        | `'default' \| 'sm' \| 'lg'` | `'default'` | Toggle size forwarded to `hlmToggle`.               |
| `class`       | `ClassValue`                | `''`        | Extra host classes (base `tw:w-full`).              |
| `toggleClass` | `string`                    | `''`        | Extra toggle-button classes.                        |
| `labelClass`  | `string`                    | `''`        | Extra label classes.                                |
| `errorClass`  | `string`                    | `''`        | Extra error classes (base `tw:mt-0`).               |
| `hintClass`   | `string`                    | `''`        | Extra hint classes (base `tw:mt-0`).                |

| Member               | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to button `id` and label `for`. |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                            |

Requires a `[formGroup]` ancestor (or a standalone `formControl` binding).

## Examples

### 1. Text-formatting toggles

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormToggle } from '@egose/shadcn-theme-ng/form-toggle';

@Component({
  selector: 'app-format',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `
    <form [formGroup]="form" class="tw:flex tw:gap-4">
      <eg-form-toggle formControlName="bold" label="Bold" />
      <eg-form-toggle formControlName="italic" label="Italic" />
    </form>
  `,
})
export class FormatComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ bold: [false], italic: [false] });
}
```

### 2. Required opt-in with error

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormToggle } from '@egose/shadcn-theme-ng/form-toggle';

@Component({
  selector: 'app-consent-toggle',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormToggle],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-toggle
        formControlName="consent"
        label="I accept the terms"
        [required]="true"
        error="Consent is required."
      />
      <button type="submit" [disabled]="form.invalid">Continue</button>
    </form>
  `,
})
export class ConsentToggleComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ consent: [false, Validators.requiredTrue] });
  submit() {
    console.log(this.form.value.consent);
  }
}
```

## Accessibility notes

- Label `for` ↔ button `id` wiring is automatic via `effectiveId` — always pass a `label`.
- The required `*` is visual; pair with `Validators.requiredTrue` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `toggleClass` / `labelClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance). The row layout (`flex items-center gap-1`) is fixed in the template.

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormToggleConfig } from '@egose/shadcn-theme-ng/form-toggle';

await bootstrapApplication(App, {
  providers: [provideEgFormToggleConfig({ labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/toggle` — raw `hlmToggle` directive for custom layouts.
- `@egose/shadcn-theme-ng/form-toggle-group` — multi-option button group (`eg-form-toggle-group`).
- `@egose/shadcn-theme-ng/form-switch` / `@egose/shadcn-theme-ng/form-checkbox` — boolean alternatives.
- `@egose/shadcn-theme-ng/form-field` — `hlm-error` / `hlm-hint` used internally.
