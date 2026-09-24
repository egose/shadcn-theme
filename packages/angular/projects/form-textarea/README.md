# Form Textarea (`@egose/shadcn-theme-ng/form-textarea`)

`EgFormTextarea` is a reactive-forms wrapper that bundles a `<label>`, a styled `<textarea hlmInput>`, and error/hint text into one form-ready row. It is the Angular equivalent of shadcn/ui's `<FormField> + <Textarea>` pattern for multiline input (comments, descriptions, bios), with generated ids, `aria-describedby` wiring, and `disabled` resolution handled for you.

> **Ships as:** `@egose/shadcn-theme-ng/form-textarea` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/form-textarea` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@angular/forms`, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';
// tw variant:
// import { EgFormTextarea } from '@egose/shadcn-theme-ng-tw/form-textarea';
```

## Imports

The public API (`src/public-api.ts`) exports exactly one symbol — the standalone component `EgFormTextarea`. There is no `*Imports` array and no `*Module` for this subpath; import the component class directly.

```ts
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `
    <form [formGroup]="form">
      <eg-form-textarea controlName="bio" label="Bio" placeholder="Tell us about yourself" />
    </form>
  `,
})
export class MyForm {}
```

Requirements:

- Must sit inside a `<form [formGroup]>` (it injects `FormGroupDirective` and provides `ControlContainer`).
- `controlName` is required — forwarded as `[formControlName]` to the inner `<textarea>`.
- The bound `FormControl` holds a `string`.

## Anatomy / Structure

```html
<eg-form-textarea controlName="bio" label="Bio">
  <!-- rendered internally -->
  <hlm-form-field>
    <label hlmLabel for="<effectiveId>">Bio <span>*</span></label>
    <textarea
      hlmInput
      id="<effectiveId>"
      name="bio"
      formControlName="bio"
      rows="3"
      placeholder="…"
      aria-describedby="<effectiveId>-error | <effectiveId>-hint"
    ></textarea>
    <hlm-error id="<effectiveId>-error">…</hlm-error>
    <hlm-hint id="<effectiveId>-hint">…</hlm-hint>
  </hlm-form-field>
</eg-form-textarea>
```

Real selectors: `eg-form-textarea`, `hlm-form-field`, `label[hlmLabel]`, `textarea[hlmInput]`, `hlm-error`, `hlm-hint`. Note the inner textarea reuses the `hlmInput` styling directive (same class hook as single-line inputs).

## API reference

### `eg-form-textarea` — `EgFormTextarea`

| Input                 | Type                            | Default     | Description                                                                                                                                                                                      |
| --------------------- | ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`               | `string \| undefined`           | `undefined` | Field label rendered as `<label hlmLabel>` bound to the textarea id.                                                                                                                             |
| `controlName`         | `string`                        | `''`        | **Required.** Control name in the parent `FormGroup`; forwarded as `formControlName` and `name`.                                                                                                 |
| `controlId`           | `string \| undefined`           | `undefined` | Explicit id; falls back to `id`, then generated `eg-form-textarea-…`.                                                                                                                            |
| `id`                  | `string \| undefined`           | `undefined` | Alias for an explicit id (same fallback chain).                                                                                                                                                  |
| `error`               | `string \| undefined`           | `undefined` | Error text rendered in `<hlm-error>`.                                                                                                                                                            |
| `autoError`           | `boolean`                       | `true`      | Auto-resolve the message from the control's `ValidationErrors` when `error` is unset. Explicit `error` always wins; `error=""` counts as unset. Global wording via `provideEgFormErrorMessages`. |
| `hint`                | `string \| undefined`           | `undefined` | Hint text rendered in `<hlm-hint>`.                                                                                                                                                              |
| `name`                | `string \| undefined`           | `undefined` | `name` attribute fallback when `controlName` is empty.                                                                                                                                           |
| `placeholder`         | `string`                        | `''`        | Placeholder text.                                                                                                                                                                                |
| `readonly`            | `boolean`                       | `false`     | Native `readonly` attribute.                                                                                                                                                                     |
| `disabled`            | `boolean`                       | `false`     | Wrapper-level disable (OR-ed with the reactive disabled state — see `effectiveDisabled()`).                                                                                                      |
| `maxlength`           | `string \| number \| null`      | `null`      | Native `maxlength`.                                                                                                                                                                              |
| `minlength`           | `string \| number \| null`      | `null`      | Native `minlength`.                                                                                                                                                                              |
| `required`            | `boolean`                       | `false`     | Native `required` + red `*` on the label.                                                                                                                                                        |
| `rows`                | `string \| number \| undefined` | `3`         | Native `rows` (visible height).                                                                                                                                                                  |
| `cols`                | `string \| number \| undefined` | `undefined` | Native `cols` (visible width).                                                                                                                                                                   |
| `class` (`userClass`) | `ClassValue`                    | `''`        | Extra host classes (merged over `tw:w-full`).                                                                                                                                                    |
| `labelClass`          | `string`                        | `''`        | Extra label classes (merged over `tw:mb-1 tw:gap-0`).                                                                                                                                            |
| `textareaClass`       | `string`                        | `''`        | Extra textarea classes (merged over `tw:mb-1`).                                                                                                                                                  |
| `errorClass`          | `string`                        | `''`        | Extra error classes (merged over `tw:mt-0`).                                                                                                                                                     |
| `hintClass`           | `string`                        | `''`        | Extra hint classes (merged over `tw:mt-0`).                                                                                                                                                      |

