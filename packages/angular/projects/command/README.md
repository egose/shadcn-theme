# Command (`@egose/shadcn-theme-ng/command`)

A command palette / filterable action list — the Angular port of shadcn/ui `Command` (cmdk). `HlmCommand` (wrapping `BrnCommand` from `@spartan-ng/brain/command`) owns filter/search/disabled state and `valueChange`/`searchChange` outputs; inside it you compose `hlm-command-input` (search field with icon), `hlm-command-list` (scroll region), `hlm-command-group` + `hlm-command-group-label` (sections), `button[hlmCommandItem]` (selectable rows), `hlm-command-separator`, `hlm-command-shortcut` (hint kbd), `hlmCommandEmpty` / `hlmCommandEmptyState` (no-results), and `hlm-command-dialog` (dialog-hosted palette via `@egose/shadcn-theme-ng/dialog`).

Ships as `@egose/shadcn-theme-ng/command` and `@egose/shadcn-theme-ng-tw/command` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/command/package.json`); the dialog variant additionally uses `@egose/shadcn-theme-ng/dialog`.

## Imports

```ts
import {
  HlmCommand,
  HlmCommandDialog,
  HlmCommandEmpty,
  HlmCommandEmptyState,
  HlmCommandGroup,
  HlmCommandGroupLabel,
  HlmCommandInput,
  HlmCommandItem,
  HlmCommandList,
  HlmCommandSeparator,
  HlmCommandShortcut,
  HlmCommandImports,
  HlmCommandModule,
} from '@egose/shadcn-theme-ng/command';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/command';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmCommandModule } from '@egose/shadcn-theme-ng/command';

