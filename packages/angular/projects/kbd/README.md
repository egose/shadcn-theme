# Kbd (`@egose/shadcn-theme-ng/kbd`)

Keyboard-keycap (`<kbd>`) styling for shortcut hints, ported from shadcn/ui `kbd`. There is no interactive primitive underneath — these are thin presentational directives that attach the shadcn keycap look (muted background, fixed `h-5` height, rounded, mono-adjacent `text-xs` label) plus a grouping row directive for multi-key chords such as `Ctrl + K`.

Ships as `@egose/shadcn-theme-ng/kbd` and `@egose/shadcn-theme-ng-tw/kbd` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md) — `@angular/core`, `@angular/common`, `@spartan-ng/brain`, `rxjs`, `@ng-icons/core`). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmKbd, // directive: kbd[hlmKbd]
  HlmKbdGroup, // directive: kbd[hlmKbdGroup]
  HlmKbdImports, // readonly [HlmKbd, HlmKbdGroup]
  HlmKbdModule, // NgModule wrapping HlmKbdImports
} from '@egose/shadcn-theme-ng/kbd';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmKbdImports } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmKbdImports],
  template: `<kbd hlmKbd>⌘</kbd>`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmKbdModule } from '@egose/shadcn-theme-ng/kbd';

@NgModule({ imports: [HlmKbdModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/kbd`. Symbol names are identical.

## Anatomy / Structure

```html
<!-- Single key -->
<kbd hlmKbd>Ctrl</kbd>

<!-- Chord / sequence: outer kbd carries the group layout, inner kbds carry keycap styling -->
<kbd hlmKbdGroup>
  <kbd hlmKbd>Ctrl</kbd>
  <span>+</span>
  <kbd hlmKbd>K</kbd>
</kbd hlmKbdGroup>
```

| Class         | Selector           | Element      | Role                                  |
| ------------- | ------------------ | ------------ | ------------------------------------- |
| `HlmKbd`      | `kbd[hlmKbd]`      | `<kbd>` only | Single keycap                         |
| `HlmKbdGroup` | `kbd[hlmKbdGroup]` | `<kbd>` only | Inline-flex row that lays out a chord |

Both selectors require a native `<kbd>` host. Applying `hlmKbd` to a `<span>` or `<div>` will not match and no styles are applied. Both set a `data-slot` host attribute (`kbd` / `kbd-group`) used by downstream tooltip overrides.

## API reference

Neither directive declares any `input()`, `output()`, method, or signal. They are pure styling directives: the constructor calls `classes(() => '…')` from `@egose/shadcn-theme-ng/utils`. All customization is via the host element itself (text content, `class`, `title`, `aria-*`).

| Selector           | Inputs | Outputs | Notes                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kbd[hlmKbd]`      | —      | —       | `data-slot="kbd"`. Fixed keycap treatment: `h-5 w-fit min-w-5`, `rounded-sm`, `bg-muted text-muted-foreground`, `pointer-events-none select-none`, inline-flex centered. Includes `in-data-[slot=tooltip-content]` overrides so keys stay legible inside tooltips (light and dark). Icon sizing rule `[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(3)]` normalizes bare `ng-icon` children. |
| `kbd[hlmKbdGroup]` | —      | —       | `data-slot="kbd-group"`. `inline-flex items-center gap-1`. Nest `HlmKbd` keycaps plus literal separators inside.                                                                                                                                                                                                                                                                                        |

## Examples

### 1. Basic single key

A lone keycap next to an action label.

```ts
import { Component } from '@angular/core';
import { HlmKbdImports } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-basic',
  standalone: true,
  imports: [...HlmKbdImports],
  template: ` <p>Press <kbd hlmKbd>Enter</kbd> to submit.</p> `,
})
export class KbdBasicComponent {}
```

```html
<p>Press <kbd hlmKbd>Enter</kbd> to submit.</p>
```

### 2. Keyboard chord (Ctrl + K)

The canonical command-palette hint. The outer `kbd[hlmKbdGroup]` provides the row; inner keycaps provide the boxes.

```ts
import { Component } from '@angular/core';
import { HlmKbdImports } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-chord',
  standalone: true,
  imports: [...HlmKbdImports],
  template: `
    <div class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-muted-foreground">
      <span>Search</span>
      <kbd hlmKbdGroup>
        <kbd hlmKbd>Ctrl</kbd>
        <span>+</span>
        <kbd hlmKbd>K</kbd>
      </kbd>
    </div>
  `,
})
export class KbdChordComponent {}
```

```html
<div class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-muted-foreground">
  <span>Search</span>
  <kbd hlmKbdGroup>
    <kbd hlmKbd>Ctrl</kbd>
    <span>+</span>
    <kbd hlmKbd>K</kbd>
  </kbd>
</div>
```

### 3. macOS-style symbols and sequences

```ts
import { Component } from '@angular/core';
import { HlmKbdImports } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-symbols',
  standalone: true,
  imports: [...HlmKbdImports],
  template: `
    <ul class="tw:flex tw:flex-col tw:gap-2 tw:text-sm">
      <li class="tw:flex tw:items-center tw:gap-2">
        <span class="tw:w-32">Copy</span>
        <kbd hlmKbdGroup><kbd hlmKbd>⌘</kbd><span>+</span><kbd hlmKbd>C</kbd></kbd>
      </li>
      <li class="tw:flex tw:items-center tw:gap-2">
        <span class="tw:w-32">Save</span>
        <kbd hlmKbdGroup><kbd hlmKbd>⌘</kbd><span>+</span><kbd hlmKbd>S</kbd></kbd>
      </li>
      <li class="tw:flex tw:items-center tw:gap-2">
        <span class="tw:w-32">Close window</span>
        <kbd hlmKbdGroup>
          <kbd hlmKbd>⌘</kbd><span>+</span><kbd hlmKbd>Shift</kbd><span>+</span><kbd hlmKbd>W</kbd>
        </kbd>
      </li>
    </ul>
  `,
})
export class KbdSymbolsComponent {}
```

### 4. Inside buttons, inputs, and menus

Keycaps are `pointer-events-none`, so they compose safely inside interactive parents.

```ts
import { Component } from '@angular/core';
import { HlmKbdImports } from '@egose/shadcn-theme-ng/kbd';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-kbd-composed',
  standalone: true,
  imports: [...HlmKbdImports, ...HlmButtonImports, HlmInput],
  template: `
    <div class="tw:flex tw:flex-col tw:gap-3 tw:max-w-sm">
      <button hlmButton variant="secondary" appearance="outline" type="button">
        <span>Command palette</span>
        <kbd hlmKbdGroup class="tw:ml-auto">
          <kbd hlmKbd>Ctrl</kbd>
          <span>+</span>
          <kbd hlmKbd>K</kbd>
        </kbd>
      </button>

      <label class="tw:flex tw:flex-col tw:gap-1 tw:text-sm">
        <span class="tw:flex tw:items-center tw:gap-2"> Search <kbd hlmKbd>/</kbd> </span>
        <input hlmInput placeholder="Type here, or press / to focus" />
      </label>
    </div>
  `,
})
export class KbdComposedComponent {}
```

### 5. Shortcut legend / settings table

```ts
import { Component, signal } from '@angular/core';
import { HlmKbdImports } from '@egose/shadcn-theme-ng/kbd';

interface Shortcut {
  action: string;
  keys: string[];
}

@Component({
  selector: 'app-kbd-legend',
  standalone: true,
  imports: [...HlmKbdImports],
  template: `
    <table class="tw:w-full tw:text-sm">
      <tbody>
        @for (s of shortcuts(); track s.action) {
          <tr class="tw:border-b">
            <td class="tw:py-2">{{ s.action }}</td>
            <td class="tw:py-2 tw:text-right">
              <kbd hlmKbdGroup class="tw:justify-end">
                @for (k of s.keys; track k; let last = $last) {
                  <kbd hlmKbd>{{ k }}</kbd>
                  @if (!last) {
                    <span>+</span>
                  }
                }
              </kbd>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class KbdLegendComponent {
  readonly shortcuts = signal<Shortcut[]>([
    { action: 'Undo', keys: ['Ctrl', 'Z'] },
    { action: 'Redo', keys: ['Ctrl', 'Shift', 'Z'] },
    { action: 'Toggle sidebar', keys: ['Ctrl', 'B'] },
  ]);
}
```

### 6. NgModule consumer

```ts
import { NgModule, Component } from '@angular/core';
import { HlmKbdModule } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-legacy',
  template: `<kbd hlmKbd>Esc</kbd> to close.`,
})
export class KbdLegacyComponent {}

@NgModule({
  declarations: [KbdLegacyComponent],
  imports: [HlmKbdModule],
  exports: [KbdLegacyComponent],
})
export class KbdLegacyModule {}
```

## Accessibility notes

- `<kbd>` is natively semantic ("keyboard input"). Keep the text content exactly what the user presses (`Ctrl`, not `Control` unless that is the label on the keyboard).
- For chords, screen readers linearize the group content; the `+` separators are announced. If verbosity matters, add an `aria-label` on the group (e.g. `aria-label="Control plus K"`) — plain HTML, no library input needed.
- Do not put interactive content inside a keycap: `HlmKbd` is `pointer-events-none` by design.
- `title`/`aria-keyshortcuts` belong on the _action_ that the shortcut triggers (e.g. the button), not on the `<kbd>` itself.

## Theming / CSS variables

No component inputs. Styling keys off shadcn semantic tokens (`bg-muted`, `text-muted-foreground`, `bg-background` inside tooltip content) so dark mode and theme overrides flow through automatically. Add extra utilities via `class` on the host `<kbd>` (merged by the `classes()` helper).

## Related subpaths

- `@egose/shadcn-theme-ng/tooltip` — keycaps render legibly inside tooltip content via the built-in `in-data-[slot=tooltip-content]` overrides.
- `@egose/shadcn-theme-ng/menu` (`HlmMenuShortcut`) — right-aligned shortcut column inside menus; use `kbd` keycaps inside it for key chords.
- `@egose/shadcn-theme-ng/button`, `@egose/shadcn-theme-ng/input` — common parents for inline shortcut hints.
