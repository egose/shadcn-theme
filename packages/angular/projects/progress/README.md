# Progress (`@egose/shadcn-theme-ng/progress`)

Determinate/indeterminate progress bar (shadcn/ui `progress` equivalent). Thin shadcn styling directives over the spartan-ng `BrnProgress` brain family: `hlm-progress` owns the track + value semantics (`value`, `max`, `getValueLabel`), and the inner `hlmProgressIndicator` bar positions itself from the brain value with RTL awareness and an indeterminate animation state.

Ships as `@egose/shadcn-theme-ng/progress` and `@egose/shadcn-theme-ng-tw/progress` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency; at runtime the indicator also reads Angular CDK `Directionality` for RTL. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmProgress, // directive: hlm-progress,[hlmProgress]
  HlmProgressIndicator, // directive: [hlmProgressIndicator],hlm-progress-indicator
  HlmProgressImports, // readonly [HlmProgress, HlmProgressIndicator]
  HlmProgressModule, // NgModule wrapping HlmProgressImports
} from '@egose/shadcn-theme-ng/progress';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmProgressImports } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <hlm-progress [value]="40" [max]="100">
      <hlm-progress-indicator hlmProgressIndicator />
    </hlm-progress>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmProgressModule } from '@egose/shadcn-theme-ng/progress';

@NgModule({ imports: [HlmProgressModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/progress`. Symbol names are identical.

## Anatomy / Structure

```html
<!-- determinate -->
<hlm-progress [value]="value()" [max]="100">
  <hlm-progress-indicator hlmProgressIndicator />
</hlm-progress>

<!-- attribute-selector form -->
<div hlmProgress [value]="40" [max]="100">
  <div hlmProgressIndicator></div>
</div>

<!-- indeterminate (no value) -->
<hlm-progress>
  <hlm-progress-indicator hlmProgressIndicator />
</hlm-progress>
```

| Class                  | Selector                                        | Role                                                                                |
| ---------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `HlmProgress`          | `hlm-progress,[hlmProgress]`                    | Track (`BrnProgress` host: `value`, `max`, `getValueLabel`); `data-slot="progress"` |
| `HlmProgressIndicator` | `[hlmProgressIndicator],hlm-progress-indicator` | Fill bar (`BrnProgressIndicator` host); `data-slot="progress-indicator"`            |

The indicator computes `translateX(-offset%)` from `100 - value` (defaulting `null`/`undefined` value to `100` for the offset math) and flips the sign in RTL via CDK `Directionality`. When the brain value is `null`/`undefined` it adds the `animate-indeterminate` class instead of a static fill.

## API reference

### `HlmProgress` (`hlm-progress,[hlmProgress]`)

| Member          | Kind                      | Type                          | Notes                                                        |
| --------------- | ------------------------- | ----------------------------- | ------------------------------------------------------------ |
| `value`         | input (via `BrnProgress`) | `number \| null \| undefined` | Current value; `null`/`undefined` → indeterminate            |
| `max`           | input (via `BrnProgress`) | `number`                      | Scale maximum (commonly `100`)                               |
| `getValueLabel` | input (via `BrnProgress`) | `(value, max) => string`      | Accessible value-text factory (see brain docs for signature) |

No shadcn inputs of its own. Track styling: `bg-muted h-1.5 rounded-full relative inline-flex w-full overflow-hidden`.

### `HlmProgressIndicator` (`[hlmProgressIndicator],hlm-progress-indicator`)

No public inputs/outputs/methods. Internals (protected, for understanding only): `_transform` (computed `translateX()`), `_indeterminate` (computed `value == null`). Fill styling: `bg-primary h-full w-full flex-1 transition-all`; indeterminate state toggles `animate-indeterminate`.

## Examples

### 1. Basic determinate bar

```ts
import { Component, signal } from '@angular/core';
import { HlmProgressImports } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-basic',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <hlm-progress [value]="value()" [max]="100">
      <hlm-progress-indicator hlmProgressIndicator />
    </hlm-progress>
    <p class="tw:text-sm tw:text-muted-foreground">{{ value() }}%</p>
    <button type="button" (click)="value.set(Math.min(100, value() + 10))">+10</button>
  `,
})
export class ProgressBasicComponent {
  readonly value = signal(40);
  protected readonly Math = Math;
}
```

### 2. Timer / simulated upload

```ts
import { Component, signal, OnDestroy } from '@angular/core';
import { HlmProgressImports } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-timer',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <hlm-progress [value]="progress()" [max]="100">
      <hlm-progress-indicator hlmProgressIndicator />
    </hlm-progress>
    <div class="tw:flex tw:gap-2">
      <button type="button" (click)="start()">Start</button>
      <button type="button" (click)="reset()">Reset</button>
    </div>
  `,
})
export class ProgressTimerComponent implements OnDestroy {
  readonly progress = signal(0);
  private timer: ReturnType<typeof setInterval> | undefined;

  start(): void {
    this.stop();
    this.timer = setInterval(() => {
      this.progress.update((v) => (v >= 100 ? 100 : v + 2));
      if (this.progress() >= 100) this.stop();
    }, 100);
  }

  reset(): void {
    this.stop();
    this.progress.set(0);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}
```

### 3. Indeterminate (unknown duration)

Omit `value` entirely — the indicator switches to the `animate-indeterminate` treatment.

```ts
import { Component, signal } from '@angular/core';
import { HlmProgressImports } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-indeterminate',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <button type="button" (click)="load()">Fetch report</button>
    @if (loading()) {
      <hlm-progress aria-label="Loading report">
        <hlm-progress-indicator hlmProgressIndicator />
      </hlm-progress>
    }
  `,
})
export class ProgressIndeterminateComponent {
  readonly loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 1500));
    this.loading.set(false);
  }
}
```

### 4. Custom scale (`max !== 100`) + accessible label

```ts
import { Component, signal } from '@angular/core';
import { HlmProgressImports } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-scale',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <hlm-progress [value]="done()" [max]="total()" [getValueLabel]="label" aria-label="Migration progress">
      <hlm-progress-indicator hlmProgressIndicator />
    </hlm-progress>
    <p class="tw:text-sm">{{ done() }} of {{ total() }} rows migrated</p>
  `,
})
export class ProgressScaleComponent {
  readonly done = signal(37);
  readonly total = signal(200);

