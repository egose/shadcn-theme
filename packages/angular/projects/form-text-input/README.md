# Form Text Input (`@egose/shadcn-theme-ng/form-text-input`)

`EgFormTextInput` is a reactive-forms wrapper that bundles a `<label>`, a styled `<input hlmInput>`, and error/hint text into one form-ready row. It is the Angular equivalent of shadcn/ui's `<FormField> + <Input>` pattern for single-line text entry (text, email, password, number, …), with generated ids, `aria-describedby` wiring, and `disabled` resolution handled for you.

> **Ships as:** `@egose/shadcn-theme-ng/form-text-input` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/form-text-input` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@angular/forms`, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
// tw variant:
// import { EgFormTextInput } from '@egose/shadcn-theme-ng-tw/form-text-input';
```

## Imports

The public API exports exactly one symbol — the standalone component `EgFormTextInput`. There is no `*Imports` array and no `*Module` for this subpath; import the component class directly.

```ts
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input controlName="username" label="Username" placeholder="jane_doe" />
    </form>
  `,
})
export class MyForm {}
```

Requirements:

- Must sit inside a `<form [formGroup]>` (it injects `FormGroupDirective` and provides `ControlContainer`).
- `controlName` is required — forwarded as `[formControlName]` to the inner `<input>`.
- The bound `FormControl` holds a `string` (or `number` for numeric inputs).

## Anatomy / Structure

```html
<eg-form-text-input controlName="username" label="Username">
  <!-- rendered internally -->
  <hlm-form-field>
    <label hlmLabel for="<effectiveId>">Username <span>*</span></label>
    <input
      hlmInput
      id="<effectiveId>"
      name="username"
      formControlName="username"
      type="text"
      placeholder="…"
      aria-describedby="<effectiveId>-error | <effectiveId>-hint"
    />
    <hlm-error id="<effectiveId>-error">…</hlm-error>
    <hlm-hint id="<effectiveId>-hint">…</hlm-hint>
  </hlm-form-field>
</eg-form-text-input>
```

Real selectors: `eg-form-text-input`, `hlm-form-field`, `label[hlmLabel]`, `input[hlmInput]`, `hlm-error`, `hlm-hint`.

## API reference

### `eg-form-text-input` — `EgFormTextInput`

| Input                 | Type                       | Default     | Description                                                                                      |
| --------------------- | -------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `label`               | `string \| undefined`      | `undefined` | Field label rendered as `<label hlmLabel>` bound to the input id.                                |
| `controlName`         | `string`                   | `''`        | **Required.** Control name in the parent `FormGroup`; forwarded as `formControlName` and `name`. |
| `controlId`           | `string \| undefined`      | `undefined` | Explicit id; falls back to `id`, then generated `eg-form-text-input-…`.                          |
| `id`                  | `string \| undefined`      | `undefined` | Alias for an explicit id (same fallback chain).                                                  |
| `error`               | `string \| undefined`      | `undefined` | Error text rendered in `<hlm-error>`.                                                            |
| `hint`                | `string \| undefined`      | `undefined` | Hint text rendered in `<hlm-hint>`.                                                              |
| `name`                | `string \| undefined`      | `undefined` | `name` attribute fallback when `controlName` is empty.                                           |
| `type`                | `string`                   | `'text'`    | Native input `type` (`text`, `email`, `password`, `number`, `tel`, `url`, …).                    |
| `placeholder`         | `string`                   | `''`        | Placeholder text.                                                                                |
| `readonly`            | `boolean`                  | `false`     | Native `readonly` attribute.                                                                     |
| `disabled`            | `boolean`                  | `false`     | Wrapper-level disable (OR-ed with the reactive disabled state — see `effectiveDisabled()`).      |
| `maxlength`           | `string \| number \| null` | `null`      | Native `maxlength`.                                                                              |
| `minlength`           | `string \| number \| null` | `null`      | Native `minlength`.                                                                              |
| `max`                 | `string \| number \| null` | `null`      | Native `max` (number/date inputs).                                                               |
| `min`                 | `string \| number \| null` | `null`      | Native `min` (number/date inputs).                                                               |
| `pattern`             | `string \| RegExp`         | `''`        | Native `pattern` attribute.                                                                      |
| `autocomplete`        | `string \| undefined`      | `undefined` | Native `autocomplete` (e.g. `email`, `current-password`).                                        |
| `autofocus`           | `boolean`                  | `false`     | Native `autofocus`.                                                                              |
| `required`            | `boolean`                  | `false`     | Native `required` + red `*` on the label.                                                        |
| `class` (`userClass`) | `ClassValue`               | `''`        | Extra host classes (merged over `tw:flex tw:flex-col`).                                          |
| `labelClass`          | `string`                   | `''`        | Extra label classes (merged over `tw:mb-1 tw:gap-0`).                                            |
| `inputClass`          | `string`                   | `''`        | Extra input classes (merged over `tw:mb-1`).                                                     |
| `errorClass`          | `string`                   | `''`        | Extra error classes (merged over `tw:mt-0`).                                                     |
| `hintClass`           | `string`                   | `''`        | Extra hint classes (merged over `tw:mt-0`).                                                      |

