# Drawer (`@egose/shadcn-theme-ng/drawer`)

A swipeable bottom/side panel in the shadcn/ui Drawer (vaul-style) look: overlay + sliding content with header, title, description, and footer slots. Equivalent to shadcn/ui `Drawer`.

The Angular implementation is a thin styling layer over the headless
[`BrnDrawer*` primitives from `@spartan-ng/brain/drawer`](https://www.spartan-ng.com/) (built on the
brain dialog core): `HlmDrawer` extends `BrnDrawer`, `HlmDrawerContent` composes `BrnDrawerHandle`
with direction-aware slide animations, and trigger/close/title/description/overlay directives compose
their `Brn*` counterparts via `hostDirectives`. Styling uses `hlm()` / `classes()` from
`@egose/shadcn-theme-ng/utils`.

> **Ships as:** `@egose/shadcn-theme-ng/drawer` and `@egose/shadcn-theme-ng-tw/drawer`
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
dependencies beyond `@egose/shadcn-theme-ng/utils`.

## Imports

All symbols are exported from the subpath root (`projects/drawer/src/public-api.ts`):

```ts
import {
  HlmDrawer,
  HlmDrawerContent,
  HlmDrawerTrigger,
  HlmDrawerClose,
  HlmDrawerOverlay,
  HlmDrawerPortal,
  HlmDrawerTitle,
  HlmDrawerDescription,
  HlmDrawerHeader,
  HlmDrawerFooter,
  HlmDrawerImports,
  HlmDrawerModule,
} from '@egose/shadcn-theme-ng/drawer';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/drawer'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmDrawerImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmDrawerModule } from '@egose/shadcn-theme-ng/drawer';

@NgModule({ imports: [HlmDrawerModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<hlm-drawer>
  <button hlmBtn variant="outline" hlmDrawerTrigger>Open drawer</button>

  <hlm-drawer-content>
    <div hlmDrawerHeader>
      <h2 hlmDrawerTitle>Edit profile</h2>
      <p hlmDrawerDescription>Make changes here.</p>
    </div>

    <p class="tw:px-4">Drawer body…</p>

    <div hlmDrawerFooter>
      <button hlmBtn hlmDrawerClose>Close</button>
    </div>
  </hlm-drawer-content>
</hlm-drawer>
```

Real selectors (from source):

| Class                  | Selector(s)                              | Kind                            |
| ---------------------- | ---------------------------------------- | ------------------------------- |
| `HlmDrawer`            | `hlm-drawer`                             | Component (extends `BrnDrawer`) |
| `HlmDrawerContent`     | `hlm-drawer-content`                     | Component                       |
| `HlmDrawerTrigger`     | `button[hlmDrawerTrigger]`               | Directive (thin wrapper)        |
| `HlmDrawerClose`       | `button[hlmDrawerClose]`                 | Directive (thin wrapper)        |
| `HlmDrawerOverlay`     | `[hlmDrawerOverlay], hlm-drawer-overlay` | Directive                       |
| `HlmDrawerPortal`      | `[hlmDrawerPortal]`                      | Directive                       |
| `HlmDrawerTitle`       | `[hlmDrawerTitle]`                       | Directive                       |
| `HlmDrawerDescription` | `[hlmDrawerDescription]`                 | Directive                       |
| `HlmDrawerHeader`      | `[hlmDrawerHeader], hlm-drawer-header`   | Directive                       |
| `HlmDrawerFooter`      | `[hlmDrawerFooter], hlm-drawer-footer`   | Directive                       |

## API reference

### `HlmDrawer` — `hlm-drawer`

Root drawer state host. Extends `BrnDrawer` (and provides `BrnDialog` + `BrnDrawer` tokens). Renders `<hlm-drawer-overlay />` plus projected content. `exportAs: 'hlmDrawer'`.

No new inputs/outputs — direction and dialog options come from the trigger (`direction`) and brain defaults.

### `HlmDrawerContent` — `hlm-drawer-content`

The sliding panel. Hosts `BrnDrawerHandle` (swipe/drag, `closeThreshold` input forwarded), exposes `data-vaul-drawer-direction` and `data-state`, and renders the drag handle bar for bottom drawers plus projected content.

| Input (forwarded) | Type                           | Description                           |
| ----------------- | ------------------------------ | ------------------------------------- |
| `closeThreshold`  | forwarded to `BrnDrawerHandle` | Drag distance that closes the drawer. |

