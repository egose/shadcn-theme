# Next.js Business Experience Follow-up

Created: 2026-09-26 16:42:31 local time

Status: completed

## Objective and scope

Make `packages/react/@examples/nextjs` a reliable, discoverable, consistently structured source-integration example for common business workflows. Fix session-state and recovery defects, make calendar dates deterministic, improve reusable example infrastructure, and add one bounded support-inbox composition. Implement every task sequentially in a fresh sub-agent session, followed by independent review.

Primary scope: example `app/`, `components/`, `lib/`, focused tests and READMEs. Preserve URLs, typed lazy registries, server-first shell, package-style source aliases, and the existing UI package. No backend, authentication, payment/email provider, global store, publication, or changes to `CHANGELOG.md`. Parent package defects require an explicit separately recorded finding before crossing the boundary.

## Analysis coverage, comparison, and limitations

- Reviewed all four real-example entry points, local components/fixtures/tests, shared state tooling, catalog/navigation/registry code, and relevant actual parent primitives and form APIs. Analysis session: `ses_f1fe94547ffegGRgKAmXz46ze9` (read-only).
- Compared with completed `20260903-124249-nextjs-example-catalog-remediation.md`, especially NEXTEX-05/07 architecture, NEXTEX-08/09/10/11 workflows, and deferred NEXTEX-12 support/onboarding breadth. This is a new phase: it repairs uncovered interaction sequences rather than repeating completed construction work.
- Compared with completed `20260926-154202-react-business-workflow-remediation.md`: loading buttons, selection labels/retention/ref/blur, context switching, navigation, clipboard, and SimpleLayout fixes already exist. Consume those fixes; do not duplicate or overwrite them.
- At entry, many parent React/Angular source files and two task documents were already modified/untracked. The target Next.js example had no changes. Preserve all earlier work and generated output boundaries.
- Actual primitive demos already cover forms, table/pagination, and resizable/scroll/sheet/item separately. Existing flows compose forms/settings/customer management/pricing, but no split-view conversation workflow combines Resizable, ScrollArea, Sheet, and Item. EXB-07 intentionally fills that business-composition gap; it does not claim every primitive needs a full application.
- Review runtime probe: the launch fixture's UTC-noon instant formatted with installed date-fns produces March 30 in UTC and March 31 in Pacific/Kiritimati. Other defects are source-backed until implementation regressions reproduce them.
- No fresh baseline full suite/build/browser check was run during analysis. Prior reported 94-test success is historical only. No full primitive, assistive-technology, installed-artifact, or backend/security audit is claimed.
- Deferred breadth: onboarding/authentication, uploads, billing checkout, analytics, remote search and persistence. They need separate contracts; support inbox provides distinct layout/state coverage within this phase.

## Execution and verification

- Run EXB-01 through EXB-08 strictly sequentially, each in a fresh sub-agent session; no nested agents. Dependencies also serialize shared docs and registry hotspots. Each agent reads this file, marks its task in_progress, implements/verifies it, and appends **Completion evidence** before marking completed. Never mark a blocked/unverified criterion completed.
- Use `apply_patch`; preserve prior agents' changes and unrelated work. Do not commit, install dependencies unnecessarily, modify CHANGELOG.md, or track `.next/`, `out/`, and TypeScript caches.
- Use actual package APIs; domain-local controllers own business decisions. Shared abstractions need multiple callers. Keep package composition visible; no schema-driven forms or generic CRUD framework.
- Implementation verification from `packages/react/@examples/nextjs`: `pnpm exec vitest run <focused test paths>`, `pnpm typecheck`, `pnpm lint`. Reproduce defects before fixing where practical; use real controls and behavior assertions, not mirrored snapshots. Record exact results and honest limitations.
- Final integration from that directory: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, serially for generated outputs. Root has no all-repository test script. Parent artifact and Angular checks are outside an example-only change; run parent checks if a separately justified parent edit occurs.
- Prerequisites: installed nested React/example pnpm dependencies, Node >=20, pnpm. Builds and dependency operations must not overlap with another agent. Static preview uses `pnpm preview` after build. Browser checks should use available browser tooling; if unavailable, record the exact limitation and required browser criteria as blocked rather than assert visual success.
- Browser integration: smoke customer/pricing focus after settlement, support desktop/mobile/keyboard/overflow at 320px, 768px and desktop plus 200% zoom or equivalent viewport, and launch initial render across server/browser timezone disagreement. A small repeatable browser harness is acceptable if existing tooling supports it without unrelated lockfile changes.
- Record new necessary findings in the owning task before fixing; independently scoped findings get a new ID/dependencies/acceptance criteria. Final reviewer must inspect all criteria, not just status words.
- Definition of done: all task criteria verified, completion evidence present, full example gates pass, final independent review approves, and no CHANGELOG.md or unrelated work is altered by this phase.

Priority: P1 = user-visible state/correctness/recovery defect; P2 = concrete usability or maintainability improvement; P3 = bounded new workflow coverage after existing defects are fixed.

### Sequential isolated session record

The coordinator launched each task in a fresh sub-agent session and waited for its completion before launching the next. EXB-08 was a separate independent reviewer. Agents did not need their own nested delegation tools.

| Task   | Assigned session                 |
| ------ | -------------------------------- |
| EXB-01 | `ses_f1fe56dbaffeOC9MNeFUvjeVdt` |
| EXB-02 | `ses_f1fdf56c2ffedKbcAeMW28S3T8` |
| EXB-03 | `ses_f1fd821eaffeTV91nNr1K14mQF` |
| EXB-04 | `ses_f1fd2727effe9I3YtgR8YKK2aW` |
| EXB-05 | `ses_f1fc79ddbffeqbxleNEG4zp0BD` |
| EXB-06 | `ses_f1fc10175ffefkFcBRhq1vjUlQ` |
| EXB-07 | `ses_f1fba41dfffeJWD3l52yCiDKZ2` |
| EXB-08 | `ses_f1fb37b0affekCko2Ihj7PtKKD` |

## Tasks

### Task EXB-01: Establish truthful launch-request save and discard state

Status: completed

Kind: defect

Priority: P1 — successful submissions currently fail to become the saved baseline.

Suggested agent: React Hook Form workflow engineer

Dependencies: none

Primary ownership: `components/real-examples/launch-request/{index.tsx,types.ts,components/review-summary.tsx,launch-request.test.tsx}` (all paths relative to the example unless stated).

Finding / References: `LaunchRequestExample.onSubmit` (`index.tsx:62-78`) updates status/revision but never resets the saved defaults; `confirmDiscard` (`86-89`) restores original fixtures despite promising the last saved request (`263-264`). `ReviewSummary` labels live edited values Submitted. Existing tests separate submit/discard and miss submit → edit → discard.

Requirements:

1. Successful submission commits an input snapshot as the new baseline. Failed submission retains edits and the previous baseline.
2. Clearly distinguish current unsaved edits from the submitted revision, preserving scoped useWatch and the optional debug panel.
3. Define pending editing semantics: freeze editable inputs while saving or preserve newer edits without falsely marking them saved. Preserve duplicate-submit protection and discard confirmation.

Acceptance criteria: edit A → save → edit B → discard restores A; success is pristine, later edits read as unsaved; failure does not advance baseline/revision; pending edits cannot be silently lost or labeled saved; regression tests verify these sequences.