No outputs. Methods: `describedBy(): string | null` (error id when invalid + dirty/touched, else hint id, else `null`); `effectiveDisabled(): boolean` (`disabled()` OR the control's reactive disabled state — bound as the native `disabled` attribute). Readonly computeds: `effectiveId()`, `errorId()`, `hintId()`.

## Examples

### 1. Basic login row (email + password)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="login()">
      <eg-form-text-input
        controlName="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
      />
      <eg-form-text-input
        controlName="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
      />
      <button type="submit">Sign in</button>
    </form>
  `,
})
export class LoginExample {
  readonly form = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
  });

  login() {
    console.log(this.form.getRawValue());
  }
}
```

### 2. Validation with per-rule error messages

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-text-input
        controlName="username"
        label="Username"
        placeholder="jane_doe"
        [error]="usernameError()"
        hint="3–20 characters, letters and numbers"
        required
      />
      <button type="submit">Continue</button>
    </form>
  `,
})
export class ValidationExample {
  readonly form = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9_]+$/i)],
    }),
  });

  usernameError(): string | undefined {
    const c = this.form.controls.username;
    if (c.valid || !(c.dirty || c.touched)) return undefined;
    if (c.hasError('required')) return 'Username is required';
    if (c.hasError('minlength')) return 'Use at least 3 characters';
    return 'Only letters, numbers, and _';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
```

### 3. Number input with min/max + readonly display field

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input
        controlName="quantity"
        label="Quantity"
        type="number"
        [min]="1"
        [max]="99"
        hint="Between 1 and 99"
      />
      <eg-form-text-input controlName="orderId" label="Order ID" [readonly]="true" />
    </form>
  `,
})
export class NumberExample {
  readonly form = new FormGroup({
    quantity: new FormControl<number>(1, { nonNullable: true }),
    orderId: new FormControl<string>('ORD-2026-001', { nonNullable: true }),
  });
}
```

### 4. Disabled via input vs via form API

```ts
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input
        controlName="nickname"
        label="Nickname"
        placeholder="How should we call you?"
        [disabled]="locked()"
      />
      <button type="button" (click)="locked.update((v) => !v)">Toggle input</button>
      <button type="button" (click)="disableViaApi()">Disable via form API</button>
    </form>
  `,
})
export class DisabledExample {
  readonly form = new FormGroup({
    nickname: new FormControl<string>('', { nonNullable: true }),
  });
  readonly locked = signal(false);

  disableViaApi() {
    this.form.controls.nickname.disable(); // effectiveDisabled() picks this up too
  }
}
```

### 5. Length constraints with a live counter hint

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input
        controlName="headline"
        label="Headline"
        placeholder="One-line summary"
        [maxlength]="80"
        [minlength]="10"
        [hint]="counter()"
        error="Headline must be 10–80 characters"
      />
    </form>
  `,
})
export class CounterExample {
  readonly form = new FormGroup({
    headline: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(10), Validators.maxLength(80)],
    }),
  });

  counter(): string {
    return `${this.form.controls.headline.value.length}/80`;
  }
}
```

### 6. Full profile form (composition of several inputs)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="tw:grid tw:gap-4 sm:tw:grid-cols-2">
      <eg-form-text-input controlName="firstName" label="First name" autocomplete="given-name" required />
      <eg-form-text-input controlName="lastName" label="Last name" autocomplete="family-name" required />
      <eg-form-text-input
        class="sm:tw:col-span-2"
        controlName="email"
        label="Email"
        type="email"
        autocomplete="email"
        error="Enter a valid email address"
        required
      />
      <eg-form-text-input controlName="phone" label="Phone (optional)" type="tel" autocomplete="tel" />
      <eg-form-text-input controlName="website" label="Website (optional)" type="url" placeholder="https://" />
      <button class="sm:tw:col-span-2" type="submit" [disabled]="form.invalid">Save profile</button>
    </form>
  `,
})
export class ProfileExample {
  readonly form = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl<string>('', { nonNullable: true }),
    website: new FormControl<string>('', { nonNullable: true }),
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.getRawValue());
  }
}
```

## Accessibility notes

- `<label [for]>` targets the input id (explicit `controlId`/`id` or generated), so label clicks focus the field.
- `aria-describedby` points at the error element only when the control is invalid and dirty/touched, otherwise at the hint — announce validation at the right moment without duplicate announcements.
- The inner input is `HlmInput` (spartan-ng `BrnInput` + field-described-by), so invalid styling via `data-matches-spartan-invalid` and described-by propagation come for free.
- Always pair the visual `required` star with a real validator; use native `type`/`autocomplete` values so password managers and mobile keyboards behave.

## Theming / CSS variables

No component-specific CSS variables; the input look comes from the shared theme tokens consumed by `HlmInput`. Adjust density with `inputClass` (e.g. `tw:h-11`), label/error/hint spacing with their `*Class` inputs.

Global defaults per styling slot via the wrapper config (precedence: library base < global config < per-instance):

```ts
import { provideEgFormTextInputConfig } from '@egose/shadcn-theme-ng/form-text-input';

await bootstrapApplication(App, {
  providers: [provideEgFormTextInputConfig({ inputClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/input` — the raw `HlmInput` directive for non-form or template-driven inputs.
- `@egose/shadcn-theme-ng/form-textarea` — the multiline sibling.
- `@egose/shadcn-theme-ng/form-field` — `HlmFormField`, `HlmError`, `HlmHint`, `HlmFormIdGenerator`.
- `@egose/shadcn-theme-ng/label` — `HlmLabel`.
