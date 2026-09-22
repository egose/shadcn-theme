# @egose/shadcn-theme

A themeable [shadcn/ui](https://ui.shadcn.com/)-style component library for React (React 18 / 19), built with [Tailwind CSS](https://tailwindcss.com/), [radix-ui](https://www.radix-ui.com/), [class-variance-authority](https://cva.style/), and [react-hook-form](https://react-hook-form.com/).

## Install

```bash
npm install @egose/shadcn-theme
# Peer dependencies (required):
npm install react react-dom react-hook-form sonner
```

`pnpm` / `yarn` equivalents work too. Make sure your project's versions satisfy the peer ranges below.

### Peer dependencies

| Package           | Supported version      |
| ----------------- | ---------------------- |
| `react`           | `^18.3.1 \|\| ^19.0.0` |
| `react-dom`       | `^18.3.1 \|\| ^19.0.0` |
| `react-hook-form` | `^7.54.2`              |
| `sonner`          | `^2.0.7`               |

Tailwind CSS is consumer-side setup rather than a package peer. Tailwind CSS v4 or higher is recommended.

### Tailwind / global setup

The components ship precompiled Tailwind class strings (no `tw:` prefix). Configure your app's Tailwind to scan `@egose/shadcn-theme` for class names, and set up the standard CSS variables (light + dark) the shadcn theme tokens rely on. See the [`@examples/nextjs`](https://github.com/egose/shadcn-theme/tree/main/packages/react/@examples/nextjs) workspace in the repo for a working setup.

## Import forms

The package is **deep-import only** — every component/hook/util/layout is its own entry. Import by subpath; do NOT import from the package root (`@egose/shadcn-theme` alone resolves to nothing).

Each public subpath is condition-aware: ESM `import` resolves its `.mjs` runtime and `.d.mts` declarations, while CommonJS `require` resolves its `.js` runtime and `.d.ts` declarations. Always use the package subpaths below rather than importing physical files from the installed package.

| Surface      | Import path                                     |
| ------------ | ----------------------------------------------- |
| UI primitive | `@egose/shadcn-theme/components/ui/<name>`      |
| Form field   | `@egose/shadcn-theme/components/form/<name>`    |
| Widget       | `@egose/shadcn-theme/components/widgets/<name>` |
| Hook         | `@egose/shadcn-theme/hooks/<name>`              |
| Utility      | `@egose/shadcn-theme/utils/<name>`              |
| Layout       | `@egose/shadcn-theme/layouts/<name>`            |

### React Server Components

Pure utility entries such as `utils/ui`, `utils/date`, and `utils/time` are server-safe and can be imported directly by React Server Components. Hook, context, interactive, and browser-dependent entries carry a `"use client";` boundary in both ESM and CommonJS builds. The `components/widgets/dialog-manager` barrel is one of these client entries: a Server Component may render `DialogManagerProvider`, but `useDialog`, event callbacks, and imperative dialog calls belong in your own component marked `"use client"`.

## Quick start

```tsx
'use client';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { FormTextInput } from '@egose/shadcn-theme/components/form/text-input';
import { useClipboard } from '@egose/shadcn-theme/hooks/use-clipboard';
import { cn } from '@egose/shadcn-theme/utils/ui';
import SimpleLayout from '@egose/shadcn-theme/layouts/simple';
import Link from 'next/link';

export function Demo() {
  const { copy } = useClipboard();

  return (
    <SimpleLayout aslink={Link}>
      <Button variant="primary" size="default" onClick={() => copy('hello')}>
        Copy
      </Button>
      <FormTextInput name="title" label="Title" required />
    </SimpleLayout>
  );
}
```

## Button colors and appearances

Use `variant` for the semantic color and `appearance` for the visual treatment:

```tsx
import { Button, buttonVariants } from '@egose/shadcn-theme/components/ui/button';
import { cn } from '@egose/shadcn-theme/utils/ui';

<Button variant="success" appearance="ghost">Save</Button>
<Button variant="danger" appearance="link">Delete</Button>
<Button variant="action" appearance="outline-filled">Publish</Button>
<a href="/publish" className={cn(buttonVariants({ variant: 'action', appearance: 'outline' }))}>
  Publish details
</a>
```

- **Colors:** `primary`, `secondary`, `action`, `success`, `warning`, `danger`, `info`,
  `light`, `dark`, `accent`, `destructive`, and `muted`.
- **Appearances:** `solid`, `outline`, `outline-filled`, `ghost`, and `link` (typed as `VariantStyleType`).
  Outline buttons use `background`; outline-filled buttons fill with the tone on hover.
  Ghost buttons are transparent with a hover tint. Link buttons are transparent and underline on hover.
- Legacy `variant="link"` and `variant="ghost"` remain supported. The legacy ghost variant uses the light hover tone.
- `className` overrides are merged last. Loading spinners inherit the resolved button text color.
- `buttonVariants()` includes all appearance rules; merge its result with `cn()` for custom hosts.
- Secondary and light outline styles use neutral foreground/border tokens for readable text.

### CSS-defined palettes and scoped themes

Map Tailwind v4 colors to complete CSS color values with `@theme inline`. This resolves
variables on the consuming element, allowing a `.dark` or custom theme ancestor to override
the palette locally. For example, extend your global stylesheet with:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-action: var(--action);
  --color-action-foreground: var(--action-foreground);
  /* Map the other semantic colors and their -foreground partners similarly. */
}

