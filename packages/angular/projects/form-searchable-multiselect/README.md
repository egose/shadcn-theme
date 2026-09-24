# Form Searchable Multiselect (`@egose/shadcn-theme-ng/form-searchable-multiselect`)

`EgFormSearchableMultiselect` is a reactive-forms wrapper that pairs a label, a searchable multi-select popover, and error/hint text into a single form-ready row. It is the shadcn/ui equivalent of a _Form + Combobox (multiple)_ composition: the selection UI itself comes from `EgSearchableMultiselect` (`@egose/shadcn-theme-ng/searchable-multiselect`, a `ControlValueAccessor` built on the popover + checkbox primitives), while this wrapper supplies the surrounding `eg-form-field` layout, generated ids, and `aria-describedby` wiring.

> **Ships as:** `@egose/shadcn-theme-ng/form-searchable-multiselect` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/form-searchable-multiselect` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, CDK, `@spartan-ng/brain`, `rxjs`, `@ng-icons/core`) are resolved from the versions documented in the [package README](../../README.md#peer-dependencies). Import the subpath — no extra install step per component:

```ts
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';
// tw variant:
// import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng-tw/form-searchable-multiselect';
```

## Imports

The public API (`src/public-api.ts`) exports exactly one symbol — the standalone component. There is no `*Imports` array and no `*Module` for this subpath; import the component class directly.

```ts
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form">
      <eg-form-searchable-multiselect controlName="tags" label="Tags" [options]="tagOptions" />
    </form>
  `,
})
export class MyForm {}
```

Requirements:

- The component **must** sit inside a `<form [formGroup]>` (or any `FormGroupDirective` ancestor). It injects `FormGroupDirective` and provides `ControlContainer`, so `controlName` resolves against the parent group.
- `controlName` is required — it is forwarded as `[formControlName]` to the inner `eg-searchable-multiselect`.
- The bound `FormControl` should hold a `string[]` (e.g. `new FormControl<string[]>([], { nonNullable: true })`).

## Anatomy / Structure

```html
<eg-form-searchable-multiselect
  controlName="tags"
  label="Tags"
  error="Pick at least one tag"
  hint="Choose all that apply"
>
  <!-- rendered internally -->
  <eg-form-field>
    <label hlmLabel for="<effectiveId>">Tags <span>*</span></label>
    <eg-searchable-multiselect
      id="<effectiveId>"
      [options]="[{ label, value }]"
      placeholder="Start typing to add…"
      formControlName="tags"
    ></eg-searchable-multiselect>
    <hlm-error id="<effectiveId>-error">…</hlm-error>
    <hlm-hint id="<effectiveId>-hint">…</hlm-hint>
  </eg-form-field>
</eg-form-searchable-multiselect>
```

Real selectors involved: `eg-form-searchable-multiselect` (this wrapper), `eg-form-field` (`@egose/shadcn-theme-ng/form-field-simple`), `label[hlmLabel]`, `eg-searchable-multiselect`, `hlm-error` / `hlm-hint` (`@egose/shadcn-theme-ng/form-field`).

## API reference

### `eg-form-searchable-multiselect` — `EgFormSearchableMultiselect`