@NgModule({ imports: [HlmCommandModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<hlm-command [search]="q" (searchChange)="q = $event" (valueChange)="run($event)">
  <hlm-command-input placeholder="Type a command…" />
  <hlm-command-list>
    <div hlmCommandEmpty>No results found.</div>
    <hlm-command-group>
      <span hlmCommandGroupLabel>Suggestions</span>
      <button hlmCommandItem value="calendar">Calendar <span hlmCommandShortcut>⌘C</span></button>
      <button hlmCommandItem value="settings">Settings</button>
    </hlm-command-group>
    <hlm-command-separator></hlm-command-separator>
    <hlm-command-group>
      <span hlmCommandGroupLabel>Actions</span>
      <button hlmCommandItem value="logout">Log out</button>
    </hlm-command-group>
  </hlm-command-list>
</hlm-command>

<!-- Dialog-hosted palette -->
<hlm-command-dialog
  title="Command Palette"
  description="Search for a command to run..."
  [state]="dialogState"
  (stateChange)="dialogState = $event"
>
  <hlm-command>…same inner structure…</hlm-command>
</hlm-command-dialog>
```

Real selectors:

| Class                  | Selector                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| `HlmCommand`           | `[hlmCommand]`, `hlm-command`                                      |
| `HlmCommandDialog`     | `hlm-command-dialog` (element only)                                |
| `HlmCommandInput`      | `hlm-command-input` (element only)                                 |
| `HlmCommandList`       | `[hlmCommandList]`, `hlm-command-list`                             |
| `HlmCommandGroup`      | `[hlmCommandGroup]`, `hlm-command-group`                           |
| `HlmCommandGroupLabel` | `[hlmCommandGroupLabel]`, `hlm-command-group-label`                |
| `HlmCommandItem`       | `button[hlmCommandItem]`, `button[hlm-command-item]` (button only) |
| `HlmCommandSeparator`  | `[hlmCommandSeparator]`, `hlm-command-separator`                   |
| `HlmCommandShortcut`   | `[hlmCommandShortcut]`, `hlm-command-shortcut`                     |
| `HlmCommandEmpty`      | `[hlmCommandEmpty]` (styling only, no brain)                       |
| `HlmCommandEmptyState` | `[hlmCommandEmptyState]` (wraps `BrnCommandEmpty`)                 |

## API reference

### `HlmCommand` (`[hlmCommand]`, `hlm-command`)

| Brain input (`BrnCommand`) | Description                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `id`                       | Command root id.                                                                            |
| `filter`                   | Custom filter fn `(value, search) => boolean/number`. Omit for default substring filtering. |
| `search`                   | Controlled search text.                                                                     |
| `disabled`                 | Disables all items.                                                                         |

| Brain output   | Payload             | Description                             |
| -------------- | ------------------- | --------------------------------------- |
| `valueChange`  | selected item value | Emitted when the active item is chosen. |
| `searchChange` | `string`            | Emitted on search input.                |

### `HlmCommandInput` (`hlm-command-input`)

Search field wrapped in an `hlm-input-group` with a leading search icon.

| Input         | Type                  | Default     | Description                               |
| ------------- | --------------------- | ----------- | ----------------------------------------- |
| `inputId`     | `string \| undefined` | `undefined` | Forwarded to the inner `brnCommandInput`. |
| `placeholder` | `string`              | `''`        | Placeholder text.                         |

### `HlmCommandItem` (`button[hlmCommandItem]`)

| Brain input (`BrnCommandItem`) | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `value`                        | Item value reported via `valueChange` / `selected`.       |
| `disabled`                     | Disables this row (`data-disabled`, pointer-events none). |
| `id`                           | Item id.                                                  |

| Brain output | Description                                  |
| ------------ | -------------------------------------------- |
| `selected`   | Emitted when this specific item is selected. |

Must be a `<button>` — the selector does not match other elements.

### Groups / list / chrome

| Directive              | Brain inputs              | Notes                                                                                                      |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `HlmCommandList`       | `id` (`BrnCommandList`)   | Scroll region (`max-h-72`, custom `no-scrollbar`).                                                         |
| `HlmCommandGroup`      | `id` (`BrnCommandGroup`)  | Section; auto-hides when empty (`data-hidden`).                                                            |
| `HlmCommandGroupLabel` | —                         | Muted `text-xs` section heading (`role="presentation"`).                                                   |
| `HlmCommandSeparator`  | — (`BrnCommandSeparator`) | 1px `bg-border` divider; hides when adjacent groups are empty.                                             |
| `HlmCommandShortcut`   | —                         | Right-aligned `text-xs tracking-widest` kbd hint; inherits selected-row color.                             |
| `HlmCommandEmpty`      | —                         | Static centered `py-6 text-sm` row — show conditionally or always (CSS does not auto-toggle it).           |
| `HlmCommandEmptyState` | — (`BrnCommandEmpty`)     | Brain-driven empty marker — auto-shown when the filter removes every item. Prefer this for filtered lists. |

### `HlmCommandDialog` (`hlm-command-dialog`)

| Input                | Type             | Default                            | Description                                                                               |
| -------------------- | ---------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `title`              | `string`         | `'Command Palette'`                | Sr-only dialog title (accessibility).                                                     |
| `description`        | `string`         | `'Search for a command to run...'` | Sr-only dialog description.                                                               |
| `state`              | `BrnDialogState` | `'closed'`                         | Controlled dialog state (`'open' \| 'closed'`). Mirrored into an internal `linkedSignal`. |
| `showCloseButton`    | `boolean`        | `false`                            | Show the dialog X button.                                                                 |
| `dialogContentClass` | `ClassValue`     | `''`                               | Merged onto the content (`tw:w-96 tw:p-0` base).                                          |

| Output        | Payload          | Description                                               |
| ------------- | ---------------- | --------------------------------------------------------- |
| `stateChange` | `BrnDialogState` | Emitted on open/close (also updates the internal signal). |

## Examples

### 1. Basic inline palette with shortcuts

```ts
import { Component, signal } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-basic-command',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `
    <hlm-command class="max-w-md rounded-xl border" (valueChange)="run($event)">
      <hlm-command-input placeholder="Type a command…" />
      <hlm-command-list>
        <div hlmCommandEmpty>No results found.</div>
        <hlm-command-group>
          <span hlmCommandGroupLabel>Suggestions</span>
          <button hlmCommandItem value="calendar">Calendar</button>
          <button hlmCommandItem value="search-emoji">Search emoji</button>
          <button hlmCommandItem value="calculator">Calculator</button>
        </hlm-command-group>
        <hlm-command-separator></hlm-command-separator>
        <hlm-command-group>
          <span hlmCommandGroupLabel>Settings</span>
          <button hlmCommandItem value="profile">Profile <span hlmCommandShortcut>⌘P</span></button>
          <button hlmCommandItem value="billing">Billing <span hlmCommandShortcut>⌘B</span></button>
        </hlm-command-group>
      </hlm-command-list>
    </hlm-command>
    <p class="mt-2 text-sm">Last run: {{ last() }}</p>
  `,
})
export class BasicCommandComponent {
  readonly last = signal('none');
  run(value: string) {
    this.last.set(value);
  }
}
```

### 2. Controlled search + per-item `selected`

```ts
import { Component, signal } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-controlled-command',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `
    <hlm-command class="max-w-md rounded-xl border" [search]="q()" (searchChange)="q.set($event)">
      <hlm-command-input placeholder="Filter…" />
      <hlm-command-list>
        <span hlmCommandEmptyState>No match for "{{ q() }}"</span>
        <hlm-command-group>
          @for (f of files; track f) {
            <button hlmCommandItem [value]="f" (selected)="open(f)">{{ f }}</button>
          }
        </hlm-command-group>
      </hlm-command-list>
    </hlm-command>
    <button type="button" (click)="q.set('')">Clear search</button>
  `,
})
export class ControlledCommandComponent {
  readonly q = signal('');
  readonly files = ['README.md', 'CHANGELOG.md', 'package.json', 'angular.json'];
  open(f: string) {
    console.log('open', f);
  }
}
```

### 3. Dialog palette (`hlm-command-dialog`) with keyboard shortcut

The standard ⌘K / Ctrl+K palette: a global keydown flips `state` to `'open'`.

```ts
import { Component, HostListener, signal } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';

@Component({
  selector: 'app-dialog-command',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `
    <button type="button" (click)="open()">Open palette (⌘K)</button>
    <hlm-command-dialog
      title="Actions"
      description="Search actions…"
      [state]="state()"
      (stateChange)="state.set($event)"
    >
      <hlm-command (valueChange)="run($event)">
        <hlm-command-input placeholder="Search actions…" />
        <hlm-command-list>
          <span hlmCommandEmptyState>Nothing found.</span>
          <hlm-command-group>
            <span hlmCommandGroupLabel>Actions</span>
            <button hlmCommandItem value="new-file">New file <span hlmCommandShortcut>⌘N</span></button>
            <button hlmCommandItem value="save">Save <span hlmCommandShortcut>⌘S</span></button>
            <button hlmCommandItem value="close" (selected)="state.set('closed')">Close palette</button>
          </hlm-command-group>
        </hlm-command-list>
      </hlm-command>
    </hlm-command-dialog>
  `,
})
export class DialogCommandComponent {
  readonly state = signal<BrnDialogState>('closed');
  open() {
    this.state.set('open');
  }
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.state.set(this.state() === 'open' ? 'closed' : 'open');
    }
  }
  run(v: string) {
    console.log('run', v);
    this.state.set('closed');
  }
}
```

### 4. Disabled rows + whole-palette disabled

```ts
import { Component, signal } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-disabled-command',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `
    <label class="mb-2 flex items-center gap-2 text-sm">
      <input type="checkbox" [checked]="locked()" (change)="locked.set(!locked())" /> Lock palette
    </label>
    <hlm-command class="max-w-md rounded-xl border" [disabled]="locked()">
      <hlm-command-input placeholder="Search…" />
      <hlm-command-list>
        <hlm-command-group>
          <button hlmCommandItem value="edit">Edit</button>
          <button hlmCommandItem value="delete" [disabled]="true">Delete (no permission)</button>
        </hlm-command-group>
      </hlm-command-list>
    </hlm-command>
  `,
})
export class DisabledCommandComponent {
  readonly locked = signal(false);
}
```

### 5. Custom filter (fuzzy initials)

```ts
import { Component } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-filter-command',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `
    <hlm-command class="max-w-md rounded-xl border" [filter]="initialsFilter">
      <hlm-command-input placeholder="Try 'np' for New Project…" />
      <hlm-command-list>
        <span hlmCommandEmptyState>No match.</span>
        <hlm-command-group>
          <button hlmCommandItem value="New Project">New Project</button>
          <button hlmCommandItem value="New Page">New Page</button>
          <button hlmCommandItem value="Open Settings">Open Settings</button>
        </hlm-command-group>
      </hlm-command-list>
    </hlm-command>
  `,
})
export class FilterCommandComponent {
  // Match when every search char appears in order in the value's initials+letters:
  readonly initialsFilter = (value: string, search: string) => {
    const v = value.toLowerCase();
    const s = search.toLowerCase().replace(/\s+/g, '');
    let i = 0;
    for (const ch of v) {
      if (ch === s[i]) i++;
      if (i === s.length) return 1;
    }
    return 0;
  };
}
```

### 6. Async results (manual list, no filter)

Drive the list yourself (e.g. from `HttpClient`) and disable the built-in filter by matching everything.

```ts
import { Component, signal } from '@angular/core';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-async-command',
  standalone: true,
  imports: [...HlmCommandImports],
  template: `
    <hlm-command class="max-w-md rounded-xl border" [filter]="matchAll" [search]="q()" (searchChange)="search($event)">
      <hlm-command-input placeholder="Search users…" />
      <hlm-command-list>
        @if (loading()) {
          <p class="text-muted-foreground px-2 py-6 text-center text-sm">Searching…</p>
        } @else if (results().length === 0) {
          <div hlmCommandEmpty>No users found.</div>
        }
        <hlm-command-group>
          @for (u of results(); track u) {
            <button hlmCommandItem [value]="u">{{ u }}</button>
          }
        </hlm-command-group>
      </hlm-command-list>
    </hlm-command>
  `,
})
export class AsyncCommandComponent {
  readonly q = signal('');
  readonly results = signal<string[]>(['Ada', 'Grace', 'Margaret']);
  readonly loading = signal(false);
  readonly matchAll = () => 1;

  async search(next: string) {
    this.q.set(next);
    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 300));
    const ALL = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Katherine Johnson'];
    this.results.set(ALL.filter((n) => n.toLowerCase().includes(next.toLowerCase())));
    this.loading.set(false);
  }
}
```

## Accessibility notes

- The dialog variant renders sr-only `title`/`description` (`hlm-dialog-header`) so screen readers announce the palette — always set meaningful values instead of the defaults when the palette has a specific purpose.
- Items are native `<button>`s with `data-selected` / `data-disabled` states; arrow-key navigation and Enter selection come from `BrnCommand` — preserve the `data-[selected]` highlight styles.
- The input is a labeled search field (placeholder + icon). For icon-only placements, add `inputId` + an external `<label>`.
- `HlmCommandEmptyState` (brain-driven) is preferable to static `HlmCommandEmpty` for filtered lists so empty announcements track the filter.

## Theming / CSS variables

No component-specific CSS variables. The root is `bg-popover text-popover-foreground rounded-xl`; selected rows use `data-selected:bg-muted`; the list caps at `max-h-72`. The dialog content is `w-96 p-0` by default — widen via `dialogContentClass`.

## Related subpaths

- `@egose/shadcn-theme-ng/dialog` — powers `hlm-command-dialog` (state, portal, close button).
- `@egose/shadcn-theme-ng/input-group` — search-field chrome inside `hlm-command-input`.
- `@egose/shadcn-theme-ng/popover` — alternative inline host for floating palettes.
- `@egose/shadcn-theme-ng/combobox` — item-picking alternative when you need a form value instead of an action runner.