No outputs. Methods: `describedBy(): string | null` (error id when invalid + dirty/touched, else hint id, else `null`); `effectiveDisabled(): boolean` (`disabled()` OR the control's reactive disabled state). Readonly computeds: `effectiveId()`, `errorId()`, `hintId()`.

## Examples

### 1. Basic comment box

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `
    <form [formGroup]="form" (ngSubmit)="post()">
      <eg-form-textarea controlName="comment" label="Comment" placeholder="Write a comment…" [rows]="4" />
      <button type="submit">Post</button>
    </form>
  `,
})
export class BasicExample {
  readonly form = new FormGroup({
    comment: new FormControl<string>('', { nonNullable: true }),
  });

  post() {
    console.log(this.form.value.comment);
  }
}
```

### 2. Sizes via `rows` / `cols` / `textareaClass`

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `
    <form [formGroup]="form" class="tw:grid tw:gap-4">
      <eg-form-textarea controlName="short" label="Compact (2 rows)" [rows]="2" />
      <eg-form-textarea controlName="default" label="Default (3 rows)" />
      <eg-form-textarea controlName="tall" label="Tall composer" [rows]="8" textareaClass="tw:resize-y tw:min-h-40" />
    </form>
  `,
})
export class SizesExample {
  readonly form = new FormGroup({
    short: new FormControl<string>('', { nonNullable: true }),
    default: new FormControl<string>('', { nonNullable: true }),
    tall: new FormControl<string>('', { nonNullable: true }),
  });
}
```

