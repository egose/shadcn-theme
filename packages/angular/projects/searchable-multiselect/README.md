# Searchable Multiselect (`@egose/shadcn-theme-ng/searchable-multiselect`)

A shadcn/ui-style **multi-select with chips + searchable popover picker** — selected values render as named removable chips, and a labeled local search filters the checkbox option list. There is no exact single shadcn/ui counterpart; it composes the `Popover`, `Button`, and `Checkbox` patterns into one opinionated control.

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

Peer dependencies include Angular and `@spartan-ng/brain` (`>=1.3.2 <2.0.0`); see the [package README](../../README.md) for the complete peer list and supported versions. The composed popover/checkbox/button implementations are included in the theme package, but their Spartan behavior is supplied by that peer.

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

  <!-- popover trigger + local search + checkbox list -->
  <hlm-popover>
    <button hlmPopoverTrigger hlmButton>N selected</button>
    <hlm-popover-content>
      <label>Search options <input type="search" /></label>
      <label><!-- <hlm-checkbox> per option + label text --></label>
      <div role="status" aria-live="polite"><!-- No matching options, when empty --></div>
    </hlm-popover-content>
  </hlm-popover>
</eg-searchable-multiselect>
```

Real selector: `eg-searchable-multiselect` (element). The `✕` chip buttons and popover trigger honor the disabled state; the popover panel is `tw:w-64` with a `tw:max-h-60` scrolling option list.

## API reference

### EgSearchableMultiselect (component, `ControlValueAccessor`)

| Input                 | Type                  | Default                  | Description                                                                                           |
| --------------------- | --------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `options`             | `SelectOption[]`      | `[]`                     | Full option list (`{ label, value }`)                                                                 |
| `value`               | `string[]`            | `[]`                     | Standalone selected IDs; pairs with `valueChange` for `[(value)]`. Ignored after the first CVA write. |
| `placeholder`         | `string`              | `'Start typing to add…'` | Text of the pill shown when nothing is selected                                                       |
| `id`                  | `string`              | `''`                     | `id` placed on the trigger button                                                                     |
| `disabled`            | `boolean`             | `false`                  | Disables chips + trigger + search + checkboxes                                                        |
| `wrapperDisabled`     | `boolean`             | `false`                  | Second disable flag (e.g. set by wrapper form components); OR-ed with `disabled`                      |
| `ariaLabel`           | `string \| undefined` | `undefined`              | `aria-label` for the trigger button                                                                   |
| `ariaDescribedby`     | `string \| null`      | `null`                   | `aria-describedby` for the trigger button                                                             |
| `class` (`userClass`) | `ClassValue`          | `''`                     | Extra classes on the host                                                                             |

| Output        | Type       | Description                                                      |
| ------------- | ---------- | ---------------------------------------------------------------- |
| `valueChange` | `string[]` | Emitted with a new value array on each effective user add/remove |

`ControlValueAccessor` contract: `writeValue(values)`, `registerOnChange`, `registerOnTouched`, `setDisabledState` are implemented, so `formControl` / `formControlName` / `ngModel` all work. Effective disabled state = `disabled() \|\| wrapperDisabled() \|\| formDisabled()` (the last set by forms via `setDisabledState`).

`value` is a plain `input`, not a `model`: form writes flow through `writeValue`, and user edits flow out through `valueChange` + the CVA `onChange` callback.

### Local search

Additional copy inputs:

- `searchLabel: string` (default `'Search options'`): visible, associated native search label; supply nonempty localized text.
- `searchPlaceholder: string` (default `'Type to filter…'`): search input hint, separate from the empty-selection pill.
- `emptyMessage: string` (default `'No matching options'`): polite live-region copy for no matches or no supplied options.
- `removeLabel: (option: SelectOption) => string` (default ``option => `Remove ${option.label}` ``): pure formatter for each chip button's accessible name; unresolved labels are raw IDs.

Pass the complete `options` list. The native search field trims the query and performs case-insensitive substring matching on **labels**, retaining source order. An empty/whitespace query restores all choices. Search is local to the supplied list: it does not search IDs, fetch remote options, or virtualize results. New option arrays and label replacements recompute the current filter immediately.

Filtering hides checkbox rows only. All selections, including unresolved IDs, remain selected; chip labels still resolve from the complete options list. Search edits never emit `valueChange`/CVA changes or mark touched. The query persists across close/reopen and external value writes/resets; clear its text to restore all choices. The empty message occupies a persistent polite status region while the popover is open.

### Selection ownership and asynchronous options

- **Standalone:** `[value]` initializes selection, and each new input array replaces it (including `[]` to clear). User edits update the displayed selection immediately and emit `valueChange`; `[(value)]` keeps the parent synchronized. With one-way binding, local edits persist until a new input array arrives.
- **Angular forms:** the first `writeValue` takes ownership for the component's lifetime. Subsequent `[value]` changes are ignored; use `formControl`, `formControlName`, or `ngModel` as the source of truth. Every form write replaces selection; `null` and `[]` clear it, including resets.
- Selected IDs are stored independently of `options`, in value-array order. Unresolved IDs render as removable chips labeled with the raw ID and count toward the selected total. When options arrive or labels change, chips update automatically. When an option disappears, its chip falls back to the ID. Adding/removing another option never discards these unresolved IDs; explicitly remove their chips or write a replacement value to clear them.
- External input/form writes and option updates never emit `valueChange`, call CVA `onChange`, or mark touched. Effective user adds/removes emit once per channel and call `onTouched`. Opening/focusing the picker alone does not mark touched; duplicate adds and absent removals are no-ops.
- Disabled state combines the input, wrapper, and form flags. It blocks trigger/chip/search/checkbox edits, including when disabled with the panel open, while still accepting external value and option updates.
- Input arrays and option objects are never mutated. Output and CVA callbacks receive separate fresh arrays. Supply unique selected IDs and unique option values, and replace arrays/option objects rather than mutating them in place so signal updates are observed.

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

### 5. Local search with configurable copy

Supply all options so hidden selections retain their labels:

```ts
import { Component, signal } from '@angular/core';
import { EgSearchableMultiselect, type SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-search-multi',
  standalone: true,
  imports: [EgSearchableMultiselect],
  template: `
    <eg-searchable-multiselect
      [options]="frameworks"
      [(value)]="selected"
      ariaLabel="Framework assignments"
      searchLabel="Find frameworks"
      searchPlaceholder="Type a framework name…"
      emptyMessage="No frameworks match your search"
      [removeLabel]="removeFrameworkLabel"
    />
  `,
})
export class SearchMultiComponent {
  readonly selected = signal<string[]>([]);
  readonly removeFrameworkLabel = (option: SelectOption) => `Unassign ${option.label}`;
  readonly frameworks: SelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Solid', value: 'solid' },
  ];
}
```

The form wrapper `EgFormSearchableMultiselect` forwards the same `searchLabel`, `searchPlaceholder`, `emptyMessage`, and `removeLabel` inputs. For localization, the remove formatter receives the current label and value, so it can include an ID to distinguish duplicate display names.

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
- Open the trigger with Enter/Space. With the default popover focus configuration, focus moves to the labeled native search field. Type to filter, clear the text to restore choices, and Tab/Shift+Tab among controls. Enter in search does not submit a surrounding form. Escape closes the popover and restores trigger focus.
- Options use native buttons with checkbox roles inside `<label>` elements. Use Space/Enter to toggle a focused choice.
- Chip `✕` buttons are named `Remove <label>` by default (`Remove <ID>` when unresolved); customize with `removeLabel`. They are disabled along with the control.
- No matches (including an empty options list) displays `emptyMessage` in a polite, atomic status region. The search remains editable when there are no results. Browser DOM/focus tests verify these contracts; they do not constitute screen-reader testing.

## Theming / CSS variables

Class-driven (chips, popover panel, checkbox rows). Extend via the `class` input on the host; inner popover width (`tw:w-64`) and list height (`tw:max-h-60`) are fixed in the template.

## Related subpaths

- `@egose/shadcn-theme-ng/form-searchable-multiselect` — form-field wrapper (label/description/error) around this control
- `@egose/shadcn-theme-ng/select` — single-select dropdown counterpart
- `@egose/shadcn-theme-ng/popover` — the underlying popover primitive
- `@egose/shadcn-theme-ng/checkbox` — the underlying option-row primitive
