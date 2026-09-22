# Input (`@egose/shadcn-theme-ng/input`)

`HlmInput` is a thin styling directive that gives any native `<input>` (or `<textarea>`) the shadcn/ui _Input_ look — the Angular counterpart of shadcn/ui's `<Input />`. Behavior comes from spartan-ng's `BrnInput` (plus field `aria-describedby` propagation); this directive adds the theme classes, `data-slot="input"`, invalid-state rings, and disabled/file styles.

> **Ships as:** `@egose/shadcn-theme-ng/input` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/input` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@angular/forms`, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { HlmInputImports } from '@egose/shadcn-theme-ng/input';
// tw variant:
// import { HlmInputImports } from '@egose/shadcn-theme-ng-tw/input';
```

## Imports

```ts
// Standalone component — spread the imports array:
import { HlmInputImports } from '@egose/shadcn-theme-ng/input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, HlmInputImports],
  template: `<input hlmInput formControlName="email" type="email" />`,
})
export class MyComp {}
```

```ts
// NgModule-based — import the module:
import { HlmInputModule } from '@egose/shadcn-theme-ng/input';

@NgModule({ imports: [HlmInputModule] })
export class MyModule {}
```

Exported from `src/public-api.ts`: `HlmInput`, plus `HlmInputImports` and `HlmInputModule`. Import the directive class directly (`import { HlmInput } from '…'`) when you only need the one symbol.

## Anatomy / Structure

```html
<label for="email">Email</label> <input hlmInput id="email" type="email" placeholder="you@example.com" />
```

The directive matches `input[hlmInput]` usage in practice (selector `[hlmInput]`), sets `data-slot="input"`, binds `[attr.aria-describedby]` from its own input, and composes `BrnInput` (`id`, `forceInvalid`) + `BrnFieldControlDescribedBy` via `hostDirectives`. It is also the class hook reused by `textarea[hlmInput]` (see `form-textarea`) and by `input[hlmInputGroupInput]`.

## API reference

### `[hlmInput]` — `HlmInput`

| Input             | Type             | Default | Description                                                                                                         |
| ----------------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby` | `string \| null` | `null`  | Bound to `aria-describedby`. Combine with `<hlm-error>`/`<hlm-hint>` ids (the form wrappers do this automatically). |
| `id`              | (via `BrnInput`) | —       | Forwarded to the `BrnInput` host directive.                                                                         |
| `forceInvalid`    | (via `BrnInput`) | —       | Forwarded to the `BrnInput` host directive; forces the `data-matches-spartan-invalid` error styles.                 |

No outputs. Visual states are attribute-driven: `data-matches-spartan-invalid=true` switches the border/ring to destructive; `disabled` applies `pointer-events-none`, `cursor-not-allowed`, `opacity-50`. Base geometry: `h-9`, `rounded-md`, `text-base` (`md:text-sm`), full width.

## Examples

### 1. Basic text + reactive form

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmInputImports } from '@egose/shadcn-theme-ng/input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, HlmInputImports],
  template: `
    <form [formGroup]="form">
      <label for="username">Username</label>
      <input hlmInput id="username" formControlName="username" placeholder="jane_doe" />
    </form>
  `,
})
export class BasicExample {
  readonly form = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true }),
  });
}
```

### 2. Template-driven with `ngModel`

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  standalone: true,
  imports: [FormsModule, HlmInput],
  template: `
    <label for="nickname">Nickname</label>
    <input hlmInput id="nickname" name="nickname" [(ngModel)]="nickname" placeholder="janey" />
    <p>Hello, {{ nickname || 'stranger' }}!</p>
  `,
})
export class NgModelExample {
  nickname = '';
}
```

### 3. Types: email, password, number, search, file

```ts
import { Component } from '@angular/core';
import { HlmInputImports } from '@egose/shadcn-theme-ng/input';

@Component({
  standalone: true,
  imports: [HlmInputImports],
  template: `
    <div class="tw:grid tw:gap-3">
      <input hlmInput type="email" placeholder="Email" aria-label="Email" autocomplete="email" />
      <input hlmInput type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" />
      <input hlmInput type="number" placeholder="0" aria-label="Amount" min="0" />
      <input hlmInput type="search" placeholder="Search…" aria-label="Search" />
      <input hlmInput type="file" aria-label="Upload avatar" />
    </div>
  `,
})
export class TypesExample {}
```

