# Tabs (`@egose/shadcn-theme-ng/tabs`)

Tabbed navigation, equivalent to [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/tabs). This subpath ships six pieces — `HlmTabs` (root), `HlmTabsList` (tab bar, with `default`/`line` variants), `HlmTabsTrigger` (individual tab), `HlmTabsContent` (panel), `HlmTabsContentLazy` (deferred panel), and `HlmTabsPaginatedList` (scrollable tab bar with chevron paginators) — all thin shadcn-styled directives/components over spartan-ng's `@spartan-ng/brain/tabs` primitives (`BrnTabs`, `BrnTabsList`, `BrnTabsTrigger`, `BrnTabsContent`, `BrnTabsPaginatedList`).

> **Ships as:** `@egose/shadcn-theme-ng/tabs` and `@egose/shadcn-theme-ng-tw/tabs` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@spartan-ng/brain` arrives transitively. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/tabs/src/public-api.ts`:

```ts
import {
  HlmTabs,
  HlmTabsContent,
  HlmTabsContentLazy,
  HlmTabsImports,
  HlmTabsList,
  HlmTabsModule,
  HlmTabsPaginatedList,
  HlmTabsTrigger,
} from '@egose/shadcn-theme-ng/tabs';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/tabs'
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmTabsImports],
  template: `<!-- tabs markup here -->`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmTabsModule } from '@egose/shadcn-theme-ng/tabs';

@NgModule({ imports: [HlmTabsModule] })
export class FeatureModule {}
```

| Symbol                 | Kind          | Description                                                         |
| ---------------------- | ------------- | ------------------------------------------------------------------- |
| `HlmTabs`              | Directive     | Root: `[hlmTabs], hlm-tabs` — wires `BrnTabs`.                      |
| `HlmTabsList`          | Directive     | Tab bar: `[hlmTabsList], hlm-tabs-list` — `default`/`line` variant. |
| `HlmTabsTrigger`       | Directive     | Tab button: `[hlmTabsTrigger]` — value key via `hlmTabsTrigger`.    |
| `HlmTabsContent`       | Directive     | Panel: `[hlmTabsContent]` — value key via `hlmTabsContent`.         |
| `HlmTabsContentLazy`   | Directive     | Deferred panel: `ng-template[hlmTabsContentLazy]`.                  |
| `HlmTabsPaginatedList` | Component     | Scrollable bar: `<hlm-paginated-tabs-list>` with chevron buttons.   |
| `HlmTabsImports`       | `const` array | All six, spread into `imports: [...]`.                              |
| `HlmTabsModule`        | NgModule      | Imports + re-exports all six.                                       |

## Anatomy / Structure

```html
<div hlmTabs tab="account">
  <div hlmTabsList>
    <button hlmTabsTrigger="account">Account</button>
    <button hlmTabsTrigger="password">Password</button>
  </div>

  <div hlmTabsContent="account">
    <p>Account settings…</p>
  </div>
  <div hlmTabsContent="password">
    <p>Change your password…</p>
  </div>
</div>
```

Paginated (many tabs, horizontal scroll + chevrons):

```html
<div hlmTabs tab="tab1">
  <hlm-paginated-tabs-list>
    <button hlmTabsTrigger="tab1">Tab 1</button>
    <button hlmTabsTrigger="tab2">Tab 2</button>
    <!-- …many more… -->
  </hlm-paginated-tabs-list>

  <div hlmTabsContent="tab1">Panel 1</div>
  <div hlmTabsContent="tab2">Panel 2</div>
</div>
```

Lazy panel (content instantiated only when the tab is first activated):

```html
<div hlmTabs tab="reports">
  <div hlmTabsList>
    <button hlmTabsTrigger="reports">Reports</button>
  </div>
  <ng-template hlmTabsContentLazy>
    <div hlmTabsContent="reports">Heavy report grid…</div>
  </ng-template>
</div>
```

> Trigger keys (`hlmTabsTrigger="…"`) must match panel keys (`hlmTabsContent="…"`), and one of them must equal the root `tab` input for an initially active tab.

## API reference

### `HlmTabs` — selector `[hlmTabs], hlm-tabs` (directive, hosts `BrnTabs`)

| Input            | Type                                    | Default | Description                                                        |
| ---------------- | --------------------------------------- | ------- | ------------------------------------------------------------------ |
| `tab`            | `string` (required)                     | —       | Key of the initially active tab. Must match a trigger/content key. |
| `orientation`    | forwarded to `BrnTabs`                  | —       | `'horizontal' \| 'vertical'`.                                      |
| `activationMode` | forwarded to `BrnTabs`                  | —       | `'automatic' \| 'manual'`.                                         |
| `brnTabs`        | forwarded to `BrnTabs` (`brnTabs: tab`) | —       | Low-level Brn binding for the active tab. Prefer `tab`.            |

| Output         | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `tabActivated` | Forwarded from `BrnTabs`. Emits when the active tab changes. |