Verification: focused launch-request suite and shared implementation checks.

Completion evidence:

- Changed (relative to `packages/react/@examples/nextjs`): `components/real-examples/launch-request/index.tsx`, `types.ts`, `components/review-summary.tsx`, and `launch-request.test.tsx` (the latter three in the same launch-request directory); task-document edits are confined to EXB-01.
- Reproduced before implementation with real package controls: edit A, approve, submit, edit B, confirm discard restored fixture `Insights Hub` instead of A; successful saves stayed dirty; pending/later edits were labeled Submitted. `DEBUG_PRINT_LIMIT=500 pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx` reported **4 failed / 7 passed**, including baseline and status failures.
- Resolution: successful saves commit a cloned submitted snapshot with RHF `reset(snapshot, { keepValues: true })`; editable pending values remain live and are compared against the new baseline. Review distinguishes unsaved edits from the submitted revision; failure preserves values/baseline/revision. A synchronous in-flight guard protects rapid submits, and discard still requires confirmation.
- Final verification from the example directory: `pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx && pnpm typecheck && pnpm lint` — **12/12 tests passed**, typecheck exit **0**, lint exit **0** (zero warnings). An earlier lint run flagged passing a ref-reading handler through `handleSubmit` during render; moving that call into the submit event resolved it. Root `git diff --check` — exit **0**.
- Regressions cover pristine success, save → edit → discard across text/textarea/select/teams/approval, pending text/array edits and return to an old default, return to the submitted snapshot, retained failure edits and unchanged revision, retry, live debug values, and actual simulator counts for pending/rapid duplicate clicks.
- Limitations: focused jsdom/source-integration evidence only; calendar representation/timezone checks remain EXB-02. Consolidated browser integration and full test/build gates are explicitly deferred to EXB-08, not an EXB-01 blocker. No installs, commits, CHANGELOG.md edits, or parent React/Angular edits were made. No EXB-01 blockers remain.

### Task EXB-02: Model launch dates as calendar dates across timezones

Status: completed

Kind: defect

Priority: P1 — fixed UTC instants render as different business dates across user timezones.

Suggested agent: Date semantics and hydration engineer

Dependencies: EXB-01

Primary ownership: launch-request fixtures/types/date rendering/tests and `_shared/fixtures.ts` comments; example README date convention.

Finding / References: `DEFAULT_LAUNCH_REQUEST.launchDate` (`launch-request/fixtures.ts:17`) constructs a UTC instant; `ReviewSummary` (`components/review-summary.tsx:58`) formats locally. Actual parent `components/form/date-picker.tsx:19-55` defines local calendar-date input semantics. The fixture's cross-timezone claim is false (runtime probe documented above).

Requirements:

1. Represent business calendar dates consistently through fixture, picker, review, submitted value and debug output using supported APIs; distinguish date-only values from UTC event timestamps.
2. Do not apply UTC formatting only to the summary while leaving another day selected in the picker. Correct determinism documentation.
3. Preserve EXB-01 save/discard behavior.

Acceptance criteria: default March 30 date, edited day, saved payload and discard are consistent under UTC, America/Los_Angeles and Pacific/Kiritimati; timezone-focused tests run in separate processes; server/browser initial-render disagreement is checked in EXB-08.

Verification: focused launch/date tests separately with `TZ=UTC`, `TZ=America/Los_Angeles`, `TZ=Pacific/Kiritimati`; shared implementation checks.

Implementation finding (EXB-02): the supported `FormDatePicker` accepts date-only strings but emits local-midnight `Date | undefined`; `HookFormDatePicker` forwards that output directly and exposes no conversion prop. Use a local RHF `Controller` with the controlled package picker to convert selections to `YYYY-MM-DD` (clear → `null`), keeping snapshots/debug state date-only. The new real-control regression reproduced March 31 instead of March 30 in Kiritimati and a March 8 selection submitted as `2026-03-07T10:00:00.000Z`. This is within EXB-02; no parent API change is needed.

Completion evidence:

- Changed (relative to `packages/react/@examples/nextjs`): launch-request `fixtures.ts`, `types.ts`, `index.tsx`, `components/{review-summary,debug-state-panel}.tsx`, `launch-request.test.tsx`; `_shared/fixtures.ts` comments and example `README.md` date contract. Task-document changes are confined to EXB-02. EXB-01 snapshot/keepValues, pending-edit, duplicate-submit and discard logic is preserved.
- Before implementation: `TZ=Pacific/Kiritimati DEBUG_PRINT_LIMIT=500 pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx` — **4 failed / 11 passed**, reproducing the default-day shift and instant-valued submission. Resolution: date-only fixture/form/snapshot values, supported controlled-picker local-date conversion, direct review/debug serialization; clear uses `null` with required validation.
- Final verification, separate processes from the example directory:
  - `TZ=UTC pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx` — **15/15 passed**.
  - `TZ=America/Los_Angeles pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx` — **15/15 passed**.
  - `TZ=Pacific/Kiritimati pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx` — **15/15 passed**.
  - `pnpm typecheck && pnpm lint` — both exit **0**, zero lint warnings. Root `git diff --check` — exit **0**.
- New real-calendar regressions verify March 30 default selection/review/debug/submission, March 31 save → April 1 pending edit → discard, restored selected day, March 8 DST-boundary submission, failure retention/revision, and clear → validation → saved-date discard. All 12 EXB-01 tests pass in each timezone. An initial post-fix UTC run hit the default 5-second test timeout (then passed unchanged); the three multi-popover regressions now have scoped 15-second headroom and all final commands above were rerun successfully.
- Limits: jsdom/source-integration evidence; browser/server timezone disagreement remains explicitly consolidated in EXB-08, along with full integration/build gates. No unresolved EXB-02 blocker or independently scoped finding. No parent React/Angular edits, dependency installs, CHANGELOG.md changes, commits, or nested agents in this session.

### Task EXB-03: Retain settings drafts and outcomes across navigation

Status: completed

Kind: defect

Priority: P1 — switching sections discards both edits and simulated saved state.

Suggested agent: Settings state ownership engineer

Dependencies: EXB-02

Primary ownership: `components/real-examples/settings/` including local hooks/components/types/tests.

Finding / References: each section owns `useSaveSection` (`components/use-save-section.ts:16-20`), but parent ContentSidebar (`packages/react/components/widgets/content-sidebar.tsx:125-155`) renders only active content. `SettingsExample` changes component type (`index.tsx:29-67,134-145`), unmounting state. Danger-zone deletion also resets on navigation despite reload-required copy. Existing tests cover isolated saves/navigation, not round trips.

Requirements:

1. Own session drafts, saved snapshots, operation results and deletion above switchable sections. Keep package lifecycle unchanged and visible section composition simple.
2. Preserve independent section drafts and outcomes when navigating during pending; discard restores the relevant section's last saved state.
3. Define catalog Loading/Error transitions as preserving the mounted example session, with deletion terminal until explicit reset/reload. No localStorage/backend requirement.

Acceptance criteria: editable sections preserve unsaved and saved values across round trips; failure and pending completion survive switching; discard uses the saved baseline; deleted state survives section/catalog transitions; tests cover independent sections.

Verification: focused settings suite and shared implementation checks.

