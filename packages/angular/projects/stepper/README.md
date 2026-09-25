# Stepper (`@egose/shadcn-theme-ng/stepper`)

Multi-step workflow navigation, ported from the spartan stepper blocks. This subpath ships seven pieces — `HlmStepper` (root), `HlmStep` (step), `HlmStepHeader` (clickable header with indicator), `HlmStepLabel` (rich label template), `HlmStepContent` (lazy body), `HlmStepperNext` / `HlmStepperPrevious` (navigation buttons) — plus `provideHlmStepperConfig` / `injectHlmStepperConfig` for global defaults. Headers automatically show the full label in a styled tooltip on hover/focus (overridable per step via `tooltip`). All are thin shadcn-styled components over Angular CDK's `@angular/cdk/stepper` primitives (`CdkStepper`, `CdkStep`, `CdkStepHeader`, `CdkStepLabel`).

> **Ships as:** `@egose/shadcn-theme-ng/stepper` and `@egose/shadcn-theme-ng-tw/stepper` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

`@angular/cdk` (stepper, portal) arrives via the package peer dependencies. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/stepper/src/public-api.ts`:

```ts
import {
  HlmStep,
  HlmStepContent,
  HlmStepHeader,
  HlmStepLabel,
  HlmStepper,
  HlmStepperImports,
  HlmStepperModule,
  HlmStepperNext,
  HlmStepperPrevious,
  injectHlmStepperConfig,
  provideHlmStepperConfig,
  type HlmStepTooltipPosition,
} from '@egose/shadcn-theme-ng/stepper';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/stepper'
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmStepperImports } from '@egose/shadcn-theme-ng/stepper';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmStepperImports],
  template: `<!-- stepper markup here -->`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmStepperModule } from '@egose/shadcn-theme-ng/stepper';

@NgModule({ imports: [HlmStepperModule] })
export class FeatureModule {}
```

| Symbol                    | Kind          | Description                                                               |
| ------------------------- | ------------- | ------------------------------------------------------------------------- |
| `HlmStepper`              | Component     | Root: `<hlm-stepper>` — extends `CdkStepper`.                             |
| `HlmStep`                 | Component     | Step: `<hlm-step label="…">` — extends `CdkStep`, adds `icon` input.      |
| `HlmStepHeader`           | Component     | Header: `<hlm-step-header>` — extends `CdkStepHeader`, renders indicator. |
| `HlmStepLabel`            | Directive     | Rich label: `<ng-template hlmStepLabel>` — extends `CdkStepLabel`.        |
| `HlmStepContent`          | Directive     | Lazy body: `<ng-template hlmStepContent>` — attached on first selection.  |
| `HlmStepperNext`          | Directive     | Next button: `button[hlmStepperNext]` — extends `CdkStepperNext`.         |
| `HlmStepperPrevious`      | Directive     | Back button: `button[hlmStepperPrevious]` — extends `CdkStepperPrevious`. |
| `HlmStepperImports`       | `const` array | All seven, spread into `imports: [...]`.                                  |
| `HlmStepperModule`        | NgModule      | Imports + re-exports all seven.                                           |
| `provideHlmStepperConfig` | Function      | Global defaults for animations + indicator mode.                          |
| `injectHlmStepperConfig`  | Function      | Reads the (optionally provided) global config.                            |

## Anatomy / Structure

```html
<hlm-stepper>
  <hlm-step label="Step One">
    <p>Content 1</p>
    <button hlmBtn hlmStepperNext>Next</button>
  </hlm-step>

  <hlm-step label="Step Two">
    <p>Content 2</p>
    <button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
    <button hlmBtn hlmStepperNext>Next</button>
  </hlm-step>

  <hlm-step label="Step Three">
    <p>Content 3</p>
    <button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
    <button hlmBtn>Finish</button>
  </hlm-step>
</hlm-stepper>
```

Rich label via template (takes precedence over the `label` string):

```html
<hlm-step [stepControl]="form">
  <ng-template hlmStepLabel>Security</ng-template>
  <!-- … -->
