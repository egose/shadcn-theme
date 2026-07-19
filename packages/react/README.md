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

The package also depends on `tailwindcss` (v4 or higher recommended) — consumers are expected to wire the Tailwind setup themselves.

### Tailwind / global setup

The components ship precompiled Tailwind class strings (no `tw:` prefix). Configure your app's Tailwind to scan `@egose/shadcn-theme` for class names, and set up the standard CSS variables (light + dark) the shadcn theme tokens rely on. See the [`@examples/nextjs`](https://github.com/egose/shadcn-theme/tree/main/packages/react/@examples/nextjs) workspace in the repo for a working setup.

## Import forms

The package is **deep-import only** — every component/hook/util/layout is its own entry. Import by subpath; do NOT import from the package root (`@egose/shadcn-theme` alone resolves to nothing).

| Surface      | Import path                                     |
| ------------ | ----------------------------------------------- |
| UI primitive | `@egose/shadcn-theme/components/ui/<name>`      |
| Form field   | `@egose/shadcn-theme/components/form/<name>`    |
| Widget       | `@egose/shadcn-theme/components/widgets/<name>` |
| Hook         | `@egose/shadcn-theme/hooks/<name>`              |
| Utility      | `@egose/shadcn-theme/utils/<name>`              |
| Layout       | `@egose/shadcn-theme/layouts/<name>`            |

### React Server Components

Every emitted module starts with a `"use client";` directive, so this package is only consumable from client components. If you import these into a Next.js Server Component (e.g. an `app/` route file), the bundler will force it onto the client. Import and render from a component marked `"use client"` to keep the boundary explicit.

## Quick start

```tsx
'use client';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { FormTextInput } from '@egose/shadcn-theme/components/form/text-input';
import { useClipboard } from '@egose/shadcn-theme/hooks/use-clipboard';
import { cn } from '@egose/shadcn-theme/utils/ui';
import SimpleLayout from '@egose/shadcn-theme/layouts/simple';

export function Demo() {
  const { copy } = useClipboard();

  return (
    <SimpleLayout>
      <Button variant="primary" size="default" onClick={() => copy('hello')}>
        Copy
      </Button>
      <FormTextInput name="title" label="Title" rules={{ required: true }} />
    </SimpleLayout>
  );
}
```

## Selected exports

| Surface         | Example import                                               | Exported names                                                                          |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Button          | `@egose/shadcn-theme/components/ui/button`                   | `Button`, `buttonVariants`, `ButtonProps`, `VariantType`, `SizeType`                    |
| `cn` helper     | `@egose/shadcn-theme/utils/ui`                               | `cn`                                                                                    |
| `useClipboard`  | `@egose/shadcn-theme/hooks/use-clipboard`                    | `useClipboard`                                                                          |
| Form text input | `@egose/shadcn-theme/components/form/text-input`             | `FormTextInput`, `FormTextInputProps`                                                   |
| Page header     | `@egose/shadcn-theme/components/widgets/page-header`         | `PageHeader`, `PageHeaderProps`                                                         |
| Action menu     | `@egose/shadcn-theme/components/widgets/action-menu`         | `ActionMenu`, `ActionMenuProps`, `ActionMenuItem`                                       |
| Confirm dialog  | `@egose/shadcn-theme/components/widgets/confirmation-dialog` | `ConfirmationDialog`, `ConfirmationDialogArgs`, `ConfirmationDialogResult`              |
| Simple layout   | `@egose/shadcn-theme/layouts/simple`                         | `SimpleLayout` (default export)                                                         |
| Sidebar layout  | `@egose/shadcn-theme/layouts/sidebar1`                       | `SidebarLayout` (default), `setLayoutHeader`, `headerStore`, `ISidebarData`, `INavUser` |
| Dialog manager  | `@egose/shadcn-theme/components/widgets/dialog-manager`      | `DialogManagerProvider`, `useDialog`, `createTypedDialog`, `DialogContext`              |

The full list of public modules lives under `dist/components/`, `dist/hooks/`, `dist/utils/`, and `dist/layouts/`; the `exports` map in `package.json` enumerates the supported subpaths.

## License

Apache-2.0 — see the `LICENSE` file shipped with the package (sourced from the repo root).
