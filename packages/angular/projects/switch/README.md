# Switch (`@egose/shadcn-theme-ng/switch`)

A toggle switch, equivalent to [shadcn/ui Switch](https://ui.shadcn.com/docs/components/switch). This subpath ships `HlmSwitch` — a shadcn-styled `ControlValueAccessor` component wrapping spartan-ng's `BrnSwitch`/`BrnSwitchThumb` primitives — plus the `HlmSwitchThumb` styling directive for advanced use. Supports template-driven forms, reactive forms, and two-way `[(checked)]` binding out of the box.

> **Ships as:** `@egose/shadcn-theme-ng/switch` and `@egose/shadcn-theme-ng-tw/switch` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@spartan-ng/brain` arrives transitively; `FormsModule`/`ReactiveFormsModule` come from your app when you need form bindings. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/switch/src/public-api.ts`:

```ts
import { HlmSwitch, HlmSwitchThumb, HlmSwitchImports, HlmSwitchModule } from '@egose/shadcn-theme-ng/switch';
// tw variant:
// import { HlmSwitch, HlmSwitchThumb, HlmSwitchImports, HlmSwitchModule } from '@egose/shadcn-theme-ng-tw/switch';
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmSwitchImports],
  template: `<hlm-switch />`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSwitchModule } from '@egose/shadcn-theme-ng/switch';

@NgModule({ imports: [HlmSwitchModule] })
export class FeatureModule {}
```

| Symbol             | Kind                 | Description                                                     |
| ------------------ | -------------------- | --------------------------------------------------------------- |
| `HlmSwitch`        | Standalone component | `<hlm-switch>` — styled switch with `ControlValueAccessor`.     |
| `HlmSwitchThumb`   | Directive            | Thumb styling for custom `brn-switch` compositions (see below). |
| `HlmSwitchImports` | `const` array        | `[HlmSwitch, HlmSwitchThumb]` — spread into `imports: [...]`.   |
| `HlmSwitchModule`  | NgModule             | Imports + re-exports both for NgModule consumers.               |

## Anatomy / Structure

```html
<!-- basic -->
<hlm-switch />

<!-- with label (always associate a visible label) -->
<div class="flex items-center gap-2">
  <hlm-switch id="airplane" />
  <label hlmLabel for="airplane">Airplane mode</label>
</div>

<!-- two-way binding + change output -->
<hlm-switch [(checked)]="enabled" (changed)="onChanged($event)" />

<!-- disabled -->
<hlm-switch [disabled]="true" />
```

The component renders an inner `<brn-switch>` + `<brn-switch-thumb hlm>` pair. The outer `<hlm-switch>` host uses `class="contents"` and nulls its own `id`/`aria-*` attributes — set `id`, `aria-label`, `aria-labelledby`, `aria-describedby` as inputs and they are forwarded to the inner `brn-switch`.

## API reference

### `HlmSwitch` — selector `hlm-switch` (component, `ControlValueAccessor`)

| Input              | Type                                        | Default | Description                                                            |
| ------------------ | ------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `checked`          | `model<boolean>` (two-way bindable)         | `false` | Checked state. Supports `[(checked)]`.                                 |
| `disabled`         | `boolean` (coerced with `booleanAttribute`) | `false` | Disabled state (also set via `setDisabledState` from forms).           |
| `id`               | `string \| null`                            | `null`  | Forwarded to the inner `<brn-switch>` `id` (pairs with `<label for>`). |
| `aria-label`       | `string \| null` (alias `ariaLabel`)        | `null`  | Forwarded `aria-label`.                                                |
| `aria-labelledby`  | `string \| null` (alias `ariaLabelledby`)   | `null`  | Forwarded `aria-labelledby`.                                           |
| `aria-describedby` | `string \| null` (alias `ariaDescribedby`)  | `null`  | Forwarded `aria-describedby` (e.g. hint text id).                      |
| `class`            | `ClassValue` (aliased input `userClass`)    | `''`    | Extra classes merged onto the inner `brn-switch` track.                |

| Output    | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `changed` | `boolean` | Emits whenever the checked state changes. |

`ControlValueAccessor` methods (used by Angular forms, not called directly): `writeValue(value: boolean)`, `registerOnChange(fn)`, `registerOnTouched(fn)`, `setDisabledState(isDisabled: boolean)`. Also exports `EG_SWITCH_VALUE_ACCESSOR` (`NG_VALUE_ACCESSOR` provider).

### `HlmSwitchThumb` — selector `brn-switch-thumb[hlm], [hlmSwitchThumb]` (directive)

Thin styling directive for hand-built `brn-switch` compositions. Only one input:

| Input   | Type         | Default | Description                                  |
| ------- | ------------ | ------- | -------------------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged onto the thumb element. |

You rarely need this — `<hlm-switch>` already includes `<brn-switch-thumb hlm />` internally.

## Examples

### 1. Basic usage with label

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmSwitchImports, HlmLabel],
  template: `
    <div class="flex items-center gap-2">
      <hlm-switch id="airplane" />
      <label hlmLabel for="airplane">Airplane mode</label>
    </div>
  `,
})
export class DemoBasic {}
```

### 2. Two-way binding + `changed` output

```ts
// demo-bound.component.ts
import { Component, signal } from '@angular/core';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'demo-bound',
  standalone: true,
  imports: [...HlmSwitchImports],
  template: `
    <hlm-switch [(checked)]="enabled" (changed)="log($event)" aria-label="Enable notifications" />
    <p class="text-sm text-muted-foreground">Notifications {{ enabled() ? 'on' : 'off' }}</p>
  `,
})
export class DemoBound {
  readonly enabled = signal(true);

