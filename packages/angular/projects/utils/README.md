# Utils (`@egose/shadcn-theme-ng/utils`)

Shared styling and setup helpers used by every component in this library — equivalent to the `cn()`/`lib/utils` module in [shadcn/ui](https://ui.shadcn.com/docs/installation). This subpath exports **`hlm()`** (the `clsx` + `tailwind-merge` class merger), **`classes()`** (the reactive host-class manager behind every `hlm*` directive), and **`provideSpartanHlm()`** (the app-level overlay provider). It has no components and no `*Imports`/`*Module` — import the functions directly. Notably, `classes()` is SSR-safe (no `MutationObserver` on the server), transition-flash-safe (suppresses CSS transitions on first apply), and teardown-safe (disconnects observers / cancels animation frames via `DestroyRef`).

> **Ships as:** `@egose/shadcn-theme-ng/utils` and `@egose/shadcn-theme-ng-tw/utils` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`clsx` and `tailwind-merge` arrive transitively. See the [package README](../../README.md) for the full peer-dependency table.

Register the environment provider once at bootstrap (required for overlay-based components):

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideSpartanHlm } from '@egose/shadcn-theme-ng/utils';

export const appConfig: ApplicationConfig = {
  providers: [provideSpartanHlm()],
};
```

## Imports

All public symbols are re-exported from `projects/utils/src/public-api.ts` (`./lib/utils` + `./lib/provide-spartan-hlm`):

```ts
import { classes, hlm, provideSpartanHlm } from '@egose/shadcn-theme-ng/utils';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/utils'
```

| Symbol              | Kind     | Signature (real)                                                                  | Description                                                  |
| ------------------- | -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `hlm`               | Function | `hlm(...inputs: ClassValue[]): string`                                            | Merges class lists (`twMerge(clsx(inputs))`).                |
| `classes`           | Function | `classes(computed: () => ClassValue[] \| string, options?: ClassesOptions): void` | Reactively applies computed classes to the host element.     |
| `provideSpartanHlm` | Function | `provideSpartanHlm(): EnvironmentProviders`                                       | Provides `OVERLAY_DEFAULT_CONFIG` (`{ usePopover: false }`). |

`ClassesOptions` (interface, not exported from the barrel — structural shape):

```ts
interface ClassesOptions {
  elementRef?: ElementRef<HTMLElement>;
  injector?: Injector;
}
```

There is no `UtilsImports` / `UtilsModule` — nothing to add to `imports: [...]`.

## Anatomy / Structure

```ts
// 1. One-off merge (templates, custom components)
import { hlm } from '@egose/shadcn-theme-ng/utils';
const cls = hlm('px-4 py-2', condition && 'bg-primary', userClass);

// 2. Reactive host styling (directives/components)
import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({ selector: '[myStyled]' })
export class MyStyled {
  constructor() {
    classes(() => 'rounded-md border bg-background');
  }
}

// 3. App bootstrap (once)
import { provideSpartanHlm } from '@egose/shadcn-theme-ng/utils';
export const appConfig: ApplicationConfig = { providers: [provideSpartanHlm()] };
```

## API reference

### `hlm(...inputs: ClassValue[]): string`

Merges any `clsx`-compatible inputs (`string | string[] | Record<string, boolean> | false | null | undefined`, nested) and resolves Tailwind conflicts with `twMerge`. Later arguments win on conflict.

| Call                                                    | Result                       |
| ------------------------------------------------------- | ---------------------------- |
| `hlm('px-2 px-4')`                                      | `'px-4'` (conflict resolved) |
| `hlm('text-sm', isActive && 'text-primary', userClass)` | conditional merge            |
| `hlm(['rounded', { 'bg-muted': selected }])`            | array/object forms           |

Backed by `clsx` + `tailwind-merge`; string inputs are cached (up to 1000 entries) internally.

### `classes(computed, options?): void`

Runs in an injection context (`runInInjectionContext`) and wires the host element to a reactive class computation. Must be called in a constructor (or any injection context) of a directive/component.

- `computed: () => ClassValue[] | string` — re-evaluated in an `effect()`; any signals read inside are tracked, so class updates are automatic.
- `options.elementRef?: ElementRef<HTMLElement>` — defaults to the injected host `ElementRef`. Pass explicitly for out-of-band elements (tests, portals, iframes).
- `options.injector?: Injector` — defaults to the current injector. Pass explicitly when calling outside the construction context (e.g. per-document setup in tests).

Behavioral guarantees (verified by `utils.spec.ts`):

- Base-class preservation: pre-existing `class` attribute values and externally added classes are kept and re-merged (not wiped) via a per-document `MutationObserver`.
- Scoped observation: one shared observer per `Document` (isolated per iframe document); unrelated elements never trigger callbacks.
- Transition suppression: CSS `transition` is forced to `none !important` on first apply, then restored on the next animation frame — prevents initial style flashes.
- Teardown: `DestroyRef.onDestroy` removes the source, cancels pending RAFs, restores transitions, disconnects the observer when the last managed element is destroyed, and cleans per-document state.
- SSR-safe: no `MutationObserver` is created when `PLATFORM_ID` is `'server'`.

### `provideSpartanHlm(): EnvironmentProviders`

```ts
export function provideSpartanHlm(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } }]);
}
```

Call once in `appConfig.providers`. Forces CDK overlays (tooltip, popover, dropdown, dialog, …) to use the classic overlay strategy instead of the native `popover` API.

## Examples

### 1. `hlm()` — conditional class merging

```ts
// demo-merge.component.ts
import { Component, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'demo-merge',
  standalone: true,
  template: `<div [class]="cls()">Hello</div>`,
})
export class DemoMerge {
  readonly active = input(false);
  readonly userClass = input<string>('', { alias: 'class' });

