# Autocomplete (`@egose/shadcn-theme-ng/autocomplete`)

A filter-as-you-type popup input in the shadcn/ui Command/Combobox style: a text field anchored to
a floating listbox with grouped options, an empty state, a clear button, and async status rows.
Use it for country pickers, command palettes backing a text field, tag inputs, and searchable
option lists.

The implementation styles the headless autocomplete primitives from
`@spartan-ng/brain/autocomplete` (state, filtering, active-item tracking) combined with
`BrnPopover` / `BrnPopoverContent` from `@spartan-ng/brain/popover` for floating placement.
Everything is a thin directive (shadcn classes via `classes()`) except `HlmAutocompleteInput`
and `HlmAutocompleteItem`, which are small components. `HlmAutocomplete` is the form-field style
root; `HlmAutocompleteSearch` is the same shell wired for live search callbacks.

> **Ships as:** `@egose/shadcn-theme-ng/autocomplete` and `@egose/shadcn-theme-ng-tw/autocomplete`
> (the `tw:`-prefixed Tailwind variant). Both expose the identical TypeScript surface; only the
> emitted Tailwind class strings differ. See the [package README](../../README.md) for install
> steps, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# tw:-prefixed Tailwind variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@spartan-ng/brain`, `@ng-icons/*`, `rxjs`, …) are documented in the
[package README](../../README.md#peer-dependencies). This subpath additionally relies at runtime on
`@egose/shadcn-theme-ng/utils` (`classes()`), `@egose/shadcn-theme-ng/input-group`
(`HlmInputGroup*`, composed inside `HlmAutocompleteInput`), and `@ng-icons/lucide`
(`lucideSearch`, `lucideX`, `lucideCheck`).

## Imports

All symbols are exported from the subpath root (`projects/autocomplete/src/public-api.ts`):

```ts
import {
  HlmAutocomplete,
  HlmAutocompleteSearch,
  HlmAutocompleteInput,
  HlmAutocompleteContent,
  HlmAutocompletePortal,
  HlmAutocompleteList,
  HlmAutocompleteItem,
  HlmAutocompleteGroup,
  HlmAutocompleteLabel,
  HlmAutocompleteEmpty,
  HlmAutocompleteSeparator,
  HlmAutocompleteStatus,
  HlmAutocompleteImports,
  HlmAutocompleteModule,
} from '@egose/shadcn-theme-ng/autocomplete';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/autocomplete'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmAutocompleteImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmAutocompleteModule } from '@egose/shadcn-theme-ng/autocomplete';

@NgModule({ imports: [HlmAutocompleteModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<div hlmAutocomplete [(value)]="selected" [(search)]="query">
  <hlm-autocomplete-input placeholder="Search frameworks..." />

  <div hlmAutocompletePortal>
    <div hlmAutocompleteContent>
      <ul hlmAutocompleteList>
        <li hlmAutocompleteGroup>
          <span hlmAutocompleteLabel>Suggestions</span>
          <hlm-autocomplete-item [value]="opt" [id]="opt.id"> {{ opt.label }} </hlm-autocomplete-item>
        </li>
        <div hlmAutocompleteSeparator></div>
        <hlm-autocomplete-empty>No results for "{{ query }}".</hlm-autocomplete-empty>
        <hlm-autocomplete-status>Loading…</hlm-autocomplete-status>
      </ul>
    </div>
  </div>
</div>
```

Real selectors (from source):

| Class                      | Selector(s)                                          | Kind      |
| -------------------------- | ---------------------------------------------------- | --------- |
| `HlmAutocomplete`          | `[hlmAutocomplete], hlm-autocomplete`                | Directive |
| `HlmAutocompleteSearch`    | `[hlmAutocompleteSearch], hlm-autocomplete-search`   | Directive |
| `HlmAutocompleteInput`     | `hlm-autocomplete-input`                             | Component |
| `HlmAutocompleteContent`   | `[hlmAutocompleteContent], hlm-autocomplete-content` | Directive |
| `HlmAutocompletePortal`    | `[hlmAutocompletePortal]`                            | Directive |
| `HlmAutocompleteList`      | `[hlmAutocompleteList]`                              | Directive |
| `HlmAutocompleteItem`      | `hlm-autocomplete-item`                              | Component |
| `HlmAutocompleteGroup`     | `[hlmAutocompleteGroup]`                             | Directive |
| `HlmAutocompleteLabel`     | `[hlmAutocompleteLabel]`                             | Directive |
| `HlmAutocompleteEmpty`     | `[hlmAutocompleteEmpty], hlm-autocomplete-empty`     | Directive |
| `HlmAutocompleteSeparator` | `[hlmAutocompleteSeparator]`                         | Directive |
| `HlmAutocompleteStatus`    | `[hlmAutocompleteStatus], hlm-autocomplete-status`   | Directive |

## API reference

Inputs/outputs below come from the `hostDirectives` declarations in source. `HlmAutocomplete`
and `HlmAutocompleteSearch` both also carry `BrnPopover` behavior
(`align` default `'start'`, `sideOffset` default `6`).

### `HlmAutocomplete` — `[hlmAutocomplete], hlm-autocomplete`

`BrnAutocomplete` + `BrnPopover`.

| Input                                                                    | Description                                                             |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `autoHighlight`                                                          | Auto-highlight the first matching item.                                 |
| `disabled`                                                               | Disable the whole autocomplete.                                         |
| `value`                                                                  | Currently selected value (two-way with `valueChange`).                  |
| `search`                                                                 | Current search text (two-way with `searchChange`).                      |
| `itemToString`                                                           | Maps an item value to its display string.                               |
| `isItemEqualToValue`                                                     | Equality check for selection (`HlmAutocomplete` only, not on `Search`). |
| `align`, `closeOnOutsidePointerEvents`, `sideOffset`, `state`, `offsetX` | Popover placement/state (via `BrnPopover`).                             |

| Output         | Description                                    |
| -------------- | ---------------------------------------------- |
| `valueChange`  | Emits the newly selected value.                |
| `searchChange` | Emits the search text on each keystroke.       |
| `stateChanged` | Popover open-state changes (via `BrnPopover`). |
| `closed`       | Popover closed (via `BrnPopover`).             |

### `HlmAutocompleteSearch` — `[hlmAutocompleteSearch], hlm-autocomplete-search`

Same as `HlmAutocomplete` **minus** `isItemEqualToValue`. Prefer it when the list is driven by a
server query rather than local equality.

### `HlmAutocompleteInput` — `hlm-autocomplete-input`

Component composing `BrnAutocompleteAnchor` + `HlmInputGroup` around a native `<input
brnAutocompleteInput hlmInputGroupInput>`, with optional search/clear addons.

| Input                                           | Type                   | Default                                           | Description                                               |
| ----------------------------------------------- | ---------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| `inputId`                                       | `string`               | `'hlm-autocomplete-input-<n>'` (auto-incremented) | `id` forwarded to the inner input.                        |
| `placeholder`                                   | `string`               | `''`                                              | Placeholder text.                                         |
| `showSearch`                                    | `boolean`              | `true`                                            | Show the leading search icon addon.                       |
| `showClear`                                     | `boolean`              | `false`                                           | Show the trailing clear (`*brnAutocompleteClear`) button. |
| `forceInvalid`                                  | `boolean`              | `false`                                           | Force the invalid visual state.                           |
| `aria-invalid` (alias of `ariaInvalidOverride`) | `boolean \| undefined` | `undefined` (auto-detect from parent error state) | Manual override for `aria-invalid`.                       |

### `HlmAutocompleteItem` — `hlm-autocomplete-item`

Component wrapping `BrnAutocompleteItem`; renders a check icon at the inline-end when the item is
active (`_active()` signal read from the injected brain item).

| Input (via brain) | Description                  |
| ----------------- | ---------------------------- |
| `id`              | Item id.                     |
| `disabled`        | Disable this option.         |
| `value`           | The option value (any type). |

### `HlmAutocompleteList` / `HlmAutocompleteLabel` / `HlmAutocompleteSeparator`

| Directive                                                 | Brain inputs  | Notes                                                                   |
| --------------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| `HlmAutocompleteList` (`[hlmAutocompleteList]`)           | `id`          | Scrollable list shell; collapses padding when empty (`data-empty:p-0`). |
| `HlmAutocompleteLabel` (`[hlmAutocompleteLabel]`)         | `id`          | Small muted group caption.                                              |
| `HlmAutocompleteGroup` (`[hlmAutocompleteGroup]`)         | —             | Groups items; hides via `data-hidden`.                                  |
| `HlmAutocompleteSeparator` (`[hlmAutocompleteSeparator]`) | `orientation` | 1px divider between groups.                                             |

### `HlmAutocompleteContent` / `HlmAutocompletePortal`

| Directive                | Brain primitive                                 | Notes                                                                                   |
| ------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `HlmAutocompleteContent` | `BrnAutocompleteContent`                        | Floating panel (`max-h-72`, popover theme, width synced to `--brn-autocomplete-width`). |
| `HlmAutocompletePortal`  | `BrnPopoverContent` (`context`, `class` inputs) | CDK-portal outlet — wrap the content in it.                                             |

### `HlmAutocompleteEmpty` / `HlmAutocompleteStatus`

Layout-only states, no inputs. `Empty` only displays when the content reports
`group-data-empty` (no matches); `Status` is a centered row for spinners / "loading…" /
result counts.

## Examples

### 1. Basic local filtering

```ts
import { Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

interface Fruit {
  id: string;
  label: string;
}

@Component({
  selector: 'app-autocomplete-basic',
  standalone: true,
  imports: [...HlmAutocompleteImports],
  template: `
    <div hlmAutocomplete [(search)]="query" [(value)]="selected">
      <hlm-autocomplete-input placeholder="Search fruit..." [showClear]="true" />
      <div hlmAutocompletePortal>
        <div hlmAutocompleteContent>
          <ul hlmAutocompleteList>
            @for (f of filtered(); track f.id) {
              <hlm-autocomplete-item [value]="f" [id]="f.id">{{ f.label }}</hlm-autocomplete-item>
            }
            <hlm-autocomplete-empty>No fruit matches "{{ query() }}".</hlm-autocomplete-empty>
          </ul>
        </div>
      </div>
    </div>
    <p class="tw:mt-2 tw:text-sm">Selected: {{ selected()?.label ?? 'none' }}</p>
  `,
})
export class AutocompleteBasicComponent {
  private readonly all: Fruit[] = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
    { id: 'date', label: 'Date' },
  ];
  readonly query = signal('');
  readonly selected = signal<Fruit | null>(null);
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.all.filter((f) => f.label.toLowerCase().includes(q)) : this.all;
  });
}
```

### 2. Grouped options with labels and separators

```html
<div hlmAutocomplete [(search)]="query" [(value)]="picked">
  <hlm-autocomplete-input placeholder="Pick a city..." />
  <div hlmAutocompletePortal>
    <div hlmAutocompleteContent>
      <ul hlmAutocompleteList>
        <li hlmAutocompleteGroup>
          <span hlmAutocompleteLabel>Europe</span>
          <hlm-autocomplete-item [value]="'berlin'" id="berlin">Berlin</hlm-autocomplete-item>
          <hlm-autocomplete-item [value]="'paris'" id="paris">Paris</hlm-autocomplete-item>
        </li>
        <div hlmAutocompleteSeparator></div>
        <li hlmAutocompleteGroup>
          <span hlmAutocompleteLabel>Asia</span>
          <hlm-autocomplete-item [value]="'tokyo'" id="tokyo">Tokyo</hlm-autocomplete-item>
          <hlm-autocomplete-item [value]="'seoul'" id="seoul" [disabled]="true">
            Seoul (disabled)
          </hlm-autocomplete-item>
        </li>
        <hlm-autocomplete-empty>Nothing found.</hlm-autocomplete-empty>
      </ul>
    </div>
  </div>
</div>
```

```ts
import { Component, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-autocomplete-groups',
  standalone: true,
  imports: [...HlmAutocompleteImports],
  templateUrl: './autocomplete-groups.html',
})
export class AutocompleteGroupsComponent {
  readonly query = signal('');
  readonly picked = signal<string | null>(null);
}
```

### 3. Async server search with a status row

Use `HlmAutocompleteSearch` and react to `searchChange` with a debounced fetch:

```ts
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-autocomplete-async',
  standalone: true,
  imports: [...HlmAutocompleteImports],
  template: `
    <div hlmAutocompleteSearch [(search)]="query" [(value)]="user" (searchChange)="onSearch($event)">
      <hlm-autocomplete-input placeholder="Search users..." />
      <div hlmAutocompletePortal>
        <div hlmAutocompleteContent>
          <ul hlmAutocompleteList>
            @for (u of results(); track u.id) {
              <hlm-autocomplete-item [value]="u" [id]="u.id">{{ u.name }}</hlm-autocomplete-item>
            }
            @if (loading()) {
              <hlm-autocomplete-status>Searching…</hlm-autocomplete-status>
            } @else {
              <hlm-autocomplete-empty>No users for "{{ query() }}".</hlm-autocomplete-empty>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class AutocompleteAsyncComponent {
  readonly query = signal('');
  readonly user = signal<{ id: string; name: string } | null>(null);
  readonly results = signal<{ id: string; name: string }[]>([]);
  readonly loading = signal(false);

  constructor() {
    toObservable(this.query)
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((q) => void this.fetch(q));
  }

  onSearch(_: string) {
    this.loading.set(true);
  }

  private async fetch(q: string) {
    if (!q.trim()) {
      this.results.set([]);
      this.loading.set(false);
      return;
    }
    const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`).then((r) => r.json());
    this.results.set(res);
    this.loading.set(false);
  }
}
```

> `switchMap`-based cancellation is preferable for real apps; the manual version above keeps the
> example dependency-free. `onSearch` only flips the spinner — the debounced fetch does the work.

### 4. Reactive-forms binding with validation visuals

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-autocomplete-form',
  standalone: true,
  imports: [...HlmAutocompleteImports, ReactiveFormsModule],
  template: `
    <div hlmAutocomplete [value]="control.value" (valueChange)="control.setValue($event)">
      <hlm-autocomplete-input placeholder="Country (required)..." [forceInvalid]="control.touched && control.invalid" />
      <div hlmAutocompletePortal>
        <div hlmAutocompleteContent>
          <ul hlmAutocompleteList>
            @for (c of countries; track c) {
              <hlm-autocomplete-item [value]="c" [id]="c">{{ c }}</hlm-autocomplete-item>
            }
            <hlm-autocomplete-empty>No match.</hlm-autocomplete-empty>
          </ul>
        </div>
      </div>
    </div>
    @if (control.touched && control.invalid) {
      <p class="tw:mt-1 tw:text-sm tw:text-destructive">Please choose a country.</p>
    }
  `,
})
export class AutocompleteFormComponent {
  readonly control = new FormControl<string | null>(null, Validators.required);
  readonly countries = ['Austria', 'France', 'Japan', 'Kenya', 'Peru'];
}
```

### 5. Custom display strings with `itemToString` (object values)

```ts
import { Component, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

interface Repo {
  id: number;
  fullName: string;
  stars: number;
}

@Component({
  selector: 'app-autocomplete-tostring',
  standalone: true,
  imports: [...HlmAutocompleteImports],
  template: `
    <div hlmAutocomplete [(search)]="query" [(value)]="repo" [itemToString]="toLabel" [isItemEqualToValue]="sameRepo">
      <hlm-autocomplete-input placeholder="Search repos..." [showClear]="true" />
      <div hlmAutocompletePortal>
        <div hlmAutocompleteContent>
          <ul hlmAutocompleteList>
            @for (r of repos; track r.id) {
              <hlm-autocomplete-item [value]="r" [id]="String(r.id)">
                {{ r.fullName }} ★ {{ r.stars }}
              </hlm-autocomplete-item>
            }
            <hlm-autocomplete-empty>No repositories found.</hlm-autocomplete-empty>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class AutocompleteToStringComponent {
  readonly query = signal('');
  readonly repo = signal<Repo | null>(null);
  readonly repos: Repo[] = [
    { id: 1, fullName: 'spartan-ng/spartan', stars: 4200 },
    { id: 2, fullName: 'angular/angular', stars: 96000 },
  ];
  readonly toLabel = (r: Repo | null) => r?.fullName ?? '';
  readonly sameRepo = (a: Repo | null, b: Repo | null) => a?.id === b?.id;
}
```

### 6. Disabled state + custom ids for a11y wiring

```ts
import { Component, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@egose/shadcn-theme-ng/autocomplete';

@Component({
  selector: 'app-autocomplete-disabled',
  standalone: true,
  imports: [...HlmAutocompleteImports],
  template: `
    <label for="city-input" class="tw:mb-1 tw:block tw:text-sm tw:font-medium">City</label>
    <div hlmAutocomplete [disabled]="locked()" [(value)]="city">
      <hlm-autocomplete-input inputId="city-input" placeholder="Pick a city..." />
      <div hlmAutocompletePortal>
        <div hlmAutocompleteContent>
          <ul hlmAutocompleteList>
            <hlm-autocomplete-item [value]="'oslo'" id="oslo">Oslo</hlm-autocomplete-item>
            <hlm-autocomplete-item [value]="'lima'" id="lima">Lima</hlm-autocomplete-item>
            <hlm-autocomplete-empty>No match.</hlm-autocomplete-empty>
          </ul>
        </div>
      </div>
    </div>
    <button class="tw:mt-2" (click)="locked.update((v) => !v)">
      {{ locked() ? 'Unlock' : 'Lock' }}
    </button>
  `,
})
export class AutocompleteDisabledComponent {
  readonly locked = signal(true);
  readonly city = signal<string | null>(null);
}
```

## Accessibility notes

- The input is a real text field (`brnAutocompleteInput`) with listbox semantics from the brain:
  arrow keys move the highlight, `Enter` selects, `Escape` dismisses. The clear button is a native
  `<button>` disabled in sync with the input.
- `HlmAutocompleteEmpty` / `HlmAutocompleteStatus` give screen-reader users feedback for the two
  critical non-visual states (no matches / loading) — always include at least the empty row.
- Label the field: either set `inputId` and pair it with a `<label for>`, or wrap the group with
  `HlmField`/`hlmLabel` from `@egose/shadcn-theme-ng/field` / `.../label`.
- `aria-invalid` auto-detects the parent error state; only set the override when you manage
  validity yourself (e.g. cross-field rules), and pair it with visible error text.

## Theming / CSS variables

Class-based styling; the floating panel width tracks the anchor via the
`--brn-autocomplete-width` custom property set by the brain (`w-(--brn-autocomplete-width)`).
No theme variables of its own — adjust popover placement with the `align` / `sideOffset` inputs.

## Related subpaths

- `@egose/shadcn-theme-ng/input-group` — the input shell composed inside `HlmAutocompleteInput`
- `@egose/shadcn-theme-ng/combobox` — button-triggered (rather than text-anchored) picker
- `@egose/shadcn-theme-ng/command` — command-palette list primitives
- `@egose/shadcn-theme-ng/popover` — lower-level floating panels
