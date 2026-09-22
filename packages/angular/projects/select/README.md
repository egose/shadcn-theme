# Select (`@egose/shadcn-theme-ng/select`)

A shadcn/ui-style **Select** dropdown — button trigger, floating panel, grouped options with check-mark selection. This is the Angular equivalent of shadcn/ui `Select` (`SelectTrigger`, `SelectContent`, `SelectItem`, …).

Behavior comes from **spartan-ng/brain** (`BrnSelect` / `BrnSelectMultiple`, `BrnSelectContent`, `BrnSelectItem`, …, plus `BrnPopover` for positioning): popover open/close, keyboard navigation, type-ahead, single- and multi-value models. This package adds the shadcn structure and styling, including the check icon (`lucideCheck` via `@ng-icons`), scroll buttons, and the `sm`/`default` trigger sizes.

> **Ships as:** `@egose/shadcn-theme-ng/select` and `@egose/shadcn-theme-ng-tw/select` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';
// tw variant:
// import { HlmSelectImports } from '@egose/shadcn-theme-ng-tw/select';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`, `@spartan-ng/brain`. Icons come from `@ng-icons` (installed transitively).

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                   | Kind          | Selector                                                     |
| ------------------------ | ------------- | ------------------------------------------------------------ |
| `HlmSelect`              | Directive     | `[hlmSelect],hlm-select` (single value)                      |
| `HlmSelectMultiple`      | Directive     | `[hlmSelectMultiple],hlm-select-multiple` (multi value)      |
| `HlmSelectTrigger`       | Component     | `hlm-select-trigger`                                         |
| `HlmSelectContent`       | Component     | `hlm-select-content`                                         |
| `HlmSelectItem`          | Component     | `hlm-select-item`                                            |
| `HlmSelectGroup`         | Directive     | `[hlmSelectGroup],hlm-select-group`                          |
| `HlmSelectLabel`         | Directive     | `[hlmSelectLabel],hlm-select-label`                          |
| `HlmSelectValue`         | Directive     | `[hlmSelectValue],hlm-select-value`                          |
| `HlmSelectValues`        | Directive     | `[hlmSelectValues]` (multi)                                  |
| `HlmSelectValuesContent` | Directive     | `[hlmSelectValuesContent],hlm-select-values-content` (multi) |
| `HlmSelectPlaceholder`   | Directive     | `[hlmSelectPlaceholder],hlm-select-placeholder`              |
| `HlmSelectSeparator`     | Directive     | `[hlmSelectSeparator],hlm-select-separator`                  |
| `HlmSelectScrollUp`      | Component     | `hlm-select-scroll-up`                                       |
| `HlmSelectScrollDown`    | Component     | `hlm-select-scroll-down`                                     |
| `HlmSelectPortal`        | Directive     | `[hlmSelectPortal]`                                          |
| `HlmSelectValueTemplate` | Directive     | `[hlmSelectValueTemplate]`                                   |
| `HlmSelectImports`       | `const` array | All of the above, for standalone `imports`                   |
| `HlmSelectModule`        | `NgModule`    | NgModule wrapper re-exporting all of the above               |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmSelectImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSelectModule } from '@egose/shadcn-theme-ng/select';

@NgModule({ imports: [HlmSelectModule] })
export class DemoModule {}
```

## Anatomy / Structure

Single select:

```html
<div hlmSelect [(value)]="fruit">
  <hlm-select-trigger>
    <hlm-select-value placeholder="Pick a fruit" />
  </hlm-select-trigger>

  <hlm-select-content *hlmSelectPortal>
    <div hlmSelectGroup>
      <div hlmSelectLabel>Fruits</div>
      <hlm-select-item value="apple">Apple</hlm-select-item>
      <hlm-select-item value="banana">Banana</hlm-select-item>
      <hlm-select-item value="blueberry" disabled>Blueberry</hlm-select-item>
    </div>

    <hlm-select-separator />

    <hlm-select-item value="other">Other</hlm-select-item>
  </hlm-select-content>
</div>
```

Multi select (same skeleton, `hlmSelectMultiple` + `hlmSelectValues`):

```html
<div hlmSelectMultiple [(value)]="toppings">
  <hlm-select-trigger>
    <span hlmSelectValues>
      <span hlmSelectValuesContent>
        <span hlmSelectValue placeholder="Pick toppings" />
      </span>
    </span>
  </hlm-select-trigger>

  <hlm-select-content *hlmSelectPortal>
    <hlm-select-item value="cheese">Cheese</hlm-select-item>
    <hlm-select-item value="bacon">Bacon</hlm-select-item>
  </hlm-select-content>
