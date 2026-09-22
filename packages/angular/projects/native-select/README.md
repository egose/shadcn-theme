# Native Select (`@egose/shadcn-theme-ng/native-select`)

Zero-dependency HTML `<select>` with shadcn styling (shadcn/ui `native-select` equivalent). No overlay, no CDK menu, no listbox emulation — a real `<select>` inside a positioning wrapper with a chevron icon, wired as an Angular `ControlValueAccessor` and a spartan-ng `BrnFieldControl`/`BrnLabelable` so it participates in `formControl`/`ngModel`, `hlm-label` association, and field error states.

Ships as `@egose/shadcn-theme-ng/native-select` and `@egose/shadcn-theme-ng-tw/native-select` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency; at runtime it also uses `@ng-icons/lucide` (`lucideChevronDown`), `@spartan-ng/brain/field`, and `@spartan-ng/brain/forms` types. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmNativeSelect, // component: hlm-native-select (CVA)
  HlmNativeSelectOption, // directive: option[hlmNativeSelectOption]
  HlmNativeSelectOptGroup, // directive: optgroup[hlmNativeSelectOptGroup]
  HLM_NATIVE_SELECT_VALUE_ACCESSOR, // NG_VALUE_ACCESSOR provider const
  HlmNativeSelectImports, // readonly [HlmNativeSelect, HlmNativeSelectOption, HlmNativeSelectOptGroup]
  HlmNativeSelectModule, // NgModule wrapping HlmNativeSelectImports
} from '@egose/shadcn-theme-ng/native-select';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmNativeSelectImports],
  template: `
    <hlm-native-select>
      <option hlmNativeSelectOption value="apple">Apple</option>
    </hlm-native-select>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmNativeSelectModule } from '@egose/shadcn-theme-ng/native-select';

@NgModule({ imports: [HlmNativeSelectModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/native-select`. Symbol names are identical.

## Anatomy / Structure

```html
<hlm-native-select>
  <option hlmNativeSelectOption value="">Choose a fruit…</option>
  <optgroup hlmNativeSelectOptGroup label="Citrus">
    <option hlmNativeSelectOption value="orange">Orange</option>
    <option hlmNativeSelectOption value="lemon">Lemon</option>
  </optgroup>
  <option hlmNativeSelectOption value="apple">Apple</option>
</hlm-native-select>

<!-- sizes + classes -->
<hlm-native-select size="sm" selectClass="tw:w-48" selectIconClass="tw:text-primary">
  <option hlmNativeSelectOption value="s">Small</option>
</hlm-native-select>
```

Rendered DOM: the host (`data-slot="native-select-wrapper"`, `group/native-select relative w-fit`) projects your options into an inner native `<select data-slot="native-select">` plus an absolutely-positioned `lucideChevronDown` icon (`data-slot="native-select-icon"`). The inner select carries `data-size`, `data-invalid`, `data-dirty`, `data-touched`, and `data-matches-spartan-invalid` attributes for styling hooks.

| Class                     | Selector                            | Role                                                                                       |
| ------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `HlmNativeSelect`         | `hlm-native-select`                 | Wrapper + CVA + chevron                                                                    |
| `HlmNativeSelectOption`   | `option[hlmNativeSelectOption]`     | Styled `<option>` (`bg-[Canvas] text-[CanvasText]` so dropdown lists stay native-readable) |
| `HlmNativeSelectOptGroup` | `optgroup[hlmNativeSelectOptGroup]` | Styled `<optgroup>` (same Canvas treatment)                                                |

## API reference

### `HlmNativeSelect` (`hlm-native-select`, implements `ControlValueAccessor`)

