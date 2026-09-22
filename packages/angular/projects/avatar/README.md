# Avatar (`@egose/shadcn-theme-ng/avatar`)

A user identity image in the shadcn/ui Avatar style: a rounded photo that degrades gracefully to
initials (or any fallback) while the image loads or when it fails, with optional status badges and
overlapping group stacks.

The implementation styles the headless `BrnAvatar*` primitives from
`@spartan-ng/brain/avatar`. `HlmAvatar` is a component extending `BrnAvatar` that projects
`[hlmAvatarImage]` when the image `canShow()` and `[hlmAvatarFallback]` otherwise;
`HlmAvatarImage` / `HlmAvatarFallback` add brain image/fallback behavior plus shadcn sizing.
`HlmAvatarBadge`, `HlmAvatarGroup`, and `HlmAvatarGroupCount` are pure layout directives with no
brain dependency.

> **Ships as:** `@egose/shadcn-theme-ng/avatar` and `@egose/shadcn-theme-ng-tw/avatar`
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
[package README](../../README.md#peer-dependencies). Runtime styling helper:
`@egose/shadcn-theme-ng/utils` (`classes()`).

## Imports

All symbols are exported from the subpath root (`projects/avatar/src/public-api.ts`):

```ts
import {
  HlmAvatar,
  HlmAvatarImage,
  HlmAvatarFallback,
  HlmAvatarBadge,
  HlmAvatarGroup,
  HlmAvatarGroupCount,
  HlmAvatarImports,
  HlmAvatarModule,
} from '@egose/shadcn-theme-ng/avatar';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/avatar'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmAvatarImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmAvatarModule } from '@egose/shadcn-theme-ng/avatar';

@NgModule({ imports: [HlmAvatarModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<hlm-avatar size="default">
  <img hlmAvatarImage src="user.jpg" alt="Ada Lovelace" />
  <span hlmAvatarFallback>AL</span>
  <span hlm-avatar-badge></span>
</hlm-avatar>

<div hlmAvatarGroup>
  <hlm-avatar>…</hlm-avatar>
  <hlm-avatar>…</hlm-avatar>
  <span hlmAvatarGroupCount>+3</span>
</div>
```

Real selectors (from source):

| Class                 | Selector(s)                                           | Kind      |
| --------------------- | ----------------------------------------------------- | --------- |
| `HlmAvatar`           | `hlm-avatar`                                          | Component |
| `HlmAvatarImage`      | `img[hlmAvatarImage]` (`exportAs: hlmAvatarImage`)    | Directive |
| `HlmAvatarFallback`   | `[hlmAvatarFallback]` (`exportAs: hlmAvatarFallback`) | Directive |
| `HlmAvatarBadge`      | `[hlmAvatarBadge], hlm-avatar-badge`                  | Directive |
| `HlmAvatarGroup`      | `[hlmAvatarGroup], hlm-avatar-group`                  | Directive |
| `HlmAvatarGroupCount` | `[hlmAvatarGroupCount], hlm-avatar-group-count`       | Directive |

Projection rules inside `HlmAvatar` (from its template): the image slot only renders while
`_image()?.canShow()` is true and selects `[hlmAvatarImage],[brnAvatarImage]`; otherwise the
fallback slot (`[hlmAvatarFallback],[brnAvatarFallback]`) renders. Untagged `<ng-content />`
(such as the badge) always renders.

## API reference

### `HlmAvatar` — `hlm-avatar`

Component extending `BrnAvatar` (full brain surface inherited).

| Input  | Type                        | Default     | Description                                                                                                    |
| ------ | --------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | `default` → `size-8`, `sm` → `size-6`, `lg` → `size-10`; reflected as `data-size`, which badge styles key off. |

### `HlmAvatarImage` — `img[hlmAvatarImage]`

Directive on a native `<img>` wrapping `BrnAvatarImage` (load/error tracking inherited).

| Member    | Kind                                                 | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `canShow` | `Signal<boolean>` (re-exposed from `BrnAvatarImage`) | Whether the image has loaded and may display. |

No own inputs — `src`/`alt` are the native img attributes.

### `HlmAvatarFallback` — `[hlmAvatarFallback]`

Thin wrapper around `BrnAvatarFallback`. No own inputs; renders initials/text centered in the
muted circle.

### `HlmAvatarBadge` — `[hlmAvatarBadge], hlm-avatar-badge`

Status dot pinned to the avatar's bottom-right (`absolute right-0 bottom-0`, ring-separated).
Sizing follows the parent avatar's `data-size` (`size-2` on `sm`, `size-2.5` on `default`,
`size-3` on `lg`). No inputs — put an `ng-icon` or plain dot inside.

### `HlmAvatarGroup` — `[hlmAvatarGroup], hlm-avatar-group`

Overlapping stack (`flex -space-x-2`, each child avatar ringed). No inputs.

### `HlmAvatarGroupCount` — `[hlmAvatarGroupCount], hlm-avatar-group-count`

The "+N" overflow pill. Sizing follows the parent group's `data-size` when present. No inputs.

## Examples

### 1. Basic avatar with image + initials fallback

```ts
import { Component } from '@angular/core';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-basic',
  standalone: true,
  imports: [...HlmAvatarImports],
  template: `
    <hlm-avatar>
      <img hlmAvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <span hlmAvatarFallback>CN</span>
    </hlm-avatar>
  `,
})
export class AvatarBasicComponent {}
```

```html
<app-avatar-basic />
```

### 2. All sizes