> File inputs inherit the directive's `file:` styles (sized button text, transparent track) — no extra markup needed.

### 4. Disabled + invalid states

```ts
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, HlmInput],
  template: `
    <form [formGroup]="form">
      <input hlmInput formControlName="email" type="email" placeholder="you@example.com" aria-label="Email" />
      @if (form.controls.email.invalid && form.controls.email.touched) {
        <p class="tw:text-sm tw:text-red-600">Enter a valid email.</p>
      }
      <input hlmInput placeholder="Disabled field" aria-label="Disabled field" [disabled]="true" />
      <!-- force the error ring regardless of touch state -->
      <input hlmInput placeholder="Forced invalid" aria-label="Forced invalid" [forceInvalid]="true" />
    </form>
  `,
})
export class StatesExample {
  readonly form = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.email] }),
  });
}
```

### 5. Manual `aria-describedby` with hint + error (no form wrapper)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, HlmInput, HlmError, HlmHint],
  template: `
    <form [formGroup]="form">
      <label for="handle">Handle</label>
      <input
        hlmInput
        id="handle"
        formControlName="handle"
        placeholder="@jane"
        [ariaDescribedby]="describedBy()"
      />
      @if (showError()) {
        <hlm-error id="handle-error">Use 3+ lowercase letters.</hlm-error>
      } @else {
        <hlm-hint id="handle-hint">Your public @name.</hlm-hint>
      }
    </form>
  `,
})
export class DescribedByExample {
  readonly form = new FormGroup({
    handle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(3), Validators.pattern(/^[a-z]+$/)],
    }),
  });

  showError(): boolean {
    const c = this.form.controls.handle;
    return c.invalid && (c.dirty || c.touched);
  }

  describedBy(): string {
    return this.showError() ? 'handle-error' : 'handle-hint';
  }
}
```

### 6. Composition: search row with button (input + button)

```ts
import { Component, signal } from '@angular/core';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  standalone: true,
  imports: [HlmInput, HlmButton],
  template: `
    <div class="tw:flex tw:gap-2">
      <input
        hlmInput
        aria-label="Search docs"
        placeholder="Search docs…"
        [value]="query()"
        (input)="query.set($any($event.target).value)"
        (keydown.enter)="search()"
      />
      <button hlmBtn type="button" (click)="search()">Search</button>
    </div>
    @if (searched()) {
      <p role="status" class="tw:text-sm">Searching for “{{ query() }}”…</p>
    }
  `,
})
export class SearchRowExample {
  readonly query = signal('');
  readonly searched = signal(false);

  search() {
    this.searched.set(true);
  }
}
```

## Accessibility notes

- Always pair the input with a `<label for>` (or `aria-label`/`aria-labelledby` when the design is label-less). The directive does not generate labels.
- Wire `ariaDescribedby` to hint/error ids so screen readers announce help and validation together with the field. The `eg-form-*` wrappers automate this — copy their pattern when hand-rolling.
- Invalid styling is visual only until you expose the message text (e.g. `<hlm-error>` or `role="alert"`); use `forceInvalid` sparingly and only alongside a message.
- Keep native semantics: correct `type`, `autocomplete`, `required`, and `disabled` (not `aria-disabled` + click-guard) so AT and password managers behave.

## Theming / CSS variables

No component-specific CSS variables; colors/spacing come from the shared theme tokens (`--input`, `--ring`, `--destructive`, `--radius`, …). Taller fields: add `tw:h-11`; monospace/code looks: add `tw:font-mono`.

## Related subpaths

- `@egose/shadcn-theme-ng/form-text-input` — labeled + validated reactive-forms wrapper (prefer for forms).
- `@egose/shadcn-theme-ng/form-textarea` — multiline sibling reusing the same class hook.
- `@egose/shadcn-theme-ng/input-group` — joined prefix/input/suffix compositions.
- `@egose/shadcn-theme-ng/label` — `HlmLabel` for the `<label>` side.
