# Label (`@egose/shadcn-theme-ng/label`)

Form-field label ported from shadcn/ui `label` (Radix Label equivalent). A thin directive wrapper around the spartan-ng `BrnLabel` brain primitive: it forwards label semantics/association (`id`, `for`) to `BrnLabel` via host directives and adds the shadcn label treatment (small medium-weight text plus disabled-state dimming that reacts to `peer`/`group`/`has-[[disabled]]` context).

Ships as `@egose/shadcn-theme-ng/label` and `@egose/shadcn-theme-ng-tw/label` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmLabel, // directive: [hlmLabel]
  HlmLabelImports, // readonly [HlmLabel]
  HlmLabelModule, // NgModule wrapping HlmLabelImports
} from '@egose/shadcn-theme-ng/label';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmLabelImports],
  template: `<label hlmLabel for="email">Email</label>`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmLabelModule } from '@egose/shadcn-theme-ng/label';

@NgModule({ imports: [HlmLabelModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/label`. Symbol names are identical.

## Anatomy / Structure

```html
<label hlmLabel for="email">Email address</label>
<input hlmInput id="email" type="email" />

<!-- extra classes merge via class input -->
<label hlmLabel for="bio" class="tw:mb-2">Bio</label>
```

| Class      | Selector     | Element                                | Role                              |
| ---------- | ------------ | -------------------------------------- | --------------------------------- |
| `HlmLabel` | `[hlmLabel]` | any labelable host, normally `<label>` | Accessible label + shadcn styling |

`HlmLabel` declares `hostDirectives: [{ directive: BrnLabel, inputs: ['id', 'for'] }]`, so the `id` and `for` bindings you write on the host are forwarded to the brain directive that owns label association.

## API reference

### `HlmLabel` (`[hlmLabel]`)

| Member                | Kind                                  | Type / Default             | Notes                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                  | input (via `BrnLabel` host directive) | `string`                   | Forwarded to `BrnLabel`. Rarely set on the label itself.                                                                                                                                                                                                                                                                                                                                               |
| `for`                 | input (via `BrnLabel` host directive) | `string`                   | Forwarded to `BrnLabel`. Associates the label with the control whose `id` matches.                                                                                                                                                                                                                                                                                                                     |
| `userClass` (`class`) | input                                 | `ClassValue`, default `''` | Extra Tailwind/classes merged after the base label classes via `hlm()`.                                                                                                                                                                                                                                                                                                                                |
| `_computedClass`      | protected computed                    | `string`                   | Base: `flex select-none items-center gap-2 text-sm font-medium leading-none` plus disabled dimming: `peer-disabled:cursor-not-allowed peer-disabled:opacity-50`, `has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50`, `group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50`, `peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-50`. |

No outputs, methods, or signals beyond the inputs above.

## Examples

### 1. Basic label + input

```ts
import { Component } from '@angular/core';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-label-basic',
  standalone: true,
  imports: [...HlmLabelImports, HlmInput],
  template: `
    <div class="tw:grid tw:gap-1.5">
      <label hlmLabel for="email">Email</label>
      <input hlmInput id="email" type="email" placeholder="you@example.com" />
    </div>
  `,
})
export class LabelBasicComponent {}
```

```html
<div class="tw:grid tw:gap-1.5">
  <label hlmLabel for="email">Email</label>
  <input hlmInput id="email" type="email" placeholder="you@example.com" />
</div>
```

### 2. Required marker and hint text

```ts
import { Component } from '@angular/core';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-label-required',
  standalone: true,
  imports: [...HlmLabelImports, HlmInput],
  template: `
    <div class="tw:grid tw:gap-1.5">
      <label hlmLabel for="username">
        Username
        <span aria-hidden="true" class="tw:text-destructive">*</span>
        <span class="tw:sr-only">(required)</span>
      </label>
      <input hlmInput id="username" required minlength="3" placeholder="ada_lovelace" />
      <p class="tw:text-xs tw:text-muted-foreground">Lowercase letters, numbers, underscores.</p>
    </div>
  `,
})
export class LabelRequiredComponent {}
```

### 3. Template-driven form

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-label-template-driven',
  standalone: true,
  imports: [FormsModule, ...HlmLabelImports, HlmInput],
  template: `
    <form #f="ngForm" class="tw:grid tw:gap-4">
      <div class="tw:grid tw:gap-1.5">
        <label hlmLabel for="displayName">Display name</label>
        <input hlmInput id="displayName" name="displayName" [(ngModel)]="name" required />
      </div>
      <p class="tw:text-sm tw:text-muted-foreground">Hello, {{ name || 'stranger' }}.</p>
    </form>
  `,
})
export class LabelTemplateDrivenComponent {
  name = '';
}
```