```ts
import { Component } from '@angular/core';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-sizes',
  standalone: true,
  imports: [...HlmAvatarImports],
  template: `
    <div class="tw:flex tw:items-center tw:gap-4">
      <hlm-avatar size="sm">
        <img hlmAvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <span hlmAvatarFallback>SM</span>
      </hlm-avatar>
      <hlm-avatar size="default">
        <img hlmAvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <span hlmAvatarFallback>MD</span>
      </hlm-avatar>
      <hlm-avatar size="lg">
        <img hlmAvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <span hlmAvatarFallback>LG</span>
      </hlm-avatar>
    </div>
  `,
})
export class AvatarSizesComponent {}
```

### 3. Fallback-only (no image) and broken-image degradation

When no `<img>` succeeds, the fallback shows automatically — useful for new users without photos:

```ts
import { Component } from '@angular/core';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-fallback',
  standalone: true,
  imports: [...HlmAvatarImports],
  template: `
    <div class="tw:flex tw:items-center tw:gap-4">
      <!-- initials only -->
      <hlm-avatar>
        <span hlmAvatarFallback>JD</span>
      </hlm-avatar>
      <!-- broken src degrades to fallback via canShow() -->
      <hlm-avatar>
        <img hlmAvatarImage src="/does-not-exist.png" alt="Missing photo" />
        <span hlmAvatarFallback>ER</span>
      </hlm-avatar>
    </div>
  `,
})
export class AvatarFallbackComponent {}
```

### 4. Status badge (online/offline dot)

```ts
import { Component } from '@angular/core';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-badge',
  standalone: true,
  imports: [...HlmAvatarImports],
  template: `
    <div class="tw:flex tw:items-center tw:gap-4">
      <hlm-avatar>
        <img hlmAvatarImage src="https://github.com/shadcn.png" alt="Online user" />
        <span hlmAvatarFallback>ON</span>
        <span hlm-avatar-badge class="tw:bg-success"></span>
      </hlm-avatar>
      <hlm-avatar size="lg">
        <span hlmAvatarFallback>OF</span>
        <span hlmAvatarBadge class="tw:bg-muted-foreground"></span>
      </hlm-avatar>
    </div>
  `,
})
export class AvatarBadgeComponent {}
```

### 5. Avatar group with overflow count

```ts
import { Component, signal } from '@angular/core';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-group',
  standalone: true,
  imports: [...HlmAvatarImports],
  template: `
    <div hlmAvatarGroup>
      @for (m of visible(); track m.initials) {
        <hlm-avatar>
          @if (m.src) {
            <img hlmAvatarImage [src]="m.src" [alt]="m.name" />
          }
          <span hlmAvatarFallback>{{ m.initials }}</span>
        </hlm-avatar>
      }
      @if (overflow() > 0) {
        <span hlmAvatarGroupCount>+{{ overflow() }}</span>
      }
    </div>
  `,
})
export class AvatarGroupComponent {
  private readonly members = signal([
    { name: 'Ada Lovelace', initials: 'AL', src: '' },
    { name: 'Grace Hopper', initials: 'GH', src: '' },
    { name: 'Katherine Johnson', initials: 'KJ', src: '' },
    { name: 'Radia Perlman', initials: 'RP', src: '' },
    { name: 'Lynn Conway', initials: 'LC', src: '' },
  ]);
  readonly visible = () => this.members().slice(0, 3);
  readonly overflow = () => this.members().length - 3;
}
```

### 6. Data-driven directory with badge icons

Badges can host an `ng-icon` (sized automatically per avatar size):

```ts
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-directory',
  standalone: true,
  imports: [...HlmAvatarImports, NgIcon],
  providers: [provideIcons({ lucideCheck })],
  template: `
    <ul class="tw:flex tw:flex-col tw:gap-3">
      @for (u of users(); track u.email) {
        <li class="tw:flex tw:items-center tw:gap-3">
          <hlm-avatar size="sm">
            @if (u.src) {
              <img hlmAvatarImage [src]="u.src" [alt]="u.name" />
            }
            <span hlmAvatarFallback>{{ u.initials }}</span>
            @if (u.verified) {
              <span hlm-avatar-badge><ng-icon name="lucideCheck" /></span>
            }
          </hlm-avatar>
          <div>
            <p class="tw:text-sm tw:font-medium">{{ u.name }}</p>
            <p class="tw:text-xs tw:text-muted-foreground">{{ u.email }}</p>
          </div>
        </li>
      }
    </ul>
  `,
})
export class AvatarDirectoryComponent {
  readonly users = signal([
    { name: 'Ada Lovelace', email: 'ada@example.com', initials: 'AL', src: '', verified: true },
    { name: 'Alan Turing', email: 'alan@example.com', initials: 'AT', src: '', verified: false },
  ]);
}
```

## Accessibility notes

- The `<img>` **must** carry a meaningful `alt` (person's name). When only initials show, keep the
  fallback text itself meaningful (`AL`, not `?`) — it is what screen readers announce.
- Badges are decorative status dots: hide icon-only badges from assistive technology or mirror the
  status in adjacent text ("Online"), since color alone is not perceivable by everyone.
- Group overflow (`+3`) is plain text — ensure the full member list is reachable nearby (tooltip,
  popover, or link) so keyboard/screen-reader users are not locked out of hidden members.

## Theming / CSS variables

Class-based styling (muted fallback, primary badge, background ring tokens); no
component-specific CSS variables. Avatar and group `data-size` attributes drive the badge/count
sizing, so custom sizes compose by targeting those attributes in your own CSS.

## Related subpaths

- `@egose/shadcn-theme-ng/badge` — textual status chips to pair with avatars
- `@egose/shadcn-theme-ng/tooltip` — full member names / status on hover
- `@egose/shadcn-theme-ng/hover-card` — profile previews anchored to avatars
- `@egose/shadcn-theme-ng/skeleton` — avatar-shaped loading placeholders
