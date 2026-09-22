# Textarea (`@egose/shadcn-theme-ng/textarea`)

A multi-line text input, equivalent to [shadcn/ui Textarea](https://ui.shadcn.com/docs/components/textarea). This subpath ships a single thin styling directive, `HlmTextarea` (`[hlmTextarea]`), over spartan-ng's `BrnTextarea` primitive (plus `BrnFieldControlDescribedBy` for form-field hint/error wiring). All behavior — value binding, validation, auto-sizing — comes from the Brn primitive and Angular forms; this package only applies shadcn styling (border, focus ring, invalid state, placeholder color).

> **Ships as:** `@egose/shadcn-theme-ng/textarea` and `@egose/shadcn-theme-ng-tw/textarea` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@spartan-ng/brain` arrives transitively; `FormsModule`/`ReactiveFormsModule` come from your app when you need form bindings. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/textarea/src/public-api.ts`:

```ts
import { HlmTextarea, HlmTextareaImports, HlmTextareaModule } from '@egose/shadcn-theme-ng/textarea';
// tw variant:
// import { HlmTextarea, HlmTextareaImports, HlmTextareaModule } from '@egose/shadcn-theme-ng-tw/textarea';
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmTextareaImports } from '@egose/shadcn-theme-ng/textarea';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmTextareaImports],
  template: `<textarea hlmTextarea placeholder="Type here…"></textarea>`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmTextareaModule } from '@egose/shadcn-theme-ng/textarea';

@NgModule({ imports: [HlmTextareaModule] })
export class FeatureModule {}
```

| Symbol               | Kind          | Description                                          |
| -------------------- | ------------- | ---------------------------------------------------- |
| `HlmTextarea`        | Directive     | `[hlmTextarea]` — shadcn styling over `BrnTextarea`. |
| `HlmTextareaImports` | `const` array | `[HlmTextarea]` — spread into `imports: [...]`.      |
| `HlmTextareaModule`  | NgModule      | Imports + re-exports `HlmTextarea`.                  |

## Anatomy / Structure

```html
<!-- basic -->
<textarea hlmTextarea placeholder="Tell us about yourself…"></textarea>

<!-- with label + hint -->
<div class="space-y-2">
  <label hlmLabel for="bio">Bio</label>
  <textarea hlmTextarea id="bio" rows="4" placeholder="Short bio…"></textarea>
  <p class="text-sm text-muted-foreground">Up to 500 characters.</p>
</div>

<!-- reactive form -->
<textarea hlmTextarea formControlName="notes" rows="5"></textarea>

<!-- forced invalid state -->
<textarea hlmTextarea [forceInvalid]="true"></textarea>
```

## API reference

### `HlmTextarea` — selector `[hlmTextarea]` (directive, hosts `BrnTextarea` + `BrnFieldControlDescribedBy`)

The directive declares **no own inputs/outputs**. All behavior comes from host directives:

| Input          | Source                       | Description                                                                              |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| `id`           | `BrnTextarea`                | Element id (pairs with `<label for>` and form-field wiring).                             |
| `forceInvalid` | `BrnTextarea`                | Force the `data-[matches-spartan-invalid=true]` invalid styles even without form errors. |
| (described-by) | `BrnFieldControlDescribedBy` | Auto-wires `aria-describedby` to enclosing form-field hint/error.                        |

Standard native attributes (`rows`, `placeholder`, `disabled`, `readonly`, `maxlength`, `name`, …) and Angular form bindings (`formControl`, `formControlName`, `ngModel`) work as usual through the underlying `<textarea>`.

Host: `data-slot="textarea"`. Invalid styling keys off `data-[matches-spartan-invalid=true]` (`border-destructive`, `ring-destructive`). Disabled state renders `cursor-not-allowed` + `opacity-50`. User `class` is preserved and merged via `classes()`.

## Examples

### 1. Basic usage with label

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmTextareaImports } from '@egose/shadcn-theme-ng/textarea';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmTextareaImports, HlmLabel],
  template: `
    <div class="space-y-2">
      <label hlmLabel for="bio">Bio</label>
      <textarea hlmTextarea id="bio" rows="4" placeholder="Tell us about yourself…"></textarea>
    </div>
  `,
})
export class DemoBasic {}
```

### 2. Reactive form with validation + character count

```ts
// demo-reactive.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmTextareaImports } from '@egose/shadcn-theme-ng/textarea';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'demo-reactive',
  standalone: true,
  imports: [...HlmTextareaImports, ReactiveFormsModule, HlmLabel],
  template: `
    <form [formGroup]="form" class="space-y-2">
      <label hlmLabel for="feedback">Feedback</label>
      <textarea
        hlmTextarea
        id="feedback"
        rows="5"
        maxlength="500"
        placeholder="What did you think?"
        formControlName="feedback"
      ></textarea>
      <div class="flex justify-between text-sm">
        <span class="text-destructive">
          @if (form.controls.feedback.hasError('required') && form.controls.feedback.touched) {
            Feedback is required.
          } @else if (form.controls.feedback.hasError('minlength')) {
            At least 10 characters.
          }
        </span>
        <span class="text-muted-foreground">{{ form.controls.feedback.value?.length ?? 0 }}/500</span>
      </div>
    </form>
  `,
})
export class DemoReactive {
  readonly form = new FormGroup({
    feedback: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });
}
```

### 3. Template-driven form (`ngModel`)

```ts
// demo-template.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmTextareaImports } from '@egose/shadcn-theme-ng/textarea';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'demo-template',
  standalone: true,
  imports: [...HlmTextareaImports, FormsModule, HlmLabel],
  template: `
    <div class="space-y-2">
      <label hlmLabel for="notes">Notes</label>
      <textarea hlmTextarea id="notes" name="notes" rows="3" [(ngModel)]="notes"></textarea>
      <p class="text-sm text-muted-foreground">Preview: {{ notes || '—' }}</p>
    </div>
  `,
})
export class DemoTemplate {
  notes = '';
}
```

### 4. Disabled / readonly / error states

```ts
// demo-states.component.ts
import { Component } from '@angular/core';
import { HlmTextareaImports } from '@egose/shadcn-theme-ng/textarea';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'demo-states',
  standalone: true,
  imports: [...HlmTextareaImports, HlmLabel],
  template: `
    <div class="space-y-4">
      <div class="space-y-2">
        <label hlmLabel for="t-disabled">Disabled</label>
        <textarea hlmTextarea id="t-disabled" disabled placeholder="Cannot edit…"></textarea>
      </div>
      <div class="space-y-2">
        <label hlmLabel for="t-readonly">Readonly</label>
        <textarea hlmTextarea id="t-readonly" readonly rows="2">Submitted value, read only.</textarea>
      </div>
      <div class="space-y-2">
        <label hlmLabel for="t-invalid">Forced invalid</label>
        <textarea hlmTextarea id="t-invalid" [forceInvalid]="true" rows="2">Fails custom rule.</textarea>
        <p class="text-sm text-destructive">Custom server error goes here.</p>
      </div>
    </div>
  `,
})
export class DemoStates {}
```

### 5. Inside a form-field (hint + error wiring)

`BrnFieldControlDescribedBy` auto-links the textarea to the surrounding field's hint/error for screen readers:

```ts
// demo-field.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmTextareaImports } from '@egose/shadcn-theme-ng/textarea';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';

