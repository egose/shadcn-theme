# Table (`@egose/shadcn-theme-ng/table`)

A data table, equivalent to [shadcn/ui Table](https://ui.shadcn.com/docs/components/table). This subpath ships nine **thin styling directives** — no behavior, no spartan-ng primitive, no inputs/outputs. Apply them to native `<div>`/`<table>`/`<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>`/`<caption>` elements to get shadcn table styling (hover rows, muted header/footer, compact cells) while keeping fully semantic markup you control.

> **Ships as:** `@egose/shadcn-theme-ng/table` and `@egose/shadcn-theme-ng-tw/table` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

No extra runtime dependencies. See the [package README](../../README.md) for the peer-dependency table.

## Imports

All public symbols are re-exported from `projects/table/src/public-api.ts`:

```ts
import {
  HlmCaption,
  HlmTable,
  HlmTableContainer,
  HlmTBody,
  HlmTableImports,
  HlmTableModule,
  HlmTd,
  HlmTFoot,
  HlmTh,
  HlmTHead,
  HlmTr,
} from '@egose/shadcn-theme-ng/table';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/table'
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmTableImports } from '@egose/shadcn-theme-ng/table';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmTableImports],
  template: `<!-- table markup here -->`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmTableModule } from '@egose/shadcn-theme-ng/table';

@NgModule({ imports: [HlmTableModule] })
export class FeatureModule {}
```

| Symbol              | Kind          | Host selector (real)                                                                    |
| ------------------- | ------------- | --------------------------------------------------------------------------------------- |
| `HlmTableContainer` | Directive     | `div[hlmTableContainer]`                                                                |
| `HlmTable`          | Directive     | `table[hlmTable]`                                                                       |
| `HlmTHead`          | Directive     | `thead[hlmTHead], thead[hlmTableHeader]`                                                |
| `HlmTBody`          | Directive     | `tbody[hlmTBody], tbody[hlmTableBody]`                                                  |
| `HlmTFoot`          | Directive     | `tfoot[hlmTFoot], tfoot[hlmTableFooter]`                                                |
| `HlmTr`             | Directive     | `tr[hlmTr], tr[hlmTableRow]`                                                            |
| `HlmTh`             | Directive     | `th[hlmTh], th[hlmTableHead]`                                                           |
| `HlmTd`             | Directive     | `td[hlmTd], td[hlmTableCell]`                                                           |
| `HlmCaption`        | Directive     | `caption[hlmCaption], caption[hlmTableCaption]`                                         |
| `HlmTableImports`   | `const` array | All nine directives, in caption/container/table/body/cell/footer/head/header/row order. |
| `HlmTableModule`    | NgModule      | Imports + re-exports all nine directives.                                               |

## Anatomy / Structure

```html
<div hlmTableContainer>
  <table hlmTable>
    <caption hlmCaption>
      A list of recent invoices.
    </caption>
    <thead hlmTHead>
      <tr hlmTr>
        <th hlmTh>Invoice</th>
        <th hlmTh>Status</th>
        <th hlmTh>Method</th>
        <th hlmTh class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody hlmTBody>
      <tr hlmTr>
        <td hlmTd>INV001</td>
        <td hlmTd>Paid</td>
        <td hlmTd>Card</td>
        <td hlmTd class="text-right">$250.00</td>
      </tr>
    </tbody>
    <tfoot hlmTFoot>
      <tr hlmTr>
        <td hlmTd colspan="3">Total</td>
        <td hlmTd class="text-right">$250.00</td>
      </tr>
    </tfoot>
  </table>
</div>
```

Each element also accepts the long alias (`hlmTableHeader`, `hlmTableBody`, `hlmTableFooter`, `hlmTableRow`, `hlmTableHead`, `hlmTableCell`, `hlmTableCaption`) — use whichever reads better; both selectors apply identical styles and `data-slot` attributes.

## API reference

There are **no inputs, outputs, or methods** on any table directive. Each directive only merges a fixed class list via `classes()` and sets a `data-slot` host attribute:

| Directive                                      | `data-slot`       | Fixed classes (abridged)                                                            |
| ---------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| `HlmTableContainer` (`div[hlmTableContainer]`) | `table-container` | `relative w-full overflow-x-auto`                                                   |
| `HlmTable` (`table[hlmTable]`)                 | `table`           | `w-full caption-bottom text-sm`                                                     |
| `HlmTHead`                                     | `table-header`    | `[&_tr]:border-b`                                                                   |
| `HlmTBody`                                     | `table-body`      | `[&_tr:last-child]:border-0`                                                        |
| `HlmTFoot`                                     | `table-footer`    | `bg-muted/50 border-t font-medium …`                                                |
| `HlmTr`                                        | `table-row`       | `hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors …`     |
| `HlmTh`                                        | `table-head`      | `text-foreground h-10 px-2 text-start align-middle font-medium whitespace-nowrap …` |
| `HlmTd`                                        | `table-cell`      | `p-2 align-middle whitespace-nowrap …`                                              |
| `HlmCaption`                                   | `table-caption`   | `text-muted-foreground mt-4 text-sm`                                                |

User `class` attributes on the same element are preserved and merged (the `classes()` helper keeps base classes).

## Examples

### 1. Basic invoice table

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmTableImports } from '@egose/shadcn-theme-ng/table';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmTableImports],
  template: `
    <div hlmTableContainer>
      <table hlmTable>
        <caption hlmCaption>
          A list of your recent invoices.
        </caption>
        <thead hlmTHead>
          <tr hlmTr>
            <th hlmTh>Invoice</th>
            <th hlmTh>Status</th>
            <th hlmTh>Method</th>
            <th hlmTh class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          <tr hlmTr>
            <td hlmTd class="font-medium">INV001</td>
            <td hlmTd>Paid</td>
            <td hlmTd>Credit Card</td>
            <td hlmTd class="text-right">$250.00</td>
          </tr>
          <tr hlmTr>
            <td hlmTd class="font-medium">INV002</td>
            <td hlmTd>Pending</td>
            <td hlmTd>PayPal</td>
            <td hlmTd class="text-right">$150.00</td>
          </tr>
        </tbody>
        <tfoot hlmTFoot>
          <tr hlmTr>
            <td hlmTd colspan="3">Total</td>
            <td hlmTd class="text-right">$400.00</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `,
})
export class DemoBasic {}
```

### 2. Async data with loading / empty states

```ts
// demo-async.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HlmTableImports } from '@egose/shadcn-theme-ng/table';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