</div>
```

Selector/slot summary:

| Selector                                             | `data-slot`                        | Notes                                                         |
| ---------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `[hlmSelect],hlm-select`                             | `select`                           | Provides popover config (`align: start`, `sideOffset: 6`)     |
| `[hlmSelectMultiple],hlm-select-multiple`            | `select`                           | Same popover config, multi-value model                        |
| `hlm-select-trigger`                                 | `select-trigger` (on inner button) | Renders its own `<button brnSelectTrigger>` + chevron icon    |
| `hlm-select-content`                                 | —                                  | Floating panel; optional `showScroll` scroll buttons          |
| `hlm-select-item`                                    | `select-item`                      | Option row; check icon appears when active                    |
| `[hlmSelectGroup],hlm-select-group`                  | `select-group`                     | Option grouping wrapper                                       |
| `[hlmSelectLabel],hlm-select-label`                  | `select-label`                     | Group heading                                                 |
| `[hlmSelectValue],hlm-select-value`                  | `select-value` (when visible)      | Current-value display (single)                                |
| `[hlmSelectValues]`                                  | —                                  | Current-values host (multi)                                   |
| `[hlmSelectValuesContent],hlm-select-values-content` | —                                  | Layout row for multi values                                   |
| `[hlmSelectPlaceholder],hlm-select-placeholder`      | `select-placeholder`               | Shown when nothing is selected                                |
| `[hlmSelectSeparator],hlm-select-separator`          | `select-separator`                 | Divider line (has `orientation` input)                        |
| `hlm-select-scroll-up` / `hlm-select-scroll-down`    | —                                  | Chevron buttons (auto-rendered by content when `showScroll`)  |
| `[hlmSelectPortal]`                                  | —                                  | Binds the content to the popover overlay (`*hlmSelectPortal`) |
| `[hlmSelectValueTemplate]`                           | —                                  | Custom value template marker                                  |

## API reference

### HlmSelect / HlmSelectMultiple (directives)

Thin wrappers. Forwarded `BrnSelect` / `BrnSelectMultiple` bindings:

| Binding              | Kind   | Description                                                  |
| -------------------- | ------ | ------------------------------------------------------------ |
| `disabled`           | input  | Disables the select                                          |
| `value`              | input  | Selected value (single) / values (multiple); use `[(value)]` |
| `isItemEqualToValue` | input  | Custom equality fn for object values                         |
| `itemToString`       | input  | Custom label fn for object values                            |
| `valueChange`        | output | Emits on selection change                                    |

Forwarded `BrnPopover` bindings (positioning of the floating panel):

| Binding                       | Kind   | Description                                          |
| ----------------------------- | ------ | ---------------------------------------------------- |
| `align`                       | input  | Overlay alignment (default from provider: `'start'`) |
| `sideOffset`                  | input  | Offset px (default from provider: `6`)               |
| `closeOnOutsidePointerEvents` | input  | Close on outside pointer down                        |
| `state`                       | input  | Controlled open state                                |
| `offsetX`                     | input  | Extra X offset                                       |
| `stateChanged`                | output | Emits on open-state change                           |
| `closed`                      | output | Emits when the panel closes                          |

### HlmSelectTrigger (component, `hlm-select-trigger`)

Own inputs (it renders an inner `<button brnSelectTrigger brnFieldControlDescribedBy>`):

| Input                 | Type                | Default                       | Description                                  |
| --------------------- | ------------------- | ----------------------------- | -------------------------------------------- |
| `buttonId`            | `string`            | auto (`hlm-select-trigger-N`) | `id` of the inner button                     |
| `ariaDescribedby`     | `string \| null`    | `null`                        | `aria-describedby` for the inner button      |
| `wrapperDisabled`     | `boolean`           | `false`                       | Renders `disabled` attr on the inner button  |
| `size`                | `'default' \| 'sm'` | `'default'`                   | Height variant (`data-size`; `h-9` vs `h-8`) |
| `forceInvalid`        | `boolean`           | `false`                       | Forces the invalid ring styling              |
| `class` (`userClass`) | `ClassValue`        | `''`                          | Extra classes                                |

Invalid styling keys off `data-[matches-spartan-invalid=true]` (from the form control state) unless `forceInvalid` is set.

### HlmSelectContent (component, `hlm-select-content`)

| Input        | Type      | Default | Description                                                                      |
| ------------ | --------- | ------- | -------------------------------------------------------------------------------- |
| `showScroll` | `boolean` | `false` | Render `hlm-select-scroll-up/down` chevrons around the listbox (boolean-coerced) |

Panel width tracks the trigger (`w-(--brn-select-width)`), max height `tw:max-h-72`, with open/close animations.

### HlmSelectItem (component, `hlm-select-item`)

Forwarded `BrnSelectItem` inputs: `id`, `disabled`, `value`. Shows a `lucideCheck` icon at the end when its `active` signal is true. `data-disabled` options are non-interactive (`pointer-events-none`, dimmed).

### Remaining pieces

| Class                    | Forwarded inputs                             | Notes                                           |
| ------------------------ | -------------------------------------------- | ----------------------------------------------- |
| `HlmSelectGroup`         | — (plain `BrnSelectGroup`)                   | Padding wrapper                                 |
| `HlmSelectLabel`         | `id` (via `BrnSelectLabel`)                  | Muted small-caps-ish heading                    |
| `HlmSelectValue`         | `placeholder` (via `BrnSelectValue`)         | Hides itself (`data-hidden`) when a value shows |
| `HlmSelectValues`        | — (plain `BrnSelectValues`)                  | Multi-value host                                |
| `HlmSelectValuesContent` | —                                            | Flex row with gap                               |
| `HlmSelectPlaceholder`   | — (plain `BrnSelectPlaceholder`)             | Hides when a value shows (`data-hidden`)        |
| `HlmSelectSeparator`     | `orientation` (via `BrnSelectSeparator`)     | 1px divider                                     |
| `HlmSelectScrollUp/Down` | —                                            | Sticky chevron affordances                      |
| `HlmSelectPortal`        | `context`, `class` (via `BrnPopoverContent`) | Structural use: `*hlmSelectPortal="let ctx"`    |
| `HlmSelectValueTemplate` | — (plain `BrnSelectValueTemplate`)           | Marker for custom value rendering               |

## Examples

### 1. Basic single select

```ts
import { Component, signal } from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-basic-select',
  standalone: true,
  imports: [HlmSelectImports],
  template: `
    <div hlmSelect [(value)]="fruit">
      <hlm-select-trigger>
        <hlm-select-value placeholder="Pick a fruit" />
      </hlm-select-trigger>
      <hlm-select-content *hlmSelectPortal>
        <hlm-select-item value="apple">Apple</hlm-select-item>
        <hlm-select-item value="banana">Banana</hlm-select-item>
        <hlm-select-item value="orange">Orange</hlm-select-item>
      </hlm-select-content>
    </div>
    <p>Selected: {{ fruit() ?? 'none' }}</p>
  `,
})
export class BasicSelectComponent {
  readonly fruit = signal<string | null>(null);
}
```

### 2. Grouped options with labels, separator, disabled item, scroll buttons

```html
<div hlmSelect [(value)]="city">
  <hlm-select-trigger>
    <hlm-select-value placeholder="Pick a city" />
  </hlm-select-trigger>

  <hlm-select-content *hlmSelectPortal showScroll>
    <div hlmSelectGroup>
      <div hlmSelectLabel>Germany</div>
      <hlm-select-item value="berlin">Berlin</hlm-select-item>
      <hlm-select-item value="munich">Munich</hlm-select-item>
    </div>

    <hlm-select-separator />

    <div hlmSelectGroup>
      <div hlmSelectLabel>France</div>
      <hlm-select-item value="paris">Paris</hlm-select-item>
      <hlm-select-item value="lyon" disabled>Lyon (unavailable)</hlm-select-item>
    </div>
  </hlm-select-content>
