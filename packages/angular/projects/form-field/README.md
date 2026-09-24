# Form Field (`@egose/shadcn-theme-ng/form-field`)

The classic labelled-field wrapper: `hlm-form-field` groups a brain field control with a label, shows `hlm-hint` by default, and swaps to `hlm-error` automatically when the control reports validation errors. Equivalent to shadcn/ui `FormField` + `FormMessage` composition.

The Angular implementation is a small composition layer over
[`BrnField` from `@spartan-ng/brain/field`](https://www.spartan-ng.com/): `HlmFormField` hosts
`BrnField`, reads the projected `BrnFieldControl` (`contentChild`) and `HlmError` children
(`contentChildren`), and projects either `<ng-content select="hlm-error">` or
`<ng-content select="hlm-hint">`. `HlmError` / `HlmHint` are pure styling directives;
`HlmFormIdGenerator` mints unique ids. Must live inside a `FormGroupDirective` (`[formGroup]`
parent) so `formControlName` and `ControlContainer` resolve.

> **Ships as:** `@egose/shadcn-theme-ng/form-field` and `@egose/shadcn-theme-ng-tw/form-field`
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
dependencies beyond `@egose/shadcn-theme-ng/utils` and `@spartan-ng/brain/field`.

## Imports

All symbols are exported from the subpath root (`projects/form-field/src/public-api.ts`):

```ts
import {
  HlmFormField,
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  HlmFormFieldImports,
  HlmFormFieldModule,
} from '@egose/shadcn-theme-ng/form-field';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/form-field'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmFormFieldImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmFormFieldModule } from '@egose/shadcn-theme-ng/form-field';

@NgModule({ imports: [HlmFormFieldModule] })
export class DemoModule {}
```

`ControlValueAccessor` behavior: `hlm-form-field` is not itself a form control — the projected
control (any `BrnFieldControl`: `hlm-input`, `hlm-checkbox`, `hlm-date-picker`, …) carries the
`formControlName` binding. The wrapper only observes its `errors()` signal to switch hint/error.

## Anatomy / Structure

```html
<form [formGroup]="form">
  <hlm-form-field>
    <label hlmLabel for="email">Email</label>
    <input hlmInput id="email" formControlName="email" placeholder="you@example.com" />
    <hlm-hint>We'll never share your email.</hlm-hint>
    <hlm-error>Email is required.</hlm-error>
  </hlm-form-field>
</form>
```

Real selectors (from source):

| Class                | Selector                        | Kind                         |
| -------------------- | ------------------------------- | ---------------------------- |
| `HlmFormField`       | `hlm-form-field`                | Component (hosts `BrnField`) |
| `HlmError`           | `hlm-error`                     | Directive                    |
| `HlmHint`            | `hlm-hint`                      | Directive                    |
| `HlmFormIdGenerator` | (service, `providedIn: 'root'`) | Injectable                   |

## API reference

### `HlmFormField` — `hlm-form-field`

| Input   | Type         | Default | Description                                        |
| ------- | ------------ | ------- | -------------------------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged over `tw:block tw:space-y-2`. |

| Member                 | Description                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `control`              | `contentChild(BrnFieldControl)` — the projected field control; **throws `hlm-form-field must contain a BrnFieldControl` if absent.** |
| `errorChildren`        | `contentChildren(HlmError)` — drives the hint/error switch.                                                                          |
| `_hasDisplayedMessage` | `'error'` when an `hlm-error` child exists and `control.errors()` is non-empty, else `'hint'` (protected, governs projection).       |

Template projects default content always, then either `hlm-error` (error case) or `hlm-hint`.

### `HlmError` — `hlm-error` / `HlmHint` — `hlm-hint`

Style-only directives (`text-destructive` / `text-muted-foreground`, block, `text-sm`).

| Input   | Type         | Default | Description    |
| ------- | ------------ | ------- | -------------- |
| `class` | `ClassValue` | `''`    | Extra classes. |

### `HlmFormIdGenerator`

```ts
@Injectable({ providedIn: 'root' })
export class HlmFormIdGenerator {
  generate(prefix: string): string; // `${prefix}-${appId}-${nextId++}`
}
```

Inject and call `generate('my-field')` for stable label/control ids (used by the `eg-form-*` wrappers).

## Examples

### 1. Text input with hint → error swap

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, HlmInput, ...HlmFormFieldImports],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <hlm-form-field>
        <label hlmLabel for="username">Username</label>
        <input hlmInput id="username" formControlName="username" placeholder="ada" />
        <hlm-hint>Letters and numbers only.</hlm-hint>
        <hlm-error>Username is required.</hlm-error>
      </hlm-form-field>
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class TextFieldComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ username: ['', Validators.required] });
  save() {
    console.log(this.form.value);
  }
}
```

### 2. Textarea with generated ids

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';

@Component({
  selector: 'app-bio-field',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, HlmTextarea, ...HlmFormFieldImports],
  template: `
    <form [formGroup]="form">
      <hlm-form-field>
        <label hlmLabel [for]="bioId">Bio</label>
        <textarea hlmTextarea [id]="bioId" formControlName="bio" rows="3"></textarea>
        <hlm-hint>Tell us about yourself in 160 characters.</hlm-hint>
        <hlm-error>Bio is required.</hlm-error>
      </hlm-form-field>
    </form>
  `,
})
export class BioFieldComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ids = inject(HlmFormIdGenerator);
  readonly bioId = this.ids.generate('bio');
  readonly form = this.fb.group({ bio: ['', Validators.required] });
}
```

