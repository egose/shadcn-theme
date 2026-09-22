# Card (`@egose/shadcn-theme-ng/card`)

A shadcn/ui-style content card — the Angular port of shadcn/ui `Card`. Seven thin attribute/element directives (`HlmCard`, `HlmCardHeader`, `HlmCardTitle`, `HlmCardDescription`, `HlmCardAction`, `HlmCardContent`, `HlmCardFooter`) compose a rounded, ringed, theme-aware container with a `--card-spacing` rhythm token and a `size: 'sm' | 'default'` density switch. There is no headless primitive and no JavaScript behavior: every directive only attaches `data-slot` attributes and Tailwind classes via the shared `classes()` helper.

Ships as `@egose/shadcn-theme-ng/card` and `@egose/shadcn-theme-ng-tw/card` (the `tw:`-prefixed variant). See the [package README](../../README.md) for install, peer dependencies, and Tailwind setup. Do not publish this project directory independently — it is consumed via the published subpath only.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peers are listed in the [package README](../../README.md). This subpath declares `@angular/common`, `@angular/core`, and `@spartan-ng/brain` as peers (see `projects/card/package.json`).

## Imports

```ts
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardAction,
  HlmCardContent,
  HlmCardFooter,
  HlmCardImports,
  HlmCardModule,
} from '@egose/shadcn-theme-ng/card';
// tw variant:
// import { ... } from '@egose/shadcn-theme-ng-tw/card';
```

Standalone:

```ts
import { Component } from '@angular/core';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmCardImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule:

```ts
import { NgModule } from '@angular/core';
import { HlmCardModule } from '@egose/shadcn-theme-ng/card';

@NgModule({ imports: [HlmCardModule] })
export class DemoModule {}
```

> `HlmCardConfig` / `provideHlmCardConfig` / `injectHlmCardConfig` exist in `lib/hlm-card.token.ts` but are **not** re-exported from `public-api.ts` — the only public density API is the `size` input on `HlmCard`.

## Anatomy / Structure

```html
<hlm-card size="default">
  <hlm-card-header>
    <h3 hlmCardTitle>Title</h3>
    <p hlmCardDescription>Description</p>
    <div hlmCardAction><!-- header action (button, badge, switch) --></div>
  </hlm-card-header>
  <div hlmCardContent><!-- body --></div>
  <hlm-card-footer><!-- footer actions --></hlm-card-footer>
</hlm-card>
```

All-attribute form also works (`<div hlmCard>`, `<div hlmCardHeader>`, …). Real selectors:

| Class                | Selectors                            | `data-slot`            |
| -------------------- | ------------------------------------ | ---------------------- |
| `HlmCard`            | `[hlmCard]`, `hlm-card`              | `card` (+ `data-size`) |
| `HlmCardHeader`      | `[hlmCardHeader]`, `hlm-card-header` | `card-header`          |
| `HlmCardTitle`       | `[hlmCardTitle]`                     | `card-title`           |
| `HlmCardDescription` | `[hlmCardDescription]`               | `card-description`     |
| `HlmCardAction`      | `[hlmCardAction]`                    | `card-action`          |
| `HlmCardContent`     | `[hlmCardContent]`                   | `card-content`         |
| `HlmCardFooter`      | `[hlmCardFooter]`, `hlm-card-footer` | `card-footer`          |

Header auto-switches to a two-column grid when a `card-action` child is present (`has-data-[slot=card-action]`); images placed first/last get top/bottom rounding and collapse the top padding.

## API reference

### `HlmCard`

| Input  | Type                | Default     | Description                                                                                                                                                        |
| ------ | ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `size` | `'sm' \| 'default'` | `'default'` | Density. `'sm'` shrinks `--card-spacing` from `--spacing(6)` to `--spacing(4)` and shrinks `card-title` via `group-data-[size=sm]/card`. Reflected as `data-size`. |

No outputs or methods.

### Header / body / footer directives

All six are thin wrappers with no inputs, outputs, or methods:

| Directive            | Notes                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HlmCardHeader`      | Grid container; `group/card-header`, `@container/card-header`. Add `border-b` class to get bottom padding rhythm (`[.border-b]:pb-(--card-spacing)`). |
| `HlmCardTitle`       | `text-base font-medium`; auto-shrinks under `data-[size=sm]` cards. Apply to any heading element.                                                     |
| `HlmCardDescription` | Muted `text-sm` paragraph.                                                                                                                            |
| `HlmCardAction`      | Grid-placed (`col-start-2 row-span-2`) top-right action slot.                                                                                         |
| `HlmCardContent`     | Horizontal `--card-spacing` padding; calendars/popovers render transparent inside it by convention.                                                   |
| `HlmCardFooter`      | Flex row; add `border-t` class to get top padding rhythm (`[.border-t]:pt-(--card-spacing)`).                                                         |