interface Invoice {
  id: string;
  status: string;
  method: string;
  amount: number;
}

@Component({
  selector: 'demo-async',
  standalone: true,
  imports: [...HlmTableImports, ...HlmSpinnerImports],
  template: `
    <div hlmTableContainer>
      <table hlmTable>
        <caption hlmCaption>
          {{
            caption()
          }}
        </caption>
        <thead hlmTHead>
          <tr hlmTr>
            <th hlmTh>Invoice</th>
            <th hlmTh>Status</th>
            <th hlmTh>Method</th>
            <th hlmTh class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          @if (loading()) {
            <tr hlmTr>
              <td hlmTd colspan="4"><hlm-spinner size="1.25rem" /></td>
            </tr>
          } @else if (invoices().length === 0) {
            <tr hlmTr>
              <td hlmTd colspan="4" class="text-center">No invoices found.</td>
            </tr>
          } @else {
            @for (inv of invoices(); track inv.id) {
              <tr hlmTr>
                <td hlmTd class="font-medium">{{ inv.id }}</td>
                <td hlmTd>{{ inv.status }}</td>
                <td hlmTd>{{ inv.method }}</td>
                <td hlmTd class="text-right">{{ inv.amount }}</td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DemoAsync {
  private readonly http = inject(HttpClient);
  readonly invoices = signal<Invoice[]>([]);
  readonly loading = signal(true);
  readonly caption = signal('Loading…');

  constructor() {
    this.http.get<Invoice[]>('/api/invoices').subscribe({
      next: (rows) => {
        this.invoices.set(rows);
        this.loading.set(false);
        this.caption.set(`${rows.length} invoices.`);
      },
      error: () => {
        this.loading.set(false);
        this.caption.set('Could not load invoices.');
      },
    });
  }
}
```

### 3. Row selection with checkboxes

`HlmTh`/`HlmTd` automatically remove padding when they contain `[role=checkbox]` (`[&:has([role=checkbox])]:pe-0`).

```ts
// demo-select.component.ts
import { Component, signal } from '@angular/core';
import { HlmTableImports } from '@egose/shadcn-theme-ng/table';
import { HlmCheckboxImports } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'demo-select',
  standalone: true,
  imports: [...HlmTableImports, ...HlmCheckboxImports],
  template: `
    <div hlmTableContainer>
      <table hlmTable>
        <thead hlmTHead>
          <tr hlmTr>
            <th hlmTh><hlm-checkbox [checked]="all()" (changed)="toggleAll($event)" aria-label="Select all" /></th>
            <th hlmTh>Name</th>
            <th hlmTh class="text-right">Role</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          @for (u of users(); track u.id) {
            <tr hlmTr [attr.data-state]="u.selected ? 'selected' : null">
              <td hlmTd><hlm-checkbox [(checked)]="u.selected" [aria-label]="'Select ' + u.name" /></td>
              <td hlmTd>{{ u.name }}</td>
              <td hlmTd class="text-right">{{ u.role }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DemoSelect {
  readonly users = signal([
    { id: 1, name: 'Ada', role: 'Admin', selected: false },
    { id: 2, name: 'Grace', role: 'Editor', selected: true },
  ]);
  readonly all = signal(false);

  toggleAll(v: boolean) {
    this.users.update((rows) => rows.map((r) => ({ ...r, selected: v })));
    this.all.set(v);
  }
}
```

Selected rows pick up `data-[state=selected]:bg-muted` highlighting — set `[attr.data-state]="'selected'"` yourself, as above.

### 4. Long-alias selectors

Identical output — pick the alias style your team prefers:

```html
<div hlmTableContainer>
  <table hlmTable>
    <caption hlmTableCaption>
      Aliases work everywhere.
    </caption>
    <thead hlmTableHeader>
      <tr hlmTableRow>
        <th hlmTableHead>A</th>
        <th hlmTableHead>B</th>
      </tr>
    </thead>
    <tbody hlmTableBody>
      <tr hlmTableRow>
        <td hlmTableCell>1</td>
        <td hlmTableCell>2</td>
      </tr>
    </tbody>
    <tfoot hlmTableFooter>
      <tr hlmTableRow>
        <td hlmTableCell>Total</td>
        <td hlmTableCell>3</td>
      </tr>
    </tfoot>
  </table>
</div>
```

### 5. Status badges + right-aligned numeric columns

```ts
// demo-rich.component.ts
import { Component } from '@angular/core';
import { HlmTableImports } from '@egose/shadcn-theme-ng/table';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'demo-rich',
  standalone: true,
  imports: [...HlmTableImports, HlmBadge],
  template: `
    <div hlmTableContainer>
      <table hlmTable>
        <thead hlmTHead>
          <tr hlmTr>
            <th hlmTh>Order</th>
            <th hlmTh>Status</th>
            <th hlmTh class="text-right">Total</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          <tr hlmTr>
            <td hlmTd class="font-medium">#1001</td>
            <td hlmTd><span hlmBadge>Paid</span></td>
            <td hlmTd class="text-right tabular-nums">$1,250.00</td>
          </tr>
          <tr hlmTr>
            <td hlmTd class="font-medium">#1002</td>
            <td hlmTd><span hlmBadge variant="secondary">Pending</span></td>
            <td hlmTd class="text-right tabular-nums">$320.00</td>
          </tr>
          <tr hlmTr>
            <td hlmTd class="font-medium">#1003</td>
            <td hlmTd><span hlmBadge variant="destructive">Refunded</span></td>
            <td hlmTd class="text-right tabular-nums">$99.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class DemoRich {}
```

### 6. Overflow container for wide tables

`HlmTableContainer` adds `overflow-x-auto` — wide tables scroll horizontally on small screens instead of breaking layout:

```html
<div hlmTableContainer class="max-w-3xl rounded-md border">
  <table hlmTable>
    <!-- many columns… -->
  </table>
</div>
```

## Accessibility notes

- Keep semantic structure: exactly one `<thead>` with `<th>` header cells, body rows in `<tbody>`, summaries in `<tfoot>`, and a `<caption>` (or `aria-label`) describing the table.
- Use `scope="col"` / `scope="row"` on `<th>` elements when the table has row headers.
- Right-align numeric columns but keep DOM order logical — screen readers read row by row.
- For selectable rows, expose selection via `aria-selected` or the checkbox's accessible name; the `data-state="selected"` highlight is visual only.
- Avoid nested interactive chaos: if a row is clickable _and_ contains buttons/links, make the row action a real button in a cell rather than a `(click)` on `<tr>`.

## Theming / CSS variables

All styling keys off shadcn tokens (`text-foreground`, `text-muted-foreground`, `bg-muted/50`, `border-*`). The table inherits your theme automatically; add borders, rounding, or width constraints via `class` on the container (merged, not clobbered).

## Related subpaths

- `@egose/shadcn-theme-ng/badge` — status pills inside cells.
- `@egose/shadcn-theme-ng/checkbox` — row-selection checkboxes.
- `@egose/shadcn-theme-ng/spinner` / `@egose/shadcn-theme-ng/skeleton` — loading states for async tables.
- `@egose/shadcn-theme-ng/pagination` — paging controls below large tables.
