# Angular Package Health Remediation

Created: 2026-08-23 12:35:04 local time

## Objective

Make `@egose/shadcn-theme-ng` and `@egose/shadcn-theme-ng-tw` complete, deterministic, and safe to publish. Every intended subpath must build or fail the release, declarations and runtime files must use the correct package identity, dependency metadata must support a clean consumer, and high-risk form/DOM behavior must have focused tests.

## Scope

- `packages/angular/projects/`
- Angular project/path/build configuration and `build-all.mjs`
- Plain and `tw` package generation
- Angular package metadata, tests, isolated consumers, CI, and documentation
- Angular staging/release behavior in `scripts/publish.mjs`

## Working Rules

- Do not modify React package sources or React build configuration.
- Treat `packages/angular/dist` as generated output; do not commit it.
- Never run plain and `tw` Angular bundles concurrently because both replace `dist`.
- Treat `packages/angular/libs/` as generated Spartan CLI reference material and outside this plan's implementation scope.
- Test both exact tarballs in isolated consumers without monorepo-hoisted dependencies.
- Add failing regression tests or artifact assertions before fixing confirmed behavior where practical.
- Keep public contracts, package metadata, declarations, README examples, and compatibility policy aligned.
- Preserve unrelated worktree changes and coordinate edits to shared release/CI files with the React plan.

## Baseline

- `angular.json` and `projects/` contain 71 projects, while TypeScript paths, builds, and generated exports contain 70; `menu` is omitted.
- Existing generated root exports point `types` at `./<name>/index.d.ts`, while ng-packagr emits `./<name>/types/<name>.d.ts`.
- `build-all.mjs` catches project failures and continues; its top-level catch can exit successfully.
- The `tw` build rewrites `.mjs` files but not declarations, leaving type imports aimed at the plain package.
- The published root metadata declares only two runtime dependencies despite many external imports in emitted bundles.
- No Angular library project contains a `*.spec.ts`; the sole example spec asserts stale starter content.
- Generated artifacts may be stale. Reproduce findings from clean builds before recording completion.

Baseline commands:

```bash
git status --short
pnpm --dir packages/angular bundle
pnpm --dir packages/angular bundle tw
```

These commands must run serially.

## Priority Definitions

- **P0:** broken published contract, partial publication, credential/release hazard, or missing consumer dependency
- **P1:** user-visible correctness, security boundary, missing test gate, or architectural drift
- **P2:** bounded performance, readability, API quality, or documentation issue

## Tasks

### Task ANGULAR-01: Add Exact Artifact and Project-Set Validators

Status: pending

Priority: P0

Suggested agent: Angular package test infrastructure engineer

Dependencies: none

Primary ownership:

- Angular artifact validator under `scripts/` or `packages/angular/`
- Project/config/export set fixtures
- Minimal package scripts needed to invoke validation

Finding:

No automated gate verifies set equality among projects, Angular configuration, TypeScript paths, successful builds, exports, and actual files. Current artifacts can expose 70 declaration targets that do not exist and still proceed toward publication.

References:

- `packages/angular/build-all.mjs:116-149`
- `packages/angular/angular.json:4-941`
- `packages/angular/tsconfig.json:15-87`
- `scripts/publish.mjs:176-195`

Implementation requirements:

1. Add a non-publishing validator for a staged Angular package directory.
2. Compare the canonical intended-project set with source projects, Angular config, TypeScript paths, outputs, and exports.
3. Assert every `types` and `default` export target exists.
4. Scan runtime and declaration self-imports for the expected plain or `tw` package name.
5. Reject placeholders, leaked `exports.json`, absent metadata, and unexpected package files.
6. Run `npm pack --dry-run --json` and validate the exact file list.

Acceptance criteria:

- The validator fails against the review-time invalid type targets and missing `menu` mapping.
- Fixtures with one failed/missing project, wrong package identity, or absent target fail nonzero.
- Valid plain and `tw` fixtures pass independently.
- Tests do not publish or require registry access.

### Task ANGULAR-02: Make Project Builds Complete and Fail-Fast

Status: pending

Priority: P0

Suggested agent: Angular packaging engineer

Dependencies: ANGULAR-01

Primary ownership:

- `packages/angular/build-all.mjs` project discovery, ordering, build, and export generation
- `packages/angular/tsconfig.json`
- `packages/angular/tsconfig.build.json`
- Focused build-list/failure tests

Finding:

Build membership comes from TypeScript paths, silently omitting `menu`. Per-project failures are logged and ignored, cycles are appended in arbitrary order, declaration paths are assumed incorrectly, and the top-level catch does not set a failing exit code.

References:

- `packages/angular/build-all.mjs:54-90`
- `packages/angular/build-all.mjs:116-149`
- `packages/angular/build-all.mjs:165`
- `packages/angular/projects/menu/ng-package.json:1-7`
- `packages/angular/projects/menu/src/public-api.ts:23-70`
- `packages/angular/angular.json:916-941`

Implementation requirements:

1. Define one authoritative publishable-project list and derive build membership from it.
2. Include `menu` if intended; otherwise remove it from all public config/docs after maintainer confirmation.
3. Generate declaration paths from actual ng-packagr output/metadata.
4. Detect and report dependency cycles rather than continuing in arbitrary order.
5. Aggregate failures only for diagnostics; fail before transformation/staging if any intended project fails.
6. Write the final export map once, after every target validates.
7. Ensure top-level failures exit nonzero.

Acceptance criteria:

- Every intended project builds exactly once and has valid runtime/type exports.
- Injecting one failed project makes `pnpm bundle` exit nonzero and leaves no publishable root package.
- Project, config, path, output, and export sets are equal.
- `menu` is consistently public or consistently removed.
- `pnpm --dir packages/angular bundle` and ANGULAR-01 validation pass.

### Task ANGULAR-03: Generate Correct Plain and Tailwind-Prefixed Variants

Status: pending

Priority: P0

Suggested agent: Angular build transformation engineer

Dependencies: ANGULAR-02

Primary ownership:

- `packages/angular/build-all.mjs` variant transformation
- Tailwind variant artifact/render tests
- Source-map handling for transformed output

Finding:

The `tw` build rewrites only `.mjs`, so declarations retain plain-package self-imports. Generated JavaScript is changed after source-map creation. The transformation preserves existing `tw:` tokens but does not prefix unprefixed classes, while source contains both forms; the documented variant guarantee is therefore false.

References:

- `packages/angular/build-all.mjs:151-162`
- `packages/angular/README.md:29-38`
- `packages/angular/projects/pagination/src/lib/hlm-numbered-pagination.ts:35-36`
- `packages/angular/projects/radio-group/src/lib/hlm-radio.ts:67-74`
- `packages/angular/projects/carousel/src/lib/hlm-carousel.ts:68-70`

Implementation requirements:

1. Emit declarations and runtime files with the final package identity.
2. Select one canonical class representation and use a syntax-aware/build-time variant strategy rather than blind string replacement.
3. Preserve/regenerate valid source maps or intentionally stop shipping them with documented rationale.
4. Add representative rendered/artifact tests for both plain and `tw:` configurations.
5. Stage the two variants independently so one cannot overwrite validation evidence for the other.

Acceptance criteria:

- The `-tw` tarball contains no plain-package declaration or runtime self-import.
- Representative plain components contain no unintended `tw:` utility token.
- Representative `tw` components contain no required unprefixed utility token.
- Source maps validate against transformed output or are excluded intentionally.
- Both variants pass ANGULAR-01 independently.

### Task ANGULAR-04: Declare the Complete Consumer Dependency Contract

Status: pending

Priority: P0

Suggested agent: npm and Angular dependency engineer

Dependencies: ANGULAR-02

Primary ownership:

- `packages/angular/package.json`
- Project package metadata where ng-packagr requires it
- External-import inventory and isolated consumer fixture

Finding:

The generated package declares only `embla-carousel` and `ngx-scrollbar`, while emitted modules import Angular, CDK, Spartan, ng-icons, RxJS, styling helpers, carousel integration, sonner, and other packages. Local hoisting masks the incomplete published contract.

References:

- `packages/angular/package.json:24-67`
- `scripts/publish.mjs:125-144`
- `packages/angular/projects/carousel/package.json:4-10`
- `packages/angular/projects/sonner/package.json:4-10`
- `packages/angular/projects/utils/package.json:4-10`

Implementation requirements:

1. Inventory every bare external import from emitted plain and `tw` artifacts.
2. Classify each package as dependency, peer, optional peer, or build-only dependency.
3. Declare framework/singleton packages as compatible peers and implementation-owned runtime packages as dependencies.
4. Use optional peer metadata only when unaffected entrypoints remain usable without that package.
5. Define and test one Angular/CDK/Spartan compatibility policy.
6. Validate clean tarball installs without access to monorepo `node_modules`.

Acceptance criteria:

- Every external runtime import is declared or intentionally bundled.
- Clean plain and `tw` consumers type-check and build under strict dependency resolution.
- Missing required peers produce clear installation/build diagnostics.
- Published metadata contains no build-only tools.

### Task ANGULAR-05: Secure and Stage Angular Releases Before Publishing

Status: pending

Priority: P0

Suggested agent: release security engineer

Dependencies: ANGULAR-01, ANGULAR-02, ANGULAR-03, ANGULAR-04

Primary ownership:

- Angular path through `scripts/publish.mjs`
- Release-process unit tests
- Angular package preparation documentation

Finding:

Release commands are assembled through shell interpolation, the OTP is included in the logged command, registry failures can incorrectly select `0.0.1`, and variants are published sequentially before all are validated. Top-level errors can exit successfully.

References:

- `scripts/publish.mjs:8-25`
- `scripts/publish.mjs:42-77`
- `scripts/publish.mjs:97-99`
- `scripts/publish.mjs:176-200`

Implementation requirements:

1. Use process argument arrays and `cwd`; never pass package, bundle, version, or OTP input through a shell.
2. Never log OTP values and prefer trusted publishing/OIDC as the target release model.
3. Distinguish confirmed package absence from authentication, network, timeout, registry, and malformed-response failures.
4. Separate prepare/validate/pack from publish.
5. Build and validate both Angular tarballs before publishing either one.
6. Exit nonzero for every failed build, validation, pack, or publish operation.
7. Coordinate shared `publish.mjs` edits with the React release task.

Acceptance criteria:

- A shell-like OTP test value remains one opaque argument and never appears in logs.
- Registry error paths are covered by unit tests and only confirmed absence uses the initial-version path.
- Failure of either variant prevents both publication calls.
- A non-publishing command produces both inspectable tarballs.

### Task ANGULAR-06: Add Angular Library Test Infrastructure

Status: pending

Priority: P1

Suggested agent: Angular test infrastructure engineer

Dependencies: ANGULAR-01

Primary ownership:

- Angular package test scripts and shared test setup
- Representative library test configurations
- `packages/angular/@examples/standard/src/app/app.spec.ts`

Finding:

All configured libraries have test targets, but no library contains a `*.spec.ts`. The only example spec expects an obsolete starter heading, so the existing test surface cannot protect forms, DOM cleanup, SSR, exports, or variants.

References:

- `packages/angular/package.json:17-23`
- `packages/angular/angular.json:24-29`
- `packages/angular/projects/form-text-input/tsconfig.spec.json:4-10`
- `packages/angular/@examples/standard/src/app/app.spec.ts:19-24`
- `packages/angular/@examples/standard/src/app/app.html:1-35`

Implementation requirements:

1. Establish focused component/directive/service tests for selected high-risk libraries.
2. Support SSR/hydration, DOM teardown, timers, and mutation-observer tests where required.
3. Replace stale example assertions with stable accessible shell/router behavior.
4. Keep artifact validation separate from source library tests.
5. Provide targeted per-library and aggregate package commands.

Acceptance criteria:

- A deliberately broken form binding, teardown, and export fixture fails the appropriate test.
- Selected tests run headlessly and terminate without leaked timers/subscriptions.
- The current example shell test passes and no longer checks starter text.
- Test commands are documented and suitable for CI.

### Task ANGULAR-07: Make Form Wrappers Behavioral and Hydration-Safe

Status: pending

Priority: P1

Suggested agent: Angular forms and SSR engineer

Dependencies: ANGULAR-06

Primary ownership:

- `packages/angular/projects/form-text-input/`
- `packages/angular/projects/form-textarea/`
- `packages/angular/projects/form-select/`
- `packages/angular/projects/form-checkbox/`
- `packages/angular/projects/form-date-picker/`
- `packages/angular/projects/form-searchable-multiselect/`

Finding:

Six wrappers expose a `disabled` input without applying it to the control. Checkbox control and label IDs can diverge, and default IDs are created with `crypto.randomUUID()` independently during server and client construction.

References:

- `packages/angular/projects/form-text-input/src/lib/form-text-input.ts:62-80`
- `packages/angular/projects/form-text-input/src/lib/form-text-input.ts:96-119`
- `packages/angular/projects/form-textarea/src/lib/form-textarea.ts:37-82`
- `packages/angular/projects/form-select/src/lib/form-select.ts:63-123`
- `packages/angular/projects/form-checkbox/src/lib/form-checkbox.ts:27-75`
- `packages/angular/projects/form-date-picker/src/lib/form-date-picker.ts:64-68`
- `packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.ts:67-69`

Implementation requirements:

1. Define consistent ownership between wrapper disabled input and reactive-form disabled state.
2. Bind the effective disabled state to each interactive control.
3. Compute one effective ID for control, label, and ARIA relationships.
4. Use a deterministic, application-scoped, SSR-safe ID strategy.
5. Extract shared form behavior only when it reduces duplication without obscuring templates.
6. Preserve validation, error, hint, required, and accessibility behavior.

Acceptance criteria:

- Every documented disabled path disables the actual control.
- Explicit and generated IDs keep labels and ARIA references aligned.
- Server render plus hydration produces no default-ID mismatch.
- Tests cover disabled state, explicit/generated IDs, labels, errors, and hints for each wrapper family.

### Task ANGULAR-08: Bound DOM Observation and Lifecycle Resources

Status: pending

Priority: P1

Suggested agent: Angular runtime performance engineer

Dependencies: ANGULAR-06

Primary ownership:

- `packages/angular/projects/utils/src/lib/utils.ts`
- `packages/angular/projects/layout-simple/src/lib/layout.ts`
- `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu.ts`
- `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu-sub.ts`
- `packages/angular/projects/radio-group/src/lib/hlm-radio.ts`

Finding:

Class management observes every class mutation in global `document`, creating document-wide work and singleton ownership across documents. A layout subscription lacks destruction binding, dropdown timers are not canceled, and radio label lookup interpolates public IDs into a CSS selector that can throw.

References:

- `packages/angular/projects/utils/src/lib/utils.ts:19-21`
- `packages/angular/projects/utils/src/lib/utils.ts:38-78`
- `packages/angular/projects/utils/src/lib/utils.ts:135-225`
- `packages/angular/projects/layout-simple/src/lib/layout.ts:157-165`
- `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu.ts:35-46`
- `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu-sub.ts:25-42`
- `packages/angular/projects/radio-group/src/lib/hlm-radio.ts:79-120`

Implementation requirements:

1. Observe only managed elements or replace observation with explicit host bindings.
2. Inject `DOCUMENT` and scope state per document while preserving SSR behavior.
3. Tie subscriptions, timers, observers, and animation frames to `DestroyRef`.
4. Use explicit DOM label relationships instead of constructing selectors from public IDs.
5. Measure observer callback volume before and after with a class-heavy fixture.

Acceptance criteria:

- Unrelated document class mutations do not trigger package reconciliation.
- Multiple documents do not share an invalid singleton observer.
- Destruction releases every subscription, timer, observer, and animation frame.
- Special-character IDs do not throw or select an unrelated label.
- Focused instrumentation demonstrates reduced observer work.

### Task ANGULAR-09: Align Public API Quality and Documentation

Status: pending

Priority: P2

Suggested agent: Angular package API engineer

Dependencies: ANGULAR-03, ANGULAR-04, ANGULAR-07

Primary ownership:

- `packages/angular/README.md`
- Angular per-project README policy
- `projects/*/src/public-api.ts` encapsulation review
- Public declaration typing and compatibility documentation

Finding:

Documentation advertises outdated Angular/Spartan versions and an incomplete subpath list while claiming it exactly matches exports. Generic project READMEs describe publishing secondary directories rather than the assembled root package. Wildcard exports expose internal items such as an unused arbitrary-attribute directive, and public types include avoidable `any` and naming mistakes.

References:

- `packages/angular/README.md:19-38`
- `packages/angular/README.md:71-77`
- `packages/angular/projects/form-text-input/README.md:1-60`
- `packages/angular/projects/form-text-input/src/public-api.ts:5`
- `packages/angular/projects/form-text-input/src/lib/form-text-input.ts:9-31`
- `packages/angular/projects/layout-simple/src/lib/layout.ts:14-20`
- `packages/angular/projects/confirmation-dialog/src/lib/confirmation-dialog.ts:48`

Implementation requirements:

1. Generate or validate documented subpaths from the canonical project manifest.
2. Document tested compatibility, dependencies/peers, canonical imports, and exact plain/`tw` semantics.
3. Replace misleading project boilerplate with package-specific guidance or a canonical link.
4. Prefer explicit public exports where wildcard exports expose internals accidentally.
5. Remove unused public DOM-writing helpers unless compatibility evidence requires retention.
6. Replace avoidable public `any` and correct naming defects with a semver-appropriate migration.

Acceptance criteria:

- Every documented import resolves from both applicable tarballs.
- Compatibility ranges match published metadata and tested consumers.
- Plain/`tw` examples are copy-pasteable and behaviorally accurate.
- Public declarations exclude internal-only helpers and avoidable `any` in remediated APIs.
- No README instructs consumers to publish internal build directories.

### Task ANGULAR-10: Add Isolated Consumers and Required CI Gates

Status: pending

Priority: P1

Suggested agent: Angular CI engineer

Dependencies: ANGULAR-01, ANGULAR-02, ANGULAR-03, ANGULAR-04, ANGULAR-05, ANGULAR-06, ANGULAR-07, ANGULAR-08, ANGULAR-09

Primary ownership:

- Plain and `tw` Angular consumer fixtures
- Angular jobs in `.github/workflows/test.yml`
- Angular-related setup in `.github/actions/setup-npm/action.yml`
- Root/package orchestration needed by Angular CI

Finding:

CI does not build or test Angular packages, uses non-frozen installs, and the example relies on workspace paths/dependencies rather than proving a tarball works in a clean application.

References:

- `.github/workflows/test.yml:1-29`
- `.github/actions/setup-npm/action.yml:16-38`
- `packages/angular/@examples/standard/package.json:12-18`
- `packages/angular/@examples/standard/tsconfig.json:19-91`

Implementation requirements:

1. Add pull-request and push jobs using frozen lockfiles.
2. Build and validate plain and `tw` packages serially, preserving separate artifacts.
3. Install each tarball into a fresh Angular consumer without source path aliases or monorepo hoisting.
4. Exercise representative core, form, overlay, layout, carousel, sonner, and menu imports.
5. Run project-set checks, targeted tests, package validation, consumer builds, and release-script tests as distinct steps.
6. Coordinate shared workflow/setup changes with the React CI task.

Acceptance criteria:

- CI fails for a missing project/export, invalid type target, wrong self-import, undeclared dependency, or variant-style regression.
- Frozen installs leave every Angular lockfile unchanged.
- Both clean consumers type-check and produce production builds.
- CI does not run plain and `tw` builds against the same `dist` concurrently.

### Task ANGULAR-SEC-01: Triage Angular Dependency and Supply-Chain Risk

Status: pending

Priority: P1

Suggested agent: dependency security engineer

Dependencies: ANGULAR-04, ANGULAR-10

Primary ownership:

- Angular manifest and lockfile security updates
- Angular dependency-review/audit policy
- Documented advisory exceptions

Finding:

Review-time auditing reported high and critical advisories in the Angular lock domain. No CI audit or dependency-review gate distinguishes shipped runtime exposure from build tooling and example-only dependencies.

References:

- `packages/angular/package.json:24-67`
- `packages/angular/pnpm-lock.yaml`
- `renovate.json:1-4`

Implementation requirements:

1. Re-run the audit and classify each high/critical advisory by runtime, consumer, example, build-tool, and reachability.
2. Upgrade direct dependencies first and regenerate only the intended Angular lockfile.
3. Use temporary overrides only with owner, upstream issue, expiry criteria, and tests.
4. Add pull-request dependency review and an agreed production audit threshold.
5. Keep accepted build-tool findings visible with rationale and review date.

Acceptance criteria:

- No high/critical shipped-runtime advisory remains untriaged.
- Accepted findings have an owner, rationale, affected surface, and review date.
- Frozen Angular installation passes after lockfile changes.
- Dependency review and production audit run in pull-request CI.

