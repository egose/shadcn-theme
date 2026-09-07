# Next.js Example Catalog

Example catalog app for `@egose/shadcn-theme`, built with Next.js App Router as a static export (`output: 'export'`; see `next.config.ts`). It demonstrates package components, form fields, widgets, and realistic product flows, and it is itself published as a static site.

## Dependency model and validation boundary

This app is a **source-integration playground**, not an installed-package consumer:

- Package imports use the public specifier scheme `@egose/shadcn-theme/*` (e.g. `@egose/shadcn-theme/components/ui/button`), mapped to the parent package **source** via `tsconfig.json` `paths` (`"@egose/shadcn-theme/*": ["../../*"]`); `vitest.config.ts` mirrors the same alias.
- Every other directly imported package (e.g. `react-hook-form`, `zod`, `sonner`) is declared in this app's own `package.json`; example code never imports through relative paths into parent `node_modules` or parent package source. `lib/import-boundary.test.ts` enforces this.
- Because this app compiles parent **source** directly, it does not validate the published artifact. Installed-artifact guarantees (`dist` output, published `exports` map) belong to the package validator and isolated consumer in `packages/react`, not to this app:

  ```bash
  pnpm --dir packages/react test:package    # validator tests + staged package + validate exports
  pnpm --dir packages/react build:consumer  # build the isolated consumer against the staged package
  pnpm --dir packages/react test:consumer   # run the isolated consumer's tests
  ```

## Setup and commands

This app is a nested pnpm workspace member (`packages/react/pnpm-workspace.yaml` includes `@examples/*`). Install from the workspace root, then run commands in this directory:

```bash
cd packages/react
pnpm install                       # install workspace deps (includes @examples/*)
cd @examples/nextjs

pnpm dev          # next dev — local dev server
pnpm build        # next build — static export to out/
pnpm preview      # serve out — preview the exported site
pnpm lint         # eslint --max-warnings 0 (zero warnings allowed)
pnpm typecheck    # tsc --noEmit --incremental false --pretty false
pnpm test         # vitest run
```

All verification (`lint`, `typecheck`, `test`, `build`) must pass after any change.

## Catalog registry and routing

The four sections (`components`, `form`, `widgets`, `real-examples`) are each defined by a single typed entry list in `lib/sections/<section>.ts` via `defineSection` (`lib/example-registry.ts`). One entry supplies listing metadata, URL, valid-slug derivation, `generateStaticParams`, and — for dynamic entries — a lazy `load()` implementation loader. `lib/example-registry.test.ts` rejects drift (duplicate URLs/titles/slugs, loaders that do not resolve, static routes missing or conflicting).

Choose the routing strategy per entry:

- **`route: 'dynamic'`** (default for small demos): rendered by `app/<section>/[slug]/page.tsx` through the entry's lazy `import()`. Each implementation lives in its own module under `components/showcases/<section>/<slug>.tsx`, so a page only bundles the showcase it renders. Put `'use client'` inside interactive modules only; presentational showcases stay server components.
- **`route: 'static'`**: use a dedicated `app/<section>/<slug>/page.tsx` when the example needs route-level logic — its own metadata, bespoke composed layout, colocated helper modules (e.g. `widgets/dialog-manager/`), or direct page-module tests.

### Adding a new example

1. Create the implementation module:
   - Component/form/widget demo: `components/showcases/<section>/<slug>.tsx` with a default component export.
   - Real example: `components/real-examples/<slug>/index.tsx` plus local `types.ts`, `fixtures.ts`, `components/`, and `<slug>.test.tsx` as needed (see `components/real-examples/README.md`; no barrel file).
2. Add one entry to `lib/sections/<section>.ts`: `{ slug, route, title, description }` plus `load: () => import('@/components/...')` for dynamic entries.
3. If and only if the example needs route-level logic (own metadata, bespoke layout, colocated helpers, page-module tests), use `route: 'static'` and add `app/<section>/<slug>/page.tsx` instead of a loader.
4. Set the listing copy (`title`, `description`) accurately — it renders verbatim in the catalog.
5. Verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. The registry test will fail if the entry, route, title, or loader disagree.

## Real-example standards

Real examples are full product flows (pricing, customers, settings, launch request) that compose multiple package surfaces around a believable workflow. Conventions (see `components/real-examples/README.md` and `_shared/`):

- **Deterministic fixtures**: fixed ISO dates (`_shared` `FIXTURE_NOW` — never `new Date()` at render time), stable IDs, varied text lengths, zero-result cases. Initial output must be identical across build time and browser time zones.
- **Accessible states**: every loading, empty, error, pending, success, failure, permission-disabled, plan-gated, and destructive state is inspectable and announced (persistent status text / `role="status"` / `role="alert"`, `aria-describedby` reasons — never conveyed by styling alone). Catalog state tooling (`_shared` `ExampleStateToolbar`) is visually marked as tooling, not product UI.
- **Deterministic async**: simulated outcomes go through `_shared/async-simulation.ts` (explicit success/failure, fixed delay, no randomness). Pending actions are duplicated-guarded; destructive actions are confirmed.
- **Responsive behavior**: flows must work at narrow widths (320px), on mobile, and with long labels/values; verify keyboard navigation and focus restoration after dialogs.
- **No external network**: no backend, auth service, payment provider, or remote assets; everything is local and simulated.

## Testing

`pnpm test` runs focused vitest suites: the registry contract (`lib/example-registry.test.ts`), the import boundary, internal links, route-level tests, and one colocated suite per real example. Add a failing behavior/registry test before fixing confirmed defects; avoid broad snapshots.