Host: `data-slot="tabs"`, layout `flex gap-2` (column in horizontal orientation).

### `HlmTabsList` — selector `[hlmTabsList], hlm-tabs-list` (directive, hosts `BrnTabsList`)

| Input     | Type                  | Default     | Description                                                                   |
| --------- | --------------------- | ----------- | ----------------------------------------------------------------------------- |
| `variant` | `'default' \| 'line'` | `'default'` | `default`: muted pill bar. `line`: transparent bar with underline indicators. |

Also exports `listVariants` (cva) for reuse. Host sets `data-slot="tabs-list"` + `data-variant`.

### `HlmTabsTrigger` — selector `[hlmTabsTrigger]` (directive, hosts `BrnTabsTrigger`)

| Input            | Type                                         | Default | Description                                 |
| ---------------- | -------------------------------------------- | ------- | ------------------------------------------- |
| `hlmTabsTrigger` | `string` (required, aliased as `triggerFor`) | —       | Tab key. Must match a `hlmTabsContent` key. |
| `disabled`       | forwarded to `BrnTabsTrigger`                | —       | Disables this tab.                          |

Host: `data-slot="tabs-trigger"`. Only use on `<button>` elements.

### `HlmTabsContent` — selector `[hlmTabsContent]` (directive, hosts `BrnTabsContent`)

| Input            | Type                                         | Default | Description                          |
| ---------------- | -------------------------------------------- | ------- | ------------------------------------ |
| `hlmTabsContent` | `string` (required, aliased as `contentFor`) | —       | Panel key. Must match a trigger key. |

Host: `data-slot="tabs-content"`, `flex-1 text-sm`.

### `HlmTabsContentLazy` — selector `ng-template[hlmTabsContentLazy]` (directive, hosts `BrnTabsContentLazy`)

No inputs/outputs. Wrap a `hlmTabsContent` panel in `<ng-template hlmTabsContentLazy>` to defer instantiation until first activation.

### `HlmTabsPaginatedList` — selector `hlm-paginated-tabs-list` (component, extends `BrnTabsPaginatedList`)

Scrollable tab bar with previous/next chevron paginators (uses `buttonVariants({ variant: 'ghost', size: 'icon-sm' })` internally).

| Input                   | Type         | Default | Description                                                                   |
| ----------------------- | ------------ | ------- | ----------------------------------------------------------------------------- |
| `tabListClass`          | `ClassValue` | `''`    | Extra classes merged onto the inner tab-list element (over `listVariants()`). |
| `paginationButtonClass` | `ClassValue` | `''`    | Extra classes merged onto the chevron paginator buttons.                      |

Content children: `BrnTabsTrigger` items are queried (`contentChildren`) to drive pagination. All other `BrnTabsPaginatedList` behavior (scroll, keyboard) is inherited.

## Examples

### 1. Basic tabs

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmTabsImports],
  template: `
    <div hlmTabs tab="account">
      <div hlmTabsList>
        <button hlmTabsTrigger="account">Account</button>
        <button hlmTabsTrigger="password">Password</button>
      </div>
      <div hlmTabsContent="account">
        <p class="text-sm">Make changes to your account here.</p>
      </div>
      <div hlmTabsContent="password">
        <p class="text-sm">Change your password here.</p>
      </div>
    </div>
  `,
})
export class DemoBasic {}
```

### 2. `line` variant + vertical orientation

```ts
// demo-variants.component.ts
import { Component } from '@angular/core';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'demo-variants',
  standalone: true,
  imports: [...HlmTabsImports],
  template: `
    <div hlmTabs tab="overview" orientation="vertical" class="min-h-48">
      <div hlmTabsList variant="line">
        <button hlmTabsTrigger="overview">Overview</button>
        <button hlmTabsTrigger="analytics">Analytics</button>
        <button hlmTabsTrigger="reports" disabled>Reports (soon)</button>
      </div>
      <div hlmTabsContent="overview">Overview panel.</div>
      <div hlmTabsContent="analytics">Analytics panel.</div>
      <div hlmTabsContent="reports">Reports panel.</div>
    </div>
  `,
})
export class DemoVariants {}
```

### 3. Programmatic control + `tabActivated`

Drive the active tab from a signal and react to user changes:

```ts
// demo-controlled.component.ts
import { Component, signal } from '@angular/core';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-controlled',
  standalone: true,
  imports: [...HlmTabsImports, ...HlmButtonImports],
  template: `
    <div hlmTabs [tab]="active()" (tabActivated)="active.set($event)">
      <div hlmTabsList>
        <button hlmTabsTrigger="one">One</button>
        <button hlmTabsTrigger="two">Two</button>
        <button hlmTabsTrigger="three">Three</button>
      </div>
      <div hlmTabsContent="one">Panel one.</div>
      <div hlmTabsContent="two">Panel two.</div>
      <div hlmTabsContent="three">Panel three.</div>
    </div>
    <div class="mt-2 flex gap-2">
      <button hlmBtn size="sm" (click)="active.set('two')">Go to Two</button>
      <button hlmBtn size="sm" variant="outline" (click)="active.set('three')">Go to Three</button>
    </div>
  `,
})
export class DemoControlled {
  readonly active = signal('one');
}
```

### 4. Forms inside tab panels

Each panel is a plain container — put full forms inside:

```ts
// demo-forms.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'demo-forms',
  standalone: true,
  imports: [...HlmTabsImports, ReactiveFormsModule, HlmInput, HlmLabel],
  template: `
    <div hlmTabs tab="profile">
      <div hlmTabsList>
        <button hlmTabsTrigger="profile">Profile</button>
        <button hlmTabsTrigger="security">Security</button>
      </div>
      <form [formGroup]="form">
        <div hlmTabsContent="profile" class="space-y-2">
          <label hlmLabel for="name">Name</label>
          <input hlmInput id="name" formControlName="name" />
        </div>
        <div hlmTabsContent="security" class="space-y-2">
          <label hlmLabel for="pw">New password</label>
          <input hlmInput id="pw" type="password" formControlName="password" />
        </div>
      </form>
    </div>
  `,
})
export class DemoForms {
  readonly form = new FormGroup({ name: new FormControl('Ada'), password: new FormControl('') });
}
```

### 5. Paginated tab bar (many tabs)

```ts
// demo-paginated.component.ts
import { Component } from '@angular/core';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';

