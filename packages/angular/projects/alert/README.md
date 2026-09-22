# Alert (`@egose/shadcn-theme-ng/alert`)

A non-modal status banner in the shadcn/ui Alert style: an icon, a title, and a description
arranged in a bordered, tone-colored box. Use it for inline feedback (success confirmations,
warnings, informational hints) that stays visible in the page flow.

This is a **pure styling layer — no brain primitive underneath**. `HlmAlert` and its pieces are
plain attribute directives that compute shadcn classes with `cva` + `hlm()` from
`@egose/shadcn-theme-ng/utils`. The host gets `role="alert"` automatically. `HlmAlertIcon` only
applies the `sm` icon-size config (`provideHlmIconConfig`); pair it with an `ng-icon`.

> **Ships as:** `@egose/shadcn-theme-ng/alert` and `@egose/shadcn-theme-ng-tw/alert`
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
`@egose/shadcn-theme-ng/utils` (`hlm()`) and `@egose/shadcn-theme-ng/icon`
(`provideHlmIconConfig`).

## Imports

All symbols are exported from the subpath root (`projects/alert/src/public-api.ts`):

```ts
import {
  HlmAlert,
  HlmAlertTitle,
  HlmAlertDescription,
  HlmAlertIcon,
  HlmAlertImports,
  HlmAlertModule,
  type AlertVariants,
  type VariantType,
  type AppearanceType,
} from '@egose/shadcn-theme-ng/alert';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/alert'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmAlertImports } from '@egose/shadcn-theme-ng/alert';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmAlertImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmAlertModule } from '@egose/shadcn-theme-ng/alert';

@NgModule({ imports: [HlmAlertModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<div hlmAlert variant="info" appearance="solid">
  <ng-icon hlm hlmAlertIcon name="lucideInfo" />
  <h4 hlmAlertTitle>Heads up</h4>
  <p hlmAlertDescription>Detail text goes here.</p>
</div>
```

Real selectors (from source):

| Class                 | Selector(s)                             | Kind      |
| --------------------- | --------------------------------------- | --------- |
| `HlmAlert`            | `[hlmAlert]`                            | Directive |
| `HlmAlertTitle`       | `[hlmAlertTitle]`                       | Directive |
| `HlmAlertDescription` | `[hlmAlertDesc], [hlmAlertDescription]` | Directive |
| `HlmAlertIcon`        | `[hlmAlertIcon]`                        | Directive |

When an `[hlmAlertIcon]` child is present, the host switches to a two-column grid
(`grid-cols-[calc(theme(spacing.1)*4)_1fr]`) with the title/description placed in column 2 —
no extra markup needed.

## API reference

### `HlmAlert` — `[hlmAlert]`

| Input        | Type                                   | Default     | Description                                                      |
| ------------ | -------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `variant`    | `AlertVariants['variant']` (see below) | `'primary'` | Color tone.                                                      |
| `appearance` | `AlertVariants['appearance']`          | `'solid'`   | `'solid'` (saturated fill) or `'light'` (tinted `bg-*/20` fill). |
| `class`      | `ClassValue`                           | `''`        | Extra classes merged via `hlm()`.                                |

`variant` values: `primary` · `secondary` · `success` · `warning` · `danger` · `info` ·
`light` · `dark` · `accent` · `destructive` · `muted` · `link` · `ghost`.

`appearance` values: `solid` · `light`. Every `variant × light` pair has a dedicated
`compoundVariants` entry (e.g. `warning + light` → `bg-warning/20 text-warning`).

Exported helper types: `AlertVariants` (`VariantProps<typeof alertVariants>`), `VariantType`,
`AppearanceType`.

### `HlmAlertTitle` — `[hlmAlertTitle]`

| Input   | Type         | Default | Description                       |
| ------- | ------------ | ------- | --------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged via `hlm()`. |

Renders semibold, tracking-tight, single-line-clamped title text in grid column 2.

