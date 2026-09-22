# Sonner (`@egose/shadcn-theme-ng/sonner`)

Toast notifications for Angular, styled like [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/sonner). This subpath ships a single standalone component, `HlmToaster`, which is a thin shadcn-styled wrapper around the `NgxSonnerToaster` component from [`ngx-sonner`](https://github.com/adamwathan/ngx-sonner) (the Angular port of [sonner](https://sonner.emilkowal.ski/)). Place one `<hlm-toaster />` at your app root, then fire toasts imperatively with the `toast()` helpers from `ngx-sonner`.

> **Ships as:** `@egose/shadcn-theme-ng/sonner` and `@egose/shadcn-theme-ng-tw/sonner` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

This library has no extra runtime install beyond the package itself — `ngx-sonner` is installed transitively. See the [package README](../../README.md) for the full peer-dependency table (`@angular/core`, `@angular/common`, `@spartan-ng/brain`, `rxjs`, etc.) and the Tailwind variant contract.

> You call `toast()`, `toast.success()`, etc. from the **`ngx-sonner`** package, not from this subpath. This subpath only provides the styled `<hlm-toaster />` outlet component.

## Imports

All public symbols are re-exported from `projects/sonner/src/public-api.ts`:

```ts
import { HlmToaster, HlmToasterImports, HlmToasterModule } from '@egose/shadcn-theme-ng/sonner';
// tw variant:
// import { HlmToaster, HlmToasterImports, HlmToasterModule } from '@egose/shadcn-theme-ng-tw/sonner';
```

Standalone-component usage (preferred):

```ts
import { Component } from '@angular/core';
import { HlmToasterImports } from '@egose/shadcn-theme-ng/sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...HlmToasterImports],
  template: `<hlm-toaster />`,
})
export class AppComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmToasterModule } from '@egose/shadcn-theme-ng/sonner';

@NgModule({ imports: [HlmToasterModule] })
export class AppModule {}
```

| Symbol              | Kind                 | Description                                      |
| ------------------- | -------------------- | ------------------------------------------------ |
| `HlmToaster`        | Standalone component | The `<hlm-toaster>` outlet. Renders toasts.      |
| `HlmToasterImports` | `const` array        | `[HlmToaster]` — spread into `imports: [...]`.   |
| `HlmToasterModule`  | NgModule             | Imports + re-exports `HlmToaster` for NgModules. |

## Anatomy / Structure

Render exactly one toaster outlet, typically in `AppComponent`:

```html
<!-- app.component.html -->
<hlm-toaster />
<router-outlet />
```

With common options:

```html
<hlm-toaster
  theme="system"
  position="top-center"
  [richColors]="true"
  [expand]="true"
  [closeButton]="true"
  [duration]="5000"
  [visibleToasts]="5"
/>
```

The component template forwards everything to `<ngx-sonner-toaster>` internally — you never write `<ngx-sonner-toaster>` yourself.

## API reference

### `HlmToaster` — selector `hlm-toaster` (component)

All inputs are Angular signal `input()`s mirroring `ToasterProps` from `ngx-sonner`.

| Input           | Type                                                              | Default                                                                                                                                                                                                               | Description                                                                                                     |
| --------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `invert`        | `boolean` (coerced with `booleanAttribute`)                       | `false`                                                                                                                                                                                                               | Dark mode inversion.                                                                                            |
| `theme`         | `ToasterProps['theme']` (`'light' \| 'dark' \| 'system'` approx.) | `'light'`                                                                                                                                                                                                             | Color theme of the toasts.                                                                                      |
| `position`      | `ToasterProps['position']`                                        | `'bottom-right'`                                                                                                                                                                                                      | Screen corner/edge: e.g. `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. |
| `hotKey`        | `ToasterProps['hotkey']` (`string[]`)                             | `['altKey', 'KeyT']`                                                                                                                                                                                                  | Hotkey that focuses/expands toasts.                                                                             |
| `richColors`    | `boolean` (coerced)                                               | `false`                                                                                                                                                                                                               | Success/error color accents.                                                                                    |
| `expand`        | `boolean` (coerced)                                               | `false`                                                                                                                                                                                                               | Expand all toasts by default (else stacked).                                                                    |
| `duration`      | `number` (coerced with `numberAttribute`)                         | `4000`                                                                                                                                                                                                                | Default toast lifetime in ms.                                                                                   |
| `visibleToasts` | `number` (coerced)                                                | `3`                                                                                                                                                                                                                   | Max simultaneously visible toasts.                                                                              |
| `closeButton`   | `boolean` (coerced)                                               | `false`                                                                                                                                                                                                               | Show an × close button on every toast.                                                                          |
| `toastOptions`  | `ToasterProps['toastOptions']`                                    | `{ classes: { toast: 'group toast group-[.toaster]:bg-background …', description: 'group-[.toast]:text-muted-foreground', actionButton: 'group-[.toast]:bg-primary …', cancelButton: 'group-[.toast]:bg-muted …' } }` | Per-toast default options + shadcn class overrides.                                                             |
| `offset`        | `ToasterProps['offset']`                                          | `null`                                                                                                                                                                                                                | Pixel offset from the viewport edge.                                                                            |
| `dir`           | `ToasterProps['dir']`                                             | `'auto'`                                                                                                                                                                                                              | Text direction (`auto` / `ltr` / `rtl`).                                                                        |
| `class`         | `ClassValue` (aliased input `userClass`)                          | `''`                                                                                                                                                                                                                  | Extra classes merged via `hlm('toaster group', …)` onto the outlet.                                             |
| `style`         | `Record<string, string>` (aliased input `userStyle`)              | `{}`                                                                                                                                                                                                                  | Inline styles forwarded to `ngx-sonner-toaster`.                                                                |

No outputs, no methods. The host element gets computed class `toaster group` (+ your `class`).

> `toast()`, `toast.success()`, `toast.error()`, `toast.promise()`, `toast.dismiss()` etc. are imported from **`ngx-sonner`**, not from this subpath:
>
> ```ts
> import { toast } from 'ngx-sonner';
> ```

## Examples

### 1. Basic setup + plain toast

Add the outlet once at the app root.

```ts
// app.component.ts
import { Component } from '@angular/core';
import { HlmToasterImports } from '@egose/shadcn-theme-ng/sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...HlmToasterImports],
  template: `
    <hlm-toaster />
    <router-outlet />
  `,
})
export class AppComponent {}
```

Fire a toast from anywhere:

```ts
// demo.component.ts
import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-basic',
  standalone: true,
  imports: [HlmButton],
  template: `<button hlmBtn (click)="notify()">Show toast</button>`,
})
export class DemoBasic {
  notify() {
    toast('Event created', { description: 'Your event is now live.' });
  }
}
```

### 2. Success / error / warning states

```ts
// demo-states.component.ts
import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-states',
  standalone: true,
  imports: [...HlmButtonImports],
  template: `
    <div class="flex gap-2">
      <button hlmBtn variant="default" (click)="ok()">Success</button>
      <button hlmBtn variant="destructive" (click)="fail()">Error</button>
      <button hlmBtn variant="secondary" (click)="warn()">Warning</button>
      <button hlmBtn variant="outline" (click)="info()">Info</button>
    </div>
  `,
})
export class DemoStates {
  ok() {
    toast.success('Profile saved', { description: 'Your changes are live.' });
  }
  fail() {
    toast.error('Upload failed', { description: 'File exceeds 10 MB.' });
  }
  warn() {
    toast.warning('Session expiring', { description: 'You will be logged out in 2 minutes.' });
  }
  info() {
    toast.info('New version', { description: 'Refresh to get the latest UI.' });
  }
}
```

### 3. Positions, themes, rich colors

```html
<!-- Top-center, system theme, colored toasts with close buttons -->
<hlm-toaster position="top-center" theme="system" [richColors]="true" [closeButton]="true" [expand]="true" />
```

```ts
import { Component, signal } from '@angular/core';
import { HlmToasterImports } from '@egose/shadcn-theme-ng/sonner';

