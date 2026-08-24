# React Package Health Remediation

Created: 2026-08-23 12:35:03 local time

Status: completed

## Objective

Make `@egose/shadcn-theme` reliable as an installed React package. Every advertised ESM/CommonJS entry and declaration must resolve from a staged tarball, state must remain scoped to the owning component/provider, lifecycle resources must be cleaned up, and package behavior must have automated regression coverage.

## Scope

- `packages/react/components/`
- `packages/react/hooks/`
- `packages/react/layouts/`
- `packages/react/utils/`
- React package metadata, tsup configuration, generated artifact validation, tests, and consumer fixtures
- React-specific CI and documentation
- React staging behavior in `scripts/publish.mjs`, coordinated with the Angular release task

## Working Rules

- Do not modify Angular sources or Angular build configuration.
- Treat `packages/react/dist` as generated output; do not commit it.
- Test the staged package or tarball, not only workspace source imports.
- Add a failing regression test before fixing confirmed runtime behavior where practical.
- Keep public API, declarations, examples, and documentation aligned in the same task.
- Do not add a package-level `build` script; `pnpm bundle` is the package artifact command.
- Preserve unrelated worktree changes and never reset generated or source files owned by another agent.
- Coordinate changes to `scripts/publish.mjs`, root scripts, and `.github/workflows/test.yml` with the Angular plan because those are shared hotspots.

## Baseline

- `pnpm --dir packages/react exec tsc --noEmit --pretty false` passed during review.
- A review-time import sweep loaded all 111 CommonJS entries, while 25 ESM entries failed because emitted files retained extensionless `lodash-es` subpath imports.
- `packages/react/package.json` exposes only `dev`, `bundle`, and `postbundle`; there is no package-level test, lint, or artifact validation command.
- Every emitted module is currently forced across the React client boundary, including pure utilities and type-only modules.
- Generated artifacts may be stale. Rebuild before recording completion evidence.

Baseline commands:

```bash
git status --short
pnpm --dir packages/react exec tsc --noEmit --pretty false
pnpm --dir packages/react bundle
```

## Priority Definitions

- **P0:** broken published package or release-blocking artifact defect
- **P1:** user-visible correctness, state isolation, or missing test boundary
- **P2:** performance, type quality, readability, or maintainability issue

## Tasks

### Task REACT-01: Validate the Exact Published Artifact

Status: completed

Priority: P0

Suggested agent: React package test infrastructure engineer

Dependencies: none

Primary ownership:

- React artifact validator under `scripts/` or `packages/react/`
- React package-validation fixtures
- Minimal validation scripts in `packages/react/package.json`

Finding:

The package has no automated assertion that every export target exists, every ESM/CommonJS entry loads, declarations resolve, placeholders are replaced, or the npm file list matches intent. TypeScript currently passes while native ESM imports fail.

References:

- `packages/react/package.json:27-105`
- `packages/react/tsup.config.ts:46-56`
- `scripts/publish.mjs:125-195`

Implementation requirements:

1. Add a non-publishing prepare/validate path for the React `dist` package.
2. Validate every `exports` condition and reject absent targets, placeholders, leaked internal files, or missing metadata.
3. Load every runtime ESM and CommonJS entry from the staged package.
4. Resolve every declaration target from the staged package.
5. Run `npm pack --dry-run --json` and validate the actual file list.
6. Keep the validator deterministic and offline after dependencies are installed.

Acceptance criteria:

- The validator reproduces the current ESM failures before REACT-02.
- Missing runtime/type targets and placeholder metadata fail with a nonzero exit code.
- A valid staged package passes ESM, CommonJS, declaration, and file-list checks.
- Validator tests pass without publishing or contacting the npm registry.

Completion evidence:

- Assigned agent/session: `ses_fcfdaf702ffe6aYfj3rL12tI6R`
- Changed: `scripts/publish.mjs`, `packages/react/package.json`, `packages/react/scripts/validate-package.mjs`, `packages/react/scripts/validate-package.test.mjs`, `packages/react/test-fixtures/package-valid/`
- Verified: `pnpm prepare:package`; `pnpm test:package-validator`; `pnpm exec tsc --noEmit --pretty false`; `pnpm validate:package`; `npm pack --dry-run --json --ignore-scripts`
- Result: validator fixture tests passed 7/7; staged metadata, exports, declarations, runtime loading, and packed files are checked; the real artifact reproduced the expected 25 ESM failures for REACT-02
- Packed artifact: dry-run manifest validated 786 files; no tarball retained for this task
- Follow-up: REACT-02

Final-review remediation evidence:

- Assigned agent/session: `ses_fcfdaf702ffe6aYfj3rL12tI6R`
- Changed: condition-aware ESM/CommonJS type exports in `packages/react/package.json`; staged Node16 `.mts`/`.cts` compilation in the package validator and fixtures
- Verified: `pnpm test:package-validator`; `pnpm typecheck`; `pnpm prepare:package`; `pnpm validate:package`; `pnpm test:package`; `pnpm lint`
- Result: 8 validator tests passed; 238 runtime and 238 condition-specific declaration targets passed; staged ESM and CommonJS TypeScript consumers compile
- Follow-up: none

### Task REACT-02: Repair Native ESM Resolution

Status: completed

Priority: P0

Suggested agent: React build engineer

Dependencies: REACT-01

Primary ownership:

- React source imports using `lodash-es` subpaths
- `packages/react/tsup.config.ts` only if a build-level solution is necessary
- ESM/CommonJS import regression tests

Finding:

Imports such as `lodash-es/kebabCase` remain external in generated `.mjs` files. Native Node ESM does not resolve these extensionless subpaths, causing 25 of 111 advertised ESM entries to fail.

References:

- `packages/react/components/form/text-input.tsx:2`
- `packages/react/components/form/textarea.tsx:2-3`
- `packages/react/components/form/searchable-select.tsx:2-3`
- `packages/react/components/form/date-range-picker.tsx:5-6`
- `packages/react/utils/date.ts:2`
- `packages/react/tsup.config.ts:48-56`

Implementation requirements:

1. Use Node-valid package subpaths, native/local helpers, or deliberate bundling; choose the smallest consistent solution.
2. Preserve browser-bundler compatibility and tree-shaking.
3. Do not hide failures with a resolver configuration unavailable to package consumers.
4. Run the full staged-package import sweep after rebuilding.

Acceptance criteria:

- Every advertised ESM and CommonJS runtime entry loads from the staged package.
- Emitted ESM contains no dependency import that relies on unsupported extension guessing.
- React type checking, bundling, and REACT-01 validation pass.

Completion evidence:

- Assigned agent/session: `ses_fcfd346b8ffeERUdoUZIRMIwcW`
- Changed: 20 React form/UI modules and `packages/react/utils/date.ts`, replacing extensionless `lodash-es` method imports with explicit `.js` package subpaths
- Verified: `pnpm exec tsc --noEmit --pretty false`; `pnpm test:package-validator`; `pnpm bundle`; `pnpm prepare:package`; `pnpm validate:package`
- Result: all 238 staged ESM/CommonJS runtime targets and 119 declaration targets passed; emitted ESM has zero extensionless `lodash-es` imports
- Packed artifact: dry-run manifest validated 786 files
- Follow-up: none

### Task REACT-03: Add Package-Level Test and Quality Commands

Status: completed

Priority: P1

Suggested agent: React test infrastructure engineer

Dependencies: REACT-01

Primary ownership:

- React test runner and setup
- `packages/react/package.json` quality scripts
- Package-level lint/typecheck configuration

Finding:

There are no React package tests or package-level lint/test commands. The Next.js example does not consume the published package and therefore cannot catch package export or component regressions.

References:

- `packages/react/package.json:102-106`
- `packages/react/tsconfig.json:19-20`
- `packages/react/@examples/nextjs/package.json:5-10`

Implementation requirements:

1. Add discoverable `typecheck`, `lint`, `test`, and `test:package` commands while retaining `bundle` as the artifact command.
2. Configure component/hook tests with DOM and fake-timer support.
3. Keep package artifact tests separate from source unit tests.
4. Enable unused-import/variable checks and stronger implicit-any enforcement.
5. Avoid broad snapshots; assert public behavior and accessibility semantics.

Acceptance criteria:

- A deliberately broken component test and export target each fail the appropriate command.
- Source tests do not import from ignored `dist` unless explicitly testing the artifact.
- Typecheck, lint, unit tests, bundle, and package validation pass as separate commands.

Completion evidence:

- Assigned agent/session: `ses_fcfcffdb6ffe4wEtNU4zoMwsfA`
- Changed: `packages/react/package.json`, `packages/react/pnpm-lock.yaml`, `packages/react/tsconfig.json`, `packages/react/eslint.config.mjs`, `packages/react/vitest.config.mts`, `packages/react/tests/`, plus focused unused-code cleanup
- Verified: `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm bundle`; `pnpm test:package`
- Result: 3 source test files/4 tests and 7 validator tests passed; lint passed with zero warnings; staged validation passed 120 exports, 238 runtime targets, 119 declarations, and 786 packed files
- Packed artifact: validated through `npm pack --dry-run --json --ignore-scripts`
- Follow-up: none

### Task REACT-04: Define Controlled Date Picker Behavior

Status: completed

Priority: P1

Suggested agent: React component correctness engineer

Dependencies: REACT-03

Primary ownership:

- `packages/react/components/form/date-picker.tsx`
- `packages/react/components/form/date-range-picker.tsx`
- Focused date-picker tests and API documentation

Finding:

The date-range picker uses `value` only to initialize local state, substitutes today for no value, and invokes `onChange` from an effect on mount. The date picker also emits during synchronization and has incomplete effect dependencies. Both APIs appear controlled but do not consistently honor parent updates and resets.

References:

- `packages/react/components/form/date-range-picker.tsx:33-64`
- `packages/react/components/form/date-range-picker.tsx:101-109`
- `packages/react/components/form/date-picker.tsx:59-85`

Implementation requirements:

1. Use a controlled contract or explicitly distinguish `value` and `defaultValue`.
2. Emit `onChange` only for user actions, not mount or prop synchronization.
3. Handle transitions between values, `undefined`, and partial date ranges.
4. Remove dead imports and isolate date normalization only if it improves testing/readability.
5. Document any externally visible contract correction.

Acceptance criteria:

- Parent rerenders from value A to B and then `undefined` update rendered selection.
- Mounting and prop synchronization do not call `onChange`.
- Selection and clearing call `onChange` exactly once with the expected value.
- Tests cover partial ranges and local-day normalization.

Completion evidence:

- Assigned agent/session: `ses_fcfc2022bffej0DKzSQrnFBuun`
- Changed: `packages/react/components/form/date-picker.tsx`, `packages/react/components/form/date-range-picker.tsx`, `packages/react/tests/date-pickers.test.tsx`
- Verified: `pnpm exec vitest run tests/date-pickers.test.tsx`; `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm bundle`; `pnpm test:package`
- Result: 4 focused date-picker tests and all 8 source tests passed; staged validation passed 120 exports, 238 runtime targets, 119 declarations, and 784 packed files
- Packed artifact: validated through the package test command
- Follow-up: none

Final-review remediation evidence:

- Assigned agent/session: `ses_fcfc2022bffej0DKzSQrnFBuun`
- Changed: strict local `YYYY-MM-DD` parsing and invalid-value handling in `date-picker.tsx`; non-UTC string-value regressions in `date-pickers.test.tsx`
- Verified: `TZ=America/Los_Angeles pnpm exec vitest run tests/date-pickers.test.tsx`; `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm bundle`; `pnpm test:package`
- Result: 6 focused date tests and all 22 source tests passed; date-only strings preserve their local calendar day and invalid values render empty without callbacks
- Follow-up: none

