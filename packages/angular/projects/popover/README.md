# Popover (`@egose/shadcn-theme-ng/popover`)

Floating panel anchored to a button (shadcn/ui `popover` equivalent). Thin shadcn styling directives over the spartan-ng `BrnPopover` brain family: a stateful `hlm-popover` root, a `button[hlmPopoverTrigger]` opener, portal/content pieces for the floating panel, and header/title/description typography helpers.

Ships as `@egose/shadcn-theme-ng/popover` and `@egose/shadcn-theme-ng-tw/popover` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core` as peers plus a `tslib` runtime dependency; at runtime it uses `@spartan-ng/brain/popover` and `@spartan-ng/brain/core`. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmPopover, // directive: [hlmPopover],hlm-popover
  HlmPopoverTrigger, // directive: button[hlmPopoverTrigger],button[hlmPopoverTriggerFor]
  HlmPopoverPortal, // directive: [hlmPopoverPortal]
  HlmPopoverContent, // directive: [hlmPopoverContent],hlm-popover-content
  HlmPopoverHeader, // directive: [hlmPopoverHeader],hlm-popover-header
  HlmPopoverTitle, // directive: [hlmPopoverTitle]
  HlmPopoverDescription, // directive: [hlmPopoverDescription]
  HlmPopoverImports, // all seven above
  HlmPopoverModule, // NgModule wrapping HlmPopoverImports
} from '@egose/shadcn-theme-ng/popover';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmPopoverImports],
  template: `
    <hlm-popover>
      <button hlmPopoverTrigger type="button">Open</button>
      <hlm-popover-content *hlmPopoverPortal>
        <p>Hello</p>
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmPopoverModule } from '@egose/shadcn-theme-ng/popover';