| Member                                           | Kind          | Type / Default                          | Notes                                                                                             |
| ------------------------------------------------ | ------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `selectId`                                       | input         | `string`, auto `hlm-native-select-${n}` | Applied as the inner `<select>`'s `id`; also exposed as `labelableId` for `hlm-label` association |
| `selectClass`                                    | input         | `ClassValue`, `''`                      | Merged over the inner select classes                                                              |
| `selectIconClass`                                | input         | `ClassValue`, `''`                      | Merged over the chevron icon classes                                                              |
| `size`                                           | input         | `'sm' \| 'default'`, `'default'`        | Reflected as `data-size` on host + select; `sm` → `h-8` instead of `h-9`                          |
| `disabled`                                       | input         | `boolean`, `false` (boolean coercion)   | Initial disabled; reactive forms override via `setDisabledState` into `_disabled` linked signal   |
| `forceInvalid`                                   | input         | `boolean`, `false` (boolean coercion)   | Forces `data-matches-spartan-invalid` styling                                                     |
| `ariaInvalidOverride` (alias `aria-invalid`)     | input         | `boolean \| undefined`, `undefined`     | Manual `aria-invalid`; defaults to the parent `BrnFieldControl.invalid` state                     |
| `valueInput` (alias `value`)                     | input         | `string \| undefined \| null`, `''`     | One-way value; mirrored into the `value` linked signal                                            |
| `value`                                          | linked signal | `string \| undefined \| null`           | Current value; bound to the select's `[value]`                                                    |
| `valueChange`                                    | output        | `string \| undefined \| null`           | Emitted on native `change` alongside the CVA callback                                             |
| `labelableId`                                    | property      | = `selectId`                            | `BrnLabelable` contract for label association                                                     |
| `writeValue(v)`                                  | CVA method    |                                         | Sets `value`                                                                                      |
| `registerOnChange(fn)` / `registerOnTouched(fn)` | CVA methods   |                                         | Stored as `_onChange` / `_onTouched`; invoked on `change` / `change`+`blur`                       |
| `setDisabledState(isDisabled)`                   | CVA method    |                                         | Sets `_disabled`                                                                                  |

Host directives: `BrnFieldControl` (provides `invalid`/`touched`/`dirty`/`spartanInvalid` read by the template). Providers: `NG_VALUE_ACCESSOR` (`HLM_NATIVE_SELECT_VALUE_ACCESSOR`), `provideIcons({ lucideChevronDown })`, `provideBrnLabelable(HlmNativeSelect)`.

### `HlmNativeSelectOption` / `HlmNativeSelectOptGroup`

No inputs/outputs/methods. Pure styling directives setting `data-slot` (`native-select-option` / `native-select-optgroup`).

## Examples

### 1. Basic uncontrolled select

```ts
import { Component } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-native-basic',
  standalone: true,
  imports: [...HlmNativeSelectImports],
  template: `
    <hlm-native-select (valueChange)="onChange($event)">
      <option hlmNativeSelectOption value="">Choose a fruit…</option>
      <option hlmNativeSelectOption value="apple">Apple</option>
      <option hlmNativeSelectOption value="banana">Banana</option>
    </hlm-native-select>
    <p class="tw:text-sm tw:text-muted-foreground">Picked: {{ picked ?? 'nothing' }}</p>
  `,
})
export class NativeBasicComponent {
  picked: string | null | undefined;

  onChange(value: string | null | undefined): void {
    this.picked = value;
  }
}
```

### 2. Sizes and optgroups

```ts
import { Component } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-native-groups',
  standalone: true,
  imports: [...HlmNativeSelectImports],
  template: `
    <div class="tw:flex tw:flex-col tw:gap-4 tw:max-w-xs">
      <hlm-native-select size="sm">
        <option hlmNativeSelectOption value="s">Small</option>
        <option hlmNativeSelectOption value="m">Medium</option>
      </hlm-native-select>

      <hlm-native-select size="default">
        <option hlmNativeSelectOption value="">Choose a citrus…</option>
        <optgroup hlmNativeSelectOptGroup label="Citrus">
          <option hlmNativeSelectOption value="orange">Orange</option>
          <option hlmNativeSelectOption value="lemon">Lemon</option>
        </optgroup>
        <optgroup hlmNativeSelectOptGroup label="Berries">
          <option hlmNativeSelectOption value="strawberry">Strawberry</option>
          <option hlmNativeSelectOption value="blueberry">Blueberry</option>
        </optgroup>
      </hlm-native-select>
    </div>
  `,
})
export class NativeGroupsComponent {}
```

