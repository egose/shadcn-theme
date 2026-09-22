# Toggle (`@egose/shadcn-theme-ng/toggle`)

A two-state press button, equivalent to [shadcn/ui Toggle](https://ui.shadcn.com/docs/components/toggle). This subpath ships a single thin styling directive, `HlmToggle` (`button[hlmToggle]`), over spartan-ng's `BrnToggle` primitive, with `variant` (`default`/`outline`) and `size` (`default`/`sm`/`lg`) inputs powered by `toggleVariants` (cva). Use it for standalone on/off buttons (bold, italic, mute); use `toggle-group` for sets of related toggles.

> **Ships as:** `@egose/shadcn-theme-ng/toggle` and `@egose/shadcn-theme-ng-tw/toggle` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@spartan-ng/brain` and `class-variance-authority` arrive transitively. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/toggle/src/public-api.ts`:

```ts
import { HlmToggle, HlmToggleImports, HlmToggleModule, toggleVariants } from '@egose/shadcn-theme-ng/toggle';
import type { ToggleVariants } from '@egose/shadcn-theme-ng/toggle';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/toggle'
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmToggleImports],
  template: `<button hlmToggle aria-label="Bold">B</button>`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmToggleModule } from '@egose/shadcn-theme-ng/toggle';

@NgModule({ imports: [HlmToggleModule] })
export class FeatureModule {}
```

| Symbol             | Kind          | Description                                                                    |
| ------------------ | ------------- | ------------------------------------------------------------------------------ |
| `HlmToggle`        | Directive     | `button[hlmToggle]` — styled toggle button over `BrnToggle`.                   |
| `toggleVariants`   | cva fn        | `toggleVariants({ variant, size })` — class generator, reused by toggle-group. |
| `ToggleVariants`   | Type          | `VariantProps<typeof toggleVariants>` — `variant`/`size` value types.          |
| `HlmToggleImports` | `const` array | `[HlmToggle]` — spread into `imports: [...]`.                                  |
| `HlmToggleModule`  | NgModule      | Imports + re-exports `HlmToggle`.                                              |

## Anatomy / Structure

```html
<!-- basic (pressed when aria-pressed="true" / state on) -->
<button hlmToggle aria-label="Toggle bold">B</button>

<!-- variants + sizes -->
<button hlmToggle variant="outline" size="sm">Toggle</button>
<button hlmToggle variant="default" size="lg" aria-label="Toggle italic">I</button>

<!-- controlled pressed state -->
<button hlmToggle [(state)]="bold" aria-label="Bold">B</button>

<!-- disabled -->
<button hlmToggle disabled aria-label="Unavailable">X</button>
```

> Only use on `<button>` elements — the selector is `button[hlmToggle]`.

## API reference

### `HlmToggle` — selector `button[hlmToggle]` (directive, hosts `BrnToggle`)

Own styling inputs:

| Input     | Type                                                   | Default     | Description                                                           |
| --------- | ------------------------------------------------------ | ----------- | --------------------------------------------------------------------- |
| `variant` | `ToggleVariants['variant']` (`'default' \| 'outline'`) | `'default'` | `default`: transparent; `outline`: bordered + shadow.                 |
| `size`    | `ToggleVariants['size']` (`'default' \| 'sm' \| 'lg'`) | `'default'` | `default`: `h-9 min-w-9`; `sm`: `h-8 min-w-8`; `lg`: `h-10 min-w-10`. |

Forwarded to `BrnToggle` via `hostDirectives`:

| Input / Output | Direction               | Description                                                    |
| -------------- | ----------------------- | -------------------------------------------------------------- |
| `id`           | input                   | Element id.                                                    |
| `value`        | input                   | Toggle value (used in groups / forms).                         |
| `disabled`     | input                   | Disabled state.                                                |
| `state`        | input (two-way capable) | Pressed state (`'on' \| 'off'` per Brn). Supports `[(state)]`. |
| `aria-label`   | input                   | Accessible name — **required** for icon-only toggles.          |
| `type`         | input                   | Button `type` (`button` default).                              |
| `stateChange`  | output                  | Emits when the pressed state changes.                          |

Host: `data-slot="toggle"`. Active styling keys off `aria-pressed`/`data-[state]` (`aria-pressed:bg-muted`). User `class` is preserved and merged via `classes()`.

## Examples

### 1. Basic icon toggles (editor toolbar)

```ts
// demo-basic.component.ts
import { Component } from '@angular/core';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmToggleImports, NgIcon],
  providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
  template: `
    <div class="flex gap-1">
      <button hlmToggle aria-label="Toggle bold"><ng-icon name="lucideBold" /></button>
      <button hlmToggle aria-label="Toggle italic"><ng-icon name="lucideItalic" /></button>
      <button hlmToggle aria-label="Toggle underline"><ng-icon name="lucideUnderline" /></button>
    </div>
  `,
})
export class DemoBasic {}
```

### 2. All variants and sizes

```ts
// demo-variants.component.ts
import { Component } from '@angular/core';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'demo-variants',
  standalone: true,
  imports: [...HlmToggleImports],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <button hlmToggle variant="default" size="sm">Small</button>
      <button hlmToggle variant="default" size="default">Default</button>
      <button hlmToggle variant="default" size="lg">Large</button>
      <button hlmToggle variant="outline" size="sm">Small outline</button>
      <button hlmToggle variant="outline" size="default">Outline</button>
      <button hlmToggle variant="outline" size="lg">Large outline</button>
    </div>
  `,
})
export class DemoVariants {}
```

### 3. Controlled state with signals

```ts
// demo-controlled.component.ts
import { Component, signal } from '@angular/core';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'demo-controlled',
  standalone: true,
  imports: [...HlmToggleImports],
  template: `
    <button hlmToggle variant="outline" [(state)]="muted" aria-label="Toggle mute">
      {{ muted() === 'on' ? 'Muted' : 'Unmuted' }}
    </button>
    <p class="text-sm text-muted-foreground">State: {{ muted() }}</p>
  `,
})
export class DemoControlled {
  readonly muted = signal<'on' | 'off'>('off');
}
```

React to changes imperatively with `(stateChange)`:

```html
<button hlmToggle (stateChange)="onToggle($event)" aria-label="Toggle preview">Preview</button>
```

```ts
onToggle(state: unknown) {
  console.log('toggle state:', state);
}
```

### 4. Disabled state

```ts
// demo-disabled.component.ts
import { Component } from '@angular/core';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'demo-disabled',
  standalone: true,
  imports: [...HlmToggleImports],
  template: `
    <div class="flex gap-2">
      <button hlmToggle disabled aria-label="Unavailable feature">Off</button>
      <button hlmToggle variant="outline" disabled aria-label="Unavailable outline">Off</button>
    </div>
  `,
})
export class DemoDisabled {}
```

### 5. Text toggle + composition with tooltip

```ts
// demo-composed.component.ts
import { Component } from '@angular/core';
import { HlmToggleImports } from '@egose/shadcn-theme-ng/toggle';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';

