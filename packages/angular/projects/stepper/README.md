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

| Input                   | Type                            | Default                 | Description                                                         |
| ----------------------- | ------------------------------- | ----------------------- | ------------------------------------------------------------------- |
| `orientation`           | forwarded to `CdkStepper`       | —                       | `'horizontal' \| 'vertical'`.                                       |
| `linear`                | forwarded to `CdkStepper`       | —                       | CDK checks preceding steps, honoring optional/completion overrides. |
| `selectedIndex`         | forwarded to `CdkStepper`       | —                       | Controlled selected-step index.                                     |
| `labelPosition`         | `'end' \| 'bottom'`             | `'end'`                 | Horizontal layout: label beside vs. below the indicator.            |
| `headerPosition`        | `'top' \| 'bottom'`             | `'top'`                 | Horizontal layout: headers above vs. below the content panel.       |
| `indicatorMode`         | `'number' \| 'state' \| 'icon'` | from config (`'state'`) | Indicator rendering (see below).                                    |
| `stepperAriaLabel`      | `string \| null`                | `'Progress'`            | `aria-label` for the tablist (ignored when labelledby is set).      |
| `stepperAriaLabelledby` | `string \| null`                | `null`                  | `aria-labelledby` for the tablist.                                  |
| `animationsEnabled`     | `boolean`                       | from config (`true`)    | Toggle step transitions per instance.                               |
| `animationDuration`     | `number` (ms)                   | from config (`300`)     | Transition duration per instance.                                   |

`next()` and `button[hlmStepperNext]` call `markAllAsTouched()` + `updateValueAndValidity()` on the current classic reactive-forms `stepControl` before delegating navigation to CDK. This preserves touch/validation feedback even when navigation is denied, and also runs for optional, completed, and non-linear steps. Signal-form Fields are passed through to CDK without this classic-control touch pass.

CDK determines eligibility for Next, header selection, and direct index changes:

- In linear mode, all preceding required steps must satisfy CDK's interaction and validation rules. Invalid or pending controls block advancement unless their step is optional or explicitly `[completed]="true"`.
- Optional steps can be skipped while invalid or pending. Explicit completion also permits advancement in those states.
- Without a `stepControl`, CDK uses `completed` (by default, whether the step was interacted with). Explicit `[completed]="false"` blocks a required control-less step. With a control, CDK uses its validation state; `[completed]="false"` does not veto an otherwise valid, interacted control.
- Non-linear navigation is not blocked by invalid/pending forms. CDK's backward-navigation `editable` rule still applies.

Header/direct selection retains CDK's interaction behavior and does not run Next's form-touch/revalidation pass. Next revalidation can restart a validator attached to the current control, so pending eligibility is evaluated after that pass.

Header `aria-disabled`, disabled styling and active state preview the same transition that CDK will attempt, in both orientations:

- An unvisited destination is enabled when its predecessors permit entry; the destination's own incomplete/invalid control does not block entry. A completed destination cannot bypass a blocked predecessor.
- The preview accounts for CDK marking the **current** step interacted on an attempt to leave it. It does not mark steps interacted while rendering. Other unvisited required predecessors still block skipping ahead unless optional or explicitly completed.
- Backward selection requires the destination's `editable` input and, in linear mode, eligible predecessors **before that destination**. The current step's invalid/pending state does not itself prevent going back.
- The selected header stays enabled as a no-op, including vertically; selecting it neither collapses the panel nor marks the step interacted.

Actual clicks and Enter/Space selection remain delegated to CDK. Disabled headers remain discoverable by keyboard focus; attempted keyboard selection cannot change the selected index, but retains CDK's current-step interaction notification. Header attempts do not touch or revalidate form controls. Classic-form status notifications (including async validator completion) refresh the affordance; Signal Field validity is read reactively.

### `HlmStep` — selector `hlm-step` (component, extends `CdkStep`)

| Input             | Type                                     | Default                                      | Description                                                              |
| ----------------- | ---------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| `label`           | forwarded to `CdkStep`                   | —                                            | Step title (string, or rich template via `hlmStepLabel`).                |
| `icon`            | `string \| null`                         | `null`                                       | Icon name rendered when `indicatorMode="icon"`.                          |
| `stepControl`     | forwarded to `CdkStep`                   | —                                            | Form group driving `linear` validation.                                  |
| `optional`        | forwarded to `CdkStep`                   | —                                            | Permits skipping in linear mode and shows an "Optional" caption.         |
| `completed`       | forwarded to `CdkStep`                   | —                                            | Explicit completion override; see CDK navigation rules above.            |
| `editable`        | forwarded to `CdkStep`                   | `true`                                       | Allows returning to this step; enforced in linear and non-linear modes.  |
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

With `linear`, required steps normally need valid, non-pending controls before advancing. `HlmStepper.next()` marks the current step form touched first; optional and explicitly completed steps follow the exceptions above:

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
- Keyboard: CDK manages roving `tabIndex`, horizontal Left/Right (direction-aware), vertical Up/Down, Home/End, wrapping, and Enter/Space activation. Focus movement does not select a step. Disabled headers can receive keyboard focus so their labels and unavailable state remain discoverable.
- Headers that CDK cannot select get matching `aria-disabled="true"` and `data-disabled="true"` pointer/opacity styling, including non-editable backward destinations in non-linear mode. Explain in the label why a step is unavailable. Eligible unvisited destinations and the selected header are not disabled.
- Next marks classic form controls touched so applications can display validation feedback. Associate error text with the relevant controls; touching alone does not guarantee a screen-reader announcement.

## Theming / CSS variables

Headers follow `buttonVariants({ size: 'icon-sm' })` (`default` when selected/reached, `outline` otherwise, `destructive` on error) with `data-disabled` opacity handling. Connectors use `bg-primary` once reached, `bg-border` otherwise. Follows your shadcn theme automatically; extend via `class` (merged through `classes()` on headers) or the layout/indicator inputs.

## Related subpaths

- `@egose/shadcn-theme-ng/button` — `buttonVariants` powers the step indicators; `hlmBtn` styles the nav buttons.
- `@egose/shadcn-theme-ng/input` / `@egose/shadcn-theme-ng/label` / `@egose/shadcn-theme-ng/field` — form controls inside linear steps.
- `@egose/shadcn-theme-ng/card` — rich content panels.
