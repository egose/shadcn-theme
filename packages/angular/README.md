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

`pnpm` / `yarn` equivalents work too. npm installs peer dependencies automatically when it can resolve compatible
versions; applications must keep their existing framework versions inside the supported ranges below.

### Peer dependencies

| Package             | Supported version  | Tested version |
| ------------------- | ------------------ | -------------- |
| `@angular/cdk`      | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/common`   | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/core`     | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/forms`    | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@angular/router`   | `>=22.0.0 <23.0.0` | `22.1.3`       |
| `@ng-icons/core`    | `>=35.0.1 <36.0.0` | `35.0.1`       |
| `@spartan-ng/brain` | `>=1.3.2 <2.0.0`   | `1.3.2`        |
| `rxjs`              | `>=7.8.0 <8.0.0`   | `7.8.2`        |

Angular and CDK must use the same major version. The tested consumer contract is Angular 22, CDK 22, and Spartan 1.3.2;
the ranges above are copied from the published peer metadata and validated with strict isolated installs.

Runtime implementation dependencies such as `@ng-icons/lucide`, `@ng-icons/tabler-icons`, `class-variance-authority`,
`clsx`, `embla-carousel`, `embla-carousel-angular`, `ngx-scrollbar`, `ngx-sonner`, `tailwind-merge`, and `tslib` are
installed transitively. Do not install them directly unless your application also imports them.

### Tailwind variants

There are two published variants of this package. They produce identical markup and TypeScript surface but differ in the Tailwind class-string prefix:

| Variant           | Package                     | Tailwind prefix in emitted class strings | Consumer requirement                                  |
| ----------------- | --------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Plain (no prefix) | `@egose/shadcn-theme-ng`    | (none — prefix stripped)                 | Configure Tailwind with **no** prefix (default).      |
| `tw:`-prefixed    | `@egose/shadcn-theme-ng-tw` | `tw:` (kept)                             | Configure Tailwind to recognize the **`tw:`** prefix. |

If your project mixes shadcn styles with other Tailwind utilities that share class names, use the `-tw` variant to avoid collisions.

Class utilities are normalized to one unprefixed canonical representation during packaging. The plain artifact emits
unprefixed utilities, while the `-tw` artifact prefixes every recognized utility with `tw:`. Generated JavaScript source
maps are intentionally excluded because this post-build class and package-identity transformation invalidates ng-packagr's
maps; shipping no map is safer than shipping a map that points at different generated code.

## Release preparation

Prepare both release candidates without publishing by supplying the intended version explicitly:

```bash
pnpm --dir packages/angular prepare:release --version 1.2.3
```

This serially builds, validates, and packs the plain and `tw:` variants. The inspectable stages and two exact `.tgz`
artifacts are written under `packages/angular/release/`. Neither package is published unless both candidates pass every
step. Publishing is intended to run from protected CI with npm trusted publishing/OIDC; `--otp` remains available for
manual releases, but its value is never logged.

## Source tests

Headless-test prerequisite (local and CI): the Karma suites need a
Chrome-compatible binary. The repository-supported setup downloads it into
the repo-local `.puppeteer-cache/` directory:

```bash
pnpm --dir packages/angular install:browser
```

Alternatively, set `CHROME_BIN` to any Chrome/Chromium binary yourself
(`test/karma.conf.js` honors a pre-set `CHROME_BIN`, then falls back to a
system Chrome).

Focused library tests are intentionally separate from staged-package and artifact validation:

```bash
# One selected library
pnpm --dir packages/angular test:library form-text-input
pnpm --dir packages/angular test:library utils

# Source export contracts plus every selected library, serially and headlessly
pnpm --dir packages/angular test:libraries

# The example shell and router behavior
pnpm --dir packages/angular/@examples/standard test:ci
```

The browser suites share `packages/angular/test/setup.ts`, which provides zoneless Angular setup and assertions for form
bindings and resource teardown. DOM reconciliation uses real `MutationObserver` and animation-frame scheduling; server-mode
coverage verifies those browser resources are not created. All CI commands disable watch mode so they terminate after one run.

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

<!-- BEGIN GENERATED SUBPATHS -->

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `autocomplete`, `avatar`, `badge`, `basic-alert`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `checkbox`, `collapsible`, `combobox`, `command`, `confirmation-dialog`, `context-menu`, `date-picker`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `form-checkbox`, `form-date-picker`, `form-field`, `form-field-simple`, `form-searchable-multiselect`, `form-select`, `form-text-input`, `form-textarea`, `hover-card`, `icon`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `layout-simple`, `menu`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `searchable-multiselect`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`, `typography`, `utils`.

<!-- END GENERATED SUBPATHS -->

Anything not in this list is not part of the public surface. The published `exports` map in `package.json` reflects this set exactly — if a subpath is not listed, do not assume it is importable.

## Quick start (Angular standalone)

```ts
import { Component } from '@angular/core';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { EgLayoutSimple, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: "app-demo",
  standalone: true,
  imports: [EgLayoutSimple, ...HlmButtonImports],
  template: \`
    <eg-layout-simple [leftMenus]="items">
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