@Component({
  selector: 'demo-composed',
  standalone: true,
  imports: [...HlmToggleImports, ...HlmTooltipImports],
  template: `
    <button hlmToggle variant="outline" aria-label="Toggle sidebar" [hlmTooltip]="'Toggle sidebar'">☰</button>
  `,
})
export class DemoComposed {}
```

> `hlmTooltip` attaches to the same `<button>` — see `@egose/shadcn-theme-ng/tooltip` for delay/position options.

### 6. Advanced: reusing `toggleVariants` for custom components

```ts
// custom-toggle.component.ts
import { Component, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { toggleVariants, type ToggleVariants } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'custom-toggle',
  standalone: true,
  template: `<button [class]="classes()" [attr.aria-pressed]="pressed()"><ng-content /></button>`,
})
export class CustomToggle {
  readonly variant = input<ToggleVariants['variant']>('default');
  readonly size = input<ToggleVariants['size']>('default');
  readonly pressed = input(false);

  protected classes() {
    return hlm(toggleVariants({ variant: this.variant(), size: this.size() }), 'my-extra-class');
  }
}
```

## Accessibility notes

- Icon-only toggles **must** have `aria-label` (e.g. `aria-label="Toggle bold"`); text toggles get their name from content.
- The pressed state is exposed via `aria-pressed` by the Brn primitive — do not manage `aria-pressed` yourself when using `[(state)]`.
- Keep toggles keyboard-focusable (native `<button>` behavior); the focus ring (`focus-visible:ring-[3px]`) is built in.
- Use a toggle for an immediate on/off effect in place; use a switch for settings rows and a checkbox for form-submission choices.
- Disabled toggles render `pointer-events-none` + `opacity-50`; explain unavailability in nearby text when needed.

## Theming / CSS variables

`toggleVariants` keys off theme tokens (`hover:bg-muted`, `aria-pressed:bg-muted`, `border-input`, `ring-ring/50`, invalid-state `ring-destructive`). Follows your shadcn theme automatically; append overrides via `class` (merged through `classes()`).

## Related subpaths

- `@egose/shadcn-theme-ng/toggle-group` — sets of related toggles (alignment, formatting groups); reuses `toggleVariants`.
- `@egose/shadcn-theme-ng/switch` — on/off settings switch.
- `@egose/shadcn-theme-ng/tooltip` — label affordance for icon-only toggles.
- `@egose/shadcn-theme-ng/button` — action buttons (vs. pressed-state toggles).