### `HlmAlertDescription` — `[hlmAlertDesc], [hlmAlertDescription]`

| Input   | Type         | Default | Description                       |
| ------- | ------------ | ------- | --------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged via `hlm()`. |

Small relaxed-leading body text in grid column 2. Both selector spellings are equivalent.

### `HlmAlertIcon` — `[hlmAlertIcon]`

Size-only directive: provides `provideHlmIconConfig({ size: 'sm' })` so the decorated `ng-icon`
renders small. It declares **no inputs** and adds no classes of its own — the parent `HlmAlert`
stylesheet sizes/positions it (`size-4`, `translate-y-0.5`, `text-current`).

## Examples

### 1. Basic alert with icon, title, and description

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmAlertImports } from '@egose/shadcn-theme-ng/alert';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-alert-basic',
  standalone: true,
  imports: [...HlmAlertImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideInfo })],
  template: `
    <div hlmAlert variant="info">
      <ng-icon hlm hlmAlertIcon name="lucideInfo" />
      <h4 hlmAlertTitle>Heads up</h4>
      <p hlmAlertDescription>Your trial ends in 3 days. Upgrade to keep your data.</p>
    </div>
  `,
})
export class AlertBasicComponent {}
```

```html
<app-alert-basic />
```

### 2. All variants (solid)

```ts
import { Component } from '@angular/core';
import { HlmAlertImports, type VariantType } from '@egose/shadcn-theme-ng/alert';

@Component({
  selector: 'app-alert-variants',
  standalone: true,
  imports: [...HlmAlertImports],
  template: `
    @for (v of variants; track v) {
      <div hlmAlert [variant]="v" class="tw:mb-3">
        <h4 hlmAlertTitle class="tw:capitalize">{{ v }}</h4>
        <p hlmAlertDescription>This is the {{ v }} tone in solid appearance.</p>
      </div>
    }
  `,
})
export class AlertVariantsComponent {
  readonly variants: VariantType[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
    'accent',
    'destructive',
    'muted',
    'link',
    'ghost',
  ];
}
```

### 3. Light appearance + semantic states

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleAlert, lucideInfo } from '@ng-icons/lucide';
import { HlmAlertImports } from '@egose/shadcn-theme-ng/alert';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-alert-states',
  standalone: true,
  imports: [...HlmAlertImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideCircleCheck, lucideCircleAlert, lucideInfo })],
  template: `
    <div hlmAlert variant="success" appearance="light" class="tw:mb-3">
      <ng-icon hlm hlmAlertIcon name="lucideCircleCheck" />
      <h4 hlmAlertTitle>Payment confirmed</h4>
      <p hlmAlertDescription>Receipt #INV-2041 was emailed to you.</p>
    </div>
    <div hlmAlert variant="warning" appearance="light" class="tw:mb-3">
      <ng-icon hlm hlmAlertIcon name="lucideCircleAlert" />
      <h4 hlmAlertTitle>Storage almost full</h4>
      <p hlmAlertDescription>You have used 9.2 of 10 GB.</p>
    </div>
    <div hlmAlert variant="destructive" appearance="light">
      <ng-icon hlm hlmAlertIcon name="lucideCircleAlert" />
      <h4 hlmAlertTitle>Deployment failed</h4>
      <p hlmAlertDescription>Unit tests failed on step 4. See the logs.</p>
    </div>
  `,
})
export class AlertStatesComponent {}
```

### 4. Conditional alert driven by a signal (form error pattern)

