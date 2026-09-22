# Form Field Simple (`@egose/shadcn-theme-ng/form-field-simple`)

A minimal reactive-form wrapper: `eg-form-field` projects your control and shows either the projected `hlm-error` or `hlm-hint` based on the control's touched/dirty error state. A lighter alternative to `hlm-form-field` with no brain dependency.

The Angular implementation is a standalone component with no headless primitive: it grabs the
projected `FormControlName` via `contentChild`, subscribes to its `statusChanges`, and exposes
`hasError` / `firstErrorKey` computed signals. Template logic is `@if (hasError())` → project
`hlm-error`, else project `hlm-hint`. It must live inside a `FormGroupDirective` (`[formGroup]`
parent) and provides `ControlContainer → FormGroupDirective` so `formControlName` resolves.

> **Ships as:** `@egose/shadcn-theme-ng/form-field-simple` and `@egose/shadcn-theme-ng-tw/form-field-simple`
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
[package README](../../README.md#peer-dependencies). This subpath has no extra runtime component
dependencies beyond `@egose/shadcn-theme-ng/utils`.

## Imports

Exported from the subpath root (`projects/form-field-simple/src/public-api.ts`). Note: this subpath
exports a single standalone component — there is no `*Imports` array or `*Module`:

```ts
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-field-simple'
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer: add `EgFormField` (and `ReactiveFormsModule`) to the module's `imports`.

`ControlValueAccessor` behavior: `eg-form-field` is not a form control and implements no
`ControlValueAccessor` — the projected control (e.g. `input[formControlName]`, `hlm-checkbox`,
`hlm-select`) owns the value. The wrapper only observes `FormControlName.control.errors`,
`touched`, and `dirty` to decide which message to project.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <eg-form-field>
    <label hlmLabel for="email">Email</label>
    <input hlmInput id="email" formControlName="email" />
    <hlm-hint>We'll never share your email.</hlm-hint>
    <hlm-error>Email is required.</hlm-error>
  </eg-form-field>
</form>
```

Selector (from source): `eg-form-field` (standalone component).

Template (from source):

```html
<ng-content></ng-content>

@if (hasError()) {
<ng-content select="hlm-error"></ng-content>
} @else {
<ng-content select="hlm-hint"></ng-content>
}
```

## API reference

### `EgFormField` — `eg-form-field`

| Input   | Type         | Default | Description                         |
| ------- | ------------ | ------- | ----------------------------------- |
| `class` | `ClassValue` | `''`    | Extra host classes (base is empty). |

| Member          | Type                            | Description                                                                                                        |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `control`       | `contentChild(FormControlName)` | The projected form-control directive. No control → `hasError` is always `false` (hint shows).                      |
| `form`          | `FormGroup`                     | Parent group from injected `FormGroupDirective`.                                                                   |
| `hasError`      | `computed boolean`              | `true` when `control.errors` is non-empty and the control is `touched` or `dirty` (subscribes to `statusChanges`). |
| `firstErrorKey` | `computed string \| null`       | First key of `control.errors` (e.g. `'required'`), or `null`. Useful for per-key messages.                         |

Lifecycle: subscribes to `statusChanges` in `ngAfterContentInit`, unsubscribes in `ngOnDestroy`.

## Examples

### 1. Basic input with hint/error

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-simple-basic',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmLabel, HlmInput],
  template: `
    <form [formGroup]="form">
      <eg-form-field>
        <label hlmLabel for="name">Name</label>
        <input hlmInput id="name" formControlName="name" placeholder="Ada" />
        <hlm-hint>Your public display name.</hlm-hint>
        <hlm-error>Name is required.</hlm-error>
      </eg-form-field>
    </form>
  `,
})
export class SimpleBasicComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ name: ['', Validators.required] });
}
```

### 2. Per-validator messages with `firstErrorKey`

```ts
import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-per-key',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmLabel, HlmInput],
  template: `
    <form [formGroup]="form">
      <eg-form-field #wrapper>
        <label hlmLabel for="email">Email</label>
        <input hlmInput id="email" type="email" formControlName="email" />
        <hlm-hint>We'll send the receipt here.</hlm-hint>
        <hlm-error>
          @if (wrapper.firstErrorKey() === 'required') {
            Email is required.
          } @else if (wrapper.firstErrorKey() === 'email') {
            Enter a valid email address.
          } @else {
            This field is invalid.
          }
        </hlm-error>
      </eg-form-field>
    </form>
  `,
})
export class PerKeyComponent {
  private readonly fb = inject(FormBuilder);
  readonly field = viewChild(EgFormField);
  readonly form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
}
```

### 3. Template-driven-style submit gating

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-submit-gate',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmLabel, HlmInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-field>
        <label hlmLabel for="password">Password</label>
        <input hlmInput id="password" type="password" formControlName="password" />
        <hlm-hint>At least 8 characters.</hlm-hint>
        <hlm-error>Password must be at least 8 characters.</hlm-error>
      </eg-form-field>
      <button type="submit">Sign in</button>
    </form>
  `,
})
export class SubmitGateComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ password: ['', [Validators.required, Validators.minLength(8)]] });
  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) console.log('signing in…');
  }
}
```

### 4. Checkbox row (used by `eg-form-checkbox` internally)

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-simple-check',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmCheckbox, HlmLabel],
  template: `
    <form [formGroup]="form">
      <eg-form-field>
        <div class="tw:flex tw:items-center tw:gap-2">
          <hlm-checkbox id="tos" formControlName="tos" />
          <label hlmLabel for="tos">I agree to the terms</label>
        </div>
        <hlm-hint>You can withdraw consent anytime.</hlm-hint>
        <hlm-error>You must agree to continue.</hlm-error>
      </eg-form-field>
    </form>
  `,
})
export class SimpleCheckComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ tos: [false, Validators.requiredTrue] });
}
```

