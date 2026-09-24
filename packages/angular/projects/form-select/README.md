# Form Select (`@egose/shadcn-theme-ng/form-select`)

`EgFormSelect` is a reactive-forms wrapper around the shadcn/ui _Select_ composition (spartan-ng `BrnSelect` + `HlmSelect` parts). It renders a label, a single- or multi-select dropdown bound with `formControlName`, and error/hint text — the Angular equivalent of shadcn/ui's `<FormField> + <Select>` pattern for picking one option (or many) from a list.

> **Ships as:** `@egose/shadcn-theme-ng/form-select` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/form-select` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies). This subpath additionally pulls in `@egose/shadcn-theme-ng/select` at build time (already re-exported through the select subpath — no extra install needed).

```ts
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';
// tw variant:
// import { EgFormSelect } from '@egose/shadcn-theme-ng-tw/form-select';
```

## Imports

The public API (`src/public-api.ts`) exports exactly one symbol — the standalone component. There is no `*Imports` array and no `*Module` for this subpath; import the component class directly.

```ts
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form">
      <eg-form-select controlName="country" label="Country" [options]="countries" placeholder="Select…" />
    </form>
  `,
})
export class MyForm {}
```

Requirements:

- Must sit inside a `<form [formGroup]>` (it injects `FormGroupDirective` and provides `ControlContainer`).
- `controlName` is required — forwarded as `[formControlName]` to the inner `brn-select` / `brn-select-multiple`.
- Single mode binds `string`; multi mode (`multiple`) binds `string[]`.

## Anatomy / Structure

```html
<eg-form-select controlName="country" label="Country" [options]="countries">
  <!-- rendered internally (single mode) -->
  <hlm-form-field>
    <label hlmLabel for="<effectiveId>">Country <span>*</span></label>
    <brn-select hlmSelect formControlName="country">
      <hlm-select-trigger buttonId="<effectiveId>" ariaDescribedby="…">
        <hlm-select-value placeholder="Select…" />
      </hlm-select-trigger>
      <hlm-select-content>
        <hlm-select-label>Fruits</hlm-select-label>
        <hlm-select-item value="apple">Apple</hlm-select-item>
      </hlm-select-content>
    </brn-select>
    <hlm-error id="<effectiveId>-error">…</hlm-error>
    <hlm-hint id="<effectiveId>-hint">…</hlm-hint>
  </hlm-form-field>
</eg-form-select>
```

In multi mode the inner `brn-select` becomes `brn-select-multiple`; everything else is identical. Real selectors: `eg-form-select`, `hlm-form-field`, `label[hlmLabel]`, `brn-select[hlmSelect]` / `brn-select-multiple[hlmSelect]`, `hlm-select-trigger`, `hlm-select-value`, `hlm-select-content`, `hlm-select-label`, `hlm-select-item`, `hlm-error`, `hlm-hint`.

## API reference

### `eg-form-select` — `EgFormSelect`

| Input                 | Type                  | Default     | Description                                                                                               |
| --------------------- | --------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `label`               | `string \| undefined` | `undefined` | Field label rendered as `<label hlmLabel>` bound to the trigger button id.                                |
| `controlName`         | `string`              | `''`        | **Required.** Control name in the parent `FormGroup`; forwarded as `formControlName`.                     |
| `controlId`           | `string \| undefined` | `undefined` | Explicit id; falls back to `id`, then generated `eg-form-select-…`.                                       |
| `id`                  | `string \| undefined` | `undefined` | Alias for an explicit id (same fallback chain). Forwarded as `buttonId` to the select trigger.            |
| `error`               | `string \| undefined` | `undefined` | Error text rendered in `<hlm-error>`.                                                                     |
| `hint`                | `string \| undefined` | `undefined` | Hint text rendered in `<hlm-hint>`.                                                                       |
| `placeholder`         | `string`              | `''`        | Placeholder forwarded to `<hlm-select-value>`.                                                            |
| `disabled`            | `boolean`             | `false`     | Forwarded as `wrapperDisabled` to `<hlm-select-trigger>`.                                                 |
| `required`            | `boolean`             | `false`     | Renders a red `*` next to the label (pair with `Validators.required`).                                    |
| `multiple`            | `boolean`             | `false`     | When `true`, renders `brn-select-multiple` (value is `string[]`).                                         |
| `options`             | `SelectOption[]`      | `[]`        | `{ value: string; label: string }[]` rendered as `<hlm-select-item>` rows. Local interface, not exported. |
| `optionsLabel`        | `string \| undefined` | `undefined` | Optional group heading rendered once as `<hlm-select-label>`.                                             |
| `class` (`userClass`) | `ClassValue`          | `''`        | Extra host classes (merged over `tw:flex tw:flex-col`).                                                   |
| `labelClass`          | `string`              | `''`        | Extra label classes (merged over `tw:mb-1 tw:gap-0`).                                                     |
| `selectClass`         | `string`              | `''`        | Extra trigger classes (merged over `tw:w-full`).                                                          |
| `errorClass`          | `string`              | `''`        | Extra error classes (merged over `tw:mt-0`).                                                              |
| `hintClass`           | `string`              | `''`        | Extra hint classes (merged over `tw:mt-0`).                                                               |

No outputs. Readonly computeds/methods: `effectiveId()`, `errorId()`, `hintId()`, `describedBy(): string | null` (error id when invalid + dirty/touched, else hint id, else `null`).

## Examples

