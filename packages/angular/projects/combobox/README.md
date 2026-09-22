# Combobox (`@egose/shadcn-theme-ng/combobox`)

A filterable select / autocomplete-dropdown — the Angular port of shadcn/ui `Combobox`. Single mode (`HlmCombobox`) and multi mode (`HlmComboboxMultiple`) wrap `@spartan-ng/brain/combobox` + `@spartan-ng/brain/popover` host directives, with two anchor styles: a button-like `hlm-combobox-trigger` and an input-like `hlm-combobox-input` (or free-form `hlm-combobox-chips` + `hlm-combobox-chip` tag lists). The dropdown is built from `hlm-combobox-content` + `hlm-combobox-portal` + `hlm-combobox-list` + `hlm-combobox-item` + group/label/empty/status/separator/value-template primitives.

Ships as `@egose/shadcn-theme-ng/combobox` and `@egose/shadcn-theme-ng-tw/combobox` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/combobox/package.json`).

## Imports

```ts
import {
  HlmCombobox,
  HlmComboboxMultiple,
  HlmComboboxTrigger,
  HlmComboboxInput,
  HlmComboboxContent,
  HlmComboboxPortal,
  HlmComboboxList,
  HlmComboboxItem,
  HlmComboboxGroup,
  HlmComboboxLabel,
  HlmComboboxEmpty,
  HlmComboboxStatus,
  HlmComboboxSeparator,
  HlmComboboxPlaceholder,
  HlmComboboxValue,
  HlmComboboxValues,
  HlmComboboxValueTemplate,
  HlmComboboxChips,
  HlmComboboxChip,
  HlmComboboxChipInput,
  HlmComboboxImports,
  HlmComboboxModule,
} from '@egose/shadcn-theme-ng/combobox';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/combobox';
```

> `HlmComboboxChipRemove` (`button[hlmComboboxChipRemove]`) exists in source but is **not** exported from `public-api.ts` — it is rendered internally by `hlm-combobox-chip` when `showRemove` is true.

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmComboboxModule } from '@egose/shadcn-theme-ng/combobox';

@NgModule({ imports: [HlmComboboxModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<!-- Single, button trigger -->
<hlm-combobox [value]="value" [search]="search" (valueChange)="value = $event" (searchChange)="search = $event">
  <hlm-combobox-trigger>Select fruit…</hlm-combobox-trigger>
  <hlm-combobox-content *hlmComboboxPortal>
    <hlm-combobox-list>
      <hlm-combobox-item value="apple">Apple</hlm-combobox-item>
      <hlm-combobox-item value="banana">Banana</hlm-combobox-item>
    </hlm-combobox-list>
    <div hlmComboboxEmpty>No results.</div>
  </hlm-combobox-content>
</hlm-combobox>

<!-- Single, input trigger with clear button -->
<hlm-combobox [value]="v" (valueChange)="v = $event">
  <hlm-combobox-input placeholder="Search…" [showClear]="true" />
  <hlm-combobox-content *hlmComboboxPortal>
    <hlm-combobox-list>
      <div hlmComboboxGroup>
        <span hlmComboboxLabel>Fruits</span>
        <hlm-combobox-item value="apple">Apple</hlm-combobox-item>
      </div>
    </hlm-combobox-list>
  </hlm-combobox-content>
</hlm-combobox>

<!-- Multi, chips anchor -->
<hlm-combobox-multiple [value]="selected" (valueChange)="selected = $event">
  <hlm-combobox-chips>
    @for (v of selected; track v) {
    <hlm-combobox-chip [value]="v">{{ v }}</hlm-combobox-chip>
    }
    <input hlmComboboxChipInput placeholder="Pick…" />
  </hlm-combobox-chips>
  <hlm-combobox-content *hlmComboboxPortal>
    <hlm-combobox-list>
      <hlm-combobox-item value="a">A</hlm-combobox-item>
    </hlm-combobox-list>
  </hlm-combobox-content>
</hlm-combobox-multiple>
```

Real selectors:

