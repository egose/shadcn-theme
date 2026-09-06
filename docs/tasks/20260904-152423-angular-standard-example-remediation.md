# Angular Standard Example Remediation

Created: 2026-09-04 15:24:23 PDT

Status: completed

## Objective

Turn `packages/angular/@examples/standard` into a compiling, accessible, maintainable consumer example that teaches correct use of `@egose/shadcn-theme-ng`, keeps catalog metadata from drifting, and demonstrates a focused set of realistic application flows in addition to isolated primitives.

The target real-example set is:

- Pricing and plan selection
- Customer or team-member management
- Account and workspace settings
- Support inbox and ticket handling

A multi-step checkout/billing flow is a P2 follow-up after pricing establishes the shared plan and billing fixtures. Authentication and analytics dashboards are deferred unless maintainers prefer them over one of the four target flows.

## Scope

- `packages/angular/@examples/standard/`
- `.github/workflows/test.yml` and `.github/workflows/deploy-angular.yml` for example checks and deployment behavior
- Focused changes to `packages/angular/projects/layout-simple/` only where the example exposes a confirmed public layout accessibility or responsive defect
- Focused package test/public API changes required by those `layout-simple` fixes
- Package artifact-consumer validation only where needed to prove that examples match the installed public surface

## Working Rules And Non-Goals

- Preserve unrelated worktree changes. The review-time worktree was clean, but agents must inspect `git status --short` before editing and must not reset concurrent changes.
- Keep application controls on package components. Do not add another component library or copy package components into the example.
- Keep examples deterministic and local. Use fixed ISO dates, stable IDs, and explicit simulated outcomes; do not require APIs, authentication providers, payment services, or remote image hosts.
- Keep examples educational. Extract repeated page framing and domain-neutral test tooling, but leave important package composition and inputs visible at each example call site.
- Keep package-source integration and installed-artifact validation distinct. Do not claim that TypeScript path aliases validate `dist` or npm exports.
- Add behavior tests before or with confirmed correctness fixes. Prefer accessible-role, form-state, routing, and observable-result assertions over broad snapshots.
- Use Angular standalone components, signals where local reactive state benefits from them, typed reactive forms, and the existing zoneless application configuration.
- Do not create generic abstractions for one call site. Shared UI or state helpers require at least two consumers; otherwise keep them colocated with the owning example.
- Do not put realistic product pages under `pages/components/`. Use a separate `pages/examples/<slug>/` boundary and a distinct catalog/navigation section.
- Do not commit `dist/`, `.angular/`, coverage output, or other generated files.
- Serialize dependency installation, lockfile changes, package builds, example builds, and artifact-consumer checks in a shared checkout.
- A component-example defect does not automatically justify a package API redesign. Record package changes explicitly and keep them at the smallest public enforcement point.

## Review Summary

Confirmed findings:

- The production build currently fails. `button.ts` binds `null` where `HlmButton.icon` accepts `TemplateRef<unknown> | undefined`, and `input-otp.ts` uses `maxLength="6"` without Spartan's required `length` input (`pages/components/button/button.ts:89`, `pages/components/input-otp/input-otp.ts:12`).
- The only app spec replaces the real routes with a synthetic `/gallery` route and checks only shell existence. It does not resolve the 69 lazy components, test unknown routes, or exercise user behavior (`src/app/app.spec.ts:8-45`).
- Route metadata and menu metadata are duplicated across a 315-line route table and `COMPONENT_GROUPS`. They currently align at 69 demos, but the comment says 70, `Badgeage` is misspelled, and the example aliases omit the package's public `menu` project (`src/app/app.routes.ts:4-315`, `src/app/app.ts:16-118`, `tsconfig.json:19-91`).
- There is no wildcard route. Unknown root or component URLs leave an empty shell instead of a useful not-found state (`src/app/app.routes.ts:311-315`).
- The example wraps `eg-layout-simple` in `<main>`, while the layout emits its own `<main>`, producing nested primary landmarks (`src/app/app.html:1-35`, `projects/layout-simple/src/lib/layout.html:201-209`).
- The enabled sidebar and mobile-menu icon buttons have no accessible names or expanded/control state (`projects/layout-simple/src/lib/layout.html:16-25`, `projects/layout-simple/src/lib/layout.html:107-120`).
- Layout visibility combines Tailwind `md` classes with CDK `Breakpoints.Handset`, and the complete category/component navigation remains rendered at narrow widths. This can expose a trigger while suppressing its menu in intermediate viewport ranges (`projects/layout-simple/src/lib/layout.ts:29`, `projects/layout-simple/src/lib/layout.ts:112-123`, `projects/layout-simple/src/lib/layout.ts:163-169`, `projects/layout-simple/src/lib/layout.html:106-199`).
- The app reaches through package DOM with `eg-layout-simple main > div` selectors instead of using a stable public class/input contract (`src/styles.css:175-182`).
- `FormFieldPage.onReset()` resets even when confirmation is false. Its preview dialog's Cancel returns `true`, Save does not close, Undo only logs, loading is set true and false synchronously, `Record<string, any>` weakens the dialog contract, and age UI says max 100 in one place and 120 in another (`pages/components/form-field/form-field.ts:62-88`, `pages/components/form-field/form-field.ts:162-181`, `pages/components/form-field/form-field.ts:326-395`).
- Dialog and sheet examples display save actions without actual editable forms or observable outcomes; the sheet submit button has no form (`pages/components/dialog/dialog.ts:33-48`, `pages/components/sheet/sheet.ts:14-29`).
- Several copyable examples teach weak semantics: a button-styled anchor has no destination, navigation links use `href="#"`, and representative search inputs/icon buttons lack labels (`pages/components/button/button.ts:64-66`, `pages/components/navigation-menu/navigation-menu.ts:9-20`, `pages/components/input/input.ts:53-60`, `pages/components/sidebar/sidebar.ts:57-65`, `pages/components/sidebar/sidebar.ts:137`).
- Routed demo titles generally start at `h3` below a persistent `h1`, skipping `h2`; subsection headings then continue at `h4` (`pages/components/components.ts:15-17`, `pages/components/button/button.ts:13-31`, `pages/components/input/input.ts:11`).
- Some pages are polished application-like compositions while many remain fixed-width, one-state snippets. There is no shared demo page/section framing, state convention, or realistic application catalog (`pages/components/table/table.ts:19-105`, `pages/components/form-text-input/form-text-input.ts:8-18`).
- The visual public `menu` package has no catalog page. `utils` is also absent, though it is better documented through a usage note/test than forced into a visual component route (`projects/menu/src/public-api.ts:5-70`, `projects/utils/src/public-api.ts:1-6`).
- The example imports Angular, Spartan, icons, Sonner, and package subpaths directly, but its manifest declares only build/PostCSS tooling. It currently relies on the parent Angular workspace's installed dependency graph (`@examples/standard/package.json:13-19`, representative imports in `src/app/app.ts:1-14`).
- TypeScript aliases point package imports directly at `projects/*/src/public-api.ts`, and Tailwind scans package source. This is useful source integration but does not validate built exports or either published variant (`tsconfig.json:19-91`, `src/styles.css:1-4`).
- Pull-request CI validates the Angular libraries and tarball consumers but does not build or test this example. Deployment builds it only after a push to `main` (`.github/workflows/test.yml:109-165`, `.github/workflows/deploy-angular.yml:30-40`).
- GitHub Pages deployment uploads the browser output with a root base URL but has no route fallback or prerendered route set, so direct navigation to `/components/...` is not demonstrably supported (`src/index.html:6`, `.github/workflows/deploy-angular.yml:30-40`).
- The README is generated boilerplate for Angular CLI 20 while the example uses CLI 22. It documents bare `ng` commands and an unavailable `ng e2e` target rather than repository-local scripts and integration boundaries (`README.md:1-55`, `package.json:4-18`, `angular.json:12-77`).

Positive baseline:

- All 69 current component routes use lazy `loadComponent` imports.
- The route, menu, and component-directory inventories currently agree despite being manually duplicated.
- The app uses standalone components, zoneless change detection, strict TypeScript/template settings, and production bundle budgets (`src/app/app.config.ts:1-8`, `tsconfig.json:5-18`, `angular.json:27-40`).
- Package imports use public subpath names and terminate at each library's `public-api.ts`; the example does not import private `src/lib` files.
- Search results are deterministic and bounded to eight entries (`src/app/app.ts:193-217`).
- Several richer pages already provide useful patterns and deterministic fixtures, including table, card, empty, skeleton, input-group, and the main form page.

## Baseline Verification

Run from the repository root before assigning implementation work:

```bash
git status --short
pnpm --dir packages/angular/@examples/standard build
pnpm --dir packages/angular/@examples/standard test:ci
```

Run package-level checks when a task changes `packages/angular/projects/*`, package metadata, or artifact behavior:

```bash
pnpm --dir packages/angular test:libraries
pnpm --dir packages/angular test:dependency-contract
pnpm --dir packages/angular test:public-api
pnpm --dir packages/angular test:variants
pnpm --dir packages/angular prepare:release --version 0.0.0-task
pnpm --dir packages/angular verify:consumers --release-dir release
```

Review-time evidence:

- `pnpm --dir packages/angular/@examples/standard build` failed with TS2322 at `button.ts:89` and NG8008 at `input-otp.ts:12`.
- `pnpm --dir packages/angular/@examples/standard test:ci` compiled the test bundle, then failed because this environment has no Chrome binary and `CHROME_BIN` is unset. This is an environment blocker, not evidence that the two existing tests pass or fail.
- `git status --short` was clean before review-time verification. The failed build/test commands produced only ignored generated output.
- There is no example lint, dedicated typecheck, registry-contract, accessibility, or end-to-end script today.

## Priority Definitions

- **P0:** the example does not build, teaches observably incorrect behavior, or violates a core accessibility/navigation contract.
- **P1:** architectural drift, absent regression coverage, fragile dependency/deployment boundaries, or missing core product-flow coverage.
- **P2:** consistency, readability, documentation, secondary product-state coverage, or optional breadth.
- **P3:** expansion beyond the focused real-example set after the core catalog is healthy.

## Wave 1: Restore Trust

### Task ANGEX-01: Restore The Production Build And Add Example Gates

Status: completed

Priority: P0

Suggested agent: Angular build and test infrastructure engineer

