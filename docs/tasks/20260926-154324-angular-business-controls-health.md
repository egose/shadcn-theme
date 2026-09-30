# Angular Business Controls Health

Created: 2026-09-26 15:43:24 local time

Status: completed

## Objective and product context

Improve the correctness and usability of the reusable Angular business controls in `packages/angular/projects`. The product is a themeable shadcn-style library, published in plain and `tw:` variants with component-level imports. Its composed tables, forms, date pickers, and steppers support CRUD administration, record assignment, scheduling, and onboarding flows. Correct entity identity, asynchronous form values, keyboard editing, accessible validation, and consistent navigation are more valuable here than adding application-specific backend features.

Scope: the nine original bounded outcomes and three coordinator-triaged follow-ups below, their focused tests, narrow primitive forwarding, shipped documentation, and final package/consumer verification. Preserve public APIs where possible; document changed behavior in package/project READMEs and JSDoc. **Never edit root `CHANGELOG.md`.** Do not commit, publish, or edit generated output manually.

## Analysis coverage and limitations

- Clean initial `git status --short`; no repository `AGENTS.md` found.
- Inspected the current 87-project inventory, package scripts, README, test runner, and two sequential read-only reviews of business controls and newer form wrappers. Read relevant implementations, tests, callers, and underlying CDK/Spartan/TanStack contracts.
- Findings below are source-supported; new failing regressions are required during implementation. No build/browser baseline was run before task creation. Prior task completion evidence is historical, not a current baseline.
- Deduplicated against completed `20260823-123504-angular-package-health-remediation.md` (packaging, six older wrapper ID/disabled fixes, DOM observation/lifetimes, exports) and `20260904-152423-angular-standard-example-remediation.md` (catalog and example flows). This is a new source-control behavior phase.
- Security review found interpolation-based labels/messages and no confirmed new injection vulnerability. UI constraints are not server authorization/validation. Dependency audit remains an existing gate; the historical build-tool advisory exceptions in `packages/angular/SECURITY.md` require their own lifecycle review, outside this source-focused objective.
- Not a comprehensive audit of all 87 component implementations, all assistive technologies, or dependency advisories. Calendar blackout APIs, remote search, virtualization, backend bulk-action services, and additional domain demos are deferred: they need separate product/performance evidence. No unmeasured performance claim is made.

## Execution and verification rules

Run each task in order in a **fresh, separate sub-agent session**, never concurrently. Shared hotspots are `test/run-library-tests.mjs`, package README, and generated `dist`/release outputs. Each agent reads this document and current worktree, changes only its task boundary, sets its own status to `in_progress`, and records `Completion evidence` only after all its criteria pass. Fixes include meaningful regression tests; register missing suites in the existing runner. Use existing Angular signals, standalone components, adapter/CDK contracts, and destruction-bound subscriptions rather than broad abstractions.

Priorities: **P1** = user-visible correctness/data integrity/accessibility; **P2** = bounded capability or secondary usability improvement. No P0 security/release claim is established.

Commands below run from `<repo-root>` with root/Angular dependencies installed. Chrome is required: the repository `pnpm --dir packages/angular install:browser` command provisions it; an existing compatible binary may be passed through `CHROME_BIN`.

- Targeted: `pnpm --dir packages/angular test:library <project...>`; the runner accepts an explicit allowlist. Register data-table, searchable-multiselect, date-picker, and pagination as their tasks add coverage.
- Package: `pnpm --dir packages/angular test:libraries`; `test:source-exports`, `test:public-api`, `test:build-all`, `test:dependency-contract`, `test:package-validator`, `test:variants`, and `test:example-boundary` are existing separate package scripts.
- Integration: `pnpm --dir packages/angular/@examples/standard build` and `pnpm --dir packages/angular/@examples/standard test:ci`.
- Installed artifacts: `pnpm --dir packages/angular prepare:release --version 0.0.0-business-controls.0`, followed by `pnpm --dir packages/angular verify:consumers --release-dir release`. Inspect both generated variants and declarations. These commands prepare and verify; they do not publish.
- Review: `git diff --check`, focused formatting checks using root Prettier, and confirm `git diff -- CHANGELOG.md` is empty.
- There is no root aggregate test script. Final integration runs all applicable Angular checks, not unrelated React tests. Do not run variant builds in parallel or duplicate completed checks absent new changes/failures.

Definition of done: every task has verified observable acceptance criteria, completed status and command/results evidence; both artifacts/consumers pass; independent reviewer examines the complete task file and all changes; coordinator confirms completion and protected-file preservation. A blocked required check keeps its task blocked with the prerequisite recorded.

## Tasks

### Task ABH-01: Keep table selection attached to record identity

Status: completed

Kind: defect

Priority: P1 — positional selection can target the wrong record in bulk actions.

Suggested agent: Angular/TanStack data integrity engineer (fresh session)

Dependencies: none

Primary ownership: `projects/data-table/src/lib/eg-data-table.ts`, its specs and README; focused runner registration.

Finding: table construction supplies no `getRowId`, while retained selection state uses TanStack positional IDs. Replacing a server page or filtering/reordering client rows can associate the same selected index with a different entity. Existing selection tests seed positional key `1` and do not exercise identity changes.

References: `packages/angular/projects/data-table/src/lib/eg-data-table.ts` (`_items`, `_table`, `_emitSelection`, `initialRowSelection`, lines 353–508); `eg-data-table.spec.ts` (selection fixture).

Requirements:

1. Expose a typed stable-row-identity callback, passed to TanStack; define safe fallback when no callback is supplied.
2. Prevent positional selection from transferring on data/filter changes. Document server-page selection scope, refresh behavior, and fallback compatibility. Do not build a backend bulk-action layer.
3. Keep state/outputs consistent and avoid selection notification loops or transient wrong-entity emissions.

Acceptance criteria: tests select A then replace it with B at the same position; reorder/delete/filter rows; refresh object instances with stable IDs; verify selected entities and table/grid controls. B is never silently selected. No-ID behavior is tested and documented. Existing table specs pass under the aggregate runner.

Verification: targeted `test:library data-table`, source/API checks where changed, focused formatting and diff check.

Completion evidence:

- Changed: `packages/angular/projects/data-table/src/lib/eg-data-table.ts`, `packages/angular/projects/data-table/src/lib/eg-data-table.spec.ts`, `packages/angular/projects/data-table/README.md`, `packages/angular/test/run-library-tests.mjs`, and this task document. The data-table suite is now registered in the existing focused/aggregate runner.
- Regression proof: before implementation, `pnpm --dir packages/angular test:library data-table` exited 1 with **2 failed, 16 passed**. Both new table/grid replacement tests selected Grace, replaced her with Ada at the same position, and observed the wrong Ada output plus checked/selected UI. The final same command exited 0 with **33 passed** (16 existing + 17 new), using automatically resolved cached Chrome Headless **152.0.7977.75** at `packages/angular/.puppeteer-cache/chrome-headless-shell/linux-152.0.7977.75/chrome-headless-shell-linux64/chrome-headless-shell`.
- Targeted coverage: stable-ID reorder/delete/pre-filter, refreshed object identity, server page replacement/return/null loading, no-ID replacement/reorder/refresh/pre-filter/server fallback, initial IDs and missing-ID pruning, callback changes and subsequent refresh, built-in filtering/sorting, client page/header selection, table/grid toggles and row checkboxes, every captured replacement output, source-order output, and consumer signal-read/copy-array notification-loop prevention.
- Additional selection-path finding resolved within ABH-01: recreating TanStack's data array on every state update reset client pagination when checking a page row. Memoizing the array keeps page/header actions attached to the displayed page; changing the identity callback explicitly rebuilds cached row IDs.
- Behavioral contract: typed `getRowId: (row: TData) => string` supplies TanStack identity. Selection is synchronously reconciled to current supplied rows after `filterRows`; stable IDs survive refresh/reorder only while present. Server selection is loaded-slice scoped; null/empty data clears it. Built-in filters/client pages hide but retain selection. Without IDs, initial positional keys remain supported but replacing the effective row array clears selection. Changing the identity callback clears selection. Outputs use current objects and source order, suppress unchanged selections, and isolate consumer signal reads with `untracked`.
- Checks: `pnpm --dir packages/angular test:source-exports` — **2 passed**; `pnpm --dir packages/angular test:public-api` — **3 passed**. `pnpm exec prettier --check packages/angular/projects/data-table/src/lib/eg-data-table.ts packages/angular/projects/data-table/src/lib/eg-data-table.spec.ts packages/angular/projects/data-table/README.md packages/angular/test/run-library-tests.mjs` — passed. `git diff --check` — passed. `git diff -- CHANGELOG.md` — empty.
- Limitations: callers must provide unique/non-reused IDs, a stable callback, and immutable data updates. Whole-package builds, generated declarations/artifacts, and consumer verification remain ABH-FINAL's checks. No task blocker. The pre-existing primitive mixed-state forwarding issue discovered in the expanded controls check is explicitly deferred as ABH-FU-01 below; the table's indeterminate model is asserted, but native mixed-state accessibility is not claimed fixed.

### Task ABH-02: Preserve multiselect values across asynchronous options

Status: completed

Kind: defect

Priority: P1 — editing existing assignments can silently discard selected IDs.

Suggested agent: Angular CVA state engineer (fresh session)

Dependencies: ABH-01 (execution order)

Primary ownership: `projects/searchable-multiselect/src/lib/searchable-multiselect.ts`, new specs, related wrapper regression, README; runner registration.

Finding: `value` is never read; `writeValue` filters selected IDs against currently loaded options and stores only resolved option objects. Standalone initialization/reset and values arriving before options are broken; `isFormBound` is assigned but unused.

References: `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.ts` (`value`, `selectedItems`, `updateSelectedFromValues`, `writeValue`, lines 111–174); `projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.spec.ts` (existing disabled/label coverage).

Requirements:

1. Store selected values independently from label metadata, derive display reactively, and define standalone vs CVA ownership.
2. Preserve unresolved IDs and reconcile labels when options arrive/change; external writes must not emit user changes.
3. Preserve disabled/touched behavior and immutable caller arrays; remove obsolete state only where made unnecessary.

Acceptance criteria: initial/updated/cleared standalone values work; values before options and relabeling work; adding/removing a known option preserves unresolved values; external CVA writes never feed back through outputs/onChange. Existing wrapper tests remain green.

Verification: targeted `test:library searchable-multiselect form-searchable-multiselect`, focused formatting/diff.

Completion evidence:

- Changed: `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.ts`, new `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.spec.ts`, `packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.spec.ts`, `packages/angular/projects/searchable-multiselect/README.md`, `packages/angular/test/run-library-tests.mjs`, and this task document. Registered searchable-multiselect in the focused/aggregate runner while preserving ABH-01's data-table registration and prior work.
- Regression proof: before implementation, `pnpm --dir packages/angular test:library searchable-multiselect form-searchable-multiselect` exited 1 with **2 failed, 0 passed**; standalone initial/updated values and CVA values before option arrival rendered no chips. The runner stopped before the wrapper suite. The final same command exited 0 with **14 searchable-multiselect tests + 5 form-searchable-multiselect tests = 19 passed** (15 new regressions and 4 existing wrapper tests). Package Karma automatically resolved Chrome Headless **152.0.7977.75** from `packages/angular/.puppeteer-cache/chrome-headless-shell/linux-152.0.7977.75/chrome-headless-shell-linux64/chrome-headless-shell`.
- Coverage: standalone initial/update/clear and local-edit replacement; CVA ownership, repeated writes, empty/null resets; asynchronous options, relabels and disappearance; checkbox add/remove and explicit unresolved-chip removal in both ownership modes; input order and selected counts; frozen caller values/options; output/CVA payload mutation isolation; input/wrapper/form disabled flags and guarded handlers; touched/no-op behavior; reactive forms, ngModel, copy-array standalone output handlers, and the form wrapper. External writes/option changes emit no user notifications; effective user changes emit once per channel.
- Standalone/CVA contract: a linked selected-ID array is independent of option metadata. Standalone `[value]` initializes selection and new input arrays replace local edits; `[(value)]` synchronizes the parent. The first `writeValue` takes CVA ownership for the component lifetime, after which `[value]` is ignored. CVA writes always replace selection; null/empty arrays clear it. IDs keep their supplied order and remain present when unresolved, displayed as raw-ID chips until options supply labels. User edits to other IDs retain unresolved values. Only effective enabled user adds/removes emit `valueChange`/`onChange` and call `onTouched`; opening/focusing alone and external updates do not touch. Input arrays are not mutated, and each notification channel receives a fresh array. Callers supply unique IDs and immutable array/option updates. README and public input/CVA JSDoc document ownership and emission behavior.
- Checks: `pnpm exec prettier --check packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.ts packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.spec.ts packages/angular/projects/searchable-multiselect/README.md packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.spec.ts packages/angular/test/run-library-tests.mjs` — passed. `git diff --check` — passed. `git diff -- CHANGELOG.md` — empty.
- No ABH-02 blocker. Aggregate/package/artifact builds and consumer checks remain ABH-FINAL's responsibility; ABH-09 search was not implemented. Independent issue reported to the coordinator without creating a deferred task: the existing searchable-multiselect README peer-dependency paragraph incorrectly says Spartan is not a peer, while `packages/angular/package.json` declares `@spartan-ng/brain` as a peer.

### Task ABH-03: Enforce picker constraints on typed user commits

Status: completed

Kind: defect

Priority: P1 — typed scheduling values bypass restrictions enforced by calendars.

Suggested agent: Angular date-adapter engineer (fresh session)

Dependencies: ABH-02 (execution order)

Primary ownership: `projects/date-picker/src/lib/hlm-date-picker*`, range picker, focused tests, README; runner registration. Narrow calendar/adapter changes only if required.

Finding: calendars receive min/max and multi-selection limits, but single/range/multi `updateDate` paths transform and emit arbitrary parsed input. Spartan's input commit supplies no additional constraint enforcement.

References: `hlm-date-picker.ts` (`updateDate`, calendar template, lines 44–52 and 146–153); `hlm-date-range-picker.ts` (`updateDate`); `hlm-date-picker-multi.ts` (`updateDate`, calendar inputs); `hlm-date-picker-input.ts` (`parseValue`). All under `packages/angular/projects/date-picker/src/lib/`.

Requirements:

1. Apply existing min/max and multi-selection constraints consistently at the user-commit boundary using the configured date adapter; share only genuinely repeated policy.
2. Reject prohibited commits without silently changing form/model; retain editable text and expose an accessible invalid state consistent with underlying input capabilities. Define recovery/clear behavior.
3. Keep programmatic CVA writes separate and documented. Validate transformed values too, without changing configured parsing/normalization semantics unnecessarily.

Acceptance criteria: blur and Enter tests cover below/above/inclusive bounds, invalid range endpoint, excess multi selection, valid commit, clearing and recovery; custom adapter/config contracts work; no prohibited user value reaches outputs/forms; calendar path obeys the same policy. Public docs describe the contract.

Verification: targeted `test:library date-picker form-date-picker form-date-picker-multi form-date-range-picker`; formatting/diff.

Completion evidence:

- Changed **14 paths**: `packages/angular/projects/date-picker/src/lib/hlm-date-picker.ts`, `packages/angular/projects/date-picker/src/lib/hlm-date-picker-multi.ts`, `packages/angular/projects/date-picker/src/lib/hlm-date-range-picker.ts`, `packages/angular/projects/date-picker/src/lib/hlm-date-picker-input.ts`, `packages/angular/projects/date-picker/src/lib/hlm-date-range-input.ts`, `packages/angular/projects/date-picker/src/lib/hlm-date-multi-input.ts`, `packages/angular/projects/date-picker/src/lib/hlm-date-range-picker.token.ts`, new `packages/angular/projects/date-picker/src/lib/hlm-date-picker-commit.ts`, new `packages/angular/projects/date-picker/src/lib/hlm-constrained-date-input.ts`, new `packages/angular/projects/date-picker/src/lib/hlm-date-picker.spec.ts`, `packages/angular/projects/date-picker/README.md`, shipped `packages/angular/README.md`, `packages/angular/test/run-library-tests.mjs`, and this task document. Registered date-picker while preserving the prior data-table/searchable-multiselect registrations and all prior agents' changes.
- Pre-fix proof: `pnpm --dir packages/angular test:library date-picker` exited 1 with **6 failed, 0 passed**, covering all three picker kinds through both blur and Enter. Each prohibited below-min commit changed the form and emitted an output; invalid accessibility state was absent. An expanded intermediate run of the same command produced **3 failed, 50 passed**: two demonstrated the default range parser silently replacing an explicitly unparseable end with the start, and one demonstrated stale calendar selection after rejecting a transformed multi value. Those related paths are fixed in ABH-03.
- Final verification: `pnpm --dir packages/angular test:library date-picker` — **57 passed**. `pnpm --dir packages/angular test:library form-date-picker form-date-picker-multi form-date-range-picker` — **6 + 6 + 6 = 18 passed**, for **75 current targeted tests total**. The full requested command `pnpm --dir packages/angular test:library date-picker form-date-picker form-date-picker-multi form-date-range-picker` also passed earlier with **53 + 6 + 6 + 6 = 71 tests**, before four additional input-mirroring/range-transform regressions; the final split runs verify the final source. Chrome Headless **152.0.7977.75** was automatically resolved from the package cache.
- Coverage: each single/range/multi blur and Enter path tests below/above/inclusive whole-day bounds, unparsable input, rejection without form/output changes, refocus text preservation, successful correction, empty clear, invalid/out-of-bounds transforms, raw values that a transform would otherwise bring into bounds, clear-button recovery, repeated programmatic writes/null resets, readonly/disabled guards, forceInvalid composition and external inputValue updates. Rendered calendar clicks cover disabled boundary cells, transformed rejection/restoration/recovery, gradual multi selection, deselection floor and max-reset rejection. Range cases include invalid second endpoints, single-date same-day parsing, ordered/malformed transformed ranges and custom sorting. Non-native **JalaliDate / BrnJalaliDateAdapter** tests cover both commit events with configured parse/edit/display/transform callbacks, finite-time validity, inclusive bounds and Enter-then-blur formatting.
- Exact user-commit contract: `updateDate` returns `false` without model/output changes when disabled or rejected; success returns `true`. The configured adapter supplies finite `getTime` validity and inclusive `startOfDay(min)` / `endOfDay(max)` bounds for both raw and transformed values. Both range endpoints must pass, and the transformed range must be ordered. Multi arrays are checked before and after transformation: count must not exceed max; a count reduction below min is rejected, but growth from empty/below min is allowed, preserving the existing calendar's **deselection-floor** semantics. A full-calendar reset to one new date must also obey that floor. Counts use supplied array length; callers supply unique dates and pure, adapter-compatible callbacks. No native-Date-only validation was introduced.
- Exact invalid/programmatic contract: nonempty parser-null text and prohibited typed values retain the last committed form value, emit neither dateChange nor CVA onChange, remain editable across blur/Enter/refocus, touch the control and expose local `inputInvalid()` plus native `aria-invalid`/invalid styling (OR'ed with forceInvalid). This is local draft state, **not an Angular validator or form-error mutation**; validators continue to inspect the last committed model. Empty text/clear-button explicitly clears to null (single/range) or [] (multi), bypassing transforms and the floor; whitespace is passed to the parser. Successful user commits/clear and external value writes recover the local state. CVA `writeValue` applies the configured transform without user-constraint enforcement or user emissions and replaces rejected text even for repeated same-value/null writes; standalone `[date]` retains its direct/untransformed contract. Programmatic `reset()` remains an emitting clear. Enter restores edit format after success and blur uses display format. Calendar rejection restores its already-mutated brain model with guarded output handling.
- Checks: `pnpm --dir packages/angular test:public-api` — **3 passed**. `pnpm exec prettier --check packages/angular/projects/date-picker/src/lib/hlm-date-picker.ts packages/angular/projects/date-picker/src/lib/hlm-date-picker-multi.ts packages/angular/projects/date-picker/src/lib/hlm-date-range-picker.ts packages/angular/projects/date-picker/src/lib/hlm-date-picker-input.ts packages/angular/projects/date-picker/src/lib/hlm-date-range-input.ts packages/angular/projects/date-picker/src/lib/hlm-date-multi-input.ts packages/angular/projects/date-picker/src/lib/hlm-date-picker-commit.ts packages/angular/projects/date-picker/src/lib/hlm-constrained-date-input.ts packages/angular/projects/date-picker/src/lib/hlm-date-range-picker.token.ts packages/angular/projects/date-picker/src/lib/hlm-date-picker.spec.ts packages/angular/projects/date-picker/README.md packages/angular/README.md packages/angular/test/run-library-tests.mjs` — **passed, 13 files**. `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty.
- No ABH-03 blocker. Aggregate/artifact builds and emitted-declaration/consumer verification remain ABH-FINAL's checks. DOM/browser accessibility assertions were performed, not screen-reader testing. Independent findings reported to the coordinator without appending deferred tasks: `HlmInputGroupInput` does not forward its HlmInput host directive's forceInvalid input, and Spartan BrnInput forceInvalid affects styling only, not aria-invalid; these three picker inputs now bind their native attributes explicitly, but other input-group consumers warrant separate review. Existing multi/range form-wrapper suites also print Angular's disabled-with-reactive-form warning; all 18 wrapper tests pass.

### Task ABH-04: Restore CDK optional and pending step semantics

Status: completed

Kind: defect

Priority: P1 — optional wizard sections can strand users.

Suggested agent: Angular CDK workflow engineer (fresh session)

Dependencies: ABH-03 (execution order)

Primary ownership: `projects/stepper/src/lib/hlm-stepper.ts`, specs, README.

Finding: `next()` rejects every invalid selected control in linear mode before CDK can apply optional/completion rules. Header/direct navigation and Next can disagree.

References: `packages/angular/projects/stepper/src/lib/hlm-stepper.ts` (`next`, lines 198–215); `hlm-step.ts` (`CdkStep` inheritance); `hlm-stepper.spec.ts` (required-invalid tests).

Requirements: preserve useful touch/validation feedback while delegating eligibility to CDK; retain optional, explicit-completion, required-pending and non-linear rules.

Acceptance criteria: optional invalid steps advance; required invalid steps stay and are touched; required pending validation blocks; explicit completion and non-linear navigation work; direct `next()`, rendered Next, and header paths agree where applicable.

Verification: targeted `test:library stepper`, focused formatting/diff.

Completion evidence:

- Changed: `packages/angular/projects/stepper/src/lib/hlm-stepper.ts`, `packages/angular/projects/stepper/src/lib/hlm-stepper.spec.ts`, `packages/angular/projects/stepper/README.md`, and this task document. ABH-03 was completed before this isolated sequential session; existing Angular/React work was preserved. The stepper suite was already registered in `packages/angular/test/run-library-tests.mjs`.
- Pre-fix proof: after adding regressions and before changing implementation, `pnpm --dir packages/angular test:library stepper` exited 1 with **6 failed, 32 passed**. Both direct `next()` and rendered `button[hlmStepperNext]` stayed at index 0 for optional-invalid and explicitly-completed-invalid steps (four failures), while enabled header selection passed. The other two failures showed required-invalid Next attempts never reached CDK's `interacted` update, unlike headers. The final same command exited 0 with **38 passed** (5 existing + 33 new), using Chrome Headless **152.0.7977.75** resolved by the package Karma configuration.
- Coverage: **11 scenarios across each of direct Next, rendered Next, and enabled rendered header click**: optional invalid; explicitly completed invalid; required invalid with correction and visible Next touch feedback; real asynchronous required pending resolving valid or invalid; optional pending; explicitly completed pending; non-linear invalid and pending; control-less explicit completion false/true; and valid-control precedence over explicit completion false. Assertions check selected index, index-change emissions, CDK interaction, rendered review content/header selection, and group/child touch state. Pending tests use an actual child-control async validator with a controlled observable, not a mocked pending flag.
- Bounded fix: retain the existing classic-control `markAllAsTouched()` / `updateValueAndValidity()` pass, remove the extra invalid-only return, and always delegate to `super.next()`. Installed CDK **22.1.3** (`node_modules/@angular/cdk/fesm2022/stepper.mjs`, `selectedIndex`, `_anyControlsInvalidOrPending`, `CdkStep.completed`, and `CdkStepperNext`) supplies eligibility, optional/completion exceptions, pending checks and interaction behavior. README/JSDoc document this contract and the intentional difference that header/direct selection does not run Next's form-touch/revalidation pass. Signal Fields remain delegated to CDK; no new signal-form behavior is claimed tested.
- Checks: `pnpm exec prettier --check packages/angular/projects/stepper/src/lib/hlm-stepper.ts packages/angular/projects/stepper/src/lib/hlm-stepper.spec.ts packages/angular/projects/stepper/README.md docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 4 files**. `git diff --check` — passed. `git diff -- CHANGELOG.md` — empty. No aggregate/artifact builds, commits, or publishing were performed. No ABH-04 blocker.
- Independent findings for coordinator (no deferred task added): the existing header template uses the destination's CDK `isNavigable()` for `aria-disabled`/disabled styling, while selection eligibility checks preceding steps. Thus an unvisited incomplete destination can appear disabled even when selecting it is permitted; the header regressions deliberately use a completed/enabled destination and assert its enabled attributes before clicking. References: `hlm-stepper.ts` header bindings and `hlm-step-header.ts` pointer-events styling; CDK `CdkStep.isNavigable` versus `_anyControlsInvalidOrPending`. Both pre-/post-fix runs also print Angular **NG0956** for the existing horizontal single-panel `@for (... [selectedIndex]; track activeIndex)` recreation on navigation; tests pass, and no panel-rendering change was made.

### Task ABH-05: Normalize empty and bounded pagination state

Status: completed

Kind: defect

Priority: P2 — filtering/deleting all results leaves invalid navigation available.

Suggested agent: Angular pagination state engineer (fresh session)

Dependencies: ABH-04 (execution order)

Primary ownership: `projects/pagination/src/lib/hlm-numbered-pagination.ts`, query-params counterpart, tests and README; runner registration.

Finding: shared `outOfBoundCorrection(0, 10, 5)` returns 5 although empty pages display page 1. Next can remain enabled indefinitely. `_pages` writes model state inside a computed derivation.

References: `packages/angular/projects/pagination/src/lib/hlm-numbered-pagination.ts` (`_pages`, `outOfBoundCorrection`, navigation); `hlm-numbered-pagination-query-params.ts` (shared correction).

Requirements: normalize empty results to page 1, clamp navigation and size/total changes, use side-effect-free derived page lists, and define non-positive/invalid size handling. Preserve unrelated query parameters and route contract.

Acceptance criteria: later page to zero results corrects once; reducing totals/changing page size clamps; empty navigation cannot advance/retreat; query links are bounded and preserve unrelated parameters; invalid numeric input cannot create loops/unbounded page allocation.

Verification: targeted `test:library pagination`, focused formatting/diff.

Completion evidence:

- Changed **8 paths**: `packages/angular/projects/pagination/src/lib/hlm-numbered-pagination.ts`, `packages/angular/projects/pagination/src/lib/hlm-numbered-pagination-query-params.ts`, new internal `packages/angular/projects/pagination/src/lib/pagination-state.ts`, new `packages/angular/projects/pagination/src/lib/hlm-numbered-pagination.spec.ts`, `packages/angular/projects/pagination/README.md`, shipped `packages/angular/README.md`, `packages/angular/test/run-library-tests.mjs`, and this task document. ABH-04 was completed before this isolated sequential session. Registered pagination while retaining all prior suite registrations and Angular/React work.
- Pre-fix proof: after adding the first five regressions, before implementation changes, `pnpm --dir packages/angular test:library pagination` exited 1 with **5 failed, 0 passed**. The helper returned 5 for `(0, 10, 5)`; both rendered pagers retained page 5 and both edge controls on empty results; directly reading each `_pages` computed changed page 50 to 10 and emitted `currentPageChange`. The expanded final same command exited 0 with **48 passed** (all new), under automatically resolved Chrome Headless **152.0.7977.75**. An intermediate test compilation caught use of the select skin instead of its forwarded `BrnSelect` model; the fixture now uses the actual host directive.
- Coverage: both pagers reset empty results exactly once, clamp reduced totals/changed sizes/external pages, preserve valid pages on growth, react to the page-size selector's forwarded model, recover from invalid totals/sizes, normalize NaN/infinite/fractional/negative pages, hide bounded edges and honor `showEdges`. Direct client previous/next/first/last calls remain bounded even before correction effects run; rendered clicks and repeated boundary actions have exact output assertions. Reading derived page lists emits nothing. Huge totals/ranges with subnormal sizes render at most 100 window entries, safe-integer numeric links and one available edge. Helper cases cover ordinary start/middle/end windows, fractional positive division, compact ranges, invalid ranges and overflow saturation.
- Route contract verified with Angular `RouterTestingHarness` and real clicked previous/numbered/next anchors: default current-route and custom link paths, active-link non-navigation, repeated/unrelated query parameters (`filter`, `tag=a&tag=b`), route-driven page changes and invalid deep links, and bounded links after total/size changes. The parent still owns reading/synchronizing the URL. Corrections emit model changes once but never call router navigation or rewrite the URL; page-size persistence is also parent-owned. README's route example now uses a destruction-bound subscription and distinguishes the displayed page from the URL.
- Numeric/allocation contract: finite pages are floored/clamped; non-finite pages become 1. Non-positive/non-finite totals or sizes yield one page; size/total inputs are not rewritten. Positive fractional sizes retain ceil-division behavior, and page counts saturate at `Number.MAX_SAFE_INTEGER`. `maxSize`/helper range is floored and bounded to **1–100** entries including ellipses; invalid/non-positive ranges default to **7**. Ranges below 5 use a contiguous active-page window. Work/allocation is proportional to `min(pageCount, normalizedRange)`, with no full page-count array. Existing helper signatures/array API remain intact. Templates use positional window tracking so two ellipsis entries have distinct identities; model correction is an effect with untracked notification, while all computed derivations remain pure.
- Checks: `pnpm exec prettier --check packages/angular/projects/pagination/src/lib/hlm-numbered-pagination.ts packages/angular/projects/pagination/src/lib/hlm-numbered-pagination-query-params.ts packages/angular/projects/pagination/src/lib/pagination-state.ts packages/angular/projects/pagination/src/lib/hlm-numbered-pagination.spec.ts packages/angular/projects/pagination/README.md packages/angular/README.md packages/angular/test/run-library-tests.mjs docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 8 files**. `git diff --check` — passed. Reviewed focused diffs and worktree status; `git diff -- CHANGELOG.md` — empty. Only source/test whitespace formatting and documentation updates followed the passing 48-test run.
- No ABH-05 blocker or independent issue requiring coordinator action. Aggregate/artifact checks and emitted declarations remain ABH-FINAL's responsibility. No aggregate/artifact checks, commits or publishing were performed.

### Task ABH-06: Connect validation descriptions to interactive controls

Status: completed

Kind: defect

Priority: P1 — visible field instructions/errors are unavailable at the focused control.

Suggested agent: Angular accessible-forms engineer (fresh session)

Dependencies: ABH-05 (execution order)

Primary ownership: form-autocomplete, form-input-otp, form-slider, form-combobox wrappers/specs and their narrow primitive ARIA forwarding; package/project documentation as needed.

Finding: wrapper comments explicitly acknowledge disconnected descriptions for autocomplete, OTP and slider; multiple combobox chip input has no description binding. Styled `HlmError` does not automatically associate itself or announce messages.

References: `projects/form-autocomplete/src/lib/form-autocomplete.ts` (error/hint block); `projects/autocomplete/src/lib/hlm-autocomplete-input.ts` (forwarded inputs); `projects/form-input-otp/src/lib/form-input-otp.ts`; `projects/form-slider/src/lib/form-slider.ts`; `projects/form-combobox/src/lib/form-combobox.ts` (multiple input); `projects/form-field/src/lib/error.ts`. Paths relative to `packages/angular/`.

Requirements: forward current error/hint IDs to actual native inputs/focusable slider thumbs via explicit contracts, not host-only bindings or DOM queries. Keep required/invalid and existing accessible labels consistent. Never overwrite unrelated consumer descriptions without a documented contract.

Acceptance criteria: rendered control-level tests cover hints, touch/submit errors, correction/reset and multiple-combobox mode; every referenced ID resolves and obsolete conditional IDs disappear; relevant primitive/form tests pass. Record automated accessibility-tree/DOM coverage limits rather than claiming unperformed screen-reader validation.

Verification: targeted `test:library form-autocomplete form-input-otp form-slider form-combobox`, plus any newly affected suites; formatting/diff.

Completion evidence:

- Changed **25 paths**, preserving prior Angular/React work:
  - Wrappers/tests: `packages/angular/projects/form-autocomplete/src/lib/form-autocomplete.ts`, `packages/angular/projects/form-autocomplete/src/lib/form-autocomplete.spec.ts`, `packages/angular/projects/form-input-otp/src/lib/form-input-otp.ts`, `packages/angular/projects/form-input-otp/src/lib/form-input-otp.spec.ts`, `packages/angular/projects/form-slider/src/lib/form-slider.ts`, `packages/angular/projects/form-slider/src/lib/form-slider.spec.ts`, `packages/angular/projects/form-combobox/src/lib/form-combobox.ts`, `packages/angular/projects/form-combobox/src/lib/form-combobox.spec.ts`.
  - Primitives: `packages/angular/projects/autocomplete/src/lib/hlm-autocomplete-input.ts`, `packages/angular/projects/combobox/src/lib/hlm-combobox-input.ts`, `packages/angular/projects/combobox/src/lib/hlm-combobox-trigger.ts`, `packages/angular/projects/slider/src/lib/hlm-slider.ts`, new `packages/angular/projects/input-otp/src/lib/hlm-input-otp-control.ts`, new `packages/angular/projects/input-otp/src/lib/hlm-input-otp-control.spec.ts`, `packages/angular/projects/input-otp/src/lib/hlm-input-otp-slot.ts`, `packages/angular/projects/input-otp/src/public-api.ts`.
  - Test support/docs: new `packages/angular/test/validation-descriptions.ts`, `packages/angular/test/run-library-tests.mjs`, `packages/angular/projects/form-autocomplete/README.md`, `packages/angular/projects/form-input-otp/README.md`, `packages/angular/projects/form-slider/README.md`, `packages/angular/projects/form-combobox/README.md`, `packages/angular/projects/input-otp/README.md`, shipped `packages/angular/README.md`, and `docs/tasks/20260926-154324-angular-business-controls-health.md`.
- Pre-fix proof: after adding five rendered regressions, before implementation, `for project in form-autocomplete form-input-otp form-slider form-combobox; do pnpm --dir packages/angular test:library "$project"; done` ran the four suites sequentially. Each suite exited **1**, respectively **1 failed / 4 passed**, **1 failed / 3 passed**, **1 failed / 4 passed**, **2 failed / 7 passed** (**5 failed / 18 passed total**). Native autocomplete/OTP inputs, both slider thumbs, multiple chip input and single trigger all had null `aria-describedby` despite rendered hints.
- Final targeted command: `pnpm --dir packages/angular test:library form-autocomplete form-input-otp form-slider form-combobox input-otp` exited **0** with **8 + 8 + 8 + 15 + 5 = 44 passed** (**18 existing + 26 new**), using automatically resolved Chrome Headless **152.0.7977.75**. Registered the new input-otp primitive suite in the existing allowlist while retaining all prior registrations. Other affected primitives are exercised through the four wrapper suites.
- Coverage: actual focus and native label associations; hint IDs; touch-only and submit-only errors from settled pristine invalid fields; direct invalid-to-invalid `resetForm()` recovery; valid correction and subsequent reset; unique single-trigger/search IDs and live portaled descriptions; two slider thumbs and changing thumb count; dynamic IDs, hint removal, required flags and external description normalization/deduplication/removal. Every asserted description ID resolves to mounted nonempty text, and obsolete wrapper-owned conditional references disappear. OTP regressions also cover inherited autofocus, native attributes, input/paste, custom paste normalization, CVA/output/completion behavior, slot characters/caret, blur touching, disabled/reset behavior, registered Spartan field description merging, and the legacy brain/skin composition.
- Contract: wrapper `[aria-describedby]` (`string | null`, default null) supplies consumer-owned IDs, followed by the **currently displayed error OR hint**; external elements must stay mounted, and wrapper message IDs are reserved. Primitive forwarding uses `BrnFieldControlDescribedBy` to merge enclosing field registrations. No implementation DOM queries, attribute mutation or observation were added. The installed `HlmFormField` removes hints while displaying errors, so referencing both would leave a dangling ID. Destruction-bound parent form-event subscriptions refresh these four wrappers on submit/reset even without value/validity changes; an intermediate rendered regression demonstrated stale submit-only feedback after invalid-to-invalid reset before this was added.
- OTP adapter rationale: installed Spartan `BrnInputOtp` has no native description/required/invalid forwarding input. The additive `HlmInputOtpControl` (`hlm-input-otp`) subclasses its CVA/editing implementation and declares its native input template using supported inherited members. `HlmInputOtpSlot` reads its public context in the adapter branch and retains the original brain-slot branch for legacy compositions; no private brain injection token or runtime template patch is used. Public exports, README usage and primitive compatibility tests cover the additive contract.
- Labels/validation: autocomplete and OTP native inputs, multiple chip input and single trigger expose required state; OTP native input and slider thumbs now expose the existing form invalid state. Single mode keeps required/invalid selection state on the trigger and supplies descriptions plus a separate label to the popup search, preserving Spartan's search-versus-selection semantics. Slider labels remain on each thumb; `aria-required` is unsupported on the slider role, so its existing visual required marker remains. Angular validators stay independently configured.
- Checks: `pnpm --dir packages/angular test:source-exports` — **2 passed**; `pnpm --dir packages/angular test:public-api` — **3 passed**. Focused formatting passed for all **25 changed paths** with `pnpm exec prettier --check packages/angular/projects/form-autocomplete/src/lib/form-autocomplete{,.spec}.ts packages/angular/projects/form-input-otp/src/lib/form-input-otp{,.spec}.ts packages/angular/projects/form-slider/src/lib/form-slider{,.spec}.ts packages/angular/projects/form-combobox/src/lib/form-combobox{,.spec}.ts packages/angular/projects/{form-autocomplete,form-input-otp,form-slider,form-combobox,input-otp}/README.md packages/angular/projects/autocomplete/src/lib/hlm-autocomplete-input.ts packages/angular/projects/combobox/src/lib/hlm-combobox-{input,trigger}.ts packages/angular/projects/slider/src/lib/hlm-slider.ts packages/angular/projects/input-otp/src/lib/hlm-input-otp-{control,control.spec,slot}.ts packages/angular/projects/input-otp/src/public-api.ts packages/angular/test/validation-descriptions.ts packages/angular/test/run-library-tests.mjs packages/angular/README.md docs/tasks/20260926-154324-angular-business-controls-health.md`. `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty. Reviewed focused implementation/docs diffs and final worktree status. Edits, including formatting, used `apply_patch`.
- No ABH-06 blocker. Verification is **rendered browser DOM/focus coverage**, not accessibility-tree snapshots or screen-reader testing; no live-announcement claim is made. No aggregate/artifact builds, commits or publishing were performed. Independent finding reported to the coordinator without adding a deferred task: resetting a range slider while removing its focused second thumb can cause the brain host's `focusout` handler to re-touch the just-reset control. Intermediate rendered tests observed touched/error feedback after that sequence; the final reset regressions blur before resetting, as when focus moves to a reset action. This existing focus/CVA interaction is separate from description forwarding.

### Task ABH-07: React to toggle touch and reset without value changes

Status: completed

Kind: defect

Priority: P1 — wizard validation can remain invisible after markAllAsTouched.

Suggested agent: Angular reactive-form interaction engineer (fresh session)

Dependencies: ABH-06 (execution order)

Primary ownership: `projects/form-toggle/src/lib/form-toggle.ts` and spec.

Finding: `showError` tracks status/submission signals but reads nonreactive touched/dirty flags. Marking an already-invalid control touched leaves cached feedback stale. The existing test changes validity first, avoiding this case.

References: `packages/angular/projects/form-toggle/src/lib/form-toggle.ts` (`showError`, `ngDoCheck`, status subscription, lines 152–182); `form-toggle.spec.ts` (test comment about flapping validity).

Requirements: track interaction-only changes using the established wrapper pattern or destruction-bound control events; avoid broad wrapper rewrites and leaked subscriptions.

Acceptance criteria: settled false/requiredTrue control shows error after markAllAsTouched with no value/status change; reset to untouched/pristine while invalid restores hint; submit and disabled regressions pass. Regression must fail against prior implementation.

Verification: targeted `test:library form-toggle`, formatting/diff.

Completion evidence:

- Changed **3 paths**: `packages/angular/projects/form-toggle/src/lib/form-toggle.ts`, `packages/angular/projects/form-toggle/src/lib/form-toggle.spec.ts`, and `docs/tasks/20260926-154324-angular-business-controls-health.md`. ABH-06 was completed before this isolated sequential session; all prior Angular/React changes were preserved. The existing runner already registers form-toggle.
- Pre-fix proof: after adding regressions and removing the old validity-flapping workaround, before implementation changes, `pnpm --dir packages/angular test:library form-toggle` exited **1** with **4 failed, 4 passed**. Settled touch-only and dirty-only cases, combined interaction feedback, and the existing ID/message test failed because errors remained absent. The submit/reset and expanded disabled tests passed before the fix. Final same command exited **0** with **9 passed** (**4 existing + 5 new**), using automatically resolved Chrome Headless **152.0.7977.75**.
- Coverage: start settled `false` / `Validators.requiredTrue` / INVALID / untouched / pristine with visible hint; `form.markAllAsTouched()` produces no value/status emissions yet shows the error; `form.reset({ value: false })` remains INVALID and restores untouched/pristine/hint (only the expected same-value/status reset emissions occur). Parallel dirty-only coverage, clearing touched while still dirty then clearing pristine, silent touch/reset with explicit change detection, submit-only error and invalid-to-invalid `resetForm`, disabled native clicks under wrapper/form locks and re-enable interaction, IDs, labels, CVA writes and configured classes all pass. Event-driven regressions use `whenStable()` rather than forced component checks.
- Bounded fix: one `_interacted` signal mirrors touched OR dirty, initialized after the host FormControlName is available and read unconditionally by computed feedback. The existing single status subscription now observes `control.events`, refreshing status and interaction without adding another subscription; `takeUntilDestroyed(this._destroyRef)` retains lifecycle-safe cleanup. `ngDoCheck` mirrors interaction for silent updates and preserves the existing submit tracking. No public API change.
- Checks: `pnpm exec prettier --check packages/angular/projects/form-toggle/src/lib/form-toggle.ts packages/angular/projects/form-toggle/src/lib/form-toggle.spec.ts docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 3 files**. `git diff --check` — passed. `git diff -- packages/angular/projects/form-toggle/src/lib/form-toggle.ts packages/angular/projects/form-toggle/src/lib/form-toggle.spec.ts CHANGELOG.md` — reviewed. `git diff -- CHANGELOG.md` — empty. Final worktree status reviewed. All edits used `apply_patch`.
- No ABH-07 blocker. Existing Angular disabled-with-reactive-form warnings appear in both test runs; disabled assertions pass. No aggregate/artifact builds, commits or publishing were performed. Independent source finding for coordinator, without an additional deferred task: the button template in `form-toggle.ts` has no `aria-describedby` binding to its rendered hint/error IDs; this interaction-state fix does not establish control-level description association.

### Task ABH-08: Make phone-mask deletion work at separators

Status: completed

Kind: defect

Priority: P2 — normal keyboard correction can become stuck.

Suggested agent: browser input/CVA engineer (fresh session)

Dependencies: ABH-07 (execution order)

Primary ownership: `projects/phone-input/src/lib/hlm-phone-input.ts`, specs and focused wrapper regressions.

Finding: masking restores removed punctuation and positions the caret based only on preceding digits. Forward Delete immediately before the hyphen in `(415) 555-2671` restores the same text/caret instead of deleting the next logical digit. Existing tests cover append-only input.

References: `packages/angular/projects/phone-input/src/lib/hlm-phone-input.ts` (`_onInput`, caret handling, lines 125–144); `hlm-phone-input.spec.ts` (typing/truncation cases).

Requirements: account for deletion direction and selected ranges in logical digit coordinates, using browser input contracts. Preserve formatting, CVA output, disabled/read-only and normal replacement behavior; do not introduce a dependency solely for masking.

Acceptance criteria: forward/backward deletion around closing parenthesis, space and hyphen removes the intended digit and leaves a usable caret; selection replacement, paste, empty input and existing model formats pass. Include a real-browser keyboard-driven check (not only directly calling handlers), with reproducible command/evidence.

Verification: targeted `test:library phone-input form-phone-input` plus focused browser keyboard probe; formatting/diff.

Completion evidence:

- Changed **9 paths**: `packages/angular/projects/phone-input/src/lib/hlm-phone-input.ts`, `packages/angular/projects/phone-input/src/lib/hlm-phone-input.spec.ts`, new `packages/angular/projects/phone-input/src/lib/hlm-phone-input.keyboard.spec.ts`, `packages/angular/projects/form-phone-input/src/lib/form-phone-input.spec.ts`, `packages/angular/projects/phone-input/README.md`, new `packages/angular/test/phone-input-edit.ts`, new `packages/angular/test/phone-keyboard.karma.cjs`, new `packages/angular/test/phone-keyboard-probe.mjs`, and this task document. ABH-07 was completed before this isolated sequential session; prior Angular/React work was preserved. Both normal suites were already registered; the shared runner and dependencies required no changes. All edits, including formatting, used `apply_patch`.
- Before-fix proof: `pnpm --dir packages/angular test:library phone-input form-phone-input` exited **1** with **6 failed / 18 passed** in phone-input and stopped before the wrapper suite. Forward Delete before `)`/space/hyphen and Backspace after those separators retained all digits and emitted no change; backward cases also left the wrong caret. These regressions dispatch `beforeinput`, perform the browser's default text edit only if uncanceled, then dispatch `input`; they never call component handlers directly. The same pre-fix source also failed `node packages/angular/test/phone-keyboard-probe.mjs` with exit **1**: actual Chrome Home → four ArrowRight presses → Delete yielded `{text:"(415) 555-2671", model:"4155552671", selection:[4,4], changes:[]}` instead of deleting the following digit. The Angular fixture reported the probe assertion as a failed test.
- Final targeted command: `pnpm --dir packages/angular test:library phone-input form-phone-input` exited **0**, with **31 phone-input + 7 form-phone-input = 38 passed** (**11 existing + 27 new**). Coverage includes both deletion directions at every boundary around `)`, space and hyphen; selected digits plus separators; punctuation-only and whole-input selections; digit/formatted CVA shapes; native replacement/paste normalization and truncation; null clearing; no-op notification suppression; silent programmatic writes; blur touching; readonly, input-disabled and form-disabled guards; canceled edit intent; custom multi-character separators with distinct digits; and wrapper value/validation propagation.
- Final real-browser command: `node packages/angular/test/phone-keyboard-probe.mjs` exited **0**, reporting **66 real-keyboard scenarios** plus **1 passing Angular fixture test**. Browser: **HeadlessChrome/152.0.7977.75**, resolved via the existing shared configuration to `<repo-root>/packages/angular/.puppeteer-cache/chrome-headless-shell/linux-152.0.7977.75/chrome-headless-shell-linux64/chrome-headless-shell`; installed Puppeteer **25.10.0**. The probe starts `pnpm exec ng test phone-input --watch=false --progress=false --karma-config=test/phone-keyboard.karma.cjs --include=**/hlm-phone-input.keyboard.spec.ts` from `packages/angular`, connects its own Puppeteer Chrome to Karma port **9877** (`PHONE_KEYBOARD_PORT` override), and cleans up its browser/runner. Normal suites leave the opt-in fixture inactive.
- Keyboard evidence detail: **10** separator/direction cases log trusted, cancelable `beforeinput` events and assert native caret/model/exact emissions. Delete at position **9** in `(415) 555-2671` now produces `(415) 555-671`, model `415555671`, selection `[9,9]`, and exactly one value change; Backspace at **10** produces `(415) 552-671`, model `415552671`, selection `[8,8]`, and one change. **48** cases across primitive/wrapper × digits/formatted modes cover repeated Delete, both keys on digit/punctuation/full selections, typing over a selection, real clipboard Ctrl+C/Ctrl+V with trusted `insertFromPaste`, empty editing, maximum-length typing, repeated Backspace to empty and Tab blur touching. **6** cases verify readonly/input-disabled/form-disabled keyboard rejection on both controls; **2** verify distinct-digit custom formatting. All caret/selection placement uses actual Home/Arrow/Shift keys; fixture methods only reset/read form state and finish the test, never invoke editing handlers. Actual clipboard paste replaces the selection and retains the existing first-10-digits normalization.
- Bounded contract: cancelable `beforeinput` supplies `deleteContentBackward` / `deleteContentForward` and the original native selection. Collapsed deletions remove one adjacent logical digit in that direction; selected ranges remove only their contained digits, with punctuation-only selections collapsing without deleting outside the selection. The shared render path restores the caret after the preceding logical digit and retains existing model formatting/maxDigits/null semantics. Other input types use the existing native edit followed by `input` normalization; disabled/readonly paths reject edits. No cached key/selection state or mask dependency was introduced. README and JSDoc document editing and the digit-preserving formatter contract. Browser evidence covers Chrome desktop keyboard/clipboard contracts, not mobile IME or other engines; noncancelable/missing-beforeinput edits retain the existing normalization fallback.
- Checks: `pnpm exec prettier --check packages/angular/projects/phone-input/src/lib/hlm-phone-input.ts packages/angular/projects/phone-input/src/lib/hlm-phone-input.spec.ts packages/angular/projects/phone-input/src/lib/hlm-phone-input.keyboard.spec.ts packages/angular/projects/form-phone-input/src/lib/form-phone-input.spec.ts packages/angular/projects/phone-input/README.md packages/angular/test/phone-input-edit.ts packages/angular/test/phone-keyboard.karma.cjs packages/angular/test/phone-keyboard-probe.mjs docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 9 paths**. `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty. Focused implementation/test/docs diffs and final worktree status reviewed. Only formatting/documentation edits followed the passing tests.
- No ABH-08 blocker or independent issue requiring a coordinator follow-up. Existing Angular disabled-with-reactive-form warnings appear in the suites/probe; assertions pass. Karma also logs a manual-browser disconnect during successful probe server shutdown, after `TOTAL: 1 SUCCESS`; the probe verifies the runner's **0** exit status. No aggregate/artifact builds, commits, publishing or new deferred tasks were performed.

### Task ABH-09: Add usable local search to searchable multiselect

Status: completed

Kind: improvement

Priority: P2 — finding assignments in a long option list should match the component's advertised purpose.

Suggested agent: Angular selection UX engineer (fresh session)

Dependencies: ABH-02, ABH-08

Primary ownership: `projects/searchable-multiselect/src/lib/searchable-multiselect.ts`, specs, README; wrapper forwarding only if needed.

Finding: the popover loops over every option with no search input/filter, despite its name and the default “Start typing to add…” placeholder. Chip remove controls are symbol-only and need meaningful names in this workflow.

References: `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.ts` (popover template, lines 77–93; chip remove button, lines 47–55).

Requirements: add a labeled keyboard-usable local search field with case-insensitive matching, clear empty-results feedback, and named remove actions; filter via reactive derivation without mutating input options or losing hidden selections. Use configurable search/empty copy where appropriate; avoid remote loading/virtualization scope.

Acceptance criteria: typed search filters options, no matches are announced, clearing restores choices; selecting across filters preserves all values; disabled state blocks edits; chip actions have meaningful accessible names; ABH-02 asynchronous/CVA regressions pass. Document usage and local-search scope.

Verification: targeted `test:library searchable-multiselect form-searchable-multiselect`, formatting/diff.

Completion evidence:

- Changed **8 paths**: `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.ts`, `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.spec.ts`, `packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.ts`, `packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.spec.ts`, `packages/angular/projects/searchable-multiselect/README.md`, `packages/angular/projects/form-searchable-multiselect/README.md`, shipped `packages/angular/README.md`, and `docs/tasks/20260926-154324-angular-business-controls-health.md`. Read ABH-02's implementation/tests and confirmed ABH-02/ABH-08 completed before this isolated sequential session. Existing registrations and prior Angular/React work were preserved. All edits, including formatting, used `apply_patch`.
- Before-fix proof: `pnpm --dir packages/angular test:library searchable-multiselect form-searchable-multiselect` exited **1** with **2 failed / 14 passed** in searchable-multiselect and stopped before the wrapper suite. New rendered regressions found no search input and null accessible names on both resolved/unresolved chip remove buttons. Final same command exited **0** with **22 searchable-multiselect + 6 form-searchable-multiselect = 28 passed** (**19 existing + 9 new**), using automatically resolved Chrome Headless **152.0.7977.75**. Only formatting/documentation edits followed that passing run.
- Coverage: typed input events with trimmed mixed-case label matching, no-match status text and recovery on clearing; source-order results; selecting/deselecting across filters in standalone/CVA modes; frozen caller options/values; hidden chips retaining labels and unresolved IDs; async arrivals/relabeling/disappearance and external writes/clears during an active query; localized/reactively updated copy and remove names; all three primitive disabled sources plus wrapper/form locks while open; exact selection/CVA/touched notifications; existing ABH-02 reactive forms, ngModel, reset, ownership and payload-isolation regressions. The wrapper regression verifies copy forwarding and async assignment preservation through search, selection, disable/enable and reset.
- Search contract: a local signal and pure computed filter derive visible options by `label.toLowerCase().includes(query.trim().toLowerCase())`, preserving source order and the complete supplied option/selection arrays. Empty/whitespace queries restore choices. Search neither changes/touches selection nor emits output/CVA callbacks; it persists across close/reopen and external value resets. Search uses a visibly associated native label, disabled native input plus guarded input handler, and Enter submission prevention. A persistent `role="status"`, `aria-live="polite"`, `aria-atomic="true"` region contains configurable empty feedback. Additive `searchLabel`, `searchPlaceholder`, `emptyMessage`, and pure `removeLabel: (option: SelectOption) => string` inputs are documented in JSDoc/project/package READMEs and forwarded by the form wrapper. Default remove names use the current resolved label or raw unresolved ID. Search is label-only/local; no remote/virtualized behavior was added.
- Keyboard/accessibility evidence: browser tests verify default initial search focus, native input/checkbox button tab stops and actual focusability, canceled Enter default, Escape closing/restoring trigger focus, query persistence on reopening, label associations, chip accessible-name attributes and live-region DOM updates. These are rendered DOM/focus tests with dispatched input/key events, not a trusted-keyboard probe, accessibility-tree snapshot or screen-reader announcement test.
- Checks: `pnpm exec prettier --check packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.ts packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.spec.ts packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.ts packages/angular/projects/form-searchable-multiselect/src/lib/form-searchable-multiselect.spec.ts packages/angular/projects/searchable-multiselect/README.md packages/angular/projects/form-searchable-multiselect/README.md packages/angular/README.md docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 8 paths**. `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty. Focused implementation/docs/test diffs and worktree status reviewed.
- No ABH-09 blocker. Aggregate/artifact builds and emitted declarations remain ABH-FINAL's checks. No commits, publishing or new deferred tasks. Independent source finding for coordinator: `HlmCheckbox` defaults `id` to null and explicitly forwards it to Spartan; installed `BrnCheckbox` derives an automatic enclosing-label ID as `state.id + '-label'`, which becomes `null-label` for every un-ID'd checkbox row. This pre-existing primitive labeling path warrants separate duplicate-ID/accessible-name review (`projects/checkbox/src/lib/checkbox.ts`, native ID forwarding; `node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-checkbox.mjs`, constructor `afterRenderEffect`). ABH-09 does not claim checkbox-row accessible-name remediation. The incorrect project README Spartan peer statement already reported under ABH-02 remains an independent documentation finding.

### Task ABH-FINAL: Independently verify all task outcomes and package contracts

Status: completed

Kind: improvement

Priority: P1 — integrate behavior, declarations, documentation, and installed artifacts.

Suggested agent: independent Angular integration reviewer (fresh session; not an implementation agent)

Dependencies: ABH-01, ABH-02, ABH-03, ABH-04, ABH-05, ABH-06, ABH-07, ABH-08, ABH-09, ABH-FU-01, ABH-FU-02, ABH-FU-03

Primary ownership: this task file, integration checks, minimal integration fixes only if needed (explicitly recorded).

Finding: isolated fixes are insufficient evidence that public declarations, both published variants, examples, and aggregate tests agree.

References: task criteria above; `packages/angular/package.json`, `test/run-library-tests.mjs`, `publish.config.mjs`, `test/isolated-consumers.mjs`.

Requirements: review all acceptance criteria and diffs independently; inspect resource cleanup and alternate user commit paths; run the shared aggregate/package/example/artifact checks serially. Inspect emitted declarations for added public contracts and both package identities. Check new tests are actually included. Verify root changelog unchanged and each task's evidence is accurate. Correct the reported searchable-multiselect README peer statement against package metadata as part of documentation integration. Record any needed follow-up as a task before expanding scope.

Acceptance criteria: all nine original implementation tasks and three coordinator-triaged follow-ups are completed with supported evidence; applicable aggregate/source/package, example build/tests, plain/tw release preparation and isolated consumers pass; no untriaged blocking regression remains; complete final review evidence identifies limitations and protected-file status.

Verification: all shared integration commands above; no publish/commit. Coordinator performs a final task-file audit after this independent review.

Session start: fresh independent reviewer; all twelve dependencies are completed. Read the entire task record and current worktree inventory. Reviewing Angular tracked diffs and added files, test registration, supported framework/type contracts and cleanup, then running shared checks serially and inspecting both staged artifacts and exact installed tarball consumers. Concurrent React/Next.js work is preserved.

Completion evidence (independent final review):

- Read the complete task file, Angular tracked diffs and added implementation/test/support files. Reviewed all twelve tasks against the current implementations, rendered assertions, public documentation and installed CDK/Spartan contracts. Historical before-fix results remain the originating sessions' evidence; this session independently ran the final source and artifacts. No blocking behavioral/type regression remains in the reviewed scope. The document's overall status stays **in_progress** for the coordinator's final audit.
- **ABH-01 / FU-01:** verified synchronous selection reconciliation before TanStack consumes new rows, stable callback identity, memoized data, current-object/source-order outputs and untracked notifications. The final table suite has **34** tests, including table/grid replacement, stable refresh, no-ID clearing, page selection and native mixed headers. Checkbox's **8** tests plus form-checkbox's **8** exercise mixed-to-true interaction, boolean CVA compatibility and deterministic own-label IDs. IDs still require immutable updates, stable unique entity IDs and distinct application APP_IDs as documented.
- **ABH-02 / ABH-09:** verified selected IDs are independent from labels and filtered options; first CVA write owns selection, notifications receive separate arrays, disabled handlers guard edits, and local search does not change selection/touch. Final searchable-multiselect **23** and wrapper **6** tests cover asynchronous options, unresolved IDs, filtering, copy, focus/keyboard semantics and checkbox labels.
- **ABH-03:** reviewed raw and transformed adapter-based bounds, all three typed commit paths, explicit clear, repeated programmatic writes, local rejected-draft state and guarded calendar-model restoration. Date-picker **57** plus three wrappers **6 each** pass. Non-native Jalali adapter coverage is real; local `inputInvalid` is deliberately not an Angular validator. The internal shared input base/state is packaged through the picker bundle without an additional public helper export.
- **ABH-04 / FU-02:** compared the header preview and completion-presence accessor with installed CDK `selectedIndex`, predecessor checks and reset semantics. Actual activation stays with CDK; view-header registration restores its key manager. **154** stepper tests cover optional/completed/invalid/pending/nonlinear/backward behavior, both orientations, click/Enter/Space, Signal Fields, classic async completion and subscription detachment.
- **ABH-05:** reviewed bounded arithmetic (including overflow/subnormal sizes), pure page derivations, effect-based model correction and query links. **48** pagination tests verify bounded allocation, once-only correction, unrelated/repeated query preservation and no unsolicited route rewrite.
- **ABH-06 / ABH-07 / FU-03:** reviewed native-level description bindings, error-versus-hint lifecycle, external-ID deduplication, unique trigger/search IDs, OTP inherited CVA/template contracts and slider thumb forwarding. Autocomplete **8**, form OTP **8**, OTP primitive **5**, slider **8**, combobox **15**, toggle **13** tests pass. Toggle interaction-only events and silent-update fallback are retained. Parent form-event subscriptions use `takeUntilDestroyed`; step-control subscriptions also unsubscribe on replacement; signal effects use Angular ownership. OTP keeps the inherited one-shot render lifecycle and declarative handlers. No implementation DOM-query/observer workaround was introduced.
- **ABH-08:** reviewed logical digit deletion and native selection handling, cancellation/read-only/disabled guards, no-op notifications, fixture cleanup and the probe's browser/process teardown. Phone **31** and wrapper **7** tests pass. Independently reran `node packages/angular/test/phone-keyboard-probe.mjs`: **66 trusted keyboard/clipboard scenarios + 1 Angular fixture passed**, exit **0**, Chrome **152.0.7977.75**. The opt-in keyboard fixture is intentionally inactive in the aggregate; the normal phone specs and all six newly registered project suites are included by `test/run-library-tests.mjs`.

Serial shared verification (all final results exit **0**; commands run from repository root):

- `pnpm --dir packages/angular test:libraries` — **2 source-export checks + 532 browser tests across 33 registered projects**, including the existing real SSR hydration fixture. Tool-output log path scrubbed (session-local). Separate `test:source-exports` correctly reused this pass.
- `pnpm --dir packages/angular test:public-api` — **3 passed**.
- `pnpm --dir packages/angular test:build-all` — initially **6 passed**; after the integration regression below, **7 passed**.
- `pnpm --dir packages/angular test:dependency-contract` — **3 passed**.
- `pnpm --dir packages/angular test:package-validator` — **15 passed**, including negative runtime/declaration identity, absent target, metadata, source-map and exact npm pack-file-list cases.
- `pnpm --dir packages/angular test:variants` — **5 passed**; rerun after the build-scanner integration fix, **5 passed**.
- `pnpm --dir packages/angular test:example-boundary` — **5 passed**. This source-boundary check is not itself installed-package evidence.
- `pnpm --dir packages/angular/@examples/standard build` — passed; **94 prerendered routes**, output `packages/angular/@examples/standard/dist/angular`; initial bundle **851.37 kB**.
- `pnpm --dir packages/angular/@examples/standard test:ci` — final canonical run **345 passed**, including narrow-viewport checks (session-local log path omitted). See diagnostic history below.
- `pnpm --dir packages/angular prepare:release --version 0.0.0-business-controls.0` — passed after the bounded integration correction below: **87 builds per variant**, both validators report **351 packed files** (session-local log path omitted). Prepare-only; no publishing.
- `pnpm --dir packages/angular verify:consumers --release-dir release` — both exact tarballs installed with npm, `tsc --noEmit`, production Angular build, installed-package Tailwind stylesheet-prefix assertions and SSR button render passed; incompatible Angular 21 required-peer install rejected with the expected peer diagnostic. Temporary outputs were under `TMPDIR=<repo-root>/node_modules/.cache/ng-consumers/{plain,tw}/consumer/dist/consumer`; the runner removed its temporary root in `finally`.

Explicit integration fixes and diagnostic history:

1. Corrected only the reported peer paragraph in `projects/searchable-multiselect/README.md`: Spartan **is** a peer, `>=1.3.2 <2.0.0`; composed theme controls do not bundle away that requirement. The corrected paragraph is present in both staged and packed project READMEs.
2. Release preparation exposed a false production dependency cycle: `form-phone-input -> phone-input -> form-phone-input`. `build-all.mjs` scanned ABH-08's `hlm-phone-input.keyboard.spec.ts`, whose wrapper import is valid test composition but excluded by library tsconfigs. Added a meaningful reverse-test-import regression in `test/build-all.test.mjs`: pre-fix **1 failed / 6 passed**, then excluded `*.spec.ts` at the build dependency scanner (matching `tsconfig.lib.json`). Final **7/7** build tests, **5/5** variant tests, and both complete 87-project release builds passed. Runtime cycle detection remains tested. Also applied two existing Prettier-only corrections in the same build file (trailing function semicolon and argument wrapping). No component implementation changed during final review.
3. The prepare toolkit requires absent/empty stage directories; its first attempt rejected existing ignored `release/plain`. Inspected existing manifests (**0.6.0**) and confirmed no tracked release files, then preserved the two old stage directories under `TMPDIR=<repo-root>/node_modules/.cache/abh-preexisting-release/{plain,tw}` using the temporary review helper `node <repo-root>/node_modules/.cache/abh-preserve-release.mjs` (ignored, removed afterwards). Older `.tgz` files remain in `release`. The final command used the requested `release` paths and version; no release flag workaround or source metadata change was needed.
4. Initial canonical example `test:ci` exited **1** with **0 specs** after test-module loading errors. A temporary remote-debugging run loaded all specs but produced **2 narrow-viewport failures / 343 passes** (data-table/layout-simple); that Puppeteer diagnostic used its default viewport rather than preserving Karma's phone viewport. The subsequent unmodified canonical `test:ci` passed **345/345**, so the diagnostic run is not acceptance evidence and no layout/test assertion was weakened. The first module-load failure was not reproduced or assigned a proven root cause.

Artifact/declaration and installed-contract evidence:

- Final stages: `packages/angular/release/plain` = `@egose/shadcn-theme-ng@0.0.0-business-controls.0`; `packages/angular/release/tw` = `@egose/shadcn-theme-ng-tw@0.0.0-business-controls.0`. Both have **87 component subpath exports**, real `types` / `default` targets, Apache-2.0 license, real author, required peers, `sideEffects: false`, and no private/scripts/devDependencies/packageManager or leaked `exports.json`/source maps. The pre-existing `bundles` metadata still passes through; it does not affect resolution. `dist` is the last **tw** build workspace, not an installed package manifest. Actual declaration paths are **`<project>/types/<project>.d.ts`**, not `index.d.ts`.
- Inspected both variants' `data-table/types/data-table.d.ts` (`getRowId: InputSignal<((row: TData) => string) | undefined>` and selection JSDoc); searchable-multiselect and wrapper declarations (typed search copy, `SelectOption`, `removeLabel` and CVA ownership); autocomplete/combobox/slider and all five described wrappers (`aria-describedby` Angular aliases); `input-otp/types/input-otp.d.ts` (exported `HlmInputOtpControl extends BrnInputOtp`, native-description/required inputs and Imports/Module inclusion); `date-picker/types/date-picker.d.ts` (generic single/range/multi boolean commits and inherited `inputInvalid`, distinct programmatic-write JSDoc). Month/year's existing void commit remains distinct. Runtime bundles preserve matching package imports and class-prefix identity; the validators checked every emitted declaration/runtime import.
- `python <repo-root>/node_modules/.cache/abh-artifact-audit.py` (temporary repo-local helper, removed afterwards) passed: **all 351 regular files in each exact tarball byte-match its stage and installed copy**; **87 declaration pairs are identical after package-name normalization**. Tarballs:
  - `packages/angular/release/egose-shadcn-theme-ng-0.0.0-business-controls.0.tgz`; SHA-256 `56801fafe19eff019ec4329ae156d57427fda0eac9d5f1a3d43044ae8ac8eb9d`.
  - `packages/angular/release/egose-shadcn-theme-ng-tw-0.0.0-business-controls.0.tgz`; SHA-256 `04a7c44329b41e22a976c51cd7326d68c917e8fa2d78c3a5b179dacfeae79272`.
- Additional focused installed-declaration check: `<repo-root>/node_modules/.cache/abh-contract-consumer/contracts.ts` (temporary repo-local fixture, removed afterwards) imports **both exact installed tarballs** via public subpaths, with no TS source aliases or package symlinks. Strict Angular templates compile typed `getRowId`/selection outputs, search and wrapper copy, inherited OTP inputs/slots, all five wrapper ARIA inputs, and all three picker boolean commit/input-invalid contracts. From that directory, `node node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js -p tsconfig.json` (run with the repository's Linux Node **26.7.0**; `$(pwd)` is the repo checkout) passed, emitting `out/contracts.js`. The initial optional fixture's plain `npm run check` hit an outside-worktree toolchain fallback and directory error; invoking the installed compiler with the repository's Linux Node **26.7.0** corrected this environment prerequisite. Installed copies and fixture remained under `TMPDIR=<repo-root>/node_modules/.cache/abh-contract-consumer` for coordinator inspection. The standard isolated-consumer command above independently passed its full builds/rendering.
- Formatting passed for **all changed tracked Angular files** using `git diff --name-only -z -- packages/angular | xargs -0 pnpm exec prettier --check`, and **all added Angular files plus this task** using `git ls-files --others --exclude-standard -z -- packages/angular docs/tasks/20260926-154324-angular-business-controls-health.md | xargs -0 pnpm exec prettier --check`. `git diff --check` passed; `git diff HEAD -- CHANGELOG.md` is empty. Final process inspection found no remaining review-owned Angular build/Karma/hydration/probe processes. All source/document edits used `apply_patch`; no commits or publishing occurred; concurrent React/Next.js work was preserved.
- Limitations: browser accessibility evidence is DOM/focus, not screen-reader/accessibility-tree testing; trusted keyboard coverage is desktop Chrome, not mobile IME/other engines. Earlier coordinator-bounded input-group/slider-reset/stepper-panel observations remain as documented. Existing reactive-form disabled, NG0956, unused autocomplete-label, Node deprecation and example budget warnings remain non-failing. Temporary consumer npm installs report an advisory count; no dependency audit/remediation or clean-security claim is part of this review. Passing source checks were reused after the build-only fix; affected build/variant/artifact checks were rerun. No required check remains unrun/failing, and no new blocking follow-up is required.

## Coordinator-triaged follow-ups discovered during implementation

Execute these three tasks sequentially **before ABH-FINAL**. The original nine tasks exposed shared-control gaps worth closing in this objective. Other observations (input-group forceInvalid outside date pickers, slider focused-thumb removal during reset, existing disabled-binding warnings, horizontal stepper animation recreation warnings) remain bounded coverage limitations: no broad wrapper/dependency rewrite is required for these outcomes. They are not additional executable tasks here. Concurrent React work is owned by other sessions and must be preserved.

### Task ABH-FU-01: Forward checkbox indeterminate state to the native control

Status: completed

Kind: defect

Priority: P2 — partial bulk selection is announced as fully checked.

Suggested agent: Angular checkbox primitive engineer (fresh sequential session)

Dependencies: ABH-09

Primary ownership: `packages/angular/projects/checkbox/src/lib/checkbox.ts`, focused primitive/wrapper tests, and data-table header regression.

Finding: ABH-01's real-browser table/grid test observed native `aria-checked="true"` when `EgTableHeadSelection` correctly supplied `HlmCheckbox.checked() === 'indeterminate'`. `HlmCheckbox` forwards that string only to Spartan's boolean `checked` input; Spartan 1.3.2 exposes a separate `indeterminate` model. This predates the row-identity fix and affects primitive mixed-state presentation/interaction independently. A temporary native-mixed assertion failed during ABH-01; the retained test checks the table's supplied tri-state model. ABH-09 also found the default null ID forwarded to brain creates duplicate enclosing `null-label` IDs across options.

References: `packages/angular/projects/checkbox/src/lib/checkbox.ts` (`checked` binding, default `id`, `writeValue`); `projects/data-table` header selection; installed Spartan `BrnCheckbox` indeterminate and label generation contracts.

Requirements: explicitly forward indeterminate state through the primitive's supported contract, preserve boolean/CVA/disabled behavior, and define clicking a partially checked bulk selector consistently. Resolve default checkbox ID/label identity at the same shared boundary using the existing hydration-safe application-scoped ID mechanism; preserve explicit consumer IDs. Avoid DOM-query patches. Document the contract.

Acceptance criteria: partially selected table header exposes `aria-checked="mixed"` on its actual checkbox; clicking it selects the displayed page; transitions among mixed/checked/unchecked and existing form-checkbox behavior pass rendered browser tests. Multiple nested labels resolve to distinct own checkbox names, including the multiselect list; explicit IDs and application-scoped deterministic generation remain correct.

Verification: `pnpm --dir packages/angular test:library data-table form-checkbox searchable-multiselect` plus new registered checkbox suite and focused formatting/diff checks.

Triage history: initially deferred by the narrowly assigned ABH-01 agent. Coordinator promoted it after ABH-09 confirmed a second defect at the same primitive boundary; the user's overall instruction authorizes completing actionable review tasks.

Completion evidence:

- Changed **8 paths**: `packages/angular/projects/checkbox/src/lib/checkbox.ts`, new `packages/angular/projects/checkbox/src/lib/checkbox.spec.ts`, `packages/angular/projects/checkbox/README.md`, `packages/angular/projects/data-table/src/lib/eg-data-table.spec.ts`, `packages/angular/projects/form-checkbox/src/lib/form-checkbox.spec.ts`, `packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.spec.ts`, `packages/angular/test/run-library-tests.mjs`, and this task document. Registered checkbox while preserving prior registrations. This isolated sequential session read the full task, confirmed ABH-09 completed, and used `apply_patch` for all edits; prior and concurrent Angular/React work was preserved.
- Pre-fix proof: `pnpm --dir packages/angular test:library checkbox` exited **1**, **8 failed / 0 passed**. `for project in data-table searchable-multiselect; do pnpm --dir packages/angular test:library "$project"; done` ran sequentially; each suite exited **1**, respectively **2 failed / 32 passed** and **1 failed / 22 passed**. Native mixed state was incorrectly true, mixed clicks deselected, CVA writes coerced mixed to true, fallback button IDs were empty, and duplicate `null-label` IDs made Beta resolve to Alpha's label.
- Final targeted command: `pnpm --dir packages/angular test:library checkbox data-table form-checkbox searchable-multiselect` exited **0**, **8 + 34 + 8 + 23 = 73 passed**, under automatically resolved Chrome Headless **152.0.7977.75**. Coverage includes native `aria-checked`/`data-state` transitions, mixed-click boolean notifications, input/CVA writes, null reset, reactive forms/ngModel, all three disabled locks, wrapper boolean editing/reset, table/grid mixed state and displayed-page-only selection, nested-label identity, explicit/replaced/null-restored IDs, per-application deterministic generation, and multiselect names through filtering/relabeling. An intermediate ngModel assertion observed DOM before its asynchronous write rendered when forcing detection; the final signal-bound fixture uses Angular's scheduled `whenStable()` flow and asserts both CVA model and DOM. Only formatting/docs edits followed the passing run.
- Contract: boolean checked and indeterminate are forwarded separately through supported Spartan inputs. Mixed renders `aria-checked="mixed"` on the actual `button[role="checkbox"]`; clicking mixed selects true, then toggles boolean values. CVA preserves `'indeterminate'`, null clears to false, and programmatic writes do not emit `changed`/CVA `onChange` or touch. Null/omitted IDs use one `HlmFormIdGenerator.generate('hlm-checkbox')` fallback per instance; explicit IDs and existing label IDs are retained. Matching application `APP_ID` and creation order reproduce the shared application-scoped sequence; multiple mounted applications need distinct `APP_ID` values. No implementation DOM-query/attribute patch or new global counter was added. README and public JSDoc document these behaviors.
- Checks: `pnpm --dir packages/angular test:source-exports` — **2 passed**; `pnpm --dir packages/angular test:public-api` — **3 passed**. `pnpm exec prettier --check packages/angular/projects/checkbox/src/lib/checkbox{,.spec}.ts packages/angular/projects/checkbox/README.md packages/angular/projects/data-table/src/lib/eg-data-table.spec.ts packages/angular/projects/form-checkbox/src/lib/form-checkbox.spec.ts packages/angular/projects/searchable-multiselect/src/lib/searchable-multiselect.spec.ts packages/angular/test/run-library-tests.mjs docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 8 paths**. `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty. Focused source/test/docs changes and final worktree status reviewed.
- No ABH-FU-01 blocker or new independent issue. Accessibility coverage is rendered browser DOM, not a screen-reader/accessibility-tree test. ID tests use separate application injectors with matching/different `APP_ID`, not a new SSR hydration build. Existing Angular disabled-with-reactive-form warnings appear in the primitive fixture; assertions pass. No aggregate/artifact builds, commits or publishing were performed.

### Task ABH-FU-02: Align header navigation affordances with step eligibility

Status: completed

Kind: defect

Priority: P1 — allowed destinations can be presented as disabled and reject pointer navigation.

Suggested agent: Angular CDK accessibility engineer (fresh sequential session)

Dependencies: ABH-FU-01

Primary ownership: `projects/stepper/src/lib/hlm-stepper.ts`, `hlm-step-header.ts` if needed, specs and README.

Finding: ABH-04 found header `aria-disabled`/pointer styling uses destination `isNavigable()` instead of the preceding-step eligibility used by CDK selection. Its tests exercised a completed/enabled destination, leaving ordinary incomplete destinations unverified.

References: `packages/angular/projects/stepper/src/lib/hlm-stepper.ts` (`stepHeaderTemplate`, lines 87–119); `hlm-step-header.ts`; CDK `CdkStepper.selectedIndex` and preceding-control eligibility.

Requirements: make header disabled styling/ARIA and activation agree with actual CDK transition rules for ordinary unvisited destinations, optional/required/pending predecessors and backward editable constraints. Prefer public/protected supported contracts and minimal policy duplication; do not reach private framework fields. Preserve existing Next touch behavior and header keyboard behavior. Document any deliberate navigation distinction.

Acceptance criteria: an eligible unvisited destination is not disabled; blocked destinations are reported correctly and cannot navigate; click and keyboard honor linear/nonlinear, pending/optional/completed and backward editable rules in both orientations. Existing ABH-04 tests stay green.

Verification: `pnpm --dir packages/angular test:library stepper`, formatting/diff.

Session start: isolated sequential ABH-FU-02 session; ABH-FU-01 is completed. Read current stepper implementation/specs/README and installed CDK 22.1.3 source/declarations (`selectedIndex`, `completed`, `isNavigable`, keyboard handling and predecessor checks) before claiming ownership. Preserve prior Angular and concurrent React edits. CDK's predecessor helper is private; preview must use supported accessors and account for the interaction that selection will perform, including explicit false versus default completion on a control-less current step.

Completion evidence:

- Changed **5 paths**: `packages/angular/projects/stepper/src/lib/hlm-stepper.ts`, `packages/angular/projects/stepper/src/lib/hlm-step.ts`, `packages/angular/projects/stepper/src/lib/hlm-stepper.spec.ts`, `packages/angular/projects/stepper/README.md`, and this task document. The narrow `HlmStep` change tracks completion-input presence through the inherited public accessor and refreshes classic-form status; no final change to `hlm-step-header.ts` or the already-registered runner was needed. All edits used `apply_patch`, preserving ABH-04 and prior Angular/concurrent React work.
- Pre-fix proof: after adding **102 new regressions** and correcting the old header assertions to expect blocked affordances, before implementation, `pnpm --dir packages/angular test:library stepper` exited **1**, **99 failed / 41 passed**. Failures demonstrated disabled eligible/unvisited headers, enabled blocked/completed destinations and non-editable backward headers, inconsistent selected vertical state, and keyboard focus/activation failure. Captured tool-output log path scrubbed (session-local).
- Final targeted command: `pnpm --dir packages/angular test:library stepper` exited **0**, **154 passed** (**38 existing + 116 new**) using Chrome Headless **152.0.7977.75**. Final tool-output log path scrubbed (session-local). An earlier implementation run passed 140 before adding reset, real Signal Field and subscription-lifetime regressions; only formatting/docs edits followed the final 154-test run.
- Coverage: **19 scenarios through click, Enter and Space in both orientations**, plus **2 subscription-lifetime tests**. Assertions compare pre-activation `aria-disabled`, `data-disabled`, `disabled()` and `active()` with the subsequent real CDK transition and exact index emissions. Cases cover unvisited/incomplete/invalid destinations; required invalid and real async pending predecessors resolving valid/invalid; optional/explicit-completion exceptions on current and skipped intermediate steps; valid-but-unvisited required intermediates; default versus explicit false/true control-less completion and reset; valid-control precedence over completion false; nonlinear invalid/pending navigation; backward editable in both modes; earlier invalid predecessors during backward navigation; and selected-header no-ops. Home plus orientation-specific arrows reach enabled and disabled headers with actual DOM focus/roving tabindex without selecting. Real synchronous Signal Field validation/correction remains untouched. Async/classic correction assertions use `whenStable()` and inspect refreshed DOM before forcing another render. Removing/re-attaching a classic control and destroying the fixture detach subscriptions. All ABH-04 Next interaction, pending, optional/completion and group/child-touch assertions pass.
- Contract/implementation: one read-only transition preview supplies all header affordances. It considers predecessors before the destination, anticipates only the current step's CDK interaction on departure, honors optional/completion exceptions and backward `editable`, and treats the selected header as an enabled no-op in both orientations. `HlmStep` records whether its public `completed` accessor was explicitly supplied, distinguishing untouched default control-less completion from explicit false without reading CDK's internal override field. Classic-control status subscriptions are replacement/destruction-bound; Signal Field status is read reactively. Actual click (`step.select()`), keyboard (`_onKeydown`) and Next eligibility remain delegated to CDK; no private framework fields, speculative selection/mutation, DOM patch, or duplicate activation guard is used. ABH-04's Next touch/revalidation pass is preserved exactly.
- Related keyboard finding resolved within FU-02: inherited CDK `_stepHeader` is a **content** query, but these headers live in `HlmStepper`'s own view. Overriding the non-private query with `@ViewChildren(CdkStepHeader)` connects the existing plain CDK header directives to CDK's own key manager and lifecycle. An initial hypothesis about the skin's signal-valued disabled property was discarded; no skin provider/input change was retained. Disabled headers stay keyboard-discoverable, while CDK rejects their selection and retains current-step interaction semantics without form touching.
- Checks: `pnpm exec prettier --check packages/angular/projects/stepper/src/lib/hlm-step.ts packages/angular/projects/stepper/src/lib/hlm-stepper.ts packages/angular/projects/stepper/src/lib/hlm-stepper.spec.ts packages/angular/projects/stepper/README.md docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 5 paths**. `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty. Focused source/test/docs diffs and current worktree status reviewed.
- No FU-02 blocker. Existing horizontal-panel **NG0956** recreation warnings still appear, as previously reported under ABH-04; no new independent task was added. Coverage is browser DOM/focus with dispatched click/keyboard events, not trusted pointer hit-testing or screen-reader/accessibility-tree testing. Signal Field async validation is not claimed tested. No aggregate/artifact builds, commits or publishing were performed.

### Task ABH-FU-03: Associate toggle validation descriptions

Status: completed

Kind: defect

Priority: P1 — the corrected validation message must be discoverable from its control.

Suggested agent: Angular form accessibility engineer (fresh sequential session)

Dependencies: ABH-FU-02

Primary ownership: `projects/form-toggle/src/lib/form-toggle.ts`, spec and README.

Finding: ABH-07 corrected interaction-only feedback but found the underlying button has no `aria-describedby` association to the existing error/hint IDs.

References: `packages/angular/projects/form-toggle/src/lib/form-toggle.ts` (button template and message blocks); ABH-06 declarative description pattern.

Requirements: associate active hint/error with the actual toggle button, preserve consumer-owned descriptions using the ABH-06 pattern, and keep invalid state/labels consistent. Use no DOM-query implementation.

Acceptance criteria: settled hint, touch/submit error, correction/reset and hint removal resolve to the mounted messages with no dangling wrapper IDs; externally supplied description IDs remain; all ABH-07 interaction regressions pass.

Verification: `pnpm --dir packages/angular test:library form-toggle`, formatting/diff.

Session start: fresh isolated sequential ABH-FU-03 session; ABH-FU-02 is completed. Read ABH-06's declarative description pattern, ABH-07's implementation/tests and current toggle README/primitive. Preserve all ABH-07 interaction behavior and prior Angular/concurrent React edits; ownership is the toggle wrapper, its spec/README and this task entry.

Completion evidence:

- Changed **4 paths**: `packages/angular/projects/form-toggle/src/lib/form-toggle.ts`, `packages/angular/projects/form-toggle/src/lib/form-toggle.spec.ts`, `packages/angular/projects/form-toggle/README.md`, and `docs/tasks/20260926-154324-angular-business-controls-health.md`. All edits, including formatting, used `apply_patch`; all ABH-07 implementation/tests and other Angular/concurrent React work were preserved. The existing runner already registers form-toggle.
- Pre-fix proof: after adding the two native-button lifecycle regressions, before implementation changes, `pnpm --dir packages/angular test:library form-toggle` exited **1**, **2 failed / 9 passed**. Both touch and submit paths had null `aria-describedby` despite mounted hint/error messages and null `aria-invalid` while showing an error. Existing label/focus, feedback and ABH-07 assertions passed.
- Final targeted command: `pnpm --dir packages/angular test:library form-toggle` exited **0**, **13 passed** (**9 existing + 4 new**) under automatically resolved Chrome Headless **152.0.7977.75**. Only whitespace formatting and task documentation changed after this passing run.
- Coverage: settled false/requiredTrue/invalid/untouched/pristine hint; touch-only and submit-only errors; invalid-to-invalid `resetForm({ value: false })`; click correction and subsequent reset; actual focus, native label association and `aria-pressed`; consumer ID ordering/whitespace normalization/deduplication/replacement/removal; changed/generated control IDs; hint removal while showing an error and while showing a hint; restored hints and external-only/no-description states. Every asserted description ID resolves to mounted nonempty text, obsolete wrapper IDs disappear, and `aria-invalid` clears with error feedback. New lifecycle tests await scheduled `whenStable()` updates without forcing component detection; all ABH-07 dirty/touched/silent/reset/submit/disabled/CVA/class regressions remain green.
- Contract: additive wrapper `[aria-describedby]` (`string | null`, default null) supplies consumer IDs, followed by the currently displayed **error OR hint**. The native button receives declarative attribute bindings; no implementation DOM queries, observation, attribute mutation or new subscriptions were added. Consumer elements must stay mounted and wrapper message IDs are reserved. `aria-invalid="true"` follows displayed error feedback and is removed otherwise; native labels, pressed state and the visual required marker retain their semantics. README/API JSDoc document forwarding; README explains independently configured `Validators.requiredTrue` and that toggle buttons do not support `aria-required`.
- Checks: `pnpm exec prettier --check packages/angular/projects/form-toggle/src/lib/form-toggle.ts packages/angular/projects/form-toggle/src/lib/form-toggle.spec.ts packages/angular/projects/form-toggle/README.md docs/tasks/20260926-154324-angular-business-controls-health.md` — **passed, 4 paths** (initial check identified spec wrapping and README table alignment, corrected with `apply_patch`). `git diff --check` — passed; `git diff -- CHANGELOG.md` — empty. `git diff -- packages/angular/projects/form-toggle/src/lib/form-toggle.ts packages/angular/projects/form-toggle/src/lib/form-toggle.spec.ts packages/angular/projects/form-toggle/README.md` and `git status --short` — reviewed against session-start work.
- No ABH-FU-03 blocker or new independent issue. Existing Angular disabled-with-reactive-form warnings appear in both browser runs; disabled assertions pass. Accessibility verification is rendered browser DOM/focus, not screen-reader/accessibility-tree testing. No aggregate/artifact builds, commits or publishing were performed.

## Coordinator final audit — 2026-09-26T17:57:13-0700

Completion evidence:

- Reviewed all **13 task entries**: nine original implementation tasks, three promoted follow-ups, and one independent integration review. Every entry is `completed` with its own Completion evidence; no executable task remains pending, in progress, blocked, or deferred. Each task ran in a fresh sub-agent session, sequentially; the independent reviewer ran after all twelve implementation dependencies completed.
- Reviewed final acceptance evidence, the integration build-scanner correction and regression, current diff scope, and representative shared-control code (stepper eligibility/lifetimes, OTP adapter, date input commit lifecycle). The independent reviewer verified **532 library browser tests**, **345 example tests**, all listed package contracts, both **87-export / 351-file** artifacts and isolated installed consumers. The phone probe additionally passed **66 trusted keyboard scenarios**.
- Coordinator reran `git diff --check` successfully and confirmed `git diff -- CHANGELOG.md` is empty. Concurrent React/Next.js work remains outside this objective and was preserved. No commits or publication were performed.
- Historical notes describing then-pending integration, the initially deferred checkbox fix, and the README peer mismatch are retained as execution history; ABH-FINAL and ABH-FU-01 record their closure. Bounded unexamined areas and non-failing warnings remain explicitly documented, not hidden as completed defect fixes. No unresolved decision blocks this task file.
- Overall document status changed to `completed` after this audit. Only this execution record changed after the independent verification; no production code or test assertion changed.