| Input                 | Type                  | Default                  | Description                                                                                         |
| --------------------- | --------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| `label`               | `string \| undefined` | `undefined`              | Field label. When set, a `<label hlmLabel>` bound to the control id is rendered.                    |
| `controlName`         | `string`              | `''`                     | **Required.** Name of the control in the parent `FormGroup`; forwarded as `formControlName`.        |
| `controlId`           | `string \| undefined` | `undefined`              | Explicit control id. Falls back to `id`, then to a generated `eg-form-searchable-multiselect-…` id. |
| `id`                  | `string \| undefined` | `undefined`              | Alias for an explicit control id (same fallback chain as `controlId`).                              |
| `error`               | `string \| undefined` | `undefined`              | Error text rendered in `<hlm-error>`.                                                               |
| `hint`                | `string \| undefined` | `undefined`              | Hint text rendered in `<hlm-hint>`.                                                                 |
| `placeholder`         | `string`              | `'Start typing to add…'` | Placeholder forwarded to the inner multiselect.                                                     |
| `disabled`            | `boolean`             | `false`                  | Wrapper-level disable, forwarded as `wrapperDisabled` to the inner multiselect.                     |
| `required`            | `boolean`             | `false`                  | Adds `required` to the inner control and renders a red `*` next to the label.                       |
| `options`             | `SelectOption[]`      | `[]`                     | `{ label: string; value: string }[]` forwarded to the inner multiselect.                            |
| `class` (`userClass`) | `ClassValue`          | `''`                     | Extra classes for the host (merged over `tw:w-full`).                                               |
| `labelClass`          | `string`              | `''`                     | Extra classes for the `<label>` (merged over `tw:mb-1 tw:gap-0`).                                   |
| `controlClass`        | `string`              | `''`                     | Extra classes for the inner multiselect (merged over `tw:w-full`).                                  |
| `errorClass`          | `string`              | `''`                     | Extra classes for `<hlm-error>` (merged over `tw:mt-0`).                                            |
| `hintClass`           | `string`              | `''`                     | Extra classes for `<hlm-hint>` (merged over `tw:mt-0`).                                             |

No outputs. Readonly computeds/methods (usable via template ref): `effectiveId()`, `errorId()` (`<id>-error`), `hintId()` (`<id>-hint`), `describedBy(): string | null` (returns the error id when the control is invalid + dirty/touched, else the hint id, else `null`).

`SelectOption` is `export interface SelectOption { label: string; value: string }` from `@egose/shadcn-theme-ng/searchable-multiselect`.

## Examples

### 1. Basic reactive form

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <eg-form-searchable-multiselect controlName="tags" label="Tags" [options]="tagOptions" />
      <button type="submit">Save</button>
    </form>
  `,
})
export class BasicExample {
  readonly form = new FormGroup({
    tags: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly tagOptions = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ];

  save() {
    console.log(this.form.value.tags); // e.g. ['angular', 'vue']
  }
}
```

### 2. Required field with validation error

The `error` string is always rendered when provided; `aria-describedby` flips from the hint id to the error id once the control is invalid and dirty/touched.

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form">
      <eg-form-searchable-multiselect
        controlName="skills"
        label="Skills"
        [options]="skillOptions"
        error="Pick at least one skill"
        hint="Choose all that apply"
        required
      />
    </form>
  `,
})
export class RequiredExample {
  readonly form = new FormGroup({
    skills: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
  });
  readonly skillOptions = [
    { value: 'ts', label: 'TypeScript' },
    { value: 'a11y', label: 'Accessibility' },
    { value: 'testing', label: 'Testing' },
  ];
}
```

### 3. Disabled states (wrapper input vs reactive disable)

