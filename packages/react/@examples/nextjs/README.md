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

Each section index searches titles, descriptions, and optional `capabilities` (case-insensitive, all whitespace-separated words must match). Initial cards are server-rendered with an empty query; the search component receives only the explicit serializable `listCatalog` projection, never registry entries or loaders. It provides a named input, result count, zero-result guidance, and keyboard Clear search with focus returned to the input.

Optional `related` registry URLs connect useful demos and workflows. Define each relationship once, usually on the workflow entry: listing titles and reverse links are derived from the existing section registries. For example, Customers links to Table, Pagination, Action Menu, and Use Debounced Value; those catalogs link back to Customers automatically. These are curated composition pointers, not an exhaustive component-coverage map.

**Demo, composition, and tested behavior are different evidence.** A primitive/field/widget demo shows its stated usage; a workflow composes controls with local business state and simulated outcomes. A capability term or related link is a discovery aid, not proof of a regression contract. For tested behavior, read the assertions in the relevant colocated suite (e.g. customer retained retry drafts and page clamping, settings session drafts, launch saved baselines/calendar dates). In particular, hook-select/searchable-select demos with valid defaults do not establish validation, blur, or option-retention coverage simply by importing those controls. This catalog does not claim full primitive parity, backend behavior, or installed-artifact validation.

Choose the routing strategy per entry:

- **`route: 'dynamic'`** (default for small demos): rendered by `app/<section>/[slug]/page.tsx` through the entry's lazy `import()`. Each implementation lives in its own module under `components/showcases/<section>/<slug>.tsx`, so a page only bundles the showcase it renders. Put `'use client'` inside interactive modules only; presentational showcases stay server components.
- **`route: 'static'`**: use a dedicated `app/<section>/<slug>/page.tsx` when the example needs route-level logic — its own metadata, bespoke composed layout, colocated helper modules (e.g. `widgets/dialog-manager/`), or direct page-module tests.

### Adding a new example

1. Create the implementation module:
   - Component/form/widget demo: `components/showcases/<section>/<slug>.tsx` with a default component export.
   - Real example: `components/real-examples/<slug>/index.tsx` plus local `types.ts`, `fixtures.ts`, `components/`, and `<slug>.test.tsx` as needed (see `components/real-examples/README.md`; no barrel file).
2. Add one entry to `lib/sections/<section>.ts`: `{ slug, route, title, description }` plus `load: () => import('@/components/...')` for dynamic entries.
3. If and only if the example needs route-level logic (own metadata, bespoke layout, colocated helpers, page-module tests), use `route: 'static'` and add `app/<section>/<slug>/page.tsx` instead of a loader.
4. Set the listing copy (`title`, `description`) accurately — it renders verbatim in the catalog. Add a few factual `capabilities` terms and selected `related` URLs when useful; do not duplicate target titles or reverse links. For a new workflow, link only demos of controls it actually composes or directly relevant usage patterns.
5. Verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Registry tests check forward resolution; `lib/example-inventory.test.ts` also walks owned implementation directories in reverse, requiring a dynamic registry entry for every `components/showcases/<section>/<slug>.ts(x)` and `components/real-examples/<slug>/index.ts(x)`. It compares each loader's component with its owned module, so loading an unrelated valid demo cannot mask an orphan. Dedicated static examples live under `app/` instead. Deliberate exclusions are `.test`/`.spec` modules, declarations, `_shared/`, `__tests__/`, the existing `components/showcases/fixtures.ts`, and real-flow internals below their entry point (local components/types/fixtures/controllers). Put new showcase helpers in `_shared/`; unexpected showcase source locations fail rather than silently disappear. The suite includes orphan/exclusion probes; internal-link tests validate related URLs.

## Real-example standards

Real examples are full product flows (pricing, customers, settings, launch request, support inbox) that compose multiple package surfaces around a believable workflow. Conventions (see `components/real-examples/README.md` and `_shared/`):

- **Deterministic fixtures**: fixed calendar dates or UTC event timestamps (see the date contract below; never the wall clock at render time), stable IDs, varied text lengths, zero-result cases. Initial output must be identical across build time and browser time zones.
- **Accessible states**: every loading, empty, error, pending, success, failure, permission-disabled, plan-gated, and destructive state is inspectable and announced (persistent status text / `role="status"` / `role="alert"`, `aria-describedby` reasons — never conveyed by styling alone). Catalog state tooling (`_shared` `ExampleStateToolbar`) is visually marked as tooling, not product UI.
- **Deterministic async**: simulated outcomes go through `_shared/async-simulation.ts` (explicit success/failure, fixed delay, no randomness). Pending actions are duplicated-guarded; destructive actions are confirmed.
- **Responsive behavior**: flows must work at narrow widths (320px), on mobile, and with long labels/values; verify keyboard navigation and focus restoration after dialogs.
- **No external network**: no backend, auth service, payment provider, or remote assets; everything is local and simulated.