</div>
```

### 3. Reactive forms + small trigger + forced invalid demo

`BrnSelect` is a `ControlValueAccessor`: bind `formControlName` on the `hlmSelect` host.

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [HlmSelectImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div hlmSelect formControlName="country">
        <hlm-select-trigger size="sm" ariaDescribedby="country-hint">
          <hlm-select-value placeholder="Country" />
        </hlm-select-trigger>
        <hlm-select-content *hlmSelectPortal>
          <hlm-select-item value="de">Germany</hlm-select-item>
          <hlm-select-item value="fr">France</hlm-select-item>
          <hlm-select-item value="es">Spain</hlm-select-item>
        </hlm-select-content>
      </div>
      <p id="country-hint" class="tw:text-muted-foreground tw:text-xs">Used for shipping.</p>
      <button type="submit">Save</button>
    </form>
  `,
})
export class FormSelectComponent {
  readonly form = new FormGroup({
    country: new FormControl<string | null>(null, Validators.required),
  });

  submit(): void {
    this.form.markAllAsTouched();
  }
}
```

### 4. Multi select with placeholder

```ts
import { Component, signal } from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [HlmSelectImports],
  template: `
    <div hlmSelectMultiple [(value)]="toppings">
      <hlm-select-trigger>
        <span hlmSelectValues>
          <span hlmSelectValuesContent>
            <span hlmSelectValue placeholder="Pick toppings" />
          </span>
        </span>
      </hlm-select-trigger>
      <hlm-select-content *hlmSelectPortal>
        <hlm-select-item value="cheese">Extra cheese</hlm-select-item>
        <hlm-select-item value="bacon">Bacon</hlm-select-item>
        <hlm-select-item value="mushrooms">Mushrooms</hlm-select-item>
      </hlm-select-content>
    </div>
    <p>{{ toppings().length }} selected</p>
  `,
})
export class MultiSelectComponent {
  readonly toppings = signal<string[]>([]);
}
```

### 5. Object values with custom equality/labels + disabled select

```ts
import { Component, signal } from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-object-select',
  standalone: true,
  imports: [HlmSelectImports],
  template: `
    <div hlmSelect [(value)]="assignee" [isItemEqualToValue]="byId" [itemToString]="toName" [disabled]="locked()">
      <hlm-select-trigger>
        <hlm-select-value placeholder="Assign to…" />
      </hlm-select-trigger>
      <hlm-select-content *hlmSelectPortal>
        @for (user of users; track user.id) {
          <hlm-select-item [value]="user">{{ user.name }}</hlm-select-item>
        }
      </hlm-select-content>
    </div>
  `,
})
export class ObjectSelectComponent {
  readonly users: User[] = [
    { id: 'u1', name: 'Ada' },
    { id: 'u2', name: 'Grace' },
  ];
  readonly assignee = signal<User | null>(null);
  readonly locked = signal(false);

