# Sheet (`@egose/shadcn-theme-ng/sheet`)

A shadcn/ui-style **Sheet** — a slide-over panel (dialog) anchored to any screen edge. This is the Angular equivalent of shadcn/ui `Sheet` (`SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose`).

The overlay/focus-trap/dialog mechanics come from **spartan-ng/brain** (`BrnSheet`, `BrnSheetOverlay`, `BrnSheetClose`, `BrnSheetTitle`, `BrnSheetDescription`, `BrnDialog`). This package adds the shadcn shell: `HlmSheet` root (extends `BrnSheet`, renders the overlay + content outlet), `HlmSheetContent` with `side` variants (top/bottom/left/right, default right) plus a built-in close button, header/footer/title/description layout pieces, and overlay/close styling directives.

> **Ships as:** `@egose/shadcn-theme-ng/sheet` and `@egose/shadcn-theme-ng-tw/sheet` (the `tw:`-prefixed Tailwind variant — same API, class strings prefixed with `tw:`).
> See the [package README](../../README.md) for installation, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

```ts
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';
// tw variant:
// import { HlmSheetImports } from '@egose/shadcn-theme-ng-tw/sheet';
```

Peer dependencies (see [package README](../../README.md) for versions): `@angular/core`, `@angular/common`. Icons use `@ng-icons/lucide` (`lucideX` for the built-in close button), installed transitively.

## Imports

Real exported symbols (from `src/public-api.ts`):

| Symbol                | Kind                           | Selector                                                                       |
| --------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `HlmSheet`            | Component (extends `BrnSheet`) | `hlm-sheet` (`exportAs: 'hlmSheet'`)                                           |
| `HlmSheetContent`     | Component                      | `hlm-sheet-content`                                                            |
| `HlmSheetHeader`      | Component                      | `hlm-sheet-header`                                                             |
| `HlmSheetFooter`      | Component                      | `hlm-sheet-footer`                                                             |
| `HlmSheetTitle`       | Directive                      | `[hlmSheetTitle]`                                                              |
| `HlmSheetDescription` | Directive                      | `[hlmSheetDescription]`                                                        |
| `HlmSheetOverlay`     | Directive                      | `[hlmSheetOverlay],brn-sheet-overlay[hlm]`                                     |
| `HlmSheetClose`       | Directive                      | `[hlmSheetClose],[brnSheetClose][hlm]`                                         |
| `sheetVariants`       | `cva`                          | Side-variant class builder (`top \| bottom \| left \| right`, default `right`) |
| `HlmSheetImports`     | `const` array                  | All components/directives above, for standalone `imports`                      |
| `HlmSheetModule`      | `NgModule`                     | NgModule wrapper re-exporting all of the above                                 |

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [HlmSheetImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmSheetModule } from '@egose/shadcn-theme-ng/sheet';

@NgModule({ imports: [HlmSheetModule] })
export class DemoModule {}
```

## Anatomy / Structure

The `HlmSheet` root renders `<brn-sheet-overlay hlm />` plus your projected content. `HlmSheetContent` must be projected with the brain structural directive `*brnSheetContent` so it opens/closes with dialog state; the trigger uses `*brnSheetTrigger`:

```html
<hlm-sheet>
  <button hlmButton *brnSheetTrigger>Edit profile</button>

  <hlm-sheet-content *brnSheetContent="let ctx">
    <hlm-sheet-header>
      <h2 hlmSheetTitle>Edit profile</h2>
      <p hlmSheetDescription>Update your details. Click save when done.</p>
    </hlm-sheet-header>

    <div class="tw:px-4">...form fields...</div>

    <hlm-sheet-footer>
      <button hlmButton brnSheetClose hlmSheetClose>Save</button>
      <button hlmButton variant="outline" brnSheetClose hlmSheetClose>Cancel</button>
    </hlm-sheet-footer>
  </hlm-sheet-content>