### 5. Select + async options

```ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-simple-select',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmLabel, ...HlmSelectImports],
  template: `
    <form [formGroup]="form">
      <eg-form-field>
        <label hlmLabel>Country</label>
        <hlm-select formControlName="country" placeholder="Select a country">
          <hlm-select-content>
            @if (!countries().length) {
              <hlm-select-item value="" disabled>Loading…</hlm-select-item>
            }
            @for (c of countries(); track c) {
              <hlm-select-item [value]="c">{{ c }}</hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
        <hlm-hint>Used for shipping estimates.</hlm-hint>
        <hlm-error>Pick a country.</hlm-error>
      </eg-form-field>
    </form>
  `,
})
export class SimpleSelectComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ country: ['', Validators.required] });
  readonly countries = signal<string[]>([]);
  constructor() {
    setTimeout(() => this.countries.set(['Germany', 'France', 'Japan']), 500);
  }
}
```

### 6. Custom host styling + textarea

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';

@Component({
  selector: 'app-simple-area',
  standalone: true,
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmLabel, HlmTextarea],
  template: `
    <form [formGroup]="form">
      <eg-form-field class="tw:rounded-lg tw:border tw:p-4">
        <label hlmLabel for="notes">Notes</label>
        <textarea hlmTextarea id="notes" formControlName="notes" rows="3"></textarea>
        <hlm-hint>Optional context for the reviewer.</hlm-hint>
        <hlm-error>Notes are required for this step.</hlm-error>
      </eg-form-field>
    </form>
  `,
})
export class SimpleAreaComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ notes: ['', Validators.required] });
}
```

## Accessibility notes

- Errors only appear after the control is `touched` or `dirty`, so screen-reader users are not spammed on load; call `markAllAsTouched()` on submit to reveal outstanding errors.
- The wrapper adds no label itself — always include a `<label>` (or `aria-label`) so the field has an accessible name.
- Only one of `hlm-error` / `hlm-hint` is in the DOM at a time, keeping `aria-describedby` targets unambiguous when you wire ids.
- `firstErrorKey` lets you render a single assertive message per failure instead of stacking multiple errors.

## Theming / CSS variables

No component-specific CSS variables and no base host classes — layout comes from your content plus `class`. Pair with `hlm-error` / `hlm-hint` styling from `@egose/shadcn-theme-ng/form-field`.

## Related subpaths

- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` with brain `BrnField` state (stricter, throws without a field control).
- `@egose/shadcn-theme-ng/form-checkbox` — ready-made checkbox row built on `eg-form-field`.
- `@egose/shadcn-theme-ng/label` — `HlmLabel` for field labels.
- `@egose/shadcn-theme-ng/input`, `.../textarea`, `.../select` — controls to project inside the wrapper.
