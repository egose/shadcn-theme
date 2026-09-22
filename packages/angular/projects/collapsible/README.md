# Collapsible (`@egose/shadcn-theme-ng/collapsible`)

A show/hide disclosure container — the Angular port of shadcn/ui `Collapsible`. Three thin directives compose it: `HlmCollapsible` (state owner, wraps `BrnCollapsible`), `HlmCollapsibleTrigger` (toggle button, wraps `BrnCollapsibleTrigger`), and `HlmCollapsibleContent` (collapsing panel, wraps `BrnCollapsibleContent`). All behavior — expanded state, disabled locking, `expandedChange` events, trigger/content wiring — comes from `@spartan-ng/brain/collapsible`; this package only adds `data-slot` attributes and (for content) the `data-[state=closed]:hidden` rule.

Ships as `@egose/shadcn-theme-ng/collapsible` and `@egose/shadcn-theme-ng-tw/collapsible` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/collapsible/package.json`).

## Imports

```ts
import {
  HlmCollapsible,
  HlmCollapsibleTrigger,
  HlmCollapsibleContent,
  HlmCollapsibleImports,
  HlmCollapsibleModule,
} from '@egose/shadcn-theme-ng/collapsible';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/collapsible';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmCollapsibleImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmCollapsibleModule } from '@egose/shadcn-theme-ng/collapsible';