| Member  | Description                                                                          |
| ------- | ------------------------------------------------------------------------------------ |
| `state` | Current open state signal (from the exposed state provider, defaults to `'closed'`). |

Direction styling (`bottom` default, plus `top` / `left` / `right`) is driven by the trigger's `direction` via `data-vaul-drawer-direction` selectors.

### `HlmDrawerTrigger` — `button[hlmDrawerTrigger]`

Thin wrapper. Forwards `id`, `direction`, `type` to `BrnDrawerTrigger` via `hostDirectives`. Set `direction="left" | "right" | "top" | "bottom"` here.

### `HlmDrawerClose` — `button[hlmDrawerClose]`

Thin wrapper around `BrnDrawerClose`. Place on any `<button>` inside the drawer to close it.

### `HlmDrawerOverlay` — `[hlmDrawerOverlay], hlm-drawer-overlay`

Backdrop. Wraps `BrnDrawerOverlay`; merges `class` via `hlm()`.

| Input   | Type         | Default | Description                                         |
| ------- | ------------ | ------- | --------------------------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged over the base overlay classes. |

### `HlmDrawerPortal` — `[hlmDrawerPortal]`

Thin wrapper forwarding `context` and `class` to `BrnDrawerContent` for portal-based content.

### `HlmDrawerTitle` — `[hlmDrawerTitle]` / `HlmDrawerDescription` — `[hlmDrawerDescription]`

Accessible title/description. Wrap `BrnDrawerTitle` / `BrnDrawerDescription` plus shadcn typography. No inputs.

### `HlmDrawerHeader` / `HlmDrawerFooter`

Pure layout directives, no inputs. Header centers text on top/bottom drawers; footer stacks actions with `mt-auto`.

## Examples

### 1. Basic bottom drawer

```ts
import { Component } from '@angular/core';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-basic-drawer',
  standalone: true,
  imports: [...HlmDrawerImports, HlmButton],
  template: `
    <hlm-drawer>
      <button hlmBtn variant="outline" hlmDrawerTrigger>Open drawer</button>
      <hlm-drawer-content>
        <div hlmDrawerHeader>
          <h2 hlmDrawerTitle>Are you sure?</h2>
          <p hlmDrawerDescription>This action cannot be undone.</p>
        </div>
        <div hlmDrawerFooter>
          <button hlmBtn hlmDrawerClose>Close</button>
        </div>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class BasicDrawerComponent {}
```

### 2. Direction variants (left / right / top)

```ts
import { Component } from '@angular/core';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-directions',
  standalone: true,
  imports: [...HlmDrawerImports, HlmButton],
  template: `
    <hlm-drawer>
      <button hlmBtn variant="outline" hlmDrawerTrigger direction="right">Right panel</button>
      <hlm-drawer-content>
        <div hlmDrawerHeader>
          <h2 hlmDrawerTitle>Right drawer</h2>
          <p hlmDrawerDescription>Slides in from the right.</p>
        </div>
        <div hlmDrawerFooter>
          <button hlmBtn variant="outline" hlmDrawerClose>Close</button>
        </div>
      </hlm-drawer-content>
    </hlm-drawer>

    <hlm-drawer>
      <button hlmBtn variant="outline" hlmDrawerTrigger direction="left">Left panel</button>
      <hlm-drawer-content>
        <div hlmDrawerHeader>
          <h2 hlmDrawerTitle>Left drawer</h2>
          <p hlmDrawerDescription>Slides in from the left.</p>
        </div>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class DirectionsComponent {}
```

### 3. Form drawer with footer actions

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-form-drawer',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, HlmInput, HlmButton, ...HlmDrawerImports],
  template: `
    <hlm-drawer>
      <button hlmBtn hlmDrawerTrigger>New goal</button>
      <hlm-drawer-content>
        <div hlmDrawerHeader>
          <h2 hlmDrawerTitle>New goal</h2>
          <p hlmDrawerDescription>Set a goal for this week.</p>
        </div>
        <form [formGroup]="form" class="tw:grid tw:gap-4 tw:px-4">
          <label hlmLabel for="goal">Goal</label>
          <input hlmInput id="goal" formControlName="goal" placeholder="Exercise 3x" />
        </form>
        <div hlmDrawerFooter>
          <button hlmBtn [disabled]="form.invalid" hlmDrawerClose (click)="save()">Save</button>
          <button hlmBtn variant="outline" hlmDrawerClose>Cancel</button>
        </div>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class FormDrawerComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ goal: ['', Validators.required] });
  save() {
    console.log(this.form.value);
  }
}
```