</hlm-step>
```

Lazy body (attached only when the step is first selected):

```html
<hlm-step label="Analytics">
  <ng-template hlmStepContent>
    <p>Heavy content…</p>
  </ng-template>
</hlm-step>
```

## API reference

### `HlmStepper` — selector `hlm-stepper` (component, extends `CdkStepper`)

| Input                   | Type                            | Default                 | Description                                                      |
| ----------------------- | ------------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `orientation`           | forwarded to `CdkStepper`       | —                       | `'horizontal' \| 'vertical'`.                                    |
| `linear`                | forwarded to `CdkStepper`       | —                       | Current step must be valid (via `stepControl`) before advancing. |
| `selectedIndex`         | forwarded to `CdkStepper`       | —                       | Controlled selected-step index.                                  |
| `labelPosition`         | `'end' \| 'bottom'`             | `'end'`                 | Horizontal layout: label beside vs. below the indicator.         |
| `headerPosition`        | `'top' \| 'bottom'`             | `'top'`                 | Horizontal layout: headers above vs. below the content panel.    |
| `indicatorMode`         | `'number' \| 'state' \| 'icon'` | from config (`'state'`) | Indicator rendering (see below).                                 |
| `stepperAriaLabel`      | `string \| null`                | `'Progress'`            | `aria-label` for the tablist (ignored when labelledby is set).   |
| `stepperAriaLabelledby` | `string \| null`                | `null`                  | `aria-labelledby` for the tablist.                               |
| `animationsEnabled`     | `boolean`                       | from config (`true`)    | Toggle step transitions per instance.                            |
| `animationDuration`     | `number` (ms)                   | from config (`300`)     | Transition duration per instance.                                |

`next()` is overridden to `markAllAsTouched()` + `updateValueAndValidity()` on the current `stepControl` first, so linear steppers surface validation errors before denying the transition.

### `HlmStep` — selector `hlm-step` (component, extends `CdkStep`)

| Input             | Type                                     | Default                                      | Description                                                              |
| ----------------- | ---------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| `label`           | forwarded to `CdkStep`                   | —                                            | Step title (string, or rich template via `hlmStepLabel`).                |
| `icon`            | `string \| null`                         | `null`                                       | Icon name rendered when `indicatorMode="icon"`.                          |
| `stepControl`     | forwarded to `CdkStep`                   | —                                            | Form group driving `linear` validation.                                  |
| `optional`        | forwarded to `CdkStep`                   | —                                            | Shows an "Optional" caption in the header.                               |
| `errorMessage`    | forwarded to `CdkStep`                   | —                                            | Header error caption when the step state is `error`.                     |
| `hasError`        | forwarded to `CdkStep`                   | —                                            | Forces the error state (pair with `STEPPER_GLOBAL_OPTIONS` `showError`). |
| `tooltip`         | `string \| TemplateRef<unknown> \| null` | `null` (falls back to the full string label) | Styled header tooltip override; rich templates allowed.                  |
| `tooltipPosition` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`                                   | Tooltip side.                                                            |
| `tooltipDisabled` | `boolean`                                | `false`                                      | Disables the header tooltip for this step.                               |

### `HlmStepHeader` — selector `hlm-step-header` (component, extends `CdkStepHeader`)

Usually rendered by `HlmStepper` itself; use directly only for custom layouts.

| Input                             | Type                             | Default                 | Description                                            |
| --------------------------------- | -------------------------------- | ----------------------- | ------------------------------------------------------ |
| `index`                           | `number`                         | `0`                     | Step index (drives the number indicator).              |
| `state`                           | `StepState`                      | `'number'`              | CDK step state (`number`, `edit`, `done`, `error`, …). |
| `label`                           | `HlmStepLabel \| string \| null` | `null`                  | Resolved label content.                                |
| `selected` / `reached` / `active` | `boolean`                        | `false`                 | Visual state flags.                                    |
| `optional` / `disabled`           | `boolean`                        | `false`                 | Optional caption / disabled styling.                   |
| `icon`                            | `string \| null`                 | `null`                  | Icon name for `indicatorMode="icon"`.                  |
| `indicatorMode`                   | `'number' \| 'state' \| 'icon'`  | from config (`'state'`) | Indicator rendering.                                   |
| `labelPosition`                   | `'end' \| 'bottom'`              | `'end'`                 | Label beside vs. below the indicator.                  |
| `errorMessage`                    | `string`                         | `''`                    | Error caption shown when `state === 'error'`.          |