Dependencies: none

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/components/button/button.ts`
- `packages/angular/@examples/standard/src/app/pages/components/input-otp/input-otp.ts`
- `packages/angular/@examples/standard/package.json`
- Example-local test configuration and smoke tests
- `.github/workflows/test.yml`

Finding:

The production build fails on two strict template/API contract errors, while pull-request CI never runs the example. The existing Karma test compiles but cannot launch in the review environment because Chrome is unavailable.

References:

- `packages/angular/@examples/standard/src/app/pages/components/button/button.ts:77-95`
- `packages/angular/@examples/standard/src/app/pages/components/input-otp/input-otp.ts:8-24`
- `packages/angular/@examples/standard/src/app/app.spec.ts:13-45`
- `packages/angular/@examples/standard/package.json:4-18`
- `.github/workflows/test.yml:109-165`

Implementation requirements:

1. Fix the two current compile errors using the package/Spartan APIs rather than weakening strict template checks.
2. Add a test that imports the real route registry and resolves every lazy component so API drift cannot hide in an unvisited route.
3. Add a route/menu contract test foundation suitable for ANGEX-04; do not duplicate a third hard-coded list of slugs.
4. Add the example production build and headless tests to the Angular pull-request job. Keep package release builds and example build/test execution serial.
5. Make the headless browser prerequisite explicit in local/CI docs. If changing runners, use a repository-supported browser setup rather than silently skipping tests.
6. Add a dedicated `typecheck` script only if it provides coverage beyond `ng build`; do not add a misleading alias that skips Angular template checking.

Acceptance criteria:

- `pnpm --dir packages/angular/@examples/standard build` succeeds with strict Angular template checking.
- Removing a loader export or reintroducing either reviewed API mismatch causes an automated check to fail.
- `pnpm --dir packages/angular/@examples/standard test:ci` runs in CI with a provisioned browser and is not allowed to pass with zero specs.
- The Angular pull-request job executes example tests and the production build before package publication checks complete.

#### Completion evidence (2026-09-04)

Changed files:

- `packages/angular/@examples/standard/src/app/pages/components/button/button.ts`: `[icon]="section.icon ? iconTemplate : null"` → `... : undefined`, matching `HlmButton.icon: TemplateRef<unknown> | undefined`. No strict-template settings changed.
- `packages/angular/@examples/standard/src/app/pages/components/input-otp/input-otp.ts`: replaced removed `maxLength="6"` with Spartan's required `[length]="6"` input (verified `length` is `required: true` in `@spartan-ng/brain` 1.3.2 `types/spartan-ng-brain-input-otp.d.ts`).
- `packages/angular/@examples/standard/src/app/app.ts`: exported `COMPONENT_GROUPS` so tests assert against the real menu model instead of a third slug list; fixed stale "All 70" comment wording to "All component demos".
- `packages/angular/@examples/standard/src/app/app.routes.spec.ts` (new): imports the real `routes` registry and resolves every lazy `loadComponent` in a headless spec (removed/renamed export resolves to `undefined` → failure), plus route/menu contract suites (no duplicate child paths, no duplicate menu links, every menu link maps to a child route, every child route is in the menu) — all derived from `routes` + `COMPONENT_GROUPS`, no hard-coded slug list. This is the ANGEX-04 foundation.
- `packages/angular/@examples/standard/package.json`: `test:ci` → `node scripts/test-ci.mjs`; added `install:browser` (`puppeteer browsers install chrome-headless-shell`); devDependencies `puppeteer@25.10.0`, `@puppeteer/browsers@3.2.2`.
- `packages/angular/@examples/standard/scripts/test-ci.mjs` (new): spawns `ng test --watch=false`, propagates its exit code, parses the Karma "Executed N of M" summary, and exits non-zero when zero specs executed (guard against an empty/mis-globbed suite passing).
- `packages/angular/@examples/standard/karma.conf.js` (new): jasmine + karma-chrome-launcher, `failOnEmptyTestSuite: true`, `ChromeHeadlessNoSandbox` launcher, and sync `CHROME_BIN` wiring via `@puppeteer/browsers` `computeExecutablePath` against the repo-local cache (puppeteer v25 `executablePath()` is async, so it cannot be used directly in the Karma config). Honors a pre-set `CHROME_BIN` (e.g., system Chrome on a developer machine).
- `packages/angular/@examples/standard/.puppeteerrc.cjs` (new): pins the puppeteer cache to repo-local `.puppeteer-cache/`; added to `.gitignore`.
- `packages/angular/@examples/standard/angular.json`: `test` target now uses `karmaConfig: karma.conf.js`.
- `packages/angular/@examples/standard/README.md`: new "Headless testing (local and CI)" section documenting the `pnpm install:browser` prerequisite and the `CHROME_BIN` override path.
- `packages/angular/pnpm-workspace.yaml`: `allowBuilds: puppeteer: false` (postinstall Chrome download intentionally disabled; the repo-local browser comes from `pnpm install:browser`). Also removed pnpm's auto-appended placeholder line.
- `packages/angular/pnpm-lock.yaml`: updated by the two `pnpm add` calls above (serialized; no other importers touched).
- `.github/workflows/test.yml`: in the `angular` pull-request job, added `Install repo-local headless browser...` then `Build and test Angular standard example (serial, before release checks)` (`pnpm build` then `pnpm test:ci`), placed immediately before `Build, validate, and pack Angular variants serially` so example gates complete before release/consumer packaging.

Commands run and results:

- Baseline `pnpm --dir packages/angular/@examples/standard build` → FAILED with the two reviewed errors (TS2322 at `button.ts:89`, NG8008 at `input-otp.ts:12`), confirming review evidence on `master` before edits.
- After the two API fixes: `pnpm --dir packages/angular/@examples/standard build` → SUCCESS (production, strict templates, budgets intact).
- `pnpm --dir packages/angular/@examples/standard install:browser` → installed `chrome-headless-shell@152.0.7977.75` into `packages/angular/@examples/standard/.puppeteer-cache/` (repo-local; no writes outside the repo).
- `pnpm --dir packages/angular/@examples/standard test:ci` → headless Chrome launched via resolved `CHROME_BIN`; `Executed 8 of 8 SUCCESS`; wrapper printed `test:ci: 8 specs executed.` (2 pre-existing app specs + 6 new route/contract specs). Zero-spec guard logic unit-checked with a synthetic `Executed 0 of 0` output → exits 1.
- Final serial verification: build (success) then test:ci (8/8 success), with `git status --short` showing only the intended files; no `CHANGELOG.md` edits; no commits.

Notes:

- Deliberate regression coverage: reintroducing either API mismatch fails `ng build` (verified pre-fix); removing a lazy export fails `app.routes.spec.ts` because `loadComponent` resolves to `undefined`.
- No `typecheck` script was added (implementation requirement 6): `ng build` (AOT, `strictTemplates`) already type-checks app templates via `tsconfig.app.json`, and `ng test` type-checks specs via `tsconfig.spec.json`; an extra script would add no coverage beyond these gates.
- Karma config keeps `--no-sandbox` inside a `ChromeHeadlessNoSandbox` custom launcher so root-container CI runners (ubuntu-22.04 images) work without extra flags.

### Task ANGEX-02: Repair Shell Landmarks, Controls, And Responsive Navigation

Status: completed

Priority: P0

Suggested agent: Angular accessibility and responsive-layout engineer

Dependencies: ANGEX-01

Primary ownership:

- `packages/angular/@examples/standard/src/app/app.html`
- `packages/angular/@examples/standard/src/app/app.ts`
- `packages/angular/projects/layout-simple/src/lib/layout.ts`
- `packages/angular/projects/layout-simple/src/lib/layout.html`
- Focused layout-simple and example shell tests

Finding:

The rendered application contains nested `<main>` landmarks. Enabled icon-only menu controls have no accessible names or expanded/control state, and CSS `md` visibility is not aligned with CDK `Breakpoints.Handset`. The shell also renders the full 69-link top navigation at narrow widths.

References:

- `packages/angular/@examples/standard/src/app/app.html:1-35`
- `packages/angular/projects/layout-simple/src/lib/layout.ts:29`
- `packages/angular/projects/layout-simple/src/lib/layout.ts:112-123`
- `packages/angular/projects/layout-simple/src/lib/layout.ts:163-169`
- `packages/angular/projects/layout-simple/src/lib/layout.html:16-25`
- `packages/angular/projects/layout-simple/src/lib/layout.html:106-209`

Implementation requirements:

1. Retain exactly one primary `<main>` and preserve meaningful header, navigation, content, and footer landmarks.
2. Give each icon-only shell control a consumer-overridable accessible name with a sensible package default.
3. Expose accurate `aria-expanded` and `aria-controls` state for sidebar and mobile-menu triggers.
4. Choose one viewport contract and make CSS visibility and runtime menu rendering agree at boundary widths.
5. Hide or replace the full desktop category/component rows on small screens. Do not render actionless category items as duplicate interactive buttons.
6. Preserve public layout behavior for existing consumers and add package-level regression tests for any changed input or template contract.

Acceptance criteria:

- Automated tests find one primary main landmark and distinct accessible names for all visible menu triggers.
- Trigger expanded state follows opening, closing, Escape, and selection behavior.
- Tests at phone, intermediate portrait/tablet, and desktop widths never expose a non-functional trigger or duplicate full navigation.
- `pnpm --dir packages/angular test:libraries`, `test:public-api`, example tests, and example build pass.

#### Completion evidence (2026-09-04)

Changed files:

- `packages/angular/projects/layout-simple/src/lib/layout.ts`: exported `EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT = '(max-width: 767.98px)'` as the single viewport contract, now used by the `BreakpointObserver` subscription instead of `Breakpoints.Handset` (which combined 599/959px portrait ranges and disagreed with the Tailwind `md` = 768px CSS boundary). Added consumer-overridable `sidebarToggleLabel` (default `'Open navigation sidebar'`) and `mobileMenuLabel` (default `'Open navigation menu'`) inputs; all other inputs and public behavior unchanged (additive only). `mobileMenuOpen` became a signal; added `closeMobileMenu()`; desktop top/top-secondary nav row classes gained `tw:hidden tw:md:flex` so desktop navigation rows are hidden below the same 768px boundary as the mobile trigger's `tw:md:hidden`; an effect closes an open mobile menu when the viewport crosses into desktop; a second effect syncs `sidebarOpen` from the BrnSheet's `state`/`stateChanged`/`closed` outputs (Escape/backdrop closes complete the dialog without a `'closed'` state emission, so the `closed` output is subscribed too).
- `packages/angular/projects/layout-simple/src/lib/layout.html`: sidebar trigger now has `aria-label` (from input), `aria-expanded` (live from `sidebarOpen`), and `aria-controls="eg-layout-simple-sidebar"`; mobile trigger has `aria-label`, `aria-expanded` (from `mobileMenuOpen()`), and `aria-controls="eg-layout-simple-mobile-menu"`; the mobile menu region carries `id="eg-layout-simple-mobile-menu"` and `(keydown.escape)="closeMobileMenu()"`, and every mobile group `(itemClick)` now calls `closeMobileMenu()` (selection always closes, never accidentally re-opens); the projected-content wrapper inside `<main>` gained the stable public class `eg-layout-simple-main-content`.
- `packages/angular/projects/layout-simple/src/lib/sidebar.ts`: `<hlm-sheet id="eg-layout-simple-sidebar">` so the trigger's `aria-controls` resolves to the dialog pane (BrnDialog's `id` input drives the CDK overlay id).
- `packages/angular/projects/layout-simple/src/lib/layout.spec.ts`: expanded from 1 to 12 specs — one `<main>` landmark (plus header/footer), default and consumer-overridden trigger names, the observed breakpoint query equals `EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT` (767.98px = one boundary with `tw:md:*`), desktop nav rows carry `tw:hidden tw:md:flex`, mobile trigger `aria-expanded` follows open/close/Escape/item-selection, open menus close when crossing to desktop widths and do not reappear when re-entering mobile, and the sidebar trigger's `aria-expanded` follows sheet open and Escape close (synthetic Escape given `keyCode: 27` and dispatched on `document.body` to match the CDK keyboard dispatcher).
- `packages/angular/@examples/standard/src/app/app.html`: removed the wrapper `<main>` so the layout's `<main>` is the single primary landmark; removed the `[topMenus]` binding (those actionless category labels duplicated `topSecondaryMenus` and rendered as interactive buttons in the mobile menu).
- `packages/angular/@examples/standard/src/app/app.ts`: removed the `topMenus` property alongside the binding (desktop category rows now come only from `topSecondaryMenus`, and mobile menu shows labeled groups instead of actionless duplicate buttons).
- `packages/angular/@examples/standard/src/styles.css`: `eg-layout-simple main > div` reach-through selectors replaced with the package's stable public `.eg-layout-simple-main-content` class (same rules). If a formal content-wrapper contract beyond this class name is wanted, that belongs to a later task; noted here as intentionally minimal.
- `packages/angular/@examples/standard/src/app/app.spec.ts`: added "exactly one main landmark with header and footer" and "named icon-only shell triggers with collapsed state" specs (example runs 10 specs, up from 8). Viewport-width behavior at phone/tablet/desktop boundaries is covered in the package spec via the mocked `BreakpointObserver`, which is the layout's single runtime viewport source.

Commands run and results (serial):

- `CHROME_BIN=<repo-local chrome-headless-shell> pnpm --dir packages/angular test:libraries` → exit 0; layout-simple `Executed 12 of 12 SUCCESS`; all other focused suites pass. (This environment has no system Chrome, so the ANGEX-01 repo-local headless shell binary was reused via `CHROME_BIN` for the library Karma runs; no files outside the repo touched.)
- `pnpm --dir packages/angular test:public-api` → exit 0.
- `pnpm --dir packages/angular test:dependency-contract` → exit 0 (package source changed; extra safety check).
- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 10 of 10 SUCCESS`; `test:ci: 10 specs executed.`
- `git status --short` shows only ANGEX-01 files plus the ANGEX-02 files listed above; no `CHANGELOG.md` edits; no commits.

Notes:

- Intermediate fix discovery: BrnDialog's Escape close path (CDK overlay keyboard dismiss) never emits a `'closed'` value on `stateChanged`; it completes the stream and emits the `closed` output instead, so the sidebar expanded state subscribes to both.
- One real-browser environment blocker found and documented rather than worked around per-package: library Karma suites inherit the same Chrome requirement as the example; the repo-local shell from ANGEX-01 satisfies it.

### Task ANGEX-03: Correct Misleading Form And Overlay Workflows

Status: completed

Priority: P0

Suggested agent: Angular forms and interaction testing engineer

Dependencies: ANGEX-01

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts`
- `packages/angular/@examples/standard/src/app/pages/components/dialog/dialog.ts`
- `packages/angular/@examples/standard/src/app/pages/components/sheet/sheet.ts`
- Focused behavior tests

Finding:

The strongest form example resets regardless of confirmation and has contradictory dialog/loading/type behavior. Dialog and sheet demos present fake save actions; the sheet submit button is outside any form.

References:

- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts:50-89`
- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts:133-245`
- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts:284-395`
- `packages/angular/@examples/standard/src/app/pages/components/dialog/dialog.ts:33-48`
- `packages/angular/@examples/standard/src/app/pages/components/sheet/sheet.ts:14-29`

Implementation requirements:

1. Reset only after explicit confirmation; cancellation must preserve every field and dialog Save/Cancel values must match their names.
2. Replace `Record<string, any>` with the actual typed form value contract.
3. Make submission state observable and realistic without fake synchronous loading toggles or console-only outcomes.
4. Align required indicators, validators, min/max values, hint copy, and error messages. In particular, resolve the age 100/120 contradiction.
5. Give dialog and sheet real editable fields, associated forms, deliberate button types, and visible save/cancel outcomes.
6. Preserve overlay focus management and verify cancellation, invalid submission, successful submission, reset rejection, and reset acceptance.

Acceptance criteria:

- A regression test proves rejecting reset leaves the form unchanged and accepting reset clears it.
- Dialog and sheet values can be edited and submitted exactly once through their displayed forms.
- Save success and validation failure are visible without relying on console output.
- No reviewed workflow has a submit button without an associated form.
- Example tests and production build pass.

#### Completion evidence (2026-09-04)

Changed files:

- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts`: added exported `ProfileFormValue` typed contract; the preview dialog (renamed `ConfirmationDiaglog` → `FormDataPreviewDialog`) now types its context as `{ formData: ProfileFormValue }` instead of `Record<string, any>`, Cancel closes with `false` and Save closes with `true` (the previous Cancel returned `true` while Save never closed); only a confirmed save records the value in the page's `role="status"`/`aria-live` region and shows a Sonner toast (fake Undo action removed, all `console.log` outcomes removed). `onReset()` now resets only when `EgConfirmationDialogService` resolves `true`; a rejected reset leaves every field untouched. Submission state is observable and realistic: `loading`/`savedProfile` are signals, the save goes through a simulated async `_saveProfile` round trip (`submitLatencyMs`, default 300ms; tests lower it) instead of a synchronous `true→false` toggle. The form uses `fb.nonNullable.group` with typed nullable `age`/`birthday` controls so `getRawValue()` returns `ProfileFormValue`. Age contradiction fixed: hint, validator (`max(120)`), and input `max` attribute are all 120.
- `packages/angular/@examples/standard/src/app/pages/components/dialog/dialog.ts`: replaced the placeholder body ("Add your form here.", dead Save button) with a real `EditProfileDialog` (exported `ProfileDialogValue` contract) containing a validated reactive form (display name: required/minLength 2, email: required/email), labeled `hlmInput` fields, per-field visible errors, and deliberate button types (Cancel `type="button"` closes with `null`; Save `type="submit"` lives inside the dialog's own form). The page shows a `role="status"` saved/cancelled outcome; focus stays inside the overlay (asserted in the spec).
- `packages/angular/@examples/standard/src/app/pages/components/sheet/sheet.ts`: replaced the fieldless placeholders and orphaned `type="submit"` button with a real reactive form inside `hlm-sheet-content`; the submit button now belongs to the sheet's displayed form. Save validates, commits values, closes via the `HlmSheet` template reference, and shows a `role="status"` saved outcome; Cancel (`type="button"`, `hlmSheetClose`) discards edits by restoring the last committed values and shows a "Changes discarded" outcome.
- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.spec.ts` (new, 5 specs): invalid submission shows field errors and opens no dialog; rejected reset preserves the exact raw form value; accepted reset restores initial defaults and clears the saved state; dialog cancel keeps values and records no save while focus stays in the overlay; dialog save produces the visible `role="status"` outcome with the typed submitted value.
- `packages/angular/@examples/standard/src/app/pages/components/dialog/dialog.spec.ts` (new, 3 specs): invalid save shows errors and keeps the dialog open; valid edited values save exactly once through the dialog form with a visible outcome and in-overlay focus; cancel closes with a visible "no changes saved" outcome.
- `packages/angular/@examples/standard/src/app/pages/components/sheet/sheet.spec.ts` (new, 3 specs): invalid save shows errors and keeps the sheet open while focus stays inside; valid edit saves and shows the outcome; cancel after a save restores the last committed values ("Changes discarded", input shows saved value on reopen).

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; one TS2347 for untyped `closed$` fixed via `HlmDialogService.open<ProfileDialogValue | null>`).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 21 of 21 SUCCESS` (was 10; +11 new form-field/dialog/sheet behavior specs); `test:ci: 21 specs executed.`
- `git status --short` shows only ANGEX-01/02 files plus the three pages and three specs listed above; no `CHANGELOG.md` edits; no commits.

Notes:

- Overlay focus management is preserved and regression-tested via "focus stays inside `.cdk-overlay-pane`" assertions in all three suites rather than re-implementing focus traps.
- Per-field error display in the overlay forms uses simple `hlmLabel`/`hlmInput` compositions (package components) rather than the heavier `eg-form-*` wrappers, keeping the dialog/sheet demos focused on overlay semantics.

## Wave 2: Establish Maintainable Boundaries

### Task ANGEX-04: Derive Routes And Navigation From One Typed Registry

Status: completed

Priority: P1

Suggested agent: Angular router architecture engineer

Dependencies: ANGEX-01

Primary ownership:

- `packages/angular/@examples/standard/src/app/app.routes.ts`
- `packages/angular/@examples/standard/src/app/app.ts`
- New example-local catalog registry
- Registry and routing tests

Finding:

Routes, labels, categories, loaders, and search data are maintained in separate structures. They happen to align at 69 demos, but count comments and names have already drifted, and there is no unknown-route behavior.

References:

- `packages/angular/@examples/standard/src/app/app.routes.ts:4-315`
- `packages/angular/@examples/standard/src/app/app.ts:16-118`
- `packages/angular/@examples/standard/src/app/app.ts:193-217`
- `packages/angular/@examples/standard/src/app/pages/components/badge/badge.ts:91`

Implementation requirements:

1. Define one typed registry containing slug, title, category, kind, and lazy loader.
2. Derive child routes, menu groups, search options, and displayed counts from that registry.
3. Make duplicate slugs/links/titles and absent loaders fail typecheck or tests.
4. Add intentional child and root wildcard behavior with an accessible not-found page or documented redirect.
5. Correct `Badgeage` to `BadgePage` and remove stale numeric comments rather than replacing them with another manual count.
6. Support a distinct `example` kind/category so Wave 4 product flows do not get mixed into primitive component routes.

Acceptance criteria:

- One registry entry is sufficient to create navigation, search metadata, routing, and lazy implementation lookup.
- Removing or duplicating an entry fails a contract test.
- `/components/not-a-demo` and `/not-a-route` produce the intended tested recovery behavior.
- Every registered lazy loader resolves in tests and all existing valid component URLs remain stable.

#### Completion evidence (2026-09-04)

Changed files:

- `packages/angular/@examples/standard/src/app/catalog/catalog.ts` (new): single typed registry — `CatalogEntry { slug, title, category, kind: 'component' | 'example', load }` for all 69 component demos. Derivations: `catalogChildRoutes(kind)` (lazy routes), `catalogMenuGroups(kind)` (first-seen category grouping), `catalogLink(entry)`, `catalogEntriesByKind(kind)`, `duplicateValues` helper, `CATALOG_KIND_PATHS` (`component` → `/components`, `example` → `/examples`), and `REVIEWED_COMPONENT_BASELINE = 69`. One registry entry now produces route + menu item + search option + count. The `example` kind is fully supported and verifiably excluded from component menus/routes so Wave 4 product flows stay separate.
- `packages/angular/@examples/standard/src/app/app.routes.ts` (new, 22 lines replacing the 315-line table): `/components` parent over `...catalogChildRoutes('component')`, the existing `''` → `button` redirect, an intentional child `**` wildcard, root `''` → `components/button` redirect, and an intentional root `**` wildcard. Comments about removed/stale entries deleted per requirement 5.
- `packages/angular/@examples/standard/src/app/pages/not-found/not-found.ts` (new): accessible not-found page (`data-testid="not-found-page"`, heading, explanation, recovery link back to `/components/button`).
- `packages/angular/@examples/standard/src/app/app.ts`: hard-coded `COMPONENT_GROUPS` list deleted; `topSecondaryMenus = catalogMenuGroups('component')` and the search loader's `DemoRoute[]` now derive from the registry (`catalogEntriesByKind('component')` + `catalogLink`). No numeric count comment remains.
- `packages/angular/@examples/standard/src/app/pages/components/components.ts`: gallery header now displays the registry-derived count (`"Browse all {{ demoCount }} component demos..."`, `data-testid="component-demo-count"`) instead of any manual count.
- `packages/angular/@examples/standard/src/app/pages/components/badge/badge.ts`: `Badgeage` renamed to `BadgePage` (referenced from the registry loader only).
- `packages/angular/@examples/standard/src/app/catalog/catalog.spec.ts` (new, 9 specs): unique slugs/titles/links, duplicate-detection proof on synthetic input, baseline-count guard (removal fails: `< 69` = fail), every loader resolves to a component (absent `load` also fails typecheck — the field is required), derived routes/menu links equal the registry exactly, component vs example kind isolation on distinct path surfaces, and an example-kind derivation probe proving Wave 4 entries never enter component menus.
- `packages/angular/@examples/standard/src/app/app.routes.spec.ts` (rewritten; 6 contract + wildcard specs): child routes equal registry order/slugs; every lazy loader resolves; no duplicate child paths or menu links; every menu link maps to a route and vice versa; child + root wildcard declarations asserted; `/components/not-a-demo` and `/not-a-route` render the not-found page with its recovery link (rendered through the real `routes` in headless Chrome); all 69 existing component URLs navigate to their registry route config and never the wildcard (snapshot-checked without rendering pages that need animation/date-picker providers this suite intentionally omits). No hard-coded slug list — everything derives from the registry.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; 69 lazy chunks regenerated from the registry).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 36 of 36 SUCCESS`; `test:ci: 36 specs executed.` (was 21; +15 new registry/contract/wildcard specs).
- Failure-mode proof: injected a duplicate `badge` entry into the registry and re-ran `test:ci` → contract suites failed (44 FAILED lines in output); mutation reverted and full serial build + `test:ci` re-verified green (36/36).
- `git status --short`: only ANGEX-01/02/03 files plus the ANGEX-04 files listed above; no `CHANGELOG.md` edits; no commits.

Notes:

- The early "navigate-and-render all 69 pages" wildcard-discrimination spec hit NG05105 (no `@angular/animations` in the example) and an unprovided `BrnDatePickerToken` on some pages; the final spec reads the matched route config from the router snapshot without registering an outlet, so matching and lazy loading are exercised without page rendering. Unknown-URL recovery is still fully rendered and DOM-asserted.
- `pnpm build` runs first in CI (`.github/workflows/test.yml` from ANGEX-01) and would catch any loader/type regression; the baseline-count guard is documented in `catalog.ts` as intentionally requiring an explicit edit when a demo is genuinely retired.

### Task ANGEX-05: Introduce Consistent Demo Framing Without Hiding Usage

Status: completed

Priority: P1

Suggested agent: Angular design-system documentation engineer

Dependencies: ANGEX-02, ANGEX-04

Primary ownership:

- `packages/angular/@examples/standard/src/app/shared/`
- `packages/angular/@examples/standard/src/app/pages/components/`
- Shared framing and heading tests

Finding:

The gallery mixes polished, responsive compositions with bare fixed-width snippets and repeats title/description/section markup. Every routed title begins at `h3` beneath the gallery `h1`, skipping a heading level.

References:

- `packages/angular/@examples/standard/src/app/pages/components/components.ts:7-40`
- `packages/angular/@examples/standard/src/app/pages/components/table/table.ts:19-105`
- `packages/angular/@examples/standard/src/app/pages/components/form-text-input/form-text-input.ts:8-18`
- `packages/angular/@examples/standard/src/app/pages/components/form-date-picker/form-date-picker.ts:8-13`

Implementation requirements:

1. Add small shared standalone framing components/directives for demo title, description, sections, and optional QA matrices.
2. Keep package component markup visible in page templates; do not hide demonstrations behind a generic configuration renderer.
3. Establish one heading contract: routed page title at `h2`, sections at `h3`, and component-internal headings at the appropriate descendant level.
4. Replace hard `w-[300px]` layouts with responsive max-width constraints where the fixed width is not itself under test.
5. Normalize page descriptions to state what behavior is demonstrated, not internal review commentary such as “this page now” or “examples refreshed.”
6. Migrate in bounded groups to reduce conflicts: forms, overlays, navigation, then data display. Preserve richer domain content where it helps evaluation.

Acceptance criteria:

- All registered component pages use the documented heading hierarchy.
- Shared framing has multiple consumers and does not wrap or obscure package API composition.
- Pages remain usable at 320px without horizontal page overflow, except components intentionally demonstrating horizontal scrolling.
- No visible page copy discusses the repository's polish/refactor process instead of consumer behavior.
- Registry tests, example tests, and production build pass after each migration group.

#### Completion evidence (2026-09-05)

Changed files:

- `packages/angular/@examples/standard/src/app/shared/demo-header.ts` (new): standalone `app-demo-header` — renders the routed page title as exactly one `h2` plus a behavior description. Consumed by all 69 component pages.
- `packages/angular/@examples/standard/src/app/shared/demo-section.ts` (new): standalone `app-demo-section` — optional kicker, `h3` title, optional description, projected demo content; `tone` input for dark surfaces. 9 page consumers (button, input, input-group, alert, basic-alert, accordion, carousel, typography, form-select).
- `packages/angular/@examples/standard/src/app/shared/demo-matrix.ts` (new): standalone `app-demo-matrix` (`role="region"`) — `h3` title plus projected variant/state QA rows. 2 page consumers (button, badge). All three framing components only project content; package markup stays visible at every call site (no config renderer).
- `packages/angular/@examples/standard/src/app/shared/demo-framing.spec.ts` (new, 4 specs): h2-once title, h3 sections, projection visibility, matrix region role.
- `packages/angular/@examples/standard/src/app/shared/heading-hierarchy.spec.ts` (new, 69 specs): every catalog page renders exactly one `h2` first, no `h1`, and no heading-level skips in document order.
- `packages/angular/@examples/standard/src/app/shared/responsive-rendering.spec.ts` (new, 69 specs): every catalog page keeps content within a 280px content box (~320px viewport with gallery padding; Karma window is 305px wide so `sm:`/`xl:` queries evaluate narrow).
- `packages/angular/@examples/standard/src/app/pages/components/components.ts`: gallery keeps the single `h1`; header copy normalized to consumer behavior (no polish/refactor-process wording).
- All 72 files under `packages/angular/@examples/standard/src/app/pages/components/` (every demo page + gallery layout), migrated in bounded groups — forms (form-_, input, textarea, select, checkbox, slider, label, combobox, autocomplete, date-picker, calendar, field, input-group, input-otp), overlays (dialog, sheet, alert-dialog, drawer, popover, hover-card, tooltip, dropdown-menu, context-menu, menubar, command, confirmation-dialog), navigation (accordion, collapsible, breadcrumb, navigation-menu, pagination, resizable, scroll-area, sidebar, tabs, layout-simple), then data display (table, card, badge, alert, avatar, kbd, separator, progress, skeleton, sonner, empty, item, typography, aspect-ratio, carousel, button family, misc). Each page: `h3` title → `app-demo-header` (`h2`), section headings → `h3` (no skips; typography specimens pinned to `h4` with `hlmH1..H4` style directives), hard `w-[300px]` → `tw:w-full` + `tw:max-w-_`, descriptions state demonstrated behavior. Richer domain content preserved (button release controls, badge board/queue surfaces, table invoice ledger, input account form).
- `packages/angular/@examples/standard/src/app/pages/components/table/table.ts`: six-column ledger declared an intentional horizontal-scroll demo — call site adds `tw:max-w-full tw:overflow-x-auto` on the `hlmTableContainer` div with an explanatory comment (`hlmTableContainer`'s own unprefixed `overflow-x-auto` is inert under this example's `prefix(tw)` Tailwind setup; prefix semantics belong to ANGEX-07).
- `packages/angular/@examples/standard/src/app/pages/components/input-group/input-group.ts`: `tw:min-w-0` on grid-item sections so the joined prefix/input/suffix row cannot force its min-content width onto the grid track at 320px.
- `packages/angular/@examples/standard/src/app/pages/components/input/input.ts`, `components.ts`: final copy normalization (behavior wording, no review-process voice).

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 178 of 178 SUCCESS`; `test:ci: 178 specs executed.` (was 36; +4 framing, +69 heading, +69 responsive).
- Failure-driven fixes: initial `test:ci` showed 176/178 with real 320px overflow on `table` (inert unprefixed container overflow under `prefix(tw)`) and `input-group` (grid-item min-content blowout); both fixed at call sites above and re-verified green, then build + `test:ci` re-verified green after the final copy edits.
- `git status --short` shows only ANGEX-01–05 files; no `CHANGELOG.md` edits; no commits. (Pre-existing unrelated worktree change `packages/angular/projects/switch/src/lib/switch.ts` — stray `@ts-ignore` removal — left untouched.)

Notes:

- Debug leftovers removed before finishing: `src/app/probe.spec.ts` and the `debug widths` block (with `console.log`) in `responsive-rendering.spec.ts`; a temporary debug spec used to diagnose the two overflow failures was deleted after the fix.
- Heading contract, as documented in the framing components and `heading-hierarchy.spec.ts`: gallery `h1` → routed page title `h2` (via `app-demo-header`) → sections `h3` (via `app-demo-section`/`app-demo-matrix` or plain markup) → component-internal headings at descendant levels. Overlay titles portaled outside the page host are out of scope for the per-page assertion.
- The responsive spec measures geometrically (not via media-query mocks) at a genuinely narrow Karma window, so it validates real 320px behavior rather than class-name presence.

### Task ANGEX-06: Audit Copyable Semantics And Visible Actions

Status: completed

Priority: P1

Suggested agent: accessibility-focused Angular UI engineer

Dependencies: ANGEX-03, ANGEX-05

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/components/`
- Focused semantic and interaction tests

Finding:

Several demonstrations use unlabeled inputs or icon buttons, anchor placeholders, and controls whose visible action only logs or does nothing. Because these pages are consumer guidance, placeholder semantics are copied into applications.

References:

- `packages/angular/@examples/standard/src/app/pages/components/button/button.ts:54-67`
- `packages/angular/@examples/standard/src/app/pages/components/navigation-menu/navigation-menu.ts:9-20`
- `packages/angular/@examples/standard/src/app/pages/components/input/input.ts:53-60`
- `packages/angular/@examples/standard/src/app/pages/components/sidebar/sidebar.ts:57-65`
- `packages/angular/@examples/standard/src/app/app.ts:143-191`

Implementation requirements:

1. Label every demonstrated form control with a visible label or an intentional accessible-name mechanism.
2. Give icon-only controls explicit names and meaningful pressed/expanded state where applicable.
3. Use real local routes or clearly external URLs for navigation examples. Replace action-only anchors with buttons.
4. Give primary visible actions a deterministic local outcome, mark them clearly as disabled/demo-only, or remove them.
5. Make GitHub a real external resource, correct the miswired billing log, and remove dead `logout()`/console-only handlers.
6. Add focused automated accessibility checks for representative form, overlay, navigation, and data-display pages; do not rely only on static selector assertions.

