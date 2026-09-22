# Field (`@egose/shadcn-theme-ng/field`)

The shadcn/ui Field layout system for Angular: composable label / title / description / error / content wrappers, groups, fieldsets, legends, and separators for building accessible forms — including card-style selectable rows. Equivalent to shadcn/ui `Field`.

The Angular implementation layers shadcn classes over headless
[`BrnField` / `BrnFieldA11yService` from `@spartan-ng/brain/field`](https://www.spartan-ng.com/):
`HlmField` hosts `BrnField` (validation state), `HlmFieldDescription` / `HlmFieldError` register
`aria-describedby` ids with the a11y service, and `HlmFieldLabel` composes `HlmLabel`. Pure-layout
pieces (content, group, set, separator, title) carry no behavior.

> **Ships as:** `@egose/shadcn-theme-ng/field` and `@egose/shadcn-theme-ng-tw/field`
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
`@egose/shadcn-theme-ng/label`, `@egose/shadcn-theme-ng/separator`, and
`@egose/shadcn-theme-ng/utils`.

## Imports

All symbols are exported from the subpath root (`projects/field/src/public-api.ts`):

```ts
import {
  HlmField,
  HlmFieldLabel,
  HlmFieldTitle,
  HlmFieldDescription,
  HlmFieldError,
  HlmFieldContent,
  HlmFieldGroup,
  HlmFieldSet,
  HlmFieldLegend,
  HlmFieldSeparator,
  HlmFieldImports,
  HlmFieldModule,
} from '@egose/shadcn-theme-ng/field';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/field'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmFieldImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmFieldModule } from '@egose/shadcn-theme-ng/field';

@NgModule({ imports: [HlmFieldModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<div hlmFieldGroup>
  <div hlmField>
    <label hlmFieldLabel for="name">Name</label>
    <div hlmFieldContent>
      <input hlmInput id="name" placeholder="Ada Lovelace" />
      <p hlmFieldDescription>Your public display name.</p>
      <hlm-field-error validator="required">Name is required.</hlm-field-error>
    </div>
  </div>

  <hlm-field-separator>or continue with</hlm-field-separator>

  <fieldset hlmFieldSet>
    <legend hlmFieldLegend>Notifications</legend>
    <div hlmField orientation="horizontal">
      <div hlmFieldContent>
        <span hlmFieldTitle>Email alerts</span>
        <p hlmFieldDescription>Get emailed on mentions.</p>
      </div>
      <hlm-switch />
    </div>
  </fieldset>
</div>
```

Real selectors (from source):

| Class                 | Selector(s)                                    | Kind                                  |
| --------------------- | ---------------------------------------------- | ------------------------------------- |
| `HlmField`            | `[hlmField], hlm-field`                        | Directive (hosts `BrnField`)          |
| `HlmFieldLabel`       | `[hlmFieldLabel], hlm-field-label`             | Directive (hosts `HlmLabel`)          |
| `HlmFieldTitle`       | `[hlmFieldTitle], hlm-field-title`             | Directive (`data-slot="field-label"`) |
| `HlmFieldDescription` | `[hlmFieldDescription], hlm-field-description` | Directive                             |
| `HlmFieldError`       | `hlm-field-error`                              | Component (element only)              |
| `HlmFieldContent`     | `[hlmFieldContent], hlm-field-content`         | Directive                             |
| `HlmFieldGroup`       | `[hlmFieldGroup], hlm-field-group`             | Directive                             |
| `HlmFieldSet`         | `fieldset[hlmFieldSet]`                        | Directive (fieldset only)             |
| `HlmFieldLegend`      | `legend[hlmFieldLegend]`                       | Directive (legend only)               |
| `HlmFieldSeparator`   | `hlm-field-separator`                          | Component (element only)              |

## API reference

### `HlmField` — `[hlmField], hlm-field`

Field row. Hosts `BrnField` (`role="group"`, `data-slot="field"`, `data-orientation`).

| Input                           | Type                                         | Default      | Description                                                                  |
| ------------------------------- | -------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| `orientation`                   | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | Row layout; `responsive` stacks on small screens (`@container/field-group`). |
| `data-invalid` / `forceInvalid` | forwarded to `BrnField`                      | —            | Manual invalid-state control.                                                |

### `HlmFieldLabel` — `[hlmFieldLabel], hlm-field-label`

Label for a control. Hosts `HlmLabel` (all label inputs forwarded). Card-style when wrapping a nested `[data-slot=field]`. No new inputs.

### `HlmFieldTitle` — `[hlmFieldTitle], hlm-field-title`

Non-`<label>` title (used beside switches/checkboxes inside `hlmFieldContent`). No inputs. Note: its `data-slot` is `field-label`, not `field-title`.

### `HlmFieldDescription` — `[hlmFieldDescription], hlm-field-description`

Hint text. Registers its id with `BrnFieldA11yService` so controls pick it up via `aria-describedby`.

| Input | Type     | Default                     | Description             |
| ----- | -------- | --------------------------- | ----------------------- |
| `id`  | `string` | `hlm-field-description-<n>` | Description element id. |

### `HlmFieldError` — `hlm-field-error`

Error message (`role="alert"`, hidden until it should display). Reads validation state from the parent `BrnField`; registers with the a11y service only while visible.

| Input       | Type      | Default               | Description                                                                                  |
| ----------- | --------- | --------------------- | -------------------------------------------------------------------------------------------- |
| `id`        | `string`  | `hlm-field-error-<n>` | Error element id.                                                                            |
| `validator` | `string`  | —                     | Show only when this validator key (e.g. `'required'`) is present; omit to show on any error. |
| `forceShow` | `boolean` | `false`               | Show regardless of control state.                                                            |

Without a parent field it always displays (useful for static demos).

### `HlmFieldContent` — `[hlmFieldContent], hlm-field-content`

Flex column for control + description + errors. No inputs.

### `HlmFieldGroup` — `[hlmFieldGroup], hlm-field-group`

Vertical stack of fields (`gap-7`, container-query scope for `responsive` fields). No inputs.

### `HlmFieldSet` — `fieldset[hlmFieldSet]` / `HlmFieldLegend` — `legend[hlmFieldLegend]`

Native grouping elements with shadcn spacing. Legend only:

| Input     | Type                  | Default    | Description                           |
| --------- | --------------------- | ---------- | ------------------------------------- |
| `variant` | `'label' \| 'legend'` | `'legend'` | Text size (`text-sm` vs `text-base`). |

### `HlmFieldSeparator` — `hlm-field-separator`

Centered labelled divider (hosts `hlm-separator` + centered text span). Content is the label text. No inputs.

## Examples

### 1. Basic labelled field with hint + error

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-basic-field',
  standalone: true,
  imports: [ReactiveFormsModule, HlmInput, ...HlmFieldImports],
  template: `
    <div hlmFieldGroup [formGroup]="form">
      <div hlmField>
        <label hlmFieldLabel for="username">Username</label>
        <div hlmFieldContent>
          <input hlmInput id="username" formControlName="username" placeholder="ada" />
          <p hlmFieldDescription>Letters and numbers only.</p>
          <hlm-field-error validator="required">Username is required.</hlm-field-error>
        </div>
      </div>
    </div>
  `,
})
export class BasicFieldComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ username: ['', Validators.required] });
}
```

> Note: `hlmField` hosts `BrnField`; controls that implement `BrnFieldControl` feed its error state.
> Plain `hlmInput` + reactive forms drive `hlm-field-error` through the parent field where supported;
> for guaranteed wiring use `hlm-form-field` or a brain field control.

### 2. Horizontal switch row

```ts
import { Component, signal } from '@angular/core';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-switch-row',
  standalone: true,
  imports: [...HlmFieldImports, ...HlmSwitchImports],
  template: `
    <div hlmField orientation="horizontal">
      <div hlmFieldContent>
        <span hlmFieldTitle>Email notifications</span>
        <p hlmFieldDescription>Receive an email on every mention.</p>
      </div>
      <hlm-switch [checked]="on()" (checkedChange)="on.set($event)" />
    </div>
  `,
})
export class SwitchRowComponent {
  readonly on = signal(true);
}
```

### 3. Fieldset + legend + responsive rows

```ts
import { Component } from '@angular/core';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-fieldset',
  standalone: true,
  imports: [...HlmFieldImports, HlmInput],
  template: `
    <fieldset hlmFieldSet>
      <legend hlmFieldLegend>Profile</legend>
      <div hlmField orientation="responsive">
        <label hlmFieldLabel for="first">First name</label>
        <div hlmFieldContent>
          <input hlmInput id="first" placeholder="Ada" />
        </div>
      </div>
      <div hlmField orientation="responsive">
        <label hlmFieldLabel for="last">Last name</label>
        <div hlmFieldContent>
          <input hlmInput id="last" placeholder="Lovelace" />
        </div>
      </div>
    </fieldset>
  `,
})
export class FieldsetComponent {}
```

### 4. Selectable card rows (label wrapping a field)

```ts
import { Component, signal } from '@angular/core';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmRadioGroupImports } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-plan-cards',
  standalone: true,
  imports: [...HlmFieldImports, ...HlmRadioGroupImports],
  template: `
    <div hlmFieldGroup data-slot="checkbox-group">
      @for (plan of plans; track plan) {
        <label hlmFieldLabel>
          <input
            type="radio"
            name="plan"
            [value]="plan"
            [checked]="selected() === plan"
            (change)="selected.set(plan)"
          />
          <div hlmFieldContent>
            <span hlmFieldTitle>{{ plan }}</span>
            <p hlmFieldDescription>{{ plan }} billing, cancel anytime.</p>
          </div>
        </label>
      }
    </div>
  `,
})
export class PlanCardsComponent {
  readonly plans = ['Monthly', 'Yearly'];
  readonly selected = signal('Monthly');
}
```

### 5. Separator between groups + per-validator errors

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-validators',
  standalone: true,
  imports: [ReactiveFormsModule, HlmInput, ...HlmFieldImports],
  template: `
    <div hlmFieldGroup [formGroup]="form">
      <div hlmField>
        <label hlmFieldLabel for="email">Email</label>
        <div hlmFieldContent>
          <input hlmInput id="email" formControlName="email" type="email" />
          <hlm-field-error validator="required">Email is required.</hlm-field-error>
          <hlm-field-error validator="email">Enter a valid email address.</hlm-field-error>
        </div>
      </div>
      <hlm-field-separator>or continue with</hlm-field-separator>
      <div hlmField>
        <label hlmFieldLabel for="phone">Phone (optional)</label>
        <div hlmFieldContent>
          <input hlmInput id="phone" formControlName="phone" />
          <p hlmFieldDescription>We'll only call about your order.</p>
        </div>
      </div>
    </div>
  `,
})
export class ValidatorsComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ email: ['', [Validators.required, Validators.email]], phone: [''] });
}
```

