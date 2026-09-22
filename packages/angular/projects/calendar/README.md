# Calendar (`@egose/shadcn-theme-ng/calendar`)

A shadcn/ui-style calendar month grid for single-date, multi-date, range, and month/year picking — the Angular port of shadcn/ui `Calendar`. Four standalone components share one visual language (ghost icon day cells, `--cell-size`/`--cell-radius` tokens, optional month/year dropdown caption): `hlm-calendar` (single date), `hlm-calendar-multi` (multi-select), `hlm-calendar-range` (start/end range), and `hlm-month-year-calendar` (year→month stepping). Behavior comes from `@spartan-ng/brain/calendar` host directives (`BrnCalendar`, `BrnCalendarMulti`, `BrnCalendarRange`, `BrnMonthYearCalendar`) plus `@spartan-ng/brain/date-time` adapters and i18n; the header dropdowns are composed from this repo's own `hlm-select` subpath.

Ships as `@egose/shadcn-theme-ng/calendar` and `@egose/shadcn-theme-ng-tw/calendar` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common` and `@angular/core` as peers (see `projects/calendar/package.json`); at runtime it also imports `@egose/shadcn-theme-ng/button` and `@egose/shadcn-theme-ng/select`, so install the whole package, not the directory.

## Imports

```ts
import {
  HlmCalendar,
  HlmCalendarMulti,
  HlmCalendarRange,
  HlmMonthYearCalendar,
  HlmCalendarImports,
  HlmCalendarModule,
} from '@egose/shadcn-theme-ng/calendar';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/calendar';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmCalendarImports],
  template: `<hlm-calendar />`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmCalendarModule } from '@egose/shadcn-theme-ng/calendar';

@NgModule({ imports: [HlmCalendarModule] })
export class DemoModule {}
```

> Requires a date adapter provider from `@spartan-ng/brain/date-time` (e.g. native-JS-date adapter) and, for localized names, the calendar i18n provider — see the examples below.

## Anatomy / Structure

```html
<!-- Single date -->
<hlm-calendar
  captionLayout="dropdown"
  [date]="selected"
  [min]="minDate"
  [max]="maxDate"
  [disabled]="isDisabled"
  [weekStartsOn]="1"
  (dateChange)="selected = $event"
/>

<!-- Multi date -->
<hlm-calendar-multi [date]="[d1, d2]" [minSelection]="1" [maxSelection]="5" (dateChange)="dates = $event" />

<!-- Range -->
<hlm-calendar-range
  [startDate]="start"
  [endDate]="end"
  (startDateChange)="start = $event"
  (endDateChange)="end = $event"
/>

