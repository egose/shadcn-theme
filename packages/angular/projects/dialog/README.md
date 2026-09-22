# Dialog (`@egose/shadcn-theme-ng/dialog`)

A modal dialog in the shadcn/ui Dialog style: an overlay + centered content panel with title, description, header/footer layout slots, and declarative or programmatic opening. Equivalent to shadcn/ui `Dialog`.

The Angular implementation is a thin styling layer over the headless
[`BrnDialog*` primitives from `@spartan-ng/brain/dialog`](https://www.spartan-ng.com/):
`HlmDialog` extends `BrnDialog`, trigger/close/title/description/overlay directives compose their
`Brn*` counterparts via `hostDirectives`, and `HlmDialogService` wraps `BrnDialogService` with
shadcn overlay classes. Styling is applied with `hlm()` / `classes()` from
`@egose/shadcn-theme-ng/utils`.

> **Ships as:** `@egose/shadcn-theme-ng/dialog` and `@egose/shadcn-theme-ng-tw/dialog`
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
`@egose/shadcn-theme-ng/button` (close button), `@egose/shadcn-theme-ng/utils`, and
`@ng-icons/lucide` (`lucideX`).

## Imports

All symbols are exported from the subpath root (`projects/dialog/src/public-api.ts`):

```ts
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogTrigger,
  HlmDialogClose,
  HlmDialogOverlay,
  HlmDialogPortal,
  HlmDialogTitle,
  HlmDialogDescription,
  HlmDialogHeader,
  HlmDialogFooter,
  HlmDialogService,
  HlmDialogImports,
  HlmDialogModule,
  hlmDialogOverlayClass,
} from '@egose/shadcn-theme-ng/dialog';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/dialog'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmDialogImports } from '@egose/shadcn-theme-ng/dialog';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmDialogImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmDialogModule } from '@egose/shadcn-theme-ng/dialog';

@NgModule({ imports: [HlmDialogModule] })
export class DemoModule {}
```

`HlmDialogService` is `providedIn: 'root'` — just inject it, no module setup needed.

## Anatomy / Structure

```html
<hlm-dialog>
  <button hlmBtn hlmDialogTrigger>Edit profile</button>

  <hlm-dialog-content>
    <div hlmDialogHeader>
      <h2 hlmDialogTitle>Edit profile</h2>
      <p hlmDialogDescription>Make changes here. Click save when done.</p>
    </div>

    <p>Dialog body…</p>

    <div hlmDialogFooter>
      <button hlmBtn variant="outline" hlmDialogClose>Cancel</button>
      <button hlmBtn type="submit">Save</button>
    </div>
  </hlm-dialog-content>
</hlm-dialog>
```

Real selectors (from source):

| Class                  | Selector(s)                                             | Kind                            |
| ---------------------- | ------------------------------------------------------- | ------------------------------- |
| `HlmDialog`            | `hlm-dialog`                                            | Component (extends `BrnDialog`) |
| `HlmDialogContent`     | `hlm-dialog-content`                                    | Component                       |
| `HlmDialogTrigger`     | `button[hlmDialogTrigger], button[hlmDialogTriggerFor]` | Directive (thin wrapper)        |
| `HlmDialogClose`       | `button[hlmDialogClose]`                                | Directive (thin wrapper)        |
| `HlmDialogOverlay`     | `[hlmDialogOverlay], hlm-dialog-overlay`                | Directive                       |
| `HlmDialogPortal`      | `[hlmDialogPortal]`                                     | Directive                       |
| `HlmDialogTitle`       | `[hlmDialogTitle]`                                      | Directive                       |
| `HlmDialogDescription` | `[hlmDialogDescription]`                                | Directive                       |
| `HlmDialogHeader`      | `[hlmDialogHeader], hlm-dialog-header`                  | Directive                       |
| `HlmDialogFooter`      | `[hlmDialogFooter], hlm-dialog-footer`                  | Directive                       |

## API reference

### `HlmDialog` — `hlm-dialog`

Root dialog state host. Extends `BrnDialog` (inherits its open/close state, ids, and context). Renders `<hlm-dialog-overlay />` plus projected content. `exportAs: 'hlmDialog'`.

No new inputs/outputs — configure via `BrnDialog` API and `provideBrnDialogDefaultOptions`.

### `HlmDialogContent` — `hlm-dialog-content`

The centered panel. Renders either a dynamically-opened component (`HlmDialogService`) or projected content, plus an optional built-in close button.

| Input             | Type      | Default                              | Description                                      |
| ----------------- | --------- | ------------------------------------ | ------------------------------------------------ |
| `showCloseButton` | `boolean` | context `$showCloseButton` ?? `true` | Show the top-right ghost `lucideX` close button. |

| Member      | Description                                                                          |
| ----------- | ------------------------------------------------------------------------------------ |
| `state`     | `computed` — current dialog state (`'open' \| 'closed'`, from `BrnDialogRef`).       |
| `component` | Dynamically rendered component when opened via `HlmDialogService`, else `undefined`. |

Host sets `data-slot="dialog-content"` and `data-state`.

### `HlmDialogTrigger` — `button[hlmDialogTrigger], button[hlmDialogTriggerFor]`

Thin directive wrapper. Forwards via `hostDirectives`: `id`, `brnDialogTriggerFor: hlmDialogTriggerFor`, `type` to `BrnDialogTrigger`. Use `hlmDialogTriggerFor` to target an explicit dialog template/context.

### `HlmDialogClose` — `button[hlmDialogClose]`

Thin directive wrapper around `BrnDialogClose`. Place on any `<button>` inside the dialog to close it.

### `HlmDialogOverlay` — `[hlmDialogOverlay], hlm-dialog-overlay`

Overlay backdrop. Wraps `BrnDialogOverlay`; merges `class` via `hlm()`.

| Input   | Type         | Default | Description                                        |
| ------- | ------------ | ------- | -------------------------------------------------- |
| `class` | `ClassValue` | `''`    | Extra classes merged over `hlmDialogOverlayClass`. |

Exported const `hlmDialogOverlayClass` holds the base overlay classes (also reused by `HlmDialogService` for programmatic dialogs).

### `HlmDialogPortal` — `[hlmDialogPortal]`

Thin wrapper forwarding `context` and `class` inputs to `BrnDialogContent` for portal-based content.

### `HlmDialogTitle` — `[hlmDialogTitle]`

Title text. Wraps `BrnDialogTitle` (accessible labelling) + shadcn typography. No inputs.

### `HlmDialogDescription` — `[hlmDialogDescription]`

Description text. Wraps `BrnDialogDescription` (accessible description) + muted styling. No inputs.

### `HlmDialogHeader` / `HlmDialogFooter`

Pure layout directives, no inputs. Header: vertical stack; footer: reversed column on mobile, right-aligned row on `sm+`.

### `HlmDialogService`

```ts
export type HlmDialogOptions<DialogContext = unknown> = BrnDialogOptions & {
  contentClass?: string;
  showCloseButton?: boolean;
  context?: DialogContext;
};

open<TResult = unknown, TContext = unknown>(
  component: ComponentType<unknown> | TemplateRef<unknown>,
  options?: Partial<HlmDialogOptions<TContext>>,
): BrnDialogRef<TResult>
```

Merges `backdropClass` with `hlmDialogOverlayClass`, forwards `contentClass` as `$dynamicComponentClass` and `showCloseButton` / custom `context` into `HlmDialogContent`, then delegates to `BrnDialogService.open`.

## Examples

### 1. Basic declarative dialog

```ts
import { Component } from '@angular/core';
import { HlmDialogImports } from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-basic-dialog',
  standalone: true,
  imports: [...HlmDialogImports, HlmButton],
  template: `
    <hlm-dialog>
      <button hlmBtn variant="outline" hlmDialogTrigger>Open dialog</button>
      <hlm-dialog-content>
        <div hlmDialogHeader>
          <h2 hlmDialogTitle>Are you sure?</h2>
          <p hlmDialogDescription>This action cannot be undone.</p>
        </div>
        <div hlmDialogFooter>
          <button hlmBtn variant="outline" hlmDialogClose>Cancel</button>
          <button hlmBtn (click)="confirm()">Continue</button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class BasicDialogComponent {
  confirm() {
    console.log('confirmed');
  }
}
```

### 2. Form dialog with header/footer layout

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmDialogImports } from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, HlmInput, HlmButton, ...HlmDialogImports],
  template: `
    <hlm-dialog>
      <button hlmBtn hlmDialogTrigger>Edit profile</button>
      <hlm-dialog-content>
        <div hlmDialogHeader>
          <h2 hlmDialogTitle>Edit profile</h2>
          <p hlmDialogDescription>Make changes to your profile here.</p>
        </div>
        <form [formGroup]="form" class="tw:grid tw:gap-4">
          <label hlmLabel for="name">Name</label>
          <input hlmInput id="name" formControlName="name" />
        </form>
        <div hlmDialogFooter>
          <button hlmBtn variant="outline" hlmDialogClose>Cancel</button>
          <button hlmBtn hlmDialogClose [disabled]="form.invalid" (click)="save()">Save</button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class FormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({ name: ['', Validators.required] });
  save() {
    console.log(this.form.value);
  }
}
```

### 3. Programmatic dialog via `HlmDialogService`

```ts
import { Component, inject } from '@angular/core';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [HlmButton],
  template: `<button hlmBtn variant="destructive" (click)="open()">Delete item</button>`,
})
export class ServiceDialogComponent {
  private readonly dialogs = inject(HlmDialogService);

