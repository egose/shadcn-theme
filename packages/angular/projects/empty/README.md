# Empty (`@egose/shadcn-theme-ng/empty`)

An empty-state placeholder in the shadcn/ui Empty style: dashed bordered panel with media (icon/illustration), title, description, and action content. Equivalent to shadcn/ui `Empty`.

The Angular implementation is a set of pure styling directives — there is no headless primitive or
behavioral code. Each directive applies its `data-slot` shadcn classes via `classes()` from
`@egose/shadcn-theme-ng/utils`; `HlmEmptyMedia` adds a `cva` variant (`default` | `icon`).

> **Ships as:** `@egose/shadcn-theme-ng/empty` and `@egose/shadcn-theme-ng-tw/empty`
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
[package README](../../README.md#peer-dependencies). This subpath has no extra runtime component
dependencies beyond `@egose/shadcn-theme-ng/utils` and `class-variance-authority` (media variant).

## Imports

All symbols are exported from the subpath root (`projects/empty/src/public-api.ts`):

```ts
import {
  HlmEmpty,
  HlmEmptyHeader,
  HlmEmptyTitle,
  HlmEmptyDescription,
  HlmEmptyContent,
  HlmEmptyMedia,
  HlmEmptyImports,
  HlmEmptyModule,
} from '@egose/shadcn-theme-ng/empty';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/empty'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmEmptyImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmEmptyModule } from '@egose/shadcn-theme-ng/empty';

@NgModule({ imports: [HlmEmptyModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<div hlmEmpty>
  <div hlmEmptyMedia variant="icon">
    <ng-icon name="lucideInbox" />
  </div>
  <div hlmEmptyHeader>
    <h3 hlmEmptyTitle>No results found</h3>
    <p hlmEmptyDescription>Try adjusting your search or filters.</p>
  </div>
  <div hlmEmptyContent>
    <button hlmBtn variant="outline">Clear filters</button>
  </div>
</div>
```

Real selectors (from source):

| Class                 | Selector(s)                            | Kind                       |
| --------------------- | -------------------------------------- | -------------------------- |
| `HlmEmpty`            | `[hlmEmpty], hlm-empty`                | Directive                  |
| `HlmEmptyHeader`      | `[hlmEmptyHeader], hlm-empty-header`   | Directive                  |
| `HlmEmptyTitle`       | `[hlmEmptyTitle]`                      | Directive (attribute only) |
| `HlmEmptyDescription` | `[hlmEmptyDescription]`                | Directive (attribute only) |
| `HlmEmptyContent`     | `[hlmEmptyContent], hlm-empty-content` | Directive                  |
| `HlmEmptyMedia`       | `[hlmEmptyMedia], hlm-empty-media`     | Directive                  |

## API reference

All directives are style-only (no inputs except media, no outputs).

| Directive             | Selector                               | Description                                                  |
| --------------------- | -------------------------------------- | ------------------------------------------------------------ |
| `HlmEmpty`            | `[hlmEmpty], hlm-empty`                | Dashed rounded panel, centered column layout.                |
| `HlmEmptyHeader`      | `[hlmEmptyHeader], hlm-empty-header`   | Narrow centered stack for title + description.               |
| `HlmEmptyTitle`       | `[hlmEmptyTitle]`                      | Large medium title. Apply to a heading element.              |
| `HlmEmptyDescription` | `[hlmEmptyDescription]`                | Muted small description with link styling. Apply to a `<p>`. |
| `HlmEmptyContent`     | `[hlmEmptyContent], hlm-empty-content` | Action area (buttons, inputs) below the header.              |

### `HlmEmptyMedia` — `[hlmEmptyMedia], hlm-empty-media`

| Input     | Type                  | Default                   | Description                                                                                                   |
| --------- | --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `variant` | `'default' \| 'icon'` | `'default'` (cva default) | `'icon'` renders a muted rounded tile sized for an `ng-icon`; `'default'` is transparent (for illustrations). |

Host sets `data-slot="empty-media"` and `data-variant`.

## Examples

### 1. Basic no-results state

```ts
import { Component } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [...HlmEmptyImports, HlmButton],
  template: `
    <div hlmEmpty>
      <div hlmEmptyHeader>
        <h3 hlmEmptyTitle>No results found</h3>
        <p hlmEmptyDescription>Try adjusting your search or filter to find what you're looking for.</p>
      </div>
      <div hlmEmptyContent>
        <button hlmBtn variant="outline" (click)="clear()">Clear filters</button>
      </div>
    </div>
  `,
})
export class NoResultsComponent {
  clear() {
    console.log('filters cleared');
  }
}
```

### 2. Icon media variant

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-inbox-empty',
  standalone: true,
  imports: [...HlmEmptyImports, HlmButton, NgIcon],
  providers: [provideIcons({ lucideInbox })],
  template: `
    <div hlmEmpty>
      <div hlmEmptyMedia variant="icon">
        <ng-icon name="lucideInbox" />
      </div>
      <div hlmEmptyHeader>
        <h3 hlmEmptyTitle>Inbox zero</h3>
        <p hlmEmptyDescription>You're all caught up. New messages will appear here.</p>
      </div>
      <div hlmEmptyContent>
        <button hlmBtn>Compose</button>
      </div>
    </div>
  `,
})
export class InboxEmptyComponent {}
```

### 3. Illustration media (default variant)

```ts
import { Component } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-illustration',
  standalone: true,
  imports: [...HlmEmptyImports, HlmButton],
  template: `
    <div hlmEmpty>
      <div hlmEmptyMedia>
        <img src="/assets/empty-projects.svg" alt="" width="120" height="120" />
      </div>
      <div hlmEmptyHeader>
        <h3 hlmEmptyTitle>No projects yet</h3>
        <p hlmEmptyDescription>
          Get started by creating your first project. Read the <a href="/docs">docs</a> for ideas.
        </p>
      </div>
      <div hlmEmptyContent>
        <button hlmBtn>Create project</button>
        <button hlmBtn variant="ghost">Import</button>
      </div>
    </div>
  `,
})
export class IllustrationComponent {}
```

### 4. Element spellings

```ts
import { Component } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';

