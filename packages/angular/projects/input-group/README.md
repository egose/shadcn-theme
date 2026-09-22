# Input Group (`@egose/shadcn-theme-ng/input-group`)

The input group joins an input (or textarea) with prefixes, suffixes, and inline action buttons into a single bordered control — the shadcn/ui _InputGroup_ equivalent (currency prefix + amount + Apply, URL slug builder, message composer with block add-ons). The outer directive owns the border/focus ring; the inner pieces are borderless so the group reads as one field.

> **Ships as:** `@egose/shadcn-theme-ng/input-group` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/input-group` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
// tw variant:
// import { HlmInputGroupImports } from '@egose/shadcn-theme-ng-tw/input-group';
```

## Imports

```ts
// Standalone component — spread the imports array:
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  standalone: true,
  imports: [HlmInputGroupImports],
  template: `
    <div hlmInputGroup>
      <span hlmInputGroupText>$</span>
      <input hlmInputGroupInput placeholder="0.00" aria-label="Amount in dollars" />
    </div>
  `,
})
export class MyComp {}
```

```ts
// NgModule-based — import the module:
import { HlmInputGroupModule } from '@egose/shadcn-theme-ng/input-group';

@NgModule({ imports: [HlmInputGroupModule] })
export class MyModule {}
```

Exported from `src/public-api.ts`: `HlmInputGroup`, `HlmInputGroupAddon`, `HlmInputGroupButton`, `HlmInputGroupInput`, `HlmInputGroupText`, `HlmInputGroupTextarea`, plus `HlmInputGroupImports` and `HlmInputGroupModule`.

## Anatomy / Structure

```html
<div hlmInputGroup>
  <!-- inline prefix -->
  <span hlmInputGroupText>$</span>

  <!-- the actual control (borderless, flex-1) -->
  <input hlmInputGroupInput placeholder="Monthly budget" aria-label="Monthly budget" />

  <!-- inline action -->
  <button hlmInputGroupButton type="button">Apply</button>
</div>

<!-- block layout for composers -->
<div hlmInputGroup>
  <div hlmInputGroupAddon align="block-start">Message to #general</div>
  <textarea hlmInputGroupTextarea rows="3" aria-label="Message"></textarea>
  <div hlmInputGroupAddon align="block-end">…</div>
</div>
```

Real selectors: `[hlmInputGroup]` / `hlm-input-group` (container, `role="group"`); `input[hlmInputGroupInput]` (input, `hostDirectives: [HlmInput]`, `data-slot="input-group-control"`); `textarea[hlmInputGroupTextarea]` (`hostDirectives: [HlmTextarea]`, same control slot); `[hlmInputGroupAddon]` / `hlm-input-group-addon` (alignable addon, `align` = `inline-start` | `inline-end` | `block-start` | `block-end`, default `inline-start`); `[hlmInputGroupText]` / `hlm-input-group-text` (plain inline text); `button[hlmInputGroupButton]` (action button, ghost variant preset, `hostDirectives: [HlmBtn]`).

## API reference

### `[hlmInputGroup]` — `HlmInputGroup`

Container. No inputs/outputs. `role="group"`, `data-slot="input-group"`. Carries the border, `h-9` height, shadow, and the `:focus-visible` / invalid ring logic that reacts to the inner `[data-slot=input-group-control]` and disabled state (`group-data-[disabled=true]/input-group` dims addons).

### `input[hlmInputGroupInput]` — `HlmInputGroupInput`

Borderless input (`hostDirectives: [HlmInput]`). No inputs of its own — all native input attributes and `HlmInput` inputs (`ariaDescribedby`, `id`, `forceInvalid`) apply directly on the element.

### `textarea[hlmInputGroupTextarea]` — `HlmInputGroupTextarea`

Borderless textarea (`hostDirectives: [HlmTextarea]`, `resize-none`). No inputs of its own; native textarea attributes apply directly.

### `[hlmInputGroupAddon]` — `HlmInputGroupAddon`

| Input   | Type                                                             | Default          | Description                                                                               |
| ------- | ---------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `align` | `'inline-start' \| 'inline-end' \| 'block-start' \| 'block-end'` | `'inline-start'` | Placement: inline prefixes/suffixes vs full-width block rows (reflected as `data-align`). |

Inline addons order themselves first/last automatically; block addons stack the group vertically (`flex-col`).

### `[hlmInputGroupText]` — `HlmInputGroupText`

Static inline text (currency symbols, units, URL fragments). No inputs/outputs.

### `button[hlmInputGroupButton]` — `HlmInputGroupButton`

| Input     | Type                                     | Default    | Description                                                                                     |
| --------- | ---------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `size`    | `'xs' \| 'sm' \| 'icon-xs' \| 'icon-sm'` | `'xs'`     | Button density; `icon-*` variants are square for glyph-only buttons (reflected as `data-size`). |
| `variant` | (via `HlmBtn`)                           | `'ghost'`  | Forwarded to `HlmBtn`; the group presets the brain button config to `ghost`.                    |
| `type`    | `'button' \| 'submit' \| 'reset'`        | `'button'` | Native button type (bound as `[type]`).                                                         |

## Examples

### 1. Currency prefix + action button

```ts
import { Component, signal } from '@angular/core';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  standalone: true,
  imports: [HlmInputGroupImports],
  template: `
    <div hlmInputGroup>
      <span hlmInputGroupText>$</span>
      <input hlmInputGroupInput type="number" placeholder="Monthly budget" aria-label="Monthly budget" />
      <button hlmInputGroupButton type="button" (click)="apply()">Apply</button>
    </div>
    @if (message()) {
      <p role="status" class="tw:mt-2 tw:text-sm">{{ message() }}</p>
    }
  `,
})
export class CurrencyExample {
  readonly message = signal<string | null>(null);

  apply() {
    this.message.set('Budget applied.');
  }
}
```