| Class                      | Selector                                                       |
| -------------------------- | -------------------------------------------------------------- |
| `HlmCombobox`              | `[hlmCombobox]`, `hlm-combobox`                                |
| `HlmComboboxMultiple`      | `[hlmComboboxMultiple]`, `hlm-combobox-multiple`               |
| `HlmComboboxTrigger`       | `hlm-combobox-trigger` (element only)                          |
| `HlmComboboxInput`         | `hlm-combobox-input` (element only)                            |
| `HlmComboboxItem`          | `hlm-combobox-item` (element only)                             |
| `HlmComboboxContent`       | `[hlmComboboxContent]`, `hlm-combobox-content`                 |
| `HlmComboboxList`          | `[hlmComboboxList]`                                            |
| `HlmComboboxGroup`         | `[hlmComboboxGroup]`                                           |
| `HlmComboboxLabel`         | `[hlmComboboxLabel]`                                           |
| `HlmComboboxEmpty`         | `[hlmComboboxEmpty]`, `hlm-combobox-empty`                     |
| `HlmComboboxStatus`        | `[hlmComboboxStatus]`, `hlm-combobox-status`                   |
| `HlmComboboxSeparator`     | `[hlmComboboxSeparator]`                                       |
| `HlmComboboxPlaceholder`   | `[hlmComboboxPlaceholder]`, `hlm-combobox-placeholder`         |
| `HlmComboboxValue`         | `[hlmComboboxValue]`, `hlm-combobox-value`                     |
| `HlmComboboxValues`        | `[hlmComboboxValues]`                                          |
| `HlmComboboxValueTemplate` | `[hlmComboboxValueTemplate]`                                   |
| `HlmComboboxChips`         | `[hlmComboboxChips]`, `hlm-combobox-chips`                     |
| `HlmComboboxChip`          | `hlm-combobox-chip` (element only)                             |
| `HlmComboboxChipInput`     | `input[hlmComboboxChipInput]` (input only)                     |
| `HlmComboboxPortal`        | `[hlmComboboxPortal]` (use as `*hlmComboboxPortal` on content) |

## API reference

### `HlmCombobox` / `HlmComboboxMultiple` (roots)

Both provide `provideBrnPopoverConfig({ align: 'start', sideOffset: 6 })` and `provideBrnPopoverDefaultOptions({ role: null })`.

| Brain input (`BrnCombobox` / `BrnComboboxMultiple`) | Description                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `autoHighlight`                                     | Auto-highlight first match as the search changes.                                    |
| `disabled`                                          | Locks trigger + list.                                                                |
| `filter`                                            | Custom filter fn (default substring match). Set to `null` for server-filtered lists. |
| `search`                                            | Controlled search text.                                                              |
| `value`                                             | Controlled value (single: item; multiple: array).                                    |
| `itemToString`                                      | `(item) => string` label mapper for object values.                                   |
| `filterOptions`                                     | Extra filter configuration object.                                                   |
| `isItemEqualToValue`                                | Equality predicate for object values.                                                |

| Brain output   | Description                    |
| -------------- | ------------------------------ |
| `searchChange` | Emitted on search-text change. |
| `valueChange`  | Emitted on selection change.   |

Popover passthrough (via `BrnPopover` hostDirective): inputs `align`, `closeOnOutsidePointerEvents`, `sideOffset`, `state`, `offsetX`; outputs `stateChanged`, `closed`.

### `HlmComboboxTrigger` (`hlm-combobox-trigger`)

Renders an `hlmBtn`-styled `<button>` (`brnComboboxTrigger` + anchor + popover-trigger) with a chevron.

| Input                 | Type                        | Default                         | Description                                                           |
| --------------------- | --------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `class` (`userClass`) | `ClassValue`                | `''`                            | Merged onto the button. Placeholder text dims via `data-placeholder`. |
| `buttonId`            | `string`                    | auto (`hlm-combobox-trigger-N`) | Button id.                                                            |
| `variant`             | `ButtonVariants['variant']` | `'outline'`                     | `HlmBtn` variant.                                                     |
| `forceInvalid`        | `boolean`                   | `false`                         | Force error ring regardless of form state.                            |

### `HlmComboboxInput` (`hlm-combobox-input`)

Input-group anchor with chevron trigger + optional clear button.

