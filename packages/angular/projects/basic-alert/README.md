# Basic Alert (`@egose/shadcn-theme-ng/basic-alert`)

A one-tag convenience alert in the shadcn/ui Alert style: icon + title + description with zero
composition boilerplate. Where `@egose/shadcn-theme-ng/alert` asks you to assemble `HlmAlert` /
`HlmAlertIcon` / `HlmAlertTitle` / `HlmAlertDescription` by hand, `EgBasicAlert` takes `variant`,
`appearance`, `title`, and `description` inputs and renders the whole banner — picking a matching
Lucide icon per tone automatically.

This is a **standalone component with no `*Imports`/`*Module` wrapper** — import `EgBasicAlert`
itself. Internally it composes the `alert` subpath directives plus `NgIcon`/`HlmIcon`, and maps
each `VariantType` to an icon name through its `getIconName()` method.

> **Ships as:** `@egose/shadcn-theme-ng/basic-alert` and `@egose/shadcn-theme-ng-tw/basic-alert`
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
[package README](../../README.md#peer-dependencies). This subpath depends at runtime on
`@egose/shadcn-theme-ng/alert` (`HlmAlert*`, `VariantType`, `AppearanceType`),
`@egose/shadcn-theme-ng/icon` (`HlmIcon`), and `@ng-icons/lucide` for its icon set.

## Imports

`EgBasicAlert` is exported from the subpath root (`projects/basic-alert/src/public-api.ts`). Note
there is **no** `EgBasicAlertImports` array and **no** `*Module` — import the component directly:

```ts
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/basic-alert'
```

Standalone component usage:

```ts
import { Component } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [EgBasicAlert],
  template: `<eg-basic-alert variant="info" title="Heads up" description="..." />`,
})
export class DemoComponent {}
```

NgModule-based consumer — list the component in the module imports (it is standalone):

```ts
import { NgModule } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@NgModule({ imports: [EgBasicAlert] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<eg-basic-alert variant="success" appearance="solid" title="Saved" description="All changes stored." />
```

Real selector (from source):

| Class          | Selector         | Kind      |
| -------------- | ---------------- | --------- |
| `EgBasicAlert` | `eg-basic-alert` | Component |

Its internal template (from source) is:

```html
<div hlmAlert [variant]="variant()" [appearance]="appearance()" class="">
  <ng-icon hlm hlmAlertIcon [name]="getIconName(variant())" />
  <h4 hlmAlertTitle class="tw:capitalize">{{ title() }}</h4>
  <p hlmAlertDescription>{{ description() }}</p>
</div>
```

So the rendered output is a standard `HlmAlert` banner whose title is auto-capitalized
(`tw:capitalize`) and whose icon is chosen by `getIconName(variant())`.

## API reference

### `EgBasicAlert` — `eg-basic-alert`

| Input         | Type                                            | Default   | Description                                       |
| ------------- | ----------------------------------------------- | --------- | ------------------------------------------------- |
| `variant`     | `VariantType` (re-exported from `.../alert`)    | `'info'`  | Color tone; also selects the icon (see table).    |
| `appearance`  | `AppearanceType` (re-exported from `.../alert`) | `'solid'` | `'solid'` or `'light'` — forwarded to `HlmAlert`. |
| `title`       | `string`                                        | `''`      | Banner heading (rendered capitalized).            |
| `description` | `string`                                        | `''`      | Banner body text.                                 |

| Method        | Signature                                   | Description                                                                                                              |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `getIconName` | `getIconName(variant: VariantType): string` | Returns the `ng-icon` name for a tone. Public — call it in your own templates to keep custom alerts visually consistent. |

Variant → icon mapping (read from `getIconName` source):

| `variant`                      | Icon                   |
| ------------------------------ | ---------------------- |
| `success`                      | `lucideCircleCheck`    |
| `info`                         | `lucideInfo`           |
| `warning`                      | `lucideBatteryWarning` |
| `danger`, `destructive`        | `lucideCircleAlert`    |
| `muted`                        | `lucideBell`           |
| `accent`                       | `lucideStar`           |
| `primary`                      | `lucideThumbsUp`       |
| `secondary`                    | `lucideZap`            |
| `link`                         | `lucideLink`           |
| `ghost`                        | `lucideGhost`          |
| `light`, `dark`, anything else | `lucideInfo` (default) |

`VariantType` values (from `.../alert`): `primary` · `secondary` · `success` · `warning` ·
`danger` · `info` · `light` · `dark` · `accent` · `destructive` · `muted` · `link` · `ghost`.

## Examples

### 1. Basic usage

```ts
import { Component } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-basic',
  standalone: true,
  imports: [EgBasicAlert],
  template: `
    <eg-basic-alert
      variant="info"
      title="Maintenance scheduled"
      description="The dashboard will be offline Sunday 02:00–04:00 UTC."
    />
  `,
})
export class BasicAlertBasicComponent {}
```

```html
<app-basic-alert-basic />
```

### 2. Semantic tones (success / warning / danger)

```ts
import { Component } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-tones',
  standalone: true,
  imports: [EgBasicAlert],
  template: `
    <eg-basic-alert variant="success" title="Payment confirmed" description="Receipt emailed." class="tw:mb-3" />
    <eg-basic-alert variant="warning" title="Storage almost full" description="9.2 of 10 GB used." class="tw:mb-3" />
    <eg-basic-alert variant="danger" title="Sync failed" description="Retrying in 30 seconds." />
  `,
})
export class BasicAlertTonesComponent {}
```

(`class` on the host works because every Angular component host accepts a `class` attribute;
inner banner styling still comes from the alert subpath.)

### 3. Light appearance across variants

```ts
import { Component } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import type { VariantType } from '@egose/shadcn-theme-ng/alert';

@Component({
  selector: 'app-basic-alert-light',
  standalone: true,
  imports: [EgBasicAlert],
  template: `
    @for (v of variants; track v) {
      <eg-basic-alert
        [variant]="v"
        appearance="light"
        [title]="v"
        [description]="'The ' + v + ' tone in light appearance.'"
        class="tw:mb-3 tw:block"
      />
    }
  `,
})
export class BasicAlertLightComponent {
  readonly variants: VariantType[] = ['primary', 'success', 'warning', 'danger', 'info', 'muted'];
}
```

### 4. Signal-driven form feedback

```ts
import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-form',
  standalone: true,
  imports: [EgBasicAlert, ReactiveFormsModule],
  template: `
    <label class="tw:mb-1 tw:block tw:text-sm tw:font-medium" for="email">Email</label>
    <input id="email" [formControl]="email" placeholder="you@example.com" class="tw:mb-3 tw:block" />
    @if (banner(); as b) {
      <eg-basic-alert [variant]="b.variant" [title]="b.title" [description]="b.description" />
    }
  `,
})
export class BasicAlertFormComponent {
  readonly email = new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true });
  private readonly submitted = signal(false);

  readonly banner = computed(() => {
    if (!this.submitted()) return null;
    return this.email.valid
      ? { variant: 'success' as const, title: 'Looks good', description: 'We will send the receipt there.' }
      : {
          variant: 'destructive' as const,
          title: 'Invalid email',
          description: 'Enter an address like you@example.com.',
        };
  });

  constructor() {
    this.email.valueChanges.subscribe(() => this.submitted.set(true));
  }
}
```

### 5. Dismissible + async loading pattern

```ts
import { Component, signal } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-async',
  standalone: true,
  imports: [EgBasicAlert],
  template: `
    <button (click)="save()" [disabled]="saving()">Save settings</button>
    @if (saving()) {
      <eg-basic-alert variant="muted" title="Saving" description="Writing your settings…" class="tw:mt-3 tw:block" />
    } @else if (saved()) {
      <eg-basic-alert
        variant="success"
        title="Saved"
        description="Settings updated just now."
        class="tw:mt-3 tw:block"
      />
    } @else if (failed()) {
      <eg-basic-alert
        variant="destructive"
        title="Save failed"
        description="Check your connection and retry."
        class="tw:mt-3 tw:block"
      />
    }
  `,
})
export class BasicAlertAsyncComponent {
  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly failed = signal(false);

  async save() {
    this.saving.set(true);
    this.saved.set(false);
    this.failed.set(false);
    try {
      await fetch('/api/settings', { method: 'POST' });
      this.saved.set(true);
    } catch {
      this.failed.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
```

### 6. Advanced: reusing `getIconName` for a custom banner

Because `getIconName` is public, custom compositions can stay icon-consistent with the built-in
mapping. Grab the component with a template ref (or `@ViewChild`) and call it:

```ts
import { Component, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmAlertImports, type VariantType } from '@egose/shadcn-theme-ng/alert';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'app-basic-alert-custom',
  standalone: true,
  imports: [...HlmAlertImports, EgBasicAlert, NgIcon, HlmIcon],
  providers: [provideIcons({ ...lucide })],
  template: `
    <!-- hidden helper instance purely as an icon-name resolver -->
    <eg-basic-alert #helper variant="info" title="" description="" class="tw:hidden" />
    <div hlmAlert [variant]="variant">
      <ng-icon hlm hlmAlertIcon [name]="helper.getIconName(variant)" />
      <h4 hlmAlertTitle>Custom layout, stock icon</h4>
      <p hlmAlertDescription>Extra actions or rich content here — the icon still matches the {{ variant }} tone.</p>
    </div>
  `,
})
export class BasicAlertCustomComponent {
  readonly variant: VariantType = 'accent';
  private readonly helper = viewChild<EgBasicAlert>('helper');
}
```

> Prefer importing the `alert` subpath directly for hand-built banners; the helper-instance trick
> above is only for teams that want a single source of truth for the icon map.

## Accessibility notes

- Inherits everything from `HlmAlert`: the banner carries `role="alert"`, so dynamically shown
  instances (after save/fail) are announced. Do not render empty `title` + `description`
  instances permanently — screen readers would announce an empty alert region.
- Titles render with `tw:capitalize` — keep them short, human-phrased headings ("Save failed",
  not "ERR_SAVE_500"). The description should state the consequence and next step.
- The icon is decorative; all meaning must be in the text since icon names/tones alone are not
  announced.

## Theming / CSS variables

No variables of its own — theming flows through the composed `HlmAlert` (`variant` /
`appearance` + shadcn tokens). For layouts beyond icon/title/description, drop down to
`@egose/shadcn-theme-ng/alert` and compose the directives yourself.

## Related subpaths

- `@egose/shadcn-theme-ng/alert` — hand-composed banners (`HlmAlert*`) and the `VariantType` / `AppearanceType` types
- `@egose/shadcn-theme-ng/badge` — inline chips for compact status
- `@egose/shadcn-theme-ng/sonner` — transient toasts for fire-and-forget feedback
- `@egose/shadcn-theme-ng/icon` — `HlmIcon` and icon configuration