</hlm-sheet>
```

Real selectors:

| Selector                                   | Class                 | Notes                                                                                        |
| ------------------------------------------ | --------------------- | -------------------------------------------------------------------------------------------- |
| `hlm-sheet`                                | `HlmSheet`            | Root; template = overlay + `<ng-content />`; provides itself as `BrnDialog`/`BrnSheet`       |
| `hlm-sheet-content`                        | `HlmSheetContent`     | Sliding panel; auto close (X) button; `data-state` reflects open/closed                      |
| `hlm-sheet-header`                         | `HlmSheetHeader`      | Column layout, padded                                                                        |
| `hlm-sheet-footer`                         | `HlmSheetFooter`      | Bottom-pinned column (`mt-auto`), padded                                                     |
| `[hlmSheetTitle]`                          | `HlmSheetTitle`       | Semibold title; forwards `BrnSheetTitle` (accessible dialog name)                            |
| `[hlmSheetDescription]`                    | `HlmSheetDescription` | Muted small description; forwards `BrnSheetDescription`                                      |
| `[hlmSheetOverlay],brn-sheet-overlay[hlm]` | `HlmSheetOverlay`     | Dimmed backdrop with fade animations                                                         |
| `[hlmSheetClose],[brnSheetClose][hlm]`     | `HlmSheetClose`       | Close-button styling (absolute top-right); apply on an element that also has `brnSheetClose` |

## API reference

### HlmSheet (component)

Extends `BrnSheet`, so every `BrnSheet`/`BrnDialog` input/output (e.g. `state`, `stateChanged`, `side` where supported) is available on the host. Own template: `<brn-sheet-overlay hlm />` + content outlet. `exportAs: 'hlmSheet'` for `#sheet="hlmSheet"` references.

### HlmSheetContent (component)

| Input                 | Type         | Default | Description                                                           |
| --------------------- | ------------ | ------- | --------------------------------------------------------------------- |
| `class` (`userClass`) | `ClassValue` | `''`    | Extra classes appended to the `sheetVariants({ side })` panel classes |

The `side` comes from the exposed-side provider of the enclosing brain sheet context (`injectExposedSideProvider`); the open state comes from `injectExposesStateProvider` and is mirrored to `data-state`. Side classes via the exported `sheetVariants` cva:

| `side`            | Placement                                                          |
| ----------------- | ------------------------------------------------------------------ |
| `right` (default) | Right edge, full height, `w-3/4 sm:max-w-sm`, slides in from right |
| `left`            | Left edge, mirrored                                                |
| `top`             | Top edge, full width, auto height, bottom border                   |
| `bottom`          | Bottom edge, full width, auto height, top border                   |

The built-in close button (`<button brnSheetClose hlm>` with `lucideX` icon + sr-only "Close") is always rendered — add `class="...hidden"` overrides or your own close controls as needed; you cannot remove it via input.

### HlmSheetHeader / HlmSheetFooter / HlmSheetTitle / HlmSheetDescription

Layout-only (header: `flex flex-col gap-1.5 p-4`; footer: `mt-auto flex flex-col gap-2 p-4`) plus a `class` (`userClass`) input each. Title forwards `BrnSheetTitle`, description forwards `BrnSheetDescription` — always include a title so the dialog has an accessible name.

### HlmSheetOverlay / HlmSheetClose (directives)

Styling-only, each with a `class` (`userClass`) input. `HlmSheetOverlay` pushes its computed class into a custom-class-settable host when present (brain overlay interop). `HlmSheetClose` positions the button absolutely top-right with the subtle-opacity hover treatment — it must sit on an element that also closes the sheet (`brnSheetClose`).

## Examples

### 1. Basic right-side sheet

```ts
import { Component } from '@angular/core';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';

@Component({
  selector: 'app-basic-sheet',
  standalone: true,
  imports: [BrnSheetImports, HlmButtonImports, HlmSheetImports],
  template: `
    <hlm-sheet>
      <button hlmButton variant="outline" *brnSheetTrigger>Open sheet</button>

      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h2 hlmSheetTitle>Notifications</h2>
          <p hlmSheetDescription>You have 3 unread messages.</p>
        </hlm-sheet-header>
        <div class="tw:px-4 tw:text-sm">Sheet body…</div>
        <hlm-sheet-footer>
          <button hlmButton brnSheetClose hlmSheetClose>Done</button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class BasicSheetComponent {}
```

(`*brnSheetTrigger` / `*brnSheetContent` come from `BrnSheetImports` — import that alongside `HlmSheetImports`.)

### 2. All four sides

```html
<hlm-sheet [side]="'left'">
  <button hlmButton *brnSheetTrigger>Left nav</button>
  <hlm-sheet-content *brnSheetContent="let ctx">
    <hlm-sheet-header>
      <h2 hlmSheetTitle>Menu</h2>
    </hlm-sheet-header>
  </hlm-sheet-content>
</hlm-sheet>