### 3. Select field

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-role-field',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, ...HlmFormFieldImports, ...HlmSelectImports],
  template: `
    <form [formGroup]="form">
      <hlm-form-field>
        <label hlmLabel for="role">Role</label>
        <hlm-select formControlName="role" id="role" placeholder="Select a role">
          <hlm-select-content>
            <hlm-select-item value="admin">Admin</hlm-select-item>
            <hlm-select-item value="editor">Editor</hlm-select-item>
          </hlm-select-content>
        </hlm-select>
        <hlm-hint>Controls what they can access.</hlm-hint>
        <hlm-error>Pick a role.</hlm-error>
      </hlm-form-field>
    </form>
  `,
})
export class RoleFieldComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ role: ['', Validators.required] });
}
```

### 4. Date picker field

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, ...HlmFormFieldImports, ...HlmDatePickerImports],
  template: `
    <form [formGroup]="form">
      <hlm-form-field>
        <label hlmLabel for="start">Start date</label>
        <hlm-date-picker formControlName="start">
          <hlm-date-picker-input inputId="start" placeholder="Pick a date" />
        </hlm-date-picker>
        <hlm-hint>First day of the subscription.</hlm-hint>
        <hlm-error>Start date is required.</hlm-error>
      </hlm-form-field>
    </form>
  `,
})
export class DateFieldComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ start: [null as Date | null, Validators.required] });
}
```

### 5. Multiple errors (first-match display)

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-multi-error',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, HlmInput, ...HlmFormFieldImports],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <hlm-form-field>
        <label hlmLabel for="email">Email</label>
        <input hlmInput id="email" type="email" formControlName="email" />
        <hlm-hint>We'll send the receipt here.</hlm-hint>
        <!-- All hlm-error children project together while any error exists. -->
        <hlm-error>Email is required.</hlm-error>
        <hlm-error>Enter a valid email address.</hlm-error>
      </hlm-form-field>
      <button type="submit" (click)="form.markAllAsTouched()">Submit</button>
    </form>
  `,
})
export class MultiErrorComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  submit() {
    this.form.markAllAsTouched();
  }
}
```

### 6. Checkbox row + submit-gated validation

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-check-field',
  standalone: true,
  imports: [ReactiveFormsModule, HlmCheckbox, HlmLabel, ...HlmFormFieldImports],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <hlm-form-field class="tw:space-y-1">
        <div class="tw:flex tw:items-center tw:gap-2">
          <hlm-checkbox id="consent" formControlName="consent" />
          <label hlmLabel for="consent">I agree to the terms</label>
        </div>
        <hlm-error>You must agree before continuing.</hlm-error>
      </hlm-form-field>
      <button type="submit">Continue</button>
    </form>
  `,
})
export class CheckFieldComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ consent: [false, Validators.requiredTrue] });
  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) console.log('ok');
  }
}
```

## Automatic error messages (`eg-form-*` wrappers)

The `eg-form-*` wrappers auto-resolve their displayed message from the control's `ValidationErrors` when no explicit `error` is set:

- Resolution order: explicit `error()` wins; otherwise (when `autoError()` is `true`, the default) the message is resolved from a custom dictionary entry, then the built-in defaults (`required`, `requiredTrue`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`), then a generic "`label` is invalid" fallback. `error=""` is treated as unset.
- Set `autoError="false"` on a wrapper for manual-only messages.
- Global wording / custom validator keys (e.g. `usernameTaken`) and i18n are configured app-wide via `provideEgFormErrorMessages({...})` (merged over `DEFAULT_EG_FORM_ERROR_MESSAGES`, read with `injectEgFormErrorMessages()`); per-call overrides go through `resolveEgFormError(errors, label, messages)`.
- _When_ a message surfaces: wrappers render `<hlm-error>` (and point `aria-describedby` at it) only when the control is invalid + touched/dirty/submitted — otherwise the hint shows.

## Accessibility notes

- The wrapper itself adds no label — always include a `<label hlmLabel>` (or `aria-label` on the control) so the field has an accessible name.
- Hint and error are mutually exclusive in the DOM (only one projects at a time), keeping `aria-describedby` targets unambiguous.
- For custom controls, implement `BrnFieldControl` so `errors()` and described-by wiring flow; otherwise the wrapper throws at runtime.
- Mark forms for submit-gated validation with `markAllAsTouched()` so errors appear on submit, not just on blur.

## Theming / CSS variables

No component-specific CSS variables. The wrapper is `tw:block tw:space-y-2`; errors are `text-destructive`, hints `text-muted-foreground`. Extend via `class` on each element.

## Related subpaths

- `@egose/shadcn-theme-ng/form-field-simple` — lighter `eg-form-field` alternative with touched/dirty-gated errors.
- `@egose/shadcn-theme-ng/field` — full shadcn Field layout system (groups, legends, separators).
- `@egose/shadcn-theme-ng/label` — `HlmLabel` used for field labels.
- `@egose/shadcn-theme-ng/form-checkbox`, `.../form-date-picker`, `.../form-text-input` — ready-made wrappers built on these primitives.