### 3. Validation with a live character counter

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <eg-form-textarea
        controlName="bio"
        label="Bio"
        placeholder="A few sentences about you"
        [rows]="5"
        [maxlength]="280"
        [hint]="counter()"
        error="Bio must be 20–280 characters"
        required
      />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class CounterExample {
  readonly form = new FormGroup({
    bio: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(280)],
    }),
  });

  counter(): string {
    return `${this.form.controls.bio.value.length}/280`;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
```

### 4. Disabled and readonly states

```ts
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `
    <form [formGroup]="form">
      <eg-form-textarea
        controlName="notes"
        label="Internal notes"
        [rows]="4"
        [disabled]="locked()"
        hint="Toggle the lock to edit"
      />
      <eg-form-textarea controlName="audit" label="Audit trail" [rows]="3" [readonly]="true" />
      <button type="button" (click)="locked.update((v) => !v)">Toggle lock</button>
    </form>
  `,
})
export class StatesExample {
  readonly form = new FormGroup({
    notes: new FormControl<string>('Called back twice.', { nonNullable: true }),
    audit: new FormControl<string>('Created 2026-09-01 · Updated 2026-09-20', { nonNullable: true }),
  });
  readonly locked = signal(true);
}
```

### 5. Feedback form composition (input + textarea + select-side hint)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextInput, EgFormTextarea],
  template: `
    <form [formGroup]="form" (ngSubmit)="send()" class="tw:grid tw:gap-4">
      <eg-form-text-input controlName="subject" label="Subject" required />
      <eg-form-textarea
        controlName="message"
        label="Message"
        placeholder="Describe the issue in detail…"
        [rows]="6"
        [maxlength]="2000"
        [hint]="messageHint()"
        error="Message is required (min 20 characters)"
        required
      />
      <button type="submit">Send feedback</button>
    </form>
  `,
})
export class FeedbackExample {
  readonly form = new FormGroup({
    subject: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    message: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(2000)],
    }),
  });

  messageHint(): string {
    return `${this.form.controls.message.value.length}/2000 · Markdown supported`;
  }

  send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.getRawValue());
  }
}
```

### 6. Programmatic control (templates, reset, autosize note)

There is no auto-grow behavior — height is fixed by `rows` (plus `textareaClass` resize utilities). Insert canned text and reset programmatically:

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EgFormTextarea],
  template: `
    <form [formGroup]="form">
      <eg-form-textarea
        #descField
        controlName="description"
        label="Description"
        [rows]="6"
        textareaClass="tw:resize-y"
        hint="Tip: allow vertical resize for long drafts"
      />
      <div class="tw:flex tw:gap-2">
        <button type="button" (click)="insertTemplate()">Insert template</button>
        <button type="button" (click)="form.controls.description.reset()">Clear</button>
      </div>
      <p>Field id: {{ descField.effectiveId() }}</p>
    </form>
  `,
})
export class ProgrammaticExample {
  readonly form = new FormGroup({
    description: new FormControl<string>('', { nonNullable: true }),
  });

  insertTemplate() {
    this.form.controls.description.setValue('## Summary\n\n## Steps to reproduce\n\n1. \n2. \n');
  }
}
```

## Accessibility notes

- `<label [for]>` targets the textarea id (explicit `controlId`/`id` or generated), so label clicks focus the field.
- `aria-describedby` points at the error element only when invalid and dirty/touched, otherwise at the hint — pair long hints (formatting tips, counters) with concise `error` strings so screen-reader users hear the failure, not the help text, on error.
- The textarea reuses `HlmInput` styling (spartan invalid-state hooks included). Use `maxlength` + a counter hint for constrained fields so users get feedback before hitting the native limit.
- Avoid `autofocus`-style behavior here (the component exposes none) — move focus deliberately in wizards instead.

## Theming / CSS variables

No component-specific CSS variables; visuals come from the shared theme tokens via the `hlmInput` class hook. Control height with `rows` and `textareaClass` (`tw:min-h-*`, `tw:resize-y` / `tw:resize-none`).

Global defaults per styling slot via the wrapper config (precedence: library base < global config < per-instance):

```ts
import { provideEgFormTextareaConfig } from '@egose/shadcn-theme-ng/form-textarea';

await bootstrapApplication(App, {
  providers: [provideEgFormTextareaConfig({ textareaClass: 'tw:text-sm', labelClass: 'tw:font-medium' })],
});
```

## Related subpaths

- `@egose/shadcn-theme-ng/form-text-input` — the single-line sibling.
- `@egose/shadcn-theme-ng/textarea` — the raw `HlmTextarea` directive for non-form usage.
- `@egose/shadcn-theme-ng/input` — `HlmInput`, the class hook shared by both.
- `@egose/shadcn-theme-ng/form-field` — `HlmFormField`, `HlmError`, `HlmHint`, `HlmFormIdGenerator`.
