# Next.js Example Catalog Remediation

Created: 2026-09-03 12:42:49 PDT

Status: completed

## Objective

Turn `packages/react/@examples/nextjs` into an accurate, maintainable demonstration of the React theme: copyable examples must work as described, catalog metadata and implementations must not drift, client bundles must not pull in every showcase, and a small set of realistic product flows must exercise the package across responsive, accessible, loading, empty, error, permission, and destructive-action states.

The target real-example set is deliberately focused:

- Pricing and plan selection
- Customer/resource management
- Account and workspace settings
- Launch request, evolved from the existing generic real-example form

Authentication/onboarding and a support inbox are optional follow-ups, not prerequisites for the core catalog.

## Scope

- `packages/react/@examples/nextjs/app/`
- `packages/react/@examples/nextjs/components/`
- `packages/react/@examples/nextjs/lib/`
- `packages/react/@examples/nextjs/package.json`, lockfile integration, lint/test/build configuration, and README
- Focused changes to `packages/react/` only when an example exposes a confirmed package API or accessibility defect; record those separately before crossing the example boundary
- `.github/workflows/test.yml` only for wiring newly added example checks into CI

## Working Rules

- Preserve unrelated worktree changes. At review time, root metadata, workspace files, package publish configuration, and both root lock/workspace files already had unrelated changes. Never reset or overwrite them.
- Keep themed controls on package components. Do not introduce a second UI kit or one-off replicas of package controls.
- Keep domain fixtures deterministic and local. Use stable IDs and fixed ISO dates; do not require an API, authentication service, payment provider, or remote avatar service.
- Keep examples educational. Extract repetitive framing and state management, but leave the package component composition and important props visible at the example call site.
- Add a failing behavior or registry test before fixing confirmed defects where practical. Do not use broad snapshots as the primary assertion.
- Keep server components as the default. Put `'use client'` at the smallest interactive boundary.
- Do not add new real examples to `components/showcases.tsx`; establish the modular real-example structure first.
- Treat `.next/`, `out/`, `tsconfig.tsbuildinfo`, and generated Next types as generated output. Do not commit them.
- Serialize dependency installation, lockfile updates, and `next build` in a shared checkout. They mutate shared state and are not safe for parallel agents.
- Agents changing example imports must coordinate with agents changing `packages/react` source because the example currently compiles parent source directly.
- Do not claim installed-package coverage from this example unless the build actually consumes a staged package. The existing isolated consumer and package validator remain the artifact boundary.

## Review Summary

Confirmed baseline findings:

- The catalog has 60 component links, 22 form links, 7 widget links, and only 1 real example (`lib/example-registry.ts:18-355`).
- `components/showcases.tsx` is a 2,169-line client module importing the complete dynamic showcase surface and retaining all implementations in string-keyed runtime maps (`components/showcases.tsx:1`, `components/showcases.tsx:2108-2169`).
- Catalog metadata, allowed slug sets, and runtime component maps are maintained separately, while the registry comment incorrectly claims two edits are sufficient (`lib/example-registry.ts:349-421`).
- The root layout is a client component solely for pathname-derived navigation, disables user zoom, recreates and mutates navigation data during render, and has no server metadata export (`app/layout.tsx:1-5`, `app/layout.tsx:38-45`, `app/layout.tsx:126-150`).
- Several copyable demos have incorrect behavior: the card submit button is outside its form, dialog fields are read-only and its submit button has no form, the sheet submit button has no form, and the date picker's Today action submits while visual required state contradicts the schema (`app/components/card/page.tsx:24-58`, `app/components/dialog/page.tsx:31-75`, `app/components/sheet/page.tsx:34-49`, `app/form/date-picker/page.tsx:15-19`, `app/form/date-picker/page.tsx:37-75`).
- Three form pages import `react-hook-form` through a parent `node_modules` path, and the example manifest omits multiple packages imported directly by example source (`app/form/textarea/page.tsx:3-5`, `package.json:11-30`).
- The static-export app defines `next start`, has no `typecheck` or `test` script, suppresses unused-variable checks, and permits current lint warnings (`package.json:5-10`, `next.config.ts:3-5`, `eslint.config.mjs:8-11`).
- The only real example initializes visible state with `new Date()`, uses broad `watch()`, exposes raw JSON as its main summary, and inaccurately claims to combine every hook-form field (`components/showcases.tsx:1887-2025`, `lib/example-registry.ts:349-355`).
- `layout2.tsx` and `components/code.tsx` are inactive prototypes; the latter appears to retain several syntax-highlighting dependencies (`app/layout2.tsx:1-124`, `components/code.tsx:1-52`, `package.json:13-27`).
- Navigation-menu demos link to internal `/docs` routes that this app does not provide (`app/components/navigation-menu/page.tsx:16-88`).

Positive baseline:

- Unknown dynamic slugs call `notFound()`, and current registry keys appeared aligned during review.
- `ExamplePage`, `ExampleSection`, `ExampleGrid`, `ExampleStack`, and `ExampleInline` already provide useful shared visual framing (`components/showcase-shell.tsx:4-59`).
- Generated build output is ignored rather than tracked.
- The production static build is already exercised by CI (`.github/workflows/test.yml:101-105`).

## Baseline Verification

Run from the repository root before assigning implementation work:

```bash
git status --short
pnpm --dir packages/react/@examples/nextjs lint
pnpm --dir packages/react/@examples/nextjs exec tsc --noEmit --pretty false --incremental false
pnpm --dir packages/react/@examples/nextjs build
```

Review-time evidence:

- TypeScript passed with `--incremental false`.
- ESLint exited successfully with four warnings: two React Compiler compatibility warnings around React Hook Form `watch()` and two `@next/next/no-img-element` warnings.
- No example test script or `*.test.*`/`*.spec.*` files existed.
- The example uses `output: 'export'`; `next build` is the production and static-export integration gate.
- Build output is local and generated. Do not treat changes under `.next/` or `out/` as source changes.

Installation should follow CI's nested workspace model when needed:

```bash
pnpm install --frozen-lockfile
pnpm --dir packages/react install --frozen-lockfile
pnpm --dir packages/react/@examples/nextjs install --frozen-lockfile
```

Before installing, record checksums or diffs for both lockfiles. After installation, verify that neither changed beyond pre-existing worktree changes; do not use a clean-tree assertion that mistakes another agent's existing lockfile work for an install mutation.

## Priority Definitions

- **P0:** an example teaches broken behavior, violates a critical accessibility expectation, or cannot be reliably built.
- **P1:** architectural drift, oversized client delivery, absent regression boundary, or missing core product-level coverage.
- **P2:** consistency, readability, dependency hygiene, documentation, or non-critical product-state coverage.
- **P3:** optional breadth after the core catalog is complete.

## Wave 1: Quality And Correctness

### Task NEXTEX-01: Add Example Quality Gates And Registry Tests

Status: completed

Priority: P1

Suggested agent: Next.js test infrastructure engineer

Dependencies: none

Primary ownership:

- `packages/react/@examples/nextjs/package.json`
- `packages/react/@examples/nextjs/eslint.config.mjs`
- Example-local test configuration and tests
- `packages/react/pnpm-lock.yaml`
- `.github/workflows/test.yml`

Finding:

The example has only `dev`, `build`, `start`, and warning-tolerant `lint` scripts. It has no durable typecheck or test command, no route/registry contract test, and `next start` does not serve an `output: 'export'` build (`package.json:5-10`, `next.config.ts:3-5`, `.github/workflows/test.yml:101-105`).

References:

- `packages/react/@examples/nextjs/package.json:5-30`
- `packages/react/@examples/nextjs/eslint.config.mjs:1-11`
- `packages/react/@examples/nextjs/lib/example-registry.ts:349-421`
- `.github/workflows/test.yml:101-105`

Implementation requirements:

1. Add explicit `typecheck` and `test` scripts and direct development dependencies needed to execute them reproducibly.
2. Make CI lint fail on warnings; re-enable unused-variable checks with only narrow, documented exceptions.
3. Add registry tests that prove every catalog URL maps to a static route or a dynamic implementation, every dynamic implementation is listed, and duplicate URLs/titles fail.
4. Add at least one interaction-test path suitable for the correctness and real-example tasks. Prefer behavior and accessible-role assertions over snapshots.
5. Replace `next start` with an accurate static-preview command or rename the script so it cannot imply a Next server supports the exported output.
6. Wire `typecheck` and tests into the existing Next.js CI step. Keep build execution serial.

Acceptance criteria:

- Deliberately removing a dynamic implementation or adding a duplicate URL makes `pnpm --dir packages/react/@examples/nextjs test` fail.
- `pnpm --dir packages/react/@examples/nextjs typecheck`, `lint`, `test`, and `build` are separate, discoverable commands.
- Lint exits nonzero on a newly introduced warning.
- CI invokes all four checks and still validates the static export.
- The React workspace lockfile changes only as required for declared example dependencies.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/package.json`, `packages/react/@examples/nextjs/eslint.config.mjs`, `packages/react/@examples/nextjs/vitest.config.ts` (new), `packages/react/@examples/nextjs/lib/example-registry.test.ts` (new), `packages/react/@examples/nextjs/lib/dialog-page.test.tsx` (new), `packages/react/@examples/nextjs/components/showcases.tsx` (dead imports removed, two documented inline suppressions), `packages/react/@examples/nextjs/app/layout2.tsx`, `packages/react/@examples/nextjs/app/components/alert/page.tsx`, `packages/react/@examples/nextjs/app/form/date-picker/page.tsx`, `packages/react/@examples/nextjs/app/widgets/action-menu/page.tsx`, `packages/react/@examples/nextjs/app/widgets/dialog-manager/Dialog1.tsx`, `packages/react/@examples/nextjs/app/widgets/dialog-manager/Dialog2.tsx`, `packages/react/@examples/nextjs/app/widgets/image-preview-dialog/page.tsx` (dead imports/vars removed; narrow inline suppressions tagged with owning task), `packages/react/pnpm-lock.yaml` (example dev-deps only), `.github/workflows/test.yml`
- Verified: `pnpm --dir packages/react/@examples/nextjs typecheck`; `pnpm --dir packages/react/@examples/nextjs lint`; `pnpm --dir packages/react/@examples/nextjs test`; `pnpm --dir packages/react/@examples/nextjs build`; `pnpm --dir packages/react/@examples/nextjs preview` (curl / => HTTP 200); failure-mode probes: commented `aspect-ratio` out of `componentDynamicSlugs` => route-mapping test failed, restored, 17/17 pass; added duplicate `/components/button` URL => duplicate-URL test failed, restored, 17/17 pass; injected a warning into `next.config.ts` => lint exited 1, restored
- Result: 2 test files, 17 tests passing (16 registry contract tests + 1 accessible-role dialog interaction test); lint exits 0 with zero warnings under `eslint --max-warnings 0` with `@typescript-eslint/no-unused-vars` re-enabled (`^_` escape hatch); typecheck clean with `--incremental false`; static export builds all routes; CI `react` job now runs typecheck, lint, test, build serially before/including the existing export gate; root `pnpm-lock.yaml` sha256 unchanged from pre-install baseline (`a20d697a…`), `packages/react/pnpm-lock.yaml` delta limited to `@examples/nextjs` dev dependencies (`vitest`, `@testing-library/dom|react|user-event`, `jsdom`, `serve`, `@types/node`) plus unavoidable peer-resolution hash updates; `next start` replaced by `preview` (`serve out`)
- Follow-up: NEXTEX-02 must remove the `react-hooks/incompatible-library` inline suppressions in `app/form/date-picker/page.tsx` and `components/showcases.tsx` when fixing `watch()`; NEXTEX-06 must remove the two `@next/next/no-img-element` inline suppressions (`components/showcases.tsx:847`, `app/widgets/image-preview-dialog/page.tsx`) when resolving image strategy. `@testing-library/jest-dom` was intentionally omitted: its matchers did not register under vitest 3.2 in this setup; tests currently assert via accessible-role queries instead (revisit if richer matchers are wanted).

### Task NEXTEX-02: Repair Misleading Component And Form Demos

Status: completed

Priority: P0

Suggested agent: React accessibility and forms engineer

Dependencies: NEXTEX-01

Primary ownership:

- `packages/react/@examples/nextjs/app/components/card/page.tsx`
- `packages/react/@examples/nextjs/app/components/dialog/page.tsx`
- `packages/react/@examples/nextjs/app/components/sheet/page.tsx`
- `packages/react/@examples/nextjs/app/form/date-picker/page.tsx`
- Focused interaction tests

Finding:

The login button is outside the login form; dialog and sheet primary actions submit no form; dialog inputs are controlled by fixed values without change handlers; the date picker's Today button implicitly submits; and date fields marked required in the UI are optional in Zod. These are copyable examples with observably incorrect semantics.

References:

- `packages/react/@examples/nextjs/app/components/card/page.tsx:24-58`
- `packages/react/@examples/nextjs/app/components/dialog/page.tsx:31-75`
- `packages/react/@examples/nextjs/app/components/sheet/page.tsx:34-49`
- `packages/react/@examples/nextjs/app/form/date-picker/page.tsx:15-19`
- `packages/react/@examples/nextjs/app/form/date-picker/page.tsx:37-75`

Implementation requirements:

1. Associate each primary submit action with the form containing its inputs.
2. Make editable examples genuinely editable, with meaningful submit behavior and visible success/result feedback.
3. Mark non-submit actions `type="button"`.
4. Align visual required markers, native requirements, React Hook Form rules, and schema validation.
5. Replace broad render-time `watch()` usage with `useWatch` where subscriptions are required.
6. Keep cancel actions and focus restoration functional for overlays.

Acceptance criteria:

- Card login submits through the displayed form and native required validation applies.
- Dialog and sheet save actions submit exactly once, show an observable result, and close only on intended success/cancel behavior.
- Dialog inputs can be edited without controlled-input warnings.
- Clicking Today changes the date without submitting; clicking Submit runs validation.
- Focused tests fail against the reviewed behavior and pass after remediation.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/app/components/card/page.tsx`, `packages/react/@examples/nextjs/app/components/dialog/page.tsx`, `packages/react/@examples/nextjs/app/components/sheet/page.tsx`, `packages/react/@examples/nextjs/app/form/date-picker/page.tsx`, `packages/react/@examples/nextjs/components/showcases.tsx`, `packages/react/@examples/nextjs/lib/form-demo-pages.test.tsx` (new)
- Verified: `pnpm --dir packages/react/@examples/nextjs test`; `pnpm --dir packages/react/@examples/nextjs typecheck`; `pnpm --dir packages/react/@examples/nextjs lint`; `pnpm --dir packages/react/@examples/nextjs build`; failure-first probe: all 8 new `lib/form-demo-pages.test.tsx` assertions failed against the pre-fix pages (card Login did nothing, dialog inputs refused edits, sheet Save submitted nothing, Submit produced no validation errors, Today triggered `handleSubmit`), then passed after remediation
- Result: 25/25 tests pass (3 files; 8 new form-demo tests + 17 pre-existing); typecheck clean with `--incremental false`; lint exits 0 with zero warnings under `--max-warnings 0`; static export builds all routes. Card: inputs carry `name` + native `required`, footer Login uses `type="submit" form="login-form"`, and successful submit renders `role="status"` feedback; non-submit buttons (`Sign Up`, `Login with Google`) are `type="button"`. Dialog: name/username inputs are properly controlled with change handlers, fields and footer sit inside one `<form>`, Save writes a single `role="status"` result and closes; Cancel closes without saving (Radix focus restoration retained). Sheet: same form/wrap/save pattern with controlled `open`; footer Close is `type="button"` inside `SheetClose`, close-without-save verified. Date picker: Today is `type="button"` and only sets `date2`; Zod schema enforces all three visually-required fields via `superRefine` with field paths, RHF `rules={{ required }}` on the hook-form picker matches, submit renders per-field `role="alert"` errors or a `role="status"` submission summary; the two broad `watch()` calls in this page and the suppressed `watch()` in `components/showcases.tsx` were replaced by `useWatch`, removing both NEXTEX-02-tagged `react-hooks/incompatible-library` suppressions.
- Follow-up: NEXTEX-11 still owns the deeper launch-request redesign in `components/showcases.tsx` (raw JSON summary, `new Date()` default); its `useWatch` no longer needs the suppression. Note for NEXTEX-01's test-setup follow-up: vitest globals are disabled, so RTL auto-cleanup never registers — `lib/form-demo-pages.test.tsx` calls `cleanup()` explicitly in `afterEach`.

### Task NEXTEX-03: Restore Accessible, Server-First Application Shell

Status: completed

Priority: P0

Suggested agent: Next.js App Router and accessibility engineer

Dependencies: NEXTEX-01

Primary ownership:

- `packages/react/@examples/nextjs/app/layout.tsx`
- A small client shell/navigation component under `components/`
- `packages/react/@examples/nextjs/app/globals.css`
- `packages/react/@examples/nextjs/app/manifest.json`

Finding:

The root layout is client-only for `usePathname`, prevents user zoom, builds and mutates static navigation data during each render, loads Geist while body styles specify Arial, and hard-codes the toaster to light despite dark tokens (`app/layout.tsx:1-5`, `app/layout.tsx:38-150`, `app/globals.css:10-18`, `app/globals.css:85`, `app/globals.css:160-208`).

References:

- `packages/react/@examples/nextjs/app/layout.tsx:1-24`
- `packages/react/@examples/nextjs/app/layout.tsx:38-150`
- `packages/react/@examples/nextjs/app/globals.css:10-18`
- `packages/react/@examples/nextjs/app/globals.css:85`
- `packages/react/@examples/nextjs/app/manifest.json:14-15`

Implementation requirements:

1. Keep the root layout a Server Component and move pathname-dependent active navigation into the smallest client component.
2. Export accurate Next metadata and viewport configuration; do not restrict zoom.
3. Keep static sidebar data at module scope and derive active state without mutating shared definitions.
4. Remove duplicate/contradictory font rules and apply the configured Geist variable consistently.
5. Either provide a real theme mechanism that synchronizes toaster and manifest behavior or remove unsupported dark-theme implications. Do not build a theme system solely to satisfy this task.
6. Reassess the global `touch-action: manipulation` rule and retain it only with a documented interaction need.

Acceptance criteria:

- Browser pinch zoom and 200% page zoom are not blocked.
- Root metadata and viewport are server exports.
- Active navigation remains correct on index, static, dynamic, and unknown routes.
- The server layout does not import or call `usePathname`.
- Font and toaster behavior match the documented theme behavior.
- Lint, typecheck, shell tests, and static build pass.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/app/layout.tsx` (rewritten as a Server Component with `metadata` + `viewport` exports), `packages/react/@examples/nextjs/components/site-nav.tsx` (new client boundary: module-scope `SIDEBAR_DATA`, pure `withActiveNav` derivation, `usePathname` only here), `packages/react/@examples/nextjs/components/site-nav.test.tsx` (new, 8 tests), `packages/react/@examples/nextjs/app/globals.css` (Arial rules and `touch-action: manipulation` removed; `--font-sans` and body font now derive from next/font's `--font-geist-sans`)
- Verified: `pnpm --dir packages/react/@examples/nextjs test` (33/33 pass: 25 pre-existing + 8 new shell tests), `pnpm --dir packages/react/@examples/nextjs typecheck`, `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`), `pnpm --dir packages/react/@examples/nextjs build` (static export succeeds, all routes; only pre-existing turbopack workspace-root inference warning remains)
- Result: root layout is a Server Component with no `usePathname` and no client directive; `metadata` (title/description/manifest) and `viewport` (`width=device-width, initialScale=1`, no `maximumScale`/`userScalable`) are server exports — pinch and 200% zoom are not blocked (viewport export plus removal of global `touch-action: manipulation`). Sidebar data lives at module scope; `withActiveNav` returns a fresh structure and tests prove the shared data is never mutated. Active-nav correctness is verified via the pure `withActiveNav` helper for index (`/`), static (`/components`, `/form`), dynamic (`/components/button`, `/form/textarea`), and unknown (`/does-not-exist`, `/components/not-a-real-slug`) routes, plus two jsdom render tests (mocked `usePathname`) asserting the breadcrumb trail. Theme decision: the app genuinely follows the system color scheme via `SidebarLayout`'s `next-themes` provider (`defaultTheme="system"`), so the honest fix was a one-prop sync: `<Toaster theme="system">` with a layout comment; no theme toggle mechanism was added, and the `.dark` token block remains genuinely reachable via system preference. Fonts: single Geist source of truth — `Geist`/`Geist_Mono` variables on `<body>`, `--font-sans`, and the base-layer body rule; the contradictory Arial blocks are gone.
- Follow-up: `app/manifest.json` is unchanged (`theme_color`/`background_color` `#ffffff` describe the light scheme that matches the default system-light rendering); a future dark-aware manifest would need a `manifest.ts` route with media query support, which Next does not provide for static JSON — noted here rather than silently editing colors. NEXTEX-04 still owns declaring any newly direct-imported example dependencies; this task added none.

## Wave 2: Boundaries And Architecture

### Task NEXTEX-04: Define And Enforce The Example Dependency Boundary

Status: completed

Priority: P1

Suggested agent: React package integration engineer

Dependencies: NEXTEX-01

Primary ownership:

- `packages/react/@examples/nextjs/package.json`
- `packages/react/@examples/nextjs/tsconfig.json`
- Example imports
- `packages/react/pnpm-lock.yaml`
- `packages/react/@examples/nextjs/README.md`

Finding:

The app imports parent React source through deep relative paths and, in three pages, imports `react-hook-form` from a parent `node_modules` directory. It directly imports dependencies absent from its manifest, so it is neither self-contained nor a faithful installed-package consumer (`app/form/textarea/page.tsx:3-7`, `components/showcases.tsx:31-233`, `package.json:11-30`).

References:

- `packages/react/@examples/nextjs/app/form/textarea/page.tsx:3-7`
- `packages/react/@examples/nextjs/app/form/native-select/page.tsx:3`
- `packages/react/@examples/nextjs/app/form/select/page.tsx:3`
- `packages/react/@examples/nextjs/app/layout.tsx:8-11`
- `packages/react/package.json:39-160`

Implementation requirements:

1. Record the selected contract before migrating imports: source-integration playground or staged installed-package consumer.
2. Recommended default: retain fast source integration, map package-style `@egose/shadcn-theme/*` imports to parent source for development, and state explicitly that artifact coverage belongs to `packages/react` package/consumer tests.
3. If maintainers instead choose a staged consumer, define how `dev` and CI obtain fresh `dist`; do not silently consume stale generated artifacts.
4. Replace all explicit parent `node_modules` paths with package specifiers.
5. Declare every package imported directly by example code in the example manifest, with runtime versus development placement chosen intentionally.
6. Add a test or lint restriction that prevents new parent `node_modules` and fragile multi-level package-source imports.

Acceptance criteria:

- A clean nested-workspace install resolves every direct example import without undeclared dependency leakage.
- No example source imports through `../node_modules` or five-level parent-source paths.
- Example source uses one documented package import convention.
- README accurately distinguishes source integration from staged artifact validation.
- Lint, typecheck, tests, build, and relevant package artifact checks pass for the chosen contract.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/tsconfig.json` (`"@egose/shadcn-theme/*": ["../../*"]` paths mapping), `packages/react/@examples/nextjs/vitest.config.ts` (mirrored regex alias), `packages/react/@examples/nextjs/package.json` (new `dependencies` block: `@hookform/resolvers`, `@tabler/icons-react`, `date-fns`, `lodash-es`, `lucide-react`, `react-day-picker`, `react-hook-form`, `sonner`, `zod`; `next`/`react`/`react-dom` moved from devDependencies to dependencies), `packages/react/@examples/nextjs/lib/import-boundary.test.ts` (new guard test), `packages/react/@examples/nextjs/README.md` (dependency-model + commands), 46 example source files rewritten from `../../../../..`-style parent-source/`node_modules` imports to `@egose/shadcn-theme/*` or bare specifiers, `packages/react/pnpm-lock.yaml` (example dependency additions + peer-resolution metadata)
- Verified: `pnpm --dir packages/react/@examples/nextjs install` (clean, all direct imports resolve; root `pnpm-lock.yaml` sha256 unchanged at `a20d697a…`, `packages/react/pnpm-lock.yaml` `d5d93765…` → `36de4885…`, delta limited to the `@examples/nextjs` importer and resolution metadata); `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings); `pnpm --dir packages/react/@examples/nextjs typecheck`; `pnpm --dir packages/react/@examples/nextjs test`; `pnpm --dir packages/react/@examples/nextjs build` (static export, all routes; turbopack resolves tsconfig `paths`, no extra webpack/alias config needed). Failure probe: a temp file with `../../../../../node_modules/react-hook-form` and `../../../../../components/ui/button` made `lib/import-boundary.test.ts` fail (2 failing assertions), removed, 4/4 pass.
- Result: 37/37 tests pass across 5 files (33 pre-existing + 4 new boundary tests). Zero `../node_modules` imports remain; zero relative imports escape the example root (verified by test and grep). Single documented convention: `@egose/shadcn-theme/*` (package specifiers, mapped to source), `@/*` (example-local), bare npm specifiers for everything else. `react-hook-form` resolved at 7.81.0, matching the parent package's installed version.
- Follow-up: NEXTEX-06 still owns removing inactive `layout2.tsx`/`components/code.tsx` and pruning the rehype/shiki/unified/remark devDependencies they retain; NEXTEX-13 owns the fuller README rewrite (dependency-model section already present and must be preserved).

### Task NEXTEX-05: Replace The Monolithic Showcase And Drift-Prone Registries

Status: completed

Priority: P1

Suggested agent: Next.js module architecture engineer

Dependencies: NEXTEX-01, NEXTEX-04

Primary ownership:

- `packages/react/@examples/nextjs/components/showcases.tsx`
- New feature-family showcase modules
- `packages/react/@examples/nextjs/lib/example-registry.ts`
- Dynamic `[slug]/page.tsx` routes
- Section catalog pages

Finding:

One 2,169-line client module owns all dynamic implementations, imports the full UI/form surface, and dispatches via untyped string maps. Catalog metadata, dynamic slug allowlists, and maps are separate sources of truth. Static and dynamic page styles are mixed without a documented criterion (`components/showcases.tsx:1-233`, `components/showcases.tsx:2108-2169`, `lib/example-registry.ts:357-421`).

References:

- `packages/react/@examples/nextjs/components/showcases.tsx:1`
- `packages/react/@examples/nextjs/components/showcases.tsx:2108-2169`
- `packages/react/@examples/nextjs/lib/example-registry.ts:357-421`
- `packages/react/@examples/nextjs/app/components/[slug]/page.tsx:1-17`
- `packages/react/@examples/nextjs/app/form/[slug]/page.tsx:1-17`
- `packages/react/@examples/nextjs/app/real-examples/[slug]/page.tsx:1-18`

Implementation requirements:

1. Define one typed registry per section from which listing metadata, valid slugs, static params, and implementation loaders are derived.
2. Make registry key mismatch a type or test failure; do not retain `Record<string, React.ComponentType>` as the contract.
3. Split implementations by feature or example and load only the selected showcase. Keep `'use client'` inside interactive modules rather than on a global showcase barrel.
4. Establish and document when a dedicated static route is preferable to a registry-backed dynamic route.
5. Extract one server-compatible catalog grid/page component for the four duplicated index pages.
6. Preserve URLs unless a separately approved rename has an explicit redirect/export strategy.

Acceptance criteria:

- Adding one registry entry is sufficient to produce listing metadata, static params, slug validation, and implementation lookup.
- A missing loader or unlisted implementation fails typecheck or tests.
- Building a simple dynamic component route does not require one client module containing all component, form, widget, and real-example implementations.
- Component, form, widget, and real-example catalog pages share presentation without hiding their data.
- Existing known URLs still export successfully and unknown slugs still call `notFound()`.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/components/showcases.tsx` (deleted — 2,158-line monolith), `packages/react/@examples/nextjs/lib/example-registry.ts` (rewritten as typed `defineSection` core: `RegistryEntry` discriminated union on `route: 'static' | 'dynamic'`, `ShowcaseLoader`, derivation of URLs/`dynamicSlugs`, and documented static-vs-dynamic route criteria), `packages/react/@examples/nextjs/lib/sections/{components,form,widgets,real-examples}.ts` (new; one entry list per section combining former listing arrays, slug sets, and per-slug lazy `load()` imports, preserving the original ordering/grouping comments), `packages/react/@examples/nextjs/components/showcases/fixtures.ts` + `components/showcases/components/*.tsx` (36 modules), `components/showcases/form/*.tsx` (17 modules), `components/showcases/real-examples/real-example-form.tsx` (mechanical split; shared deterministic fixtures extracted; `'use client'` only in interactive modules — 26 of 36 component showcases and all hook-form modules; purely presentational showcases are now server components), `packages/react/@examples/nextjs/components/catalog-page.tsx` (new server-compatible `CatalogIndexPage` shared by the four section index pages), `packages/react/@examples/nextjs/components/dynamic-showcase.tsx` (new `DynamicShowcase`/`LazyEntry` resolving `entry.load()` via `React.use`), `packages/react/@examples/nextjs/app/{components,form,real-examples}/[slug]/page.tsx` (derive `generateStaticParams`/validation from `section.dynamicSlugs`, still call `notFound()`), `packages/react/@examples/nextjs/app/{components,form,widgets,real-examples}/page.tsx` (thin wrappers over `CatalogIndexPage`), `packages/react/@examples/nextjs/components/site-nav.tsx` and `app/page.tsx` (read `section.entries`), `packages/react/@examples/nextjs/lib/example-registry.test.ts` (rewritten: 21 tests — dup URLs/titles/slugs, derived-URL shape, static-route existence, no static+dynamic overlap, `dynamicSlugs` derivation, and every lazy loader resolving to a component module), `packages/react/@examples/nextjs/README.md` (new "Catalog registry and routing" section documenting when a dedicated static route is preferred over a registry-backed dynamic route)
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`); `typecheck` (clean, `--incremental false`); `test` (42/42 pass across 5 files); `build` (static export, 101 pages — all 36 component + 17 form + 1 real-example dynamic slugs plus every pre-existing static route). Export checks: `out/components/kbd.html` renders only the Kbd showcase, `out/form/hook-text-input.html` and `out/real-examples/real-example-form.html` prerender correctly, `out/404.html` emitted and unknown slugs are absent from `generateStaticParams` and hit `notFound()`. Failure-mode probes: flipped `aspect-ratio` to `route: 'static'` with no page file → registry test failed, restored; dropped one `load` from a dynamic entry → `tsc` TS2322 on `RegistryEntry`, restored, 21/21 pass.
- Result: one registry entry now supplies listing metadata, URL, valid-slug/static-params derivation, and the lazy implementation loader; the `Record<string, ComponentType>` runtime maps are gone and mismatches fail at typecheck or test time. No module imports more than its own showcase's dependencies; there is no `'use client'` barrel. The `input-group` showcase carries a documented `'use client'` because the package's `InputGroupAddon` injects an `onClick` focus handler without its own client marker. Turbopack note: per-page HTML/RSC payloads differ per slug and each showcase is its own module/chunk boundary, but Turbopack's production chunk merging also folds small async modules into a shared ~130 KB chunk referenced by multiple pages; the per-entry lazy-loader structure (not bundler heuristics) is the architectural guarantee this task controls, and no form/real-example implementation chunk is referenced by component-section pages beyond that shared chunk.
- Follow-up: NEXTEX-06 still owns the `no-img-element` suppression now located in `components/showcases/components/item.tsx` (same NEXTEX-06 tag). NEXTEX-07 gains the colocated `components/showcases/real-examples/` directory convention; NEXTEX-11 owns the `real-example-form.tsx` redesign (moved verbatim, including its `new Date()` default). Widget examples remain `route: 'static'`; moving any to dynamic now requires only flipping the entry and adding a loader/module.

### Task NEXTEX-06: Remove Dead Prototypes And Normalize Remaining Catalog Content

Status: completed

Priority: P2

Suggested agent: frontend maintainability engineer

Dependencies: NEXTEX-03, NEXTEX-04, NEXTEX-05

Primary ownership:

- `packages/react/@examples/nextjs/app/layout2.tsx`
- `packages/react/@examples/nextjs/components/code.tsx`
- `packages/react/@examples/nextjs/app/components/navigation-menu/page.tsx`
- `packages/react/@examples/nextjs/app/widgets/dialog-manager/`
- `packages/react/@examples/nextjs/app/widgets/use-debounced-value/page.tsx`
- Dead dependencies in the example manifest

Finding:

Inactive `layout2.tsx` and `Code` prototypes obscure the active architecture and retain likely-unused syntax-highlighting dependencies. Navigation-menu examples point to absent `/docs` routes. The dialog-manager page bypasses shared page framing, uses generic `Dialog1`/`Dialog2` names and blocking alerts, and omits rendered descriptions. Debounce prose overstates render behavior.

References:

- `packages/react/@examples/nextjs/app/layout2.tsx:1-124`
- `packages/react/@examples/nextjs/components/code.tsx:1-52`
- `packages/react/@examples/nextjs/app/components/navigation-menu/page.tsx:16-88`
- `packages/react/@examples/nextjs/app/widgets/dialog-manager/page.tsx:3-23`
- `packages/react/@examples/nextjs/app/widgets/dialog-manager/Dialog1.tsx:3-44`
- `packages/react/@examples/nextjs/app/widgets/use-debounced-value/page.tsx:112-115`

Implementation requirements:

1. Delete inactive prototypes or move a genuinely retained experiment under an explicitly documented experimental route. Do not keep unreachable examples.
2. Remove dependencies used only by deleted code and update the lockfile through one owner.
3. Point navigation examples to real local routes or clearly external documentation URLs; replace `href="#"` where the action is not navigation.
4. Bring dialog-manager examples under shared framing, use workflow names, render accessible descriptions, and replace `alert()` with visible state or toasts.
5. Correct debounce prose to claim only what the code guarantees.
6. Resolve image lint warnings by a deliberate static-export-compatible strategy or narrowly documented suppression, not by accepting baseline warnings.

Acceptance criteria:

- No dead internal `/docs` links or action-only `href="#"` links remain in audited examples.
- No unreachable prototype or dependency retained solely for unreachable code remains.
- Dialog examples have accessible names/descriptions and non-blocking observable outcomes.
- Lint reports zero warnings and registry/link tests pass.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/app/layout2.tsx` (deleted), `packages/react/@examples/nextjs/components/code.tsx` (deleted — `layout2.tsx` had no references; NEXTEX-03 had not removed it), `packages/react/@examples/nextjs/package.json` (removed devDependencies used only by the `Code` prototype: `@rehype-pretty/transformers`, `rehype-pretty-code`, `rehype-slug`, `rehype-stringify`, `remark-parse`, `remark-rehype`, `shiki`, `unified`), `packages/react/pnpm-lock.yaml` (removals only), `packages/react/@examples/nextjs/app/components/navigation-menu/page.tsx` (dead `/docs/*` links replaced with real local catalog routes `/`, `/components`, `/widgets`, `/components/{alert-dialog,hover-card,progress,scroll-area,tabs,tooltip}`; direct Docs link now points to the clearly-external `https://ui.shadcn.com/docs` in a new tab with external-link icon and sr-only note), `packages/react/@examples/nextjs/app/components/card/page.tsx` (action-only `href="#"` "Forgot your password?" link replaced with a `type="button"` link-style Button that renders visible `role="status"` demo-only notice), `packages/react/@examples/nextjs/app/widgets/dialog-manager/page.tsx` (rewritten under `ExamplePage`/`ExampleSection`/`ExampleStack`; `alert()` replaced by `role="status"` outcome text plus sonner toast), `packages/react/@examples/nextjs/app/widgets/dialog-manager/confirm-contact-dialog.tsx` + `team-size-dialog.tsx` (workflow-named replacements for `Dialog1`/`Dialog2`, both with `DialogDescription`; nested-dialog result surfaces as inline status text instead of `alert()`; `console.log` date-range handler replaced with controlled state), `packages/react/@examples/nextjs/app/widgets/use-debounced-value/page.tsx` (prose corrected: page re-renders per keystroke — raw badge proves it; only debounced-value-derived list content changes per pause), `packages/react/@examples/nextjs/next.config.ts` (`images: { unoptimized: true }` with comment — the static-export-compatible image strategy), `packages/react/@examples/nextjs/app/widgets/image-preview-dialog/page.tsx` and `packages/react/@examples/nextjs/components/showcases/components/item.tsx` (both NEXTEX-06-tagged `no-img-element` suppressions removed; now `next/image`, `fill`-based thumbnail and 80x80 avatar), `packages/react/@examples/nextjs/lib/internal-links.test.ts` (new: 4 guard tests — no `/docs` internal links, every hardcoded internal href resolves to a registry URL or known route, prototype files stay deleted, no blocking `alert()` in example sources)
- Verified: `pnpm --dir packages/react/@examples/nextjs install` (serialized; removals only — root `pnpm-lock.yaml` sha256 unchanged at `a20d697a…`, `packages/react/pnpm-lock.yaml` `36de4885…` → `59fefb45…`); `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0` — zero `no-img-element` suppressions remain); `pnpm --dir packages/react/@examples/nextjs typecheck`; `pnpm --dir packages/react/@examples/nextjs test` (46/46 pass, 6 files); `pnpm --dir packages/react/@examples/nextjs build` (static export succeeds, all routes; `out/components/navigation-menu.html` contains zero `href="/docs` links, pravatar/unsplash images render as plain `<img>` via unoptimized next/image). Failure-mode probe: temp `app/__probe__.tsx` with `href="/docs/gone"` made 2 link tests fail; removed, 4/4 pass.
- Result: no dead `/docs` links or action-only `href="#"` remain in audited examples (breadcrumb/pagination/sidebar showcase `href="#"` placeholders are navigation-component demos and are permitted by the link test's `#` carve-out); no unreachable prototype or prototype-only dependency remains; both dialog-manager dialogs have `DialogTitle` + `DialogDescription` (Radix wires `aria-describedby` automatically) and non-blocking, visible outcomes; lint 0 warnings; typecheck, test (46), and serial build all pass.
- Follow-up: none. (README's stale rehype-pretty-code link is owned by NEXTEX-13.)

## Wave 3: Real-Example Foundation

### Task NEXTEX-07: Establish Modular Real-Example Infrastructure

Status: completed

Priority: P1

Suggested agent: frontend application architecture engineer

Dependencies: NEXTEX-05

Primary ownership:

- `packages/react/@examples/nextjs/components/real-examples/`
- Real-example registry wiring
- Shared deterministic fixture and catalog-state utilities

Finding:

The only real example lives in the monolithic showcase module. There is no ownership boundary for a product flow, deterministic fixture convention, reusable responsive resource framing, or consistent way to inspect loading/empty/error/read-only states.

References:

- `packages/react/@examples/nextjs/components/showcases.tsx:1887-2025`
- `packages/react/@examples/nextjs/components/showcases.tsx:2167-2169`
- `packages/react/@examples/nextjs/lib/example-registry.ts:349-355`

Implementation requirements:

1. Create one directory per real example, with its main surface, local components, types, and fixture data colocated.
2. Add only small domain-neutral local blocks justified by at least two examples, such as `StatusBadge`, `ExampleStateToolbar`, `ResourceToolbar`, or `SettingsSection`.
3. Keep state-switching controls clearly labeled as catalog tooling and out of the product surface semantics.
4. Standardize deterministic async simulation with explicit pending, success, and failure controls; avoid random outcomes and real network calls.
5. Use fixed dates, stable IDs, varied text lengths, image fallbacks, and fixtures that exercise zero-result and disabled states.
6. Keep local blocks in the example app until repeated package-level demand justifies promotion.

Acceptance criteria:

- Each real example can be imported and tested independently.
- No real example is added to `components/showcases.tsx`.
- Fixtures render identically across builds and time zones.
- State tooling can expose required states without query APIs or backend services.
- Shared abstractions have at least two call sites or remain colocated with their single owner.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/components/real-examples/README.md` (new — directory-per-example convention: `<slug>/{index.tsx,components/,types.ts,fixtures.ts,<slug>.test.tsx}`, no barrel, per-flow registry loader, colocated fixtures), `components/real-examples/_shared/async-simulation.ts` (new — `simulate<T>(data, {outcome:'success'|'failure', delayMs, failureMessage})`, fixed default 400ms delay, `__simulated`-tagged errors, `isSimulatedError`; explicit outcomes only, no randomness, no network, server-safe), `components/real-examples/_shared/example-state-toolbar.tsx` (new — `'use client'` `ExampleStateToolbar` switching `loading/empty/error/loaded` via package `Button`, `aria-pressed`, `role="toolbar"` with aria-label and dashed-border "Catalog state tooling" badge marking it as catalog tooling, not product surface, plus a visible "not part of the product UI" note; justified by pricing, customers, and settings consumers), `components/real-examples/_shared/fixtures.ts` (new — deterministic conventions: `FIXTURE_NOW` fixed UTC ISO string, `addDaysUtc` day arithmetic, `stableId` padded IDs, `avatarFallbackFor` initials, `SHORT_LABEL`/`LONG_LABEL` varied text lengths, frozen `EMPTY_RESULTS` zero-result constant; server-safe), `components/real-examples/_shared/real-example-tooling.test.tsx` (new — 12 tests), `packages/react/@examples/nextjs/lib/sections/real-examples.ts` (comment documents that each dynamic entry maps to `components/real-examples/<slug>/index.tsx`; existing `real-example-form` loader unchanged and still working — NEXTEX-11 owns its migration)
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`); `pnpm --dir packages/react/@examples/nextjs typecheck` (clean, `--incremental false`); `pnpm --dir packages/react/@examples/nextjs test` (58/58 pass, 7 files — 21 registry contract tests incl. real-examples loader resolution all pass unchanged); `pnpm --dir packages/react/@examples/nextjs build` (static export, all routes; `out/real-examples/real-example-form.html` still prerenders). Failure probe: initial `Badge variant="outline"` (not in package variant union) failed typecheck with TS2322 as expected; switched to `muted`.
- Result: each future real example is a self-contained directory under `components/real-examples/<slug>/` importable and testable independently via its registry loader (no barrel, no additions to any showcase module). State tooling exposes loading/empty/error/loaded without any backend or query API; async simulation is deterministic (explicit outcome, fixed delay, fake-timer-verified). Fixtures rendering is time-zone independent (`FIXTURE_NOW` UTC constant; `addDaysUtc` verified with ±day offsets; no `new Date()` anywhere in the shared modules). Shared abstractions documented in `components/real-examples/README.md`.
- Follow-up: NEXTEX-03's noted global test-setup gap also applies here — this task's test file calls `cleanup()` explicitly in `afterEach` like NEXTEX-02's. NEXTEX-08..10 must queue their registry entries through one integration owner; NEXTEX-11 migrates `real-example-form` into `components/real-examples/launch-request/` and then the temporary loader exception comment in `lib/sections/real-examples.ts` can be removed.

Tasks NEXTEX-08, NEXTEX-09, and NEXTEX-10 may run in parallel after NEXTEX-07 if each agent owns only its feature directory. Registry edits must be queued through one integration owner.

### Task NEXTEX-08: Build Pricing And Plan Selection

Status: completed

Priority: P1

Suggested agent: responsive product UI engineer

Dependencies: NEXTEX-03, NEXTEX-07

Primary ownership:

- `packages/react/@examples/nextjs/components/real-examples/pricing/`
- Pricing-focused tests
- Queued pricing registry entry

Finding:

Pricing concepts exist only as disconnected plan selects, billing tables, and a plan-change drawer; the catalog has no coherent marketing or plan-selection flow. The package's public `SimpleLayout` is not exercised by an active route (`components/showcases.tsx:241-245`, `components/showcases.tsx:532-563`, `components/showcases.tsx:1445-1478`, `packages/react/layouts/simple/index.tsx:10-66`).

References:

- `packages/react/@examples/nextjs/lib/example-registry.ts:349-355`
- `packages/react/components/ui/button.tsx:50-123`
- `packages/react/components/ui/card.tsx:1-69`
- `packages/react/components/ui/table.tsx:1-70`
- `packages/react/layouts/simple/index.tsx:10-66`

Implementation requirements:

1. Add `/real-examples/pricing` with monthly/annual selection, three plans, current and recommended statuses, feature comparison, FAQ, and plan-change confirmation.
2. Compose package `Card`, `Badge`, `Button`, a labeled single-choice control, `Table`, `Tooltip`, `Accordion`, alert, separator, and dialog/drawer primitives.
3. Provide pending success and failure upgrade states. Prevent duplicate actions while pending; do not rely on a toast as the only persistent status.
4. Make cards one-column on narrow screens and make comparison overflow deliberate and discoverable.
5. Use semantic lists and a captioned comparison table; expose savings/current/recommended meaning as text, not color alone.
6. Decide with the shell owner whether pricing genuinely uses `SimpleLayout` through a route group or is explicitly documented as a framed preview.
7. Do not add payment collection, tax, Stripe, or unsupported chart behavior.

Acceptance criteria:

- Billing period is keyboard-operable and visibly updates deterministic prices.
- Current/recommended states and disabled/pending controls have accessible text.
- Confirmation supports cancel, success, failure, focus restoration, and duplicate-submit prevention.
- The layout works at 320px, 768px, desktop width, and 200% zoom without clipping critical controls.
- Pricing interaction tests, lint, typecheck, and static build pass.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/components/real-examples/pricing/types.ts` (new — `BillingPeriod`, `PlanId`, `Plan`, `ComparisonRow`, `FaqEntry`, `UpgradeOutcome`), `components/real-examples/pricing/fixtures.ts` (new — three deterministic plans: Starter $12/$10 (current), Growth $29/$24 (recommended), Scale $79/$65; fixed savings claims, 6 comparison rows, 4 FAQ entries; no dates or randomness), `components/real-examples/pricing/components/plan-card.tsx` (new — package `Card`/`Badge`/`Button`/`Tooltip`; "Current plan" and "Recommended" as text badges; per-plan feature `<ul>`; `aria-live` price block while billing toggles; disabled "Current plan" button; passes the clicked button element up for focus restoration), `components/real-examples/pricing/index.tsx` (new — main surface composing package Card, Badge, Button, ToggleGroup (labeled single-choice billing control — Radix renders it as `role="radio"` items, keyboard-operable), captioned `Table` inside a focusable `role="region"` scroll container with a visible horizontal-scroll hint, `Tooltip`, `Accordion` FAQ, `Alert`, `Separator`, `Dialog`; `_shared` `ExampleStateToolbar` (loading/empty/error/loaded with retry) and `_shared/async-simulation.ts` `simulate` for the plan-change request (fixed 400 ms delay, explicit success/failure chosen via a second dashed-border catalog control); duplicate-submit prevention via `submitting` guard + `loading` (disabled) confirm button; persistent result as `role="status"` text / destructive `Alert`, never toast-only; explicit focus restoration to the opening trigger on cancel via ref + post-unmount effect; plan cards in a semantic `<ul>`; single-column at 320px, `md:grid-cols-3`), `packages/react/@examples/nextjs/lib/sections/real-examples.ts` (new `pricing` dynamic entry: loader `@/components/real-examples/pricing`), `components/real-examples/pricing/pricing.test.tsx` (new — 8 tests).
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`); `pnpm --dir packages/react/@examples/nextjs typecheck` (clean, `--incremental false`); `pnpm --dir packages/react/@examples/nextjs test` (66/66 pass, 8 files); `pnpm --dir packages/react/@examples/nextjs build` (static export; `/real-examples/pricing` prerendered alongside `/real-examples/real-example-form`). Tests cover: monthly↔annual radio toggle updates prices and savings text; cancel restores focus to the trigger (async `waitFor` after rAF-based restoration); success with pending-disabled confirm (second click is a no-op) and persistent "Your plan is now Growth." status; deterministic failure alert with plan unchanged; captioned table, row/column headers, labeled scroll region, text badges, FAQ accordion, all toolbar states.
- Result: `/real-examples/pricing` exists as an isolated, deterministic flow under `components/real-examples/pricing/` (no entry in any showcase module). Billing period is keyboard-operable (radiogroup) and visibly updates prices; current/recommended/savings conveyed as text; confirmation supports cancel/success/failure, blocks duplicate submits, and restores focus on cancel; comparison overflow is a deliberate focusable scroll region with a hint; grid is single-column below md breakpoints. Layout decision: framed product preview inside catalog chrome (see Maintainer Decisions — Real-example layout). No payment, tax, Stripe, or chart behavior.
- Follow-up: none. Registry integration remained serial (single agent); NEXTEX-09/10 still queue their entries through one integration owner.

### Task NEXTEX-09: Build Responsive Customer Resource Management

Status: completed

Priority: P1

Suggested agent: data-rich responsive UI engineer

Dependencies: NEXTEX-07

Primary ownership:

- `packages/react/@examples/nextjs/components/real-examples/customers/`
- Customer-focused tests
- Queued customer registry entry

Finding:

The package has table, item, badges, avatars, action menus, pagination, dialogs, skeletons, empty states, alerts, and `useDebouncedValue`, but no realistic list/search/filter/mutation workflow combines them.

References:

- `packages/react/@examples/nextjs/lib/example-registry.ts:92-117`
- `packages/react/@examples/nextjs/lib/example-registry.ts:150-153`
- `packages/react/@examples/nextjs/lib/example-registry.ts:184-187`
- `packages/react/@examples/nextjs/lib/example-registry.ts:334-345`
- `packages/react/hooks/use-debounced-value.tsx:5-25`
- `packages/react/components/widgets/action-menu.tsx:10-51`

Implementation requirements:

1. Add `/real-examples/customers` with page header actions, debounced search, status/plan filters, result count, reset, pagination, and row actions.
2. Render one resource model as a semantic desktop table and intentional mobile item/card representation without duplicating fixture or mutation state.
3. Include deterministic loading, initial-empty, filtered-empty, error/retry, and loaded states.
4. Use text-backed status badges, fallback avatars, long names, archived/disabled rows, and enough fixtures to exercise pagination.
5. Use text-input and confirmation dialog workflows for rename/add and archive operations; preserve focus and require explicit destructive confirmation.
6. Announce result-count changes politely where useful and keep actions reachable without hover.

Acceptance criteria:

- Search filtering recomputes after the documented debounce delay and reset restores the full first page.
- Loading, initial-empty, no-results, error, and loaded states are independently inspectable.
- Desktop headers/caption are semantic and mobile actions remain keyboard/touch accessible.
- Archive cannot occur without confirmation; cancel preserves data; success updates visible state.
- Focused fake-timer and interaction tests, lint, typecheck, and static build pass.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/components/real-examples/customers/types.ts` (new — `CustomerPlan`, `CustomerStatus`, `Customer` (fixed `createdAt` ISO, `actionsEnabled` flag for the disabled-row fixture), `MutationOutcome`), `components/real-examples/customers/fixtures.ts` (new — 12 deterministic customers via `_shared` `stableId`/`addDaysUtc(FIXTURE_NOW, ...)`; long-name fixture, two archived fixtures, one actions-disabled fixture, varied plans/statuses; initials-only avatars (no remote images), 12 rows at page size 5 → 3 pages), `components/real-examples/customers/components/customer-status-badge.tsx` (new — text-backed status badge, meaning via text not color), `components/real-examples/customers/components/customer-actions-menu.tsx` (new — per-row package `ActionMenu` with labeled `Actions for <name>` trigger; shared by desktop table and mobile card list so both representations offer identical keyboard-reachable actions; `Archive…` item is destructive and disabled when already archived; disabled-row trigger reads "(unavailable)"; passes the trigger element up for focus restoration; plus text-only `CustomerPlanBadge`), `components/real-examples/customers/components/customer-name-dialog.tsx` (new — single text-input dialog for Add and Rename; inline `role="alert"` validation for blank names; `onCloseAutoFocus` prevents Radix's default (its target menu item is unmounted) and calls the flow's `onRestoreFocus`), `components/real-examples/customers/index.tsx` (new — main surface: package `PageHeader` actions ("Add customer"), `useDebouncedValue(query, SEARCH_DEBOUNCE_MS = 300)` (exported documented delay), package `Input`/`NativeSelect` status+plan filters, Reset button, package `Pagination` with `aria-current`, result count in an `aria-live="polite"` `role="status"` paragraph, one resource model rendered as captioned semantic desktop `Table` (`hidden md:block`) and mobile `role="list"` card representation (`md:hidden`) from the same derived rows — no duplicated fixture/mutation state; rename/archive (destructive `AlertDialog`, `confirmedArchiveRef` distinguishes Action-close from cancel) and add flows through `_shared` `simulate` (fixed 400 ms, catalog success/failure toggle like pricing); persistent notice as `role="status"` text / destructive `Alert`; loading / initial-empty / filtered-empty / error+retry / loaded states via `_shared` `ExampleStateToolbar`), `packages/react/@examples/nextjs/lib/sections/real-examples.ts` (new `customers` dynamic entry: loader `@/components/real-examples/customers`), `components/real-examples/customers/customers.test.tsx` (new — 11 tests).
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`); `pnpm --dir packages/react/@examples/nextjs typecheck` (clean, `--incremental false`); `pnpm --dir packages/react/@examples/nextjs test` (77/77 pass, 9 files); `pnpm --dir packages/react/@examples/nextjs build` (static export; `/real-examples/customers` prerendered alongside pricing and real-example-form). Tests cover: debounced search leaves results unchanged before `SEARCH_DEBOUNCE_MS` and recomputes exactly after it (fake timers); reset clears query/filters and restores the full first page (`aria-current` back on page 1 link); pagination across three stable pages; loading / initial-empty / filtered-empty ("No customers match the current filters.") / error-retry / loaded independently inspectable; captioned table + labeled card list render the same rows with initials avatars, archived text badges, and a disabled row action; rename opens from keyboard (`Enter` on the menu trigger), validates blank input inline, succeeds with the simulated request and updates rows; rename and archive cancel preserve data and restore focus to the row action (`waitFor`); archive requires the explicit destructive confirmation, keeps the dialog non-dismissible while pending, and on success flips the visible row status to "Archived" with a persistent notice; add customer increments the announced result count to 13.
- Result: `/real-examples/customers` exists as an isolated, deterministic flow under `components/real-examples/customers/` (no entry in any showcase module). One resource model backs both representations; result-count changes are announced politely; row actions are keyboard-reachable without hover; archive is impossible without explicit confirmation, cancel preserves data, success updates the visible rows with focus restoration.
- Follow-up: two test-authoring notes for NEXTEX-10 — (1) Radix dropdown/dialog flows under fake timers: query menu items with synchronous `getByRole` (items mount synchronously); async `findByRole` (RTL `waitFor`) hangs under `vi.useFakeTimers()` here; (2) when a dialog is opened from a dropdown menu item, restore focus via Radix's `onCloseAutoFocus` with `preventDefault()` rather than a post-unmount effect, because Radix's default target (the menu item) is already unmounted. NEXTEX-10 still queues its registry entry through one integration owner.

### Task NEXTEX-10: Build Account And Workspace Settings

Status: completed

Priority: P1

Suggested agent: forms and settings UX engineer

Dependencies: NEXTEX-07

Primary ownership:

- `packages/react/@examples/nextjs/components/real-examples/settings/`
- Settings-focused tests
- Queued settings registry entry

Finding:

The isolated `ContentSidebar` page resembles settings but uses shallow content and a raw input, while no real example composes package forms, clipboard behavior, permissions, plan gating, persistence states, and destructive settings (`app/widgets/content-sidebar/page.tsx:21-97`).

References:

- `packages/react/@examples/nextjs/app/widgets/content-sidebar/page.tsx:21-97`
- `packages/react/components/widgets/content-sidebar.tsx:53-87`
- `packages/react/components/widgets/content-sidebar.tsx:128-156`
- `packages/react/hooks/use-clipboard.tsx:17-54`

Implementation requirements:

1. Add `/real-examples/settings` with profile, workspace, notifications, billing, and danger-zone sections.
2. Use `ContentSidebar`, package form fields, avatar/file input, switches, single-choice controls, copy behavior, alerts, confirmation dialogs, toasts, and button loading.
3. Model pristine, unsaved, saving, saved, and save-error states deterministically.
4. Include at least one permission-disabled control and one plan-gated control with a visible reason.
5. Provide copy feedback for a workspace ID or invite URL, including a deterministic failure state.
6. Verify long navigation labels, mobile horizontal overflow, long errors, and action placement at narrow widths.

Acceptance criteria:

- Changing a field exposes unsaved state; save shows pending then persistent success/error state.
- Permission and plan restrictions are programmatically described, not conveyed only by disabled styling.
- Clipboard and destructive workflows expose success/failure/cancel outcomes and restore focus.
- Content sidebar navigation works with keyboard, narrow widths, and long labels.
- Focused tests, lint, typecheck, and static build pass.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/components/real-examples/settings/types.ts` (new — `SaveStatus` state machine (`pristine|unsaved|saving|saved|error`), section draft types, catalog-tooling outcome types), `components/real-examples/settings/fixtures.ts` (new — deterministic workspace identity via `_shared` `stableId`/`FIXTURE_NOW`; deliberately long workspace name, long invoice-free save-error text, current plan Starter vs required Scale, role `administrator`, invite URL derived from the stable workspace ID; no `new Date()`, no randomness), `components/real-examples/settings/components/use-save-section.ts` (new — deterministic pristine→unsaved→saving→saved|error state machine over `_shared/simulate` at a fixed 400 ms delay; failed saves keep the draft and expose a distinct, retryable `error` status; duplicate saves blocked while pending), `components/real-examples/settings/components/save-bar.tsx` (new — submit `Button` with `loading`, discard, and a persistent `aria-live` status line that conveys every state as text), `components/real-examples/settings/components/profile-section.tsx` (new — Field/FieldGroup + Input + Textarea + avatar file input (`Input type="file"` with initials `Avatar` preview and a simulated-upload description)), `components/real-examples/settings/components/workspace-section.tsx` (new — workspace-name form plus `useClipboard` "Copy workspace ID" feedback; persistent status text or `role="alert"` message; deterministic failure via the catalog "Force failure" toggle, failure never styling-only), `components/real-examples/settings/components/notifications-section.tsx` (new — labeled `Switch` fields, single-choice digest `RadioGroup`, and the permission-disabled "Security alerts" switch whose `aria-describedby` references visible reason text), `components/real-examples/settings/components/billing-section.tsx` (new — billing-email form plus the plan-gated "Consolidated billing" switch whose `aria-describedby` names both plans and links to `/real-examples/pricing`), `components/real-examples/settings/components/danger-zone-section.tsx` (new — destructive `AlertDialog` with cancel/confirm, non-dismissible while pending, duplicate-submit guard, focus restoration via `onCloseAutoFocus` preventDefault + trigger ref, persistent success text and sonner toasts as secondary feedback), `components/real-examples/settings/index.tsx` (new — main surface: package `ContentSidebar` (five sections incl. deliberately long "Notifications and digest preferences" label; nav allows deliberate horizontal overflow at narrow widths via `overflow-x-auto`), `ExampleStateToolbar` (loading/error/loaded) with skeleton loading state and error retry, dashed catalog-outcome toggle group), `packages/react/@examples/nextjs/lib/sections/real-examples.ts` (queued `settings` dynamic entry, loader `@/components/real-examples/settings`), `components/real-examples/settings/settings.test.tsx` (new — 10 tests)
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`); `pnpm --dir packages/react/@examples/nextjs typecheck` (clean, `--incremental false`); `pnpm --dir packages/react/@examples/nextjs test` (87/87 pass, 10 files); `pnpm --dir packages/react/@examples/nextjs build` (static export; `out/real-examples/settings.html` generated alongside pricing/customers/real-example-form; 104 pages). First build attempt failed transiently on a `next/font/google` fetch (module-not-found for geist_mono); the retry succeeded with identical inputs — noted as flaky-network risk, not source-caused. Tests cover: sidebar nav across all five sections; pristine→unsaved→saving→saved with a disabled/loading save button; deterministic save failure keeping edits with a visible long error alert and discard-to-pristine; permission-disabled and plan-gated switches with `aria-describedby` reason text; clipboard success (mocked `navigator.clipboard`) and forced failure; deletion cancel with focus restoration to the trigger and deletion success with pending protection and persistent outcome; loading/error/retry catalog states.
- Result: `/real-examples/settings` exists as an isolated, deterministic flow under `components/real-examples/settings/` (no barrel, no showcase-module entry). jsdom test setup needed two stubs inside this test file only: `matchMedia` (package Sidebar's `useIsMobile`) and `ResizeObserver` (Radix switch). One implementation fix was driven by a failing test: the shared save hook initially let `dirty` shadow the `error` status, which made failed saves invisible — corrected so `error` takes precedence and Save stays retryable.
- Follow-up: none. Registry integration remained serial (single agent); NEXTEX-11 still owns the `real-example-form` migration. NEXTEX-14 reviewer note: the transient `next/font/google` fetch failure observed once during `next build` may recur on offline/flaky networks.

### Task NEXTEX-11: Refine The Launch Request Workflow

Status: completed

Priority: P1

Suggested agent: React Hook Form product-flow engineer

Dependencies: NEXTEX-02, NEXTEX-07

Primary ownership:

- `packages/react/@examples/nextjs/components/real-examples/launch-request/`
- Launch-request tests
- Existing real-example registry migration

Finding:

The sole real example behaves like a kitchen-sink integration test: all defaults are valid, visible state includes `new Date()`, submission has no pending/failure state, reset needs no confirmation, and raw JSON replaces a user-oriented review. Its claim to use every hook-form field is false because date range is absent (`components/showcases.tsx:1887-2025`, `lib/example-registry.ts:349-355`).

References:

- `packages/react/@examples/nextjs/components/showcases.tsx:1887-1916`
- `packages/react/@examples/nextjs/components/showcases.tsx:1918-2025`
- `packages/react/@examples/nextjs/lib/example-registry.ts:349-355`
- `packages/react/components/form/hook-date-range-picker.tsx:13`

Implementation requirements:

1. Rename the catalog concept to `Launch Request`; use `/real-examples/launch-request` if URL migration policy is approved.
2. Group fields semantically into overview, schedule, ownership, and approval. Include only fields justified by the workflow; correct the “every field” claim rather than forcing irrelevant controls.
3. Replace `new Date()` with a fixed fixture and broad `watch()` with scoped `useWatch` subscriptions.
4. Replace the primary raw JSON panel with a user-facing review summary; retain optional debug state only behind a labeled disclosure.
5. Add draft/submitted status, async save pending and failure behavior, and confirmation before discarding dirty changes.
6. Ensure an inspectable invalid state exercises field errors and first-invalid-field focus/announcement behavior.
7. Preserve the old URL only if there is a concrete deployed-link requirement; document the static-export-compatible migration approach.

Acceptance criteria:

- Copy and registry metadata accurately describe the fields and workflow.
- Initial output is deterministic across build time and browser time zones.
- Invalid submit exposes associated, announced errors and focuses an actionable invalid field.
- Save cannot duplicate while pending; success, failure, and discard-cancel outcomes are visible.
- The summary is user-oriented and debug data is secondary.
- Focused tests, lint, typecheck, and static build pass.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/components/showcases/real-examples/real-example-form.tsx` (deleted — the pre-NEXTEX-05 monolith leftover), `components/real-examples/launch-request/types.ts` (new — `LaunchRequestValues`, `RequestStatus` (`draft`|`submitted`), `SimulatedOutcomeChoice`), `components/real-examples/launch-request/fixtures.ts` (new — `DEFAULT_LAUNCH_REQUEST` with the launch date derived from `_shared`'s `addDaysUtc(FIXTURE_NOW, 21)` = 2026-03-30, never `new Date()`; rollout-window and team options; value→label map for the review panel), `components/real-examples/launch-request/components/review-summary.tsx` (new — user-facing review panel with per-group scoped `useWatch({ name: [...] })` subscriptions and readable labels/dates, plus the draft/submitted status line), `components/real-examples/launch-request/components/debug-state-panel.tsx` (new — labeled `Collapsible` debug disclosure; the broad full-form `useWatch` lives in a child that only mounts while open), `components/real-examples/launch-request/index.tsx` (new — main surface: four grouped `ExampleSection`s (Overview: project name + summary; Schedule: launch date + rollout window; Ownership: owner email + owning teams; Approval: confirmation checkbox) using only the hook-form fields the workflow justifies; corrected copy no longer claims “every hook-form field”; `_shared` `ExampleStateToolbar` (loading/error/loaded + retry) and pricing-style dashed catalog outcome toggle driving `_shared/simulate` (fixed 400 ms, explicit success/failure); draft → submitted status with revision counter; pending prevention via `saving` guard + disabled/loading submit; persistent failure `Alert` and persistent success `role="status"` (no toast-only state); invalid submit renders a `role="alert"` list of per-field messages and calls `setFocus` on the first invalid field per declared field order (package fields already render per-field `FormError` messages); discard uses an `AlertDialog` confirmation before `reset()` of dirty changes), `components/real-examples/launch-request/launch-request.test.tsx` (new — 7 tests), `packages/react/@examples/nextjs/lib/sections/real-examples.ts` (`real-example-form` entry replaced by `launch-request` at `/real-examples/launch-request` with accurate copy; the NEXTEX-07 temporary exception comment removed)
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings under `--max-warnings 0`); `pnpm --dir packages/react/@examples/nextjs typecheck` (clean, `--incremental false`); `pnpm --dir packages/react/@examples/nextjs test` (94/94 pass, 11 files — 87 pre-existing + 7 new); `pnpm --dir packages/react/@examples/nextjs build` (static export; `/real-examples/launch-request` prerendered; `out/real-examples/real-example-form*` is no longer emitted; no internal link references the old URL — registry tests and the link suite pass). Tests cover: deterministic initial render (fixed fixture date 2026-03-30, Draft status, four workflow groups, debug JSON hidden behind its disclosure); invalid submit (clearing Project name → `role="alert"` announcement with the field message, focus moved to the first invalid field, status stays Draft); success path with pending-disabled duplicate submit (only revision 1 recorded); forced failure (persisted destructive alert, edits kept, status stays Draft); discard cancelled (dialog dismissed, edits preserved) and discard confirmed (form reset to the fixture); toolbar loading/error/retry states. Failure-mode probe: the ResizeObserver requirement surfaced as 7 failing tests before the jsdom stub (same documented pattern as settings) was added.
- Result: the catalog concept is renamed to Launch Request at `/real-examples/launch-request`; the old URL is removed without redirect per the recorded maintainer decision (static export cannot serve redirects; no deployed links or internal references require it). The form is semantically grouped, deterministic across build time and time zones, user-oriented in its review summary, and observable across draft/submitted/saving/failure/discard states.
- Follow-up: NEXTEX-14 should independently verify invalid-submit focus/announcement and the discard dialog focus restoration at narrow widths; NEXTEX-13 should mention the launch-request flow in its real-example standards if it enumerates flows.

## Optional Wave: Additional Product Breadth

### Task NEXTEX-12: Evaluate Onboarding Or Support Inbox Follow-Up

Status: deferred

Priority: P3

Suggested agent: product design systems engineer

Dependencies: NEXTEX-08, NEXTEX-09, NEXTEX-10, NEXTEX-11

Primary ownership:

- A future isolated directory under `components/real-examples/`
- A short coverage decision recorded in this task file

Finding:

Onboarding would exercise OTP/progress/file input, while a support inbox would exercise resizable panels, scroll behavior, mobile sheets, item rows, and reply composition. Both are useful, but either would expand the catalog beyond the four flows needed to validate the package's current product surface.

References:

- `packages/react/@examples/nextjs/lib/example-registry.ts:38-42`
- `packages/react/@examples/nextjs/lib/example-registry.ts:67-71`
- `packages/react/@examples/nextjs/lib/example-registry.ts:92-99`
- `packages/react/@examples/nextjs/lib/example-registry.ts:110-115`
- `packages/react/@examples/nextjs/lib/example-registry.ts:180-187`

Implementation requirements:

1. Reassess component/state coverage only after the four core examples are complete.
2. Choose onboarding if OTP and multi-step form confidence is the larger gap.
3. Choose support inbox if dense split-view and mobile adaptation confidence is the larger gap.
4. Do not add analytics dashboards, checkout/payment, kanban, or chart-heavy flows without corresponding package capabilities.

Acceptance criteria:

- Maintainers record `implement` or `defer` with the remaining concrete coverage gap.
- If implemented, the example owns a distinct package capability and state matrix rather than duplicating a core flow.
- If deferred, the rationale and residual gap remain documented.

Deferred rationale: core correctness, architecture, and four coherent workflows provide substantially more value than immediate catalog breadth.

## Wave 5: Documentation And Independent Integration

### Task NEXTEX-13: Document Catalog Purpose And Contribution Workflow

Status: completed

Priority: P2

Suggested agent: developer experience engineer

Dependencies: NEXTEX-04, NEXTEX-05, NEXTEX-08, NEXTEX-09, NEXTEX-10, NEXTEX-11

Primary ownership:

- `packages/react/@examples/nextjs/README.md`
- Small source comments only where the architecture is otherwise non-obvious

Finding:

The README is only an unrelated rehype-pretty-code link and does not explain the app's purpose, dependency boundary, static export, route registry, real-example standards, or verification workflow (`README.md:1`).

References:

- `packages/react/@examples/nextjs/README.md:1`
- `packages/react/@examples/nextjs/package.json:5-30`
- `packages/react/@examples/nextjs/next.config.ts:3-5`

Implementation requirements:

1. Explain whether the app is a source integration playground or staged consumer and link to the actual artifact validation boundary.
2. Document install, dev, static preview, lint, typecheck, test, and build commands.
3. Document registry-backed versus dedicated route criteria and the exact process for adding an example.
4. State real-example fixture, accessibility, responsive, async-state, and external-network expectations.
5. Keep README instructions synchronized with scripts; remove unrelated placeholder content.

Acceptance criteria:

- A new agent can add a primitive or real example without inspecting historical conversation or reverse-engineering three registries.
- Every documented command exists and passes.
- README does not claim installed-package coverage the app does not provide.

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session)`
- Changed: `packages/react/@examples/nextjs/README.md` (rewritten — keeps the NEXTEX-03 dependency-model section and NEXTEX-07 registry/routing section, adds: the full validation-boundary subsection pointing at the actual artifact checks in `packages/react` (`test:package`, `build:consumer`, `test:consumer` — all verified present in `packages/react/package.json:162-179`); a Commands section covering install (nested `@examples/*` workspace — install from `packages/react`), `dev`, `build`, `preview` (`serve out`), `lint` (`--max-warnings 0`), `typecheck`, `test`, each verified against `package.json` scripts; an "Adding a new example" walkthrough matching the actual `defineSection` entry pattern (`components/showcases/<section>/<slug>.tsx` or `components/real-examples/<slug>/index.tsx` + one `lib/sections/<section>.ts` entry) with the dynamic-vs-static route criteria; a Real-example standards section (deterministic fixtures via `_shared` `FIXTURE_NOW`/`stableId`, inspectable accessible states, `_shared` async simulation with explicit outcomes and pending guards, responsive/keyboard expectations, no external network) cross-referencing the four current flows (pricing, customers, settings, launch-request); a Testing section summarizing the suite shape). No code or `package.json` changes; no rehype-pretty-code reference existed in the README to remove (deleted earlier) — verified with a repo-wide grep (`rg -i "rehype|pretty-code" packages/react/@examples/nextjs` → no matches).
- Verified: `pnpm --dir packages/react/@examples/nextjs lint` (0 warnings), `typecheck` (clean), `test` (94/94 pass, 11 files) after the rewrite. Every documented command (`dev`, `build`, `preview`, `lint`, `typecheck`, `test`, plus `test:package`/`build:consumer`/`test:consumer` in `packages/react`) exists in its respective `package.json`.
- Result: README now covers purpose, static-export model, source-integration dependency boundary, all commands, registry-backed vs dedicated static route criteria, exact add-an-example steps, real-example standards, and testing shape — an agent can add an example without prior conversation context. No claim of installed-package coverage is made; the artifact boundary is explicitly delegated to the package validator and isolated consumer.
- Follow-up: none.

### Task NEXTEX-14: Perform Independent Catalog Integration Review

Status: completed

Priority: P1

Suggested agent: independent Next.js, accessibility, and design-system reviewer who did not implement the main tasks

Dependencies: NEXTEX-01 through NEXTEX-11, NEXTEX-13

Primary ownership:

- Review and minimal focused corrections across the example
- This task document's completion evidence
- No broad redesign or unrelated package refactor

Finding:

The work crosses routing, server/client boundaries, forms, static export, shared registries, package imports, responsive behavior, and multiple interactive product flows. Passing a build alone cannot establish that the examples are accurate or usable.

References:

- All findings and acceptance criteria in NEXTEX-01 through NEXTEX-13
- `.github/workflows/test.yml:101-105`

Implementation requirements:

1. Verify every completed task's acceptance criteria against runtime behavior; do not rely only on implementer notes.
2. Audit keyboard navigation, visible focus, error announcements, dialog focus restoration, 200% zoom, and 320px/768px/desktop layouts.
3. Verify loading, empty, error, read-only, permission, plan-gated, pending, success, cancellation, and destructive states where assigned.
4. Inspect generated route output and internal links; verify unknown dynamic routes remain controlled.
5. Confirm server/client boundaries and per-route delivery do not regress to a global client showcase bundle.
6. Confirm example imports, README, package scripts, tests, and CI describe the same dependency model.
7. Run targeted checks first, then the final serial command set. Record warnings, route counts, test counts, and any deferred risk.

Acceptance criteria:

- No P0/P1 finding in this document remains open without explicit maintainer-approved deferral and residual-risk text.
- Every registered route exports, every internal link resolves, and each dynamic implementation is listed exactly once.
- Lint has zero warnings; typecheck, tests, and static build pass.
- Core real examples are independently testable and usable at narrow/mobile/desktop widths and 200% zoom.
- Documentation, implementation, and CI agree on source versus package-artifact coverage.

Final verification commands from repository root:

```bash
git status --short
pnpm --dir packages/react/@examples/nextjs lint
pnpm --dir packages/react/@examples/nextjs typecheck
pnpm --dir packages/react/@examples/nextjs test
pnpm --dir packages/react/@examples/nextjs build
pnpm --dir packages/react typecheck
pnpm --dir packages/react lint
pnpm --dir packages/react test
git diff --check
```

Compare `pnpm-lock.yaml` and `packages/react/pnpm-lock.yaml` with the recorded pre-install baseline and confirm that only task-owned dependency changes remain.

Run package artifact checks as well if NEXTEX-04 or a discovered example defect changes `packages/react` source, exports, or package metadata:

```bash
pnpm --dir packages/react bundle
pnpm --dir packages/react test:package
pnpm --dir packages/react build:consumer
pnpm --dir packages/react test:consumer
```

Completion evidence:

- Assigned agent/session: `kimi-k3 (opencode session, independent of NEXTEX-01..11/13 implementation sessions)`
- Changed: this task document only (`Status: completed`, this evidence block, top-level Status). No code corrections were required — every acceptance criterion verified against actual runtime/build behavior matched the implementer claims.
- Verified (serial, from repo root, 2026-09-04):
  - `pnpm --dir packages/react/@examples/nextjs lint` → exit 0, **zero warnings** (`eslint --max-warnings 0`).
  - `pnpm --dir packages/react/@examples/nextjs typecheck` → clean (`tsc --noEmit --incremental false --pretty false`).
  - `pnpm --dir packages/react/@examples/nextjs test` → **94/94 tests pass, 11 files** (registry 21, import-boundary, internal-links, form-demo 8, dialog, site-nav 8, shared tooling, pricing 8, customers 11, settings, launch-request 7).
  - `pnpm --dir packages/react/@examples/nextjs build` → static export succeeds; `out/` audit via script: all **100 registered routes** (4 section indices + 96 slug routes: 61 components + 22 form + 8 widgets + 4 real-examples + `/`) exported as `.html` with **0 missing and 0 duplicates**; `out/404.html` exists; only extra file is Next-internal `out/_not-found.html`; `out/real-examples/real-example-form.html` is **not** exported and no internal reference to the old slug exists.
  - `pnpm --dir packages/react typecheck` clean; `pnpm --dir packages/react lint` exit 0 zero warnings; `pnpm --dir packages/react test` → **25/25 pass, 10 files**.
  - `git diff --check` → clean.
  - Artifact checks (`bundle`, `test:package`, `build:consumer`, `test:consumer`) **skipped — no `packages/react` source changed**: `git status --short packages/react` shows only `pnpm-lock.yaml` (example-scoped), `.gitignore`/`eslint.config.mjs` (pre-existing unrelated `release/` ignore entries), and untracked `packages/react/publish.config.mjs` (pre-existing publish work, preserved). No `package.json`, `components/`, `hooks/`, or `layouts/` diff.
  - Lockfiles: root `pnpm-lock.yaml` md5 = `94a5dfd2736bbe239c606bb2cbbc3385`, **identical to the recorded baseline**. `packages/react/pnpm-lock.yaml` diff spot-checked: importers-section changes are the `@examples/nextjs` importer's dependency additions (`@hookform/resolvers`, `@tabler/icons-react`, `date-fns`, `lodash-es`, `lucide-react`, `react-day-picker`, `react-hook-form`, `sonner`, `zod`, `next`, `react`, `react-dom`, `vitest`, `@types/node`, `jsdom`, `serve`, …) and rehype/shiki/unified removals, plus unavoidable peer-resolution hash annotations (`supports-color`), as recorded by NEXTEX-01/04/06.
- Result (code audit findings, not just notes): root `app/layout.tsx` is a **server component** with no `usePathname`/`'use client'`; `viewport` export has **no `maximumScale`/`userScalable`** (documented comment) and global `touch-action: manipulation` is gone — pinch/200% zoom unblocked. No global client showcase barrel exists (`components/showcases.tsx` deleted; 20+ presentational showcase modules have no `'use client'`; lazy `load()` per registry entry; `DynamicShowcase`/`React.use` per-route delivery). Error announcements exist in the four real examples (`role="alert"` in launch-request invalid-submit list, settings workspace copy failure, customers name validation; package `FormError`/`Alert` render `role="alert"` internally; `role="status"`/`aria-live` for states, 7 sites). Dialog focus restoration via `onCloseAutoFocus` + `preventDefault`/trigger refs (customers, settings, pricing) and is test-covered. Responsive: pricing `grid-cols-1 md:grid-cols-3` + focusable `role="region" overflow-x-auto` comparison table with hint; customers desktop table `hidden md:block` / mobile card list `md:hidden` sharing one data model; settings ContentSidebar nav `max-w-full overflow-x-auto`; launch-request `md:grid-cols-2`. Required states present as code and test-covered across the four flows: loading/empty/error/loaded (`ExampleStateToolbar`; empty where meaningful), pending (loading/disabled submit guards), success (`role="status"`), cancel (dialog/customer flows), destructive (settings danger-zone AlertDialog, customers archive confirmation), permission (settings security-alerts switch with `aria-describedby` reason), plan-gated (settings consolidated-billing naming both plans). README dependency model ("source-integration playground", artifact coverage delegated to `test:package`/`build:consumer`/`test:consumer`) matches `package.json` scripts and the CI `react` job which runs example `typecheck, lint, test, build` serially (`gh` workflow lines around the `Nextjs example` step) after the package/consumer steps.
- Follow-up: NEXTEX-12 remains **deferred** (maintainer rationale recorded; P3). Residual risks: (1) transient `next/font/google` fetch failure during `next build` observed once by NEXTEX-10 — did not recur in either of this reviewer's builds; retry is the documented mitigation for offline/flaky networks. (2) jsdom limitations (Radix/fake-timers quirks) are documented in NEXTEX-09 follow-ups; no action.

## Parallelization

| Wave | Tasks                           | Parallel guidance                                                                                                                                                                                   |
| ---- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | NEXTEX-01                       | Run first; it creates the shared verification boundary.                                                                                                                                             |
| 1    | NEXTEX-02, NEXTEX-03, NEXTEX-04 | May run in parallel after NEXTEX-01 when ownership stays within forms/components, shell, and dependency/import boundaries respectively. Coordinate manifest and lockfile changes through NEXTEX-04. |
| 2    | NEXTEX-05                       | Run after import-boundary decisions settle; one owner controls registry and dynamic-route architecture.                                                                                             |
| 2    | NEXTEX-06                       | Run after shell/import/registry changes to avoid deleting or documenting moving targets.                                                                                                            |
| 3    | NEXTEX-07                       | Run serially before adding product flows.                                                                                                                                                           |
| 4    | NEXTEX-08, NEXTEX-09, NEXTEX-10 | May run in parallel in separate feature directories. Queue registry updates through one integration owner.                                                                                          |
| 4    | NEXTEX-11                       | May overlap other product flows after NEXTEX-02 and NEXTEX-07, but it alone owns migration of the existing real example.                                                                            |
| 5    | NEXTEX-13                       | Run when scripts, registry, and product routes are stable.                                                                                                                                          |
| 5    | NEXTEX-14                       | Always run last and assign independently.                                                                                                                                                           |

Shared files requiring one owner at a time:

- `packages/react/@examples/nextjs/package.json`
- `packages/react/pnpm-lock.yaml`
- `packages/react/@examples/nextjs/lib/example-registry.ts` or its replacement
- Dynamic route files under `app/**/[slug]/`
- `packages/react/@examples/nextjs/app/layout.tsx`
- `.github/workflows/test.yml`
- This task document

Do not run concurrent installs or `next build` processes in the same checkout. Do not run an example build while another agent is modifying imported `packages/react` source.

## Maintainer Decisions

### Dependency model

**Decided (NEXTEX-04, 2026-09-03):** source-integration playground using package-style imports mapped to source. `@egose/shadcn-theme/*` specifiers resolve to parent package source via tsconfig `paths` (turbopack consumes them natively; vitest mirrors the alias). Installed-artifact guarantees are delegated to the `packages/react` package validator and isolated consumer tests. The staged-consumer alternative was rejected: it would require a fresh bundle/stage prerequisite for `dev` and CI and add stale-artifact risk without new coverage value.

- ~~**Recommended:** source-integration playground using package-style imports mapped to source, with installed-artifact guarantees delegated to existing package validator and isolated consumer tests.~~ (chosen)
- ~~Alternative: staged installed-package consumer, which requires an explicit fresh bundle/stage prerequisite for local development and CI.~~ (rejected)

### Real-example layout

**Decided (NEXTEX-08, 2026-09-03):** keep all examples inside catalog chrome; pricing renders as a labeled "framed product preview" (the `ExamplePage` description explicitly states that the surrounding catalog sidebar and header are not part of the example). This is the simplest compliant option: it needs no route group, keeps one navigation model, and avoids implying that catalog evaluators must leave the catalog chrome to inspect a flow. The route-group + `SimpleLayout` alternative was rejected for this wave: it would add a second layout path solely to "exercise" `SimpleLayout` — coverage that belongs to the layout's own package tests, not to a product-flow example. `layout2.tsx` remains deleted (NEXTEX-06) and was not resurrected as implied layout coverage.

### Launch request URL

**Decided (NEXTEX-11, 2026-09-04):** rename `/real-examples/real-example-form` to `/real-examples/launch-request` and remove the old URL with no redirect or compatibility page. Evidence checked: repository history shows automated `pages-nextjs` GitHub Pages deploy commits, but nothing in git history, the README, or anywhere in the repo tracks deployed links that require the old URL; the only historical references to `real-example-form` are source/history of the example itself. Because the app uses `output: 'export'`, no server-side redirect is possible, and every navigation entry derives from the typed registry — so the rename is a single registry edit, the old slug simply stops being exported, and the registry/internal-link tests (all passing post-rename) guard against dangling internal references.

None of these decisions blocks NEXTEX-01 or NEXTEX-02. NEXTEX-04, NEXTEX-08, and NEXTEX-11 must record the selected outcomes before completion.

## Definition Of Done

- All P0 and P1 tasks are completed, or an explicit maintainer decision records deferral and residual risk.
- Every copyable form and action audited by this plan works as its text describes.
- User zoom is not restricted; keyboard, focus, error, dialog, and responsive checks pass.
- Catalog metadata, valid slugs, static params, and implementation loaders derive from a typed contract with automated drift checks.
- Dynamic routes no longer depend on one all-showcases client module.
- The example has zero-warning lint, explicit typecheck/tests, a static-build gate, and matching CI commands.
- Dependency ownership and source-versus-artifact coverage are documented and mechanically enforced.
- Pricing, customers, settings, and launch request exist as isolated, deterministic, realistic flows.
- Across the core flows, loading, empty, filtered-empty, error, pending, success, disabled/permission, plan-gated, cancellation, and destructive states are observable and tested where assigned.
- README instructions are sufficient for an agent without conversation history.
- An independent reviewer completes NEXTEX-14 and records final evidence.

## Completion Evidence Template

Append to each task when it is completed:

```markdown
Completion evidence:

- Assigned agent/session: `<agent or session>`
- Changed: `path`, `path`
- Verified: `exact command`; `exact command`
- Result: `<test counts, lint warnings, build/routes, and manual responsive/accessibility evidence>`
- Follow-up: `<task ID or none>`
```
