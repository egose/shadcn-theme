# Accordion (`@egose/shadcn-theme-ng/accordion`)

A collapsible content panel set in the shadcn/ui Accordion style. Each section pairs a clickable
trigger row with an expanding content region, so long option lists, FAQs, and settings groups stay
compact until the user opens them.

The Angular implementation is a thin styling layer over the headless
[`BrnAccordion*` primitives from `@spartan-ng/brain/accordion`](https://www.spartan-ng.com/):
`HlmAccordion` / `HlmAccordionItem` / `HlmAccordionTrigger` / `HlmAccordionContent` compose
`BrnAccordion` / `BrnAccordionItem` / `BrnAccordionTrigger` / `BrnAccordionContent` via
`hostDirectives` (or inheritance for the content), adding shadcn spacing, borders, typography, and
`class` merging through `hlm()` from `@egose/shadcn-theme-ng/utils`. `HlmAccordionIcon` is a
companion directive that styles an `ng-icon` (chevron-down) placed inside a trigger.

> **Ships as:** `@egose/shadcn-theme-ng/accordion` and `@egose/shadcn-theme-ng-tw/accordion`
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
`@egose/shadcn-theme-ng/utils` (`hlm()`), `@egose/shadcn-theme-ng/icon` (`provideHlmIconConfig`),
and `@ng-icons/lucide` (`lucideChevronDown`) for the icon directive.

## Imports

All symbols are exported from the subpath root (`projects/accordion/src/public-api.ts`):

```ts
import {
  HlmAccordion,
  HlmAccordionItem,
  HlmAccordionTrigger,
  HlmAccordionContent,
  HlmAccordionIcon,
  HlmAccordionImports,
  HlmAccordionModule,
} from '@egose/shadcn-theme-ng/accordion';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/accordion'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmAccordionModule } from '@egose/shadcn-theme-ng/accordion';

@NgModule({ imports: [HlmAccordionModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<!-- hlm-accordion OR any element with hlmAccordion -->
<hlm-accordion type="single" orientation="vertical">
  <!-- hlm-accordion-item OR [hlmAccordionItem] OR brn-accordion-item[hlm] -->
  <hlm-accordion-item>
    <!-- any element with hlmAccordionTrigger -->
    <button hlmAccordionTrigger>
      Section title
      <!-- chevron icon (either attribute spelling works) -->
      <ng-icon hlmAccIcon name="lucideChevronDown" />
    </button>
    <!-- content element -->
    <hlm-accordion-content>
      <p>Collapsible body.</p>
    </hlm-accordion-content>
  </hlm-accordion-item>
</hlm-accordion>
```

Real selectors (from source):

| Class                 | Selector(s)                                                       | Kind      |
| --------------------- | ----------------------------------------------------------------- | --------- |
| `HlmAccordion`        | `[hlmAccordion], hlm-accordion`                                   | Directive |
| `HlmAccordionItem`    | `[hlmAccordionItem], brn-accordion-item[hlm], hlm-accordion-item` | Directive |
| `HlmAccordionTrigger` | `[hlmAccordionTrigger]`                                           | Directive |
| `HlmAccordionContent` | `hlm-accordion-content`                                           | Component |
| `HlmAccordionIcon`    | `ng-icon[egAccordionIcon], ng-icon[hlmAccIcon]`                   | Directive |

## API reference

### `HlmAccordion` — `[hlmAccordion], hlm-accordion`

Thin directive wrapper around `BrnAccordion` (inputs forwarded via `hostDirectives`).

| Input         | Type                        | Default         | Description                                                                 |
| ------------- | --------------------------- | --------------- | --------------------------------------------------------------------------- |
| `type`        | forwarded to `BrnAccordion` | (brain default) | `'single'` or `'multiple'` open-item behavior.                              |
| `orientation` | forwarded to `BrnAccordion` | (brain default) | `'horizontal'` renders the root as `flex-row`, anything else as `flex-col`. |
| `class`       | `ClassValue`                | `''`            | Extra classes merged via `hlm()`.                                           |

### `HlmAccordionItem` — `[hlmAccordionItem], brn-accordion-item[hlm], hlm-accordion-item`

Thin wrapper around `BrnAccordionItem`.

| Input      | Type                            | Default | Description                               |
| ---------- | ------------------------------- | ------- | ----------------------------------------- |
| `isOpened` | forwarded to `BrnAccordionItem` | —       | Whether this item starts/sets open state. |
| `class`    | `ClassValue`                    | `''`    | Extra classes merged via `hlm()`.         |

### `HlmAccordionTrigger` — `[hlmAccordionTrigger]`

Thin wrapper around `BrnAccordionTrigger` (no extra inputs — the whole `BrnAccordionTrigger`
surface is inherited through `hostDirectives`).

| Input   | Type         | Default | Description                       |
| ------- | ------------ | ------- | --------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged via `hlm()`. |

### `HlmAccordionContent` — `hlm-accordion-content`

Component **extending** `BrnAccordionContent`, so the `state()` signal (`'open' | 'closed'`) and
all brain behavior are inherited. The open state switches the host between
`grid-rows-[1fr]` and `hidden`; an inner `div[attr.inert]` keeps closed content out of the
tab order.

| Input   | Type         | Default | Description                       |
| ------- | ------------ | ------- | --------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged via `hlm()`. |

### `HlmAccordionIcon` — `ng-icon[egAccordionIcon], ng-icon[hlmAccIcon]`

Styling directive for the chevron `ng-icon` inside a trigger. It registers
`provideIcons({ lucideChevronDown })` and `provideHlmIconConfig({ size: 'sm' })`, and applies the
muted, small, animated sizing classes.

| Input   | Type         | Default | Description                       |
| ------- | ------------ | ------- | --------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged via `hlm()`. |

> **Selector quirk (read from source):** the trigger stylesheet contains a
> `[&[data-state=open]>[egAccIcon]]:rotate-180` rule, but the icon directive itself matches
> `egAccordionIcon` / `hlmAccIcon`. If you want the chevron to rotate automatically on open, add a
> plain `egAccIcon` attribute to the icon element alongside the directive attribute
> (see the rotation example below).

## Examples

### 1. Basic single accordion

```ts
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-accordion-basic',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `
    <hlm-accordion type="single">
      <hlm-accordion-item>
        <button hlmAccordionTrigger>
          Is it accessible?
          <ng-icon hlmAccIcon name="lucideChevronDown" />
        </button>
        <hlm-accordion-content>
          <p>Yes. Triggers are real buttons and closed panels are inert.</p>
        </hlm-accordion-content>
      </hlm-accordion-item>
      <hlm-accordion-item>
        <button hlmAccordionTrigger>
          Is it styled?
          <ng-icon hlmAccIcon name="lucideChevronDown" />
        </button>
        <hlm-accordion-content>
          <p>Yes. It follows the shadcn/ui accordion look.</p>
        </hlm-accordion-content>
      </hlm-accordion-item>
    </hlm-accordion>
  `,
})
export class AccordionBasicComponent {}
```

```html
<app-accordion-basic />
```

### 2. Multiple open panels + attribute selectors on native elements

`HlmAccordion` also works as an attribute on a `div`, and items accept the long
`brn-accordion-item[hlm]` spelling for interop with raw brain templates.

```ts
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-accordion-multiple',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `
    <div hlmAccordion type="multiple">
      <div hlmAccordionItem>
        <button hlmAccordionTrigger>
          Shipping
          <ng-icon egAccordionIcon name="lucideChevronDown" />
        </button>
        <hlm-accordion-content><p>Ships worldwide.</p></hlm-accordion-content>
      </div>
      <div hlmAccordionItem>
        <button hlmAccordionTrigger>
          Returns
          <ng-icon egAccordionIcon name="lucideChevronDown" />
        </button>
        <hlm-accordion-content><p>30-day returns.</p></hlm-accordion-content>
      </div>
    </div>
  `,
})
export class AccordionMultipleComponent {}
```

### 3. Pre-opened item via `isOpened`

```ts
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-accordion-open',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `
    <hlm-accordion type="single">
      <hlm-accordion-item [isOpened]="true">
        <button hlmAccordionTrigger>
          Open by default
          <ng-icon hlmAccIcon name="lucideChevronDown" />
        </button>
        <hlm-accordion-content>
          <p>This panel renders expanded on first paint.</p>
        </hlm-accordion-content>
      </hlm-accordion-item>
      <hlm-accordion-item>
        <button hlmAccordionTrigger>
          Closed by default
          <ng-icon hlmAccIcon name="lucideChevronDown" />
        </button>
        <hlm-accordion-content><p>Opens on click.</p></hlm-accordion-content>
      </hlm-accordion-item>
    </hlm-accordion>
  `,
})
export class AccordionOpenComponent {}
```

### 4. Chevron that rotates on open

The stylesheet rotates a child carrying a bare `egAccIcon` attribute when the trigger reports
`data-state="open"`. Combine it with the icon directive so you keep both the sizing and the
rotation:

```ts
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-accordion-rotate',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `
    <hlm-accordion type="single">
      @for (faq of faqs; track faq.q) {
        <hlm-accordion-item>
          <button hlmAccordionTrigger>
            {{ faq.q }}
            <ng-icon hlmAccIcon egAccIcon name="lucideChevronDown" />
          </button>
          <hlm-accordion-content>
            <p>{{ faq.a }}</p>
          </hlm-accordion-content>
        </hlm-accordion-item>
      }
    </hlm-accordion>
  `,
})
export class AccordionRotateComponent {
  readonly faqs = [
    { q: 'What is shadcn?', a: 'A set of re-usable UI patterns.' },
    { q: 'What is spartan-ng?', a: 'Headless Angular primitives (brain) plus styled (helm) components.' },
  ];
}
```

### 5. Data-driven FAQ with custom classes

Every piece accepts a `class` input merged through `hlm()`, so per-item tweaks compose cleanly:

```ts
import { Component, signal } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-accordion-faq',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `
    <hlm-accordion type="single" class="tw:rounded-lg tw:border tw:px-4">
      @for (faq of faqs(); track faq.q) {
        <hlm-accordion-item class="tw:last:border-b-0">
          <button hlmAccordionTrigger class="tw:text-base">
            {{ faq.q }}
            <ng-icon hlmAccIcon name="lucideChevronDown" />
          </button>
          <hlm-accordion-content class="tw:text-muted-foreground">
            <p>{{ faq.a }}</p>
            @if (faq.link) {
              <a class="tw:underline" [href]="faq.link">Learn more</a>
            }
          </hlm-accordion-content>
        </hlm-accordion-item>
      }
    </hlm-accordion>
  `,
})
export class AccordionFaqComponent {
  readonly faqs = signal([
    { q: 'How do I install?', a: 'npm install @egose/shadcn-theme-ng', link: '' },
    { q: 'Which Tailwind setup?', a: 'Pick the plain or tw: variant.', link: '' },
  ]);
}
```

### 6. Horizontal orientation

`HlmAccordion` reads the brain `orientation()` signal: `'horizontal'` switches the root to
`flex-row`, anything else stays `flex-col`.

```ts
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@egose/shadcn-theme-ng/accordion';

@Component({
  selector: 'app-accordion-horizontal',
  standalone: true,
  imports: [...HlmAccordionImports],
  template: `
    <hlm-accordion type="multiple" orientation="horizontal" class="tw:gap-2">
      <hlm-accordion-item class="tw:border tw:rounded-md tw:px-3">
        <button hlmAccordionTrigger>A <ng-icon hlmAccIcon name="lucideChevronDown" /></button>
        <hlm-accordion-content><p>First column.</p></hlm-accordion-content>
      </hlm-accordion-item>
      <hlm-accordion-item class="tw:border tw:rounded-md tw:px-3">
        <button hlmAccordionTrigger>B <ng-icon hlmAccIcon name="lucideChevronDown" /></button>
        <hlm-accordion-content><p>Second column.</p></hlm-accordion-content>
      </hlm-accordion-item>
    </hlm-accordion>
  `,
})
export class AccordionHorizontalComponent {}
```

## Accessibility notes

- Triggers are native `<button>` elements enhanced by `BrnAccordionTrigger`: keyboard focus,
  `Enter`/`Space` activation, and arrow-key navigation between items come from the brain primitive.
- `HlmAccordionContent` marks its inner wrapper `inert` while closed so hidden content is removed
  from the tab order and assistive-technology traversal.
- The icon is decorative (`pointer-events-none`); keep the trigger label as real text so screen
  readers announce the section name. If you add `sr-only` helper text, put it inside the trigger,
  not the icon.
- `HlmAccordionIcon` sets the icon size through `provideHlmIconConfig({ size: 'sm' })` — overriding
  the global icon config locally, so surrounding icons are unaffected.

## Theming / CSS variables

Styling is class-based (`hlm()` + Tailwind tokens such as `border-border`, `text-muted-foreground`,
`ring-ring/50`); no component-specific CSS variables are declared. Pass `class` to any piece to
extend the look, and configure the shadcn theme tokens globally as described in the
[package README](../../README.md).

## Related subpaths

- `@egose/shadcn-theme-ng/icon` — `provideHlmIconConfig`, `HlmIcon` (icon sizing used by the trigger icon)
- `@egose/shadcn-theme-ng/collapsible` — single-region expand/collapse primitive
- `@egose/shadcn-theme-ng/separator` — dividers between accordion items
- `@egose/shadcn-theme-ng/typography` — prose styling for rich accordion bodies