### Task ANGULAR-FINAL: Independently Review Both Angular Release Candidates

Status: pending

Priority: P0

Suggested agent: independent package reviewer

Dependencies: ANGULAR-05, ANGULAR-07, ANGULAR-08, ANGULAR-09, ANGULAR-10, ANGULAR-SEC-01

Primary ownership:

- Fresh plain and `tw` tarballs
- Temporary isolated consumers
- Review evidence only

Finding:

The package is assembled from many secondary projects and transformed after ng-packagr output. Source review alone cannot prove what either npm package contains.

References:

- `packages/angular/build-all.mjs:116-165`
- `scripts/publish.mjs:80-197`
- `packages/angular/package.json:1-67`

Implementation requirements:

1. Start from a clean checkout and frozen install.
2. Prepare both variants without publishing and record checksums and sizes.
3. Verify names, versions, licenses, exports, declarations, runtime imports, dependencies, package identity, source maps, and absence of placeholders/credentials.
4. Install each tarball in a clean supported Angular application.
5. Run representative type checks, production builds, SSR/hydration tests, and component tests.
6. Confirm every acceptance criterion from behavior, not completion notes.

Acceptance criteria:

- Every intended subpath has valid runtime and type targets in both applicable packages.
- No plain/`tw` cross-package self-reference remains.
- No undeclared external runtime import exists.
- Plain and prefixed consumers render representative components correctly.
- Release dry-run is fail-fast, atomic across variants, and credential-safe.
- No P0/P1 task remains incomplete or blocked.

## Parallelization

| Wave | Tasks                              | Guidance                                                                  |
| ---- | ---------------------------------- | ------------------------------------------------------------------------- |
| 1    | ANGULAR-01                         | Establish artifact and set assertions first.                              |
| 2    | ANGULAR-02                         | Own `build-all.mjs` project/build behavior.                               |
| 3    | ANGULAR-03, ANGULAR-04, ANGULAR-06 | May run in parallel; coordinate package metadata and scripts.             |
| 4    | ANGULAR-05, ANGULAR-07, ANGULAR-08 | May run in parallel; source ownership is separate.                        |
| 5    | ANGULAR-09                         | Align the public API and documentation after package contracts stabilize. |
| 6    | ANGULAR-10, ANGULAR-SEC-01         | Integrate CI first, then enforce security policy.                         |
| 7    | ANGULAR-FINAL                      | Independent serial review of fresh variant tarballs.                      |

Shared files requiring one owner at a time:

- `packages/angular/build-all.mjs`: ANGULAR-02 before ANGULAR-03
- `packages/angular/package.json`: ANGULAR-04 before ANGULAR-10/11
- `packages/angular/dist`: all bundle and artifact operations must be serialized
- `scripts/publish.mjs`: ANGULAR-05 coordinates with the React release task
- `.github/workflows/test.yml`: ANGULAR-10 coordinates with the React CI task

## Maintainer Decisions

1. Confirm whether Angular 20 remains supported alongside Angular 22.
2. Select the supported Spartan peer range.
3. Confirm whether both `menu` and `menubar` are public.
4. Confirm that both plain and `tw` packages remain required.
5. Decide whether generated source maps should ship.
6. Decide whether npm publishing moves to protected CI with trusted publishing/OIDC and provenance.

## Definition of Done

- Every P0/P1 task has completion evidence.
- Every intended project builds or fails the package command.
- All runtime/type export targets exist and use the correct package identity.
- Every runtime external is bundled or declared correctly.
- Plain and `tw` tarballs pass clean consumer checks.
- Form state, IDs, DOM observers, subscriptions, and timers have focused regression tests.
- One canonical publishable-project manifest drives paths, builds, exports, and publication.
- Pull-request CI uses frozen installs and validates both exact tarballs serially.
- High/critical dependency risk is remediated or explicitly owned and time-bounded.
- An independent reviewer records commands, checksums, sizes, and results.

## Completion Evidence Template

```markdown
Completion evidence:

- Assigned agent/session: ...
- Changed: `path`, `path`
- Verified: `exact command`
- Result: concise test/build/artifact result
- Packed artifacts: filenames and checksums, when applicable
- Follow-up: task ID or `none`
```