  log(v: boolean) {
    console.log('switch changed:', v);
  }
}
```

### 3. Reactive forms (`formControl`)

`HlmSwitch` implements `ControlValueAccessor`, so `formControl` / `formControlName` work directly.

```ts
// demo-reactive.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'demo-reactive',
  standalone: true,
  imports: [...HlmSwitchImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="flex items-center gap-2">
      <hlm-switch formControlName="marketing" id="marketing" />
      <label for="marketing">Marketing emails</label>
    </form>
    <p class="text-sm">Value: {{ form.value | json }}</p>
  `,
})
export class DemoReactive {
  readonly form = new FormGroup({ marketing: new FormControl(false) });
}
```

### 4. Template-driven forms (`ngModel`)

```ts
// demo-template.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'demo-template',
  standalone: true,
  imports: [...HlmSwitchImports, FormsModule],
  template: `
    <hlm-switch [(ngModel)]="dark" name="dark" aria-label="Dark mode" />
    <p class="text-sm">Dark mode {{ dark ? 'on' : 'off' }}</p>
  `,
})
export class DemoTemplate {
  dark = false;
}
```

### 5. Disabled / loading states

```ts
// demo-states.component.ts
import { Component, signal } from '@angular/core';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'demo-states',
  standalone: true,
  imports: [...HlmSwitchImports],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <hlm-switch [checked]="true" [disabled]="true" />
        <span class="text-sm">On, disabled</span>
      </div>
      <div class="flex items-center gap-2">
        <hlm-switch [checked]="false" [disabled]="true" />
        <span class="text-sm">Off, disabled</span>
      </div>
      <div class="flex items-center gap-2">
        <hlm-switch [disabled]="saving()" aria-label="Sync" />
        <span class="text-sm">{{ saving() ? 'Saving…' : 'Sync enabled' }}</span>
      </div>
    </div>
  `,
})
export class DemoStates {
  readonly saving = signal(true);
}
```

> Disabled switches render `cursor-not-allowed` + `opacity-50` automatically via `data-[disabled=true]` styles.

### 6. Advanced: settings list + custom thumb composition

Settings-list pattern with descriptions wired via `aria-describedby`:

```ts
// demo-settings.component.ts
import { Component, signal } from '@angular/core';
import { HlmSwitchImports } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'demo-settings',
  standalone: true,
  imports: [...HlmSwitchImports],
  template: `
    <div class="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div>
        <p class="text-sm font-medium">Two-factor authentication</p>
        <p id="tfa-hint" class="text-sm text-muted-foreground">Require a code at sign-in.</p>
      </div>
      <hlm-switch [(checked)]="tfa" aria-describedby="tfa-hint" aria-label="Two-factor authentication" />
    </div>
  `,
})
export class DemoSettings {
  readonly tfa = signal(false);
}
```

Custom composition with `HlmSwitchThumb` directly on a `brn-switch` (rare — only when you need full control of the track):

```ts
// demo-custom.component.ts
import { Component } from '@angular/core';
import { BrnSwitch, BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { HlmSwitchThumb } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'demo-custom',
  standalone: true,
  imports: [BrnSwitch, BrnSwitchThumb, HlmSwitchThumb],
  template: `
    <brn-switch class="my-track-classes">
      <brn-switch-thumb hlm class="my-thumb-overrides" />
    </brn-switch>
  `,
})
export class DemoCustom {}
```

## Accessibility notes

- A switch must always have an accessible name: pair it with a visible `<label>` (via matching `id`/`for`), or set `aria-label` / `aria-labelledby`.
- Use `aria-describedby` to associate hint text, as in the settings example above.
- The inner `brn-switch` handles `role="switch"`, `aria-checked`, and keyboard interaction (Space/Enter); do not add your own key handlers.
- Disabled switches are exposed as `aria-disabled`/`data-[disabled=true]` — keep them focusable-visible but non-interactive, and explain _why_ they are disabled in nearby text when it is not obvious.
- Prefer switches for immediate-effect on/off settings; use a checkbox for multi-select or form-submission choices.

## Theming / CSS variables

The track uses theme tokens (`data-[state=checked]:bg-primary`, `bg-input`, `border-ring`, `ring-ring/50`) and the thumb uses `bg-background` / dark-mode `bg-foreground` / `bg-primary-foreground` shifts. Both follow your shadcn CSS-variable theme. Pass `class` to append/override track utilities (merged with `hlm()`).

## Related subpaths

- `@egose/shadcn-theme-ng/label` — accessible labels for switches.
- `@egose/shadcn-theme-ng/checkbox` — alternative boolean control for forms.
- `@egose/shadcn-theme-ng/form-checkbox` — labeled checkbox+description field pattern.
- `@egose/shadcn-theme-ng/toggle` — press-state button (vs. a switch track).
