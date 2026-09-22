# Checkbox (`@egose/shadcn-theme-ng/checkbox`)

A shadcn/ui-style checkbox — the Angular port of shadcn/ui `Checkbox`. A single standalone `hlm-checkbox` component wraps `BrnCheckbox` from `@spartan-ng/brain/checkbox`, renders the `lucideCheck` icon when checked, and fully implements `ControlValueAccessor`, so it works with `[(checked)]`, `[(ngModel)]`, and reactive `FormControl`s. Supports the tri-state `boolean | 'indeterminate'` model, separate `disabled` (form-aware) vs `wrapperDisabled` (visual-only) locks, and a `changed` output.

Ships as `@egose/shadcn-theme-ng/checkbox` and `@egose/shadcn-theme-ng-tw/checkbox` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common` and `@angular/core` as peers (see `projects/checkbox/package.json`); `FormsModule`/`ReactiveFormsModule` come from your app when you use form bindings.

## Imports

```ts
import {
  HlmCheckbox,
  HlmCheckboxImports,
  HlmCheckboxModule,
  HLM_CHECKBOX_VALUE_ACCESSOR,
} from '@egose/shadcn-theme-ng/checkbox';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/checkbox';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmCheckboxImports],
  template: `<hlm-checkbox />`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmCheckboxModule } from '@egose/shadcn-theme-ng/checkbox';

