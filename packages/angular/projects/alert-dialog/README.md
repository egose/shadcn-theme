# Alert Dialog (`@egose/shadcn-theme-ng/alert-dialog`)

A modal confirmation dialog in the shadcn/ui Alert Dialog style: an overlay plus a centered panel
with a title, description, optional media illustration, and an action/cancel footer. Use it for
destructive or consequential confirmations ("Delete project?") that require an explicit choice.

The implementation styles the headless
[`BrnAlertDialog*` primitives from `@spartan-ng/brain/alert-dialog`](https://www.spartan-ng.com/)
(plus `BrnDialogClose` and the shared `BrnDialog` plumbing from `@spartan-ng/brain/dialog`).
`HlmAlertDialog` is a component extending `BrnAlertDialog` that renders the overlay and projects
the rest; every other piece is a thin directive adding `data-slot` attributes and shadcn classes
via `classes()` / `hlm()`. The action/cancel buttons reuse `HlmBtn` from
`@egose/shadcn-theme-ng/button` through `hostDirectives`, so `variant`/`size` inputs work on them
directly.

> **Ships as:** `@egose/shadcn-theme-ng/alert-dialog` and `@egose/shadcn-theme-ng-tw/alert-dialog`
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
`@egose/shadcn-theme-ng/utils` (`classes()`/`hlm()`) and
`@egose/shadcn-theme-ng/button` (`HlmBtn`, `provideBrnButtonConfig`).

## Imports

All symbols are exported from the subpath root (`projects/alert-dialog/src/public-api.ts`):

```ts
import {
  HlmAlertDialog,
  HlmAlertDialogTrigger,
  HlmAlertDialogPortal,
  HlmAlertDialogOverlay,
  HlmAlertDialogContent,
  HlmAlertDialogHeader,
  HlmAlertDialogMedia,
  HlmAlertDialogTitle,
  HlmAlertDialogDescription,
  HlmAlertDialogFooter,
  HlmAlertDialogAction,
  HlmAlertDialogCancel,
  HlmAlertDialogImports,
  HlmAlertDialogModule,
} from '@egose/shadcn-theme-ng/alert-dialog';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/alert-dialog'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmAlertDialogImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmAlertDialogModule } from '@egose/shadcn-theme-ng/alert-dialog';

@NgModule({ imports: [HlmAlertDialogModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<hlm-alert-dialog>
  <button hlmAlertDialogTrigger>Delete project</button>

  <div hlmAlertDialogPortal>
    <div hlmAlertDialogContent size="default">
      <div hlmAlertDialogHeader>
        <div hlmAlertDialogMedia>
          <ng-icon name="lucideTrash" />
        </div>
        <h2 hlmAlertDialogTitle>Delete project?</h2>
        <p hlmAlertDialogDescription>This cannot be undone.</p>
      </div>
      <div hlmAlertDialogFooter>
        <button hlmAlertDialogCancel>Cancel</button>
        <button hlmAlertDialogAction>Delete</button>
      </div>
    </div>
  </div>
</hlm-alert-dialog>
```

Real selectors (from source):

| Class                       | Selector(s)                                                       | Kind      |
| --------------------------- | ----------------------------------------------------------------- | --------- |
| `HlmAlertDialog`            | `hlm-alert-dialog` (`exportAs: hlmAlertDialog`)                   | Component |
| `HlmAlertDialogTrigger`     | `button[hlmAlertDialogTrigger], button[hlmAlertDialogTriggerFor]` | Directive |
| `HlmAlertDialogPortal`      | `[hlmAlertDialogPortal]`                                          | Directive |
| `HlmAlertDialogOverlay`     | `[hlmAlertDialogOverlay], hlm-alert-dialog-overlay`               | Directive |
| `HlmAlertDialogContent`     | `[hlmAlertDialogContent], hlm-alert-dialog-content`               | Directive |
| `HlmAlertDialogHeader`      | `[hlmAlertDialogHeader], hlm-alert-dialog-header`                 | Directive |
| `HlmAlertDialogMedia`       | `[hlmAlertDialogMedia], hlm-alert-dialog-media`                   | Directive |
| `HlmAlertDialogTitle`       | `[hlmAlertDialogTitle]`                                           | Directive |
| `HlmAlertDialogDescription` | `[hlmAlertDialogDescription]`                                     | Directive |
| `HlmAlertDialogFooter`      | `[hlmAlertDialogFooter], hlm-alert-dialog-footer`                 | Directive |
| `HlmAlertDialogAction`      | `button[hlmAlertDialogAction]`                                    | Directive |
| `HlmAlertDialogCancel`      | `button[hlmAlertDialogCancel]`                                    | Directive |

`HlmAlertDialog` itself renders `<hlm-alert-dialog-overlay />` plus `<ng-content />`, and provides
`BrnDialog` (aliased to itself) with `BRN_ALERT_DIALOG_DEFAULT_OPTIONS`, so open/close state,
focus trapping, and outside-pointer handling come from the brain dialog.

## API reference

### `HlmAlertDialog` — `hlm-alert-dialog`

Root component extending `BrnAlertDialog`. No own inputs — the full `BrnAlertDialog` surface
(open state, context) is inherited. Exposed as template ref `hlmAlertDialog`.

### `HlmAlertDialogTrigger` — `button[hlmAlertDialogTrigger], button[hlmAlertDialogTriggerFor]`

Wraps `BrnAlertDialogTrigger`.

| Input (via `BrnAlertDialogTrigger`)                              | Description                        |
| ---------------------------------------------------------------- | ---------------------------------- |
| `id`                                                             | Dialog id to toggle.               |
| `hlmAlertDialogTriggerFor` (alias of `brnAlertDialogTriggerFor`) | Template/dialog reference to open. |
| `type`                                                           | Button type passthrough.           |

### `HlmAlertDialogPortal` — `[hlmAlertDialogPortal]`

Wraps `BrnAlertDialogContent` (the CDK-portal outlet).

| Input (via brain) | Description                             |
| ----------------- | --------------------------------------- |
| `context`         | Template context for the portal.        |
| `class`           | Classes forwarded to the portal outlet. |

### `HlmAlertDialogContent` — `[hlmAlertDialogContent], hlm-alert-dialog-content`

The visible panel. Reads live open/closed state from the injected `ExposesStateProvider`
(`state()` signal, defaulting to `'closed'`) and reflects it as `data-state`; `size()` is
reflected as `data-size`, which the footer/header/media styles key off.

| Input   | Type                | Default     | Description                                                  |
| ------- | ------------------- | ----------- | ------------------------------------------------------------ |
| `size`  | `'sm' \| 'default'` | `'default'` | Panel width (`sm` renders a compact two-column footer grid). |
| `state` | `Signal<string>`    | inherited   | Read-only live dialog state (`'open' \| 'closed'`).          |

### `HlmAlertDialogOverlay` — `[hlmAlertDialogOverlay], hlm-alert-dialog-overlay`

Wraps `BrnAlertDialogOverlay` and forwards the computed dim/backdrop-blur classes to the
custom element via `injectCustomClassSettable`.

| Input   | Type         | Default | Description                       |
| ------- | ------------ | ------- | --------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged via `hlm()`. |

### `HlmAlertDialogTitle` / `HlmAlertDialogDescription`

Thin wrappers around `BrnAlertDialogTitle` / `BrnAlertDialogDescription`. No own inputs; they add
`data-slot` and shadcn type styles.

### `HlmAlertDialogHeader` / `HlmAlertDialogFooter` / `HlmAlertDialogMedia`

Layout-only directives, no inputs. Header centers content (switching to start-aligned on `sm`
screens for `size="default"`); footer stacks buttons in a column on mobile and a right-aligned row
on `sm+` (a 2-column grid for `size="sm"`); media renders the `size-16` muted illustration box.

### `HlmAlertDialogAction` — `button[hlmAlertDialogAction]`

Confirm button. Composes `HlmBtn` (`variant`/`size` inputs forwarded), **not** `BrnDialogClose` —
closing on confirm is your handler's job.

| Input     | Type                              | Default       | Description         |
| --------- | --------------------------------- | ------------- | ------------------- |
| `variant` | via `HlmBtn`                      | (btn default) | Button tone.        |
| `size`    | via `HlmBtn`                      | (btn default) | Button size.        |
| `type`    | `'button' \| 'submit' \| 'reset'` | `'button'`    | Native button type. |

### `HlmAlertDialogCancel` — `button[hlmAlertDialogCancel]`

Cancel button. Composes `BrnDialogClose` (closes automatically) + `HlmBtn`, with
`provideBrnButtonConfig({ variant: 'outline' })` so it renders outlined by default.

| Input     | Type                              | Default       | Description                |
| --------- | --------------------------------- | ------------- | -------------------------- |
| `variant` | via `HlmBtn`                      | `'outline'`   | Button tone (overridable). |
| `size`    | via `HlmBtn`                      | (btn default) | Button size.               |
| `type`    | `'button' \| 'submit' \| 'reset'` | `'button'`    | Native button type.        |

## Examples

### 1. Basic delete confirmation

```ts
import { Component } from '@angular/core';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';

@Component({
  selector: 'app-alert-dialog-basic',
  standalone: true,
  imports: [...HlmAlertDialogImports],
  template: `
    <hlm-alert-dialog>
      <button hlmAlertDialogTrigger>Delete project</button>
      <div hlmAlertDialogPortal>
        <div hlmAlertDialogContent>
          <div hlmAlertDialogHeader>
            <h2 hlmAlertDialogTitle>Delete project?</h2>
            <p hlmAlertDialogDescription>This permanently removes the project and its data. This cannot be undone.</p>
          </div>
          <div hlmAlertDialogFooter>
            <button hlmAlertDialogCancel>Cancel</button>
            <button hlmAlertDialogAction (click)="remove()">Delete</button>
          </div>
        </div>
      </div>
    </hlm-alert-dialog>
  `,
})
export class AlertDialogBasicComponent {
  remove() {
    /* call the delete API, then the dialog stays until Cancel/close */
  }
}
```

```html
<app-alert-dialog-basic />
```

### 2. Compact (`size="sm"`) dialog with media illustration

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';

@Component({
  selector: 'app-alert-dialog-media',
  standalone: true,
  imports: [...HlmAlertDialogImports, NgIcon],
  providers: [provideIcons({ lucideTriangleAlert })],
  template: `
    <hlm-alert-dialog>
      <button hlmAlertDialogTrigger>Leave page</button>
      <div hlmAlertDialogPortal>
        <div hlmAlertDialogContent size="sm">
          <div hlmAlertDialogHeader>
            <div hlmAlertDialogMedia>
              <ng-icon name="lucideTriangleAlert" />
            </div>
            <h2 hlmAlertDialogTitle>Discard changes?</h2>
            <p hlmAlertDialogDescription>You have unsaved edits that will be lost.</p>
          </div>
          <div hlmAlertDialogFooter>
            <button hlmAlertDialogCancel>Keep editing</button>
            <button hlmAlertDialogAction (click)="discard()">Discard</button>
          </div>
        </div>
      </div>
    </hlm-alert-dialog>
  `,
})
export class AlertDialogMediaComponent {
  discard() {}
}
```

### 3. Custom button tones via `HlmBtn` inputs

`hlmAlertDialogAction` / `hlmAlertDialogCancel` forward `variant` and `size` to `HlmBtn`:

```ts
import { Component } from '@angular/core';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';

@Component({
  selector: 'app-alert-dialog-tones',
  standalone: true,
  imports: [...HlmAlertDialogImports],
  template: `
    <hlm-alert-dialog>
      <button hlmAlertDialogTrigger>Archive workspace</button>
      <div hlmAlertDialogPortal>
        <div hlmAlertDialogContent>
          <div hlmAlertDialogHeader>
            <h2 hlmAlertDialogTitle>Archive workspace?</h2>
            <p hlmAlertDialogDescription>Members lose access until you restore it.</p>
          </div>
          <div hlmAlertDialogFooter>
            <button hlmAlertDialogCancel variant="ghost" size="sm">Back</button>
            <button hlmAlertDialogAction variant="destructive" size="sm" (click)="archive()">Archive</button>
          </div>
        </div>
      </div>
    </hlm-alert-dialog>
  `,
})
export class AlertDialogTonesComponent {
  archive() {}
}
```

### 4. Programmatic control with a template reference

`HlmAlertDialog` has `exportAs: hlmAlertDialog` and extends `BrnAlertDialog`, so the brain's
open/close API is available from the template or a `@ViewChild`:

```ts
import { Component, viewChild } from '@angular/core';
import { HlmAlertDialog, HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';

@Component({
  selector: 'app-alert-dialog-programmatic',
  standalone: true,
  imports: [...HlmAlertDialogImports],
  template: `
    <hlm-alert-dialog #dialog="hlmAlertDialog">
      <div hlmAlertDialogPortal>
        <div hlmAlertDialogContent>
          <div hlmAlertDialogHeader>
            <h2 hlmAlertDialogTitle>Session expired</h2>
            <p hlmAlertDialogDescription>Sign in again to continue.</p>
          </div>
          <div hlmAlertDialogFooter>
            <button hlmAlertDialogCancel>Later</button>
            <button hlmAlertDialogAction (click)="reauth()">Sign in</button>
          </div>
        </div>
      </div>
    </hlm-alert-dialog>
    <button (click)="open()">Check session</button>
  `,
})
export class AlertDialogProgrammaticComponent {
  private readonly dialog = viewChild<HlmAlertDialog>('dialog');

  open() {
    this.dialog()?.open?.();
  }
  reauth() {
    /* ... */ this.dialog()?.close?.();
  }
}
```

> The exact open/close method names live on `BrnAlertDialog` from `@spartan-ng/brain/alert-dialog`;
> consult that class for the current API — this package adds no methods of its own.

### 5. Element-form variants (element selectors)

Header, footer, media, and content also match element selectors, which reads better in long
templates:

```html
<hlm-alert-dialog>
  <button hlmAlertDialogTrigger>Reset settings</button>
  <div hlmAlertDialogPortal>
    <hlm-alert-dialog-content>
      <hlm-alert-dialog-header>
        <h2 hlmAlertDialogTitle>Reset to defaults?</h2>
        <p hlmAlertDialogDescription>Custom themes and shortcuts will be removed.</p>
      </hlm-alert-dialog-header>
      <hlm-alert-dialog-footer>
        <button hlmAlertDialogCancel>Cancel</button>
        <button hlmAlertDialogAction (click)="reset()">Reset</button>
      </hlm-alert-dialog-footer>
    </hlm-alert-dialog-content>
  </div>
</hlm-alert-dialog>
```

```ts
import { Component } from '@angular/core';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';

@Component({
  selector: 'app-alert-dialog-elements',
  standalone: true,
  imports: [...HlmAlertDialogImports],
  templateUrl: './alert-dialog-elements.html',
})
export class AlertDialogElementsComponent {
  reset() {}
}
```

### 6. Async confirm with a loading button

Combine the footer action with the loading state of `HlmButton` for server round-trips:

```ts
import { Component, signal } from '@angular/core';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-alert-dialog-async',
  standalone: true,
  imports: [...HlmAlertDialogImports, ...HlmButtonImports],
  template: `
    <hlm-alert-dialog>
      <button hlmAlertDialogTrigger>Transfer ownership</button>
      <div hlmAlertDialogPortal>
        <div hlmAlertDialogContent>
          <div hlmAlertDialogHeader>
            <h2 hlmAlertDialogTitle>Transfer ownership?</h2>
            <p hlmAlertDialogDescription>You will become a regular member.</p>
          </div>
          <div hlmAlertDialogFooter>
            <button hlmAlertDialogCancel [disabled]="saving()">Cancel</button>
            <button hlmButton variant="primary" [loading]="saving()" (click)="transfer()">Transfer</button>
          </div>
        </div>
      </div>
    </hlm-alert-dialog>
  `,
})
export class AlertDialogAsyncComponent {
  readonly saving = signal(false);