Indicator modes: `number` always renders `1, 2, 3`; `state` (default) renders a check icon for selected/reached steps and an alert icon for errors; `icon` renders the per-step `icon` name (provide icons via `@ng-icons/core` `provideIcons` in your app).

### `HlmStepperNext` / `HlmStepperPrevious` — `button[hlmStepperNext]` / `button[hlmStepperPrevious]`

No inputs/outputs. Thin extensions of `CdkStepperNext` / `CdkStepperPrevious` (sets `type` binding + `touch-action: manipulation`). Pair with `hlmBtn` for styling.

### Global config

```ts
import { provideHlmStepperConfig } from '@egose/shadcn-theme-ng/stepper';

@Component({
  // ...
  providers: [
    provideHlmStepperConfig({ animationEnabled: true, animationDuration: 300, defaultIndicatorMode: 'state' }),
  ],
})
export class FeatureComponent {}
```

Per-instance `animationsEnabled`, `animationDuration`, and `indicatorMode` inputs override the global defaults.

## Examples

### 1. Basic horizontal stepper

```ts
import { Component } from '@angular/core';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmStepperImports } from '@egose/shadcn-theme-ng/stepper';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [...HlmStepperImports, ...HlmButtonImports],
  template: `
    <hlm-stepper>
      <hlm-step label="Step One">
        <p>Content 1</p>
        <button hlmBtn hlmStepperNext>Next</button>
      </hlm-step>
      <hlm-step label="Step Two">
        <p>Content 2</p>
        <button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
        <button hlmBtn hlmStepperNext>Next</button>
      </hlm-step>
      <hlm-step label="Step Three">
        <p>Content 3</p>
        <button hlmBtn variant="outline" hlmStepperPrevious>Back</button>
        <button hlmBtn>Finish</button>
      </hlm-step>
    </hlm-stepper>
  `,
})
export class DemoBasic {}
```

### 2. Vertical orientation

```html
<hlm-stepper orientation="vertical">
  <hlm-step label="Campaign"><!-- … --></hlm-step>
  <hlm-step label="Audience"><!-- … --></hlm-step>
  <hlm-step label="Review"><!-- … --></hlm-step>
</hlm-stepper>
```

Use vertical when content is dense or horizontal space is limited.

### 3. Responsive orientation via `BreakpointObserver`

```ts
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  /* … */
})
export class DemoResponsive {
  private readonly _breakpoints = inject(BreakpointObserver);
  private readonly _isSmall = toSignal(this._breakpoints.observe('(max-width: 767.98px)').pipe(map((s) => s.matches)), {
    initialValue: false,
  });
  protected readonly orientation = computed(() => (this._isSmall() ? 'vertical' : 'horizontal'));
}
```

```html
<hlm-stepper [orientation]="orientation()"><!-- … --></hlm-stepper>
```

### 4. Linear stepper with validation

With `linear`, the current step must be valid before advancing — `HlmStepper.next()` marks the step form touched first:

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  /* …, imports: [ReactiveFormsModule, ...HlmStepperImports, ...HlmButtonImports] */
})
export class DemoLinear {
  private readonly _fb = inject(FormBuilder);
  protected readonly identity = this._fb.group({ name: ['', Validators.required] });
}
```

```html
<hlm-stepper [linear]="true">
  <hlm-step [stepControl]="identity" label="Identity">
    <form [formGroup]="identity">
      <input hlmInput formControlName="name" placeholder="Required before continuing" />
      <button hlmBtn hlmStepperNext>Next</button>
    </form>
  </hlm-step>
  <hlm-step label="Review"><!-- … --></hlm-step>