<!-- Month/year stepper -->
<hlm-month-year-calendar [date]="picked" view="month" (dateChange)="picked = $event" />
```

Real selectors: `hlm-calendar`, `hlm-calendar-multi`, `hlm-calendar-range`, `hlm-month-year-calendar` (element selectors only). Internally each template composes `brnCalendarPreviousButton` / `brnCalendarNextButton` / `brnCalendarHeader` / `brnCalendarGrid` / `brnCalendarCellButton` structural directives and `brnCalendarMonthSelect` / `brnCalendarYearSelect` selects; you do not write those yourself.

## API reference

All date types are generic `<T>` (whatever your date adapter uses — usually native `Date`).

### `HlmCalendar` (`hlm-calendar`)

| Input (own)     | Type                                                             | Default   | Description                                                    |
| --------------- | ---------------------------------------------------------------- | --------- | -------------------------------------------------------------- |
| `captionLayout` | `'dropdown' \| 'label' \| 'dropdown-months' \| 'dropdown-years'` | `'label'` | Header mode: plain label vs month/year `hlm-select` dropdowns. |

| Brain input (via `BrnCalendar`) | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| `min`                           | Minimum selectable date.                                      |
| `max`                           | Maximum selectable date.                                      |
| `disabled`                      | Disables the whole calendar.                                  |
| `date`                          | Currently selected date.                                      |
| `dateDisabled`                  | Predicate `(date: T) => boolean` disabling individual days.   |
| `weekStartsOn`                  | First weekday (`0` = Sunday … `6` = Saturday).                |
| `highlightDays`                 | Dates/dots predicate for the `data-[highlighted]` dot marker. |
| `defaultFocusedDate`            | Initially focused date when `date` is unset.                  |

| Output       | Payload                                   | Description                             |
| ------------ | ----------------------------------------- | --------------------------------------- |
| `dateChange` | `T \| null/undefined` (adapter-dependent) | Emitted on day click / keyboard select. |

### `HlmCalendarMulti` (`hlm-calendar-multi`)

Own `captionLayout` input identical to above. Brain inputs via `BrnCalendarMulti`: `min`, `max`, `minSelection`, `maxSelection`, `disabled`, `date` (array), `dateDisabled`, `weekStartsOn`, `highlightDays`, `defaultFocusedDate`. Output: `dateChange` (selected-dates array).

### `HlmCalendarRange` (`hlm-calendar-range`)

Own `captionLayout` input identical to above. Brain inputs via `BrnCalendarRange`: `min`, `max`, `disabled`, `startDate`, `endDate`, `dateDisabled`, `weekStartsOn`, `highlightDays`, `defaultFocusedDate`. Outputs: `startDateChange`, `endDateChange`.

### `HlmMonthYearCalendar` (`hlm-month-year-calendar`)

No `captionLayout`. Brain inputs via `BrnMonthYearCalendar`: `min`, `max`, `disabled`, `date`, `defaultFocusedDate`, `view` (`'month' | 'year'`). Output: `dateChange`. The header button (`brnMonthYearCalendarHeader`) toggles year↔month views; the grid renders `brnMonthYearCalendarYearButton` / `brnMonthYearCalendarMonthButton` cells.

## Examples

### 1. Basic single-date calendar (two-way style)

```ts
import { Component, signal } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-basic-calendar',
  standalone: true,
  imports: [...HlmCalendarImports],
  providers: [provideNativeDateAdapter()],
  template: `
    <hlm-calendar [date]="date()" (dateChange)="date.set($event)" />
    <p class="mt-2 text-sm">Picked: {{ date()?.toDateString() ?? 'none' }}</p>
  `,
})
export class BasicCalendarComponent {
  readonly date = signal<Date | undefined>(new Date());
}
```

### 2. Caption variants (dropdown navigation)

All three single/multi/range calendars accept `captionLayout`.

```ts
import { Component, signal } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-caption-layouts',
  standalone: true,
  imports: [...HlmCalendarImports],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="flex flex-wrap gap-6">
      <div>
        <h3 class="mb-2 text-sm font-medium">dropdown</h3>
        <hlm-calendar captionLayout="dropdown" [date]="a()" (dateChange)="a.set($event)" />
      </div>
      <div>
        <h3 class="mb-2 text-sm font-medium">dropdown-months</h3>
        <hlm-calendar captionLayout="dropdown-months" [date]="b()" (dateChange)="b.set($event)" />
      </div>
      <div>
        <h3 class="mb-2 text-sm font-medium">dropdown-years</h3>
        <hlm-calendar captionLayout="dropdown-years" [date]="c()" (dateChange)="c.set($event)" />
      </div>
      <div>
        <h3 class="mb-2 text-sm font-medium">label (default)</h3>
        <hlm-calendar captionLayout="label" [date]="d()" (dateChange)="d.set($event)" />
      </div>
    </div>
  `,
})
export class CaptionLayoutsComponent {
  readonly a = signal<Date | undefined>(new Date());
  readonly b = signal<Date | undefined>(new Date());
  readonly c = signal<Date | undefined>(new Date());
  readonly d = signal<Date | undefined>(new Date());
}
```

### 3. Min/max, disabled dates, week start, highlight dots

```ts
import { Component, signal } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-constrained-calendar',
  standalone: true,
  imports: [...HlmCalendarImports],
  providers: [provideNativeDateAdapter()],
  template: `
    <hlm-calendar
      [date]="date()"
      [min]="min"
      [max]="max"
      [dateDisabled]="isWeekend"
      [weekStartsOn]="1"
      [highlightDays]="isPayday"
      (dateChange)="date.set($event)"
    />
  `,
})
export class ConstrainedCalendarComponent {
  readonly date = signal<Date | undefined>(new Date());
  readonly min = new Date(2026, 0, 1);
  readonly max = new Date(2026, 11, 31);

  // Disable weekends:
  readonly isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  // Red dot under the 15th of any month:
  readonly isPayday = (d: Date) => d.getDate() === 15;
}
```

### 4. Multi-date selection with selection limits

