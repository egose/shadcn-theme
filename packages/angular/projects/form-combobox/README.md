# Form Combobox (`@egose/shadcn-theme-ng/form-combobox`)

A ready-made reactive-form combobox: label + searchable dropdown + validation error/hint display in one tag. Supports `multiple` mode (chips anchor, `string[]` model, the default) and `single` mode (trigger button, `string | null` model).

The Angular implementation is a standalone wrapper: it renders `HlmFormField` / `HlmError` / `HlmHint` from `@egose/shadcn-theme-ng/form-field`, `HlmLabel`, and the `HlmCombobox*` parts from `@egose/shadcn-theme-ng/combobox` (`HlmComboboxMultiple` + chips for multi, `HlmCombobox` + trigger for single). The picker root is bound with `[formControlName]="controlName()"` (both brain variants implement `ControlValueAccessor`), so the parent `FormGroup` owns the value. It must live inside a `FormGroupDirective` (`[formGroup]` parent); ids come from `HlmFormIdGenerator` unless overridden.

> **Ships as:** `@egose/shadcn-theme-ng/form-combobox` and `@egose/shadcn-theme-ng-tw/form-combobox`
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
`@egose/shadcn-theme-ng/combobox`, `@egose/shadcn-theme-ng/form-field`, and
`@egose/shadcn-theme-ng/label`.

## Imports

Exported from the subpath root (`projects/form-combobox/src/public-api.ts`):

```ts
import { EgFormCombobox, provideEgFormComboboxConfig } from '@egose/shadcn-theme-ng/form-combobox';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-combobox'
```

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-combobox controlName="tags" label="Tags" [options]="tags" [required]="true" error="Pick at least one." />
</form>
```

Selector (from source): `eg-form-combobox` (standalone component, host `tw:w-full`).

## API reference

### `EgFormCombobox` — `eg-form-combobox`

| Input          | Type                     | Default                  | Description                                                                                                 |
| -------------- | ------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `controlName`  | `string`                 | `''`                     | `formControlName` key inside the parent `FormGroup`. **Required.**                                          |
| `mode`         | `'single' \| 'multiple'` | `'multiple'`             | `multiple` renders chips + multi-select (`string[]`); `single` renders a trigger button (`string \| null`). |
| `label`        | `string \| undefined`    | —                        | Label text (hidden when omitted).                                                                           |
| `error`        | `string \| undefined`    | —                        | Error text shown when invalid.                                                                              |
| `hint`         | `string \| undefined`    | —                        | Hint text shown otherwise.                                                                                  |
| `controlId`    | `string \| undefined`    | —                        | Explicit id (first priority for `effectiveId`).                                                             |
| `id`           | `string \| undefined`    | —                        | Fallback id (second priority).                                                                              |
| `placeholder`  | `string`                 | `'Pick…'`                | Search input placeholder.                                                                                   |
| `emptyText`    | `string`                 | `'Nothing left to add.'` | Text shown when no option matches.                                                                          |
| `disabled`     | `boolean`                | `false`                  | Locks interaction (form control stays enabled).                                                             |
| `required`     | `boolean`                | `false`                  | Shows a red `*` next to the label.                                                                          |
| `options`      | `string[]`               | `[]`                     | Rendered as `hlm-combobox-item` entries.                                                                    |
| `class`        | `ClassValue`             | `''`                     | Extra host classes (base `tw:w-full`).                                                                      |
| `labelClass`   | `string`                 | `''`                     | Extra label classes (base `tw:mb-1`).                                                                       |
| `controlClass` | `string`                 | `''`                     | Extra multi-root classes.                                                                                   |
| `chipsClass`   | `string`                 | `''`                     | Extra chips-anchor classes.                                                                                 |
| `errorClass`   | `string`                 | `''`                     | Extra error classes (base `tw:mt-0`).                                                                       |
| `hintClass`    | `string`                 | `''`                     | Extra hint classes (base `tw:mt-0`).                                                                        |

| Member               | Description                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| `effectiveId`        | `controlId() \|\| id() \|\| generated` — wired to chip-input `id` and label `for`. |
| `errorId` / `hintId` | `effectiveId + '-error' / '-hint'`.                                                |
| `selectedValues`     | Current selection read reactively from the brain model — drives chip rendering.    |

Requires a `[formGroup]` ancestor (injects `FormGroupDirective`, provides `ControlContainer → FormGroupDirective`).

## Examples

### 1. Required multi-select

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormCombobox } from '@egose/shadcn-theme-ng/form-combobox';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormCombobox],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-combobox controlName="tags" label="Tags" [options]="tags" [required]="true" error="Pick at least one." />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class TagsComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ tags: [<string[]>[], Validators.required] });
  readonly tags = ['Angular', 'React', 'Vue', 'Svelte'];
  submit() {
    console.log(this.form.value.tags);
  }
}
```

### 2. Preselected with hint

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EgFormCombobox } from '@egose/shadcn-theme-ng/form-combobox';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormCombobox],
  template: `
    <form [formGroup]="form">
      <eg-form-combobox
        controlName="stack"
        label="Stack"
        [options]="options"
        placeholder="Add tag…"
        hint="Type to filter, click to add, × to remove."
      />
    </form>
  `,
})
export class StackComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ stack: [['Angular']] });
  readonly options = ['Angular', 'React', 'Vue', 'Svelte', 'Solid'];
}
```

### 3. Single-select dropdown

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormCombobox } from '@egose/shadcn-theme-ng/form-combobox';

@Component({
  selector: 'app-fruit-single',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormCombobox],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-combobox
        controlName="fruit"
        label="Fruit"
        mode="single"
        [options]="options"
        placeholder="Select a fruit…"
        [required]="true"
        error="Fruit is required."
      />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class FruitSingleComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ fruit: [null as string | null, Validators.required] });
  readonly options = ['Apple', 'Banana', 'Cherry'];
  submit() {
    console.log(this.form.value.fruit);
  }
}
```

## Accessibility notes

- Label `for` ↔ chip-search-input `id` wiring is automatic via `effectiveId` — always pass a `label`.
- The chip search input exposes no `aria-describedby`, so error/hint ids render without an input-level link.
- The required `*` is visual; pair with `Validators.required` so assistive tech and validation agree.

## Theming / CSS variables

No component-specific CSS variables. Style per-instance via `class` / `labelClass` / `controlClass` / `chipsClass` / `errorClass` / `hintClass` (precedence: library base < global config < per-instance).

Global defaults per styling slot via the wrapper config:

```ts
import { provideEgFormComboboxConfig } from '@egose/shadcn-theme-ng/form-combobox';

await bootstrapApplication(App, {
  providers: [provideEgFormComboboxConfig({ labelClass: 'tw:font-medium' })],
});
```

The host keeps `tw:w-full`; constrain width with `class` or a wrapping container.

## Related subpaths

- `@egose/shadcn-theme-ng/combobox` — raw `HlmCombobox*` parts (single + multi) for custom layouts.
- `@egose/shadcn-theme-ng/form-autocomplete` — single-value text-search counterpart (`eg-form-autocomplete`).
- `@egose/shadcn-theme-ng/form-searchable-multiselect` — alternative multi-select with popover checkboxes.
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` used internally.
