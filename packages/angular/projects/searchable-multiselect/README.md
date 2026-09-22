# Searchable Multiselect (`@egose/shadcn-theme-ng/searchable-multiselect`)

A shadcn/ui-style **multi-select with chips + popover picker** — selected values render as removable chips, and a popover holds the checkbox option list. There is no exact single shadcn/ui counterpart; it composes the `Popover`, `Button`, and `Checkbox` patterns into one opinionated control.

It is a **standalone `ControlValueAccessor` component** (`EgSearchableMultiselect`), so it binds directly to Angular reactive forms (`formControlName`) and template-driven forms (`ngModel`) with a `string[]` value. Internally it reuses `HlmPopover`/`HlmCheckbox`/`HlmButton` — you do not import those yourself.

> **Ships as:** `@egose/shadcn-theme-ng/searchable-multiselect` and `@egose/shadcn-theme-ng-tw/searchable-multiselect` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';
// tw variant:
// import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng-tw/searchable-multiselect';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`. (No `@spartan-ng/brain` peer — popover/checkbox/button come along as regular library dependencies.)

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                    | Kind                                               | Description                                                |
| ------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| `EgSearchableMultiselect` | Standalone component (`eg-searchable-multiselect`) | The whole control; provides `NG_VALUE_ACCESSOR` for itself |
| `SelectOption`            | Interface                                          | `{ label: string; value: string }`                         |

> Note: unlike most subpaths, this one exposes **no `*Imports` array and no `*Module`**. Import `EgSearchableMultiselect` directly — it is standalone.

```ts
import { Component } from '@angular/core';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [EgSearchableMultiselect],
  template: ` <eg-searchable-multiselect [options]="options" [(value)]="selected" /> `,
})
export class DemoComponent {}
```

## Anatomy / Structure

```html
<eg-searchable-multiselect [options]="options" placeholder="Pick frameworks…" [(value)]="selected" />
```

Renders (internally — you do not write this yourself):

```html
<eg-searchable-multiselect>
  <!-- chip row: placeholder pill when empty, removable chips otherwise -->
  <div>
    <span><!-- {{ placeholder }} or chip {{ item.label }} + ✕ button --></span>
  </div>

  <!-- popover trigger + checkbox list -->
  <hlm-popover>
    <button hlmPopoverTrigger hlmButton>N selected</button>
    <hlm-popover-content>
      <label><!-- <hlm-checkbox> per option + label text --></label>
    </hlm-popover-content>
  </hlm-popover>
</eg-searchable-multiselect>
```

Real selector: `eg-searchable-multiselect` (element). The `✕` chip buttons and popover trigger honor the disabled state; the popover panel is `tw:w-64` with a `tw:max-h-60` scrolling option list.

## API reference

### EgSearchableMultiselect (component, `ControlValueAccessor`)

| Input                 | Type                  | Default                  | Description                                                                      |
| --------------------- | --------------------- | ------------------------ | -------------------------------------------------------------------------------- |
| `options`             | `SelectOption[]`      | `[]`                     | Full option list (`{ label, value }`)                                            |
| `value`               | `string[]`            | `[]`                     | Selected values (one-way in; pairs with `valueChange` for two-way `[(value)]`)   |
| `placeholder`         | `string`              | `'Start typing to add…'` | Text of the pill shown when nothing is selected                                  |
| `id`                  | `string`              | `''`                     | `id` placed on the trigger button                                                |
| `disabled`            | `boolean`             | `false`                  | Disables chips + trigger + checkboxes                                            |
| `wrapperDisabled`     | `boolean`             | `false`                  | Second disable flag (e.g. set by wrapper form components); OR-ed with `disabled` |
| `ariaLabel`           | `string \| undefined` | `undefined`              | `aria-label` for the trigger button                                              |
| `ariaDescribedby`     | `string \| null`      | `null`                   | `aria-describedby` for the trigger button                                        |
| `class` (`userClass`) | `ClassValue`          | `''`                     | Extra classes on the host                                                        |

| Output        | Type       | Description                                          |
| ------------- | ---------- | ---------------------------------------------------- |
| `valueChange` | `string[]` | Emitted with the new value array on every add/remove |

`ControlValueAccessor` contract: `writeValue(values)`, `registerOnChange`, `registerOnTouched`, `setDisabledState` are implemented, so `formControl` / `formControlName` / `ngModel` all work. Effective disabled state = `disabled() \|\| wrapperDisabled() \|\| formDisabled()` (the last set by forms via `setDisabledState`).

API surprise worth knowing: despite the "searchable" name, the current template ships **no filter text field** — the popover shows the full checkbox list and empty state reads "No options". Treat `options` as the complete visible list (filter it yourself before passing it in if you need search). Also `value` is a plain `input`, not a `model`: form writes flow through `writeValue`, and user edits flow out through `valueChange` + the CVA `onChange` callback.

## Examples

### 1. Basic two-way binding

```ts
import { Component, signal } from '@angular/core';
import { EgSearchableMultiselect, type SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-basic-multi',
  standalone: true,
  imports: [EgSearchableMultiselect],
  template: `
    <eg-searchable-multiselect [options]="frameworks" placeholder="Pick frameworks…" [(value)]="selected" />
    <p>Selected: {{ selected().join(', ') || 'none' }}</p>
  `,
})
export class BasicMultiComponent {
  readonly frameworks: SelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ];
  readonly selected = signal<string[]>(['angular']);
}
```