### 2. URL slug builder (prefix + input + suffix)

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  standalone: true,
  imports: [FormsModule, HlmInputGroupImports],
  template: `
    <div hlmInputGroup>
      <span hlmInputGroupText>https://egose.dev/</span>
      <input
        hlmInputGroupInput
        [(ngModel)]="slug"
        name="slug"
        placeholder="campaign-spring"
        aria-label="Campaign slug"
      />
      <span hlmInputGroupText>.html</span>
    </div>
    <p class="tw:mt-2 tw:text-sm tw:text-slate-500">Preview: https://egose.dev/{{ slug || '…' }}.html</p>
  `,
})
export class SlugExample {
  slug = 'angular-standard';
}
```

### 3. Search with icon addon + keyboard shortcut hint

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { HlmKbd } from '@egose/shadcn-theme-ng/kbd';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon, HlmInputGroupImports, HlmKbd],
  providers: [provideIcons({ lucideSearch })],
  template: `
    <div hlmInputGroup>
      <span hlmInputGroupText><ng-icon hlm name="lucideSearch" size="sm" /></span>
      <input hlmInputGroupInput placeholder="Search docs…" aria-label="Search docs" />
      <div hlmInputGroupAddon align="inline-end"><kbd hlmKbd>⌘K</kbd></div>
    </div>
  `,
})
export class SearchExample {}
```

### 4. Icon-only buttons (`icon-xs` / `icon-sm`)

```ts
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideCheck } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon, HlmInputGroupImports],
  providers: [provideIcons({ lucideCopy, lucideCheck })],
  template: `
    <div hlmInputGroup>
      <input hlmInputGroupInput [value]="token()" readonly aria-label="API token" />
      <button
        hlmInputGroupButton
        size="icon-xs"
        type="button"
        (click)="copy()"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy token'"
      >
        <ng-icon hlm [name]="copied() ? 'lucideCheck' : 'lucideCopy'" size="sm" />
      </button>
    </div>
  `,
})
export class CopyExample {
  readonly token = signal('sk-live-abc123');
  readonly copied = signal(false);

  async copy() {
    await navigator.clipboard.writeText(this.token());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
```

### 5. Block composer (textarea + block addons)

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  standalone: true,
  imports: [FormsModule, HlmInputGroupImports],
  template: `
    <div hlmInputGroup>
      <div hlmInputGroupAddon align="block-start">Message to #design-review</div>
      <textarea
        hlmInputGroupTextarea
        rows="4"
        [(ngModel)]="draft"
        name="draft"
        aria-label="Message to the design-review channel"
        placeholder="Describe the behavior you want to change…"
      ></textarea>
      <div hlmInputGroupAddon align="block-end" class="tw:flex tw:items-center tw:justify-between">
        <span role="status">{{ status() }}</span>
        <button hlmInputGroupButton type="button" (click)="send()">Send</button>
      </div>
    </div>
  `,
})
export class ComposerExample {
  draft = '';
  readonly status = signal('Draft autosaved just now');

  send() {
    this.status.set('Message sent just now.');
    this.draft = '';
  }
}
```

### 6. Reactive form + validation (forceInvalid + error text)

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { HlmError } from '@egose/shadcn-theme-ng/form-field';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, HlmInputGroupImports, HlmError],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div hlmInputGroup>
        <span hlmInputGroupText>€</span>
        <input
          hlmInputGroupInput
          type="number"
          formControlName="price"
          placeholder="0.00"
          aria-label="Price in euros"
          aria-describedby="price-error"
          [forceInvalid]="showError()"
        />
      </div>
      @if (showError()) {
        <hlm-error id="price-error">Enter a price greater than 0.</hlm-error>
      }
      <button type="submit">Save</button>
    </form>
  `,
})
export class ValidationExample {
  readonly form = new FormGroup({
    price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.01)] }),
  });

  showError(): boolean {
    const c = this.form.controls.price;
    return c.invalid && (c.dirty || c.touched);
  }

  submit() {
    if (this.form.invalid) this.form.markAllAsTouched();
  }
}
```

## Accessibility notes

- The container has `role="group"` — give the inner control an `aria-label` (or visible `<label>`) since add-on text is not automatically associated.
- Add-on text (`$`, `https://…`) is visual context; repeat the essential unit in the input's accessible name (`aria-label="Monthly budget in dollars"`), not just the placeholder.
- Icon-only `hlmInputGroupButton`s need an `aria-label` (`Copy token`, `Send`).
- Validation messages live outside the group — link them with `aria-describedby` + `forceInvalid` as in example 6 so the error ring and announcement stay in sync.

## Theming / CSS variables

No component-specific CSS variables; borders, rings, and muted text come from the shared tokens (`--input`, `--ring`, `--muted-foreground`, `--destructive`, `--radius`). Width/height adapt to content — constrain with `tw:max-w-*` on the group.

## Related subpaths

- `@egose/shadcn-theme-ng/input` — standalone `HlmInput` (what the group input extends).
- `@egose/shadcn-theme-ng/textarea` — `HlmTextarea` (what the group textarea extends).
- `@egose/shadcn-theme-ng/button` — `HlmBtn` variants behind the group button.
- `@egose/shadcn-theme-ng/kbd` — shortcut hints inside addons.
