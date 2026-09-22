# Item (`@egose/shadcn-theme-ng/item`)

`Item` is a set of composable row primitives for stacked list content — settings rows, task lists, notification feeds, dropdown-menu content — the shadcn/ui _Item_ equivalent. The `hlmItem` container lays out media, content (title + description), and actions in one wrapping flex row; `hlmItemGroup` stacks rows; header/footer, separator, and cva `variant`/`size` props cover the rest. All styling-only directives except the separator (spartan-ng `BrnSeparator`).

> **Ships as:** `@egose/shadcn-theme-ng/item` (plain Tailwind) and `@egose/shadcn-theme-ng-tw/item` (`tw:`-prefixed variant). See the [package README](../../README.md) for installation, peer dependencies, and the Tailwind-variant contract. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, CDK, `@spartan-ng/brain`, `rxjs`) are documented in the [package README](../../README.md#peer-dependencies).

```ts
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';
// tw variant:
// import { HlmItemImports } from '@egose/shadcn-theme-ng-tw/item';
```

## Imports

```ts
// Standalone component — spread the imports array:
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';

@Component({
  standalone: true,
  imports: [HlmItemImports],
  template: `
    <div hlmItemGroup>
      <div hlmItem>
        <div hlmItemMedia variant="icon">…</div>
        <div hlmItemContent>
          <p hlmItemTitle>Title</p>
          <p hlmItemDescription>Description</p>
        </div>
        <div hlmItemActions>…</div>
      </div>
    </div>
  `,
})
export class MyComp {}
```

```ts
// NgModule-based — import the module:
import { HlmItemModule } from '@egose/shadcn-theme-ng/item';

@NgModule({ imports: [HlmItemModule] })
export class MyModule {}
```

Exported from `src/public-api.ts`: `HlmItem`, `HlmItemActions`, `HlmItemContent`, `HlmItemDescription`, `HlmItemFooter`, `HlmItemGroup`, `HlmItemHeader`, `HlmItemMedia`, `HlmItemSeparator`, `HlmItemTitle`, the `ItemVariants` / `ItemMediaVariants` types, `HlmItemConfig` / `provideHlmItemConfig` / `injectHlmItemConfig` / `provideHlmItemMediaConfig` / `injectHlmItemMediaConfig` (from `hlm-item-token`), plus `HlmItemImports` and `HlmItemModule`.

## Anatomy / Structure

```html
<div hlmItemGroup>
  <article hlmItem variant="outline" size="default">
    <div hlmItemMedia variant="icon"><!-- icon or avatar --></div>

    <div hlmItemContent>
      <div hlmItemHeader>
        <p hlmItemTitle>Row title</p>
        <!-- trailing meta -->
      </div>
      <p hlmItemDescription>Secondary line, clamps to 2 lines.</p>
      <div hlmItemFooter>
        <span>Footer meta</span>
        <div hlmItemActions>
          <button hlmBtn size="sm">Open</button>
        </div>
      </div>
    </div>
  </article>

  <div hlmItemSeparator></div>

  <article hlmItem size="sm">…</article>
</div>
```

Real selectors (each works as attribute or element): `[hlmItem]`/`hlm-item`, `[hlmItemGroup]`/`hlm-item-group`, `[hlmItemMedia]`/`hlm-item-media`, `[hlmItemContent]`/`hlm-item-content`, `[hlmItemTitle]`/`hlm-item-title`, `[hlmItemDescription]`/`hlm-item-description`, `[hlmItemHeader]`/`hlm-item-header`, `[hlmItemFooter]`/`hlm-item-footer`, `[hlmItemActions]`/`hlm-item-actions`, `[hlmItemSeparator]`/`hlm-item-separator` (hostDirectives: `BrnSeparator` with `orientation` input).

## API reference

### `[hlmItem]` — `HlmItem`

| Input     | Type                                | Default     | Description                                                                                                                                 |
| --------- | ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `'default' \| 'outline' \| 'muted'` | `'default'` | `default` = transparent border; `outline` = bordered; `muted` = muted fill (reflected as `data-variant`).                                   |
| `size`    | `'default' \| 'sm' \| 'xs'`         | `'default'` | Density: `default` (gap-3.5, px-4, py-3.5) → `sm` → `xs` (reflected as `data-size`). `xs` also zeroes padding inside dropdown-menu content. |

`ItemVariants` is the cva `VariantProps` type. Defaults come from `injectHlmItemConfig()` — override globally with `provideHlmItemConfig({ variant: 'outline' })`.

### `[hlmItemMedia]` — `HlmItemMedia`

| Input     | Type                             | Default     | Description                                                                                          |
| --------- | -------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `variant` | `'default' \| 'icon' \| 'image'` | `'default'` | `icon` = icon sizing hook; `image` = fixed `size-10` rounded cover frame (shrinks with item `size`). |

Default from `injectHlmItemMediaConfig()`; override with `provideHlmItemMediaConfig({ variant: 'icon' })`.

### Layout pieces (no inputs/outputs)

| Directive            | `data-slot`        | Role                                                              |
| -------------------- | ------------------ | ----------------------------------------------------------------- |
| `HlmItemGroup`       | `item-group`       | Vertical stack (`flex-col`, gap adapts to child `size`).          |
| `HlmItemContent`     | `item-content`     | Flex-1 column filling the space between media and actions.        |
| `HlmItemTitle`       | `item-title`       | Medium semibold single-line title (`line-clamp-1`).               |
| `HlmItemDescription` | `item-description` | Muted two-line secondary text (`line-clamp-2`, links underlined). |
| `HlmItemHeader`      | `item-header`      | Full-width top row inside content (`justify-between`).            |
| `HlmItemFooter`      | `item-footer`      | Full-width bottom row inside content (`justify-between`).         |
| `HlmItemActions`     | `item-actions`     | Right-aligned control cluster.                                    |

### `[hlmItemSeparator]` — `HlmItemSeparator`

`hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation'] }]` + `hlmSeparatorClass` with `tw:my-2`. Accepts `orientation` (`horizontal` default) from the brain separator.

## Examples

### 1. Basic stacked list with all variants

```ts
import { Component } from '@angular/core';
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';

@Component({
  standalone: true,
  imports: [HlmItemImports],
  template: `
    <div hlmItemGroup>
      <div hlmItem>
        <div hlmItemContent>
          <p hlmItemTitle>Default row</p>
          <p hlmItemDescription>Transparent border, default density.</p>
        </div>
      </div>
      <div hlmItem variant="outline">
        <div hlmItemContent>
          <p hlmItemTitle>Outlined row</p>
          <p hlmItemDescription>Bordered card look.</p>
        </div>
      </div>
      <div hlmItem variant="muted">
        <div hlmItemContent>
          <p hlmItemTitle>Muted row</p>
          <p hlmItemDescription>Soft filled background.</p>
        </div>
      </div>
    </div>
  `,
})
export class VariantsExample {}
```

### 2. Sizes: default / sm / xs

```ts
import { Component } from '@angular/core';
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';

@Component({
  standalone: true,
  imports: [HlmItemImports],
  template: `
    <div hlmItemGroup>
      <div hlmItem>
        <div hlmItemContent>
          <p hlmItemTitle>Default density</p>
          <p hlmItemDescription>Roomy padding for primary lists.</p>
        </div>
      </div>
      <div hlmItem size="sm">
        <div hlmItemContent>
          <p hlmItemTitle>Compact</p>
          <p hlmItemDescription>Sidebars and secondary lists.</p>
        </div>
      </div>
      <div hlmItem size="xs">
        <div hlmItemContent>
          <p hlmItemTitle>Dense</p>
          <p hlmItemDescription>Dropdowns and menus.</p>
        </div>
      </div>
    </div>
  `,
})
export class SizesExample {}
```

### 3. Media variants: icon, image, avatar

```ts
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFolder, lucideBell } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';
import { HlmAvatarImports } from '@egose/shadcn-theme-ng/avatar';

@Component({
  standalone: true,
  imports: [NgIcon, HlmIcon, HlmItemImports, HlmAvatarImports],
  providers: [provideIcons({ lucideFolder, lucideBell })],
  template: `
    <div hlmItemGroup>
      <div hlmItem variant="outline">
        <div hlmItemMedia variant="icon"><ng-icon hlm name="lucideFolder" size="sm" /></div>
        <div hlmItemContent>
          <p hlmItemTitle>Design assets</p>
          <p hlmItemDescription>128 files · updated yesterday</p>
        </div>
      </div>
      <div hlmItem variant="outline">
        <div hlmItemMedia variant="image">
          <img src="https://picsum.photos/80" alt="Project thumbnail" />
        </div>
        <div hlmItemContent>
          <p hlmItemTitle>Launch photos</p>
          <p hlmItemDescription>Cover image crops to a rounded frame.</p>
        </div>
      </div>
      <div hlmItem variant="outline">
        <div hlmItemMedia>
          <hlm-avatar size="sm">
            <span hlmAvatarFallback>JA</span>
          </hlm-avatar>
        </div>
        <div hlmItemContent>
          <p hlmItemTitle>Jane mentioned you</p>
          <p hlmItemDescription>Any element works as default media.</p>
        </div>
      </div>
    </div>
  `,
})
export class MediaExample {}
```

### 4. Task row: header + footer + actions + separator

```ts
import { Component, signal } from '@angular/core';
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  standalone: true,
  imports: [HlmItemImports, HlmButton],
  template: `
    <div hlmItemGroup>
      @for (task of tasks(); track task.title; let last = $last) {
        <article hlmItem variant="outline">
          <div hlmItemMedia class="tw:h-11 tw:w-11 tw:rounded-2xl tw:bg-slate-900 tw:text-sm tw:text-white">
            {{ task.initials }}
          </div>
          <div hlmItemContent>
            <div hlmItemHeader>
              <p hlmItemTitle>{{ task.title }}</p>
              <span class="tw:text-xs tw:text-slate-500">{{ task.status }}</span>
            </div>
            <p hlmItemDescription>{{ task.description }}</p>
            <div hlmItemFooter>
              <span class="tw:text-sm tw:text-slate-500">Updated {{ task.updated }}</span>
              <div hlmItemActions>
                <button hlmBtn size="sm" variant="secondary" type="button">Review</button>
                <button hlmBtn size="sm" type="button">Open</button>
              </div>
            </div>
          </div>
        </article>
        @if (!last) {
          <div hlmItemSeparator></div>
        }
      }
    </div>
  `,
})
export class TaskListExample {
  readonly tasks = signal([
    {
      initials: 'DS',
      title: 'Redesign onboarding',
      status: 'In review',
      description: 'Five new steps with progress tracking.',
      updated: '2h ago',
    },
    {
      initials: 'PL',
      title: 'Fix checkout total',
      status: 'Todo',
      description: 'Tax rounding drifts by one cent.',
      updated: '1d ago',
    },
  ]);
}
```

### 5. Link rows (whole-row anchor) + global config

Rows containing an `<a>` get a hover background automatically (`[a]:hover:bg-muted`). Set app-wide defaults with `provideHlmItemConfig`:

```ts
import { Component } from '@angular/core';
import { HlmItemImports, provideHlmItemConfig } from '@egose/shadcn-theme-ng/item';

@Component({
  standalone: true,
  imports: [HlmItemImports],
  providers: [provideHlmItemConfig({ variant: 'outline', size: 'sm' })],
  template: `
    <div hlmItemGroup>
      <a hlmItem href="/docs/getting-started">
        <div hlmItemContent>
          <p hlmItemTitle>Getting started</p>
          <p hlmItemDescription>Install and render your first component.</p>
        </div>
      </a>
      <a hlmItem href="/docs/theming">
        <div hlmItemContent>
          <p hlmItemTitle>Theming</p>
          <p hlmItemDescription>CSS variables and dark mode.</p>
        </div>
      </a>
    </div>
  `,
})
export class LinksExample {}
```

### 6. NgModule usage + `orientation` on the separator

```ts
import { NgModule, Component } from '@angular/core';
import { HlmItemModule } from '@egose/shadcn-theme-ng/item';

@Component({
  selector: 'app-settings-list',
  template: `
    <div hlmItemGroup>
      <div hlmItem variant="outline" size="sm">
        <div hlmItemContent>
          <div hlmItemHeader>
            <p hlmItemTitle>Email notifications</p>
            <span class="tw:text-xs">On</span>
          </div>
          <p hlmItemDescription>Product updates and security alerts.</p>
        </div>
      </div>
      <div hlmItemSeparator orientation="horizontal"></div>
      <div hlmItem variant="outline" size="sm">
        <div hlmItemContent>
          <div hlmItemHeader>
            <p hlmItemTitle>Weekly digest</p>
            <span class="tw:text-xs">Off</span>
          </div>
          <p hlmItemDescription>A Monday summary of workspace activity.</p>
        </div>
      </div>
    </div>
  `,
})
export class SettingsListComponent {}

@NgModule({ declarations: [SettingsListComponent], imports: [HlmItemModule] })
export class SettingsListModule {}
```

## Accessibility notes

- Use semantic hosts: `<article>` for feed/task rows, `<li>` inside `<ul>` for plain lists, `<a href>` when the whole row navigates (hover affordance is built in).
- `hlmItemTitle` renders a `<p>` — if the title should head a section, swap in a real heading (`<h3 hlmItemTitle>`) since the directive is attribute-matched and keeps its classes.
- Keep action buttons labeled (`Open`, `Review`) — icon-only actions need `aria-label`.
- The separator is a brain `BrnSeparator` (presentational); it adds no keyboard stops. Status text (`In review`, counts) should be plain text, not color-only.

## Theming / CSS variables

No component-specific CSS variables; surfaces come from the shared tokens (`--border`, `--muted`, `--radius`). App-wide `variant`/`size` defaults via `provideHlmItemConfig` / `provideHlmItemMediaConfig`; per-row tweaks via inputs or `class`.

## Related subpaths

- `@egose/shadcn-theme-ng/separator` — `hlmSeparatorClass` behind the item separator.
- `@egose/shadcn-theme-ng/avatar` — typical `hlmItemMedia` content.
- `@egose/shadcn-theme-ng/button` — row actions.
- `@egose/shadcn-theme-ng/badge` — status pills inside header/footer rows.
