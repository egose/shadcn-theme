# Date Picker (`@egose/shadcn-theme-ng/date-picker`)

A shadcn/ui-style date picker for Angular: a popover-anchored calendar with a text-input or button trigger, single-date, multi-date, range, and month/year modes. Equivalent to shadcn/ui `Calendar` + `Popover` composed as a date picker.

The Angular implementation is a styling + composition layer over headless primitives: [`BrnDatePicker*` / `BrnDateInput` from `@spartan-ng/brain/date-picker`](https://www.spartan-ng.com/), `BrnPopover` from `@spartan-ng/brain/popover`, `BrnFieldControl` / `provideBrnLabelable` from `@spartan-ng/brain/field`, and the styled `HlmCalendar` / `HlmCalendarMulti` / `HlmCalendarRange` / `HlmMonthYearCalendar` from `@egose/shadcn-theme-ng/calendar` plus `HlmPopoverImports` and `HlmInputGroup` styling. All four picker roots are `ControlValueAccessor`s, so they bind directly to `formControlName` / `ngModel`.

> **Ships as:** `@egose/shadcn-theme-ng/date-picker` and `@egose/shadcn-theme-ng-tw/date-picker`
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
`@egose/shadcn-theme-ng/calendar`, `@egose/shadcn-theme-ng/popover`,
`@egose/shadcn-theme-ng/input-group`, `@egose/shadcn-theme-ng/button`, and `@ng-icons/lucide`.

## Imports

All symbols are exported from the subpath root (`projects/date-picker/src/public-api.ts`):

```ts
import {
  HlmDatePicker,
  HlmDatePickerMulti,
  HlmDateRangePicker,
  HlmMonthYearPicker,
  HlmDatePickerInput,
  HlmDateMultiInput,
  HlmDateRangeInput,
  HlmMonthYearInput,
  HlmDatePickerTrigger,
  HlmDatePickerAnchor,
  HlmDatePickerImports,
  HlmDatePickerModule,
  provideHlmDatePickerConfig,
  injectHlmDatePickerConfig,
  provideHlmDatePickerMultiConfig,
  injectHlmDatePickerMultiConfig,
  provideHlmDateRangePickerConfig,
  injectHlmDateRangePickerConfig,
  provideHlmMonthYearPickerConfig,
  injectHlmMonthYearPickerConfig,
} from '@egose/shadcn-theme-ng/date-picker';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/date-picker'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmDatePickerImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmDatePickerModule } from '@egose/shadcn-theme-ng/date-picker';

@NgModule({ imports: [HlmDatePickerModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<!-- single date: button trigger -->
<hlm-date-picker>
  <hlm-date-picker-trigger>Pick a date</hlm-date-picker-trigger>
</hlm-date-picker>

<!-- single date: text input trigger -->
<hlm-date-picker>
  <hlm-date-picker-input placeholder="Pick a date" />
</hlm-date-picker>

<!-- multi date -->
<hlm-date-picker-multi [maxSelection]="3">
  <hlm-date-multi-input placeholder="Pick dates" />
</hlm-date-picker-multi>

<!-- range -->
<hlm-date-range-picker>
  <hlm-date-range-input placeholder="Pick a range" />
</hlm-date-range-picker>

<!-- month/year -->
<hlm-month-year-picker>
  <hlm-month-year-input placeholder="MM/YYYY" />
</hlm-month-year-picker>

<!-- optional header/footer projection slots -->
<hlm-date-picker>
  <hlm-date-picker-input placeholder="Pick a date" />
  <div hlmDatePickerHeader>Custom header</div>
  <div hlmDatePickerFooter>Custom footer</div>
</hlm-date-picker>

<!-- external anchor -->
<input hlmDatePickerAnchor [hlmDatePickerAnchorFor]="popoverRef" />
```

Real selectors (from source):

| Class                  | Selector                  | Kind                                                |
| ---------------------- | ------------------------- | --------------------------------------------------- |
| `HlmDatePicker`        | `hlm-date-picker`         | Component (CVA)                                     |
| `HlmDatePickerMulti`   | `hlm-date-picker-multi`   | Component (CVA)                                     |
| `HlmDateRangePicker`   | `hlm-date-range-picker`   | Component (CVA)                                     |
| `HlmMonthYearPicker`   | `hlm-month-year-picker`   | Component (CVA)                                     |
| `HlmDatePickerInput`   | `hlm-date-picker-input`   | Component (trigger, extends `BrnDateInput<T>`)      |
| `HlmDateMultiInput`    | `hlm-date-multi-input`    | Component (trigger, extends `BrnDateInput<T[]>`)    |
| `HlmDateRangeInput`    | `hlm-date-range-input`    | Component (trigger, extends `BrnDateInput<[T, T]>`) |
| `HlmMonthYearInput`    | `hlm-month-year-input`    | Component (trigger, extends `BrnDateInput<T>`)      |
| `HlmDatePickerTrigger` | `hlm-date-picker-trigger` | Component (button trigger)                          |
| `HlmDatePickerAnchor`  | `[hlmDatePickerAnchor]`   | Directive                                           |

## API reference

### `HlmDatePicker` — `hlm-date-picker`

Single-date picker. Generic `<T>` (usually `Date`). Implements `BrnDatePickerBase<T>` + `ControlValueAccessor`, hosts `BrnFieldControl`.

| Input                | Type                                                             | Default                 | Description                                             |
| -------------------- | ---------------------------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| `captionLayout`      | `'dropdown' \| 'label' \| 'dropdown-months' \| 'dropdown-years'` | `'label'`               | Calendar caption navigation mode.                       |
| `min`                | `T`                                                              | —                       | Minimum selectable date.                                |
| `max`                | `T`                                                              | —                       | Maximum selectable date.                                |
| `disabled`           | `boolean`                                                        | `false`                 | Disables the picker.                                    |
| `wrapperDisabled`    | `boolean`                                                        | `false`                 | Interaction lock that does not write to a form control. |
| `date`               | `T`                                                              | —                       | Controlled selected value.                              |
| `defaultFocusedDate` | `T`                                                              | —                       | Month the calendar opens on when nothing is selected.   |
| `autoCloseOnSelect`  | `boolean`                                                        | config (`false`)        | Close the popover when a date is picked.                |
| `formatDate`         | `(date: T) => string`                                            | config (`toDateString`) | Display format for the trigger.                         |
| `transformDate`      | `(date: T) => T`                                                 | config (identity)       | Normalizes every value entering the model.              |

| Output       | Type        | Description                                 |
| ------------ | ----------- | ------------------------------------------- |
| `dateChange` | `T \| null` | Emitted on select / `updateDate` / `reset`. |

| Signal / method                                                        | Description                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| `formattedDate`                                                        | Formatted current date (readonly signal).                     |
| `hasDate`                                                              | Whether a date is selected.                                   |
| `value`                                                                | Raw current value (`T \| null`), used by inputs.              |
| `disabledState`                                                        | Combined disabled signal.                                     |
| `labelableId`                                                          | Trigger id for labelling.                                     |
| `popover`                                                              | Required `BrnPopover` view child.                             |
| `updateDate(value: T \| null)`                                         | Commit a date without closing the popover (typed-input path). |
| `open() / close() / reset()`                                           | Programmatic popover control + clear.                         |
| `touched()`                                                            | Marks as touched.                                             |
| `writeValue / registerOnChange / registerOnTouched / setDisabledState` | `ControlValueAccessor` contract.                              |

Content slots: default (trigger), `[hlmDatePickerHeader]`, `[hlmDatePickerFooter]`.

### `HlmDatePickerMulti` — `hlm-date-picker-multi`

Multi-date variant. Model is `T[]`.

| Input                           | Type                     | Default                      | Description                           |
| ------------------------------- | ------------------------ | ---------------------------- | ------------------------------------- |
| `captionLayout`                 | same as above            | `'label'`                    | Caption mode.                         |
| `min` / `max`                   | `T`                      | —                            | Date bounds.                          |
| `minSelection` / `maxSelection` | `number`                 | —                            | Selection-count bounds.               |
| `disabled`                      | `boolean`                | `false`                      | Disables the picker.                  |
| `date`                          | `T[]`                    | —                            | Controlled value.                     |
| `autoCloseOnMaxSelection`       | `boolean`                | config (`false`)             | Close when `maxSelection` is reached. |
| `formatDates`                   | `(dates: T[]) => string` | config (join `toDateString`) | Trigger display.                      |
| `transformDates`                | `(dates: T[]) => T[]`    | config (identity)            | Model normalization.                  |

| Output       | Type  |
| ------------ | ----- |
| `dateChange` | `T[]` |

Methods: `updateDate(value: T[] \| null)`, `open()`, `close()`, `reset()` (emits `[]`), plus CVA methods and `formattedDate` / `hasDate` / `value` / `disabledState` signals.

### `HlmDateRangePicker` — `hlm-date-range-picker`

Range variant. Model is `[T, T] | null`.

| Input                     | Type                                        | Default               | Description                        |
| ------------------------- | ------------------------------------------- | --------------------- | ---------------------------------- |
| `captionLayout`           | same                                        | `'label'`             | Caption mode.                      |
| `min` / `max`             | `T`                                         | —                     | Bounds.                            |
| `disabled`                | `boolean`                                   | `false`               | Disables.                          |
| `date`                    | `[T, T]`                                    | —                     | Controlled range.                  |
| `autoCloseOnEndSelection` | `boolean`                                   | config (`false`)      | Close once the end date is picked. |
| `formatDates`             | `(dates: [T \| null, T \| null]) => string` | config (join `' - '`) | Trigger display.                   |
| `transformDates`          | `(dates: [T, T]) => [T, T]`                 | config (identity)     | Normalization.                     |

| Output       | Type             |
| ------------ | ---------------- |
| `dateChange` | `[T, T] \| null` |

Methods: `updateDate(value: [T, T] \| null)` (pass `null` to clear), `open()`, `close()`, `reset()`, CVA methods.

### `HlmMonthYearPicker` — `hlm-month-year-picker`

Month/year variant (renders `hlm-month-year-calendar`). Same single-date API as `HlmDatePicker` except it has no `wrapperDisabled` input and defaults `formatDate` / `formatInputDate` to `MM/YYYY`:

| Input                          | Type      | Default                       |
| ------------------------------ | --------- | ----------------------------- |
| `min` / `max`                  | `T`       | —                             |
| `disabled`                     | `boolean` | `false`                       |
| `date` / `defaultFocusedDate`  | `T`       | —                             |
| `autoCloseOnSelect`            | `boolean` | config (`false`)              |
| `formatDate` / `transformDate` | functions | config (`MM/YYYY` / identity) |

Outputs/methods mirror `HlmDatePicker` (`dateChange: T | null`, `updateDate`, `open`, `close`, `reset`).

### Trigger inputs (`HlmDatePickerInput`)

`HlmDatePickerInput<T>`, `HlmDateMultiInput<T>`, `HlmDateRangeInput<T>`, `HlmMonthYearInput<T>` extend `BrnDateInput` (inheriting `placeholder`, `inputId`, disabled/invalid wiring, clear-button and calendar-button behavior) and add:

| Input                                  | Type                                                                            | Default                           | Notes                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `parseDate`                            | `(value: string) => T \| null` (or `T[] \| null` / `[T,T] \| null` per variant) | from matching `provideHlm*Config` | Return `null` for invalid text; picker clears while text is preserved. |
| `formatInputDate` / `formatInputDates` | `(date) => string`                                                              | from config                       | Edit format shown while focused.                                       |
| `ariaLabel` / `ariaDescribedby`        | `string`                                                                        | —                                 | Accessible labelling for the inner `<input>`.                          |
| `name`                                 | `string \| undefined`                                                           | —                                 | Native `name` forwarded to the inner `<input>`.                        |
| `readonly`                             | `boolean`                                                                       | `false`                           | Native `readonly` forwarded to the inner `<input>`.                    |
| `class`                                | `ClassValue`                                                                    | `''`                              | Extra classes on the host group container.                             |
| `inputClass`                           | `ClassValue`                                                                    | `''`                              | Extra classes on the inner `<input>` (e.g. text size).                 |

### `HlmDatePickerTrigger` — `hlm-date-picker-trigger`

Button trigger showing the formatted date or projected placeholder.

| Input          | Type                        | Default               | Description                                        |
| -------------- | --------------------------- | --------------------- | -------------------------------------------------- |
| `buttonId`     | `string`                    | `hlm-date-picker-<n>` | Button id; also used as `triggerId` for labelling. |
| `forceInvalid` | `boolean`                   | `false`               | Forces invalid styling.                            |
| `variant`      | `ButtonVariants['variant']` | `'outline'`           | `hlmBtn` variant.                                  |
| `showTrigger`  | `boolean`                   | `true`                | Show the chevron-down icon.                        |
| `class`        | `ClassValue`                | `''`                  | Extra classes.                                     |

### `HlmDatePickerAnchor` — `[hlmDatePickerAnchor]`

| Input                                                                      | Type                      | Description                                      |
| -------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------ |
| `hlmDatePickerAnchorFor` (alias; underlying `hlmDatePickerAnchorForInput`) | `BrnPopover \| undefined` | Popover whose origin is set to the host element. |

### Config tokens

| Symbol                                                                      | Description                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HlmDatePickerConfig<T>`                                                    | `{ autoCloseOnSelect, formatDate, formatInputDate, transformDate, parseDate }` plus optional global class defaults `{ labelClass?, pickerClass?, inputClass?, errorClass?, hintClass? }` (merged under per-instance `*Class` in `eg-form-date-picker`). Default parse: `new Date(value)`, `null` when invalid. |
| `provideHlmDatePickerConfig<T>(partial)` / `injectHlmDatePickerConfig<T>()` | Provide / read the single-date config.                                                                                                                                                                                                                                                                         |
| `HlmDatePickerMultiConfig<T>`                                               | `{ autoCloseOnMaxSelection, formatDates, formatInputDates, transformDates, parseDate }` plus the same optional class-default keys. Default multi parse: comma-separated `DD/MM/YYYY`.                                                                                                                          |
| `provideHlmDatePickerMultiConfig` / `injectHlmDatePickerMultiConfig`        | Multi config DI.                                                                                                                                                                                                                                                                                               |
| `HlmDateRangePickerConfig<T>`                                               | `{ autoCloseOnEndSelection, formatDates, formatInputDates, transformDates, parseDate }` plus the same optional class-default keys. Default range parse: `"a - b"` via `new Date(part)`.                                                                                                                        |
| `provideHlmDateRangePickerConfig` / `injectHlmDateRangePickerConfig`        | Range config DI.                                                                                                                                                                                                                                                                                               |
| `HlmMonthYearPickerConfig<T>`                                               | `{ autoCloseOnSelect, formatDate, formatInputDate, transformDate, parseDate }` plus the same optional class-default keys. Default parse: `MM/YYYY`.                                                                                                                                                            |
| `provideHlmMonthYearPickerConfig` / `injectHlmMonthYearPickerConfig`        | Month/year config DI.                                                                                                                                                                                                                                                                                          |

## Examples

### 1. Basic single date with text input

```ts
import { Component, signal } from '@angular/core';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [...HlmDatePickerImports],
  template: `
    <hlm-date-picker (dateChange)="date.set($event)">
      <hlm-date-picker-input placeholder="Pick a date" />
    </hlm-date-picker>
    <p>Selected: {{ date()?.toDateString() ?? 'none' }}</p>
  `,
})
export class BasicComponent {
  readonly date = signal<Date | null>(null);
}
```

### 2. Button trigger with min/max and dropdown caption

```ts
import { Component, signal } from '@angular/core';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-button-trigger',
  standalone: true,
  imports: [...HlmDatePickerImports],
  template: `
    <hlm-date-picker captionLayout="dropdown" [min]="min" [max]="max" autoCloseOnSelect (dateChange)="date.set($event)">
      <hlm-date-picker-trigger>Pick a date</hlm-date-picker-trigger>
    </hlm-date-picker>
  `,
})
export class ButtonTriggerComponent {
  readonly date = signal<Date | null>(null);
  readonly min = new Date(2025, 0, 1);
  readonly max = new Date(2026, 11, 31);
}
```

### 3. Reactive form binding + validation

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';
import { HlmFormFieldImports } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, ...HlmDatePickerImports, ...HlmFormFieldImports],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <hlm-form-field>
        <label hlmLabel for="dob">Date of birth</label>
        <hlm-date-picker formControlName="dob">
          <hlm-date-picker-input inputId="dob" placeholder="YYYY-MM-DD" />
        </hlm-date-picker>
        <hlm-error>Birth date is required.</hlm-error>
      </hlm-form-field>
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class ReactiveComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ dob: [null as Date | null, Validators.required] });
  save() {
    console.log(this.form.value.dob);
  }
}
```