### 1. Basic single select

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <eg-form-select controlName="fruit" label="Fruit" placeholder="Select a fruit" [options]="fruits" />
      <button type="submit">Save</button>
    </form>
  `,
})
export class BasicExample {
  readonly form = new FormGroup({
    fruit: new FormControl<string>('', { nonNullable: true }),
  });
  readonly fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  save() {
    console.log(this.form.value.fruit); // e.g. 'banana'
  }
}
```

### 2. Grouped options with `optionsLabel`

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form">
      <eg-form-select
        controlName="city"
        label="City"
        placeholder="Select a city"
        optionsLabel="Germany"
        [options]="cities"
        hint="Grouped under one heading"
      />
    </form>
  `,
})
export class GroupedExample {
  readonly form = new FormGroup({
    city: new FormControl<string>('', { nonNullable: true }),
  });
  readonly cities = [
    { value: 'berlin', label: 'Berlin' },
    { value: 'munich', label: 'Munich' },
    { value: 'hamburg', label: 'Hamburg' },
  ];
}
```

> Note: `optionsLabel` renders a single `<hlm-select-label>` heading above all options. For multiple groups, use the raw `HlmSelect*` parts from `@egose/shadcn-theme-ng/select` instead.

### 3. Multi-select (`multiple`)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form">
      <eg-form-select
        controlName="toppings"
        label="Toppings"
        placeholder="Pick toppings"
        [multiple]="true"
        [options]="toppings"
        hint="Hold Ctrl/Cmd or tap to toggle several"
      />
      <p>Selected: {{ form.value.toppings?.join(', ') || 'none' }}</p>
    </form>
  `,
})
export class MultiExample {
  readonly form = new FormGroup({
    toppings: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly toppings = [
    { value: 'cheese', label: 'Extra cheese' },
    { value: 'mushrooms', label: 'Mushrooms' },
    { value: 'olives', label: 'Olives' },
  ];
}
```

### 4. Required + validation error

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-select
        controlName="country"
        label="Country"
        placeholder="Select a country"
        [options]="countries"
        error="Country is required"
        required
      />
      <button type="submit">Continue</button>
    </form>
  `,
})
export class RequiredExample {
  readonly form = new FormGroup({
    country: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });
  readonly countries = [
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // reveals the <hlm-error>
      return;
    }
  }
}
```

### 5. Disabled + empty-options state

```ts
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form">
      <eg-form-select
        controlName="plan"
        label="Plan"
        placeholder="Select a plan"
        [options]="plans()"
        [disabled]="loading()"
        hint="Options arrive asynchronously"
      />
      <button type="button" (click)="load()">Load plans</button>
    </form>
  `,
})
export class DisabledExample {
  readonly form = new FormGroup({
    plan: new FormControl<string>('', { nonNullable: true }),
  });
  readonly loading = signal(true);
  readonly plans = signal<{ value: string; label: string }[]>([]);

  load() {
    setTimeout(() => {
      this.plans.set([
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
      ]);
      this.loading.set(false);
    }, 800);
  }
}
```

### 6. Programmatic control + custom ids/classes

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSelect } from '@egose/shadcn-theme-ng/form-select';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormSelect],
  template: `
    <form [formGroup]="form">
      <eg-form-select
        #roleField
        controlName="role"
        controlId="user-role"
        label="Role"
        placeholder="Select a role"
        [options]="roles"
        class="tw:max-w-sm"
        selectClass="tw:h-11"
      />
      <div class="tw:flex tw:gap-2">
        <button type="button" (click)="form.controls.role.setValue('admin')">Make admin</button>
        <button type="button" (click)="form.controls.role.reset()">Reset</button>
      </div>
      <p>Trigger id: {{ roleField.effectiveId() }}</p>
    </form>
  `,
})
export class ProgrammaticExample {
  readonly form = new FormGroup({
    role: new FormControl<string>('editor', { nonNullable: true }),
  });
  readonly roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ];
}
```

## Accessibility notes

- The `<label [for]>` targets the trigger button (`buttonId`), so clicking the label opens the listbox.
- `aria-describedby` on the trigger points at the error element when invalid + dirty/touched, else the hint element — screen readers announce the right message without extra wiring.
- The dropdown itself is a spartan-ng listbox (roving `aria-activedescendant`, Escape to close, type-ahead). Keep option `label`s distinct and avoid stuffing status text into them.
- `required` only decorates the label with `*`; add `Validators.required` so the invalid state (and error announcement) actually triggers.

## Theming / CSS variables

No component-specific CSS variables; visuals come from the shared theme tokens via the `HlmSelect*` parts. Use `selectClass` / `labelClass` / `errorClass` / `hintClass` / `class` to adjust sizing and spacing.

Global defaults per styling slot via the wrapper config (precedence: library base < global config < per-instance):

```ts
import { provideEgFormSelectConfig } from '@egose/shadcn-theme-ng/form-select';

await bootstrapApplication(App, {
  providers: [provideEgFormSelectConfig({ selectClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/select` — raw `HlmSelect`, `HlmSelectTrigger`, `HlmSelectValue`, `HlmSelectContent`, `HlmSelectItem`, `HlmSelectLabel` for custom layouts and grouped sections.
- `@egose/shadcn-theme-ng/form-field` — `HlmFormField`, `HlmError`, `HlmHint`, `HlmFormIdGenerator`.
- `@egose/shadcn-theme-ng/label` — `HlmLabel`.
- `@egose/shadcn-theme-ng/form-searchable-multiselect` — searchable checkbox-popover alternative for long option lists.