@NgModule({ imports: [HlmPopoverModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/popover`. Symbol names are identical.

## Anatomy / Structure

```html
<hlm-popover>
  <!-- opener (must be a <button>) -->
  <button hlmPopoverTrigger type="button">Settings</button>

  <!-- floating panel: content styling + portal projection -->
  <hlm-popover-content *hlmPopoverPortal class="tw:w-80">
    <div hlmPopoverHeader>
      <h4 hlmPopoverTitle>Dimensions</h4>
      <p hlmPopoverDescription>Set the size of the layer.</p>
    </div>
    <!-- panel body -->
  </hlm-popover-content>
</hlm-popover>
```

The two-directive split on the panel is load-bearing: `hlmPopoverContent` paints the panel (fixed `w-72`, animations, `data-state` reflection), while `*hlmPopoverPortal` (a `BrnPopoverContent` host) projects it into the overlay at the anchored position. Always use them together as `hlm-popover-content *hlmPopoverPortal`.

| Class                   | Selector                                                 | Role                                                  |
| ----------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| `HlmPopover`            | `[hlmPopover],hlm-popover`                               | Stateful root (`BrnPopover` host)                     |
| `HlmPopoverTrigger`     | `button[hlmPopoverTrigger],button[hlmPopoverTriggerFor]` | Opener (`BrnPopoverTrigger` host; must be `<button>`) |
| `HlmPopoverPortal`      | `[hlmPopoverPortal]`                                     | Overlay projection (`BrnPopoverContent` host)         |
| `HlmPopoverContent`     | `[hlmPopoverContent],hlm-popover-content`                | Panel styling + `data-state` mirror                   |
| `HlmPopoverHeader`      | `[hlmPopoverHeader],hlm-popover-header`                  | Header stack (`flex flex-col gap-1 text-sm`)          |
| `HlmPopoverTitle`       | `[hlmPopoverTitle]`                                      | Title (`font-medium`)                                 |
| `HlmPopoverDescription` | `[hlmPopoverDescription]`                                | Subtitle (`text-muted-foreground`)                    |

## API reference

| Selector                                                               | Inputs (incl. host passthroughs)                                                                                         | Outputs                                     | Notes                                                                                                                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[hlmPopover],hlm-popover` (`HlmPopover`)                              | `align`, `attachTo`, `autoFocus`, `closeOnOutsidePointerEvents`, `offsetX`, `sideOffset`, `state` (all via `BrnPopover`) | `stateChanged`, `closed` (via `BrnPopover`) | No shadcn inputs of its own; `data-slot="popover"`                                                                                                          |
| `button[hlmPopoverTrigger]` (`HlmPopoverTrigger`)                      | `id`, `hlmPopoverTriggerFor` (→ `brnPopoverTriggerFor`), `type` (all via `BrnPopoverTrigger`)                            | —                                           | `data-slot="popover-trigger"`. `hlmPopoverTriggerFor` targets an explicit popover when the trigger lives outside the root                                   |
| `[hlmPopoverPortal]` (`HlmPopoverPortal`)                              | `context`, `class` (via `BrnPopoverContent`)                                                                             | —                                           | Structural directive (`*hlmPopoverPortal`); `class` merges onto the overlay panel                                                                           |
| `[hlmPopoverContent]` (`HlmPopoverContent`)                            | —                                                                                                                        | —                                           | Exposes `state` (brain state signal, default `signal('closed')`); mirrors it to `data-state` via `Renderer2` for the `data-open:`/`data-closed:` animations |
| `[hlmPopoverHeader]` / `[hlmPopoverTitle]` / `[hlmPopoverDescription]` | —                                                                                                                        | —                                           | Typography only                                                                                                                                             |

Panel styling (`HlmPopoverContent`): `bg-popover text-popover-foreground rounded-md p-4 text-sm shadow-md ring-1 ring-foreground/10 relative flex w-72 flex-col gap-4 outline-none` plus open/close zoom+fade animations keyed off `data-state`/`data-side`.

## Examples

### 1. Basic popover with header

```ts
import { Component } from '@angular/core';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-popover-basic',
  standalone: true,
  imports: [...HlmPopoverImports, HlmButton],
  template: `
    <hlm-popover>
      <button hlmPopoverTrigger hlmButton variant="secondary" appearance="outline" type="button">Open settings</button>
      <hlm-popover-content *hlmPopoverPortal>
        <div hlmPopoverHeader>
          <h4 hlmPopoverTitle>Dimensions</h4>
          <p hlmPopoverDescription>Set the size of the layer.</p>
        </div>
        <div class="tw:grid tw:gap-2 tw:text-sm">
          <label class="tw:grid tw:gap-1"
            >Width <input class="tw:border tw:rounded tw:px-2 tw:py-1" value="100%"
          /></label>
          <label class="tw:grid tw:gap-1"
            >Height <input class="tw:border tw:rounded tw:px-2 tw:py-1" value="24px"
          /></label>
        </div>
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class PopoverBasicComponent {}
```

### 2. Placement, offsets, and state events

```ts
import { Component, signal } from '@angular/core';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';

@Component({
  selector: 'app-popover-placement',
  standalone: true,
  imports: [...HlmPopoverImports],
  template: `
    <hlm-popover
      align="start"
      [sideOffset]="8"
      [closeOnOutsidePointerEvents]="true"
      (stateChanged)="open.set($event === 'open')"
      (closed)="open.set(false)"
    >
      <button hlmPopoverTrigger type="button">Aligned start, offset 8</button>
      <hlm-popover-content *hlmPopoverPortal>
        <p class="tw:text-sm">Panel state: {{ open() ? 'open' : 'closed' }}.</p>
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class PopoverPlacementComponent {
  readonly open = signal(false);
}
```

`align`, `sideOffset`, `closeOnOutsidePointerEvents` are brain inputs on `HlmPopover`; `stateChanged`/`closed` are its outputs.

### 3. Form inside a popover (template-driven)

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabelImports } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-popover-form',
  standalone: true,
  imports: [FormsModule, ...HlmPopoverImports, HlmInput, ...HlmLabelImports],
  template: `
    <hlm-popover>
      <button hlmPopoverTrigger type="button">Invite member</button>
      <hlm-popover-content *hlmPopoverPortal class="tw:w-80">
        <div hlmPopoverHeader>
          <h4 hlmPopoverTitle>Invite</h4>
          <p hlmPopoverDescription>They receive an email invitation.</p>
        </div>
        <div class="tw:grid tw:gap-1.5">
          <label hlmLabel for="invite-email">Email</label>
          <input hlmInput id="invite-email" [(ngModel)]="email" type="email" placeholder="ada@example.com" />
          <button type="button" (click)="invite()">Send invite</button>
        </div>
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class PopoverFormComponent {
  email = '';

  invite(): void {
    console.log('invite', this.email);
  }
}
```

### 4. Custom panel width via portal `class`

The portal's `class` input lands on the overlay host; the content directive keeps its own `w-72` unless you override it on the element as well.

```ts
import { Component } from '@angular/core';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';

@Component({
  selector: 'app-popover-wide',
  standalone: true,
  imports: [...HlmPopoverImports],
  template: `
    <hlm-popover>
      <button hlmPopoverTrigger type="button">Wide panel</button>
      <hlm-popover-content *hlmPopoverPortal class="tw:w-96">
        <div hlmPopoverHeader>
          <h4 hlmPopoverTitle>Preview</h4>
          <p hlmPopoverDescription>A wider panel for rich content.</p>
        </div>
        <div class="tw:grid tw:grid-cols-2 tw:gap-2 tw:text-sm">
          <div class="tw:rounded tw:bg-muted tw:p-2">Column A</div>
          <div class="tw:rounded tw:bg-muted tw:p-2">Column B</div>
        </div>
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class PopoverWideComponent {}
```

### 5. External trigger (`hlmPopoverTriggerFor`)

```ts
import { Component } from '@angular/core';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';

@Component({
  selector: 'app-popover-external',
  standalone: true,
  imports: [...HlmPopoverImports],
  template: `
    <hlm-popover #pop="hlmPopover">
      <hlm-popover-content *hlmPopoverPortal>
        <p class="tw:text-sm">Triggered from outside the root.</p>
      </hlm-popover-content>
    </hlm-popover>

    <button hlmPopoverTriggerFor [hlmPopoverTriggerFor]="pop" type="button">Open from here</button>
  `,
})
export class PopoverExternalComponent {}
```

> The exact template-ref export name follows the brain `BrnPopover` directive (`#pop="…"`) — verify against your installed `@spartan-ng/brain` version if the alias differs.

### 6. Async content + loading state

```ts
import { Component, signal } from '@angular/core';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';

@Component({
  selector: 'app-popover-async',
  standalone: true,
  imports: [...HlmPopoverImports],
  template: `
    <hlm-popover (stateChanged)="onState($event)">
      <button hlmPopoverTrigger type="button">Recent activity</button>
      <hlm-popover-content *hlmPopoverPortal>
        <div hlmPopoverHeader>
          <h4 hlmPopoverTitle>Activity</h4>
          <p hlmPopoverDescription>{{ loading() ? 'Loading…' : 'Last 3 events.' }}</p>
        </div>
        @for (e of events(); track e) {
          <p class="tw:text-sm">{{ e }}</p>
        } @empty {
          <p class="tw:text-sm tw:text-muted-foreground">Nothing yet.</p>
        }
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class PopoverAsyncComponent {
  readonly events = signal<string[]>([]);
  readonly loading = signal(false);

  async onState(state: string): Promise<void> {
    if (state !== 'open' || this.events().length) return;
    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 400));
    this.events.set(['Deploy succeeded', 'Review requested', 'Comment added']);
    this.loading.set(false);
  }
}
```

## Accessibility notes

- Triggers must be `<button>` (both selector variants require it) with a text label; the brain layer wires `aria-expanded`, `aria-controls`, and focus return.
- Keep a heading (`hlmPopoverTitle`) as the first element when the panel conveys a topic — screen-reader users land inside the panel on open.
- `autoFocus` (brain input) controls initial focus; form panels should focus the first field, read-only panels should keep focus on the trigger side and let users tab in.
- `Escape`/outside-pointer close comes from the brain defaults (`closeOnOutsidePointerEvents` is configurable); don't trap focus manually.

## Theming / CSS variables

No theming inputs. The panel uses `bg-popover text-popover-foreground ring-foreground/10`; header/title/description use text tokens. Widen via portal `class` (example 4); state-driven animations read the mirrored `data-state`.

## Related subpaths

- `@egose/shadcn-theme-ng/tooltip` — hover hint vs this component's click-anchored panel.
- `@egose/shadcn-theme-ng/dropdown-menu`, `@egose/shadcn-theme-ng/select` — menu/select overlays built on the same brain overlay concepts.
- `@egose/shadcn-theme-ng/input`, `@egose/shadcn-theme-ng/label` — form controls commonly hosted inside popover panels.