### 4. Multi-date with max selection + custom formatting

```ts
import { Component, signal } from '@angular/core';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-multi',
  standalone: true,
  imports: [...HlmDatePickerImports],
  template: `
    <hlm-date-picker-multi
      [maxSelection]="3"
      autoCloseOnMaxSelection
      [formatDates]="format"
      (dateChange)="dates.set($event)"
    >
      <hlm-date-multi-input placeholder="Pick up to 3 dates (DD/MM/YYYY, …)" />
    </hlm-date-picker-multi>
    <p>{{ dates().length }} selected</p>
  `,
})
export class MultiComponent {
  readonly dates = signal<Date[]>([]);
  readonly format = (dates: Date[]) => dates.map((d) => d.toLocaleDateString()).join(' · ');
}
```

### 5. Range picker with programmatic control and footer

```ts
import { Component, signal, viewChild } from '@angular/core';
import { HlmDatePickerImports, HlmDateRangePicker } from '@egose/shadcn-theme-ng/date-picker';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-range',
  standalone: true,
  imports: [...HlmDatePickerImports, HlmButton],
  template: `
    <hlm-date-range-picker #range autoCloseOnEndSelection (dateChange)="onRange($event)">
      <hlm-date-range-input placeholder="Start - End" />
      <div hlmDatePickerFooter class="tw:flex tw:justify-end tw:gap-2 tw:p-2">
        <button hlmBtn variant="ghost" size="sm" type="button" (click)="range.reset()">Clear</button>
        <button hlmBtn variant="outline" size="sm" type="button" (click)="range.close()">Done</button>
      </div>
    </hlm-date-range-picker>
    <div class="tw:flex tw:gap-2">
      <button hlmBtn type="button" variant="outline" (click)="range.open()">Open</button>
    </div>
  `,
})
export class RangeComponent {
  readonly picker = viewChild.required(HlmDateRangePicker);
  onRange(value: [Date, Date] | null) {
    console.log('range', value);
  }
}
```