### 3. Reactive form + label

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-native-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, ...HlmNativeSelectImports, ...HlmLabelImports],
  template: `
    <form [formGroup]="form" class="tw:grid tw:gap-1.5 tw:max-w-xs">
      <label hlmLabel for="country">Country</label>
      <hlm-native-select selectId="country" formControlName="country">
        <option hlmNativeSelectOption value="">Select…</option>
        <option hlmNativeSelectOption value="de">Germany</option>
        <option hlmNativeSelectOption value="fr">France</option>
        <option hlmNativeSelectOption value="jp">Japan</option>
      </hlm-native-select>
      @if (form.controls.country.touched && form.controls.country.invalid) {
        <p class="tw:text-sm tw:text-destructive">Country is required.</p>
      }
      <button type="button" (click)="disable()">Toggle disabled</button>
    </form>
  `,
})
export class NativeReactiveComponent {
  readonly form = new FormGroup({
    country: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  disable(): void {
    const c = this.form.controls.country;
    c.disabled ? c.enable() : c.disable();
  }
}
```

### 4. Template-driven (`ngModel`) + two-way `value`

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-native-ngmodel',
  standalone: true,
  imports: [FormsModule, ...HlmNativeSelectImports],
  template: `
    <hlm-native-select [(ngModel)]="flavor">
      <option hlmNativeSelectOption value="vanilla">Vanilla</option>
      <option hlmNativeSelectOption value="chocolate">Chocolate</option>
      <option hlmNativeSelectOption value="mint">Mint</option>
    </hlm-native-select>
    <p class="tw:text-sm">Flavor: {{ flavor }}</p>

    <!-- one-way value input + valueChange output (no forms): -->
    <hlm-native-select [value]="flavor" (valueChange)="flavor = $event ?? ''">
      <option hlmNativeSelectOption value="vanilla">Vanilla</option>
      <option hlmNativeSelectOption value="chocolate">Chocolate</option>
    </hlm-native-select>
  `,
})
export class NativeNgModelComponent {
  flavor = 'vanilla';
}
```

### 5. Async options, invalid, and disabled states

```ts
import { Component, signal, OnInit } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-native-async',
  standalone: true,
  imports: [...HlmNativeSelectImports],
  template: `
    <div class="tw:grid tw:gap-4 tw:max-w-xs">
      <hlm-native-select [value]="selected()" (valueChange)="selected.set($event ?? '')">
        <option hlmNativeSelectOption value="">Loading…</option>
        @for (c of cities(); track c) {
          <option hlmNativeSelectOption [value]="c">{{ c }}</option>
        }
      </hlm-native-select>

      <hlm-native-select [forceInvalid]="true" value="bad">
        <option hlmNativeSelectOption value="bad">Forced invalid</option>
        <option hlmNativeSelectOption value="good">Good</option>
      </hlm-native-select>

      <hlm-native-select [disabled]="true" value="locked">
        <option hlmNativeSelectOption value="locked">Disabled</option>
      </hlm-native-select>
    </div>
  `,
})
export class NativeAsyncComponent implements OnInit {
  readonly cities = signal<string[]>([]);
  readonly selected = signal('');

  async ngOnInit(): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    this.cities.set(['Berlin', 'Paris', 'Tokyo']);
  }
}
```

### 6. Custom widths and icon tint

```ts
import { Component } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';

@Component({
  selector: 'app-native-styled',
  standalone: true,
  imports: [...HlmNativeSelectImports],
  template: `
    <hlm-native-select selectClass="tw:w-56" selectIconClass="tw:text-primary" size="sm">
      <option hlmNativeSelectOption value="a">Compact tinted chevron</option>
      <option hlmNativeSelectOption value="b">Option B</option>
    </hlm-native-select>
  `,
})
export class NativeStyledComponent {}
```

## Accessibility notes

- A native `<select>` gives you listbox semantics, keyboard support (arrows/typeahead), and mobile pickers for free — prefer it over a custom dropdown when the option list is simple.
- Associate with `<label hlmLabel for="…">` matching `selectId` (or nest contextually); invalid state flows to `aria-invalid` automatically via `BrnFieldControl` unless overridden with `aria-invalid`.
- Keep the first `<option>` a real placeholder with `value=""` when a choice is required, and validate accordingly.
- `forceInvalid` is visual + `data-*` styling; still set form errors so screen readers announce the problem.

## Theming / CSS variables

No theming inputs. The select uses `border-input`, `ring-ring`, `bg-muted`-adjacent tokens with dark-mode (`dark:bg-input/30`) and invalid (`border-destructive ring-destructive`) treatments. Extend via `selectClass` / `selectIconClass` (merged after base classes).

## Related subpaths

- `@egose/shadcn-theme-ng/select` — custom overlay select for searchable/rich options; use native-select when a plain `<select>` suffices.
- `@egose/shadcn-theme-ng/label` — label association via `selectId`/`labelableId`.
- `@egose/shadcn-theme-ng/form-field` — field wrapper with error display that reads the same `BrnFieldControl` state.