### 6. Forced error preview (docs / visual testing)

```ts
import { Component } from '@angular/core';
import { HlmFieldImports } from '@egose/shadcn-theme-ng/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-forced-error',
  standalone: true,
  imports: [...HlmFieldImports, HlmInput],
  template: `
    <div hlmField forceInvalid>
      <label hlmFieldLabel for="demo">API key</label>
      <div hlmFieldContent>
        <input hlmInput id="demo" value="sk-…" />
        <hlm-field-error forceShow>This key has been revoked.</hlm-field-error>
      </div>
    </div>
  `,
})
export class ForcedErrorComponent {}
```

## Accessibility notes

- `HlmField` sets `role="group"`; always give the group an accessible name via `HlmFieldLabel` / `HlmFieldTitle` / `legend`.
- Descriptions and visible errors are registered with `BrnFieldA11yService` and referenced from controls via `aria-describedby`; keep ids unique (defaults auto-increment).
- Errors use `role="alert"` and only render when the parent field reports a matching validation error — screen readers announce them on appearance.
- Native `fieldset` + `legend` remain the most robust grouping for related controls; prefer `hlmFieldSet` for notification groups and radio sets.

## Theming / CSS variables

No component-specific CSS variables. Orientation, invalid color (`text-destructive` on `data-matches-spartan-invalid`), and spacing derive from `fieldVariants` cva + global tokens. Extend with `class` on any directive.

## Related subpaths

- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` reactive-form wrapper with automatic hint/error switching.
- `@egose/shadcn-theme-ng/label` — `HlmLabel` hosted by `HlmFieldLabel`.
- `@egose/shadcn-theme-ng/separator` — `HlmSeparator` rendered inside `hlm-field-separator`.
- `@egose/shadcn-theme-ng/field` pairs with `@egose/shadcn-theme-ng/checkbox`, `.../radio-group`, `.../switch` for selectable rows.