### 6. Month/year picker + global config (local-midnight normalization)

```ts
import { Component, signal } from '@angular/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-month-config',
  standalone: true,
  imports: [...HlmDatePickerImports],
  providers: [
    provideHlmDatePickerConfig<Date>({
      autoCloseOnSelect: true,
      // Normalize every model value to local midnight.
      transformDate: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()),
      parseDate: (value: string) => {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
        if (!m) return null;
        const d = new Date(+m[1], +m[2] - 1, +m[3]);
        return isNaN(d.getTime()) ? null : d;
      },
    }),
  ],
  template: `
    <hlm-month-year-picker (dateChange)="month.set($event)">
      <hlm-month-year-input placeholder="MM/YYYY" />
    </hlm-month-year-picker>

    <hlm-date-picker [date]="month()" (dateChange)="month.set($event)">
      <hlm-date-picker-input placeholder="Pick a date" />
    </hlm-date-picker>
  `,
})
export class MonthConfigComponent {
  readonly month = signal<Date | null>(null);
}
```

## Accessibility notes

- The text inputs render a native `<input>` with `hlmInputGroupInput`, forwarding `inputId`, `placeholder`, `aria-label` / `aria-describedby` (single input), and disabled/invalid states — always pair with a visible `<label>` or `ariaLabel`.
- The button trigger wires `brnFieldControlDescribedBy`, `aria-invalid`, and `data-touched` / `data-dirty` attributes from the surrounding field control.
- Arrow-down opens the calendar, enter commits typed text, and closing the popover marks the control touched (driving `touched`-gated error display).
- The calendar and popover primitives handle roving focus, escape-to-close, and outside-click dismissal; the clear and calendar icon buttons expose `aria-label`s from the brain input (`clearAriaLabel`, `calendarAriaLabel`).

## Theming / CSS variables

No component-specific CSS variables. Style via the `class` input on `hlm-date-picker-trigger` / overlays, the `[hlmDatePickerHeader]` / `[hlmDatePickerFooter]` slots, and the global shadcn theme tokens (`--popover`, `--muted`, `--accent`, …). The popover content uses `tw:w-fit tw:p-0` and the calendar `tw:rounded-none tw:border-0` by default.

## Related subpaths

- `@egose/shadcn-theme-ng/calendar` — `HlmCalendar`, `HlmCalendarMulti`, `HlmCalendarRange`, `HlmMonthYearCalendar` rendered inside the popover.
- `@egose/shadcn-theme-ng/popover` — `HlmPopoverImports` positioning and portal.
- `@egose/shadcn-theme-ng/form-field` — `hlm-form-field` / `hlm-error` / `hlm-hint` wrappers for labelled, validated pickers.
- `@egose/shadcn-theme-ng/form-date-picker` — `eg-form-date-picker`, a ready-made labelled reactive-form wrapper around this picker.