@Component({
  selector: 'demo-paginated',
  standalone: true,
  imports: [...HlmTabsImports],
  template: `
    <div hlmTabs tab="tab1">
      <hlm-paginated-tabs-list tabListClass="max-w-xl">
        @for (t of tabs; track t) {
          <button [hlmTabsTrigger]="t">{{ t }}</button>
        }
      </hlm-paginated-tabs-list>
      @for (t of tabs; track t) {
        <div [hlmTabsContent]="t">Content for {{ t }}</div>
      }
    </div>
  `,
})
export class DemoPaginated {
  readonly tabs = Array.from({ length: 20 }, (_, i) => `tab${i + 1}`);
}
```

Paginator buttons hide automatically when everything fits (`showPaginationControls()`), and accept `paginationButtonClass` overrides.

### 6. Lazy + async panel content

```ts
// demo-lazy.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HlmTabsImports } from '@egose/shadcn-theme-ng/tabs';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'demo-lazy',
  standalone: true,
  imports: [...HlmTabsImports, ...HlmSpinnerImports],
  template: `
    <div hlmTabs tab="summary">
      <div hlmTabsList>
        <button hlmTabsTrigger="summary">Summary</button>
        <button hlmTabsTrigger="reports">Reports</button>
      </div>
      <div hlmTabsContent="summary">Instant summary.</div>
      <ng-template hlmTabsContentLazy>
        <div hlmTabsContent="reports">
          @if (loading()) {
            <hlm-spinner size="1.25rem" />
          } @else {
            <p class="text-sm">{{ report() }}</p>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class DemoLazy {
  private readonly http = inject(HttpClient);
  readonly loading = signal(true);
  readonly report = signal<string | null>(null);

  constructor() {
    this.http.get('/api/report', { responseType: 'text' }).subscribe({
      next: (v) => {
        this.report.set(v);
        this.loading.set(false);
      },
      error: () => {
        this.report.set('Failed to load.');
        this.loading.set(false);
      },
    });
  }
}
```

## Accessibility notes

- Triggers are real `<button>` elements wired to `role="tab"` semantics by `BrnTabsTrigger`; panels get `role="tabpanel"`. Keep that mapping 1:1 (matching keys).
- Keyboard: Arrow keys move between tabs (orientation-aware), Home/End jump to first/last. With `activationMode="manual"`, arrows move focus but Enter/Space activates — use it when panels are expensive.
- Disabled triggers (`disabled`) are skipped in keyboard navigation — use sparingly and explain why a tab is unavailable.
- Do not remove panels from the DOM conditionally with `@if` in ways that orphan the active tab; prefer the lazy directive or keep all panels mounted.
- Label the list when its purpose is ambiguous (`aria-label` on the `hlmTabsList` element).

## Theming / CSS variables

The list bar follows `listVariants({ variant })` (`bg-muted` pill vs. transparent `line`), while triggers/panels use foreground/muted tokens with `data-active` selectors. Follows your shadcn theme automatically. Extend via `class` (merged through `classes()`) or `tabListClass`/`paginationButtonClass` on the paginated list.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — `buttonVariants` powers the paginator chevrons.
- `@egose/shadcn-theme-ng/card` — panels containing card-styled settings forms.
- `@egose/shadcn-theme-ng/input` / `@egose/shadcn-theme-ng/label` — form controls inside panels.
- `@egose/shadcn-theme-ng/spinner` — loading state for lazy/async panels.