```ts
import { Component, computed, signal } from '@angular/core';
import { HlmAlertImports, type VariantType } from '@egose/shadcn-theme-ng/alert';

@Component({
  selector: 'app-alert-conditional',
  standalone: true,
  imports: [...HlmAlertImports],
  template: `
    @if (tone(); as t) {
      <div hlmAlert [variant]="t">
        <h4 hlmAlertTitle>{{ title() }}</h4>
        <p hlmAlertDescription>{{ message() }}</p>
      </div>
    }
    <div class="tw:mt-3 tw:flex tw:gap-2">
      <button (click)="show('success')">Succeed</button>
      <button (click)="show('destructive')">Fail</button>
      <button (click)="clear()">Clear</button>
    </div>
  `,
})
export class AlertConditionalComponent {
  private readonly _tone = signal<VariantType | null>(null);
  readonly tone = this._tone.asReadonly();
  readonly title = computed(() => (this._tone() === 'success' ? 'Saved' : 'Something went wrong'));
  readonly message = computed(() =>
    this._tone() === 'success' ? 'Your changes were saved.' : 'Please fix the highlighted fields.',
  );

  show(t: VariantType) {
    this._tone.set(t);
  }
  clear() {
    this._tone.set(null);
  }
}
```

### 5. Title-only and description-only compositions

The title and description are independent directives — use either alone:

```ts
import { Component } from '@angular/core';
import { HlmAlertImports } from '@egose/shadcn-theme-ng/alert';

@Component({
  selector: 'app-alert-minimal',
  standalone: true,
  imports: [...HlmAlertImports],
  template: `
    <!-- title only -->
    <div hlmAlert variant="muted" class="tw:mb-3">
      <h4 hlmAlertTitle>Maintenance window: Sunday 02:00–04:00 UTC</h4>
    </div>
    <!-- description only, short spelling -->
    <div hlmAlert variant="ghost">
      <p hlmAlertDesc>Cookies help us improve. No action required.</p>
    </div>
  `,
})
export class AlertMinimalComponent {}
```

### 6. Dismissible alert + composition with a button

```ts
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideX } from '@ng-icons/lucide';
import { HlmAlertImports } from '@egose/shadcn-theme-ng/alert';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-alert-dismissible',
  standalone: true,
  imports: [...HlmAlertImports, ...HlmButtonImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideInfo, lucideX })],
  template: `
    @if (visible()) {
      <div hlmAlert variant="info" class="tw:relative tw:pr-12">
        <ng-icon hlm hlmAlertIcon name="lucideInfo" />
        <h4 hlmAlertTitle>New version available</h4>
        <p hlmAlertDescription>Restart the app to apply v2.4.1.</p>
        <button
          hlmBtn
          variant="ghost"
          size="icon-sm"
          class="tw:absolute tw:top-2 tw:right-2"
          (click)="visible.set(false)"
          aria-label="Dismiss"
        >
          <ng-icon hlm name="lucideX" size="sm" />
        </button>
      </div>
    }
  `,
})
export class AlertDismissibleComponent {
  readonly visible = signal(true);
}
```

## Accessibility notes

- The host carries `role="alert"`, so assistive technology announces content injected dynamically
  (e.g. after a failed save). For purely decorative/informational banners that should not
  interrupt, prefer `variant="muted"` copy and consider whether a `role="status"` wrapper of your
  own is more appropriate — the role is baked into the directive and cannot be switched off.
- Keep the title short and the description actionable; screen readers read both in DOM order
  (icon → title → description).
- Do not put interactive controls other than a dismiss button inside an `role="alert"` region;
  links and buttons inside the description are allowed but keep them minimal.

## Theming / CSS variables

Class-based theming via `cva` variants (`bg-*/text-*` tokens); no component-specific CSS variables.
Extend with `class` on any piece. The `link` and `ghost` variants are intentionally low-chrome for
embedding alerts in prose or cards.

## Related subpaths

- `@egose/shadcn-theme-ng/basic-alert` — ready-made `EgBasicAlert` (icon + title + description in one tag)
- `@egose/shadcn-theme-ng/badge` — inline status chips for compact labeling
- `@egose/shadcn-theme-ng/button` — dismiss/action buttons inside alerts
- `@egose/shadcn-theme-ng/icon` — `HlmIcon` sizing and `provideHlmIconConfig`