</hlm-stepper>
```

### 5. Error states

Enable `showError` through `STEPPER_GLOBAL_OPTIONS` to surface a step's error message in its header:

```ts
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
  /* … */
})
export class DemoError {}
```

```html
<hlm-step
  [stepControl]="contact"
  [hasError]="contact.invalid && contact.touched"
  errorMessage="Enter a valid work email before continuing."
  label="Contact"
>
  <!-- … -->
</hlm-step>
```

### 6. Layout controls

```html
<hlm-stepper labelPosition="bottom" headerPosition="bottom"><!-- … --></hlm-stepper>
```

`labelPosition` moves horizontal labels below the indicator; `headerPosition="bottom"` moves the header row below the content panel.

### 7. Animation controls

```html
<hlm-stepper [animationsEnabled]="true" [animationDuration]="300"><!-- … --></hlm-stepper>
```

Or set global defaults with `provideHlmStepperConfig` and override per instance.

### 8. Indicator modes

```html
<hlm-stepper indicatorMode="number"><!-- always 1, 2, 3 --></hlm-stepper>
<hlm-stepper indicatorMode="state"><!-- default: check / alert icons --></hlm-stepper>
<hlm-stepper indicatorMode="icon">
  <hlm-step label="Profile" icon="lucideUser"><!-- … --></hlm-step>
</hlm-stepper>
```

Per-step `icon` names resolve through `@ng-icons/core` — register them with `provideIcons` in your app.

### 9. Header tooltips

Headers carry the styled `HlmTooltip` automatically: hovering or focusing a header shows the step's full string label (useful when labels truncate). Override per step with `tooltip` (plain text or a `TemplateRef`), adjust the side with `tooltipPosition`, or opt out with `tooltipDisabled`:

```html
<hlm-stepper>
  <hlm-step label="An especially long account setup label that truncates"><!-- falls back to the label --></hlm-step>
  <hlm-step label="Profile" tooltip="Add a photo so teammates recognize you"><!-- … --></hlm-step>
  <hlm-step label="Review" [tooltipDisabled]="true"><!-- … --></hlm-step>
</hlm-stepper>
```

Steps using `<ng-template hlmStepLabel>` have no string to fall back to — pass `tooltip` explicitly if they need one. Custom `HlmStepHeader` layouts can apply `hlmTooltip` directly.

## Accessibility notes

- Horizontal headers get `role="tab"` semantics inside a `role="tablist"` (labelled `Progress` by default — override with `stepperAriaLabel` / `stepperAriaLabelledby`); panels get `role="tabpanel"` wired via `aria-labelledby` / `aria-controls`.
- Vertical headers use `role="button"` with `aria-expanded` / `aria-current="step"`.
- Keyboard: `HlmStepper` inherits CDK arrow-key navigation (`_onKeydown`). Headers are focusable via roving `tabIndex`.
- Disabled steps (`linear` + not navigable) get `aria-disabled` and `data-disabled` styling — explain in the label why a step is unavailable.
- In `linear` mode, failed validation marks fields touched so screen readers announce the errors.

## Theming / CSS variables

Headers follow `buttonVariants({ size: 'icon-sm' })` (`default` when selected/reached, `outline` otherwise, `destructive` on error) with `data-disabled` opacity handling. Connectors use `bg-primary` once reached, `bg-border` otherwise. Follows your shadcn theme automatically; extend via `class` (merged through `classes()` on headers) or the layout/indicator inputs.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — `buttonVariants` powers the step indicators; `hlmBtn` styles the nav buttons.
- `@egose/shadcn-theme-ng/input` / `@egose/shadcn-theme-ng/label` / `@egose/shadcn-theme-ng/field` — form controls inside linear steps.
- `@egose/shadcn-theme-ng/card` — rich content panels.
