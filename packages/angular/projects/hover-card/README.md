# Hover Card (`@egose/shadcn-theme-ng/hover-card`)

The hover card shows a rich preview panel when the user hovers (or focuses) a trigger — the shadcn/ui _HoverCard_ equivalent (docs link with an author preview, usercard on an `@mention`, product peek on hover). Behavior comes from spartan-ng's `BrnHoverCard` family (CDK overlay under the hood); this subpath adds the shadcn styling and `data-slot` hooks.

> **Ships as:** `@egose/shadcn-theme-ng/hover-card` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/hover-card` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';
// tw variant:
// import { HlmHoverCardImports } from '@egose/shadcn-theme-ng-tw/hover-card';
```

## Imports

```ts
// Standalone component — spread the imports array:
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  standalone: true,
  imports: [HlmHoverCardImports],
  template: `…`,
})
export class MyComp {}
```

```ts
// NgModule-based — import the module:
import { HlmHoverCardModule } from '@egose/shadcn-theme-ng/hover-card';

@NgModule({ imports: [HlmHoverCardModule] })
export class MyModule {}
```

Individual symbols (all exported from `src/public-api.ts`): `HlmHoverCard`, `HlmHoverCardTrigger`, `HlmHoverCardContent`, `HlmHoverCardPortal`, plus `HlmHoverCardImports` and `HlmHoverCardModule`.

## Anatomy / Structure

```html
<div hlmHoverCard>
  <a href="https://example.com" hlmHoverCardTrigger>Hover me</a>

  <!-- structural portal directive + styling directive on the same element -->
  <hlm-hover-card-content *hlmHoverCardPortal>
    <p class="tw:font-semibold">@example</p>
    <p class="tw:text-sm tw:text-gray-500">Preview content goes here.</p>
  </hlm-hover-card-content>
</div>
```

Real selectors: `[hlmHoverCard]` / `hlm-hover-card` (root, `hostDirectives: [BrnHoverCard]`), `[hlmHoverCardTrigger]` (trigger, `hostDirectives: [BrnHoverCardTrigger]`), `[hlmHoverCardPortal]` / `hlm-hover-card-portal` (structural overlay portal, `hostDirectives: [BrnHoverCardContent]` — used as `*hlmHoverCardPortal`), `[hlmHoverCardContent]` / `hlm-hover-card-content` (styling shell: popover colors, `w-64`, rounded, shadow, open/close animations; mirrors `data-state`/`data-side` attributes).

## API reference

### `hlmHoverCard` / `hlm-hover-card` — `HlmHoverCard`

Thin directive wrapper: `hostDirectives: [BrnHoverCard]`, `data-slot="hover-card"`. No inputs/outputs of its own — it owns the open state shared by trigger and portal.

### `[hlmHoverCardTrigger]` — `HlmHoverCardTrigger`

Thin directive wrapper forwarding these inputs to `BrnHoverCardTrigger` (plus `data-slot="hover-card-trigger"`):

| Input                    | Type    | Description                                                                         |
| ------------------------ | ------- | ----------------------------------------------------------------------------------- |
| `showDelay`              | (brain) | Delay before the card opens on hover.                                               |
| `hideDelay`              | (brain) | Delay before the card closes after pointer leave.                                   |
| `animationDelay`         | (brain) | Delay applied to the open/close animation.                                          |
| `sideOffset`             | (brain) | Pixel offset between trigger and card.                                              |
| `align`                  | (brain) | Overlay alignment (`start` / `center` / `end`).                                     |
| `hlmHoverCardTriggerFor` | (brain) | Explicit content reference (`brnHoverCardTriggerFor` alias) for non-default wiring. |

### `[hlmHoverCardPortal]` / `hlm-hover-card-portal` — `HlmHoverCardPortal`

Structural directive (`hostDirectives: [BrnHoverCardContent]`). Apply as `*hlmHoverCardPortal` on the content element so the card renders in the CDK overlay. No inputs of its own.

### `[hlmHoverCardContent]` / `hlm-hover-card-content` — `HlmHoverCardContent`

Styling directive for the panel. No inputs/outputs; it reads the overlay `state` (`open`/`closed`) and `side` (`top`/`bottom`/`left`/`right`) signals from the brain providers and reflects them as `data-state` / `data-side` attributes for the animation classes. Default width is `tw:w-64` — override with `class`.

## Examples

### 1. Basic link preview

```ts
import { Component } from '@angular/core';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  standalone: true,
  imports: [HlmHoverCardImports],
  template: `
    <div hlmHoverCard>
      <a href="https://angular.dev" hlmHoverCardTrigger class="tw:cursor-pointer tw:underline tw:text-blue-600">
        Angular
      </a>
      <hlm-hover-card-content *hlmHoverCardPortal>
        <p class="tw:font-semibold">Angular</p>
        <p class="tw:text-sm tw:text-gray-500">The web development framework for the modern web.</p>
      </hlm-hover-card-content>
    </div>
  `,
})
export class BasicExample {}
```

### 2. Open/close delays