  open() {
    const ref = this.dialogs.open(ConfirmDialogComponent, {
      contentClass: 'tw:max-w-sm',
      showCloseButton: true,
      context: { itemName: 'Report.pdf' },
    });
    ref.closed$.subscribe((result) => console.log('dialog closed with', result));
  }
}
```

```ts
// confirm-dialog.component.ts — rendered inside hlm-dialog-content
import { Component, inject } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDialogClose } from '@egose/shadcn-theme-ng/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [HlmButton, HlmDialogClose],
  template: `
    <h2 class="tw:font-medium">Delete {{ ctx?.itemName }}?</h2>
    <p class="tw:text-muted-foreground tw:text-sm">This cannot be undone.</p>
    <div class="tw:flex tw:justify-end tw:gap-2">
      <button hlmBtn variant="outline" hlmDialogClose>Cancel</button>
      <button hlmBtn variant="destructive" (click)="confirm()">Delete</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  private readonly ref = inject(BrnDialogRef);
  readonly ctx = injectBrnDialogContext<{ itemName?: string }>().itemName
    ? injectBrnDialogContext<{ itemName?: string }>()
    : null;
  confirm() {
    this.ref.close('confirmed');
  }
}
```

### 4. Template-driven programmatic dialog

```ts
import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-template-dialog',
  standalone: true,
  imports: [HlmButton],
  template: `
    <button hlmBtn variant="outline" (click)="open()">Show details</button>
    <ng-template #details>
      <h2 class="tw:font-medium">Order #1234</h2>
      <p class="tw:text-muted-foreground tw:text-sm">Ships tomorrow.</p>
    </ng-template>
  `,
})
export class TemplateDialogComponent {
  private readonly dialogs = inject(HlmDialogService);
  readonly tpl = viewChild.required('details', { read: TemplateRef });
  open() {
    this.dialogs.open(this.tpl(), { showCloseButton: false });
  }
}
```