### Task REACT-05: Scope Layout and Dialog State to Providers

Status: completed

Priority: P1

Suggested agent: React state architecture engineer

Dependencies: REACT-03

Primary ownership:

- `packages/react/layouts/sidebar1/index.tsx`
- `packages/react/components/widgets/dialog-manager/provider.tsx`
- Related contexts, types, and tests

Finding:

Sidebar header state is an exported package-global Valtio proxy shared by every layout instance. Dialog-manager promises can remain pending forever when their provider unmounts, and resolvers are invoked inside a React state updater.

References:

- `packages/react/layouts/sidebar1/index.tsx:88-120`
- `packages/react/components/widgets/dialog-manager/provider.tsx:6-13`
- `packages/react/components/widgets/dialog-manager/provider.tsx:28-52`

Implementation requirements:

1. Create header state per layout/provider and expose it through context instead of a singleton.
2. Define and document dialog cancellation behavior on provider unmount.
3. Keep pending dialogs in an owned structure that cleanup can settle.
4. Invoke external resolvers outside React state updater functions.
5. Replace internal `any` with encapsulated `unknown`-based erasure where practical.

Acceptance criteria:

- Two mounted sidebar providers can hold different headers.
- Unmount/remount restores the default header.
- Every dialog promise settles according to the documented cancellation contract.
- Tests do not require package-global resets or order dependence.

Completion evidence:

- Assigned agent/session: `ses_fcfbcb85bffeN1a11dboIuXa7C`
- Changed: `packages/react/layouts/sidebar1/index.tsx`, dialog-manager provider/context/exports, `packages/react/tests/sidebar-layout-state.test.tsx`, `packages/react/tests/dialog-manager.test.tsx`, React README and `llms.txt`
- Verified: `pnpm exec vitest run tests/sidebar-layout-state.test.tsx tests/dialog-manager.test.tsx`; `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm bundle`; `pnpm test:package`
- Result: 5 focused state tests and all 13 source tests passed; all pending dialogs reject with exported `DialogCancellationError`; staged package validation passed
- Packed artifact: 120 exports, 238 runtime targets, 119 declarations, and 784 packed files validated
- Follow-up: none

### Task REACT-06: Fix Lifecycle and Layout Reliability Defects

Status: completed

Priority: P1

Suggested agent: React UI reliability engineer

Dependencies: REACT-03

Primary ownership:

- `packages/react/hooks/use-clipboard.tsx`
- `packages/react/components/ui/tag-picker.tsx`
- `packages/react/components/ui/carousel.tsx`
- `packages/react/layouts/simple/`
- `packages/react/layouts/sidebar1/context-switcher.tsx`

Finding:

Clipboard and tag-picker timers are not owned or canceled, carousel cleanup omits its `reInit` listener, and `ContextSwitcher` crashes for a typed empty array. `SimpleLayout` has dead/incomplete behavior, omits navigation on mobile, and applies its content class object incorrectly. Raw control buttons can submit surrounding forms.

References:

- `packages/react/hooks/use-clipboard.tsx:19-30`
- `packages/react/components/ui/tag-picker.tsx:108-117`
- `packages/react/components/ui/carousel.tsx:92-101`
- `packages/react/layouts/sidebar1/context-switcher.tsx:32-48`
- `packages/react/layouts/simple/index.tsx:99-125`
- `packages/react/layouts/simple/index.tsx:211-221`
- `packages/react/layouts/simple/mobile-menu.tsx:35-43`

Implementation requirements:

1. Retain, replace, and clean up timer handles correctly.
2. Pair every Embla listener registration with matching cleanup.
3. Define an empty/loading context contract or require a non-empty tuple.
4. Correct mobile navigation, content class binding, dead state/imports, and the incomplete sidebar API by implementing or removing it.
5. Add `type="button"` to non-submit controls.
6. Do not redesign the layouts.

Acceptance criteria:

- Fake-timer tests cover repeated copy, unmount, and blur/refocus races.
- Listener tests prove matching `on` and `off` calls.
- Empty context input cannot crash a supported render path.
- Desktop/mobile tests prove navigation and class overrides work.
- Layout controls do not submit an enclosing form.

Completion evidence:

- Assigned agent/session: `ses_fcfb48360ffec6vbn9Ykwl2Zht`
- Changed: clipboard hook, tag picker, carousel, context switcher, `layouts/simple/`, React README, and three focused reliability test files
- Verified: `pnpm exec vitest run tests/lifecycle-reliability.test.tsx tests/listener-and-context-reliability.test.tsx tests/simple-layout.test.tsx`; `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm bundle`; `pnpm test:package`
- Result: 7 focused tests and all 20 source tests passed; staged package validation passed 120 exports, 238 runtime targets, 119 declarations, and 784 packed files
- Packed artifact: validated through the package test command
- Follow-up: none

### Task REACT-07: Narrow Client Boundaries and Strengthen Public Types

Status: completed

Priority: P2

Suggested agent: React Server Components and TypeScript engineer

Dependencies: REACT-02, REACT-04, REACT-05

Primary ownership:

- `packages/react/tsup.config.ts`
- `packages/react/prepend-use-client.mjs`
- Pure utility/type entrypoints
- Public declaration/type fixes and RSC consumer fixture

Finding:

Two build mechanisms mark every emitted module as `"use client"`, including pure utilities and type-only entries. Public APIs also contain avoidable `any`, while useful layout prop types are not consistently exported.

References:

- `packages/react/tsup.config.ts:4-27`
- `packages/react/tsup.config.ts:46-56`
- `packages/react/prepend-use-client.mjs:6-18`
- `packages/react/components/form/textarea.tsx:8-16`
- `packages/react/layouts/simple/index.tsx:17-66`
- `packages/react/tsconfig.json:5-8`

Implementation requirements:

1. Confirm the intended RSC contract before changing public boundaries.
2. Mark only hook/context/browser-dependent modules as client modules; leave pure utilities server-compatible.
3. Establish one tested directive-enforcement mechanism for both output formats.
4. Replace public `any` with precise types and enable stronger implicit-any checks.
5. Export consumer-relevant prop types without adding broad barrels or accidental runtime exports.

Acceptance criteria:

- Pure utilities work from a Next.js Server Component consuming the staged package.
- Client-dependent entries retain a valid directive in each supported format.
- Generated declarations expose documented props without avoidable public `any`.
- Typecheck, bundle, RSC fixture, and REACT-01 validation pass.

Completion evidence:

- Assigned agent/session: `ses_fcfac988cffe7gc7W6Fi8wUTwb`
- Changed: client directives across actual client source entries, `packages/react/tsup.config.ts`, `packages/react/prepend-use-client.mjs`, boundary/RSC validators and fixtures, public textarea/layout types, React README and `llms.txt`
- Verified: `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm test:package-validator`; `pnpm prepare:package`; `pnpm test:client-boundaries`; `pnpm validate:package`; `pnpm test:rsc`; `npm pack --dry-run --json --ignore-scripts`
- Result: all 111 entries checked in ESM/CommonJS (83 client, 28 server-safe); production Next.js RSC fixture passed; 238 runtime and 119 declaration targets passed with no avoidable public `any` in remediated declarations
- Packed artifact: dry-run manifest validated 784 files
- Follow-up: none

Final-review remediation evidence:

- Assigned agent/session: `ses_fcfac988cffe7gc7W6Fi8wUTwb`
- Changed: dialog-manager barrel client directive, transitive client re-export enforcement/test, dual-format declaration boundary validation, and RSC fixture coverage of the documented barrel
- Verified: `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm prepare:package`; `pnpm test:client-boundaries`; `pnpm test:rsc`; `pnpm validate:package`; `pnpm test:package-validator`
- Result: 111 entries pass in both formats (84 client, 27 server-safe); the production RSC fixture renders the dialog-manager barrel; ESM/CommonJS declarations and runtime targets pass
- Follow-up: none