  readonly byId = (a: User | null, b: User | null) => a?.id === b?.id;
  readonly toName = (u: User | null) => u?.name ?? '';
}
```

### 6. Controlled popover state + custom value template

```ts
import { Component, signal } from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-advanced-select',
  standalone: true,
  imports: [HlmSelectImports],
  template: `
    <button type="button" (click)="open.set(!open())">Toggle from outside</button>

    <div
      hlmSelect
      [(value)]="plan"
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="open.set($event === 'open')"
      (closed)="onClosed()"
    >
      <hlm-select-trigger>
        <span hlmSelectValueTemplate>⭐ {{ plan() ?? 'Pick a plan' }}</span>
      </hlm-select-trigger>
      <hlm-select-content *hlmSelectPortal="let ctx">
        <hlm-select-item value="hobby">Hobby</hlm-select-item>
        <hlm-select-item value="pro">Pro</hlm-select-item>
      </hlm-select-content>
    </div>
  `,
})
export class AdvancedSelectComponent {
  readonly plan = signal<string | null>(null);
  readonly open = signal(false);

  onClosed(): void {
    console.log('panel closed');
  }
}
```

## Accessibility notes

- The trigger is a native `<button>` with popover/listbox semantics from brain: it announces expanded state and the selected value; keep the `hlm-select-value`/`placeholder` inside the trigger so there is always an accessible name.
- `hlm-select-content` renders `role="listbox"`; options are keyboard-navigable with type-ahead — do not intercept arrow keys inside the panel.
- Disabled items (`disabled` on `hlm-select-item`) are skipped by the key manager and dimmed; the whole select can be disabled via `disabled` on the host.
- Invalid form state surfaces through `data-[matches-spartan-invalid]` on the trigger (ring + border) — pair with a visible error message and `ariaDescribedby` pointing at it.

## Theming / CSS variables

Class-driven (popover tokens `--popover`, trigger/input tokens, accent highlight). The panel width follows `--brn-select-width` (measured from the trigger). Override density via `size="sm"` on the trigger or the `class` input on any piece.

## Related subpaths

- `@egose/shadcn-theme-ng/searchable-multiselect` — chip-style multi pick with popover checkboxes
- `@egose/shadcn-theme-ng/popover` — the underlying floating-panel primitive
- `@egose/shadcn-theme-ng/form-select` — form-field wrapper (label/description/error) for selects
- `@egose/shadcn-theme-ng/native-select` — lightweight native `<select>` alternative