### 2. Reactive forms

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgSearchableMultiselect, type SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-reactive-multi',
  standalone: true,
  imports: [EgSearchableMultiselect, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label for="skills">Skills (pick at least one)</label>
      <eg-searchable-multiselect id="skills" [options]="skills" formControlName="skillIds" />
      @if (form.controls.skillIds.invalid && form.controls.skillIds.touched) {
        <p class="tw:text-destructive tw:text-sm">Choose at least one skill.</p>
      }
      <button type="submit">Save</button>
    </form>
  `,
})
export class ReactiveMultiComponent {
  readonly skills: SelectOption[] = [
    { label: 'TypeScript', value: 'ts' },
    { label: 'CSS', value: 'css' },
    { label: 'Testing', value: 'testing' },
  ];
  readonly form = new FormGroup({
    skillIds: new FormControl<string[]>(['ts'], { validators: Validators.required }),
  });

  submit(): void {
    this.form.markAllAsTouched();
    console.log(this.form.value);
  }
}
```

### 3. Template-driven forms (`ngModel`)

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EgSearchableMultiselect, type SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-ngmodel-multi',
  standalone: true,
  imports: [EgSearchableMultiselect, FormsModule],
  template: `
    <eg-searchable-multiselect name="tags" [options]="tags" [(ngModel)]="selected" #tagsCtrl="ngModel" />
    @if (tagsCtrl.touched && !selected.length) {
      <p class="tw:text-destructive tw:text-sm">Pick at least one tag.</p>
    }
  `,
})
export class NgModelMultiComponent {
  readonly tags: SelectOption[] = [
    { label: 'Bug', value: 'bug' },
    { label: 'Feature', value: 'feature' },
    { label: 'Docs', value: 'docs' },
  ];
  selected: string[] = [];
}
```

### 4. Disabled / read-only states

```ts
import { Component } from '@angular/core';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-disabled-multi',
  standalone: true,
  imports: [EgSearchableMultiselect],
  template: `
    <!-- fully disabled: chips, ✕ buttons, trigger, checkboxes -->
    <eg-searchable-multiselect [options]="options" [value]="['a']" disabled />

    <!-- wrapper-driven disable (e.g. parent form section locked) -->
    <eg-searchable-multiselect [options]="options" [value]="['a']" [wrapperDisabled]="locked" />
  `,
})
export class DisabledMultiComponent {
  readonly locked = true;
  readonly options = [
    { label: 'Alpha', value: 'a' },
    { label: 'Beta', value: 'b' },
  ];
}
```

Disabling via `formControl.disable()` works too — it flows through `setDisabledState`.

### 5. Client-side search (filter `options` yourself)

Since the popover lists exactly what you pass in `options`, implement search by filtering upstream:

```ts
import { Component, computed, signal } from '@angular/core';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-search-multi',
  standalone: true,
  imports: [EgSearchableMultiselect],
  template: `
    <input
      type="search"
      placeholder="Filter options…"
      [value]="query()"
      (input)="query.set($any($event.target).value)"
      aria-label="Filter options"
    />
    <eg-searchable-multiselect [options]="filtered()" [(value)]="selected" />
  `,
})
export class SearchMultiComponent {
  readonly query = signal('');
  readonly selected = signal<string[]>([]);
  private readonly all = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Solid', value: 'solid' },
  ];
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.all.filter((o) => o.label.toLowerCase().includes(q)) : this.all;
  });
}
```

Note: selections whose option is currently filtered out stay selected internally (chips still show) but have no checkbox row until the filter matches again. Unknown values passed via `value`/`writeValue` that match no option are dropped from the chip row.

### 6. Async options + reacting to changes

```ts
import { Component, resource, signal } from '@angular/core';
import { EgSearchableMultiselect, type SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-async-multi',
  standalone: true,
  imports: [EgSearchableMultiselect],
  template: `
    @if (users.isLoading()) {
      <p>Loading users…</p>
    } @else {
      <eg-searchable-multiselect
        [options]="users.value() ?? []"
        [(value)]="assignees"
        (valueChange)="onChange($event)"
        ariaLabel="Assignees"
      />
    }
  `,
})
export class AsyncMultiComponent {
  readonly assignees = signal<string[]>([]);
  readonly users = resource({
    loader: async (): Promise<SelectOption[]> => {
      const res = await fetch('/api/users');
      const list = (await res.json()) as Array<{ id: string; name: string }>;
      return list.map((u) => ({ label: u.name, value: u.id }));
    },
  });

  onChange(values: string[]): void {
    console.log('assignees now:', values);
  }
}
```

## Accessibility notes

- The trigger is a real `<button>` — give it an accessible name via `ariaLabel` (or a visible `<label>` paired with `id`) and descriptions via `ariaDescribedby`.
- Options render as native checkbox-backed `hlm-checkbox` rows inside `<label>` elements, so they are keyboard-operable and announced per option.
- Chip `✕` buttons are real buttons and disabled along with the control; keep chip text concise so screen readers announce removals cleanly.
- The empty state is a plain text pill (not focusable) — the popover trigger remains the single keyboard entry point, which keeps tab order simple.

## Theming / CSS variables

Class-driven (chips, popover panel, checkbox rows). Extend via the `class` input on the host; inner popover width (`tw:w-64`) and list height (`tw:max-h-60`) are fixed in the template.

## Related subpaths

- `@egose/shadcn-theme-ng/form-searchable-multiselect` — form-field wrapper (label/description/error) around this control
- `@egose/shadcn-theme-ng/select` — single-select dropdown counterpart
- `@egose/shadcn-theme-ng/popover` — the underlying popover primitive
- `@egose/shadcn-theme-ng/checkbox` — the underlying option-row primitive