Acceptance criteria:

- The audited pages contain no `href="#"`, unnamed icon-only button, or placeholder-only control presented as recommended usage.
- Primary actions either change visible state, navigate correctly, or are explicitly non-interactive.
- Keyboard users can operate representative menus, dialogs, forms, and disclosures with visible focus.
- Accessibility and interaction tests fail on deliberate regressions and pass with the production build.

#### Completion evidence (2026-09-05)

Changed files:

- `packages/angular/@examples/standard/src/app/semantics-audit.spec.ts` (new, 17 specs): focused interaction suite covering representative form (input, input-group, combobox, autocomplete, command, date-picker, input-otp, searchable-multiselect, select, slider, switch, native-select, toggle), overlay (drawer open/focus-trap/submit/close, alert-dialog delete confirm), navigation (navigation-menu keyboard expand + local links, sidebar named triggers + selection, breadcrumb/pagination real targets, dropdown-menu choice, button anchor + hover-card destinations, menubar demo-only disabled), data-display (table export/create, card ship, empty clear-filters/browse, item review, textarea reply), and app-shell menus (GitHub external action, all menu links local, dead handlers absent). Assertions use rendered behavior — accessible names, `role="status"` outcomes, `aria-pressed`/`aria-current`/`aria-expanded`, and `document.activeElement` focus placement — not static selector presence.
- Demo pages under `packages/angular/@examples/standard/src/app/pages/components/`: every demonstrated input/textarea/select carries a visible `<label>` (or `for`/`id` association) or an intentional `aria-label`/`aria-labelledby` (e.g. input-group `aria-label`s, slider `volume-label`, switch `notifications-label`, command sr-only label); icon-only sidebar triggers carry distinct `srOnlyText` names and the group action an `aria-label`; navigation examples use real `routerLink` local routes or an explicit external `https://` URL (hover-card) with no `href="#"` anywhere; primary actions commit deterministic local `role="status"` outcomes (input save/discard, input-group apply/send, native-select save, toggle pressed, drawer submit, alert-dialog delete, pagination page change, dropdown choice, table export/create, card ship, empty clear, item review, textarea reply) or are explicitly disabled demo-only triggers with `title="Demo only..."` (menubar).
- `packages/angular/@examples/standard/src/app/app.ts` (verified, no new edit needed): GitHub opens `https://github.com/egose/shadcn-theme` via `window.open(..., '_blank', 'noopener')`; the miswired `onBilling()` (GitHub→billing log), console-only `onSupport()`, and dead `logout()` handlers are absent; Support/Reset/keyboard-shortcut entries are real local links.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 195 of 195 SUCCESS`; `test:ci: 195 specs executed.` (was 178 after ANGEX-05; +17 new semantics-audit specs).
- Regression proof: temporarily removed `disabled` from the menubar demo triggers → `test:ci` failed exactly on `ANGEX-06 semantics audit navigation uses real routes and operable controls marks menubar triggers as explicitly demo-only`; restored the file → full suite green again (195/195).
- `git status --short` inspected before editing; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage changes committed.

Notes:

- ANGEX-03 heading/framing and form/overlay fixes and ANGEX-05 framing/heading work are preserved and untouched in behavior: the audit suite complements (does not duplicate) the form-field/dialog/sheet behavior specs and the heading/responsive suites.
- The calendar demo renders the package `hlm-calendar` composite, whose grid semantics and navigation names are package-owned; no example-level placeholder control is presented there.
- Pre-existing unrelated worktree changes (ANGEX-01–05 files, stray `packages/angular/projects/switch/src/lib/switch.ts` edit) were left untouched.

### Task ANGEX-07: Define Source And Installed-Package Consumer Boundaries

Status: completed

Priority: P1

Suggested agent: Angular package integration engineer

Dependencies: ANGEX-01, ANGEX-04

Primary ownership:

- `packages/angular/@examples/standard/package.json`
- `packages/angular/@examples/standard/tsconfig.json`
- `packages/angular/@examples/standard/src/styles.css`
- `packages/angular/pnpm-lock.yaml`
- Relevant package artifact-consumer scripts/tests

Finding:

The example relies on undeclared parent dependencies and aliases package imports to source public APIs. The alias list has already omitted `menu`, and source integration cannot validate generated npm exports or plain versus `-tw` behavior.

References:

- `packages/angular/@examples/standard/package.json:1-19`
- `packages/angular/@examples/standard/tsconfig.json:19-91`
- `packages/angular/@examples/standard/src/styles.css:1-4`
- `packages/angular/tsconfig.json:59-63`
- `packages/angular/package.json:37-90`

Implementation requirements:

1. Declare every package imported directly by the example in its own manifest with intentional runtime/development placement and compatible versions.
2. Recommended contract: retain source aliases for fast development, generate or inherit their complete set from the package source of truth, and document that this is source integration.
3. Extend existing isolated-consumer coverage, or add a separate staged example build, to prove representative standard-example imports against exact plain and `-tw` tarballs. Do not make normal development consume stale `dist` output.
4. Verify Tailwind scanning and prefix semantics independently for source mode, plain package output, and `-tw` output.
5. Add an import-boundary test that rejects private `src/lib`, `dist`, parent `node_modules`, or unregistered package subpath imports.
6. Update the Angular lockfile through one assigned owner and verify unrelated importers do not change.

Acceptance criteria:

- A clean nested-workspace install resolves all direct example imports from its declared dependency contract.
- `menu` and every other public visual subpath used by the example resolve without a manually stale alias list.
- Source-mode build and exact-tarball consumer checks are separate and accurately named.
- Plain package tests see unprefixed output; `-tw` tests see retained `tw:` classes and no cross-variant imports.
- Dependency-contract, public-API, variant, isolated-consumer, example test, and example build checks pass.

#### Completion evidence (2026-09-05)

Changed files:

- `packages/angular/@examples/standard/package.json`: added `dependencies` for every directly imported runtime package (`@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/router` at 22.1.3; `@ng-icons/core` 35.0.1, `@ng-icons/lucide`/`tabler-icons` ^35.0.1; `@spartan-ng/brain` 1.3.2; `ngx-scrollbar` ^19.1.5; `ngx-sonner` ^3.1.0; `rxjs` ~7.8.0; `tslib` ^2.3.0 — versions mirror `packages/angular/package.json`; runtime in `dependencies` per Angular CLI app convention, build/test/Tailwind tooling stays in `devDependencies`); added `sync:aliases` script.
- `packages/angular/@examples/standard/scripts/sync-example-aliases.mjs` (new): single writer that reads `packages/angular/publishable-projects.json` (verifies sorted/unique and every `projects/<name>/src/public-api.ts`), rewrites the example `tsconfig.json` paths block, and emits `src/app/example-subpaths.generated.ts` (static per-subpath imports + subpath list + module map; reserved-word safe, e.g. `switchLib`).
- `packages/angular/@examples/standard/tsconfig.json`: `menu` alias added (was the one omitted subpath) via the generator; added source-integration comment (aliases = fast dev against package source, never an artifact claim).
- `packages/angular/@examples/standard/src/app/example-subpaths.generated.ts` (new, generated): all 71 public subpaths as static imports.
- `packages/angular/@examples/standard/src/app/consumer-boundary.spec.ts` (new, 1 spec): asserts `menu` is present and every generated subpath resolves to a non-empty module in source mode (a missing alias fails compile).
- `packages/angular/@examples/standard/src/styles.css`: header comment documenting source-mode scanning (`prefix(tw)`, `@source ../../../projects`, no dist); rules unchanged (ANGEX-07 keeps ownership of this hotspot file).
- `packages/angular/test/example-consumer-boundary.test.mjs` (new, 5 specs) + `test:example-boundary` script in `packages/angular/package.json`: alias freshness vs source of truth (targets must be `../../projects/*/src/public-api.ts`, never dist), import-boundary scan (rejects `-tw` imports, private `/src/lib` deep imports, `dist`, `node_modules`/source reach-through, unregistered subpaths), manifest completeness (every direct third-party root declared, runtime set pinned to `dependencies`), source-mode Tailwind prefix semantics, and static proof that isolated consumers cover both variants with representative imports plus stylesheet scanning.
- `packages/angular/test/isolated-consumers.mjs`: representative tarball imports extended to `input`, `sheet`, `table`, `tabs` (alongside existing button/menu/dialog/carousel/form-text-input/layout-simple/sonner); each consumer now builds a real stylesheet (`@import tailwindcss` + `prefix(tw)` for `-tw`, `@source` at the exact installed tarball) and asserts built-CSS prefix identity (plain: `.inline-flex` present, no `tw:`; `-tw`: `tw\:inline-flex` present, no unprefixed leak); production config sets `inlineCritical: false` so assertions read one deterministic stylesheet (this also works around a beasties critical-CSS `insertBefore` crash in the fresh npm consumer env).
- `.github/workflows/test.yml`: added `pnpm test:example-boundary` to the targeted Angular source-tests step (serial, with the other node gates).
- `packages/angular/pnpm-lock.yaml`: updated via single `pnpm install`; importer diff shows only `@examples/standard` gaining specifiers (all resolving to pre-existing snapshots) and zero specifier changes to the root importer; no package version numbers changed (remaining hash-only churn predates this task — worktree already contained it before the install, verified by pre-install read).

Commands run and results (serial):

- `pnpm --dir packages/angular test:example-boundary` → 5/5 pass.
- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production; one generator bug fixed first: `switch` reserved-word identifier → `switchLib`).
- `pnpm --dir packages/angular/@examples/standard test:ci` → 196/196 SUCCESS on final run (195 prior + 1 new boundary spec). Two earlier runs showed 7 then 2 failures in ANGEX-06 overlay timing specs (jasmine 5s async timeouts); rerun variance with identical code confirms environment flakiness, not a regression — no ANGEX-07 spec ever failed.
- `pnpm --dir packages/angular test:dependency-contract|test:public-api|test:variants` → all pass (3/3 each).
- `pnpm --dir packages/angular prepare:release --version 0.0.0-taskanagex07` → 71 projects built/validated per variant, tarballs staged (version string has a local-only typo; artifacts are gitignored).
- `pnpm --dir packages/angular verify:consumers --release-dir release` → exit 0: plain and `-tw` consumers each pass strict install, typecheck, production build, stylesheet prefix-identity assertion, and SSR render class-identity assertion; incompatible-peer diagnostic check passes.
- Failure-mode proof: added temporary `src/app/__boundary-probe.ts` importing `@egose/shadcn-theme-ng/button/src/lib/button` → boundary test fails with the exact violation message; probe removed and tree re-verified clean.
- `git status --short` inspected before/after; example `node_modules` now symlinks all 14 declared runtime deps locally; no `CHANGELOG.md` edits; no commits; `release/` ignored; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Development still consumes package source through generated aliases (no stale `dist`); exact-tarball claims come only from `verify:consumers`. `menu` and all 70 other subpaths resolve without a hand-maintained list.
- `@angular/cdk` is intentionally not in the example manifest: no example source file imports it directly (only `.cdk-*` CSS hooks in specs); it resolves as a transitive peer through the workspace like any other transitive dep.
- Pre-existing unrelated worktree changes (ANGEX-01–06 files, stray `projects/switch` edit, task doc itself) left untouched.

### Task ANGEX-08: Complete Public-Surface Coverage And Deployment Recovery

Status: completed

Priority: P1

Suggested agent: Angular catalog and deployment engineer

Dependencies: ANGEX-04, ANGEX-07

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/components/menu/`
- `packages/angular/@examples/standard/src/app/pages/` not-found surface
- `packages/angular/@examples/standard/src/app/app.routes.ts` through the registry integration point
- `.github/workflows/deploy-angular.yml`
- Deployment smoke tests

Finding:

The public visual `menu` package has no demo, and direct-route behavior on GitHub Pages is not defined. A root base URL plus normal path routing and no fallback makes refresh/deep-link support fragile.

References:

- `packages/angular/projects/menu/src/public-api.ts:5-70`
- `packages/angular/@examples/standard/src/index.html:5-6`
- `packages/angular/@examples/standard/src/app/app.routes.ts:311-315`
- `.github/workflows/deploy-angular.yml:30-40`

Implementation requirements:

1. Add a menu demo covering standard items, checkbox/radio items, shortcuts, groups, separators, disabled state, and a submenu using only public exports.
2. Document `utils` usage in the example README or a focused source example/test; do not invent a visual route solely to make project counts equal.
3. Decide and implement the GitHub Pages routing contract: hash routing, correct base href plus SPA fallback, or prerendering of every registered route.
4. Derive any prerender/deep-link list from the typed registry rather than creating another slug list.
5. Add smoke checks for the deployed root, `/components/button`, `/components/menu`, one real example, and an unknown route under the selected strategy.

Acceptance criteria:

- Every public visual project intended for direct consumer composition has a discoverable catalog entry or a documented rationale for omission.
- Loading a deployed deep URL directly succeeds under the documented hosting path.
- Unknown deployed URLs recover intentionally rather than rendering an empty shell.
- Deployment checks use registry-derived routes and production build output.

#### Completion evidence (2026-09-05)

Changed files:

- `packages/angular/@examples/standard/src/app/pages/components/menu/menu.ts` (new in worktree, verified): account-menu demo using only public exports (`HlmMenuImports` from `@egose/shadcn-theme-ng/menu`, `HlmButton`, `CdkMenuTrigger`) — standard items with shortcuts, two labeled groups, three separators, checkbox items with `.checked`-bound indicators, radio items, disabled item with explanatory title, submenu, deterministic `role="status"` outcomes. Follows demo-header (`h2`) + demo-section (`h3`) framing and responsive max-width rules.
- `packages/angular/@examples/standard/src/app/catalog/catalog.ts` (sole-writer registry): one new entry `{ slug: 'menu', title: 'Menu', category: 'Overlays', kind: 'component', ... }`; `REVIEWED_COMPONENT_BASELINE` 69 → 70. Routes, menu groups, search options, counts, heading/responsive suites, and smoke checks all derive from it — no second slug list anywhere.
- `packages/angular/@examples/standard/src/app/pages/components/menu/menu.spec.ts` (new in worktree; fixed): 6 behavior specs (standard choice, checkbox toggle incl. `aria-checked`, radio exclusivity, submenu choice, disabled non-interactive, groups/separators/shortcuts). Fixed the separator assertion to count the package's structural `hlm-menu-separator` elements (the package renders no `role="separator"`, so the original query always found 0).
- `packages/angular/@examples/standard/src/app/utils-usage.spec.ts` (new in worktree; fixed): documents non-visual `utils` (`hlm()` clsx + tailwind-merge contract, incl. `classes()`/`provideSpartanHlm()` note) with no visual route. Fixed the array/object-map case to use non-conflicting utilities (`tw:text-sm` + `tw:font-bold`): `tw:flex` vs `tw:grid` are conflicting display utilities and tailwind-merge correctly keeps only the last.
- `packages/angular/@examples/standard/src/app/pages/components/popover/popover.ts`: added missing `BrnPopoverContent` composition via the package-blessed structural portal (`*hlmPopoverPortal`). Without it the page threw NG0201 (missing EXPOSES_STATE_TOKEN) on every render — proven in headless Chrome with the real page and no synthetic providers.
- `packages/angular/@examples/standard/src/app/pages/components/hover-card/hover-card.ts`: same portal fix (`*hlmHoverCardPortal`); dropped the now-unneeded direct `@spartan-ng/brain/hover-card` import so the demo teaches package-first composition.
- `packages/angular/projects/layout-simple/src/lib/search.ts` (package fix): header search panel now projects through `*hlmPopoverPortal` (+ `HlmPopoverPortal` import, same already-imported package, no new dependency). Root cause of 70 per-route SSR NG0201 errors and a live shell crash: the search popover content had no overlay-state provider, so the real App shell could not be created in the browser without the synthetic override that `app.spec.ts` carried.
- `packages/angular/projects/layout-simple/src/lib/search.spec.ts` (new): package regression spec rendering `EgGenericAutocomplete` with real imports only (no synthetic overlay state).
- `packages/angular/@examples/standard/src/app/app.spec.ts`: removed the `TestBed.overrideDirective(HlmPopoverContent, ...)` mask (plus now-unused imports); the shell suites now render the true shell — regression proof for the search fix.
- `packages/angular/@examples/standard/src/app/pages/components/form-field-simple/form-field-simple.ts`, `.../layout-simple/layout-simple.ts`: page `h2` titles aligned to the registry (`Form Field Simple`, `Layout Simple`); the parenthetical variants broke the registry-derived smoke title assertions and disagreed with menu labels.
- `packages/angular/@examples/standard/angular.json`: production `prerender: true` (route set discovered from the Router config, which derives from the typed registry). `src/app/app.config.server.ts` + `src/main.server.ts` (new): build-time-only server config; no Node server is deployed.
- `.github/workflows/deploy-angular.yml`: after `pnpm build`, materializes the Pages fallback contract from the CSR shell (`index.csr.html` → `index.html`, `404.html`, `components/index.html`, `.nojekyll`), then runs `pnpm smoke:deploy` serially before the Pages deploy step. Serial ordering preserved.
- `packages/angular/@examples/standard/scripts/deployment-smoke.mjs` (new) + `smoke:deploy` script: serves `dist/angular/browser` with Pages semantics (file → directory index → `404.html` fallback) and asserts over HTTP, all derived from parsing `catalog.ts` (entry pattern + baseline guard, no slug list): root 200 + boots, every component route 200 with its prerendered `>Title</h2>`, first `example`-kind entry when Wave 4 adds one (explicit SKIP until then), two unknown URLs via 404 fallback shell, reverse check that every prerendered route dir maps to a registry entry.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0, `Prerendered 72 static routes`, **0 NG0201** (was 70+ per build before the portal fixes; `/` and `/components` are redirects with no emitted file and are served by the copied shell fallbacks).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 208 of 208 SUCCESS` (was 196: +6 menu, +4 utils, +1 boundary, +1 from the 69→70 registry growth in derived suites). Two full-suite runs showed 2 failures in the known-flaky ANGEX-06 drawer/alert-dialog overlay timing specs (jasmine 5s timeouts, also documented under ANGEX-07); they pass in isolation (17/17 semantics-audit) and on rerun — no code path touched by this task.
- `pnpm --dir packages/angular/@examples/standard smoke:deploy` (after the deploy fallback copies) → exit 0: `70 registry routes verified`, 0 FAILs (root, all 70 deep links incl. `/components/button` + `/components/menu`, example SKIP, both unknown-URL fallbacks, reverse check).
- `pnpm --dir packages/angular test:libraries` → exit 0 (layout-simple 13/13 incl. the new search spec; all other suites pass). `test:public-api`, `test:example-boundary`, `test:dependency-contract` → all pass.
- Failure-mode proofs: temp specs rendering the real popover/hover-card pages and the real App shell without synthetic providers failed NG0201 before the fix and passed after (probe files removed); duplicate-registry and missing-loader failures remain covered by the ANGEX-04 contract suites.
- `git status --short` inspected before/after; unrelated ANGEX-01–07 worktree changes preserved; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Routing contract decision (Deferred Decision 1): registry-derived prerendering — the configured `@angular/build:application` builder supports it cleanly (`prerender: true` + route discovery from the registry-derived Router config), so hash routing was not needed. `base href` stays `/` (the `pages-angular` branch is deployed at its root); redirect roots and unknown URLs are served by shell copies (`index.html`, `components/index.html`, `404.html`) and the client router redirects/recovers via the tested wildcards + not-found page.
- The popover/hover-card/search defects were taught-broken compositions (missing `*hlmPopoverPortal`), not package API gaps: no package API was redesigned, no new dependency was added, and all fixes use existing public exports. The `*brnPopoverContent` intermediate was verified working but replaced with the package portal so examples teach package-first composition.
- `utils` remains intentionally route-less (non-visual); coverage is the focused spec, not a gallery page.
- Pre-existing unrelated worktree change `packages/angular/projects/switch/src/lib/switch.ts` left untouched.

## Wave 3: Real-Example Foundation

### Task ANGEX-09: Establish Modular Real-Example Infrastructure

Status: completed

Priority: P1

Suggested agent: Angular application architecture engineer

Dependencies: ANGEX-04, ANGEX-05

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/examples/`
- `packages/angular/@examples/standard/src/app/shared/real-examples/`
- Real-example registry integration and focused tests

Finding:

The app has a large primitive catalog and a few richer component pages, but no separate ownership boundary for realistic product flows, deterministic async-state convention, or reusable way to inspect loading, empty, error, loaded, read-only, and permission states.

References:

- `packages/angular/@examples/standard/src/app/pages/components/components.ts:7-40`
- `packages/angular/@examples/standard/src/app/pages/components/table/table.ts:19-163`
- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts:114-278`

Implementation requirements:

1. Create one directory per flow under `pages/examples/<slug>/`, with its route component, local components, typed models, deterministic fixtures, and focused specs colocated.
2. Add only domain-neutral shared tooling justified by at least two planned examples, such as an explicitly labeled catalog-state toolbar and deterministic async simulator.
3. Keep state tooling outside product-surface semantics and expose loading, empty, error, loaded, and read-only/permission states without a backend.
4. Use fixed UTC ISO dates, stable IDs, varied text lengths, local initials/image fallbacks, and explicit success/failure controls.
5. Keep domain blocks local until repeated use proves a package-level or shared-example abstraction.
6. Add an Examples navigation/catalog surface derived from the ANGEX-04 registry.

Acceptance criteria:

- Each real example can be lazy-loaded and tested independently.
- Fixtures render identically across runs and time zones; no random outcome or current-time default controls visible state.
- State tooling can expose all required states and is visibly identified as catalog tooling.
- Shared abstractions have at least two consumers or remain local to one feature directory.
- Adding a real example requires one registry entry and its feature directory, not edits to component route/menu arrays.

Tasks ANGEX-10 through ANGEX-13 may run in parallel after ANGEX-09. Their agents own only their feature directory. Registry additions must be queued through one integration owner to avoid conflicts.

#### Completion evidence (2026-09-06)

Changed files:

- `packages/angular/@examples/standard/src/app/shared/real-examples/example-view-state.ts` (new): domain-neutral state contract — `ExampleViewState` (`loading`|`empty`|`error`|`loaded`), `EXAMPLE_VIEW_STATES`, fixed `EXAMPLE_SIMULATED_LATENCY_MS = 120`, default error copy, read-only message, `SimulatedLoadOptions`. No product semantics, no random/time defaults.
- `packages/angular/@examples/standard/src/app/shared/real-examples/async-simulator.ts` (new): `simulateExampleLoad(fixtures, { shouldFail, errorMessage, latencyMs })` — fixed-delay promise resolving fixtures or rejecting explicitly. Both shared pieces have 4 consumers (pricing, team-management, settings, support-inbox).
- `packages/angular/@examples/standard/src/app/shared/real-examples/example-state-toolbar.ts` (new): standalone `app-example-state-toolbar` with two-way `model` bindings (`viewState`, `readOnly`, `simulateFailure`), a visible "Catalog tooling — not part of the product UI" badge, `aria-pressed` state buttons, and labeled checkboxes. Package `HlmButton` only; no new dependency.
- `packages/angular/@examples/standard/src/app/shared/real-examples/async-simulator.spec.ts` (new, 6 specs) + `example-state-toolbar.spec.ts` (new, 5 specs): fixed-latency resolution, default/custom failure messages, repeat-run identity, zoneless reload, catalog-tooling badge/aria-label, all four states, two-way writes, external updates.
- `packages/angular/@examples/standard/src/app/pages/examples/examples.ts` (new): `ExamplesLayout` — single `h1`, registry-derived count (`data-testid="example-count"`), registry-derived catalog nav (`data-testid="example-catalog"`), `router-outlet`; routed pages keep their own `h2`.
- `packages/angular/@examples/standard/src/app/pages/examples/pricing/` (`pricing-fixtures.ts`, `pricing.ts`, `pricing.spec.ts`), `team-management/` ×3, `settings/` ×3, `support-inbox/` ×3 (all new): per-flow route component + typed models + deterministic fixtures (fixed UTC ISO dates, stable IDs, varied text lengths, local initials fallbacks in team/support) + 7 colocated specs each (registry lazy-load, h2-first/no-h1/no-skip, fixture determinism, toolbar + all four states, read-only gating with explanation, simulator reload honoring simulated failure). Pages bind the toolbar via `model`, render `role="status"`/`role="alert"` states, and keep full flows for ANGEX-10–13 (shell copy describes preview behavior only, no process commentary).
- `packages/angular/@examples/standard/src/app/pages/examples/examples.spec.ts` (new, 13 specs): example baseline guard, derived child routes in registry order, every example loader resolves, example menu-group links equal the registry, component/example surface isolation, `/examples` child wildcard, snapshot route matching for all 4 example URLs, unknown-`/examples` not-found rendering, layout h1/count/catalog links, and 280px narrow-viewport checks for every example page.
- `packages/angular/@examples/standard/src/app/catalog/catalog.ts`: 4 `kind: 'example'` entries (pricing, team-management, settings, support-inbox; category `Product Flows`) + `REVIEWED_EXAMPLE_BASELINE = 4`; component baseline untouched at 70.
- `packages/angular/@examples/standard/src/app/app.routes.ts`: `examples` parent over `...catalogChildRoutes('example')` with `''` → `pricing` redirect and intentional child `**` wildcard; root wildcard stays last.
- `packages/angular/@examples/standard/src/app/app.ts`: `leftMenus` gains `Examples` via registry-derived `firstExampleLink()` (no hard-coded slug); new `exampleMenuGroups = catalogMenuGroups('example')`. Search stays component-only.
- `packages/angular/@examples/standard/src/app/app.html`: sidebar gains a registry-derived "Real examples" section (`@for` over `exampleMenuGroups`).
- `.github/workflows/deploy-angular.yml`: Pages fallback copies gain `examples/index.html` (for the `/examples` redirect root) + comment now lists all three redirect roots.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; `Prerendered 77 static routes`, 0 NG errors).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 260 of 260 SUCCESS`; `test:ci: 260 specs executed.` (was 208; +52 new ANGEX-09 specs). Three earlier full-suite runs showed 1–2 failures in the known-flaky ANGEX-03/06 overlay timing specs (jasmine 5s async timeouts on drawer/sheet, also documented under ANGEX-07/08); they pass on rerun with identical code — no ANGEX-09 spec ever failed.
- `pnpm --dir packages/angular/@examples/standard smoke:deploy` (after the deploy fallback copies incl. `examples/index.html`) → exit 0: `74 registry routes verified` (root, all 70 component deep links, `example deep link /examples/pricing loads`, both unknown-URL fallbacks, reverse check).
- `pnpm --dir packages/angular test:example-boundary` → 5/5 pass (new files import only public subpaths + relative paths).
- `git status --short` inspected before/after; unrelated ANGEX-01–08 worktree changes preserved; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Acceptance mapping: each example lazy-loads and is tested independently (per-flow specs + `examples.spec.ts` loader resolution); fixtures are fixed UTC ISO literals with stable IDs (asserted, including `endsWith('Z')` + `Date.parse` validity); the toolbar exposes all required states and is badge/aria-labeled as catalog tooling; the only shared abstractions are the toolbar + simulator (4 consumers each) — initials helpers stay local per flow; adding a flow is one registry entry + one feature dir (proven by the 4 entries sharing one derivation path, with baseline/removal guards).
- Initials duplication (`memberInitials`/`requesterInitials`) is intentionally local per flow per working rule 5; promotion requires ANGEX-15 review.
- Pre-existing unrelated worktree change `packages/angular/projects/switch/src/lib/switch.ts` left untouched.

## Wave 4: Product-Level Examples

### Task ANGEX-10: Build Pricing And Plan Selection

Status: completed

Priority: P1

Suggested agent: responsive product UI engineer

Dependencies: ANGEX-02, ANGEX-09

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/examples/pricing/`
- Focused pricing interaction tests

Finding:

The catalog does not demonstrate how buttons, cards, badges, tabs/toggles, separators, dialogs, and form controls combine into a conversion-oriented responsive page.

References:

- `packages/angular/@examples/standard/src/app/pages/components/card/card.ts:25-157`
- `packages/angular/@examples/standard/src/app/pages/components/button/button.ts:24-99`
- `packages/angular/@examples/standard/src/app/pages/components/tabs/tabs.ts:1-35`

Implementation requirements:

1. Build a responsive pricing surface with monthly/annual billing, three differentiated plans, a highlighted recommended plan, concise feature comparison, and FAQ disclosure.
2. Make plan selection update an accessible summary and open a confirmation/details flow; do not integrate a payment provider.
3. Cover current-plan disabled behavior, enterprise contact behavior, long plan copy, and narrow-screen stacking.
4. Expose loading, configuration error, and loaded states through the shared catalog tooling.
5. Use semantic headings and list/table structures appropriate to feature comparison; do not use color alone for recommendation or current state.

Acceptance criteria:

- Billing cadence changes displayed prices and accessible context without changing deterministic fixtures.
- Current plan cannot be selected; another plan produces one visible confirmation/result.
- Keyboard and screen-reader tests cover cadence, selection, and confirmation focus.
- The page works at 320px and desktop widths without clipped pricing content.

#### Completion evidence (2026-09-06)

Changed files (all inside the owned `pages/examples/pricing/` directory; no registry edit needed — the `pricing` example entry from ANGEX-09 already exists):

- `packages/angular/@examples/standard/src/app/pages/examples/pricing/pricing-fixtures.ts`: extended the deterministic fixtures with per-plan `features` lists, `contactOnly` flag (Enterprise), `BillingCadence` type, 5-row `PRICING_COMPARISON_ROWS`, 4 `PRICING_FAQS` with stable IDs, and pure price helpers (`formatCents`, `monthlyEquivalentCents`, `unitPriceCopy`, `describeCadence`, `totalPriceCopy`). Existing IDs, UTC anchor (`2026-02-01T00:00:00.000Z`), blurbs, and cent values unchanged.
- `packages/angular/@examples/standard/src/app/pages/examples/pricing/pricing.ts`: full conversion surface from package components only (card, badge, button, separator, dialog, label, input) plus native radios/table/details. Typed reactive cadence form bridged to a `cadence` signal via `toSignal(valueChanges)`; monthly shows `$X/mo billed monthly`, annual shows the per-month equivalent billed yearly (e.g. Team `$39.00` → `$31.20/mo, billed annually ($374.40/year)`). Recommended plan carries a visible "Recommended" `hlmBadge` + sr-only text (not color alone); Starter's button is disabled with "Current plan" text + `aria-describedby` note; Enterprise is contact-only (visible `mailto:` link, click records an inquiry outcome, never opens the dialog). Team opens a `PlanConfirmDialog` (typed seats form, min 1/max 1000) whose confirm records exactly one `role="status"` confirmation; cancel records none. Billing summary, selection summary, and confirmation are `aria-live` regions. Comparison is a captioned table with `scope` headers; FAQ uses native `details`/`summary`. Loading/empty/error/loaded states stay on the shared toolbar + simulator.
- `packages/angular/@examples/standard/src/app/pages/examples/pricing/pricing.spec.ts`: 7 ANGEX-09 specs updated/extended to 13 — cadence changes prices + live-region context with fixtures deep-equal before/after; keyboard focus + activation of the cadence radios; current-plan disabled behavior; dialog open with in-overlay focus + single confirmation containing the computed total; seats validation keeps the dialog open; cancel records nothing; enterprise contact produces one inquiry result with no dialog; read-only disables both mutation buttons; simulator reload still honors failure.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; `Prerendered 77 static routes`). Two compile errors found and fixed first: `toSignal` must import from `@angular/core/rxjs-interop` (not `@angular/core`), and the current-plan button needs `[disabled]="true"` (bare `disabled` fails the `HlmButton` boolean input type).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 266 of 266 SUCCESS`; `test:ci: 266 specs executed.` (was 260; 13 pricing specs replace the prior 7). Two intermediate runs showed only the known-flaky ANGEX-06 drawer/alert-dialog overlay timing specs (jasmine 5s timeouts, documented under ANGEX-07/08/09); they pass on rerun with identical code — no pricing spec ever failed except one first-run keyboard assertion that dispatched a synthetic ArrowRight `KeyboardEvent` (untrusted synthetic key events do not drive native radio-group arrow behavior); it was rewritten to focus + activation, which is the keyboard path the page owns.
- `pnpm --dir packages/angular/@examples/standard smoke:deploy` (after replicating the CI fallback copies locally) → exit 0: `74 registry routes verified`, including `example deep link /examples/pricing loads`.
- `git status --short` inspected before/after; only the three owned files changed; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Acceptance mapping: cadence radio switch rewrites every price + the `billing-summary` live region while `EXAMPLE_PLANS` stays deep-equal; Starter's disabled button cannot produce a result; Team's dialog confirm and Enterprise's contact each produce exactly one `confirmation-result`; focus/keyboard/live-region assertions cover cadence, selection, and dialog; 320px stacking (single-column grid, `min-w-0`/`break-words`, wrapping comparison table) passes the shared geometric responsive suite and the per-example narrow-viewport checks.

### Task ANGEX-11: Build Customer Or Team-Member Management

Status: completed

Priority: P1

Suggested agent: Angular data-management UI engineer

Dependencies: ANGEX-03, ANGEX-09

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/examples/team-management/`
- Focused management-flow tests

Finding:

The existing table page is presentational: filter, create, export, row actions, pagination, empty results, permissions, and destructive flows are not demonstrated together.

References:

- `packages/angular/@examples/standard/src/app/pages/components/table/table.ts:28-163`
- `packages/angular/@examples/standard/src/app/pages/components/dropdown-menu/dropdown-menu.ts:1-65`
- `packages/angular/@examples/standard/src/app/pages/components/alert-dialog/alert-dialog.ts:13-27`

Implementation requirements:

1. Build a responsive customer or team-member list with search, status/role filtering, pagination, row actions, and invite/create workflow.
2. Compose table, input/input-group, select, badge, avatar, dropdown menu, dialog/sheet, pagination, skeleton, empty, alert, and confirmation components where appropriate.
3. Include loaded, loading, empty, no-search-results, recoverable error, read-only user, and destructive removal states.
4. Keep filtering/pagination deterministic and reset page position when filters make the current page invalid.
5. Require explicit confirmation for destructive actions and expose a visible success/undo outcome without console-only state.

Acceptance criteria:

- Search, filters, pagination, invitation, role change, and removal have observable tested outcomes.
- Empty dataset and zero filtered results have distinct copy and recovery actions.
- Read-only users cannot invoke mutation actions through alternate row/menu paths.
- Narrow layouts provide an accessible alternative to an unusably compressed data table.

#### Completion evidence (2026-09-06)

Changed files (all inside the owned `pages/examples/team-management/` directory; no registry edit needed — the `team-management` example entry from ANGEX-09 already exists):

- `packages/angular/@examples/standard/src/app/pages/examples/team-management/team-management-fixtures.ts`: expanded the deterministic fixtures from 4 to 8 members (stable IDs, fixed UTC ISO dates, varied name lengths; Admin 2 / Member 4 / Viewer 2, Active 4 / Invited 2 / Suspended 2) plus `TEAM_PAGE_SIZE = 3`, `STATUS_FILTERS`/`ROLE_FILTERS`/`MEMBER_ROLES` vocabularies, `INVITED_MEMBER_JOINED_AT_ISO` fixed stamp, and pure `filterMembers`/`slugifyMemberId` helpers. Existing IDs, dates, and initials behavior unchanged.
- `packages/angular/@examples/standard/src/app/pages/examples/team-management/team-management.ts`: full roster flow from package components only (table, input-group search, native-select filters, badge statuses, avatar initials fallbacks, dropdown row menus, invite + role-change dialogs, pagination, skeleton loading, empty states, basic-alert error, confirmation service) plus a colocated `MemberActionsMenu` (view details / change role / remove, mutation items disabled in read-only) shared by the desktop table (`tw:hidden md:tw:block`) and the narrow-screen stacked cards (`md:tw:hidden`). Typed reactive filter form bridged to signals resets to page 1 on any filter change; removal clamps an invalidated page; `isActive` drives the package pagination current state; invite lands on the new member's page when visible under the active filters; removal requires `EgConfirmationDialogService` confirmation and records one `role="status"` outcome with single-use Undo; details/role/invite outcomes are visible text (no console-only state); read-only guards every handler as well as every trigger. Loading/empty/error/loaded previews stay on the shared toolbar + simulator.
- `packages/angular/@examples/standard/src/app/pages/examples/team-management/team-management.spec.ts`: 7 ANGEX-09 specs replaced with 18 — registry lazy-load, h2-first/no-h1/no-skip, fixture determinism (8 IDs, UTC `Z`, initials, `PAGE_SIZE`), toolbar + all four preview states, search/name-email filtering, status/role filtering with pure-helper cross-check, filter-invalidates-page reset, deterministic pagination with `aria-current`, validated invite dialog (open focus, per-field errors, invalid-email retry, single outcome on the new member's page, cancel records nothing), details outcome, role-change dialog (focus, single outcome, visible roster update), rejected vs accepted removal with single-use undo, distinct empty-dataset vs no-results copy with per-state recovery, read-only blocking of invite/menu/direct-call paths, stacked-cards narrow alternative, simulator reload honoring failure.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; `Prerendered 77 static routes`). One strict-template error fixed first (`valueChanges` partials normalized through a computed). The 1.11 kB initial-budget WARNING is pre-existing: a stub-page rebuild shows 701.19 kB vs 701.11 kB with the real page (the flow ships in its own lazy chunk).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 277 of 277 SUCCESS`; `test:ci: 277 specs executed.` (was 260; 18 team-management specs replace the prior 7, plus parallel Wave 4 growth elsewhere). Two intermediate runs showed only the known-flaky ANGEX-06 drawer/alert-dialog overlay timing specs (jasmine 5s timeouts, documented under ANGEX-07/08/09); they pass on rerun with identical code. Two more intermediate runs failed to load spec bundles with chunk-fetch errors after repeated build/test cycles; clearing the gitignored `.angular/cache` restored green runs — environment/cache flakiness, no source change.
- `pnpm --dir packages/angular test:example-boundary` → 5/5 pass (new files import only public subpaths + relative paths).
- `pnpm --dir packages/angular/@examples/standard smoke:deploy` (after the CI-identical fallback copies) → exit 0: `74 registry routes verified`, including `example deep link /examples/team-management loads`.
- `git status --short` inspected before/after; only the three owned files changed; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Acceptance mapping: search, both filters, pagination, invite, role change, removal, and details each produce exactly one visible `role="status"` outcome; empty (`empty-members`: "Workspace member list is empty" + invite/restore) vs no-results (`no-results`: "No members match these filters" + clear) copy and recovery are distinct and asserted mutually exclusive; read-only disables the invite button, both surfaces' menu triggers, and every menu mutation item, with programmatic guards proven by direct calls; narrow screens render the same members/actions as stacked cards while the table wrapper carries `tw:hidden md:tw:block` (geometric 320px suite passes via `examples.spec.ts`).
- Menu auto-dismiss on item selection is package-owned CDK behavior (identical in the package's own dropdown-menu demo): the menu pane lingers after selection in this tree, so the specs locate dialogs across stacked overlay panes instead of asserting dismissal. No package file was changed.
- Pagination uses the package-blessed `isActive` input (which owns `aria-current`/`data-active`) rather than a call-site `attr.aria-current` that the directive overrides.
- Failure-mode proof: spying `EgConfirmationDialogService` to resolve `false` keeps the member with no outcome; resolving `true` removes with undo; undo restores the exact member and is single-use.

### Task ANGEX-12: Build Account And Workspace Settings

Status: completed

Priority: P1

Suggested agent: Angular forms and settings UX engineer

Dependencies: ANGEX-03, ANGEX-09

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/examples/settings/`
- Focused settings tests

Finding:

Form controls are mostly shown individually or in one oversized onboarding form. The catalog lacks a realistic settings architecture with section navigation, dirty state, validation, save feedback, permissions, and a danger zone.

References:

- `packages/angular/@examples/standard/src/app/pages/components/form-field/form-field.ts:123-276`
- `packages/angular/@examples/standard/src/app/pages/components/form-text-input/form-text-input.ts:8-18`
- `packages/angular/@examples/standard/src/app/pages/components/form-checkbox/form-checkbox.ts:1-20`

Implementation requirements:

1. Build profile, workspace, notifications, and danger-zone sections using typed reactive forms and reusable local section framing.
2. Demonstrate initial values, dirty-state navigation warning, field and form-level errors, saving, save failure/retry, and successful reset.
3. Include a read-only member state that explains why restricted controls are unavailable.
4. Keep destructive workspace actions visually and semantically separate and require typed or explicit confirmation.
5. Avoid one giant component: colocate section components and types while keeping shared form state ownership clear.

Acceptance criteria:

- Save is enabled only for valid, changed data and exposes pending/success/failure state.
- Rejecting reset/destructive confirmation preserves values; accepting it performs the documented action.
- Section navigation and validation errors are keyboard and screen-reader discoverable.
- Shared settings section framing is reused without abstracting package controls away from examples.

#### Completion evidence (2026-09-06)

Changed files (all inside the owned `pages/examples/settings/` directory; no registry edit needed — the `settings` example entry from ANGEX-09 already exists):

- `packages/angular/@examples/standard/src/app/pages/examples/settings/settings-fixtures.ts`: kept the deterministic snapshot (fixed UTC `2026-01-20T10:00:00.000Z` stamp, stable IDs) and added colocated contracts — `SETTINGS_SECTIONS` (profile/workspace/notifications/danger-zone, ids double as anchors), `SETTINGS_TIMEZONES`, `SETTINGS_PLANS`, fixed `SETTINGS_SAVED_AT_ISO` success stamp (never current time), `SETTINGS_SLUG_PATTERN`, and `ProfileFormValue`/`WorkspaceFormValue`/`NotificationFormValue` typed contracts.
- `packages/angular/@examples/standard/src/app/pages/examples/settings/settings.ts`: page owns all shared form state (three typed non-nullable reactive forms, saved snapshot signal, save lifecycle, section nav, outcomes); four colocated section components each edit only their received form group — reusable local `SettingsSectionComponent` framing (projected content only, package controls stay visible at every call site) plus `ProfileSettingsSectionComponent`, `WorkspaceSettingsSectionComponent`, `NotificationSettingsSectionComponent`, and a visually/semantically separate `DangerZoneSectionComponent` (`role="region"`, rose-bordered, destructive actions only). Save is disabled unless data is dirty, valid, non-pending, and non-read-only; save runs through the shared simulator (10ms fixed latency) with pending (`role="status"`) → success (single visible outcome) / failure (`role="alert"` + Retry). Dirty edits raise a `role="status"` unsaved-changes warning; section-nav clicks while dirty require `EgConfirmationDialogService` confirmation (reject stays + preserves, accept discards + moves + focuses the section heading); Discard is confirmation-guarded the same way. Field errors sit next to their package controls with `aria-invalid`/`aria-describedby`; a `role="alert"` form-level summary lists failing sections once a control is touched. Read-only previews lock every control programmatically via an effect (plus disabled buttons and a member-state explanation: members cannot change settings, ask an admin). Leave requires explicit confirmation; Delete requires a typed-slug dialog whose submit stays disabled until the slug matches exactly (cancel/mismatch preserves everything; confirm restores fixtures with a visible outcome). Dirty/validity state is exposed through `computed` signals fed by a form-events version counter, so zoneless change detection re-renders deterministically.
- `packages/angular/@examples/standard/src/app/pages/examples/settings/settings.spec.ts`: 7 ANGEX-09 specs replaced with 19 — registry lazy-load, h2-first/no-h1/no-skip, fixture determinism, toolbar + four preview states, framing reuse (4 sections, package controls visible), nav landmark/`aria-current`/keyboard reachability, save-disabled-until-dirty, pending→success with dirty reset, email + slug field/form-level errors with save disabled, save failure→retry→success, discard reject/accept, dirty-nav reject/accept, pristine nav without confirmation, read-only lock of every mutation path (buttons, inputs, and direct programmatic calls) with member explanation, danger-zone separation + leave reject/accept, typed-delete mismatch/cancel preservation and match execution with in-dialog focus, simulator reload honoring failure.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; `Prerendered 77 static routes`; only the pre-existing initial-budget WARNING).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0; `Executed 289 of 289 SUCCESS`; `test:ci: 289 specs executed.` (was 277; 19 settings specs replace the prior 7).
- `pnpm --dir packages/angular test:example-boundary` → 5/5 pass (new files import only public subpaths + relative paths).
- `git status --short` inspected before/after; only the three owned files changed; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Acceptance mapping: Save enables only for dirty + valid data and surfaces pending/success/failure regions; rejecting discard/nav/leave/delete confirmations preserves every value (asserted), accepting performs the documented reset/move/outcome; nav is a labeled `nav` landmark of buttons with `aria-current`, section headings are focus targets, errors use `aria-invalid`/`aria-describedby` + a `role="alert"` summary; one local framing component serves all four sections while inputs/selects/checkboxes/buttons render from package components at each call site.
- Failure-driven fix: the first full-suite run exposed a real zoneless staleness bug (plain-method `isDirty()` left a stale dirty warning after an awaited discard even though the model matched). Fixed by deriving dirty/validity through `computed` signals fed by a form-`events` version counter — the same signal-driven convention the pricing/team flows use — and re-verified green; no test was weakened (the assertion that caught it still asserts DOM absence).
- Intermediate runs showed only pre-existing environment flakiness (known-flaky ANGEX-06 drawer overlay jasmine timeouts, Karma chunk-fetch `Failed to fetch dynamically imported module` errors, and browser disconnects, all documented under ANGEX-07/08/09/11); clearing the gitignored `.angular/cache` and rerunning with identical code yields the green 289/289 above — no settings spec ever failed for an overlay/timing reason.

### Task ANGEX-13: Build Support Inbox And Ticket Handling

Status: completed

Priority: P2

Suggested agent: Angular responsive workflow engineer

Dependencies: ANGEX-09

Primary ownership:

- `packages/angular/@examples/standard/src/app/pages/examples/support-inbox/`
- Focused support-flow tests

Finding:

Sidebar, resizable panels, scroll area, badges, command/search, textarea, attachments/actions, and empty states are never composed into a dense but realistic responsive workflow.

References:

- `packages/angular/@examples/standard/src/app/pages/components/sidebar/sidebar.ts:1-242`
- `packages/angular/@examples/standard/src/app/pages/components/resizable/resizable.ts:1-39`
- `packages/angular/@examples/standard/src/app/pages/components/scroll-area/scroll-area.ts:1-35`
- `packages/angular/@examples/standard/src/app/pages/components/textarea/textarea.ts:19-55`

Implementation requirements:

1. Build a ticket list/detail/reply flow with status and assignee filters, selected-ticket state, timeline, reply composer, and resolve/reopen actions.
2. Use a desktop split view and an accessible small-screen list-to-detail flow; do not merely squeeze resizable panels onto mobile.
3. Include loading, empty inbox, zero filtered results, ticket-load error, read-only agent, and reply failure/retry states.
4. Keep fixtures deterministic and sanitize/render reply text as text; do not introduce arbitrary HTML rendering.
5. Preserve focus when selecting tickets, returning to the mobile list, and completing actions.

Acceptance criteria:

- Selection, filtering, reply, retry, resolve, and reopen behavior have visible tested outcomes.
- Mobile users can move list-to-detail-to-list without losing context or keyboard focus.
- Empty inbox and no matches are distinct, and read-only agents cannot submit through another control path.
- The workflow uses package primitives without creating a second private design system.

#### Completion evidence (2026-09-06)

Changed files (all inside the owned `pages/examples/support-inbox/` directory; no registry edit needed — the `support-inbox` example entry from ANGEX-09 already exists):

- `packages/angular/@examples/standard/src/app/pages/examples/support-inbox/support-inbox-fixtures.ts`: extended the deterministic shell fixtures into a full ticket model — `TicketAssignee`/`StatusFilter`/`AssigneeFilter` vocabularies, `TicketMessage` (stable IDs, fixed UTC ISO stamps, varied lengths), per-ticket `assignee`/`description`/`messages`, `REPLY_SENT_AT_ISO` fixed reply stamp (never current time), `REPLY_FAILURE_MESSAGE`, pure `filterTickets` helper, and one seeded message containing markup-looking text (`announces <b>every</b> keystroke`) to prove text-only rendering. Existing IDs, UTC dates, subjects, and initials behavior unchanged.
- `packages/angular/@examples/standard/src/app/pages/examples/support-inbox/support-inbox.ts`: full inbox flow from package components only (badge, button, avatar initials fallbacks, native-select filters, textarea composer, label, skeleton loading, empty states, basic-alert error) plus native list/detail semantics. Desktop renders a list/detail split grid (`md:tw:grid-cols-[minmax(0,300px)_minmax(0,1fr)]`); small screens get a `mobileView` list-to-detail-to-list flow (both panes stay in the DOM, CSS decides visibility, back control is `md:tw:hidden`). Typed reactive filter form (status + assignee) bridged to signals via `toSignal(valueChanges)`; selection falls back to the first visible ticket when filters invalidate it. Timeline renders bodies by interpolation only (never innerHTML). Typed reactive reply form (required/min 2/max 2000) sends through the shared simulator (10ms fixed latency) with a fixed reply stamp and stable `reply-N` message IDs; `Simulate reply failure` preserves the draft behind a `role="alert"` + Retry control. Resolve/reopen record single `role="status"` outcomes; resolved tickets lock the composer with an explanation (locked state applied through the FormControl itself, not a template disabled binding, per reactive-forms guidance). Selection focuses the detail heading, back-to-list refocuses the originating ticket button (stable `id`s), reply keeps focus on the composer, and resolve/reopen move focus to the detail heading — all via deferred `focusAfterRender`. Read-only disables textarea (control-level), send, retry, and resolve/reopen with the shared explanation, and every handler guards programmatically. Loading/empty/error/loaded previews stay on the shared toolbar + simulator.
- `packages/angular/@examples/standard/src/app/pages/examples/support-inbox/support-inbox.spec.ts`: 7 ANGEX-09 specs replaced with 18 — registry lazy-load, h2-first/no-h1/no-skip, fixture determinism (IDs, UTC `Z`, varied lengths, pure-helper cross-check over every filter combination, initials), toolbar + all four preview states, status filtering, assignee filtering, selection with timeline + `aria-current` + heading focus, responsive split-view contract markers, reply validation with no timeline change, reply success (timeline append + single outcome + cleared draft + composer focus), text-as-text proof (markup reply renders with no `b` element; seeded markup message likewise), failure→draft-preserved→retry→success, resolve under an active filter (ticket leaves the filter, selection falls back, heading focus), reopen with composer lock/unlock, distinct empty-inbox vs no-matches copy with per-state recovery, mobile list→detail→list focus with preserved selection, read-only blocking of composer/retry/resolve/reopen (DOM + direct calls), simulator reload honoring failure.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0 (production, strict templates; `Prerendered 77 static routes`; only the pre-existing initial-budget WARNING).
- `pnpm --dir packages/angular/@examples/standard test:ci` → 298/300 with only the known-flaky ANGEX-06 drawer/alert-dialog overlay timing specs failing (jasmine 5s async timeouts, documented under ANGEX-07/08/09/11/12); both pass in isolation (17/17 semantics-audit) with identical code, and no support-inbox spec appears in any full-run failure list. One run additionally showed the documented Karma browser-disconnect flake (`no message in 30000 ms`) after 297 specs.
- Isolated: support-inbox 18/18 SUCCESS; semantics-audit 17/17 SUCCESS.
- `pnpm --dir packages/angular test:example-boundary` → 5/5 pass (new files import only public subpaths + relative paths).
- `pnpm --dir packages/angular/@examples/standard smoke:deploy` (after the CI-identical fallback copies) → exit 0: `74 registry routes verified`, including `example deep link /examples/support-inbox loads` (covered by the registry-derived example check).
- Failure-mode proof: temporarily changed `ticket-1040` status `Open` → `Pending` → isolated inbox run failed exactly on the status-filter and resolve specs (2 FAILED); reverted and re-verified 18/18 green.
- `git status --short` inspected before/after; only the three owned files changed; no `CHANGELOG.md` edits; no commits; no `dist/`/`.angular`/coverage tracked changes.

Notes:

- Acceptance mapping: status/assignee filtering, selection, reply, retry, resolve, and reopen each produce exactly one visible outcome; mobile select→detail→back keeps `aria-current` selection and moves focus heading→ticket-button (asserted via `document.activeElement`); `Inbox zero` (toolbar empty preview) vs `No tickets match these filters` (loaded-view filter outcome) copy and recovery are distinct and asserted mutually exclusive; read-only disables the composer, send, retry, and resolve/reopen buttons and all four handlers return early on direct calls; all UI comes from package primitives (`hlmBadge`, `hlmButton`, `hlm-avatar`, `hlm-native-select`, `hlmTextarea`, `hlmLabel`, `hlm-skeleton`, `hlmEmpty*`, `eg-basic-alert`) with no local design system.
- Failure-driven fixes: the first full-suite run exposed three real defects — (1) `[disabled]` template binding on the reactive-form textarea was overridden by the forms directive (plus the Angular disabled-with-reactive-forms warning), fixed by syncing the locked state through the FormControl in an `effect`; (2) `backToList` focused via `getElementById` but ticket buttons had only `data-testid`, fixed with stable `id` attributes; (3) reply/resolve specs clicked actions while the detail pane was CSS-hidden at the narrow Karma width so focus could not land, fixed by following the real user flow (select → act) in the specs. No test was weakened — the assertions that caught each defect still assert the same DOM/focus state.
- Pre-existing unrelated worktree changes (ANGEX-01–12 files and all other uncommitted Wave work) left untouched.

## Wave 5: Documentation And Independent Integration

### Task ANGEX-14: Replace Boilerplate With Consumer And Contributor Guidance

Status: completed

Priority: P2

Suggested agent: Angular technical documentation engineer

Dependencies: ANGEX-07, ANGEX-08, ANGEX-09

Primary ownership:

- `packages/angular/@examples/standard/README.md`
- `packages/angular/@examples/standard/src/index.html`
- User-facing catalog descriptions where needed

Finding:

The README reports the wrong CLI version, documents unsupported or non-repository commands, and explains neither the package variant, source-alias model, registry, tests, deployment routing, nor how to add a demo. The browser title is only `Angular`.

References:

- `packages/angular/@examples/standard/README.md:1-55`
- `packages/angular/@examples/standard/package.json:4-18`
- `packages/angular/@examples/standard/src/index.html:5-6`

Implementation requirements:

1. Document repository-local install, start, build, test, and any new quality commands exactly as implemented.
2. Explain source integration versus exact-tarball validation and the plain versus `-tw` prefix semantics.
3. Document the typed registry and directory conventions for component and real examples.
4. Document deterministic fixtures, interaction/accessibility expectations, and the rule against no-op primary actions.
5. Document the selected deployment/deep-link strategy and hosting base path.
6. Replace generic app title/description metadata with accurate catalog wording. Remove `ng e2e` unless a real target is introduced.

Acceptance criteria:

- Every documented command exists and succeeds in its stated environment.
- A contributor can add one component demo or one real example without conversation history or discovering a second registry.
- README wording does not claim source aliases validate the published artifact.
- Browser metadata names the Angular theme example and describes its purpose.

#### Completion evidence (2026-09-06)

Changed files (isolation: only `README.md`, `src/index.html`; no catalog
description edits needed — page copy was already normalized under
ANGEX-05/06):

- `packages/angular/@examples/standard/README.md` (rewritten, was Angular
  CLI 20 boilerplate): repo-local install (`pnpm --dir packages/angular
install` + `install:browser`/`CHROME_BIN` browser prerequisite),
  start/build/test (`start`, `build`, `test`, `test:ci` with zero-spec
  guard), quality commands (`sync:aliases`, `smoke:deploy`,
  package-level `test:example-boundary`/`test:variants`/`verify:consumers`),
  CI ordering from `test.yml`; source-alias integration vs exact-tarball
  validation (aliases are fast dev only, never an artifact claim);
  plain vs `-tw` prefix semantics; typed registry
  (`catalog/catalog.ts`) + directory conventions with add-one-demo /
  add-one-example recipes; deterministic fixtures, labeling, real-route,
  and no-op-primary-action rules; registry-derived prerendering +
  shell-copy fallback deployment contract with `pages-angular` root
  hosting and `base href /`. No `ng e2e` section — `angular.json` has no
  e2e target.
- `packages/angular/@examples/standard/src/index.html`: `<title>Angular`
  → `Angular shadcn-theme example` + `meta[name=description]` naming the
  component-demo catalog and product-flow purpose.

Commands run and results (serial):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0
  (production, strict templates; only the pre-existing initial-budget
  WARNING, 701.86 kB vs 700 kB).
- `pnpm --dir packages/angular/@examples/standard test:ci` → first run
  298/300 with only the known-flaky ANGEX-06 drawer/alert-dialog overlay
  timing specs (jasmine 5s timeouts, documented under
  ANGEX-07/08/09/11/12/13); rerun with identical code → exit 0,
  `Executed 300 of 300 SUCCESS`. No ANGEX-14-touched path involved.
- `pnpm smoke:deploy` (after replicating the CI fallback copies locally)
  → exit 0: `74 registry routes verified`.
- `pnpm sync:aliases` → exit 0, idempotent (no new worktree changes vs
  baseline status).
- `pnpm --dir packages/angular test:example-boundary` → pass.
- `git status --short` inspected before/after; unrelated ANGEX-01–13
  worktree changes preserved; no `CHANGELOG.md` edits; no commits; no
  `dist/`/`.angular`/coverage tracked changes.

Notes:

- Acceptance mapping: every documented command was run from its stated
  directory and succeeds; contributor recipes need only one registry entry
  - one file/directory (no second registry exists); README states
    explicitly that source aliases do not validate the published artifact;
    browser title/description name the Angular theme example and its
    purpose.

### Task ANGEX-15: Perform Independent Integration And Product Review

Status: completed

Priority: P0

Suggested agent: independent Angular reviewer who did not implement ANGEX-01 through ANGEX-14

Dependencies: ANGEX-01, ANGEX-02, ANGEX-03, ANGEX-04, ANGEX-05, ANGEX-06, ANGEX-07, ANGEX-08, ANGEX-09, ANGEX-10, ANGEX-11, ANGEX-12, ANGEX-13, ANGEX-14

Primary ownership:

- Review-only across all changed example, package, workflow, and documentation files
- Minimal integration fixes assigned separately if findings are confirmed

Finding:

The plan crosses app routing, package layout behavior, CI, deployment, and four parallel feature directories. Independent integration is required to catch contract drift, merge artifacts, inaccessible alternate paths, and abstractions that became broader than their evidence.

References:

- This task document and completion evidence appended to ANGEX-01 through ANGEX-14

Implementation requirements:

1. Verify every acceptance criterion against runtime behavior rather than relying only on implementation notes.
2. Review keyboard navigation, focus restoration, accessible names/descriptions, landmarks, heading order, zoom, contrast, reduced motion, and 320px/768px/desktop rendering.
3. Verify permissions and destructive actions across direct buttons, menus, keyboard paths, and dialogs.
4. Verify public imports, source aliases, built declaration/export behavior, docs, and both package variants agree.
5. Confirm no example depends on live services, current time, random data, private package files, parent `node_modules`, or unbounded fixture collections.
6. Run targeted checks after each fix, package-level checks for package changes, exact-artifact consumer checks, then the full serial example build/test gate.
7. Record deferred work with rationale and residual risk; do not mark this task complete around a failed check or undocumented environment blocker.

Acceptance criteria:

- Every prior task has completion evidence with changed files, commands, and results.
- All registered routes resolve, unknown routes recover intentionally, and deployed deep-link smoke checks pass.
- Example tests and production build pass; package test/public API/variant/artifact checks pass when package files changed.
- No P0/P1 accessibility, correctness, registry, dependency, or deployment finding remains unresolved.
- Shared abstractions have multiple justified consumers and feature-specific code remains encapsulated.

#### Completion evidence (2026-09-06)

Reviewer role: independent (did not implement ANGEX-01..14). `git status
--short` inspected first; no reset/commit performed; no `CHANGELOG.md`
edits; no source files changed by this review (verification runs only;
gitignored `.angular/` cache cleared once, `dist/` + `release/` outputs
are ignored build artifacts).

Verification matrix (acceptance criteria checked against runtime
behavior, not notes):

- ANGEX-01 — PASS. `build` succeeds with strict templates (the two
  reviewed API mismatches would still fail `ng build`). `test:ci`
  executes 300 specs with a zero-spec guard; example build+test run in
  the Angular PR job before release checks (`test.yml:151-159`); browser
  prerequisite documented in README.
- ANGEX-02 — PASS. `app.html` contains zero `<main>`; `layout.html`
  contains exactly one. Both triggers carry `aria-label` (overridable
  inputs with package defaults), live `aria-expanded`, and
  `aria-controls`; single 767.98px breakpoint drives observer + Tailwind
  `md` classes; layout spec 13/13 via `test:libraries`.
- ANGEX-03 — PASS. Reset/confirmation, typed dialog contracts,
  observable async save, age 120 alignment, real dialog/sheet forms all
  covered by colocated behavior specs, green in the 300/300 run.
- ANGEX-04 — PASS. One registry (`catalog.ts`, 70 component + 4 example
  entries) derives routes, menu groups, search, and counts. Child + root
  wildcards render the accessible not-found page (asserted rendered in
  headless Chrome); all 74 registered URLs resolve; duplicate/removal
  contract specs present.
- ANGEX-05 — PASS. `app-demo-header` (74 consumers), `app-demo-section`
  (10), `app-demo-matrix` (2) project content only. Heading suite (69
  pages: one `h2` first, no `h1`, no skips) and geometric 320px suite
  (69 pages) pass; table is the one declared intentional horizontal-scroll
  demo.
- ANGEX-06 — PASS. No `href="#"` in pages (only assertion text in the
  audit spec); no `console.log` outcomes; icon-only controls named;
  navigation uses real `routerLink`/explicit `https://`; GitHub opens the
  real repo URL externally; menubar triggers explicitly demo-only
  disabled. Keyboard/focus asserted via `document.activeElement`.
- ANGEX-07 — PASS. Example manifest declares all direct runtime imports;
  `sync:aliases` rerun is idempotent (71 aliases, no new worktree diff);
  boundary spec + `test:example-boundary` 5/5 reject `src/lib`/`dist`/
  `-tw`/parent-`node_modules` imports (grep confirms none in `src/`);
  plain vs `-tw` prefix identity proven by `verify:consumers`.
- ANGEX-08 — PASS. `menu` demo exists (public exports only); `utils`
  covered by focused spec with no contrived route. Registry-derived
  prerender (77 routes, 0 NG0201) + CSR-shell fallback copies
  (`index.html`, `404.html`, `components/index.html`,
  `examples/index.html`, `.nojekyll`); `smoke:deploy` verifies 74
  registry routes.
- ANGEX-09 — PASS. Four colocated `pages/examples/<slug>/` flows; shared
  surface is exactly the toolbar + `simulateExampleLoad` (4 consumers
  each); initials helpers stay local. Fixed UTC ISO stamps, stable IDs,
  explicit failure controls; no `Date.now()`/`Math.random`/live fetch in
  example sources.
- ANGEX-10 — PASS. Pricing cadence rewrites prices + live summary with
  fixtures deep-equal; current-plan disabled; Team dialog confirm and
  Enterprise `mailto:` inquiry each record exactly one outcome; read-only
  gates mutations.
- ANGEX-11 — PASS. Search/status/role filters, pagination with page
  reset/clamp, invite/role/remove dialogs each produce one visible
  outcome; empty vs no-results copy distinct; destructive removal needs
  confirmation with single-use undo; read-only disables all mutation
  paths (triggers + programmatic guards); stacked cards serve narrow
  screens.
- ANGEX-12 — PASS. Save enabled only when dirty + valid + non-pending +
  non-read-only; pending→success/failure→retry regions; reject/accept
  semantics for discard/nav/leave/typed-delete all preserve or act as
  documented; nav is a labeled landmark with `aria-current`; errors use
  `aria-invalid`/`aria-describedby` + `role="alert"` summary.
- ANGEX-13 — PASS. Filter/selection/reply/retry/resolve/reopen each
  produce one outcome; reply text renders by interpolation only (seeded
  markup message proves no element injection); mobile list→detail→list
  preserves selection and moves focus heading→ticket→heading; resolved
  tickets lock the composer; read-only blocks all four mutation paths.
- ANGEX-14 — PASS. README documents only implemented repo-local commands
  (all re-run successfully here), source-vs-tarball boundary, prefix
  semantics, registry recipes, deterministic-fixture rules, and the
  prerender+fallback deployment contract; title is `Angular shadcn-theme
example` with an accurate description; no `ng e2e`.

Accessibility/integration sweep: one `<main>` + header/nav/footer
landmarks; named/stateful triggers; `aria-pressed`/`aria-current`/
`aria-expanded` asserted in specs; focus restoration asserted for
dialogs, sheets, drawers, ticket selection, and settings nav; no custom
example keyframes (motion is package-owned, so no example-level
reduced-motion override is owed); decorative `text-slate-400` kickers
remain (P2 observation only, below). Zoom/320px covered geometrically;
768px/desktop boundary covered by the single-breakpoint contract.

Permissions/destructive actions: verified across buttons, menus,
keyboard, and dialogs — team removal, settings leave/delete, support
resolve/reopen, pricing selection all require explicit confirmation or
are disabled with explanation in read-only previews, with direct-call
guard specs.

Commands run and results (serial, 2026-09-06):

- `pnpm --dir packages/angular/@examples/standard build` → exit 0,
  `Prerendered 77 static routes` (only the pre-existing ~1.9 kB initial
  budget WARNING).
- `pnpm --dir packages/angular/@examples/standard test:ci` → exit 0,
  `Executed 300 of 300 SUCCESS`. Three earlier full-suite runs showed
  1–2 failures confined to the known-flaky ANGEX-06 drawer/alert-dialog
  overlay specs (`Error: Timeout - Async function did not complete
within 5000ms`, one browser DISCONNECT); the same specs pass 17/17 in
  isolation with identical code, and the green 300/300 rerun confirms
  environment load flakiness, not a regression. No review code change
  was made.
- `pnpm --dir packages/angular test:example-boundary` → 5/5 pass.
- `pnpm --dir packages/angular test:dependency-contract` →
  pass. `test:public-api` → pass. `test:variants` → 3/3 pass.
- `CHROME_BIN=<repo-local headless shell, absolute> pnpm --dir
packages/angular test:libraries` → exit 0 (bare run without
  `CHROME_BIN` fails to launch — pre-existing environment prerequisite,
  same as ANGEX-01/02).
- `pnpm --dir packages/angular/@examples/standard smoke:deploy`
  (after CI-identical fallback copies) → `74 registry routes verified`,
  0 FAILs.
- `pnpm --dir packages/angular prepare:release --version 0.0.0-angex15`
  → 71 projects per variant, both tarballs staged.
  `verify:consumers --release-dir release` → exit 0 (plain + `-tw`
  strict install, typecheck, production build, prefix-identity and SSR
  class-identity assertions, peer diagnostic).
- `sync:aliases` → idempotent, no new worktree changes.
- Forbidden-pattern grep over example `src/`: no `href="#"`, no
  `console.log` outcomes, no `Math.random`/`fetch`, no
  `src/lib`/`dist/` imports, no `innerHTML`; only legit external
  `https://`/`mailto:` links and `window.open(...'_blank','noopener')`
  for GitHub.

Deferred work / residual risks (none P0/P1):

- P2: ANGEX-06 drawer/alert-dialog overlay specs are load-sensitive
  (jasmine 5s timeout under a 300-spec full run; green on rerun and 17/17
  isolated). Consider raising the timeout or splitting the overlay suite
  if CI load grows.
- P2: decorative `text-slate-400` secondary labels (carousel/input-group/
  card captions) are below body-contrast scrutiny only for small
  secondary text; revisit if design tokens change.
- Pre-existing, untouched: stray `projects/switch` `@ts-ignore` removal
  in the worktree (predates this review; unrelated to the example),
  the ~1.9 kB initial-bundle budget WARNING, and Karma chunk-fetch /
  browser-disconnect flakes under load (clearing gitignored
  `.angular/cache` restores green runs).
- No live services, current-time, random-data, private-file, parent
  `node_modules`, or unbounded-fixture findings.

Top-level Status set to completed: all 15 tasks verified complete
above; no failed check or undocumented blocker remains.

## Dependency And Parallelization Guidance

Recommended sequence:

1. ANGEX-01 restores the baseline and gates all later work.
2. ANGEX-02 and ANGEX-03 can run in parallel after ANGEX-01 because shell/package layout files and form-demo files do not overlap.
3. ANGEX-04 should land before broad page migration or any new real-example registry entry.
4. ANGEX-05 and ANGEX-07 can run in parallel after their dependencies; they overlap only if both edit global styles, so assign `src/styles.css` to ANGEX-07 until its boundary work is complete.
5. ANGEX-06 follows demo framing and form correction to avoid editing the same component pages twice.
6. ANGEX-08 follows registry and boundary decisions because it adds a public-surface route and deployment route checks.
7. ANGEX-09 establishes the real-example directory and shared state conventions.
8. ANGEX-10, ANGEX-11, ANGEX-12, and ANGEX-13 can run in parallel with exclusive ownership of their feature directories. One integration owner serializes registry edits.
9. ANGEX-14 documents only landed behavior.
10. ANGEX-15 is an independent final review after all required tasks complete or are explicitly deferred.

Shared hotspots that require a single owner at a time:

- `src/app/app.routes.ts` and the new typed registry
- `src/app/app.ts` and `src/app/app.html`
- `src/styles.css`
- `package.json`, `packages/angular/pnpm-lock.yaml`, and install operations
- `.github/workflows/test.yml` and `.github/workflows/deploy-angular.yml`
- `projects/layout-simple/` public API and tests
- `pnpm --dir packages/angular prepare:release` and example production builds

Recommended agent allocation:

| Agent                         | Tasks                                                                | Boundary                                             |
| ----------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| Build/test owner              | ANGEX-01                                                             | Build blockers, test foundation, PR gate             |
| Accessibility owner           | ANGEX-02, then ANGEX-06                                              | Shell/package layout first, demo audit after framing |
| Forms owner                   | ANGEX-03, ANGEX-12                                                   | Existing workflow fixes, then settings feature       |
| Router/catalog owner          | ANGEX-04, registry merges for ANGEX-08 and ANGEX-10 through ANGEX-13 | Sole registry writer                                 |
| Presentation owner            | ANGEX-05                                                             | Shared demo framing and bounded migrations           |
| Package integration owner     | ANGEX-07                                                             | Manifest, aliases, lockfile, artifact boundary       |
| Deployment/catalog owner      | ANGEX-08                                                             | Menu coverage, not-found and hosting behavior        |
| Real-example foundation owner | ANGEX-09                                                             | Shared deterministic tooling only                    |
| Product-flow agents           | ANGEX-10, ANGEX-11, ANGEX-13                                         | One exclusive feature directory each                 |
| Documentation owner           | ANGEX-14                                                             | Document landed contracts only                       |
| Independent reviewer          | ANGEX-15                                                             | No primary implementation ownership                  |

## Deferred Decisions Requiring Maintainer Input

1. **GitHub Pages routing:** choose hash routing, base-href plus `404.html` fallback, or registry-derived prerendering. Recommendation: use registry-derived prerendering if Angular's configured builder supports it cleanly; otherwise use hash routing for the lowest-maintenance static-host contract.
2. **Development consumer model:** confirm source aliases remain the fast local workflow. Recommendation: keep them, but make exact tarball tests the only artifact claim.
3. **Fourth real example:** this plan selects support inbox because it exercises responsive master/detail behavior missing elsewhere. Maintainers may replace it with onboarding/authentication before ANGEX-09 finalizes shared tooling.
4. **Checkout depth:** defer a separate checkout/billing example until pricing is complete. Add it only if pricing cannot demonstrate the required plan-selection confirmation without becoming oversized.
5. **Package promotion:** keep real-example blocks local by default. Promotion into `packages/angular/projects/*` requires repeated consumer demand, a separately reviewed public API, package tests, and release documentation.

None of these decisions blocks ANGEX-01 through ANGEX-07. ANGEX-08 needs decision 1; ANGEX-09 needs decision 3 before shared tooling is finalized.

## Definition Of Done

- The production example build succeeds and pull-request CI runs its tests and build.
- All catalog and real-example routes derive from one typed registry, lazy loaders resolve, duplicates fail tests, and unknown routes recover intentionally.
- The shell has one main landmark, named/stateful navigation controls, and one responsive breakpoint contract.
- Confirmed form, overlay, link, label, and no-op action defects have regression coverage and are fixed.
- Demo framing, headings, terminology, and responsive widths are consistent without hiding package usage.
- The example declares its dependency boundary, documents source mode accurately, and validates representative imports against exact plain and `-tw` artifacts.
- Public visual subpath coverage includes `menu`; nonvisual `utils` usage is documented without a contrived gallery page.
- Pricing, team management, settings, and support inbox examples cover loaded, loading, empty, error, permission/read-only, validation, and destructive states where relevant.
- Fixtures are deterministic, no primary outcome exists only in the console, and no live external service is required.
- README, browser metadata, CI, and deployment behavior match the implemented architecture.
- ANGEX-15 independently verifies all acceptance criteria and records command output or exact blockers.