### Task REACT-08: Add an Isolated Consumer and Required CI Gate

Status: completed

Priority: P1

Suggested agent: React CI engineer

Dependencies: REACT-01, REACT-02, REACT-03, REACT-04, REACT-05, REACT-06, REACT-07

Primary ownership:

- React consumer fixture
- React jobs in `.github/workflows/test.yml`
- React-related setup in `.github/actions/setup-npm/action.yml`
- React README and `llms.txt` alignment

Finding:

CI validates only the source-copied Next.js example on pushes and installs with `--no-frozen-lockfile`. It does not prove that a clean application can install and use the published React artifact.

References:

- `.github/workflows/test.yml:1-29`
- `.github/actions/setup-npm/action.yml:16-38`
- `packages/react/@examples/nextjs/package.json:5-30`
- `packages/react/README.md:43-45`

Implementation requirements:

1. Add pull-request and push checks using the committed React lockfile.
2. Build and pack the library before installing it into an isolated consumer with no source aliases.
3. Exercise one UI component, form field, hook, utility, layout, and dialog-manager path.
4. Run package typecheck, lint, unit tests, bundle, artifact validation, and consumer build as distinct steps.
5. Align README and `llms.txt` imports, peers, client boundaries, and public types with the staged artifact.
6. Coordinate edits to shared CI/release files with the Angular plan.

Acceptance criteria:

- CI fails for a missing export, invalid ESM import, absent peer, client-boundary regression, or component test failure.
- Frozen install leaves the React lockfile unchanged.
- Every documented import resolves from the tarball.
- The consumer build passes without imports from repository source or `dist` paths.

Completion evidence:

- Assigned agent/session: `ses_fcf9c2acdffeW5wiTeHZVixG6K`
- Changed: React CI/setup steps, package packing/consumer scripts, isolated Vite consumer fixture and lockfile, React README and `llms.txt`
- Verified: frozen React install; all package quality/artifact/RSC commands; `pnpm pack:package`; `pnpm prepare:consumer`; `pnpm test:consumer`; `pnpm build:consumer`; existing Next.js example lint/build
- Result: isolated tarball consumer test passed and production build transformed 1,949 modules; React lockfile remained unchanged; CI now runs distinct push/pull-request gates
- Packed artifact: `egose-shadcn-theme-0.0.0-test.0.tgz`, SHA-256 `ac44774d94184f787f06cad2f83c629916273f0eaf8ef823f13d57597bebd540`, 274,860 bytes
- Follow-up: standalone `actionlint` was unavailable because no version is configured; workflow commands were exercised locally

Final-review remediation evidence:

- Assigned agent/session: `ses_fcf9c2acdffeW5wiTeHZVixG6K`
- Changed: explicit CI steps for validator regressions, staged ESM/CommonJS/declaration validation, and the dialog-manager RSC case; corrected installed paths and boundary guidance in README/`llms.txt`
- Verified: frozen installs; all package commands; isolated consumer install/test/build; Next.js example lint/build
- Result: `.mts`/`.cts` consumers, the production RSC barrel case, 22 source tests, 8 validator tests, and isolated consumer test/build all passed
- Packed artifact: `egose-shadcn-theme-0.0.0-test.0.tgz`, SHA-256 `01dde8819b5d9311fbd8e6d10472414e5bf9b1413148398fd1ba280efe2f17c9`, 276,007 bytes
- Follow-up: none

### Task REACT-FINAL: Independently Review the React Release Candidate

Status: completed

Priority: P0

Suggested agent: independent package reviewer

Dependencies: REACT-08

Primary ownership:

- Fresh React tarball and temporary consumer
- Review evidence only

Finding:

Source checks cannot prove the npm artifact because release metadata and files are generated into `dist`. Final approval must inspect the exact tarball independently.

References:

- `scripts/publish.mjs:80-195`
- `packages/react/package.json:27-100`

Implementation requirements:

1. Start from a clean checkout and frozen install.
2. Prepare without publishing and record the tarball checksum and size.
3. Verify name, version, license, files, exports, declarations, dependencies, client boundaries, and absence of placeholders/credentials.
4. Install the tarball in a fresh consumer and run all documented usage paths.
5. Confirm every task acceptance criterion against behavior rather than completion notes.

Acceptance criteria:

- Every ESM/CommonJS/type export resolves from the tarball.
- Server-safe and client-only boundaries match the documented contract.
- The isolated consumer typecheck, tests, and production build pass.
- No P0/P1 task remains incomplete or blocked.

Initial review evidence:

- Assigned agent/session: `ses_fcf8aa548ffe2hpyPgf0c4txjV`
- Result: release rejected due to CommonJS declaration resolution, dialog-manager barrel boundary, and non-UTC string date handling; REACT-01, REACT-04, REACT-07, and REACT-08 were reopened and remediated
- Follow-up: fresh independent review required after remediation

Completion evidence:

- Assigned agent/session: `ses_fcf6d185affeAmrfHzFYQkc6sP`
- Changed: review evidence only; no source, task, Angular, or repository files changed by the reviewer
- Verified: frozen root/React/consumer/example installs; all React quality, bundle, staging, validator, boundary, RSC, packing, isolated-consumer, and Next.js example commands; extracted-tarball metadata/file/security inspection
- Result: no P0/P1/P2 blockers; all REACT-01 through REACT-08 criteria passed; 22 source tests, 8 validator tests, 238 runtime targets, 238 declaration targets, 84 client and 27 server-safe entries, isolated consumer, and production RSC build passed
- Packed artifact: `egose-shadcn-theme-0.0.0-test.0.tgz`, SHA-256 `01dde8819b5d9311fbd8e6d10472414e5bf9b1413148398fd1ba280efe2f17c9`, 276,007 bytes, 784 files
- Follow-up: none

## Parallelization

| Wave | Tasks                        | Guidance                                                  |
| ---- | ---------------------------- | --------------------------------------------------------- |
| 1    | REACT-01                     | Establish artifact assertions first.                      |
| 2    | REACT-02, REACT-03           | May run in parallel; coordinate package script edits.     |
| 3    | REACT-04, REACT-05, REACT-06 | May run in parallel because source ownership is separate. |
| 4    | REACT-07                     | Run after public state/API behavior stabilizes.           |
| 5    | REACT-08                     | Integrate all commands and documentation into CI.         |
| 6    | REACT-FINAL                  | Independent, serial review against a fresh tarball.       |

Shared files requiring one owner at a time:

- `packages/react/package.json`: REACT-01/03 first, REACT-08 final integration
- `packages/react/tsup.config.ts`: REACT-02 before REACT-07
- `.github/workflows/test.yml`: REACT-08 coordinates with the Angular CI task
- `scripts/publish.mjs`: React prepare behavior coordinates with the Angular release task

## Maintainer Decisions

1. Confirm whether pure React utilities must work in Server Components.
2. Confirm whether CommonJS remains a supported package format.
3. Select the dialog-provider unmount contract: reject with a typed cancellation error or resolve with an explicit cancellation value.
4. Confirm whether incomplete `SimpleLayout.sidebar` behavior should be implemented or removed.

## Definition of Done

- All P0/P1 tasks have completion evidence.
- Every staged runtime and declaration export resolves.
- Controlled state, provider isolation, timers, listeners, and layout behavior have focused tests.
- Public declarations contain no avoidable `any` in the remediated APIs.
- The documented RSC/client contract is verified from a tarball.
- Pull-request CI uses a frozen install and an isolated consumer.
- An independent reviewer records final commands, checksum, size, and results.

## Completion Evidence Template

```markdown
Completion evidence:

- Assigned agent/session: ...
- Changed: `path`, `path`
- Verified: `exact command`
- Result: concise test/build/artifact result
- Packed artifact: filename and checksum, when applicable
- Follow-up: task ID or `none`
```