| Input                                  | Type                   | Default                       | Description                                                   |
| -------------------------------------- | ---------------------- | ----------------------------- | ------------------------------------------------------------- |
| `inputId`                              | `string`               | auto (`hlm-combobox-input-N`) | Input id.                                                     |
| `placeholder`                          | `string`               | `''`                          | Placeholder.                                                  |
| `showTrigger`                          | `boolean`              | `true`                        | Show the chevron popover button.                              |
| `showClear`                            | `boolean`              | `false`                       | Show the `*brnComboboxClear` X button when a value exists.    |
| `forceInvalid`                         | `boolean`              | `false`                       | Force error ring.                                             |
| `aria-invalid` (`ariaInvalidOverride`) | `boolean \| undefined` | `undefined`                   | Manual override; unset = auto-detect from parent error state. |

### Items / list / groups

| Directive              | Brain inputs                | Notes                                                                  |
| ---------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `HlmComboboxItem`      | `id`, `disabled`, `value`   | Shows `lucideCheck` at `end-2` when `active`.                          |
| `HlmComboboxList`      | `id`                        | Scroll container (`max-h-72`-ish).                                     |
| `HlmComboboxGroup`     | (none, `BrnComboboxGroup`)  | `data-hidden` hides empty groups.                                      |
| `HlmComboboxLabel`     | `id`                        | Muted `text-xs` group heading.                                         |
| `HlmComboboxEmpty`     | (none, `BrnComboboxEmpty`)  | Shown only when the content is `data-empty` (`group-data-empty:flex`). |
| `HlmComboboxStatus`    | (none, `BrnComboboxStatus`) | Loading/status row (`"Loading…"`, counts).                             |
| `HlmComboboxSeparator` | `orientation`               | 1px `bg-border` divider.                                               |

### Values / placeholders / chips

| Directive                                          | Notes                                                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `HlmComboboxPlaceholder`                           | Visible when no value (`data-hidden` hides it once selected).                                                    |
| `HlmComboboxValue` (`inputs: ['placeholder']`)     | Value display wrapper.                                                                                           |
| `HlmComboboxValues`                                | Multi-value container (brain).                                                                                   |
| `HlmComboboxValueTemplate`                         | Custom selected-value template marker (brain).                                                                   |
| `HlmComboboxChips` (`input forceInvalid=false`)    | Wrap-around anchor (`BrnComboboxAnchor` + popover-trigger) for tag UIs; reflects `data-matches-spartan-invalid`. |
| `HlmComboboxChip` (`input showRemove=true`)        | Tag pill with internal remove button.                                                                            |
| `HlmComboboxChipInput` (`inputs id, aria-invalid`) | The free-text `<input>` inside chips.                                                                            |
| `HlmComboboxContent`                               | Popover panel (`w-(--brn-combobox-width)`, `max-h-72`). Pair with `*hlmComboboxPortal`.                          |
| `HlmComboboxPortal` (`inputs context, class`)      | Structural portal directive — `*hlmComboboxPortal` teleports content to the popover overlay.                     |

## Examples

### 1. Basic single combobox (button trigger)

```ts
import { Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

const FRUITS = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'];

@Component({
  selector: 'app-basic-combobox',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `
    <hlm-combobox [value]="value()" (valueChange)="value.set($event)">
      <hlm-combobox-trigger>{{ value() ?? 'Select fruit…' }}</hlm-combobox-trigger>
      <hlm-combobox-content *hlmComboboxPortal>
        <hlm-combobox-list>
          @for (f of FRUITS; track f) {
            <hlm-combobox-item [value]="f">{{ f }}</hlm-combobox-item>
          }
        </hlm-combobox-list>
        <div hlmComboboxEmpty>No fruit found.</div>
      </hlm-combobox-content>
    </hlm-combobox>
    <p class="mt-2 text-sm">Value: {{ value() ?? 'none' }}</p>
  `,
})
export class BasicComboboxComponent {
  readonly value = signal<string | undefined>(undefined);
  protected readonly FRUITS = FRUITS;
}
```

### 2. Searchable input trigger with clear button + groups