@Component({
  selector: 'demo-field',
  standalone: true,
  imports: [...HlmTextareaImports, ...HlmFormFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <hlm-form-field>
        <label hlmLabel for="desc">Description</label>
        <textarea hlmTextarea id="desc" formControlName="description" rows="4"></textarea>
        <hlm-hint>Describe the issue in a few sentences.</hlm-hint>
        <hlm-error>Description is required.</hlm-error>
      </hlm-form-field>
    </form>
  `,
})
export class DemoField {
  readonly form = new FormGroup({ description: new FormControl('', Validators.required) });
}
```

(Exact `hlm-form-field`/`hlm-hint`/`hlm-error` selector names come from `@egose/shadcn-theme-ng/form-field` — check that subpath for the current API.)

### 6. Autosize / custom sizing

The base styles include `field-sizing-content` + `min-h-16`, so the textarea grows with content in supporting browsers. Combine with `rows` and width utilities:

```html
<!-- fixed 8 rows, full width (default w-full) -->
<textarea hlmTextarea rows="8" placeholder="Long-form answer…"></textarea>

<!-- constrained width + no manual resize -->
<textarea hlmTextarea rows="4" class="max-w-xl resize-none" placeholder="No drag handle…"></textarea>

<!-- tall monospace variant for code -->
<textarea hlmTextarea rows="10" class="font-mono text-sm" spellcheck="false"></textarea>
```

## Accessibility notes

- Every textarea needs a visible `<label>` (matching `for`/`id`) — placeholders are not labels.
- Wire hint/error text with `aria-describedby` (automatic inside `hlm-form-field` via `BrnFieldControlDescribedBy`; manual `aria-describedby="hint-id"` otherwise).
- Surface validation errors both visually (`forceInvalid` / form errors → `border-destructive`) and as text adjacent to the field; do not rely on color alone.
- Keep `maxlength` announcements truthful — show a live character count for constrained fields.
- Disabled textareas are skipped by assistive tech; use `readonly` when the value must remain perceivable but not editable.

## Theming / CSS variables

Keys off theme tokens (`border-input`, `bg-input/30` in dark mode, `ring-ring/50`, `text-muted-foreground` placeholder, `border-destructive`/`ring-destructive` invalid). Follows your shadcn theme automatically; extend via `class` (merged through `classes()`).

## Related subpaths

- `@egose/shadcn-theme-ng/input` — single-line sibling control.
- `@egose/shadcn-theme-ng/label` — accessible labels.
- `@egose/shadcn-theme-ng/form-field` / `@egose/shadcn-theme-ng/form-textarea` — labeled field with hint/error wiring.
- `@egose/shadcn-theme-ng/button` — submit actions for textarea forms.