### Support inbox scope

`/real-examples/support-inbox` composes the package Resizable (`orientation="horizontal"`, percentage panel sizes), ScrollArea, Sheet and Item controls. At 1024px and wider it uses list/detail panels; below that it opens the selected conversation in a Sheet. Ten fixed local tickets include a long conversation, long references, resolved and historical read-only cases. Search matches subject, customer and ID; status filters affect the list, with the selected conversation explicitly retained outside those filters.

Reply drafts and failures belong to each ticket. Send, resolve and reopen use the shared deterministic simulator; a single in-flight operation blocks other mutations while allowing selection, closing, catalog previews and drafting on other tickets. The pending ticket's draft is frozen. A successful send appends one captured reply and clears only its draft; failures retain the draft for retry. Resolved tickets require reopening to reply; historical tickets explain their read-only restriction. Empty/Loading/Error are previews that retain this mounted session; reload/remount resets it. No email delivery, backend, authentication, assignment, SLA analytics or upload is implemented.

Colocated inbox tests observe real simulator calls, real package controls and focus recovery. The EXB-08 review record in `docs/tasks/20260926-164231-nextjs-business-experience-followup.md` (repository root) records actual browser resize/scroll, mobile keyboard/focus, narrow/desktop and 200%-equivalent viewport evidence and limitations. See the real-example README for the repeatable review checklist; jsdom does not establish layout success.

### Date contract

- **Business calendar dates** (launch request): valid `YYYY-MM-DD` strings throughout fixtures, RHF values, review, saved snapshots/simulated submission, and raw debug JSON. The default is `2026-03-30`; clearing uses `null` and required validation prevents submission. These values have no time or timezone.
- The launch-local `LaunchDateField` composes package Label/Button/Popover/Calendar primitives with RHF `useController`. `FormDatePicker` cannot forward the trigger ref/ARIA/blur needed for actionable validation. The select-only combobox exposes its label, current date, required/invalid state and associated error, and RHF can focus its actual trigger. Trigger and portalled calendar are one blur boundary: opening, moving within the calendar and Escape/selection back to the trigger do not mark it touched; leaving the composite does. Calendar arrow/Enter behavior stays with the package Calendar. The field parses date-only strings with local `parseISO` and converts selections with local `format(date, 'yyyy-MM-dd')`, or `null` when cleared. Do not use `new Date('YYYY-MM-DD')` or `toISOString()` to convert a calendar selection: those introduce UTC semantics and can shift the day.
- Successful submission commits the date-only snapshot as the discard baseline. Newer pending edits stay live and unsaved; failure keeps the previous baseline. Review and debug show the current form value, not a timezone-reformatted saved instant.
- **Event timestamps** represent instants and use full ISO UTC strings, such as `_shared/fixtures.ts`'s `FIXTURE_NOW`. `addDaysUtc` offsets those instants, not business dates. A fixed instant alone does not guarantee the same displayed day in every timezone; render with an explicit timezone when identical server/browser output is required.
- Run all launch-request regressions (`pnpm exec vitest run components/real-examples/launch-request`) in separate processes under `TZ=UTC`, `TZ=America/Los_Angeles`, and `TZ=Pacific/Kiritimati`. Browser/server timezone-disagreement integration is recorded in EXB-08 of `docs/tasks/20260926-164231-nextjs-business-experience-followup.md` (repository root); follow-up validation/keyboard browser checks belong to SX-04 in `docs/tasks/20260926-191800-nextjs-session-validation-followup.md`. The date trigger is now role `combobox`, named `Launch date Mar 30, 2026` initially or `Launch date Pick a date` when cleared; its popup is the `Choose launch date` dialog.

## Testing

`pnpm test` runs focused vitest suites: the registry contract (`lib/example-registry.test.ts`), the import boundary, internal links, route-level tests, and one colocated suite per real example. Add a failing behavior/registry test before fixing confirmed defects; avoid broad snapshots.
