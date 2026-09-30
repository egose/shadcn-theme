# @egose/shadcn-theme-ng

A themeable [shadcn/ui](https://ui.shadcn.com/)-style component library for Angular, built with [Tailwind CSS](https://tailwindcss.com/), [@spartan-ng/brain](https://www.spartan-ng.com/), and [@ng-icons](https://www.ng-icons.dev/). Ships one Angular library per component, consumed via npm subpath imports.

## Install

Pick the package that matches your Tailwind setup (see **Tailwind variants** below):

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant (when your Tailwind is configured with the `tw:` prefix):
npm install @egose/shadcn-theme-ng-tw
```

`pnpm` / `yarn` equivalents work too. npm installs peer dependencies automatically when it can resolve compatible
versions; applications must keep their existing framework versions inside the supported ranges below.

### Peer dependencies

| Package                   | Supported version  | Tested version |
| ------------------------- | ------------------ | -------------- |
| `@angular/cdk`            | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/common`         | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/core`           | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/forms`          | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/router`         | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@ng-icons/core`          | `>=35.0.1 <36.0.0` | `35.0.1`       |
| `@spartan-ng/brain`       | `>=1.3.2 <2.0.0`   | `1.3.2`        |
| `@tanstack/angular-table` | `>=9.1.2 <10.0.0`  | `9.1.2`        |
| `rxjs`                    | `>=7.8.0 <8.0.0`   | `7.8.2`        |

Angular and CDK must use the same major version. The tested consumer contract is Angular 22, CDK 22, and Spartan 1.3.2;
the ranges above are copied from the published peer metadata and validated with strict isolated installs.

Runtime implementation dependencies such as `@ng-icons/lucide`, `@ng-icons/tabler-icons`, `class-variance-authority`,
`clsx`, `embla-carousel`, `embla-carousel-angular`, `ngx-scrollbar`, `ngx-sonner`, `tailwind-merge`, and `tslib` are
installed transitively. Do not install them directly unless your application also imports them.

### Tailwind variants

There are two published variants of this package. They produce identical markup and TypeScript surface but differ in the Tailwind class-string prefix:

| Variant           | Package                     | Tailwind prefix in emitted class strings | Consumer requirement                                  |
| ----------------- | --------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Plain (no prefix) | `@egose/shadcn-theme-ng`    | (none — prefix stripped)                 | Configure Tailwind with **no** prefix (default).      |
| `tw:`-prefixed    | `@egose/shadcn-theme-ng-tw` | `tw:` (kept)                             | Configure Tailwind to recognize the **`tw:`** prefix. |

If your project mixes shadcn styles with other Tailwind utilities that share class names, use the `-tw` variant to avoid collisions.

Class utilities are normalized to one unprefixed canonical representation during packaging. The plain artifact emits
unprefixed utilities, while the `-tw` artifact prefixes every recognized utility with `tw:`. Generated JavaScript source
maps are intentionally excluded because this post-build class and package-identity transformation invalidates ng-packagr's
maps; shipping no map is safer than shipping a map that points at different generated code.

## Release preparation

Prepare both release candidates without publishing by supplying the intended version explicitly:

```bash
pnpm --dir packages/angular prepare:release --version 1.2.3
```

This runs `@repo-toolkit/publish-package` with `publish.config.mjs`: it serially
builds, validates, and packs the plain (`release/plain` → `@egose/shadcn-theme-ng`)
and `tw:` (`release/tw` → `@egose/shadcn-theme-ng-tw`) variants. The inspectable
stages and two exact `.tgz` artifacts are written under `packages/angular/release/`.
Neither package is published unless both candidates pass every step. Publishing is
intended to run from protected CI with npm trusted publishing/OIDC; `--otp` remains
available for manual publishes (passed to the toolkit publish command, never logged).

## Source tests

Headless-test prerequisite (local and CI): the Karma suites need a
Chrome-compatible binary. The repository-supported setup downloads it into
the repo-local `.puppeteer-cache/` directory:

```bash
pnpm --dir packages/angular install:browser
```

Alternatively, set `CHROME_BIN` to any Chrome/Chromium binary yourself
(`test/karma.conf.js` honors a pre-set `CHROME_BIN`, then falls back to a
system Chrome).

Focused library tests are intentionally separate from staged-package and artifact validation:

```bash
# One selected library
pnpm --dir packages/angular test:library form-text-input
pnpm --dir packages/angular test:library utils

# Source export contracts plus every selected library, serially and headlessly
pnpm --dir packages/angular test:libraries

# The example shell and router behavior
pnpm --dir packages/angular/@examples/standard test:ci
```

The browser suites share `packages/angular/test/setup.ts`, which provides zoneless Angular setup and assertions for form
bindings and resource teardown. DOM reconciliation uses real `MutationObserver` and animation-frame scheduling; server-mode
coverage verifies those browser resources are not created. All CI commands disable watch mode so they terminate after one run.

## Import forms

Import each component via its own npm subpath:

```ts
import { HlmButtonModule, HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { EgLayoutSimple, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';
```

For the `-tw` variant, swap the package name:

```ts
import { HlmButtonModule, HlmButton } from '@egose/shadcn-theme-ng-tw/button';
```

Standalone consumers can import the `*Imports` const arrays; NgModule consumers can import the corresponding `*Module` classes:

```ts
// Standalone component:
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
@Component({ imports: [...HlmButtonImports] })
export class MyComp {}

// NgModule-based:
import { HlmButtonModule } from '@egose/shadcn-theme-ng/button';
@NgModule({ imports: [HlmButtonModule] })
export class MyModule {}
```

## Available subpaths

Import by component name. Component `NameX` is reachable at `@egose/shadcn-theme-ng/<name-x>` (kebab-case). The current surface:

<!-- BEGIN GENERATED SUBPATHS -->

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `autocomplete`, `avatar`, `badge`, `basic-alert`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `checkbox`, `collapsible`, `combobox`, `command`, `confirmation-dialog`, `context-menu`, `data-table`, `date-picker`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `form-autocomplete`, `form-checkbox`, `form-combobox`, `form-date-picker`, `form-date-picker-multi`, `form-date-range-picker`, `form-field`, `form-field-simple`, `form-input-otp`, `form-month-year-picker`, `form-native-select`, `form-phone-input`, `form-radio-group`, `form-searchable-multiselect`, `form-select`, `form-slider`, `form-switch`, `form-text-input`, `form-textarea`, `form-toggle`, `form-toggle-group`, `hover-card`, `icon`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `layout-simple`, `menu`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `phone-input`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `searchable-multiselect`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `stepper`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`, `typography`, `utils`.

<!-- END GENERATED SUBPATHS -->

Anything not in this list is not part of the public surface. The published `exports` map in `package.json` reflects this set exactly — if a subpath is not listed, do not assume it is importable.

## Quick start (Angular standalone)

```ts
import { Component } from '@angular/core';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { EgLayoutSimple, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: "app-demo",
  standalone: true,
  imports: [EgLayoutSimple, ...HlmButtonImports],
  template: \`
    <eg-layout-simple brandName="My workspace" [primaryNavigation]="items">
      <button hlmBtn variant="primary">Click</button>
    </eg-layout-simple>
  \`,
})
export class DemoComponent {
  readonly items: MenuItem[] = [];
}
```

## Searchable multiselect

`EgSearchableMultiselect` provides local, case-insensitive label search, named removable chips, and a `string[]` CVA. Import it directly from its public subpath:

```ts
import { Component, signal } from '@angular/core';
import { EgSearchableMultiselect } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'app-assignees',
  imports: [EgSearchableMultiselect],
  template: `
    <eg-searchable-multiselect
      [options]="people"
      [(value)]="selected"
      ariaLabel="Assignees"
      searchLabel="Find people"
      searchPlaceholder="Type a name…"
      emptyMessage="No people match"
    />
  `,
})
export class AssigneesComponent {
  readonly people = [
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
  ];
  readonly selected = signal<string[]>(['ada']);
}
```

Use `@egose/shadcn-theme-ng-tw/searchable-multiselect` for the prefixed variant. Pass the complete options list: the trimmed query filters labels in source order without changing selected IDs or chip labels. Clearing the query restores choices. Async option replacements update labels and results; unresolved selections retain their IDs. Search is local to supplied options, with no remote requests or virtualization. The query persists across closing/reopening and external value resets.

The native search is visibly labeled, empty results use a polite status region, and chip buttons are named `Remove <label>` (raw ID when unresolved). Customize names with `[removeLabel]="formatter"`, where `formatter: (option: SelectOption) => string` is pure and `SelectOption` comes from the same subpath. Search edits neither emit selection changes nor touch forms. Input/wrapper/form disabled flags block search and selection edits. With default popover focus settings, opening focuses search; Tab reaches checkbox buttons, Space/Enter toggles them, and Escape closes and restores trigger focus. Enter in search does not submit a form.

For reactive or template-driven forms, import `ReactiveFormsModule` or `FormsModule` and bind `formControl`/`formControlName` or `ngModel` instead of `value`. CVA writes own selection after the first write; null/empty arrays clear it without user emissions. Standalone new `[value]` arrays replace local edits; `[(value)]` synchronizes the parent. Supply unique IDs and immutable array/option updates. `EgFormSearchableMultiselect` from `@egose/shadcn-theme-ng/form-searchable-multiselect` adds the form label/hint/error layout and forwards `searchLabel`, `searchPlaceholder`, `emptyMessage`, and `removeLabel`.

## Date picker values

By default, `hlm-date-picker` emits a native JS `Date` (or `null` when cleared) via the `dateChange` output. Read it in the
controller with `(dateChange)`, a template ref (`picker.value()`), or a form binding (`ngModel`/`formControlName`,
the picker is a `ControlValueAccessor`):

```html
<hlm-date-picker (dateChange)="onDate($event)">
  <hlm-date-picker-input placeholder="Pick a date" />
</hlm-date-picker>
```

```ts
onDate(date: Date | null) {
  // date is a JS Date, e.g. 2026-09-23T00:00:00 local time (or null on clear)
}
```

Unlike the React `FormDatePicker` (which normalizes to local midnight), the Angular picker passes dates through
untouched by default: calendar clicks usually arrive at local midnight already, but dates typed into the input are
parsed with `new Date(value)`, where `"YYYY-MM-DD"` means UTC midnight — so the time portion can be non-zero. To
normalize every value reaching the controller to local midnight, provide a custom config (no library changes needed):

```ts
import { provideHlmDatePickerConfig } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  // ...
  providers: [
    provideHlmDatePickerConfig({
      // Strip the time portion, mirroring React's normalizeDate.
      transformDate: (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      // Parse typed "YYYY-MM-DD" as a local date instead of new Date(value) (UTC).
      parseDate: (value: string) => {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return null;
        const date = new Date(+match[1], +match[2] - 1, +match[3]);
        return isNaN(date.getTime()) ? null : date;
      },
    }),
  ],
})
export class MyComponent {}
```

`transformDate` runs on every path into the model (calendar selection, typed input, `writeValue`), so the controller
then always sees local-midnight dates. Related: the picker stays open after selection by default; add the
`autoCloseOnSelect` attribute (or set it in the same config) to close it on select.

### Typed commits and constraints (single, range, multi)

Text commits on blur or Enter. Both the parsed value and the configured transform result must satisfy
`min`/`max`, inclusive of the adapter's entire boundary days. Comparisons and validity (`getTime` must be
finite) use Spartan's configured date adapter; custom date types also need matching parse/format/transform
config callbacks. A range's transformed endpoints must be ordered; a custom transform may sort them.
The default range parser accepts a single date as a same-day range, but rejects an explicitly unparseable
second endpoint.

Multi-date commits cannot exceed `maxSelection`. Consistent with calendar selection, `minSelection` is a
**deselection floor**: reducing the current count below it is rejected, but growing a selection from empty
is allowed. Counts apply to the supplied arrays before and after transformation. Supply unique dates.
At the calendar's maximum, its proposed reset to one new date is accepted only if the floor permits it.

Rejected text remains editable across blur, Enter and refocus, with native `aria-invalid="true"` and invalid
styling. It does **not** change the committed value or emit `dateChange`/CVA `onChange`; the interaction
marks the control touched. `inputInvalid()` on the text-input component exposes this local state. It does
not add Angular validation errors: validators still inspect the last committed form value. Use
`ariaDescribedby` for application-specific guidance, and include `inputInvalid()` in submission eligibility
if an unresolved draft should block submission. Existing `forceInvalid` is combined with this state.

A successful text/calendar commit clears the local invalid state. Empty text or the clear button explicitly
clears (`null` for single/range, `[]` for multi), bypassing transforms and the selection floor. Whitespace is
passed to the configured parser. Enter retains the edit format so later blur can parse it; blur uses the
display format. Rejected calendar selections restore the prior selection without emitting a replacement.

`updateDate(value)` is the user-commit boundary and returns `false` on rejection/disabled, `true` on success.
Programmatic CVA `writeValue` (including form `setValue`/reset) instead applies the transform **without**
user-constraint enforcement or user emissions, and replaces rejected text even for repeated values/null.
Standalone `[date]` updates retain their direct, untransformed input contract; they are not user commits.
`reset()` remains an explicit programmatic clear that emits. Parse/transform callbacks should be pure and
return values compatible with the configured adapter; parsing failure is represented by `null`.

## Validation descriptions on composed fields

`EgFormAutocomplete`, `EgFormInputOtp`, `EgFormSlider`, and `EgFormCombobox` connect the
displayed hint or validation error to their actual native input, slider thumbs, or combobox
trigger/search input. Errors replace hints when invalid and touched, dirty, or submitted;
correction and form reset restore the appropriate hint. `HlmError` is styled text, not a live region.

Use `[aria-describedby]="'external-help-id'"` on these wrappers to add external descriptions.
The wrapper normalizes/deduplicates IDs and appends its current message ID. Keep consumer-owned
description elements mounted, and reserve `<effectiveId>-error` / `-hint` for wrapper messages.
`[attr.aria-describedby]` only targets the custom host and is not this forwarding contract.

For primitive compositions, `HlmAutocompleteInput`, `HlmComboboxInput`, `HlmComboboxTrigger`,
`HlmSlider`, and `HlmInputOtpControl` accept `[aria-describedby]` and merge it with descriptions
registered by the enclosing Spartan field. Import `HlmInputOtpControl` (selector `hlm-input-otp`)
or `HlmInputOtpImports` from `@egose/shadcn-theme-ng/input-otp`; it retains the brain OTP CVA and
editing behavior while adding native-input descriptions, required and invalid state. Existing
`brn-input-otp hlmInputOtp` compositions remain available.

Single combobox mode labels its trigger with `<effectiveId>` and uses `<effectiveId>-search`
for its separately labeled popup search. Required/invalid selection state stays on the trigger;
the popup search filters options. Slider thumbs retain their labels and invalid state; the slider
role has no `aria-required`. Configure Angular validators independently of wrapper `required`.
Verification is rendered browser DOM/focus coverage, not screen-reader testing.

## Numbered pagination

Import `HlmNumberedPagination` or `HlmNumberedPaginationQueryParams` from
`@egose/shadcn-theme-ng/pagination` (or the `-tw` package), then bind
`[(currentPage)]`, `[(itemsPerPage)]` and `[totalItems]`.

Both pagers floor/clamp the current page when totals, size or page inputs change.
Empty/non-finite/non-positive totals or sizes produce one page with no previous/next;
invalid sizes are not rewritten. Non-finite pages become 1. A correction emits
`currentPageChange` once. Positive fractional totals/sizes use ceil division, with
page counts capped at `Number.MAX_SAFE_INTEGER`. `maxSize` budgets window entries,
including ellipses: finite positive values are floored/clamped to 1–100, otherwise 7.
Ranges below 5 show a contiguous active-page window. Helpers `createPageArray` and
`outOfBoundCorrection` use the same policy without side effects or allocation based
on an unbounded page count.

The query-params pager builds bounded `?page=` links using `queryParamsHandling="merge"`,
preserving unrelated query parameters. The parent owns reading route changes and
any URL synchronization: model corrections and size changes do not navigate. Handle
`currentPageChange` in the parent if corrected URLs should be replaced, merging other
parameters. Keep the previous total during loading if temporary zero results should
not reset the page.

## Working example

A complete Angular consumer app lives at [`@examples/standard`](https://github.com/egose/shadcn-theme/tree/main/packages/angular/@examples/standard) — see its `src/app/...` for real usage of `@egose/shadcn-theme-ng/button`, `.../layout-simple`, `.../form-text-input`, `.../autocomplete`, `.../select`, `.../form-checkbox`, `.../sheet`, etc.

## License

Apache-2.0 — see the `LICENSE` file shipped with the package (sourced from the repo root).