## Examples

### 1. Basic card

```ts
import { Component } from '@angular/core';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-basic-card',
  standalone: true,
  imports: [...HlmCardImports, ...HlmButtonImports],
  template: `
    <div hlmCard class="w-96">
      <div hlmCardHeader>
        <h3 hlmCardTitle>Notifications</h3>
        <p hlmCardDescription>You have 3 unread messages.</p>
      </div>
      <div hlmCardContent>
        <p class="text-sm">Push notifications, mentions, and replies live here.</p>
      </div>
      <hlm-card-footer>
        <button hlmBtn variant="outline">Settings</button>
      </hlm-card-footer>
    </div>
  `,
})
export class BasicCardComponent {}
```

> The footer example above assumes `HlmButtonImports` is also imported for `hlmBtn`.

### 2. Density sizes (`default` vs `sm`)

```ts
import { Component } from '@angular/core';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';

@Component({
  selector: 'app-density-cards',
  standalone: true,
  imports: [...HlmCardImports],
  template: `
    <div class="flex gap-4">
      <hlm-card size="default" class="w-72">
        <hlm-card-header>
          <h3 hlmCardTitle>Default density</h3>
          <p hlmCardDescription>--card-spacing: spacing(6)</p>
        </hlm-card-header>
        <div hlmCardContent>Roomy padding for dashboards.</div>
      </hlm-card>
      <hlm-card size="sm" class="w-72">
        <hlm-card-header>
          <h3 hlmCardTitle>Compact density</h3>
          <p hlmCardDescription>--card-spacing: spacing(4)</p>
        </hlm-card-header>
        <div hlmCardContent>Tight padding for lists and sidebars.</div>
      </hlm-card>
    </div>
  `,
})
export class DensityCardsComponent {}
```

### 3. Header action slot

`hlmCardAction` docks to the top-right of the header grid automatically.

```ts
import { Component } from '@angular/core';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [...HlmCardImports, ...HlmButtonImports],
  template: `
    <hlm-card class="w-96">
      <hlm-card-header>
        <h3 hlmCardTitle>Team plan</h3>
        <p hlmCardDescription>Billed monthly, cancel anytime.</p>
        <button hlmBtn size="sm" hlmCardAction>Upgrade</button>
      </hlm-card-header>
      <div hlmCardContent>
        <p class="text-3xl font-semibold">$29<span class="text-sm font-normal">/mo</span></p>
      </div>
    </hlm-card>
  `,
})
export class ActionCardComponent {}
```

### 4. Bordered header/footer rhythm

Padding for divided cards is opt-in: add `border-b` / `border-t` and the matching padding appears.

```ts
import { Component } from '@angular/core';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-divided-card',
  standalone: true,
  imports: [...HlmCardImports, ...HlmButtonImports],
  template: `
    <hlm-card class="w-96">
      <hlm-card-header class="border-b">
        <h3 hlmCardTitle>Audit log</h3>
        <p hlmCardDescription>Last 7 days across all projects.</p>
      </hlm-card-header>
      <div hlmCardContent class="pt-4">
        <ul class="space-y-2 text-sm">
          <li>Deploy succeeded — main @ 14:02</li>
          <li>Invite accepted — ada@example.com</li>
          <li>Token rotated — CI</li>
        </ul>
      </div>
      <hlm-card-footer class="border-t justify-end gap-2">
        <button hlmBtn variant="ghost">Export</button>
        <button hlmBtn variant="outline">View all</button>
      </hlm-card-footer>
    </div>
  `,
})
export class DividedCardComponent {}
```

