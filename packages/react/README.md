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
- Native buttons are disabled whenever `loading` or `disabled` is true, including when
  `loading` is true and `disabled={false}`. When loading ends, they re-enable only if
  the caller's `disabled` prop is false or omitted.
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

## Selection fields

`FormSelect` and `FormSearchableSelect` accept `data` as strings or `{ value, label }`
objects. Use unique, stable values; human-readable labels may repeat. Both associate
their label with the focusable trigger using `id`, defaulting to the kebab-cased
`name`. Supply an explicit unique `id` when rendering repeated field names.

```tsx
'use client';

import { useState } from 'react';
import { FormSearchableSelect } from '@egose/shadcn-theme/components/form/searchable-select';

export function CustomerPicker() {
  const [customerId, setCustomerId] = useState<string | undefined>('');
  return (
    <FormSearchableSelect
      name="customer"
      label="Customer"
      data={[{ value: 'cust_42', label: 'Acme Industries' }]}
      value={customerId}
      onChange={setCustomerId}
    />
  );
}
```

- `FormSelect` (from `@egose/shadcn-theme/components/form/select`) forwards
  `name`, `required`, and `disabled` to the Radix select. Inside a form, its native
  select contributes the selected value under `name` to `FormData`; disabled
  fields are excluded and cannot be opened or changed by the user. `required`
  reaches the primitive/native control as well as the label. Use `value` and
  `onChange` for controlled selection, or `defaultValue` for an initial
  uncontrolled selection.
- `FormSearchableSelect` searches both labels and stable values: “Acme” and
  “cust_42” find the example record, and selection emits `cust_42`. Selecting the
  same value again clears it and emits `''`; selecting another value with an
  identical label selects that distinct record. Selection closes the popup.
  Unmatched searches show “No option found.” String options use the same string
  for display, search, and emitted value.
- `FormMultiSelect` (from `@egose/shadcn-theme/components/form/multi-select`)
  accepts string or `{ value, label }` options with unique values and a controlled
  `value: string[]`. Every selected ID remains visible in `value` order, even when
  `data` is empty or partial. Missing metadata uses the ID as its label; arriving
  or updated metadata refreshes the label. Adding or removing a selection retains
  unrelated IDs, including those absent from `data`. For example, with selected
  IDs `['cust_42', 'cust_73']` and only `cust_42` in `data`, removing `cust_42`
  requests `['cust_73']`. `onChange` runs only for user edits, not on mount or
  option refresh; update `value` to accept the requested selection.
  Its visible `label` names and targets the actual search input. cmdk owns the
  final generated input ID, even when `id` is supplied (or defaults from `name`);
  the visible label follows that ID when the input mounts. Use the input `ref`
  for programmatic focus. Independently mounted fields retain separate label
  targets, including fields with the same `name`.

### Selection validation and focus

All three selection fields accept `onBlur?: () => void` for **leaving the whole
field**. Focus moves between the trigger/input, badges, and portalled popup are
internal. Opening, searching, selecting, or pressing Escape does not mark the
field touched while focus stays inside or returns to its trigger/input. Blur is
checked after popup focus transitions settle; leaving for another field invokes
the callback once per exit.

`FormSelect` and `FormSearchableSelect` forward `ref` to their
`HTMLButtonElement` trigger; `FormMultiSelect` forwards it to its
`HTMLInputElement`. Object and callback refs use React 18/19-compatible
`forwardRef`. Multi-select preserves input focus on popup opening and restores
it on Escape or badge removal; an outside dismissal preserves outside focus.
The lower-level `MultiSelectorInput` forwards the actual input ref and composes
native `onBlur`, `onFocus`, `onClick`, and `onValueChange` handlers with its
internal behavior. Its native blur event differs from the form field's
whole-field, no-argument callback.

Inside `FormProvider`, use `HookFormSelect`, `HookFormSearchableSelect`, or
`HookFormMultiSelect` from their respective `components/form/hook-select`,
`components/form/hook-searchable-select`, and `components/form/hook-multi-select`
deep imports. They connect RHF's blur handler and focus ref, supporting
`mode: 'onBlur'`, `touchedFields`, `setFocus(name)`, and default invalid-submit
focus. Their optional `onBlur` callback is composed after RHF's handler.
Configure validation through `rules` and initialize single values to `''` or
multi-values to `[]` in `useForm`:

```tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { HookFormSearchableSelect } from '@egose/shadcn-theme/components/form/hook-searchable-select';

export function CustomerForm() {
  const form = useForm<{ customer: string }>({
    mode: 'onBlur',
    defaultValues: { customer: '' },
  });
  return (
    <FormProvider {...form}>

      <form onSubmit={form.handleSubmit((values) => console.log(values))}>

        <HookFormSearchableSelect
          name="customer"
          label="Customer"
          data={[{ value: 'cust_42', label: 'Acme Industries' }]}
          rules={{ required: 'Choose a customer' }}
        />

        <button type="button" onClick={() => form.setFocus('customer')}>
          Focus customer
        </button>
                <button type="submit">Save</button>

      </form>

    </FormProvider>
  );
}
```

## Sidebar workspace context selection