```ts
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form">
      <!-- static wrapper disable -->
      <eg-form-searchable-multiselect
        controlName="tags"
        label="Tags (locked)"
        [options]="tagOptions"
        [disabled]="true"
      />
      <!-- reactive disable driven by a signal -->
      <eg-form-searchable-multiselect
        controlName="extras"
        label="Extras"
        [options]="tagOptions"
        [disabled]="locked()"
      />
      <button type="button" (click)="toggle()">Toggle extras</button>
    </form>
  `,
})
export class DisabledExample {
  readonly form = new FormGroup({
    tags: new FormControl<string[]>(['angular'], { nonNullable: true }),
    extras: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly tagOptions = [{ value: 'angular', label: 'Angular' }];
  readonly locked = signal(true);

  toggle() {
    this.locked.update((v) => !v);
  }

  disableViaFormApi() {
    this.form.controls.extras.disable(); // also disables the trigger (inner CVA)
  }
}
```

### 4. Custom ids, placeholder, and styling hooks

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form">
      <eg-form-searchable-multiselect
        controlName="frameworks"
        controlId="framework-picker"
        label="Frameworks"
        placeholder="Search frameworks…"
        hint="Type to filter, Enter to add"
        [options]="frameworks"
        class="tw:max-w-md"
        labelClass="tw:font-semibold"
        controlClass="tw:min-h-11"
      />
    </form>
  `,
})
export class StyledExample {
  readonly form = new FormGroup({
    frameworks: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly frameworks = [
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid' },
  ];
}
```

### 5. Async options (server-driven list)

```ts
import { Component, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form">
      <eg-form-searchable-multiselect
        controlName="projects"
        label="Projects"
        [options]="projectOptions.value() ?? []"
        [placeholder]="projectOptions.isLoading() ? 'Loading projects…' : 'Start typing to add…'"
        [disabled]="projectOptions.isLoading()"
        hint="Options load from the server"
      />
    </form>
  `,
})
export class AsyncExample {
  private readonly http = inject(HttpClient);
  readonly form = new FormGroup({
    projects: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly projectOptions = resource({
    loader: () => this.http.get<{ label: string; value: string }[]>('/api/projects').toPromise(),
  });
}
```

### 6. Programmatic control (preselect, reset, submit gating)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormSearchableMultiselect } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSearchableMultiselect],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-searchable-multiselect
        #tagsField
        controlName="tags"
        label="Tags"
        [options]="tagOptions"
        error="Pick at least one tag"
      />
      <div class="tw:flex tw:gap-2">
        <button type="button" (click)="preselect()">Select all</button>
        <button type="button" (click)="form.controls.tags.reset()">Clear</button>
        <button type="submit" [disabled]="form.invalid">Submit ({{ form.value.tags?.length ?? 0 }})</button>
      </div>
      <p>Control id: {{ tagsField.effectiveId() }}</p>
    </form>
  `,
})
export class ProgrammaticExample {
  readonly form = new FormGroup({
    tags: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
  });
  readonly tagOptions = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
  ];

  preselect() {
    this.form.controls.tags.setValue(this.tagOptions.map((o) => o.value));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.getRawValue());
  }
}
```

## Accessibility notes

- The `<label hlmLabel [for]="effectiveId()">` is bound to the inner multiselect trigger id, so clicking the label focuses/opens the control.
- `aria-describedby` points at the error element only when the control is invalid and dirty/touched; otherwise it points at the hint element (or is absent). Keep `error`/`hint` text concise and unique per field.
- The inner `eg-searchable-multiselect` renders a real `<button>` trigger plus checkbox options; keyboard users open with Enter/Space and pick with the checkbox semantics. The `required` input adds a visual `*` — also add `Validators.required` so assistive tech gets the invalid state.
- `ariaLabel` on the inner control falls back to the visible label; pass an explicit `controlId` when several multiselects share a page to keep ids stable for tests.

## Theming / CSS variables

No component-specific CSS variables; styling flows through the shared theme tokens (`--radius`, `--popover`, `--ring`, …) consumed by the inner popover/checkbox classes. Use `class` / `labelClass` / `controlClass` / `errorClass` / `hintClass` to append utilities.

Global defaults per styling slot via the wrapper config (precedence: library base < global config < per-instance):

```ts
import { provideEgFormSearchableMultiselectConfig } from '@egose/shadcn-theme-ng/form-searchable-multiselect';

await bootstrapApplication(App, {
  providers: [provideEgFormSearchableMultiselectConfig({ controlClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/searchable-multiselect` — the underlying `EgSearchableMultiselect` + `SelectOption` (use it directly for template-driven or non-form usage).
- `@egose/shadcn-theme-ng/form-field-simple` — `EgFormField` layout used internally.
- `@egose/shadcn-theme-ng/form-field` — `HlmError`, `HlmHint`, `HlmFormIdGenerator`.
- `@egose/shadcn-theme-ng/label` — `HlmLabel`.