:root {
  --primary: #202020;
  --primary-foreground: #ffffff;
  --action: #2563eb;
  --action-foreground: #ffffff;
}

.dark {
  --primary: #eeeeee;
  --primary-foreground: #202020;
  --action: #93c5fd;
  --action-foreground: #172554;
}

.brand-theme {
  --action: #7950f2;
  --action-foreground: #ffffff;
}
```

```tsx
<section className="brand-theme">
  <Button variant="action" appearance="outline">
    Branded action
  </Button>
</section>
```

Keep the standard `background`, `foreground`, `border`, and `ring` mappings alongside the
palette. The Next.js example includes the complete setup; it maps `light` to `secondary`
and `dark` to `primary`, including their foreground partners. Adding `--color-brand` in CSS
does not register `variant="brand"`: customize an existing semantic token or use `className`.

## Selected exports

| Surface         | Example import                                               | Exported names                                                                           |
| --------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Button          | `@egose/shadcn-theme/components/ui/button`                   | `Button`, `buttonVariants`, `ButtonProps`, `VariantType`, `SizeType`, `VariantStyleType` |
| `cn` helper     | `@egose/shadcn-theme/utils/ui`                               | `cn`                                                                                     |
| `useClipboard`  | `@egose/shadcn-theme/hooks/use-clipboard`                    | `useClipboard`                                                                           |
| Form text input | `@egose/shadcn-theme/components/form/text-input`             | `FormTextInput`, `FormTextInputProps`                                                    |
| Page header     | `@egose/shadcn-theme/components/widgets/page-header`         | `PageHeader`, `PageHeaderProps`                                                          |
| Action menu     | `@egose/shadcn-theme/components/widgets/action-menu`         | `ActionMenu`, `ActionMenuProps`, `ActionMenuItem`                                        |
| Confirm dialog  | `@egose/shadcn-theme/components/widgets/confirmation-dialog` | `ConfirmationDialog`, `ConfirmationDialogArgs`, `ConfirmationDialogResult`               |
| Simple layout   | `@egose/shadcn-theme/layouts/simple`                         | `SimpleLayout` (default), `SimpleLayoutProps`, `MenuItem`, `UserMenuSection` (types)     |
| Sidebar layout  | `@egose/shadcn-theme/layouts/sidebar1`                       | `SidebarLayout` (default), `useLayoutHeader`, `ISidebarData`, `INavUser`                 |
| Dialog manager  | `@egose/shadcn-theme/components/widgets/dialog-manager`      | `DialogManagerProvider`, `useDialog`, `createTypedDialog`, `DialogCancellationError`     |

The installed package exposes public modules through the `components/`, `hooks/`, `utils/`, and `layouts/` subpaths. Its `exports` map is authoritative; physical package files are not public import paths.

## License

Apache-2.0 — see the `LICENSE` file shipped with the package (sourced from the repo root).