### 5. No close button + custom overlay styling

```ts
import { Component } from '@angular/core';
import { HlmDialogImports } from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [...HlmDialogImports, HlmButton],
  template: `
    <hlm-dialog>
      <button hlmBtn hlmDialogTrigger>Onboarding</button>
      <hlm-dialog-content [showCloseButton]="false" class="tw:max-w-lg">
        <div hlmDialogHeader>
          <h2 hlmDialogTitle>Welcome!</h2>
          <p hlmDialogDescription>You must accept to continue.</p>
        </div>
        <div hlmDialogFooter>
          <button hlmBtn hlmDialogClose>Accept</button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class CustomDialogComponent {}
```

### 6. Async delete with loading state

```ts
import { Component, inject, signal } from '@angular/core';
import { HlmDialogImports, HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'app-async-dialog',
  standalone: true,
  imports: [...HlmDialogImports, HlmButton, HlmSpinner],
  template: `
    <hlm-dialog>
      <button hlmBtn variant="destructive" hlmDialogTrigger>Delete project</button>
      <hlm-dialog-content>
        <div hlmDialogHeader>
          <h2 hlmDialogTitle>Delete project?</h2>
          <p hlmDialogDescription>Type DELETE is not needed — just confirm.</p>
        </div>
        <div hlmDialogFooter>
          <button hlmBtn variant="outline" hlmDialogClose [disabled]="busy()">Cancel</button>
          <button hlmBtn variant="destructive" [disabled]="busy()" (click)="remove()">
            @if (busy()) {
              <hlm-spinner class="tw:size-4" />
            }
            Delete
          </button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AsyncDialogComponent {
  readonly busy = signal(false);
  async remove() {
    this.busy.set(true);
    await new Promise((r) => setTimeout(r, 1000));
    this.busy.set(false);
    console.log('deleted');
  }
}
```

## Accessibility notes

- `hlmDialogTitle` maps to `BrnDialogTitle` and `hlmDialogDescription` to `BrnDialogDescription`, wiring `aria-labelledby` / `aria-describedby` on the dialog — always include both.
- Focus is trapped inside the open dialog and restored to the trigger on close (brain behavior); escape closes by default.
- The built-in close button includes a visually-hidden `"close"` label plus the `lucideX` icon; keep `showCloseButton` unless you provide an equivalent labelled close control.
- The overlay is a separate `BrnDialogOverlay` element; screen-reader users hear the dialog role and label, not the backdrop.

## Theming / CSS variables

No component-specific CSS variables. The panel, overlay (`hlmDialogOverlayClass`), and `data-state` animations derive from global shadcn tokens (`--popover`, `--muted`, `--ring`, …). Extend via the `class` input on `hlm-dialog-content` / overlay or `contentClass` in `HlmDialogService.open`.

## Related subpaths

- `@egose/shadcn-theme-ng/alert-dialog` — blocking confirmation variant with explicit action/cancel slots.
- `@egose/shadcn-theme-ng/sheet` — side-anchored dialog alternative.
- `@egose/shadcn-theme-ng/drawer` — bottom/side swipeable panel built on the same brain dialog core.
- `@egose/shadcn-theme-ng/button` — `hlmBtn` triggers and footer actions.