```ts
import { Component } from '@angular/core';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  standalone: true,
  imports: [HlmHoverCardImports],
  template: `
    <div hlmHoverCard>
      <button hlmHoverCardTrigger type="button" [showDelay]="400" [hideDelay]="200">Hover (opens after 400ms)</button>
      <hlm-hover-card-content *hlmHoverCardPortal>
        <p class="tw:text-sm">Delays keep accidental hovers from flashing the card.</p>
      </hlm-hover-card-content>
    </div>
  `,
})
export class DelaysExample {}
```

### 3. Placement: side, align, offset

```ts
import { Component } from '@angular/core';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  standalone: true,
  imports: [HlmHoverCardImports],
  template: `
    <div hlmHoverCard>
      <span hlmHoverCardTrigger [sideOffset]="12" align="start"> Hover for right-side card </span>
      <hlm-hover-card-content *hlmHoverCardPortal class="tw:w-72">
        <p class="tw:text-sm">Offset by 12px, aligned to the trigger start edge.</p>
      </hlm-hover-card-content>
    </div>
  `,
})
export class PlacementExample {}
```

> `side` itself is owned by the brain content directive — set alignment/offset on the trigger; the `data-side` attribute on the content element reflects the resolved side for animations.

### 4. User card with avatar + stats

```ts
import { Component } from '@angular/core';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  standalone: true,
  imports: [HlmHoverCardImports, HlmAvatarImports],
  template: `
    <div hlmHoverCard>
      <span hlmHoverCardTrigger class="tw:cursor-pointer tw:font-medium tw:underline">@jane</span>
      <hlm-hover-card-content *hlmHoverCardPortal class="tw:w-80">
        <div class="tw:flex tw:gap-4">
          <hlm-avatar size="sm">
            <img hlmAvatarImage src="https://github.com/jane.png" alt="Jane's avatar" />
            <span hlmAvatarFallback>JA</span>
          </hlm-avatar>
          <div>
            <p class="tw:font-semibold">@jane</p>
            <p class="tw:text-sm tw:text-gray-500">Design engineer. Ships accessible UI.</p>
            <p class="tw:mt-2 tw:text-xs tw:text-gray-500">1.2k followers · 84 following</p>
          </div>
        </div>
      </hlm-hover-card-content>
    </div>
  `,
})
export class UserCardExample {}
```

### 5. Wide content (override the default `w-64`)

```ts
import { Component } from '@angular/core';
import { HlmHoverCardImports } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  standalone: true,
  imports: [HlmHoverCardImports],
  template: `
    <div hlmHoverCard>
      <button hlmHoverCardTrigger type="button">Product peek</button>
      <hlm-hover-card-content *hlmHoverCardPortal class="tw:w-96">
        <div class="tw:grid tw:grid-cols-[64px_1fr] tw:gap-3">
          <div class="tw:h-16 tw:w-16 tw:rounded-md tw:bg-slate-200"></div>
          <div>
            <p class="tw:font-semibold">Ergonomic keyboard</p>
            <p class="tw:text-sm tw:text-gray-500">Silent switches · $149 · In stock</p>
          </div>
        </div>
      </hlm-hover-card-content>
    </div>
  `,
})
export class WideExample {}
```

### 6. NgModule usage + keyboard-focusable trigger

Hover cards also open on keyboard focus, so a natively focusable trigger keeps them reachable without a mouse:

```ts
import { NgModule, Component } from '@angular/core';
import { HlmHoverCardModule } from '@egose/shadcn-theme-ng/hover-card';

@Component({
  selector: 'app-hover-demo',
  template: `
    <div hlmHoverCard>
      <button hlmHoverCardTrigger type="button">Focus me with Tab, then hover away</button>
      <hlm-hover-card-content *hlmHoverCardPortal>
        <p class="tw:text-sm">Focus opens the card too — no mouse required.</p>
      </hlm-hover-card-content>
    </div>
  `,
})
export class HoverDemoComponent {}

@NgModule({ declarations: [HoverDemoComponent], imports: [HlmHoverCardModule] })
export class HoverDemoModule {}
```

## Accessibility notes

- Use a natively focusable trigger (`<a href>`, `<button>`) — the card opens on focus as well as hover, which keeps keyboard users in the loop.
- Keep the card content supplementary: never put the _only_ copy of critical information (or interactive controls) inside a hover-only panel, since touch users and keyboard users may dismiss it easily.
- The brain layer handles overlay dismissal (Escape / outside pointer). Avoid `showDelay`s so long that keyboard focus has already moved on.
- If the trigger is an icon or avatar without text, give it an `aria-label` describing what the preview shows.

## Theming / CSS variables

No component-specific CSS variables; the panel uses the shared `--popover` / `--popover-foreground` / `--ring` tokens. Widen with `class="tw:w-…"`, or restyle padding via `class` overrides.

## Related subpaths

- `@egose/shadcn-theme-ng/popover` — click-triggered counterpart (same portal/content pattern).
- `@egose/shadcn-theme-ng/tooltip` — lightweight text-only hover hints.
- `@egose/shadcn-theme-ng/avatar` — typical media inside user preview cards.
- `@egose/shadcn-theme-ng/dialog` — modal alternative when the content needs interaction.