### 4. Reactive form with disabled state

The label dims automatically when the associated control is a disabled `peer` (or inside a disabled group) thanks to the built-in `peer-disabled:` / `group-data-[disabled=true]:` rules.

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-label-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, ...HlmLabelImports, HlmInput],
  template: `
    <form [formGroup]="form" class="tw:grid tw:gap-4">
      <div class="tw:grid tw:gap-1.5">
        <label hlmLabel for="company">Company</label>
        <input hlmInput id="company" class="tw:peer" formControlName="company" />
      </div>
      <label class="tw:flex tw:items-center tw:gap-2 tw:text-sm">
        <input type="checkbox" (change)="toggleDisabled()" />
        Disable company field
      </label>
    </form>
  `,
})
export class LabelReactiveComponent {
  readonly form = new FormGroup({
    company: new FormControl({ value: 'Acme', disabled: false }),
  });

  toggleDisabled(): void {
    const control = this.form.controls.company;
    control.disabled ? control.enable() : control.disable();
  }
}
```

> Add `class="tw:peer"` to the input so the label's `peer-disabled:` rule can observe it. Without the `peer` class the label still dims via the `has-[[disabled]]` fallback when the control is nested in the same wrapper.

### 5. Checkbox / switch labels and custom spacing

```ts
import { Component } from '@angular/core';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { HlmSwitch } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-label-checks',
  standalone: true,
  imports: [...HlmLabelImports, HlmCheckbox, HlmSwitch],
  template: `
    <div class="tw:flex tw:flex-col tw:gap-4">
      <div class="tw:flex tw:items-center tw:gap-2">
        <hlm-checkbox id="marketing" />
        <label hlmLabel for="marketing" class="tw:cursor-pointer">Email me product news</label>
      </div>
      <div class="tw:flex tw:items-center tw:gap-2">
        <hlm-switch id="notifications" />
        <label hlmLabel for="notifications">Push notifications</label>
      </div>
    </div>
  `,
})
export class LabelChecksComponent {}
```

### 6. NgModule consumer

```ts
import { NgModule, Component } from '@angular/core';
import { HlmLabelModule } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-label-legacy',
  template: `<label hlmLabel for="city">City</label>`,
})
export class LabelLegacyComponent {}

@NgModule({
  declarations: [LabelLegacyComponent],
  imports: [HlmLabelModule],
  exports: [LabelLegacyComponent],
})
export class LabelLegacyModule {}
```

## Accessibility notes

- Always pair `for` with the control's `id` (or nest the control inside the `<label>`). The `for` binding is forwarded to `BrnLabel`, which owns the association semantics.
- Keep label text visible and concise; use `aria-hidden` + `sr-only` for decorative markers like `*` (see example 2).
- Do not use `placeholder` as a label substitute — the shadcn label treatment assumes a real `<label>` element.
- The disabled dimming is visual only; disable the control itself (`disabled` attribute / `FormControl.disable()`) so assistive tech reports the state.

## Theming / CSS variables

No theming inputs. The label inherits `text-sm font-medium` and theme tokens automatically; pass extra utilities via `class` (merged by `hlm()` after the base classes, so yours win on conflict).

## Related subpaths

- `@egose/shadcn-theme-ng/input`, `@egose/shadcn-theme-ng/textarea`, `@egose/shadcn-theme-ng/checkbox`, `@egose/shadcn-theme-ng/switch` — controls that `for`/`id` pairs target.
- `@egose/shadcn-theme-ng/form-field`, `@egose/shadcn-theme-ng/form-field-simple` — higher-level field wrappers that compose labels with errors and hints.