> Requires `HlmButtonImports` for `hlmBtn`.

### 5. Image card (rounded media edges)

A leading `<img>` collapses the card's top padding and inherits the top radius; a trailing image inherits the bottom radius.

```ts
import { Component } from '@angular/core';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [...HlmCardImports],
  template: `
    <hlm-card class="w-80 overflow-hidden">
      <img src="https://picsum.photos/640/360" alt="Random landscape" class="h-40 w-full object-cover" />
      <hlm-card-header>
        <h3 hlmCardTitle>Lakeview cabin</h3>
        <p hlmCardDescription>Entire home · 4 guests · 2 beds</p>
      </hlm-card-header>
      <div hlmCardContent>
        <p class="text-sm">Morning fog, evening loons. Kayaks included.</p>
      </div>
    </hlm-card>
  `,
})
export class MediaCardComponent {}
```

### 6. Composed card: form + calendar + footer actions

Cards are the standard host for heavier compositions; inner calendars/popovers already render transparent.

```ts
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmCardImports } from '@egose/shadcn-theme-ng/card';
import { HlmCalendarImports } from '@egose/shadcn-theme-ng/calendar';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';

@Component({
  selector: 'app-composed-card',
  standalone: true,
  imports: [ReactiveFormsModule, ...HlmCardImports, ...HlmCalendarImports, ...HlmButtonImports, HlmInput],
  providers: [provideNativeDateAdapter()],
  template: `
    <hlm-card class="w-[26rem]">
      <hlm-card-header>
        <h3 hlmCardTitle>Book a room</h3>
        <p hlmCardDescription>Name the trip, then pick the day.</p>
      </hlm-card-header>
      <div hlmCardContent class="space-y-4">
        <input hlmInput placeholder="Trip name" [formControl]="name" />
        <hlm-calendar [date]="date()" (dateChange)="date.set($event)" />
      </div>
      <hlm-card-footer class="justify-end gap-2">
        <button hlmBtn variant="ghost" (click)="reset()">Reset</button>
        <button hlmBtn [disabled]="!name.value || !date()">Book</button>
      </hlm-card-footer>
    </div>
  `,
})
export class ComposedCardComponent {
  readonly name = new FormControl('');
  readonly date = signal<Date | undefined>(undefined);
  reset() {
    this.name.reset('');
    this.date.set(undefined);
  }
}
```

## Accessibility notes

- Cards are generic containers with no landmark semantics — use real headings (`h2`/`h3` + `hlmCardTitle`) inside `hlmCardHeader` so assistive tech gets an outline.
- Do not nest interactive elements inside `hlmCardAction` incorrectly (e.g. a `<button>` inside an `<a>` card) — keep one interactive root or use stretched-link patterns deliberately.
- `hlmCardDescription` is a plain paragraph; wire it to form controls with `aria-describedby` yourself when the card describes a field.
- Color contrast comes from `bg-card` / `text-card-foreground` / `text-muted-foreground` theme tokens — verify custom `class` overrides preserve contrast.

## Theming / CSS variables

- `--card-spacing` (default `--spacing(6)`, `'sm'` → `--spacing(4)`): gap, vertical padding, and horizontal padding rhythm. Override per card: `<hlm-card class="[--card-spacing:--spacing(8)]">`.
- Surface tokens: `bg-card`, `text-card-foreground`, `ring-foreground/10`, `shadow-xs`, `rounded-xl`. Dark mode follows the shared theme.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — footer/header actions (`hlmBtn`).
- `@egose/shadcn-theme-ng/badge` — status pills commonly placed in `hlmCardAction`.
- `@egose/shadcn-theme-ng/calendar` — transparent inside `card-content` by design.
- `@egose/shadcn-theme-ng/input` / `label` — form rows inside `hlmCardContent`.
