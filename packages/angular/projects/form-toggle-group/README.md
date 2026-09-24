# Form Toggle Group (`@egose/shadcn-theme-ng/form-toggle-group`)

A ready-made reactive-form option group: label + `hlm-toggle-group` buttons + validation error/hint display in one tag. For single- or multi-select button groups (alignment, view modes, formatting).

The Angular implementation is a standalone wrapper: it renders `EgFormField` from `@egose/shadcn-theme-ng/form-field-simple` (like `eg-form-checkbox`, because `hlm-toggle-group` exposes no `BrnFieldControl`), `HlmError` / `HlmHint`, `HlmLabel`, and `HlmToggleGroup` / `HlmToggleGroupItem` from `@egose/shadcn-theme-ng/toggle-group`. The group is bound with `[formControlName]="controlName()"`, so the parent `FormGroup` owns the `string | string[]` value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-toggle-group` and `@egose/shadcn-theme-ng-tw/form-toggle-group`
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
`@egose/shadcn-theme-ng/toggle-group`, `@egose/shadcn-theme-ng/toggle`, `@egose/shadcn-theme-ng/form-field`,
`@egose/shadcn-theme-ng/form-field-simple`, and `@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-toggle-group/src/public-api.ts`):

```ts
import { EgFormToggleGroup, provideEgFormToggleGroupConfig } from '@egose/shadcn-theme-ng/form-toggle-group';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-toggle-group'
```

`ControlValueAccessor` behavior: `eg-form-toggle-group` itself is not a `ControlValueAccessor`; the
inner `hlm-toggle-group` is (bound via `formControlName`), so `formControlName`/`formGroup` handling,
`Validators`, and `disabled` state from the control all flow through the parent form.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-toggle-group controlName="align" label="Align" [options]="options" [required]="true" error="Pick one." />
</form>
```

Selector (from source): `eg-form-toggle-group` (standalone component, host `tw:w-full`).

## API reference

### `EgFormToggleGroup` — `eg-form-toggle-group`

| Input         | Type                            | Default     | Description                                                        |
| ------------- | ------------------------------- | ----------- | ------------------------------------------------------------------ |
| `controlName` | `string`                        | `''`        | `formControlName` key inside the parent `FormGroup`. **Required.** |
| `label`       | `string \| undefined`           | —           | Group label text (hidden when omitted).                            |
| `error`       | `string \| undefined`           | —           | Error text shown when invalid.                                     |
| `hint`        | `string \| undefined`           | —           | Hint text shown otherwise.                                         |
| `controlId`   | `string \| undefined`           | —           | Explicit id prefix (first priority for `effectiveId`).             |
| `id`          | `string \| undefined`           | —           | Fallback id prefix (second priority).                              |
| `type`        | `'single' \| 'multiple'`        | `'single'`  | Selection mode forwarded to the group.                             |
| `disabled`    | `boolean`                       | `false`     | Locks interaction (form control stays enabled).                    |
| `required`    | `boolean`                       | `false`     | Shows a red `*` next to the label.                                 |
| `variant`     | toggle variant                  | `'default'` | Variant forwarded to the group.                                    |
| `size`        | toggle size                     | `'default'` | Size forwarded to the group.                                       |
| `options`     | `{ value, label, disabled? }[]` | `[]`        | Rendered as `hlmToggleGroupItem` buttons.                          |
| `class`       | `ClassValue`                    | `''`        | Extra host classes (base `tw:w-full`).                             |
| `labelClass`  | `string`                        | `''`        | Extra group-label classes (base `tw:mb-1`).                        |
| `groupClass`  | `string`                        | `''`        | Extra group classes.                                               |
| `errorClass`  | `string`                        | `''`        | Extra error classes (base `tw:mt-0`).                              |
| `hintClass`   | `string`                        | `''`        | Extra hint classes (base `tw:mt-0`).                               |

| Member               | Description                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — id prefix for `errorId` / `hintId`.                                                                                       |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                                                                                                |
| `describedBy()`      | `errorId` when `error()` is set and control is invalid + dirty/touched, else `hintId` when `hint()` is set, else `null` — wired to each item's `aria-describedby`. |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Single-select alignment

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormToggleGroup } from '@egose/shadcn-theme-ng/form-toggle-group';

@Component({
  selector: 'app-align',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormToggleGroup],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-toggle-group controlName="align" label="Align" [options]="options" [required]="true" error="Pick one." />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class AlignComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ align: ['', Validators.required] });
  readonly options = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];
  submit() {
    console.log(this.form.value.align);
  }
}
```

### 2. Multi-select formats

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormToggleGroup } from '@egose/shadcn-theme-ng/form-toggle-group';

@Component({
  selector: 'app-format-group',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormToggleGroup],
  template: `
    <form [formGroup]="form">
      <eg-form-toggle-group
        controlName="formats"
        label="Formats"
        type="multiple"
        [options]="options"
        hint="Combine as needed."
      />
    </form>
  `,
})
export class FormatGroupComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ formats: [<string[]>[]] });
  readonly options = [
    { value: 'bold', label: 'Bold' },
    { value: 'italic', label: 'Italic' },
    { value: 'underline', label: 'Underline' },
  ];
}
```

## Accessibility notes

- The group label is visual; each item carries its option text and `aria-describedby` (error/hint id).
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `groupClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance); `variant` / `size` drive the button look.

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormToggleGroupConfig } from '@egose/shadcn-theme-ng/form-toggle-group';

await bootstrapApplication(App, {
  providers: [provideEgFormToggleGroupConfig({ labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/toggle-group` — raw `hlm-toggle-group` / `hlmToggleGroupItem` for custom layouts.
- `@egose/shadcn-theme-ng/toggle` — raw `hlmToggle` directive.
- `@egose/shadcn-theme-ng/form-toggle` — the single boolean toggle (`eg-form-toggle`).
- `@egose/shadcn-theme-ng/form-radio-group` — single-choice alternative with radios.
- `@egose/shadcn-theme-ng/form-field` — `hlm-error` / `hlm-hint` used internally.
- `@egose/shadcn-theme-ng/form-field-simple` — `eg-form-field` used internally.