```ts
import { Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

@Component({
  selector: 'app-grouped-combobox',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `
    <hlm-combobox
      [value]="value()"
      [search]="search()"
      (valueChange)="value.set($event)"
      (searchChange)="search.set($event)"
    >
      <hlm-combobox-input placeholder="Search timezone…" [showClear]="true" />
      <hlm-combobox-content *hlmComboboxPortal>
        <hlm-combobox-list>
          <div hlmComboboxGroup>
            <span hlmComboboxLabel>Americas</span>
            @for (tz of americas; track tz) {
              <hlm-combobox-item [value]="tz">{{ tz }}</hlm-combobox-item>
            }
          </div>
          <div hlmComboboxSeparator></div>
          <div hlmComboboxGroup>
            <span hlmComboboxLabel>Europe</span>
            @for (tz of europe; track tz) {
              <hlm-combobox-item [value]="tz">{{ tz }}</hlm-combobox-item>
            }
          </div>
        </hlm-combobox-list>
        <div hlmComboboxEmpty>No timezone found.</div>
      </hlm-combobox-content>
    </hlm-combobox>
  `,
})
export class GroupedComboboxComponent {
  readonly value = signal<string | undefined>(undefined);
  readonly search = signal('');
  readonly americas = ['America/New_York', 'America/Chicago', 'America/Los_Angeles'];
  readonly europe = ['Europe/London', 'Europe/Berlin', 'Europe/Bucharest'];
}
```

### 3. Multi-select with removable chips

```ts
import { Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

@Component({
  selector: 'app-multi-combobox',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `
    <hlm-combobox-multiple [value]="selected()" (valueChange)="selected.set($event ?? [])">
      <hlm-combobox-chips>
        @for (v of selected(); track v) {
          <hlm-combobox-chip [value]="v">{{ v }}</hlm-combobox-chip>
        }
        <input hlmComboboxChipInput placeholder="Add tag…" />
      </hlm-combobox-chips>
      <hlm-combobox-content *hlmComboboxPortal>
        <hlm-combobox-list>
          @for (opt of options; track opt) {
            <hlm-combobox-item [value]="opt">{{ opt }}</hlm-combobox-item>
          }
        </hlm-combobox-list>
        <div hlmComboboxEmpty>Nothing left to add.</div>
      </hlm-combobox-content>
    </hlm-combobox-multiple>
    <p class="mt-2 text-sm">{{ selected().length }} selected</p>
  `,
})
export class MultiComboboxComponent {
  readonly selected = signal<string[]>(['Angular']);
  readonly options = ['Angular', 'React', 'Vue', 'Svelte', 'Solid'];
}
```

### 4. Disabled + invalid + custom filter states

```ts
import { Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

@Component({
  selector: 'app-states-combobox',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `
    <div class="space-y-4">
      <hlm-combobox [disabled]="true">
        <hlm-combobox-trigger>Disabled</hlm-combobox-trigger>
      </hlm-combobox>

      <hlm-combobox [value]="v()" (valueChange)="v.set($event)">
        <hlm-combobox-trigger [forceInvalid]="submitted() && !v()">Pick (required)</hlm-combobox-trigger>
        <hlm-combobox-content *hlmComboboxPortal>
          <hlm-combobox-list>
            <hlm-combobox-item value="a">Option A</hlm-combobox-item>
            <hlm-combobox-item value="b" [disabled]="true">Option B (disabled item)</hlm-combobox-item>
          </hlm-combobox-list>
        </hlm-combobox-content>
      </hlm-combobox>
      <button type="button" (click)="submitted.set(true)">Submit</button>

      <!-- Case-insensitive startsWith filter -->
      <hlm-combobox [filter]="startsWith" [value]="v2()" (valueChange)="v2.set($event)">
        <hlm-combobox-input placeholder="startsWith filter…" />
        <hlm-combobox-content *hlmComboboxPortal>
          <hlm-combobox-list>
            <hlm-combobox-item value="apple">apple</hlm-combobox-item>
            <hlm-combobox-item value="apricot">apricot</hlm-combobox-item>
            <hlm-combobox-item value="banana">banana</hlm-combobox-item>
          </hlm-combobox-list>
        </hlm-combobox-content>
      </hlm-combobox>
    </div>
  `,
})
export class StatesComboboxComponent {
  readonly v = signal<string | undefined>(undefined);
  readonly v2 = signal<string | undefined>(undefined);
  readonly submitted = signal(false);
  readonly startsWith = (item: string, search: string) => item.toLowerCase().startsWith(search.toLowerCase());
}
```

### 5. Object values (`itemToString` + equality) with custom value template

