# @egose/shadcn-theme-ng

A themeable [shadcn/ui](https://ui.shadcn.com/)-style component library for Angular, built with [Tailwind CSS](https://tailwindcss.com/), [@spartan-ng/brain](https://www.spartan-ng.com/), and [@ng-icons](https://www.ng-icons.dev/). Ships one Angular library per component, consumed via npm subpath imports.

## Install

Pick the package that matches your Tailwind setup (see **Tailwind variants** below):

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant (when your Tailwind is configured with the `tw:` prefix):
npm install @egose/shadcn-theme-ng-tw
```

`pnpm` / `yarn` equivalents work too. Make sure your project's versions satisfy the peer ranges below.

### Peer dependencies

| Package             | Supported version   |
| ------------------- | ------------------- |
| `@angular/common`   | `^20.2.0`           |
| `@angular/core`     | `^20.2.0`           |
| `@spartan-ng/brain` | `^0.0.1-alpha.512+` |

`@spartan-ng/brain` is the underlying primitive library that powers most components.

### Tailwind variants

There are two published variants of this package. They produce identical markup and TypeScript surface but differ in the Tailwind class-string prefix:

| Variant           | Package                     | Tailwind prefix in emitted class strings | Consumer requirement                                  |
| ----------------- | --------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Plain (no prefix) | `@egose/shadcn-theme-ng`    | (none — prefix stripped)                 | Configure Tailwind with **no** prefix (default).      |
| `tw:`-prefixed    | `@egose/shadcn-theme-ng-tw` | `tw:` (kept)                             | Configure Tailwind to recognize the **`tw:`** prefix. |

If your project mixes shadcn styles with other Tailwind utilities that share class names, use the `-tw` variant to avoid collisions.

## Import forms

Import each component via its own npm subpath:

```ts
import { HlmButtonModule, HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { EgLayoutSimple, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';
```

For the `-tw` variant, swap the package name:

```ts
import { HlmButtonModule, HlmButton } from '@egose/shadcn-theme-ng-tw/button';
```

Standalone consumers can import the `*Imports` const arrays; NgModule consumers can import the corresponding `*Module` classes:

```ts
// Standalone component:
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
@Component({ imports: [...HlmButtonImports] })
export class MyComp {}

// NgModule-based:
import { HlmButtonModule } from '@egose/shadcn-theme-ng/button';
@NgModule({ imports: [HlmButtonModule] })
export class MyModule {}
```

## Available subpaths

Import by component name. Component `NameX` is reachable at `@egose/shadcn-theme-ng/<name-x>` (kebab-case). The current surface:

`accordion`, `alert`, `autocomplete`, `badge`, `basic-alert`, `button`, `calendar`, `checkbox`, `confirmation-dialog`, `date-picker`, `dialog`, `form-checkbox`, `form-date-picker`, `form-field`, `form-field-simple`, `form-searchable-multiselect`, `form-select`, `form-text-input`, `form-textarea`, `icon`, `input`, `label`, `layout-simple`, `menu`, `popover`, `radio-group`, `searchable-multiselect`, `select`, `separator`, `sheet`, `sonner`, `spinner`, `switch`, `tabs`, `tooltip`, `utils`.

Anything not in this list is not part of the public surface. The published `exports` map in `package.json` reflects this set exactly — if a subpath is not listed, do not assume it is importable.

## Quick start (Angular standalone)

```ts
import { Component } from "@angular/core";
import { HlmButtonImports } from "@egose/shadcn-theme-ng/button";
import { EgLayoutSimple, MenuItem } from "@egose/shadcn-theme-ng/layout-simple";

@Component({
  selector: "app-demo",
  standalone: true,
  imports: [...HlmButtonImports],
  template: \`
    <eg-layout-simple [menuItems]="items">
      <button hlmBtn variant="primary">Click</button>
    </eg-layout-simple>
  \`,
})
export class DemoComponent {
  readonly items: MenuItem[] = [];
}
```

## Working example

A complete Angular consumer app lives at [`@examples/standard`](https://github.com/egose/shadcn-theme/tree/main/packages/angular/@examples/standard) — see its `src/app/...` for real usage of `@egose/shadcn-theme-ng/button`, `.../layout-simple`, `.../form-text-input`, `.../autocomplete`, `.../select`, `.../form-checkbox`, `.../sheet`, etc.

## License

Apache-2.0 — see the `LICENSE` file shipped with the package (sourced from the repo root).