@Component({
  selector: 'demo-position',
  standalone: true,
  imports: [...HlmToasterImports],
  template: ` <hlm-toaster [position]="position()" theme="dark" [visibleToasts]="5" /> `,
})
export class DemoPosition {
  // 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  readonly position = signal<'top-center'>('top-center');
}
```

### 4. Actions, cancellation, and durations

```ts
// demo-actions.component.ts
import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'demo-actions',
  standalone: true,
  imports: [...HlmButtonImports],
  template: `
    <div class="flex gap-2">
      <button hlmBtn (click)="withAction()">Undoable delete</button>
      <button hlmBtn variant="outline" (click)="sticky()">Sticky toast</button>
      <button hlmBtn variant="ghost" (click)="dismissAll()">Dismiss all</button>
    </div>
  `,
})
export class DemoActions {
  withAction() {
    toast('Conversation archived', {
      description: 'You can undo this within 10 seconds.',
      duration: 10000,
      action: { label: 'Undo', onClick: () => toast.success('Restored') },
      cancel: { label: 'Dismiss', onClick: () => {} },
    });
  }
  sticky() {
    toast('Sync paused — offline', { duration: Infinity, closeButton: true });
  }
  dismissAll() {
    toast.dismiss();
  }
}
```

### 5. Async / promise toasts (loading → success → error)

```ts
// demo-promise.component.ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmSpinnerImports } from '@egose/shadcn-theme-ng/spinner';