<!-- side="top" | side="bottom" work the same; omit for the default right -->
```

`side` is read by `HlmSheetContent` through the exposed-side provider, and `sheetVariants({ side })` drives the slide animation direction.

### 3. Form sheet with footer actions

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmInputImports } from '@egose/shadcn-theme-ng/input';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';

@Component({
  selector: 'app-form-sheet',
  standalone: true,
  imports: [BrnSheetImports, FormsModule, HlmButtonImports, HlmInputImports, HlmLabelImports, HlmSheetImports],
  template: `
    <hlm-sheet>
      <button hlmButton *brnSheetTrigger>Edit profile</button>
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h2 hlmSheetTitle>Edit profile</h2>
          <p hlmSheetDescription>Changes save when you click Save.</p>
        </hlm-sheet-header>

        <div class="tw:grid tw:gap-4 tw:px-4">
          <div class="tw:grid tw:gap-2">
            <label hlmLabel for="sheet-name">Name</label>
            <input hlmInput id="sheet-name" [(ngModel)]="name" name="name" />
          </div>
        </div>

        <hlm-sheet-footer>
          <button hlmButton (click)="save(ctx)">Save</button>
          <button hlmButton variant="outline" brnSheetClose hlmSheetClose>Cancel</button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class FormSheetComponent {
  name = 'Ada';

  save(ctx: { close: () => void }): void {
    console.log('saving', this.name);
    ctx.close();
  }
}
```

### 4. Programmatic open/close via exportAs

```html
<hlm-sheet #sheet="hlmSheet" [state]="state">
  <hlm-sheet-content *brnSheetContent="let ctx">
    <hlm-sheet-header>
      <h2 hlmSheetTitle>Controlled</h2>
      <p hlmSheetDescription>Opened from code.</p>
    </hlm-sheet-header>
    <hlm-sheet-footer>
      <button hlmButton (click)="state = 'closed'">Close from code</button>
    </hlm-sheet-footer>
  </hlm-sheet-content>
</hlm-sheet>

<button hlmButton (click)="state = 'open'">Open from code</button>
```

### 5. Custom close affordances with `hlmSheetClose`

```html
<hlm-sheet-content *brnSheetContent="let ctx">
  <hlm-sheet-header>
    <h2 hlmSheetTitle>Confirm delete</h2>
    <p hlmSheetDescription>This action cannot be undone.</p>
  </hlm-sheet-header>

  <hlm-sheet-footer>
    <button hlmButton variant="destructive" brnSheetClose hlmSheetClose>Delete</button>
    <button hlmButton variant="ghost" brnSheetClose hlmSheetClose>Keep it</button>
  </hlm-sheet-footer>
</hlm-sheet-content>
```

`brnSheetClose` does the closing; `hlmSheetClose` only styles. You can also put `hlmSheetClose` on any absolutely-positioned custom close button.

### 6. Wide / custom-sized content with `sheetVariants`

```ts
import { Component } from '@angular/core';
import { sheetVariants } from '@egose/shadcn-theme-ng/sheet';

@Component({ selector: 'app-wide-sheet', template: '' })
export class WideSheetComponent {
  // Reuse the exact variant builder for a custom panel:
  protected readonly panelClass = sheetVariants({ side: 'right' });
}
```

```html
<hlm-sheet-content *brnSheetContent="let ctx" class="tw:sm:max-w-lg"> ... </hlm-sheet-content>
```

`userClass` merges after the variant classes, so `tw:sm:max-w-lg` widens the default `sm:max-w-sm` panel.

## Accessibility notes

- Always include `hlmSheetTitle` — it forwards `BrnSheetTitle` and gives the dialog its accessible name. Add `hlmSheetDescription` for context.
- Focus is trapped inside the open sheet and returned to the trigger on close (brain dialog behavior); keep the trigger in the DOM and don't unmount the sheet while open.
- The overlay click + `Escape` dismiss via brain defaults; destructive flows should still require an explicit footer confirmation, not overlay dismissal alone.
- The built-in X button has an sr-only "Close" label — if you hide it, provide another labelled close control.

## Theming / CSS variables

Class-driven (`bg-background` panel, `bg-black/50` overlay, border tokens). Animate via the `data-[state=open|closed]` attributes if you customize transitions. Dark mode follows the theme tokens.

## Related subpaths

- `@egose/shadcn-theme-ng/dialog` — centered modal counterpart
- `@egose/shadcn-theme-ng/drawer` — bottom-anchored mobile-style panel counterpart
- `@egose/shadcn-theme-ng/sidebar` — persistent app navigation (uses `hlm-sheet` internally on mobile)
- `@egose/shadcn-theme-ng/button` — triggers and footer actions