### 4. Drag threshold + custom overlay

```ts
import { Component } from '@angular/core';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-threshold',
  standalone: true,
  imports: [...HlmDrawerImports, HlmButton],
  template: `
    <hlm-drawer>
      <button hlmBtn variant="secondary" hlmDrawerTrigger>Player queue</button>
      <hlm-drawer-content [closeThreshold]="0.4" class="tw:max-h-[60vh]">
        <div hlmDrawerHeader>
          <h2 hlmDrawerTitle>Up next</h2>
          <p hlmDrawerDescription>Drag down past 40% to dismiss.</p>
        </div>
        <ul class="tw:px-4 tw:text-sm">
          <li>Track 1 — Intro</li>
          <li>Track 2 — Verse</li>
          <li>Track 3 — Outro</li>
        </ul>
        <div hlmDrawerFooter>
          <button hlmBtn variant="outline" hlmDrawerClose>Close</button>
        </div>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class ThresholdComponent {}
```

### 5. Element + attribute header/footer spellings

```ts
import { Component } from '@angular/core';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-spellings',
  standalone: true,
  imports: [...HlmDrawerImports, HlmButton],
  template: `
    <hlm-drawer>
      <button hlmBtn variant="ghost" hlmDrawerTrigger>Filters</button>
      <hlm-drawer-content>
        <hlm-drawer-header>
          <h2 hlmDrawerTitle>Filters</h2>
          <p hlmDrawerDescription>Refine the list below.</p>
        </hlm-drawer-header>
        <div class="tw:px-4 tw:text-sm">Filter controls…</div>
        <hlm-drawer-footer>
          <button hlmBtn hlmDrawerClose>Apply</button>
          <button hlmBtn variant="ghost" hlmDrawerClose>Reset</button>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class SpellingsComponent {}
```

### 6. Multi-step content inside one drawer

```ts
import { Component, signal } from '@angular/core';
import { HlmDrawerImports } from '@egose/shadcn-theme-ng/drawer';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [...HlmDrawerImports, HlmButton],
  template: `
    <hlm-drawer>
      <button hlmBtn hlmDrawerTrigger>Checkout</button>
      <hlm-drawer-content>
        <div hlmDrawerHeader>
          <h2 hlmDrawerTitle>Step {{ step() }} of 2</h2>
          <p hlmDrawerDescription>{{ step() === 1 ? 'Address' : 'Payment' }}</p>
        </div>
        <div class="tw:px-4 tw:text-sm">
          @if (step() === 1) {
            <p>Address form…</p>
          } @else {
            <p>Payment form…</p>
          }
        </div>
        <div hlmDrawerFooter>
          @if (step() === 1) {
            <button hlmBtn (click)="step.set(2)">Next</button>
          } @else {
            <button hlmBtn (click)="step.set(1)" variant="outline">Back</button>
            <button hlmBtn hlmDrawerClose>Pay</button>
          }
        </div>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class StepsComponent {
  readonly step = signal(1);
}
```

## Accessibility notes

- Always include `hlmDrawerTitle` and `hlmDrawerDescription` so the panel is labelled and described (brain `BrnDrawerTitle` / `BrnDrawerDescription` wiring).
- Focus is trapped while open and restored to the trigger on close; escape and overlay click dismiss by default.
- The drag handle is visual; keyboard and screen-reader users rely on the close button — always provide a labelled `hlmDrawerClose` control.
- `data-state` and `data-vaul-drawer-direction` attributes let assistive and custom styles target open/closed and directional states.

## Theming / CSS variables

No component-specific CSS variables. Panel geometry and slide animations are direction-aware via `data-vaul-drawer-direction` selectors; colors come from global tokens (`--background`, `--muted`, …). Extend with `class` on `hlm-drawer-content` / overlay.

## Related subpaths

- `@egose/shadcn-theme-ng/dialog` — centered modal built on the same brain dialog core.
- `@egose/shadcn-theme-ng/sheet` — side-anchored panel alternative without swipe handling.
- `@egose/shadcn-theme-ng/button` — `hlmBtn` triggers and footer actions.
- `@egose/shadcn-theme-ng/separator` — dividers inside drawer bodies.