EXB-08 review finding / scope evidence: `components/use-save-section.ts:41-55` guards duplicate saves only with render-state `saving`, unlike the synchronous guards in the other controllers. Verify same-turn native form submissions against the actual simulator before correction. This belongs to the existing pending-operation protection/session contract; require exactly one operation while retaining newer edits and independent section saves.

EXB-08 reproduction: the focused `same-turn|connected responsive` regression run failed both new cases (**2 failed / 40 skipped**). Settings called the actual simulator **twice** for two same-turn submits of the Profile form; customer no-op opener focus failed to reach Search. Correction is now justified in each owning controller.

Completion evidence:

- Changed only `components/real-examples/settings/` (relative to the example) and this EXB-03 section: added `use-settings-session.ts` and `components/use-workspace-deletion.ts`; connected all five section views to session-owned state and controlled the active sidebar section. Independent save drafts/baselines/results, pending operations, avatar acknowledgement, clipboard feedback and terminal deletion survive section and Loading/Error transitions; a fresh mount resets the session. Parent ContentSidebar lifecycle is unchanged.
- Before implementation: `DEBUG_PRINT_LIMIT=500 pnpm exec vitest run components/real-examples/settings/settings.test.tsx` — **7 failed / 10 passed**, reproducing all four sections' lost drafts plus lost pending save, avatar acknowledgement and pending deletion on round trips.
- Final verification from `packages/react/@examples/nextjs`: `pnpm exec vitest run components/real-examples/settings/settings.test.tsx && pnpm typecheck && pnpm lint` — **17/17 passed**, typecheck exit **0**, lint exit **0** (zero warnings). Root `git diff --check` — exit **0**. Intermediate verification caught unsupported test-query `exact` options (removed) and a default 5-second timeout in the multi-round-trip notification case (parameterized round trips now have scoped 15-second headroom).
- Regressions cover each editable section's unsaved → navigate → save → pending navigation → saved → edit → failed save while hidden → discard-to-saved sequence; independent concurrent saves, newer pending edits and another section's unsaved draft through catalog transitions; retained avatar/copy feedback; pending deletion through catalog transitions, terminal deletion through navigation, and fresh-mount reset. Deletion's pending catalog transition is a synthetic state/lifecycle stress test because the modal blocks normal pointer access to tooling.
- Follow-up: EXB-04 owns persistent delete-failure feedback (the catch now lives in `components/use-workspace-deletion.ts`) and settlement/focus recovery in the danger-zone view. Full integration/build/browser checks remain EXB-08; this evidence is jsdom/source-integration only. Implementation ran in the coordinator-assigned isolated EXB-03 session without nested agents (see session record above). Pre-existing React/Angular and earlier example changes were preserved; no installs, commits or CHANGELOG.md edits.

EXB-08 correction completion evidence:

- Added a synchronous per-section in-flight guard in `components/use-save-section.ts` and a real-form/actual-simulator regression in `settings.test.tsx`. Two same-turn submissions now start exactly one operation; a newer edit survives hidden settlement and discard restores the captured snapshot. Independent section saves remain supported.
- Focused customers/settings verification: **42/42 passed** (22 customers, 20 settings), typecheck/lint/build passed. Final full integration: **156/156 passed**. Browser verified a save settling during section navigation plus deletion failure/retry/terminal state across section and catalog round trips. EXB-03 is completed again; final integration evidence below supersedes its earlier browser limitation.

### Task EXB-04: Complete mutation recovery and accessible settlement

Status: completed

Kind: defect

Priority: P1 — failed customer edits lose input and deletion failures lack persistent feedback.

Suggested agent: Mutation recovery and focus engineer

Dependencies: EXB-03

Primary ownership: customer dialogs/index/tests; settings danger zone/tests; pricing settlement/tests.

Finding / References: customers `submitName` catch (`index.tsx:140`) closes the local-state `CustomerNameDialog`; danger-zone catch (`components/danger-zone-section.tsx:38-57,90-97`) only emits a toast; customer Empty branch (`index.tsx:240-250`) instructs Add but hides that action. Customer `restoreFocus` retains only an opener that can disappear under filtering, and pricing clears its trigger reference on settlement (`pricing/index.tsx:84`). Exact browser focus outcomes require reproduction. Pricing tests manually push a requests array rather than observe an operation (`pricing.test.tsx:58-71`).

Requirements:

1. Keep failed customer add/rename input available with retry; retain archive failure recovery. Make an actual empty customer dataset actionable through the first-add flow.
2. Give deletion failure persistent inline feedback and retry while retaining EXB-03 session ownership.
3. Define safe logical focus destinations after cancel/success/failure when openers disappear or become disabled. Reproduce behavior using real controls; no document-global DOM workaround.
4. Replace ineffective request-count testing with actual simulator/operation observation; keep pending dismissal and duplicate guards.

Acceptance criteria: add/rename/archive/delete failure → retry → success behaves coherently; empty → first customer works; customer filtered rename/archive and pricing/deletion settlement have stable focus destinations; focused tests verify retained values, persistent feedback and actual single operation count. Browser focus checks consolidated in EXB-08.

Verification: focused customers/settings/pricing suites and shared implementation checks.

EXB-08 confirmed browser finding / added acceptance detail: Chromium 151 on the UTC static export, Customers at 1440px → open Ada's Rename → resize to 320px → Cancel leaves `document.activeElement` at BODY. The table opener remains connected/enabled but becomes CSS-hidden; `use-customers-controller.ts:48-52` calls focus and skips Search. Require a visible usable destination after responsive table/card transitions for cancel/success/failure. Add a focused hidden-opener regression and rerun both resize directions in the browser before marking complete. This is example-local EXB-04 focus recovery, with no parent primitive change.

Implementation findings (EXB-04): real-control regressions reproduced lost add/rename drafts, missing first-add action, filtered rename/archive focus falling to body, missing deletion failure feedback and disabled-opener settlement. The pre-fix focused run reported **10 failed / 33 passed**. A retained customer modal also makes the outside catalog outcome picker inaccessible; move that same picker into the open name dialog so a reviewer can change failure → success and retry the retained draft with real controls. Empty now explicitly starts an empty session dataset (with reset semantics stated beside the catalog toolbar); Loading/Error retain that dataset. These are necessary EXB-04 recovery details, not separate tasks.

Completion evidence:

- Changed (relative to `packages/react/@examples/nextjs`): customers `index.tsx`, `components/customer-name-dialog.tsx`, `customers.test.tsx`; pricing `index.tsx`, `pricing.test.tsx`; settings `index.tsx`, `components/{danger-zone-section.tsx,use-workspace-deletion.ts}`, `settings.test.tsx`. Task-document edits are confined to EXB-04; EXB-03 session ownership and earlier work are preserved.
- Recovery: failed add/rename retains the mounted draft, announces an inline error and focuses the name input; reachable catalog outcome controls allow real failure → success retries. Empty clears the actual dataset and filters, exposes Add, and first-add produces exactly one visible customer. Archive failure retains persistent feedback and returns to the row action for retry. Deletion failure stays in the session across section/catalog navigation; inline Retry deletion reopens confirmation and success clears the error.
- Focus: dialog close callbacks retain usable openers; filtered-away customer rows fall back to Search, then the persistent result region if the product view disappears. Pricing success focuses its result when the now-current plan disables its opener; failure/cancel restore usable openers, with the persistent result as fallback. Deletion success focuses the terminal status, including when a retry opener disappears; section unmount falls back to the persistent settings heading. No document-global focus lookup or parent primitive change.
- Final verification from the example directory: `pnpm exec vitest run components/real-examples/customers/customers.test.tsx components/real-examples/settings/settings.test.tsx components/real-examples/pricing/pricing.test.tsx && pnpm typecheck && pnpm lint` — **48/48 passed** (**18 customers / 19 settings / 11 pricing**), typecheck exit **0**, lint exit **0** (zero warnings). Subsequent edits only formatted JSX/comments. Root `git diff --check` — exit **0**.
- Tests use real package controls and spy on the actual simulator (replacing pricing's manually populated requests array). They cover failure → retry → success, retained input, empty → first-add, deferred-search cancellation, filtered rename/archive, persistent deletion recovery, pending Escape/duplicate-click protection, and actual operation counts. Focus assertions flush Radix's deferred close callback; an intermediate run exposed assertions made before that callback rather than additional production defects.
- Limits: jsdom/source-integration proof only. Captured catalog controls used to unmount pricing/deletion openers are explicitly synthetic lifecycle stress tests; normal modal pointer interaction blocks those controls. Browser focus/visual evidence remains consolidated in **EXB-08**, including customer filtered settlement and pricing/deletion disabled/disappearing-opener settlement after animations. No browser success is claimed here. No unresolved EXB-04 blocker or independently scoped finding; no parent React/Angular edits, installs, CHANGELOG.md edits, commits, or nested agents.

EXB-08 correction completion evidence:

- `customers/use-customers-controller.ts` now verifies that focusing the remembered opener succeeded before skipping Search. This handles a connected but CSS-hidden responsive opener without a document-global selector or parent change. The regression models the no-op focus in jsdom; actual browser resizing independently reproduced and verified it.
- **22 customer tests passed** in the final suite. Browser filtered rename failure → retry → success, filtered archive and empty → first-add passed at **1440px and 320px**. All **six** responsive archive settlement cases passed: 1440→320 and 320→1440, each cancel/success/failure. Pricing cancel/failure restores Choose Growth; success focuses the result after Growth becomes disabled. Deletion cancel/failure restores the opener, retry-cancel restores Retry, retry-success focuses terminal status after Retry disappears. EXB-04 completed; no unresolved focus finding.

### Task EXB-05: Normalize shared tooling and customer feature boundaries

Status: completed

Kind: improvement

Priority: P2 — repeated catalog controls and a 515-line customer orchestration module impede consistency.

Suggested agent: Example architecture engineer

Dependencies: EXB-04

Primary ownership: customer controller/view modules; `_shared/` outcome control; four existing flow call sites/types; real-example README.

Finding / References: `customers/index.tsx` combines filtering/pagination, mutations, focus, tooling, desktop/mobile markup and archive dialog. Equivalent outcome-pickers occur in pricing `113-132`, customers `205-224`, launch `99-118`, settings; `_shared/async-simulation.ts` already defines outcome and default-delay contracts.

Requirements:

1. Extract customer-local controller/state and explicit desktop/mobile presentation with a single records/actions model. Preserve behavior fixed above and keep UI composition readable.
2. Extract one labeled shared outcome picker, reuse SimulatedOutcome and default delay rather than duplicate union types/constants where identical.
3. Document snapshot/pending/failure/reset/unmount semantics; domain policy stays local. No generic CRUD engine/global store/all-showcases barrel.

Acceptance criteria: customer entry is focused orchestration with domain state and responsive views owned in local modules; shared picker has at least four callers and accessible single-choice behavior; all earlier regressions remain passing, filters/page clamping share one model; no unmeasured performance claims.

Verification: focused real-example suites (including shared picker and relevant pagination behavior), shared implementation checks.

Completion evidence:

- Read shared execution rules and EXB-01–04 dependency evidence; inspected the **544-line post-EXB-04** customer entry and retained name dialog before extraction. Changed only example-local customer modules/tests/types, `_shared/{outcome-picker.tsx,real-example-tooling.test.tsx}`, the four flows' outcome call sites/types (including settings session/save/deletion hooks), `components/real-examples/README.md`, and this EXB-05 section.
- Structure: customer entry now composes a local `use-customers-controller.ts`, `components/customer-list-view.tsx`, explicit `customer-table.tsx` / `customer-cards.tsx`, and `customer-archive-dialog.tsx`. The controller owns the single dataset, debounced filtering, page clamping, mutation policy and focus recovery; both responsive views receive the same rows and action callbacks. The existing name dialog retains draft ownership and EXB-04 failure/retry behavior. DOM refs are passed separately from the list state/action model.
- Shared tooling: `OutcomePicker` is used by customers, pricing, launch request and settings, with a visible programmatic group label, catalog description, keyboard-operable success/failure choices and non-clearable selection. Customers moves this same picker into its retained name dialog. All four flows import the existing `SimulatedOutcome` contract and use `simulate`'s existing **400 ms default**, removing redundant outcome unions and matching delay constants/options. Domain policy stays local; no generic engine/store/barrel or performance claim.
- Documentation: the real-example README now explains controller/view boundaries, input/outcome capture, default delay, pending edits, saved baselines/discard, persistent failure/retry/focus, customer Empty reset versus preview states, section/catalog view unmounts, terminal deletion, and full-session unmount/remount semantics.
- Verification from `packages/react/@examples/nextjs`:
  - `pnpm exec vitest run components/real-examples` — **80/80 passed** across five suites (**21 customers / 19 settings / 15 launch / 11 pricing / 14 shared tooling**). All earlier recovery, snapshot, calendar-date, session and actual-operation-count regressions passed.
  - Initial `pnpm typecheck && pnpm lint`: typecheck exit **0**; lint reported **31 `react-hooks/refs` diagnostics** after refs were accessed through the same object as view state. Destructuring controller outputs and passing Search's ref separately resolved this without disabling rules or changing focus behavior.
  - Final `pnpm exec vitest run components/real-examples/customers/customers.test.tsx lib/import-boundary.test.ts lib/example-registry.test.ts && pnpm typecheck && pnpm lint` — **46/46 passed** (**21 customers / 4 import boundary / 21 registry**, including lazy loaders), typecheck exit **0**, lint exit **0** with zero warnings. Customer tests were rerun after the ref-prop adjustment; other real-example/shared sources were unchanged after their successful run. Root `git diff --check` — exit **0**.
- Added behavior evidence: keyboard Tab/arrow/Space/Enter selection, prevention of empty selection, independently labeled picker instances, default-delay settlement, retained-dialog outcome changes affecting only the next attempt, and last-page archives initiated from **both table and cards** clamping to the same rows/actions/count with logical focus and retained filters through catalog transitions.
- Limits: source-integration/jsdom evidence only; browser focus/layout/timezone integration and full build gates remain EXB-08. Implementation ran in the coordinator-assigned isolated EXB-05 session without nested agents (see session record above). No unresolved EXB-05 blocker or independently scoped finding. Prior/unrelated work was preserved; no parent package or CHANGELOG.md edits, installs, commits, or generated-output tracking.

### Task EXB-06: Make catalog capabilities discoverable and detect orphan examples

Status: completed

Kind: improvement

Priority: P2 — users cannot search capabilities and reverse implementation coverage is missing.

Suggested agent: Catalog discovery and registry engineer

Dependencies: EXB-05

Primary ownership: catalog page/search component, `lib/example-registry.ts`, section metadata, registry/discovery tests and README.

Finding / References: `CatalogIndexPage:28-40` is an unfiltered list; `RegistryEntry:42-55` lacks capability/related-example metadata; registry tests (`lib/example-registry.test.ts:47-85`) validate entries to implementations but do not enumerate orphan implementation modules. Existing hook-select demos use valid defaults without showing new validation/retention contracts; do not imply imports establish tested behavior.

Requirements:

1. Add lightweight searchable capability metadata and useful primitive/workflow cross-links derived from existing section registries, never a second coverage registry.
2. Preserve server-rendered initial cards and lazy loaders; client search receives only serializable listing metadata. Search title, description and capabilities with named input, results feedback, empty and clear states.
3. Add reverse inventory checks for owned showcase modules and real-example index modules with explicit helper/test exclusions; preserve unknown slug handling.
4. Document distinction between primitive demo, workflow composition and behavior covered by tests. Keep links factual; no claim of complete component parity.

Acceptance criteria: keyboard-searchable catalogs find titles/capabilities, show useful zero results/reset and valid related links; no loaders cross the server/client prop boundary; orphan fixture probe fails registry checks; all current registry routes still resolve.

Verification: focused catalog/registry/internal-link/site-nav suites and shared implementation checks.

Completion evidence:

- Read shared rules and completed EXB-01–05 dependencies before implementation. Changed only example-local `components/catalog-page.tsx`, new `catalog-search.tsx` / `catalog-page.test.tsx`, `lib/example-registry.ts`, the four existing `lib/sections/` entry lists, registry/internal-link tests, new `lib/example-inventory.test.ts`, the catalog README, and this EXB-06 section. Earlier example/parent work was preserved.
- Discovery: optional short `capabilities` and curated `related` URLs live on existing entries (13 entries received capability terms; only the four workflows declare relationships). `listCatalog` explicitly projects plain title/description/URL/capabilities/related-link data, deriving related titles and reverse links from those same registries. Search matches all whitespace-separated terms across title, description and capabilities, case-insensitively, with a named input, live result count, zero-result guidance, keyboard clear and restored input focus. Initial empty-query cards render on the server; no loader is passed into or invoked by search.
- Reverse inventory: filesystem enumeration detects unregistered showcase source modules and direct real-example `index.ts(x)` entries; explicit test/declaration/shared-helper/fixture and real-flow-internal exclusions are documented and tested. Loader-to-owned-component identity is also checked, preventing a valid but unrelated loader from masking an orphan. Existing forward static/dynamic checks remain; unknown dynamic slugs still produce Next's not-found result.
- Actual failure probe: temporarily added `components/showcases/components/exb06-orphan-probe.tsx` and `components/real-examples/exb06-orphan-probe/index.tsx` using `apply_patch`. `pnpm exec vitest run lib/example-inventory.test.ts` reported **1 failed / 2 passed**, with both exact orphan paths named by the filesystem check. Removed both probes using `apply_patch`; permanent orphan/exclusion assertions remain.
- Final verification from `packages/react/@examples/nextjs`: `pnpm exec vitest run components/catalog-page.test.tsx lib/example-registry.test.ts lib/example-inventory.test.ts lib/internal-links.test.ts components/site-nav.test.tsx && pnpm typecheck && pnpm lint` — **51/51 passed** (**11 catalog / 23 registry / 4 inventory / 5 internal-link / 8 site-nav**), typecheck exit **0**, lint exit **0** with zero warnings. Initial focused tests passed, but typecheck caught unsupported Button `outline` and role-query `exact` options; corrected to supported `secondary` and exact-by-default role naming before the final run. Root `git diff --check` — exit **0**.
- Evidence includes server-rendered cards in all four catalogs, serializable actual client-boundary props for every section, a loader spy that remains uncalled during listing, keyboard title/description/capability search and clear, empty sections, related/reverse links, all current lazy module resolutions and static-route checks. README distinguishes primitive/field/widget demos, workflow compositions and specific behavior assertions; metadata/imports do not claim tested selection contracts, full component parity or backend/artifact validation.
- EXB-07 convention: add the support-inbox dynamic entry in `lib/sections/real-examples.ts` with a few factual capability terms and related existing demo URLs. Reverse links/titles and listing counts derive automatically; keep `components/real-examples/support-inbox/index.tsx` and its lazy loader aligned. No second coverage list is needed. Full integration/build/browser evidence remains EXB-08; this task's evidence is source-integration, server-render and jsdom only. No unresolved EXB-06 blocker, nested agents, parent/CHANGELOG.md edits, installs, commits, or generated-output tracking.

### Task EXB-07: Add a bounded responsive support inbox

Status: completed

Kind: improvement

Priority: P3 — adds distinct common-business split-view composition after correctness work.

Suggested agent: Responsive support workflow engineer

Dependencies: EXB-06

Primary ownership: new `components/real-examples/support-inbox/`, real-example registry metadata, READMEs and colocated tests.

Finding / References: deferred NEXTEX-12 in prior catalog plan; current real-example registry contains pricing/customers/settings/launch only. Actual public `components/ui/{resizable,scroll-area,sheet,item}.tsx` have isolated demos but no combined business workflow. Resizable's current API uses orientation and percentage sizes.

Requirements:

1. Add `/real-examples/support-inbox`: deterministic local tickets/conversation, selected ticket, per-ticket reply drafts, send and resolve/reopen actions.
2. Desktop resizable list/detail, mobile Sheet detail, bounded ScrollArea conversation/list and semantic Item rows. Reuse shared outcome/state tooling and feature-directory conventions.
3. Preserve per-ticket drafts, retain failed replies for retry, guard duplicate/pending actions, explain resolved/read-only restrictions; provide loading/empty/error and actionable no-results feedback.
4. Focus survives filtering/resolution and mobile close. Stable IDs/fixed event times/local initials; no email service, auth, assignment engine, SLA analytics, upload or backend.
5. Register truthful capability/related-example metadata under EXB-06 conventions and document scope.

Acceptance criteria: ticket selection/search/filter/reply/retry/resolve/reopen work; drafts remain isolated per ticket; actual operation counts prove pending protection; mobile sheet focus restores logically; desktop resize/scroll and narrow/zoom layout verified in EXB-08; route and reverse inventory checks pass.

Verification: focused inbox, registry and shared tooling tests, shared implementation checks; integrated build/browser checks in EXB-08.

Implementation finding (EXB-07): adding truthful retained-draft/retry metadata makes the existing catalog query `RETAINED retry drafts` match both Customers and Support Inbox. The expanded focused run reproduced the stale one-result test expectation (**1 failed / 68 passed**). Update that catalog regression to assert both legitimate matches and add a support-specific capability query; no search implementation change is required. Initial inbox verification also caught reply focus restoration occurring before the pending-disabled textarea re-enabled; post-commit focus restoration fixed that real-control failure.

EXB-08 confirmed browser finding / scope evidence: on the production static export at 768×900, 320×740, 720×450 and 320×450, send failure/success can leave focus on the Sheet's root dialog instead of the reply. Disabling the focused submit button causes the real browser/Radix focus scope to recover to the dialog; `ticket-detail.tsx:40` recognizes only the origin or BODY, mistaking automatic recovery for user navigation. Preserve focus on an enabled, local result while pending and restore after settlement only if that destination still owns focus. Add regression coverage for pending focus and deliberate focus movement, then repeat the real-browser mobile matrix. No parent Sheet change is justified. Browser geometry already confirms bounded overflowing history, wrapping references, mouse/keyboard 25–50% resizing and independent desktop scroll; remaining checks still gate completion.

Completion evidence:

- Read the full shared task rules and EXB-05/06 conventions; implemented directly in this already-delegated session with no nested agents. Changed (relative to `packages/react/@examples/nextjs`): new `components/real-examples/support-inbox/{index.tsx,types.ts,fixtures.ts,use-support-inbox-controller.ts,support-inbox.test.tsx,components/ticket-detail.tsx}`, `lib/sections/real-examples.ts`, `lib/example-registry.test.ts`, the necessary `components/catalog-page.test.tsx` expectation described above, and both example/real-example READMEs. Task edits are confined to EXB-07.
- Composition: `/real-examples/support-inbox` has ten stable local tickets, fixed UTC message/reply times, text initials, a long conversation/reference, resolved and historical read-only cases. Actual package Resizable uses `orientation="horizontal"`, `"35%"` / `"65%"` default sizes and percentage bounds; desktop list/detail and mobile Sheet use bounded ScrollAreas and semantic Item list rows. Registry capabilities and four related primitive URLs derive automatic reverse links through EXB-06 infrastructure.
- Session policy: local controller owns selection, per-ticket drafts/results and one synchronous mutation guard. Pending freezes only that ticket's draft and all mutations; selection, mobile close, preview transitions and drafting other tickets remain available. Send captures trimmed input/outcome, commits one message on success and clears only its draft; failure retains input for retry. Resolve/reopen retains drafts and commits only on success. Read-only/resolved restrictions and pending reasons are described next to the controls. Search/status filter only the list; a retained selected conversation explicitly reports when outside the filters. Empty/Loading/Error preview states preserve the mounted session; remount resets fixtures.
- Focus/recovery: shared outcome picker is reachable inside the mobile Sheet for failure → success retry. Reply/result focus is restored after enabled controls commit, only for the active originating view when focus has not moved elsewhere. Sheet close/Escape restores the opener, then Search if resolution/filtering removed it, then the persistent heading. Real-control regressions observe actual simulator payloads/counts, same-turn duplicate form submits, pending navigation/close, per-ticket isolation, retained failed send/resolve/reopen and retry, preview retention, no-results reset, read-only guards, layout transition state, and remount reset.
- Final verification from the example directory: `pnpm exec vitest run components/real-examples/support-inbox/support-inbox.test.tsx components/real-examples/_shared/real-example-tooling.test.tsx lib/example-registry.test.ts lib/example-inventory.test.ts lib/internal-links.test.ts lib/import-boundary.test.ts components/catalog-page.test.tsx && pnpm typecheck && pnpm lint` — **70/70 passed** (**7 inbox / 14 shared / 24 registry / 4 inventory / 5 internal links / 4 import boundary / 12 catalog**), typecheck exit **0**, lint exit **0** with zero warnings. The first targeted run was **1 failed / 52 passed** before the reply-focus fix. Root `git diff --check` — exit **0**.
- EXB-08 reviewer guidance / exact remaining browser risks: jsdom stubs `matchMedia` and `ResizeObserver`; no real geometry or browser success is claimed. At desktop, verify mouse/keyboard separator resizing to 25–50%, independent list/history scrolling and long-reference wrapping. At **320px, 768px, desktop and 200% zoom/equivalent**, verify all nine SUP-101 messages and newly appended replies are reachable (history intentionally does not force scroll-to-bottom), and the Sheet's outer-scroll fallback keeps outcome/composer/Close reachable at short heights. Check real Tab/Shift+Tab trapping, Escape and filtered resolve → close focus after animations, and late settlement after pending close/navigation. Cross **1024px** with a draft/open Sheet: server snapshot starts mobile; desktop preserves selection/draft and returns closing-Sheet focus to Search, while returning to mobile retains prior open intent until explicitly closed. Check for hidden overlays, stranded focus, horizontal overflow and hydration warnings; actual virtual-keyboard sizing is unverified. These are detailed in `components/real-examples/README.md`; browser integration and full test/build/static-export gates remain owned by EXB-08.
- No unresolved implementation blocker or independent scope addition. Earlier/unrelated React/Angular work was preserved; no parent source, CHANGELOG.md, dependencies/lockfiles, commits or generated output were changed by this session.

EXB-08 correction completion evidence:

- The new pending-focus regression first failed (**1 failed / 7 skipped**). `components/ticket-detail.tsx` now moves focused action-origin focus to its enabled local result before disabling the control, and recognizes that result at settlement. It still respects deliberate movement to another control, closing, navigation and unmount. Updated the real-example README with this policy.
- Focused inbox suite: **8/8 passed**, followed by typecheck/lint/build success; final full suite: **156/156 passed**. Actual Chromium verification passed all **seven support scenarios**, including five viewport runs, independent desktop resize/scroll, and pending/navigation/breakpoint transitions. Detailed matrix and limitations are recorded below. EXB-07 completed; required browser gates are satisfied.

### Task EXB-08: Independently review and verify the completed integration

Status: completed

Kind: investigation

Priority: P1 — status words alone do not establish completed acceptance criteria.

Suggested agent: Independent integration reviewer, fresh session distinct from implementers

Dependencies: EXB-01, EXB-02, EXB-03, EXB-04, EXB-05, EXB-06, EXB-07

Primary ownership: this task file, focused necessary corrections/tests, final verification evidence.

Finding / References: tasks above interact through shared controls, registry and session lifetimes. README defines example lint/typecheck/test/build gates and source-only validation boundary.

Requirements:

1. Read the entire task file and changed source/tests/docs; verify every acceptance criterion, especially multi-step state, pending navigation, metadata serialization and reverse registration.
2. Run full example gates and shared browser integration checks. Correct confirmed regressions with focused evidence; record scope additions before implementing them.
3. Verify all tasks have truthful status and Completion evidence; preserve pre-existing work and confirm CHANGELOG.md untouched. Summarize limitations and approval in a criterion-level final review record.

Acceptance criteria: all seven implementation tasks meet criteria, full gates/static export pass including support route, browser requirements have actual evidence, final review finds no unresolved required item. Top-level status becomes completed only then.

Verification: shared final integration commands, browser smoke checks and `git diff --check`; review task statuses/evidence and scoped changes.

Completion evidence — independent integration review:

- Read the entire task file, changed example source/tests/docs (including new untracked feature modules), registry projection/inventory, and local session/mutation owners. Reviewed every acceptance criterion rather than relying on earlier completion claims. Reopened EXB-03/04/07 for the three confirmed findings recorded above before correcting them. Earlier historical evidence remains intact.
- Reviewer corrections are limited to settings `components/use-save-section.ts` / `settings.test.tsx`, customers `use-customers-controller.ts` / `customers.test.tsx`, support `components/ticket-detail.tsx` / `support-inbox.test.tsx`, the two example READMEs, and this task file. No parent React/Angular source edits, CHANGELOG.md edits, dependency/lockfile changes, commits, or nested agents. Pre-existing parent and implementation work was preserved.
- Registry inspection: `CatalogIndexPage` passes the explicit `listCatalog` allowlist (title, URL, description, copied string capabilities and related title/URL pairs), not registry entries/loaders. All four actual client-boundary props serialize in tests; listing never invokes the loader spy. Related titles/reverse links derive from the existing registries, and loader identity checks map back to the owned implementation.
- Independent filesystem probe: temporarily added `components/showcases/components/exb08-orphan-probe.tsx` and `components/real-examples/exb08-orphan-probe/index.tsx`. `pnpm exec vitest run lib/example-inventory.test.ts` failed with **1 failed / 3 passed**, naming both exact unregistered paths. Removed both using `apply_patch`; final inventory suite passed **4/4**.

### Final command gates

Commands below ran serially from `packages/react/@examples/nextjs` (root check separately):

| Gate                                                                                                          | Final result                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TZ=UTC pnpm test`                                                                                            | **14 files / 156 tests passed**: customers 22, settings 20, launch 15, pricing 11, support 8, shared tooling 14, catalog 12, registry 24, reverse inventory 4, internal links 5, import boundary 4, navigation 8, form demo pages 8, dialog page 1 |
| `pnpm typecheck`                                                                                              | Exit **0**                                                                                                                                                                                                                                         |
| `pnpm lint`                                                                                                   | Exit **0**, zero lint warnings                                                                                                                                                                                                                     |
| `TZ=UTC pnpm build`                                                                                           | Exit **0**, **105/105 static pages**, includes `/real-examples/support-inbox` and all five workflows                                                                                                                                               |
| `TZ=America/Los_Angeles pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx` | **15/15 passed** in a separate process                                                                                                                                                                                                             |
| `TZ=Pacific/Kiritimati pnpm exec vitest run components/real-examples/launch-request/launch-request.test.tsx`  | **15/15 passed** in a separate process; UTC's 15/15 is included in the full run                                                                                                                                                                    |
| Root `git diff --check`                                                                                       | Exit **0**                                                                                                                                                                                                                                         |
| Root CHANGELOG/lockfile diff inspection                                                                       | No changes in those paths                                                                                                                                                                                                                          |

Build retains Next's existing multiple-workspace-root/lockfile inference warning; test runtime emits Node 26's experimental localStorage warning. Neither is a failing gate or a new implementation finding. Root has no all-repository test command; parent artifact/Angular validation was not needed for these example-only corrections.

### Actual browser verification

- Reused repo-local **Playwright Core 1.62.1** with cached **Chromium 151.0.7922.34** (machine-specific discovery/install paths omitted). No installation was necessary.
- Repeatable temporary harness (all paths under `TMPDIR=<repo-root>/node_modules/.cache/exb08-browser`, ignored): **`node <repo-root>/node_modules/.cache/exb08-browser/review.mjs`** — **21/21 scenarios passed**, no page exceptions or browser console/hydration errors on the final run. `ONLY=<name fragment>` supports focused reruns. Screenshots are `<repo-root>/node_modules/.cache/exb08-browser/exb08-support-<width>x<height>.png`; inspected desktop/mobile/short-height captures alongside geometry assertions.
- The harness spawns the installed `serve` CLI over the UTC-built `out/` at port 4178, uses isolated browser contexts, and closes browser/server in `finally`. An independent post-run fetch confirmed **port 4178 closed**. Browser evidence uses real production HTML/CSS, pointer/wheel/keyboard events, focus and geometry; jsdom is not used to infer these outcomes.
- Early browser failures included the actual customer hidden-opener and inbox Sheet-root focus defects fixed above. Harness-only corrections used the native select's actual accessible name, scrolled a visible ticket before wheel input on the short viewport, awaited Sheet disappearance rather than counting mid-animation, and expected Search when a breakpoint remount had removed the original opener (the existing documented fallback). One earlier run had `ERR_NETWORK_CHANGED`; the final complete run had no such error. No product criterion was removed to obtain a pass.

| Browser scenario group                                        | Matrix / exact coverage                                                                                                                                                                                                                                                                                                                                                                                                                 | Result |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Support layout and operations — 5 scenarios                   | **1440×1000, 768×900, 320×740, 720×450, 320×450**. 720×450 is the CSS-viewport equivalent of 1440×900 at 200% zoom; 320×450 adds narrow/short stress. Scroll to final/read-only tickets, verify restrictions, wheel and keyboard history scroll, reach all nine original messages and the tenth appended reply, failure-retained draft → retry, composer/outcome/Close reachability, and no document/history/Sheet horizontal overflow. | PASS   |
| Support mobile keyboard/focus (within the 4 mobile scenarios) | Real Tab and Shift+Tab, **20 steps each direction per viewport**, remain in the Sheet. Escape returns to the usable opener; resolve under Open filter removes the opener and close focuses Search. Pending and settled reply focus verified after animations. Outer Sheet scrolling exposes controls at short heights.                                                                                                                  | PASS   |
| Desktop separator and scroll — 1 scenario                     | Mouse drag to **25% and 50%**, keyboard Home/End to both limits, independent list/history wheel scroll with the other scrollTop unchanged; long reference wraps.                                                                                                                                                                                                                                                                        | PASS   |
| Support session/layout lifetime — 1 scenario                  | 768→1440→768 with open Sheet/draft retains selection/draft and prior open intent, closes desktop overlay and focuses Search. Explicit close clears open intent. Send → deliberate focus movement within Sheet does not steal focus; pending Escape/close and navigation settle on the originating ticket. Other-ticket drafts, hidden failure and catalog Error/Retry survive; no stranded overlay.                                     | PASS   |
| Customers recovery — 2 scenarios                              | **1440px / 320px**: filtered rename failure retains input/focus, retry success focuses Search; active-filter archive focuses Search; Empty → first-add produces one customer and restores Add focus.                                                                                                                                                                                                                                    | PASS   |
| Customers responsive settlement — 6 scenarios                 | **1440→320 and 320→1440 × cancel/success/failure** with archive confirmation open. CSS-hidden connected opener falls back to Search.                                                                                                                                                                                                                                                                                                    | PASS   |
| Pricing — 1 scenario                                          | Cancel/failure return to Choose Growth; pending Escape is blocked; success focuses persistent result after the current-plan opener is disabled.                                                                                                                                                                                                                                                                                         | PASS   |
| Settings — 1 scenario                                         | Pending profile save survives section switch. Deletion cancel/failure/retry-cancel/retry-success focus, pending Escape protection, persistent failure and terminal deletion survive section/catalog round trips; disappearing retry opener falls back to terminal status.                                                                                                                                                               | PASS   |
| Launch timezone — 3 scenarios                                 | **UTC server export → UTC / America/Los_Angeles / Pacific/Kiritimati browsers**. Each checks actual JavaScript-disabled server HTML first, then hydrated March 30 picker/selected day/review; March 31 save → April 1 edit → discard retains March 31 in picker/review/debug. No hydration warnings. Actual payload values are separately asserted by the process-isolated simulator tests.                                             | PASS   |
| Catalog — 1 scenario                                          | Five initial workflow cards, keyboard capability search, useful zero results, Tab/Enter clear with input focus, and correct related Sheet URL.                                                                                                                                                                                                                                                                                          | PASS   |

### Criterion-level final matrix

All source paths below are relative to the example. “Suite” refers to the final passing tests above; “browser” refers to the actual matrix above.

| Task / criterion                                                         | Evidence and disposition                                                                                                                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| EXB-01: save A → edit B → discard A                                      | Launch suite asserts all edited text/select/team/approval fields and saved baseline. **PASS**                                                                                        |
| EXB-01: pristine success / later unsaved status                          | Launch suite checks dirty state, review labels and revision. **PASS**                                                                                                                |
| EXB-01: failure leaves baseline/revision unchanged                       | Failed B / pending C / discard A / retry D regression. **PASS**                                                                                                                      |
| EXB-01: pending edits and duplicate protection                           | Cloned snapshot, live newer text/array edits, return-to-old-default and same-turn simulator count regressions. **PASS**                                                              |
| EXB-02: March 30 default, edited day, payload, discard                   | 15 launch tests pass under each of three process timezones, including March 8 DST boundary, clear/required validation and date-only simulator payloads. **PASS**                     |
| EXB-02: server/browser initial agreement                                 | Three real-browser timezone scenarios over UTC-built server HTML and hydration. **PASS**                                                                                             |
| EXB-03: independent unsaved/saved section round trips                    | Four parameterized editable-section regressions plus concurrent saves and other-section draft retention. **PASS**                                                                    |
| EXB-03: hidden pending/failure completion, discard baseline              | Session hook owns immutable drafts/baselines/results above switchable views; tests and browser verify settlement. Same-turn duplicate defect fixed and regressed. **PASS**           |
| EXB-03: terminal deletion across navigation/catalog                      | Failure and pending deletion lifecycle tests, terminal round trips, fresh-mount reset; browser terminal check. **PASS**                                                              |
| EXB-04: add/rename/archive/delete failure → retry → success              | Actual controls and simulator counts in customer/settings suites; browser customer/deletion recovery. **PASS**                                                                       |
| EXB-04: Empty → actionable first customer                                | Actual empty dataset and first-add suite/browser assertions. **PASS**                                                                                                                |
| EXB-04: stable customer/pricing/deletion settlement focus                | Filtered/disabled/disappearing opener tests and browser matrix; responsive hidden-opener defect fixed. Synthetic catalog-unmount cases remain explicitly labeled in suites. **PASS** |
| EXB-04: retained values, persistent feedback, pending guard, real counts | Retained name input, inline deletion/archive errors, Escape/duplicate checks and actual simulator spies (including pricing). **PASS**                                                |
| EXB-05: focused customer orchestration/local responsive modules          | Entry composes controller and explicit table/cards with one rows/actions/filter/page model. Source and both-surface page-clamping regressions. **PASS**                              |
| EXB-05: shared accessible picker with ≥4 callers                         | Five workflows now use the labeled shared picker; keyboard choice/nonclearable selection and independent labels tested. **PASS**                                                     |
| EXB-05: earlier regressions, shared clamping and lifetime documentation  | Full suite passes; READMEs describe captured outcome, pending, failure, Empty reset, preview and remount semantics; no performance claim. **PASS**                                   |
| EXB-06: keyboard title/description/capability search, zero/reset/links   | Catalog suite plus browser capability/clear workflow and link validation. **PASS**                                                                                                   |
| EXB-06: serializable metadata, initial SSR, lazy loaders                 | Explicit projection inspected; four client prop roundtrips/SSR card checks and untouched loader spy. **PASS**                                                                        |
| EXB-06: orphan probe fails, routes still resolve                         | Independent two-file filesystem failure probe, cleaned final inventory/loader identity/registry/internal-link tests; 105-page export. **PASS**                                       |
| EXB-07: selection/search/filter/reply/retry/resolve/reopen               | Inbox suite, per-action captured simulator payloads, browser send/retry/filter/resolve/reopen. **PASS**                                                                              |
| EXB-07: isolated drafts and failed reply retention                       | Two-ticket, hidden completion, preview retention and remount tests; browser navigation/pending close. **PASS**                                                                       |
| EXB-07: pending protection / read-only restrictions                      | Actual simulator counts, same-turn submit, blank/resolved/historical guards; browser read-only fixture and enabled drafting on other tickets. **PASS**                               |
| EXB-07: mobile close/filter/settlement focus                             | Four mobile viewport runs plus breakpoint/pending scenario; Sheet-root focus defect fixed with regression and actual browser replay. **PASS**                                        |
| EXB-07: desktop resize/scroll, narrow/zoom layout                        | Five geometry/interaction viewport runs, mouse/keyboard separator limits and independent scroll scenario. **PASS**                                                                   |
| EXB-07: registered route and reverse inventory                           | Dynamic entry/lazy loader, factual four primitive links and reverse links; inventory/registry/export checks. **PASS**                                                                |
| EXB-08: independent full review, gates, truthful evidence and scope      | All criteria above passed; three recorded findings corrected with regression evidence; root diff check clean. **PASS — approve completion**                                          |

### Coverage limits and recommendation

- Browser coverage is **headless Chromium on Linux**, using mouse/wheel and keyboard, not physical touchscreen/virtual-keyboard behavior, Firefox/WebKit/Safari, screen-reader output, or every OS/browser. 200% coverage is equivalent CSS viewport reflow, not browser-chrome zoom rasterization. Those are coverage limits, not substituted claims of success.
- This remains source integration against parent aliases. Published-package artifacts, Angular, backend persistence/authentication/security, remote services and full primitive parity were not audited. Simulation timers remain uncancelled on full unmount as documented; their closure-local state does not mutate a new session. Synthetic modal-blocked catalog transitions in jsdom are lifecycle stress evidence, not ordinary pointer interactions.
- Temporary harness/screenshots under `<repo-root>/node_modules/.cache/exb08-browser` (ignored, `TMPDIR=<repo-root>/node_modules/.cache/exb08-browser`) are session-local artifacts; the durable criterion/command/browser evidence is this task file and the three new colocated regressions. No required criterion is blocked. **Recommendation: approve this example integration; EXB-01–08 and the top-level objective are completed.**

### Coordinator final audit

- Subsequent phase: `20260926-191800-nextjs-session-validation-followup.md` tracks newly reproduced workspace deletion/save eligibility and launch validation/discard-focus gaps. The completed evidence below remains historical; those additional sequences were not part of its verified coverage.

- Read the entire completed task file and final criterion matrix after EXB-08 returned; all eight tasks are completed with Completion evidence and no unresolved required acceptance criterion.
- Recorded the eight distinct, sequential sub-agent session IDs above and clarified two agents' references to unavailable nested delegation tools: both were already running as separately delegated sub-agents.
- Independently ran root `git diff --check`, scoped example diff/stat and status inspection, and `git diff --exit-code -- CHANGELOG.md`; all checks exited 0 and CHANGELOG.md is untouched. Source changes remain scoped to the example; earlier parent React/Angular work is preserved. No source changed after the final passing integration gates; this audit only updates the execution record.