@Component({
  selector: 'app-elements',
  standalone: true,
  imports: [...HlmEmptyImports],
  template: `
    <hlm-empty>
      <hlm-empty-header>
        <h3 hlmEmptyTitle>Nothing here</h3>
        <p hlmEmptyDescription>This space is intentionally left blank.</p>
      </hlm-empty-header>
      <hlm-empty-content>
        <p class="tw:text-sm">Custom element selectors work identically.</p>
      </hlm-empty-content>
    </hlm-empty>
  `,
})
export class ElementsComponent {}
```

### 5. Search empty state with input action

```ts
import { Component, signal } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearchX } from '@ng-icons/lucide';

@Component({
  selector: 'app-search-empty',
  standalone: true,
  imports: [...HlmEmptyImports, HlmButton, HlmInput, NgIcon],
  providers: [provideIcons({ lucideSearchX })],
  template: `
    <div hlmEmpty>
      <div hlmEmptyMedia variant="icon">
        <ng-icon name="lucideSearchX" />
      </div>
      <div hlmEmptyHeader>
        <h3 hlmEmptyTitle>No matches for "{{ query() }}"</h3>
        <p hlmEmptyDescription>Check your spelling or try a different keyword.</p>
      </div>
      <div hlmEmptyContent>
        <input hlmInput [value]="query()" (input)="query.set($any($event.target).value)" placeholder="Search again" />
        <button hlmBtn variant="outline" (click)="query.set('')">Reset search</button>
      </div>
    </div>
  `,
})
export class SearchEmptyComponent {
  readonly query = signal('qwerty');
}
```

### 6. Error / offline state

```ts
import { Component, signal } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideWifiOff } from '@ng-icons/lucide';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [...HlmEmptyImports, HlmButton, HlmSpinner, NgIcon],
  providers: [provideIcons({ lucideWifiOff })],
  template: `
    <div hlmEmpty>
      <div hlmEmptyMedia variant="icon">
        @if (retrying()) {
          <hlm-spinner />
        } @else {
          <ng-icon name="lucideWifiOff" />
        }
      </div>
      <div hlmEmptyHeader>
        <h3 hlmEmptyTitle>You're offline</h3>
        <p hlmEmptyDescription>We couldn't load your data. Check your connection and retry.</p>
      </div>
      <div hlmEmptyContent>
        <button hlmBtn variant="outline" [disabled]="retrying()" (click)="retry()">Try again</button>
      </div>
    </div>
  `,
})
export class OfflineComponent {
  readonly retrying = signal(false);
  retry() {
    this.retrying.set(true);
    setTimeout(() => this.retrying.set(false), 1200);
  }
}
```

## Accessibility notes

- Use a real heading level for `hlmEmptyTitle` (`h2`/`h3` matching the page outline) — the directive adds no role or level itself.
- Mark decorative media `aria-hidden="true"` (or `alt=""` on images); give meaningful illustrations an `alt` or `role="img"` + `aria-label`.
- Keep the empty panel out of the tab order except for its interactive content (buttons/inputs); do not add `tabindex` to the container.
- For async states (loading → empty → results), announce changes with an `aria-live` region around the title or content.

## Theming / CSS variables

No component-specific CSS variables. Geometry comes from the directives; colors from global tokens (`--muted`, `--muted-foreground`, `--background`). The `icon` media variant sizes `ng-icon` via `[&_ng-icon]` selectors — pass icon size through the icon itself if you need a different size.

## Related subpaths

- `@egose/shadcn-theme-ng/card` — bordered container alternative when the state needs richer layout.
- `@egose/shadcn-theme-ng/skeleton` — loading placeholder to show before the empty state resolves.
- `@egose/shadcn-theme-ng/button` — `hlmBtn` actions inside `hlmEmptyContent`.
- `@egose/shadcn-theme-ng/spinner` — loading indicator for retrying/error empties.