  protected cls() {
    return hlm(
      'rounded-md border px-4 py-2 text-sm',
      this.active() && 'border-primary bg-primary/10',
      this.userClass(),
    );
  }
}
```

```html
<demo-merge [active]="true" class="shadow-lg" />
<!-- later utilities win: hlm('px-2 px-4') === 'px-4' -->
```

### 2. `hlm()` — object / array forms

```ts
import { hlm } from '@egose/shadcn-theme-ng/utils';

const cls = hlm(
  ['inline-flex items-center gap-2', 'rounded-md'],
  { 'bg-primary text-primary-foreground': true, 'opacity-50': false },
  null,
  undefined,
);
```

### 3. `classes()` — custom styled directive (signal-reactive)

```ts
// status-dot.directive.ts
import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({ selector: '[statusDot]' })
export class StatusDot {
  readonly tone = input<'ok' | 'warn' | 'bad'>('ok');

  constructor() {
    classes(() => [
      'inline-block size-2 rounded-full',
      this.tone() === 'ok' && 'bg-emerald-500',
      this.tone() === 'warn' && 'bg-amber-500',
      this.tone() === 'bad' && 'bg-destructive',
    ]);
  }
}
```

```ts
// usage
import { Component } from '@angular/core';

@Component({
  selector: 'demo-dot',
  standalone: true,
  imports: [StatusDot],
  template: `
    <span statusDot tone="ok"></span>
    <span statusDot tone="bad" class="ml-2"></span>
  `,
})
export class DemoDot {}
```

The trailing `class="ml-2"` is preserved — `classes()` merges base classes instead of overwriting them.

### 4. `classes()` — variant-driven component (cva + signals)

```ts
// pill.component.ts
import { Component, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const pillVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: { tone: { default: 'bg-muted', brand: 'bg-primary text-primary-foreground' } },
  defaultVariants: { tone: 'default' },
});
export type PillTones = VariantProps<typeof pillVariants>;

@Component({
  selector: 'demo-pill',
  standalone: true,
  template: `<ng-content />`,
})
export class DemoPill {
  readonly tone = input<PillTones['tone']>('default');

  constructor() {
    classes(() => pillVariants({ tone: this.tone() }));
  }
}
```

### 5. `provideSpartanHlm()` — app bootstrap + overlay consumers

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideSpartanHlm } from '@egose/shadcn-theme-ng/utils';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideSpartanHlm()],
};
```

Any overlay component (tooltip, popover, dropdown-menu, dialog, hover-card, …) then uses the supported overlay strategy without per-component configuration:

```ts
// demo-overlay.component.ts
import { Component } from '@angular/core';
import { HlmTooltipImports } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-overlay',
  standalone: true,
  imports: [...HlmTooltipImports, ...HlmButtonImports],
  template: `<button hlmBtn [hlmTooltip]="'Overlay-styled hint'">Hover</button>`,
})
export class DemoOverlay {}
```

### 6. Advanced: explicit `elementRef` / multi-document usage

```ts
// managed-element.service.ts (e.g. portals, iframes, tests)
import { DOCUMENT, Injectable, inject, Injector, ElementRef } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Injectable({ providedIn: 'root' })
export class ManagedElementService {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  styleDetached(element: HTMLElement, extra: string) {
    // Drives classes on an element outside the current host,
    // tracked against this injector's DestroyRef lifecycle.
    classes(() => ['rounded-md border', extra], {
      elementRef: new ElementRef(element),
      injector: this.injector,
    });
  }
}
```

Per-document observer isolation means elements in different `Document`s (iframes) each get their own observer lifecycle — destroying the injector disconnects only its own document's observer.

## Accessibility notes

- `hlm()`/`classes()` are styling-only — they confer no semantics. Pair visual treatments with real roles, labels, and focus management from the component subpaths.
- When toggling state classes (e.g. `bg-destructive` for errors), always also surface a text cue (`hlm-error`, `aria-invalid`, `aria-describedby`) — color alone is not perceivable.
- Transition suppression in `classes()` avoids first-paint flashes but does not disable motion for users with `prefers-reduced-motion` — respect that media query in your own animation utilities.

## Theming / CSS variables

No theme of its own — `hlm()`/`classes()` are token-agnostic mergers. They resolve whatever utilities you pass (including shadcn theme tokens like `bg-background`, `text-muted-foreground`, `border-input`), so output follows your configured theme automatically.

## Related subpaths

- Every component subpath (`button`, `dialog`, `table`, …) — all consume `hlm()`/`classes()` internally; import this subpath when building custom shadcn-styled directives.
- `@egose/shadcn-theme-ng/tooltip` — example consumer of `hlm()` for arrow/content classes (`tooltipPositionVariants`).
- `@egose/shadcn-theme-ng/toggle` / `@egose/shadcn-theme-ng/toggle-group` — example consumers of the cva + `classes()` pattern.
- `@egose/shadcn-theme-ng/typography` — example consumer re-exporting class constants composed with `hlm()`.