@Component({
  selector: 'demo-promise',
  standalone: true,
  imports: [...HlmButtonImports, ...HlmSpinnerImports],
  template: `<button hlmBtn (click)="save()">Save report</button>`,
})
export class DemoPromise {
  private readonly http = inject(HttpClient);

  save() {
    const request = this.http.post('/api/reports', { title: 'Q3' }).toPromise();
    toast.promise(request, {
      loading: 'Saving report…',
      success: 'Report saved',
      error: 'Could not save report',
    });
  }
}
```

Combine with a spinner while the promise is pending by driving `show` from a signal — see `@egose/shadcn-theme-ng/spinner`.

### 6. Custom styling via `toastOptions`, `class`, and `style`

```ts
// app.component.ts
import { Component } from '@angular/core';
import { HlmToasterImports } from '@egose/shadcn-theme-ng/sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...HlmToasterImports],
  template: ` <hlm-toaster class="my-toaster" [toastOptions]="toastOptions" [offset]="24" dir="ltr" /> `,
})
export class AppComponent {
  readonly toastOptions = {
    classes: {
      toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground',
      description: 'group-[.toast]:text-muted-foreground',
      actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
      cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
    },
    // per-toast defaults can also set duration/style here
    duration: 6000,
  };
}
```

Per-toast override (description + action button classes come from `toastOptions.classes` above unless overridden):

```ts
toast('Custom toast', {
  description: 'This toast uses the global toastOptions classes.',
  className: 'border-primary',
  style: { borderWidth: '2px' },
});
```

## Accessibility notes

- `ngx-sonner` renders toasts in an `aria-live` region so screen readers announce them; keep messages short and put detail in `description`.
- Always pair an icon-only trigger with visible text or an `aria-label` on the button that fires the toast.
- Do not use toasts as the only feedback for errors on form submit — also surface the error inline near the field (the `description` alone is not focusable).
- `duration: Infinity` toasts trap no focus but persist; always provide a `closeButton` or explicit dismiss action for sticky toasts.
- Hotkey defaults to `Alt+T` (`hotKey` input); document it if your app relies on keyboard flows, or override it to avoid conflicts.

## Theming / CSS variables

The outlet merges `hlm('toaster group', userClass)` and ships `toastOptions.classes` mapped onto shadcn theme tokens (`bg-background`, `text-foreground`, `border-border`, `bg-primary`, `bg-muted`, …). It follows your shadcn CSS-variable theme automatically. Override via the `class` input (outlet position/layout) or `toastOptions.classes` (toast/description/action/cancel styling).

## Related subpaths

- `@egose/shadcn-theme-ng/button` — trigger buttons for toast demos.
- `@egose/shadcn-theme-ng/spinner` — loading indicator to pair with `toast.promise()`.
- `@egose/shadcn-theme-ng/alert` / `@egose/shadcn-theme-ng/basic-alert` — persistent inline feedback (vs. transient toasts).
- `@egose/shadcn-theme-ng/utils` — `hlm()` merger used internally for outlet classes.