```ts
import { Component, signal } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-multi-calendar',
  standalone: true,
  imports: [...HlmCalendarImports],
  providers: [provideNativeDateAdapter()],
  template: `
    <hlm-calendar-multi
      captionLayout="dropdown"
      [date]="dates()"
      [minSelection]="1"
      [maxSelection]="3"
      (dateChange)="dates.set($event ?? [])"
    />
    <p class="mt-2 text-sm">{{ dates().length }} / 3 selected</p>
    <ul class="text-sm">
      @for (d of dates(); track d.getTime()) {
        <li>{{ d.toDateString() }}</li>
      }
    </ul>
  `,
})
export class MultiCalendarComponent {
  readonly dates = signal<Date[]>([new Date()]);
}
```

### 5. Date range with reactive-form-friendly signals

```ts
import { Component, computed, signal } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-range-calendar',
  standalone: true,
  imports: [...HlmCalendarImports],
  providers: [provideNativeDateAdapter()],
  template: `
    <hlm-calendar-range
      [startDate]="start()"
      [endDate]="end()"
      [disabled]="locked()"
      (startDateChange)="start.set($event)"
      (endDateChange)="end.set($event)"
    />
    <p class="mt-2 text-sm">{{ summary() }}</p>
    <button type="button" (click)="locked.set(!locked())">
      {{ locked() ? 'Unlock' : 'Lock' }}
    </button>
    <button type="button" (click)="clear()">Clear</button>
  `,
})
export class RangeCalendarComponent {
  readonly start = signal<Date | undefined>(new Date(2026, 8, 1));
  readonly end = signal<Date | undefined>(new Date(2026, 8, 7));
  readonly locked = signal(false);
  readonly summary = computed(() =>
    this.start() && this.end()
      ? `${this.start()!.toDateString()} → ${this.end()!.toDateString()}`
      : 'Pick a start and end date',
  );
  clear() {
    this.start.set(undefined);
    this.end.set(undefined);
  }
}
```

### 6. Month/year picker + composition inside card/popover

`hlm-month-year-calendar` steps through year grids then month grids — ideal for expiry / birth-month fields. Calendars are transparent inside `card-content` / `popover-content` slots by design (`in-data-[slot=...]:bg-transparent`).

```ts
import { Component, signal } from '@angular/core';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-card-calendar',
  standalone: true,
  imports: [...HlmCalendarImports, ...HlmCardImports],
  providers: [provideNativeDateAdapter()],
  template: `
    <div hlmCard class="w-80">
      <div hlmCardHeader>
        <h3 hlmCardTitle>Expiry month</h3>
        <p hlmCardDescription>Month/year only — no day grid.</p>
      </div>
      <div hlmCardContent>
        <hlm-month-year-calendar view="year" [date]="picked()" (dateChange)="picked.set($event)" />
        <p class="mt-2 text-sm">Value: {{ picked()?.toDateString() ?? 'none' }}</p>
      </div>
    </div>
  `,
})
export class CardCalendarComponent {
  readonly picked = signal<Date | undefined>(undefined);
}
```

## Accessibility notes

- Day grids use a real `<table>` with `brnCalendarGrid`, weekday `<th scope="col">` headers (`aria-hidden` visual row plus `aria-label` weekday names), and `role="rowgroup"` body — screen readers announce weeks correctly.
- Prev/next month buttons expose chevron icons with ghost-button styling and `aria-disabled` states; keep them focusable and do not hide them with CSS.
- Keyboard: arrows move the focused day (brain directive), Enter/Space selects. The `data-[focused=true]` ring (`group-data-[focused=true]/day`) is the visible focus indicator — do not remove it.
- `hlm-carousel`-style `aria-roledescription` is not used here; the calendar relies on native table semantics plus dialog/popover labeling when composed — always label the surrounding popover/dialog title.

## Theming / CSS variables

- `--cell-size` (default `--spacing(8)`) and `--cell-radius` (default `var(--radius-md)`) control day-cell geometry; override per instance: `<hlm-calendar class="[--cell-size:--spacing(10)]">`.
- Selected/range/today/highlight states are `data-*` driven (`data-[selected-single]`, `data-[range-start/middle/end]`, `data-[today]`, `data-[highlighted]`, `data-[outside]`) using `bg-primary`, `bg-muted`, and `bg-destructive` dot tokens — they follow the app theme automatically.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — `hlmBtn` prev/next buttons and day-cell `buttonVariants`.
- `@egose/shadcn-theme-ng/select` — month/year dropdown caption selects.
- `@egose/shadcn-theme-ng/card` / `popover` — common calendar hosts (transparent-slot styling built in).
- `@egose/shadcn-theme-ng/date-picker` — input + popover composition that emits `Date` via `dateChange`.