`ContextSwitcher` and `INavContext` are available from
`@egose/shadcn-theme/layouts/sidebar1/context-switcher`. Render the switcher
inside `SidebarProvider`, or configure `SidebarLayout` through
`data.context.items` and `data.events.contextSelect`.

- **Controlled via `active`:** if any item has `active: true`, the first active
  item in current list order is authoritative on every render, including when
  contexts load after an empty list. Selecting an item invokes
  `onContextSelected(item)` (the layout's `contextSelect` event) with the current
  item, but the label stays on the authoritative context until the application
  updates the active flags. A deferred or rejected request leaves the label
  unchanged, even when no callback is supplied. Reselecting the displayed item
  also invokes the callback once.
- **Uncontrolled:** when no item is active (all flags false or omitted), the
  switcher initially selects the first item, then retains user selection by
  `name`. Names must be unique and stable; `name` is both identity and displayed
  name. Selection works without a callback. Recreated/reordered items retain
  that name; text, logo/image, and classes always use current metadata.
- Removing the selected name selects and remembers the first remaining item.
  Empty items render nothing, including the add action, and reset selection;
  a subsequent load uses the active item or the first item. A removed name's
  return does not restore its old selection. Clearing all active flags retains
  the last displayed name if it remains, otherwise selects the first item.
  Mount, data refresh, mode changes, and fallback emit no callbacks.

This corrects the previous mount-only active-flag and optimistic-label behavior.
For customer records, workspace settings, and launch requests, derive active
flags from the same committed application context that drives the displayed
data. Accept a selection request by updating that context and its active flags
together. This avoids showing a requested workspace label while the application
still uses the previous workspace's data. The switcher is a UI selection control;
it does not switch application data, persist context, or enforce authorization.

## Sidebar navigation actions

`NavMenus`, `INavMenu`, `IMenuItem`, and `IMenuSubItem` are available from
`@egose/shadcn-theme/layouts/sidebar1/nav-menus`. Use `NavMenus` inside
`SidebarProvider` and `TooltipProvider`. `SidebarLayout` supplies `SidebarProvider`
and accepts menus through `data.menus`; wrap the layout in `TooltipProvider` as
well. Pass your router/link component as `aslink`.

- Activating a child calls its own `onClick(child.title)` when supplied. Only
  when the child has no handler does the parent's `onClick(child.title)` run as
  a fallback. Never both. This corrects the previous parent-only dispatch; move
  any required shared work into the child handler when providing both handlers.
- A top-level leaf calls its own `onClick(title)`. With no applicable handler,
  activation still works without a callback. Group toggles only expand/collapse
  their children and do not invoke callbacks.
- URL items remain links: `url` is passed as both `href` and `to` to `aslink`.
  The same callback precedence applies to URL children without preventing normal
  link/router navigation. A custom link must forward the supplied `onClick` to
  preserve callbacks and mobile closure.
- Every leaf activation closes the mobile sidebar, including items without a
  handler. Group toggles keep it open. Action-only items and group toggles use
  `type="button"`, so pointer or keyboard activation does not submit an enclosing
  form.

## Clipboard feedback

Import `useClipboard` from `@egose/shadcn-theme/hooks/use-clipboard` and use
`{ copy, copied, error } = useClipboard({ timeout: 2000 })` for copy feedback.
Only the latest requested write may update feedback:

- Success sets `copied` to `true`, clears `error`, and starts a fresh reset timer
  (2000ms by default).
- Failure sets `copied` to `false`, records the error, and cancels the previous
  reset timer. A failed copy therefore cannot keep showing an earlier success.
- Starting a copy retains prior feedback until settlement or timer expiry;
  `copied` is success feedback, not a pending indicator. Older completions are
  ignored, and unmount cancels the timer and ignores pending completions.

## Simple layout loading

`SimpleLayout` exposes `loading?: boolean` and `loadingContent?: React.ReactNode`
on `SimpleLayoutProps`. While loading, main has `aria-busy="true"` and shows a
default `role="status"` with “Loading…”, replacing the previous blank region.
When loading is false or omitted, main has `aria-busy="false"` and shows children.
Header, footer, and navigation remain mounted and usable throughout loading.

Use `loadingContent` to replace or localize the feedback (`null`/`undefined` use
the default). The custom slot replaces the entire default status, so provide
`role="status"` with meaningful text, or an accessible name via `aria-label` or
`aria-labelledby` for non-text feedback. A decorative spinner alone is not
sufficient; keep decorative graphics hidden from assistive technology.

```tsx
import SimpleLayout from '@egose/shadcn-theme/layouts/simple';
import Link from 'next/link';

<SimpleLayout
  aslink={Link}
  loading={isLoading}
  loadingContent={
    <p role="status" lang="fr">
      Chargement des clients…
    </p>
  }
>

  <CustomerList />
</SimpleLayout>;
```

Loading retains the existing **unmount** lifecycle: children are not mounted
initially while loading, and entering loading unmounts them rather than merely
hiding them with CSS. Completion unmounts the loading slot and mounts children
fresh, resetting local component/form state. Keep drafts or form state above the
layout if they must survive loading transitions.

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