@NgModule({ imports: [HlmCollapsibleModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<hlm-collapsible [expanded]="open" (expandedChange)="open = $event">
  <button hlmCollapsibleTrigger>Toggle details</button>
  <hlm-collapsible-content>
    <p>Hidden until expanded.</p>
  </hlm-collapsible-content>
</hlm-collapsible>
```

Real selectors (from source — note the trigger is button-only):

| Class                   | Selector                                             | `data-slot`           |
| ----------------------- | ---------------------------------------------------- | --------------------- |
| `HlmCollapsible`        | `[hlmCollapsible]`, `hlm-collapsible`                | `collapsible`         |
| `HlmCollapsibleTrigger` | `button[hlmCollapsibleTrigger]`                      | `collapsible-trigger` |
| `HlmCollapsibleContent` | `[hlmCollapsibleContent]`, `hlm-collapsible-content` | `collapsible-content` |

The trigger **must** be a `<button>` element (`button[hlmCollapsibleTrigger]` — an `<a>` or `<div>` with the attribute will not match). Trigger and content must be descendants of the same `HlmCollapsible` host.

## API reference

### `HlmCollapsible` (`[hlmCollapsible]`, `hlm-collapsible`)

Thin wrapper around `BrnCollapsible`:

| Brain input | Type      | Description                                                                        |
| ----------- | --------- | ---------------------------------------------------------------------------------- |
| `expanded`  | `boolean` | Controlled expanded state. Bind + listen to `expandedChange` for two-way behavior. |
| `disabled`  | `boolean` | Locks the trigger; content stays as-is.                                            |

| Brain output     | Payload   | Description                                                              |
| ---------------- | --------- | ------------------------------------------------------------------------ |
| `expandedChange` | `boolean` | Emitted whenever the trigger toggles (or state is set programmatically). |

No own inputs/outputs/methods.

### `HlmCollapsibleTrigger` (`button[hlmCollapsibleTrigger]`)

Thin wrapper around `BrnCollapsibleTrigger`:

| Brain input | Type     | Description                                                                                                               |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `type`      | `string` | Forwarded button `type` (`'button'`, `'submit'`, …). Default to `type="button"` inside forms to avoid accidental submits. |

No outputs of its own — activation flows through the parent's `expandedChange`.

### `HlmCollapsibleContent` (`[hlmCollapsibleContent]`, `hlm-collapsible-content`)

Thin wrapper around `BrnCollapsibleContent`:

| Brain input | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| `id`        | `string` | Content panel id (aria-controls wiring). |

Adds `data-[state=closed]:hidden` — the open/close animation (if any) is yours to add via `data-[state]` selectors.

## Examples

### 1. Basic collapsible (two-way binding pattern)

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-basic-collapsible',
  standalone: true,
  imports: [...HlmCollapsibleImports, ...HlmButtonImports],
  template: `
    <hlm-collapsible [expanded]="open" (expandedChange)="open = $event" class="w-96 rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium">Repository settings</h4>
        <button hlmBtn variant="ghost" size="sm" hlmCollapsibleTrigger>
          {{ open ? 'Hide' : 'Show' }}
        </button>
      </div>
      <hlm-collapsible-content>
        <p class="pt-3 text-sm">Visibility, branch protection, and secrets live here.</p>
      </hlm-collapsible-content>
    </hlm-collapsible>
  `,
})
export class BasicCollapsibleComponent {
  open = false;
}
```

### 2. Default-open + disabled lock

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';

@Component({
  selector: 'app-disabled-collapsible',
  standalone: true,
  imports: [...HlmCollapsibleImports],
  template: `
    <div class="space-y-4">
      <hlm-collapsible [expanded]="true" class="rounded-lg border p-4">
        <button hlmCollapsibleTrigger type="button" class="text-sm font-medium">Starts open (expanded=true)</button>
        <hlm-collapsible-content>
          <p class="pt-2 text-sm">This panel renders visible on first paint.</p>
        </hlm-collapsible-content>
      </hlm-collapsible>

      <hlm-collapsible [disabled]="true" class="rounded-lg border p-4 opacity-80">
        <button hlmCollapsibleTrigger type="button" class="text-sm font-medium">
          Locked (disabled=true) — trigger does nothing
        </button>
        <hlm-collapsible-content>
          <p class="pt-2 text-sm">You cannot reach this content while disabled.</p>
        </hlm-collapsible-content>
      </hlm-collapsible>
    </div>
  `,
})
export class DisabledCollapsibleComponent {}
```

### 3. Chevron rotation driven by state

Bind the icon rotation to your `open` flag — the classic shadcn pattern.

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';

@Component({
  selector: 'app-chevron-collapsible',
  standalone: true,
  imports: [...HlmCollapsibleImports, NgIcon],
  providers: [provideIcons({ lucideChevronsUpDown })],
  template: `
    <hlm-collapsible [expanded]="open" (expandedChange)="open = $event" class="w-96 rounded-lg border p-4">
      <button hlmCollapsibleTrigger type="button" class="flex w-full items-center justify-between text-sm font-medium">
        Can I use this in my project?
        <ng-icon name="lucideChevronsUpDown" class="transition-transform duration-200" [class.rotate-180]="open" />
      </button>
      <hlm-collapsible-content>
        <p class="pt-3 text-sm">Yes — free for personal and commercial use.</p>
      </hlm-collapsible-content>
    </hlm-collapsible>
  `,
})
export class ChevronCollapsibleComponent {
  open = false;
}
```

### 4. FAQ list (repeated collapsibles)

Each item owns its state — use an array of booleans or a Set of open ids.

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';

@Component({
  selector: 'app-faq-collapsible',
  standalone: true,
  imports: [...HlmCollapsibleImports],
  template: `
    <div class="w-full max-w-xl space-y-2">
      @for (item of faqs; track item.q; let i = $index) {
        <hlm-collapsible [expanded]="open[i]" (expandedChange)="open[i] = $event" class="rounded-lg border px-4 py-3">
          <button hlmCollapsibleTrigger type="button" class="w-full text-left text-sm font-medium">
            {{ item.q }}
          </button>
          <hlm-collapsible-content>
            <p class="pt-2 text-sm">{{ item.a }}</p>
          </hlm-collapsible-content>
        </hlm-collapsible>
      }
    </div>
  `,
})
export class FaqCollapsibleComponent {
  readonly faqs = [
    { q: 'Is it accessible?', a: 'Yes — triggers are real buttons with aria-expanded wiring from BrnCollapsible.' },
    { q: 'Is it animated?', a: 'Not by default; add data-[state] transitions (see example 6).' },
    { q: 'Can I nest them?', a: 'Yes — nest a full hlm-collapsible inside any content panel.' },
  ];
  open: boolean[] = [true, false, false];
}
```

### 5. Programmatic control (open all / close all)

Because `expanded` is a plain input, external buttons can drive it.

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-controlled-collapsible',
  standalone: true,
  imports: [...HlmCollapsibleImports, ...HlmButtonImports],
  template: `
    <div class="mb-3 flex gap-2">
      <button hlmBtn variant="outline" size="sm" (click)="setAll(true)">Expand all</button>
      <button hlmBtn variant="outline" size="sm" (click)="setAll(false)">Collapse all</button>
    </div>
    @for (s of sections; track s.title; let i = $index) {
      <hlm-collapsible [expanded]="open[i]" (expandedChange)="open[i] = $event" class="mb-2 rounded-lg border p-4">
        <button hlmCollapsibleTrigger type="button" class="text-sm font-medium">{{ s.title }}</button>
        <hlm-collapsible-content>
          <p class="pt-2 text-sm">{{ s.body }}</p>
        </hlm-collapsible-content>
      </hlm-collapsible>
    }
  `,
})
export class ControlledCollapsibleComponent {
  readonly sections = [
    { title: 'Billing', body: 'Invoices, seats, and receipts.' },
    { title: 'Security', body: 'SSO, 2FA, and audit log.' },
  ];
  open = [false, false];
  setAll(v: boolean) {
    this.open = this.open.map(() => v);
  }
}
```

### 6. Animated height (advanced, `data-[state]` + grid trick)

The content host exposes `data-state="open" | "closed"` from the brain directive — animate with a grid-rows transition instead of `hidden`.

```ts
import { Component } from '@angular/core';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';

@Component({
  selector: 'app-animated-collapsible',
  standalone: true,
  imports: [...HlmCollapsibleImports],
  template: `
    <hlm-collapsible [expanded]="open" (expandedChange)="open = $event" class="w-96 rounded-lg border p-4">
      <button hlmCollapsibleTrigger type="button" class="text-sm font-medium">
        {{ open ? 'Collapse' : 'Expand' }} with animation
      </button>
      <hlm-collapsible-content
        class="grid transition-all duration-200 data-[state=closed]:hidden data-[state=open]:grid-rows-[1fr] data-[state=closed]:grid-rows-[0fr]"
      >
        <div class="overflow-hidden">
          <p class="pt-3 text-sm">Smooth grid-rows open/close. Keep the inner overflow-hidden wrapper.</p>
        </div>
      </hlm-collapsible-content>
    </hlm-collapsible>
  `,
})
export class AnimatedCollapsibleComponent {
  open = false;
}
```

## Accessibility notes

- Trigger is a native `<button>` with `aria-expanded` / `aria-controls` wired by `BrnCollapsibleTrigger` — never replace it with a `<div (click)>`; keyboard (Enter/Space) support depends on the button.
- Always use `type="button"` on triggers inside `<form>`s to avoid accidental submits (the `type` input is forwarded).
- `disabled` on the parent locks the trigger (`aria-disabled` semantics from brain) — announce why it is locked with adjacent hint text.
- Content is hidden with `data-[state=closed]:hidden` (display:none), so screen readers skip closed panels — correct disclosure behavior.

## Theming / CSS variables

No component-specific CSS variables and no default open/close animation. Style hooks: `data-slot` (`collapsible`, `collapsible-trigger`, `collapsible-content`) and `data-state="open|closed"` / `data-disabled`. Add your own `data-[state=open]:…` transitions as in example 6.

## Related subpaths

- `@egose/shadcn-theme-ng/accordion` — mutually-exclusive multi-item disclosures (use instead of hand-rolled FAQ state).
- `@egose/shadcn-theme-ng/button` — ghost/small trigger styling (`hlmBtn`).
- `@egose/shadcn-theme-ng/icon` — chevron affordances rotated from your `open` flag.
- `@egose/shadcn-theme-ng/card` — bordered shells that host collapsible rows.