  async transfer() {
    this.saving.set(true);
    try {
      await fetch('/api/transfer', { method: 'POST' });
    } finally {
      this.saving.set(false);
    }
  }
}
```

## Accessibility notes

- The dialog is modal: the brain traps focus inside, restores focus to the trigger on close, and
  exposes the panel as an `alertdialog` to assistive technology. Titles and descriptions are wired
  to the panel via `BrnAlertDialogTitle` / `BrnAlertDialogDescription` — always include both so
  screen readers announce purpose and consequence.
- `HlmAlertDialogCancel` closes via `BrnDialogClose` (Escape and overlay dismissal behave per
  `BRN_ALERT_DIALOG_DEFAULT_OPTIONS`). `HlmAlertDialogAction` deliberately does **not** auto-close:
  keep it that way for destructive flows so a failed request cannot silently dismiss the prompt.
- The action/cancel buttons are native `<button>` elements — keep their labels verb-led
  ("Delete project", not "OK") and distinct from each other.

## Theming / CSS variables

Class-based styling (popover tokens, `ring-foreground/10`, `animate-in/out` utilities); no
component-specific CSS variables. The overlay uses `bg-black/10` with a subtle backdrop blur, and
the panel animates on `data-state` (`fade` + `zoom`). Override via `class` on the overlay
(forwarded through the custom-element class settable) or any other piece.

## Related subpaths

- `@egose/shadcn-theme-ng/dialog` — general (non-alert) modal dialogs
- `@egose/shadcn-theme-ng/confirmation-dialog` — higher-level confirm helper
- `@egose/shadcn-theme-ng/button` — `HlmBtn` / `HlmButton` used by the footer actions
- `@egose/shadcn-theme-ng/sonner` — non-blocking toast feedback after confirm