```ts
import { Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-object-combobox',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `
    <hlm-combobox
      [value]="assignee()"
      [itemToString]="toName"
      [isItemEqualToValue]="byId"
      (valueChange)="assignee.set($event)"
    >
      <hlm-combobox-trigger>
        <span hlmComboboxValue [placeholder]="'Assign to…'">
          {{ assignee()?.name ?? 'Assign to…' }}
        </span>
      </hlm-combobox-trigger>
      <hlm-combobox-content *hlmComboboxPortal>
        <hlm-combobox-list>
          @for (u of users; track u.id) {
            <hlm-combobox-item [value]="u">
              <span class="flex flex-col">
                <span>{{ u.name }}</span>
                <span class="text-muted-foreground text-xs">{{ u.email }}</span>
              </span>
            </hlm-combobox-item>
          }
        </hlm-combobox-list>
        <div hlmComboboxEmpty>No users.</div>
      </hlm-combobox-content>
    </hlm-combobox>
  `,
})
export class ObjectComboboxComponent {
  readonly users: User[] = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    { id: 2, name: 'Grace Hopper', email: 'grace@example.com' },
  ];
  readonly assignee = signal<User | undefined>(undefined);
  readonly toName = (u: User | undefined) => u?.name ?? '';
  readonly byId = (a: User, b: User) => a.id === b.id;
}
```

### 6. Async search (server filtering + status row)

Set `[filter]="null"` to disable client filtering, then feed options from your own observable/signal.

```ts
import { Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@egose/shadcn-theme-ng/combobox';

@Component({
  selector: 'app-async-combobox',
  standalone: true,
  imports: [...HlmComboboxImports],
  template: `
    <hlm-combobox
      [filter]="null"
      [search]="search()"
      [value]="value()"
      (searchChange)="onSearch($event)"
      (valueChange)="value.set($event)"
    >
      <hlm-combobox-input placeholder="Search repos…" />
      <hlm-combobox-content *hlmComboboxPortal>
        @if (loading()) {
          <div hlmComboboxStatus>Searching…</div>
        }
        <hlm-combobox-list>
          @for (r of results(); track r) {
            <hlm-combobox-item [value]="r">{{ r }}</hlm-combobox-item>
          }
        </hlm-combobox-list>
        @if (!loading() && results().length === 0) {
          <div hlmComboboxEmpty>No repositories found.</div>
        }
      </hlm-combobox-content>
    </hlm-combobox>
  `,
})
export class AsyncComboboxComponent {
  readonly search = signal('');
  readonly value = signal<string | undefined>(undefined);
  readonly results = signal<string[]>([]);
  readonly loading = signal(false);

  async onSearch(q: string) {
    this.search.set(q);
    this.loading.set(true);
    // Simulate a debounced fetch — replace with HttpClient in real apps:
    await new Promise((r) => setTimeout(r, 250));
    const ALL = ['shadcn-theme', 'spartan-ng', 'angular', 'ember-tracker'];
    this.results.set(ALL.filter((r) => r.includes(q.toLowerCase())));
    this.loading.set(false);
  }
}
```

## Accessibility notes

- Anchors are real controls: trigger is a `<button>`, input mode is a real `<input>`, chips mode keeps a focusable text input — keyboard users can always reach and operate the list.
- Items expose active/highlighted + disabled states via brain directives; keep the `lucideCheck` selected indicator (it is `aria-hidden`, state comes from semantics, not the icon).
- `HlmComboboxEmpty` / `HlmComboboxStatus` give screen-reader users feedback for no-results and loading — always render one of them.
- Label the control: `hlm-combobox-trigger` content, `placeholder`, or an external `<label [for]="inputId">`. The popover defaults to `role: null` (list semantics come from the combobox directives) — do not add a redundant dialog role.

## Theming / CSS variables

No component-specific CSS variables. The panel width tracks the anchor (`w-(--brn-combobox-width)`), with `bg-popover` / `text-popover-foreground`, `ring-foreground/10`, `max-h-72` scrolling, and `data-open`/`data-closed` enter/exit animations. Invalid states use `border-destructive` / `ring-destructive/20` via `forceInvalid` or the parent spartan error state.

## Related subpaths

- `@egose/shadcn-theme-ng/popover` — underlying overlay positioning (`align`, `sideOffset`).
- `@egose/shadcn-theme-ng/input-group` — powers `hlm-combobox-input` chrome (chevron/clear addons).
- `@egose/shadcn-theme-ng/button` — trigger button variants.
- `@egose/shadcn-theme-ng/command` — command-palette alternative for action search (vs item picking).