  readonly label = (value: number | null | undefined, max: number): string => `${value ?? 0} of ${max} rows`;
}
```

> `getValueLabel` is the brain hook for the `aria-valuetext`; keep the visible text in sync (as above) so sighted and SR users agree.

### 5. Multi-step wizard

```ts
import { Component, signal, computed } from '@angular/core';
import { HlmProgressImports } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-steps',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <hlm-progress [value]="step()" [max]="steps.length">
      <hlm-progress-indicator hlmProgressIndicator />
    </hlm-progress>
    <p class="tw:text-sm">Step {{ step() }} of {{ steps.length }}: {{ steps[step() - 1] }}</p>
    <div class="tw:flex tw:gap-2">
      <button type="button" (click)="prev()" [disabled]="step() <= 1">Back</button>
      <button type="button" (click)="next()" [disabled]="step() >= steps.length">Next</button>
    </div>
  `,
})
export class ProgressStepsComponent {
  readonly steps = ['Account', 'Profile', 'Confirm'];
  readonly step = signal(1);

  prev(): void {
    this.step.update((s) => Math.max(1, s - 1));
  }
  next(): void {
    this.step.update((s) => Math.min(this.steps.length, s + 1));
  }
}
```

### 6. Error / complete states and NgModule form

```ts
import { NgModule, Component, signal, computed } from '@angular/core';
import { HlmProgressImports, HlmProgressModule } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-states',
  standalone: true,
  imports: [...HlmProgressImports],
  template: `
    <hlm-progress [value]="value()" [max]="100" [class]="barClass()">
      <hlm-progress-indicator hlmProgressIndicator />
    </hlm-progress>
    <p class="tw:text-sm" [class.tw:text-destructive]="failed()">
      {{ failed() ? 'Upload failed — retrying…' : value() >= 100 ? 'Complete' : 'Uploading…' }}
    </p>
  `,
})
export class ProgressStatesComponent {
  readonly value = signal(75);
  readonly failed = signal(false);
  readonly barClass = computed(() => (this.failed() ? 'tw:[&>[data-slot=progress-indicator]]:tw:bg-destructive' : ''));
}

@NgModule({ imports: [HlmProgressModule] })
export class ProgressLegacyModule {}
```

> There is no `state`/`variant` input — success/error tints are done with plain `class` overrides targeting the indicator (as above), since the indicator carries `data-slot="progress-indicator"`.

## Accessibility notes

- The brain `BrnProgress` exposes `role="progressbar"` with `aria-valuemin`/`max`/`now` (plus `aria-valuetext` via `getValueLabel`) — always provide `aria-label`/`aria-labelledby` unless surrounding text already names the bar.
- Indeterminate bars (no `value`) must still be labelled ("Loading report") so SR users know what is pending; pair with status text or an `aria-live` region for completion.
- Don't use progress as the _only_ conveyor of state — mirror percent/steps in text (examples 1/4/5).
- Color overrides (example 6) are decorative; keep the text label as the source of truth for error/complete states.

## Theming / CSS variables

No theming inputs. Track is `bg-muted`, fill is `bg-primary`; both follow shadcn tokens automatically. Tint the fill per-instance with a `class` override on the track targeting `[data-slot=progress-indicator]`.

## Related subpaths

- `@egose/shadcn-theme-ng/skeleton`, `@egose/shadcn-theme-ng/spinner` — alternative loading indicators (skeleton screens, spinners) vs this determinate bar.
- `@egose/shadcn-theme-ng/sonner` — toast completion notices to pair with a finished upload.