@NgModule({ imports: [HlmCheckboxModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<!-- Two-way model binding -->
<hlm-checkbox [(checked)]="accept" aria-label="Accept terms" />

<!-- With visible label -->
<div class="flex items-center gap-2">
  <hlm-checkbox id="marketing" [(checked)]="marketing" />
  <label for="marketing">Email me product updates</label>
</div>

<!-- Reactive form -->
<hlm-checkbox formControlName="accept" />

<!-- Template-driven -->
<hlm-checkbox name="accept" [(ngModel)]="accept" />
```

Real selector: `hlm-checkbox` (element only). The host renders `class="contents peer"` so sibling label/description selectors (`peer-*`) keep working; `id` / `aria-*` attributes are nulled on the host and forwarded to the inner `brn-checkbox` instead. Set a visible label with a native `<label for>` — the component does not render label text itself.

## API reference

### `HlmCheckbox` (`hlm-checkbox`)

| Input                                  | Type                                | Default | Description                                                                                                                                        |
| -------------------------------------- | ----------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checked`                              | `model<boolean \| 'indeterminate'>` | `false` | Checked state. Two-way bindable (`[(checked)]`). `'indeterminate'` renders the checked icon; clicking it resolves to `true`.                       |
| `class` (`userClass`)                  | `ClassValue`                        | `''`    | Extra classes merged into the box.                                                                                                                 |
| `id`                                   | `string \| null`                    | `null`  | Forwarded to inner `brn-checkbox`. Pair with `<label for>`.                                                                                        |
| `aria-label` (`ariaLabel`)             | `string \| null`                    | `null`  | Forwarded aria-label.                                                                                                                              |
| `aria-labelledby` (`ariaLabelledby`)   | `string \| null`                    | `null`  | Forwarded aria-labelledby.                                                                                                                         |
| `aria-describedby` (`ariaDescribedby`) | `string \| null`                    | `null`  | Forwarded aria-describedby.                                                                                                                        |
| `name`                                 | `string \| null`                    | `null`  | Forwarded `name`.                                                                                                                                  |
| `required`                             | `boolean`                           | `false` | Forwarded `required` (boolean-coerced).                                                                                                            |
| `disabled`                             | `boolean`                           | `false` | Visual + interaction lock (boolean-coerced). Clicks are ignored.                                                                                   |
| `wrapperDisabled`                      | `boolean`                           | `false` | Additional visual/interaction lock that does **not** write to a reactive form control (unlike `setDisabledState`). Useful for preview-only states. |

| Signal          | Type              | Description                                                                                                  |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `disabledState` | `Signal<boolean>` | `disabled() \|\| wrapperDisabled() \|\| formDisabled()` — the effective lock. Host reflects `data-disabled`. |

| Output    | Payload   | Description                                                                                                    |
| --------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| `changed` | `boolean` | Emitted on user toggle with the new boolean (`!previous`). Note: toggling from `'indeterminate'` emits `true`. |

ControlValueAccessor: `writeValue(value)`, `registerOnChange`, `registerOnTouched`, `setDisabledState(isDisabled)` (writes `formDisabled`, hence `disabledState`). `HLM_CHECKBOX_VALUE_ACCESSOR` (`NG_VALUE_ACCESSOR`, `forwardRef(HlmCheckbox)`, `multi: true`) is provided on the component.

## Examples

### 1. Basic with label

```ts
import { Component, signal } from '@angular/core';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-basic-checkbox',
  standalone: true,
  imports: [...HlmCheckboxImports],
  template: `
    <div class="flex items-center gap-2">
      <hlm-checkbox id="terms" [(checked)]="accept" />
      <label for="terms" class="text-sm">Accept terms and conditions</label>
    </div>
    <p class="mt-2 text-sm">Value: {{ accept() }}</p>
  `,
})
export class BasicCheckboxComponent {
  readonly accept = signal<boolean | 'indeterminate'>(false);
}
```

### 2. Reactive form with validation

`hlm-checkbox` is a `ControlValueAccessor` — `formControlName` just works, including `disable()`.

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-reactive-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, ...HlmCheckboxImports],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3">
      <div class="flex items-center gap-2">
        <hlm-checkbox id="accept" formControlName="accept" />
        <label for="accept" class="text-sm">I agree to the privacy policy</label>
      </div>
      @if (form.controls.accept.touched && form.controls.accept.invalid) {
        <p class="text-destructive text-sm">You must accept to continue.</p>
      }
      <button type="submit" [disabled]="form.invalid">Continue</button>
      <button type="button" (click)="form.controls.accept.disable()">Disable via form</button>
    </form>
  `,
})
export class ReactiveCheckboxComponent {
  readonly form = new FormGroup({
    accept: new FormControl(false, { validators: Validators.requiredTrue, nonNullable: true }),
  });
  submit() {
    console.log(this.form.getRawValue());
  }
}
```

### 3. Template-driven (`ngModel`)

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-ngmodel-checkbox',
  standalone: true,
  imports: [FormsModule, ...HlmCheckboxImports],
  template: `
    <div class="flex items-center gap-2">
      <hlm-checkbox id="news" name="news" [(ngModel)]="subscribed" aria-label="Subscribe to newsletter" />
      <label for="news" class="text-sm">Subscribe to newsletter</label>
    </div>
  `,
})
export class NgModelCheckboxComponent {
  subscribed = true;
}
```

### 4. Indeterminate + select-all pattern

Parent shows `'indeterminate'` when some (not all) children are checked — the classic bulk-select header.

```ts
import { Component, computed, signal } from '@angular/core';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-select-all',
  standalone: true,
  imports: [...HlmCheckboxImports],
  template: `
    <div class="flex items-center gap-2 border-b pb-2">
      <hlm-checkbox id="all" [checked]="parentState()" (changed)="toggleAll($event)" aria-label="Select all files" />
      <label for="all" class="text-sm font-medium">Select all</label>
    </div>
    @for (f of files(); track f.id) {
      <div class="flex items-center gap-2 py-1">
        <hlm-checkbox [id]="f.id" [checked]="f.done" (changed)="toggleOne(f.id, $event)" />
        <label [for]="f.id" class="text-sm">{{ f.name }}</label>
      </div>
    }
  `,
})
export class SelectAllComponent {
  readonly files = signal([
    { id: 'f1', name: 'invoice.pdf', done: true },
    { id: 'f2', name: 'photo.png', done: false },
    { id: 'f3', name: 'notes.md', done: false },
  ]);
  readonly parentState = computed<boolean | 'indeterminate'>(() => {
    const all = this.files();
    if (all.every((f) => f.done)) return true;
    if (all.some((f) => f.done)) return 'indeterminate';
    return false;
  });
  toggleAll(next: boolean) {
    this.files.update((fs) => fs.map((f) => ({ ...f, done: next })));
  }
  toggleOne(id: string, next: boolean) {
    this.files.update((fs) => fs.map((f) => (f.id === id ? { ...f, done: next } : f)));
  }
}
```

### 5. Disabled / wrapper-disabled / required states

```ts
import { Component, signal } from '@angular/core';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-states-checkbox',
  standalone: true,
  imports: [...HlmCheckboxImports],
  template: `
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <hlm-checkbox id="d1" [disabled]="true" aria-label="Disabled unchecked" />
        <label for="d1" class="text-sm opacity-70">Disabled (unchecked)</label>
      </div>
      <div class="flex items-center gap-2">
        <hlm-checkbox id="d2" [checked]="true" [disabled]="true" aria-label="Disabled checked" />
        <label for="d2" class="text-sm opacity-70">Disabled (checked)</label>
      </div>
      <div class="flex items-center gap-2">
        <hlm-checkbox id="w1" [wrapperDisabled]="preview()" aria-label="Preview lock" />
        <label for="w1" class="text-sm">Preview lock (visual only — form value untouched)</label>
      </div>
      <div class="flex items-center gap-2">
        <hlm-checkbox id="r1" [(checked)]="v" [required]="true" aria-label="Required" />
        <label for="r1" class="text-sm">Required</label>
      </div>
    </div>
  `,
})
export class StatesCheckboxComponent {
  readonly preview = signal(true);
  v = false;
}
```

### 6. Listening to `changed` + custom styling

```ts
import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-changed-checkbox',
  standalone: true,
  imports: [...HlmCheckboxImports],
  template: `
    <div class="flex items-center gap-2">
      <hlm-checkbox
        id="audit"
        class="data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
        aria-label="Enable audit log"
        (changed)="onChanged($event)"
      />
      <label for="audit" class="text-sm">Enable audit log</label>
    </div>
    <p class="mt-1 text-sm">Last event: {{ lastChanged === null ? 'none' : lastChanged }}</p>
  `,
})
export class ChangedCheckboxComponent {
  lastChanged: boolean | null = null;
  onChanged(next: boolean) {
    this.lastChanged = next;
    console.log('checkbox changed →', next);
  }
}
```

## Accessibility notes

- The component renders a native-checkbox-equivalent `brn-checkbox` with `aria-label`/`labelledby`/`describedby` forwarding — always provide one: visible `<label for>` preferred, `aria-label` for icon-only rows.
- `disabledState` adds `data-disabled`, `cursor-not-allowed`, and `opacity-50`; disabled boxes are skipped correctly because clicks early-return.
- The check glyph is decorative (`lucideCheck` icon, no text) — state is exposed via `data-[state]` / native semantics, not the icon.
- Tri-state: `'indeterminate'` is a visual/model state, not `aria-checked="mixed"` — if you need mixed semantics for a tree, add `aria-checked` handling at your own level and test with a screen reader.

## Theming / CSS variables

No component-specific CSS variables. The box uses `border-input`, `data-[state=checked]:bg-primary` / `text-primary-foreground`, `focus-visible:ring-ring/50`, `aria-invalid:border-destructive`, `size-4 rounded-[4px]`. Invalid-form styling integrates via `aria-invalid` ring tokens. Pass `class` to extend (merged with `hlm()`).

## Related subpaths

- `@egose/shadcn-theme-ng/form-checkbox` — labeled + described + validated field composition.
- `@egose/shadcn-theme-ng/label` — accessible labels for the `for`/`id` pair.
- `@egose/shadcn-theme-ng/field` — form layout rows that host checkboxes.
- `@egose/shadcn-theme-ng/icon` — `HlmIcon` sizing used by the inner check glyph.
