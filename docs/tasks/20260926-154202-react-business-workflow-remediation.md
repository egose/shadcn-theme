# React Business Workflow Remediation

Created: 2026-09-26 15:42:02 local time

Status: completed

## Objective and product context

Improve the existing `@egose/shadcn-theme` React component library for customer-management, settings, launch-request, and multi-workspace applications. Reliable form submission, retained selections, validation/focus, asynchronous feedback, and correct navigation are prerequisites for those workflows. The package README and `packages/react/@examples/nextjs/components/real-examples/README.md` establish this reusable business-UI purpose; application authorization and persistence belong to consumers.

Scope: `packages/react/{components,hooks,layouts}`, focused package tests, and shipped API documentation. Preserve deep-import public APIs and React 18/19 compatibility. No Angular changes, new application/backend features, package publication, or edits to root `CHANGELOG.md` (`<repo-root>/CHANGELOG.md`).

## Analysis coverage and triage

- Reviewed form/select and multi-selector chains, button loading, widget/dialog contracts, all three hooks, both layouts and navigation/context supporting chains, package metadata/build/test scripts, React CI, and focused existing tests.
- Deduplicated against completed `20260823-123503-react-package-health-remediation.md` (notably provider isolation, lifecycle cleanup, empty contexts, date control synchronization, package validation) and reviewed example task scope. This is a new phase; those completed outcomes remain requirements.
- Initial worktree was clean. No baseline tests were run during analysis; runtime reproductions are required within implementation tasks. Findings are source-backed until those checks run.
- Security review found UI-state/interaction correctness issues, not a demonstrated authorization bypass. Tenant context labels must agree with application state, but no backend authorization or dependency audit was performed.
- Performance: avoid needless state-synchronization effects and repeated selection scans where naturally supported by these fixes. No speedup claim or broad optimization project without measurement.
- Defer new data-grid/upload/server-search subsystems: no concrete product contract requiring them. This review is focused, not an exhaustive audit of every primitive or assistive-technology/browser combination.

## Execution and verification rules

- Run BUS-01 through BUS-09 **sequentially**, inserting discovered follow-up BUS-04A immediately after BUS-04, each in a fresh isolated sub-agent session; no nested agents. Agents share the worktree but never run concurrently. Each agent starts only after dependencies complete and updates only its task's status/evidence plus owned implementation/docs. All file access and commands must remain within this project repository (user constraint).
- Use `apply_patch` for edits; preserve previous agents' work. Do not commit, publish, or edit CHANGELOG.md. Generated dist/release/consumer outputs are not source deliverables.
- Every implementation task: reproduce defects in focused tests before fixing where practical; run its focused tests, `pnpm typecheck`, and `pnpm lint` from `packages/react`. No full bundle after each small task. Record commands, actual results, changed paths, limitations, and session ID under **Completion evidence**. Never mark unverified work completed.
- Shared hotspots (`README.md`, `llms.txt`, form controls/tests) are serialized. Keep consumer-facing behavior changes documented there and in public JSDoc (these serve as change notes without touching CHANGELOG.md).
- Final integration: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm test:package`, `pnpm test:client-boundaries`, `pnpm test:rsc`, `pnpm pack:package`, `pnpm prepare:consumer`, `pnpm build:consumer`, `pnpm test:consumer` from `packages/react`. These are existing package/React CI commands. `test:package` builds/stages without publishing and validates packed files and condition-aware imports/types.
- Prerequisites: installed root/React dependencies, Node >=20, pnpm; isolated consumer fixture dependencies installed (if absent use CI's `pnpm install --frozen-lockfile --ignore-workspace` from `packages/react/test-fixtures/isolated-consumer`). There is no root all-repository test script. Angular checks are outside this React-only scope. Run Next.js example checks if changed or the review discovers affected consumer assumptions.
- Definition of done: every acceptance criterion verified, all task statuses completed with evidence, fresh artifact/consumer checks pass, independent reviewer approves integration, no unintended files or CHANGELOG.md changes.

Priority: P1 = user-visible data/state/interaction correctness; P2 = usability or maintainability improvement without demonstrated data loss.

## Tasks

### Task BUS-01: Enforce loading button activation protection

Status: completed

Kind: defect

Priority: P1 — repeat activation can duplicate asynchronous business actions.

Suggested agent: React interaction engineer

Dependencies: none

Primary ownership: `packages/react/components/ui/button.tsx`, `packages/react/tests/button.test.tsx`.

Finding / References: `Button` at `components/ui/button.tsx:209-237` sets effective disabled before spreading props; explicit `disabled={false}` overrides `loading`. Existing button tests cover loading only with disabled omitted.

Requirements:

1. A native loading button must be disabled regardless of the caller's disabled value; preserve non-loading disabled behavior and existing variants/asChild API.
2. Document the effective disabled contract; do not redesign polymorphic hosts.

Acceptance criteria: loading with omitted/false/true disabled blocks activation; completion restores enabled state only when caller permits; regression fails on old prop precedence.

Verification: focused `pnpm exec vitest run tests/button.test.tsx` and shared implementation checks.

Completion evidence:

- Changed: `packages/react/components/ui/button.tsx` applies effective `disabled` after spreading caller props; public `ButtonProps` JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document loading precedence and restoration of caller-disabled state. `packages/react/tests/button.test.tsx` covers activation before/during/after loading with disabled omitted/false/true. This task document records BUS-01 status/evidence.
- Regression before fix (working directory `packages/react`): `pnpm exec vitest run tests/button.test.tsx` failed as intended: 1 failed, 15 passed. The disabled-false case called the click handler once while loading, proving the old prop-precedence defect.
- Verification after fix (working directory `packages/react`): `pnpm exec vitest run tests/button.test.tsx` passed all 16 tests; `pnpm typecheck` passed (`tsc --noEmit --pretty false`); `pnpm lint` passed (`eslint . --max-warnings 0`). All exited 0.
- Review (repository root): `git diff --check` passed; `git diff --stat` and the focused `git diff -- packages/react/components/ui/button.tsx packages/react/tests/button.test.tsx packages/react/README.md packages/react/llms.txt` confirmed the minimal prop-order fix and matching tests/docs. Initial `git status --short` showed only this pre-existing untracked task document.
- Final `git diff --check && git status --short` passed: the four intended package files are modified and this task document remains untracked. An unrelated untracked `docs/tasks/20260926-154324-angular-business-controls-health.md` appeared during the session and was left untouched. No CHANGELOG.md change.
- Session: fresh isolated implementation session; no session ID exposed. Ancestor `AGENTS.md` searches in parent directories outside `<repo-root>` were permission-rejected and not retried; proceeded with repository-local shared rules per coordinator instruction.
- Limitations / follow-ups: focused native-button regression and package static checks only; full integration/artifact/consumer verification remains assigned to BUS-09. No new BUS-01 follow-up or blocker found.

### Task BUS-02: Repair select control contracts and human-label searching

Status: completed

Kind: defect

Priority: P1 — disabled/required/named form fields do not honor advertised props; ID-based records cannot be found by visible label.

Suggested agent: React selection UX engineer

Dependencies: BUS-01

Primary ownership: `components/form/select.tsx`, `components/form/searchable-select.tsx`, focused select tests, README selection documentation (all below `packages/react`).

Finding / References: `FormSelect` (`select.tsx:39-73`) ignores disabled and omits root name/required and trigger id. `FormSearchableSelect` (`searchable-select.tsx:89-112`) omits trigger id and cmdk label keywords; cmdk searches the stored ID. No dedicated package tests cover these contracts.

Requirements:

1. Forward FormSelect's root name/required/disabled and associate its label with its trigger; preserve controlled/default behavior.
2. Associate searchable-select labels and search labels as well as stable IDs without changing emitted values or clear behavior.
3. Verify object options with differing IDs/labels, duplicate labels with distinct IDs, string options, and no-results feedback.

Acceptance criteria: disabled control cannot open/change, named FormSelect contributes the selected value to FormData, required state reaches the primitive, label targets the focusable control, searching “Acme” finds `{value: 'cust_42', label: 'Acme Industries'}` and emits `cust_42`.

Verification: new focused select regression test file(s), shared implementation checks.

Completion evidence:

- Changed: `packages/react/components/form/select.tsx` forwards root `name`/`required`/`disabled` and sets the trigger ID; `packages/react/components/form/searchable-select.tsx` sets the trigger ID and supplies label keywords to cmdk while retaining stable item values and the existing clear handler. Public JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document the selection contracts and canonical deep-import usage. Added `packages/react/tests/form-select.test.tsx`; this document updates only BUS-02 status/evidence.
- Reproduction before fix (working directory `packages/react`): `pnpm exec vitest run tests/form-select.test.tsx --reporter=dot` failed; its verbose DOM output was truncated. Re-ran with `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/form-select.test.tsx --reporter=dot` to obtain concise evidence: 10 failed, 3 passed (exit 1). Failures demonstrated opening a disabled select, missing named FormData entries, missing required semantics, unassociated default/explicit labels on both controls, and missing human-label/duplicate-label search results. Existing stable-ID search and string-option behavior passed.
- Verification after fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/form-select.test.tsx` passed all 13 tests (exit 0); `pnpm typecheck` passed (`tsc --noEmit --pretty false`, exit 0); `pnpm lint` passed (`eslint . --max-warnings 0`, exit 0).
- Regression coverage uses real Radix/cmdk controls, with test-local scrolling/ResizeObserver shims for jsdom. Verified disabled activation and re-enabling, default/new selections in FormData, required trigger/native-select semantics, controlled value authority and external changes, explicit/default trigger-label association and focusability, differing IDs/labels, duplicate-label IDs, label/ID search, clear emission, string options, popup closure, and no-results recovery without selection changes.
- Review (repository root): `git diff --check && git status --short` passed; focused `git diff -- packages/react/components/form/select.tsx packages/react/components/form/searchable-select.tsx packages/react/README.md packages/react/llms.txt` confirmed the scoped fixes/docs and preserved BUS-01 documentation. Concurrent Angular changes and prior BUS-01 button changes were left untouched. No CHANGELOG.md edits, commits, publication, or generated deliverables.
- Session: fresh separate BUS-02 implementation session; no session ID exposed and no nested agents. File reads/edits and command working directories stayed within the project repository; no external skill files or temporary directories outside `<repo-root>` were accessed.
- Limitations / follow-ups: verification is focused jsdom interaction coverage and package static checks, not a browser/assistive-technology or React-version matrix. Full integration, emitted declarations, artifact, and installed-consumer verification remain assigned to BUS-09; selection ref/blur lifecycle remains BUS-04. No new BUS-02 blocker or follow-up found.

### Task BUS-03: Retain multi-select IDs across option refreshes

Status: completed

Kind: defect

Priority: P1 — editing an incomplete option list silently removes unrelated selected IDs.

Suggested agent: React controlled-state engineer

Dependencies: BUS-02

Primary ownership: `packages/react/components/form/multi-select.tsx`, focused tests, selection documentation.

Finding / References: `FormMultiSelect.selectedValues` at `multi-select.tsx:60-67` maps through options and filters missing IDs; subsequent `handleValueChange` emits only survivors. With values A/B and only option A, removing A emits [] rather than [B]. No focused refresh coverage exists.

Requirements:

1. Preserve all controlled IDs, using the ID as a fallback label when metadata is absent; refresh to the human label when metadata arrives.
2. Derive selection without mount/data-refresh callbacks; preserve order and existing string/object inputs. A local option lookup is appropriate, without introducing caching infrastructure or unmeasured speedup claims.

Acceptance criteria: empty/partial/updated options never silently drop IDs; add/remove preserves unrelated values; newly hydrated labels replace fallbacks; regressions reproduce old data loss.

Verification: focused multi-select option-refresh tests and shared implementation checks.

Completion evidence:

- Prerequisites: read shared execution rules and BUS-01/BUS-02 completion evidence; BUS-02 was completed with passing focused tests, typecheck, and lint. Set BUS-03 to in_progress before implementation.
- Changed: `packages/react/components/form/multi-select.tsx` derives every controlled ID through a local option lookup, falling back to `{ value: ID, label: ID }` instead of filtering missing options. Existing callback mapping remains unchanged. Public props/component JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document order, missing metadata, label hydration, and controlled acceptance. Added `packages/react/tests/form-multi-select.test.tsx`; this document updates only BUS-03 status/evidence.
- Reproduction before fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/form-multi-select.test.tsx` failed all 6 tests (exit 1). Removing known `cust_42` with missing selected `cust_73` emitted `[]` instead of `['cust_73']`; adding an option dropped `cust_73` for both object and string data. Empty options hid all selected badges and prevented explicit missing-ID removal.
- Verification after fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/form-multi-select.test.tsx` passed all 6 tests (exit 0); `pnpm typecheck` passed (`tsc --noEmit --pretty false`, exit 0); `pnpm lint` passed (`eslint . --max-warnings 0`, exit 0).
- Coverage: real Radix/cmdk interactions with test-local jsdom scrolling/ResizeObserver shims; ordered IDs across empty/partial/hydrated/renamed/cleared metadata; StrictMode mount and refresh without callbacks; add/toggle for string and object options; badge and Backspace removal with empty data; exact callback counts/payloads; unchanged display until parent acceptance; external replacement, reordering, and clearing of controlled values.
- Review (repository root): `git diff --check` passed; focused diff review confirmed the minimal derivation fix and matching docs, retaining prior BUS-01/BUS-02 changes. Initial worktree contained earlier React work and concurrent Angular work; those changes were preserved. No CHANGELOG.md edits, commits, publication, or generated source deliverables.
- Session: separate isolated BUS-03 implementation session; no session ID exposed and no nested agents. File access and command working directories stayed inside the repository; only the repository-local package skill was loaded, with no external skill reads or temporary directories.
- Limitations / follow-ups: focused jsdom coverage and package static checks only; final integration/artifact/installed-consumer verification remains BUS-09, and selection ref/blur lifecycle remains BUS-04. No new BUS-03 blocker or follow-up found.

### Task BUS-04: Restore react-hook-form blur and focus through selection controls

Status: completed

Kind: defect

Priority: P1 — on-blur validation, touched state, and invalid-field focus fail for common business forms.

Suggested agent: React Hook Form accessibility engineer

Dependencies: BUS-03

Primary ownership: `components/form/{hook-select,hook-searchable-select,hook-multi-select,select,searchable-select,multi-select}.tsx`, `components/ui/multi-select.tsx`, focused RHF tests and docs under `packages/react`.

Finding / References: each hook selection wrapper's Controller render destructures only onChange/value (`hook-select.tsx:31`, `hook-searchable-select.tsx:31`, `hook-multi-select.tsx:32`), discarding field.onBlur/ref. `MultiSelectorInput` (`components/ui/multi-select.tsx:253`) ignores `_ref` and overwrites incoming blur behavior. Existing tests do not verify selection blur/focus lifecycle.

Requirements:

1. Forward refs to actual focusable triggers/input and pass/compose Controller blur handlers through all three selection chains.
2. Preserve internal popup/input refs and behavior. Account for portal focus transitions: internal interaction must not incorrectly invalidate a composite field before leaving it.
3. Keep public typing specific, React 18 compatible, and document any added onBlur/ref API; do not broaden to unrelated date/tag fields.

Acceptance criteria: real-control tests demonstrate onBlur validation/touched state, setFocus, and invalid-submit focus for all three controls; internal selection remains functional and previously fixed selection contracts pass.

Verification: focused RHF selection lifecycle and affected select regression tests; shared implementation checks.

Completion evidence:

- Prerequisites: read shared execution rules and completed BUS-01/BUS-02/BUS-03 evidence; set BUS-04 in_progress before implementation. Preserved the pre-existing React changes and concurrent Angular work. Only this task's status/evidence is updated here.
- Changed: all six `packages/react/components/form/{hook-select,hook-searchable-select,hook-multi-select,select,searchable-select,multi-select}.tsx` files connect Controller blur/ref, compose optional consumer blur callbacks, and expose specific button/input refs via React 18/19-compatible forwardRef. New internal `packages/react/lib/selection-focus.ts` checks the settled focus boundary across wrapper and portal, cancels pending work on unmount, and composes input refs including React 19 callback cleanup. `packages/react/components/ui/multi-select.tsx` retains its keyboard-navigation input ref, composes native input handlers, and restores input focus after badge removal. FormMultiSelect keeps input focus on opening/closing internal interactions and preserves outside focus on dismissal.
- Supporting chain: `packages/react/components/ui/select.tsx` now forwards SelectTrigger/SelectContent refs, and `packages/react/components/ui/popover.tsx` forwards PopoverContent refs, so the focusable target and portal-boundary refs also work with React 18's ref model. No unrelated primitive behavior was redesigned. Public JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document ref targets, whole-field no-argument onBlur versus native input blur, internal popup transitions, RHF usage, and handler composition.
- Baseline reproduction (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/selection-focus.test.tsx` failed all 15 initial tests (exit 1). The asynchronous invalid-submit checks and real focus-exit checks showed absent focus and touched/validation in the single controls. The initial multi tests also exposed a pre-existing external-label/ID mismatch; changed those queries to the actual combobox and reran `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/selection-focus.test.tsx --testNamePattern='multi RHF'`: 5 failed, 10 skipped (exit 1), showing missing invalid-submit focus, missing blur/touched updates, and focus lost to body after popup close. The final setFocus assertions additionally await installed RHF's deferred focus; the initial synchronous setFocus assertions alone are not treated as conclusive reproduction evidence.
- Additional focus-edge regressions: before the badge-focus correction, `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/selection-focus.test.tsx --testNamePattern='pointer dismissal|badge focus'` failed 3 tests (21 skipped); the badge failure showed removing its focused button dropped focus to body. After completing the pointer event sequence in the test, `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/selection-focus.test.tsx --testNamePattern='pointer dismissal'` had 1 failed, 1 passed, 22 skipped: the partial multi-select close fix stole focus back after an outside dismissal. Corrected both behaviors before final verification.
- Final verification (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/selection-focus.test.tsx tests/form-select.test.tsx tests/form-multi-select.test.tsx tests/date-pickers.test.tsx tests/date-range-picker-interaction.test.tsx` passed **54 tests in 5 files** (exit 0), including 26 new lifecycle/ref tests, all 19 BUS-02/BUS-03 selection regressions, and 9 date/popover-consumer regressions for the shared primitive ref changes. `pnpm typecheck && pnpm lint` passed both commands (`tsc --noEmit --pretty false`; `eslint . --max-warnings 0`, exit 0).
- Coverage: real RHF/Radix/cmdk controls with only jsdom layout/scrolling shims; all three controls' setFocus, invalid-submit focus, empty onBlur validation/touched state, composed optional callbacks, internal portal opening/selection/Escape, and subsequent field exit; direct portal-to-outside focus and pointer dismissal; badge focus/removal; actual object/callback refs, detachment, StrictMode, React 19 cleanup/ref replacement, retained keyboard Backspace behavior, native input handlers, and unmount cancellation. Existing disabled/name/required/label/search/clear and missing-ID/refresh/controlled-selection contracts all pass.
- Review (repository root): `git diff --check` passed; `git diff --stat`, `git status --short`, and focused component diff review confirmed the BUS-04 changes alongside preserved prior work. No CHANGELOG.md changes, commits, publication, external paths, nested agents, Angular edits, or generated build deliverables from this session.
- Session: separate BUS-04 implementation session; no session ID exposed. All reads/writes/command working directories stayed within the project repository. Read only the repository-local package skill; no external skill or temporary path was accessed.
- Limitations / follow-ups: runtime coverage uses installed React 19 and jsdom (focus movement simulates Tab via native focus rather than a browser keyboard-navigation engine); public source types use React 18-compatible APIs, but the React-version/browser matrix and emitted declaration/artifact/installed-consumer checks remain BUS-09. Observed the pre-existing FormMultiSelect external label/ID mismatch because cmdk supplies its own input ID; this is outside BUS-04's ref/blur acceptance scope and remains a follow-up. RHF focus reaches the actual input independently and all BUS-04 criteria pass.
- Historical follow-up resolution: the external label/ID mismatch recorded above is now resolved by completed BUS-04A; its reproduction, implementation, and verification evidence is below. The original BUS-04 finding and scope record are retained.

### Task BUS-04A: Restore the multi-select visible label association

Status: completed

Kind: defect

Priority: P1 — the visible field label fails to identify/focus the actual selection input for assistive technology and label activation.

Suggested agent: React composite-input accessibility engineer

Dependencies: BUS-04

Primary ownership: `packages/react/components/form/multi-select.tsx`, `packages/react/components/ui/multi-select.tsx`, focused selection tests and public docs if needed.

Finding / References: BUS-04 runtime regression setup found `FormMultiSelect`'s external `Label htmlFor={id}` does not match the actual input: cmdk overrides the supplied input ID. `FormMultiSelect` currently supplies the ID at lines 97/114; `MultiSelectorInput` renders cmdk's input. Tests had to query the actual combobox independently. This new finding is explicitly added before implementation rather than buried in completion evidence.

Requirements:

1. Associate the visible label with the real focusable input using a supported, stable React/cmdk contract; preserve cmdk's internal ARIA relationships and ref/blur behavior.
2. Cover explicit/default IDs, multiple independently rendered controls and label activation. Avoid DOM mutation patches or fragile document-global queries.

Acceptance criteria: `getByRole('combobox', { name: <visible label> })` and label queries resolve the input, the visible label targets/focuses it, multiple fields do not cross-label, and prior selection lifecycle/refresh tests remain green.

Verification: focused new label regressions plus affected multi-select/lifecycle tests, `pnpm typecheck`, `pnpm lint` from `packages/react`.

Completion evidence:

- Prerequisites: read the shared rules, task, and BUS-04 evidence; set BUS-04A in_progress before implementation. Inspected installed cmdk 1.1.1's public label/ref contract and implementation: it overrides supplied input ID and aria-labelledby, and uses its generated ID for its hidden label and keyboard focus. Preserved previous React work and concurrent Angular changes.
- Changed: `packages/react/components/form/multi-select.tsx` composes a stable React callback with the existing input ref chain, observes the mounted input's actual ID, and renders the visible label's htmlFor from that state. It passes the visible label text through cmdk's supported Command label prop. cmdk retains its generated ID, hidden-label association, aria-controls/aria-activedescendant, and internal keyboard focus behavior; no DOM mutations, private context access, or document-global lookup was added. Public ID JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` explain cmdk's final-ID ownership and ref-based focus.
- Tests changed: `packages/react/tests/form-multi-select.test.tsx` adds 3 label regressions; `packages/react/tests/selection-focus.test.tsx` now queries the RHF multi control by its visible accessible name instead of using an unnamed-combobox workaround. This task document records BUS-04A status/evidence and adds the resolution note to BUS-04 without erasing history.
- Reproduction before fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/form-multi-select.test.tsx` failed with **3 failed, 6 passed** (exit 1). Visible htmlFor was `customer-choices` or explicit `customer-picker` while the input had cmdk-generated IDs; independently rendered controls had empty accessible names.
- Intermediate verification: the first affected-suite run after the fix had **2 failed, 46 passed** because the new ARIA tests incorrectly assumed an active descendant before keyboard navigation. Changed the tests to activate an item with End before asserting aria-activedescendant; the focused multi-select run then passed **9 tests** (exit 0). No unrelated navigation change was needed.
- Final verification (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/form-multi-select.test.tsx tests/selection-focus.test.tsx tests/form-select.test.tsx` passed **48 tests in 3 files** (exit 0); `pnpm typecheck && pnpm lint` passed both commands (`tsc --noEmit --pretty false`; `eslint . --max-warnings 0`, exit 0). Coverage includes explicit/default ID requests, StrictMode, multiple separate React roots with repeated names, native label/control association and click forwarding, accessible-name and label queries, updated label text with stable IDs, cmdk hidden-label/list/active-option relationships, keyboard selection, all prior RHF/ref/portal-blur lifecycle tests, and option-refresh/retained-ID tests.
- Review (repository root): `git diff --check` passed; focused source/docs diff review confirmed the small form-level fix and preserved prior work. No CHANGELOG.md edits, commits, publication, generated deliverables, or Angular edits from this session.
- Session: separate BUS-04A implementation session; no session ID exposed, no nested agents. All reads/edits/command working directories remained inside the repository; only the repository-local package skill was read, with no external skills or temporary paths.
- Limitations / follow-ups: runtime verification uses installed React 19 and jsdom. jsdom forwards native label clicks but does not implement their focus default action; tests verify label.control and real click forwarding, then simulate that focus action explicitly. The visible htmlFor is established on input ref attachment (mount/hydration), while cmdk's internal label is rendered directly. Browser/assistive-technology and React-version matrices plus final artifact/consumer verification remain BUS-09. No unresolved BUS-04A blocker or additional follow-up found.

### Task BUS-05: Make workspace context reflect authoritative application selection

Status: completed

Kind: defect

Priority: P1 — stale tenant/workspace labels misrepresent the data context in use.

Suggested agent: React layout state engineer

Dependencies: BUS-04A

Primary ownership: `packages/react/layouts/sidebar1/context-switcher.tsx`, context tests, README/JSDoc.

Finding / References: `ContextSwitcher` (`context-switcher.tsx:45-58,105-109`) uses active flags only on initialization, ignores later flags, and changes local selection before application acceptance. Empty-to-loaded chooses the first rather than active item. Prior tests only cover an empty array.

Requirements:

1. Explicit active item is authoritative: display it, and request selection through callbacks without optimistically overriding it. First active wins if multiple are supplied.
2. Without an active item retain local selection by stable name, fall back to the first when removed, and render nothing for empty input. Synchronization must not emit callbacks.
3. Document the controlled-via-active versus uncontrolled contract as a consumer-visible behavior correction; this UI does not enforce authorization.

Acceptance criteria: initial non-first active, empty-to-populated, external A-to-B switch, uncommitted requested switch, updated metadata, removal, and uncontrolled selection are tested; existing empty-list test passes.

Verification: focused context-switcher tests plus existing context reliability tests; shared implementation checks.

Completion evidence:

- Prerequisites: read shared execution rules, BUS-01 through BUS-04A task/evidence, and the prior health-remediation empty-context contract/evidence. BUS-04A was completed with passing checks; set BUS-05 in_progress before implementation. Preserved earlier React work and concurrent Angular changes.
- Changed: `packages/react/layouts/sidebar1/context-switcher.tsx` derives the displayed context from the first active item, otherwise the remembered name, otherwise the first item. Stores only the displayed name; a guarded render-time adjustment remembers fallback/controlled identities and clears empty selection without a synchronization effect or stale metadata objects. User selection changes local state only when no active item exists; callbacks receive the current item exactly once. Added `packages/react/tests/context-switcher.test.tsx`. Public JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document unique/stable names, controlled requests/acceptance, local selection, removal/reappearance, empty/reload, mode handoff, metadata freshness, callback boundaries, and the consumer-visible correction. Only BUS-05 status/evidence changed in this task document.
- Reproduction before fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/context-switcher.test.tsx` failed with **6 failed, 5 passed** (exit 1). Failures demonstrated stale external active selection, failure to follow first-active list order, empty-to-loaded choosing the first instead of the active item, optimistic selection both with and without a callback, and failure to adopt authoritative selection after local use. Initial non-first active, metadata refresh, and existing local fallback behavior passed and remain covered.
- Verification after fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/context-switcher.test.tsx tests/listener-and-context-reliability.test.tsx` passed **14 tests in 2 files** (12 new context tests plus the 2 existing listener/empty-context tests, exit 0). `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/lifecycle-reliability.test.tsx` passed all **3 tests** (exit 0). `pnpm typecheck && pnpm lint` passed both commands (`tsc --noEmit --pretty false`; `eslint . --max-warnings 0`, exit 0).
- Coverage: real SidebarProvider and Radix dropdown in StrictMode, with only a matchMedia browser-API shim. Tests cover initial/non-first/multiple active items, external A-to-B changes, empty load/reload, deferred/rejected requests and parent acceptance, callback omission, exact current-object payloads and reselect, controlled and uncontrolled text/image/logo/class refresh, stable-name selection across recreation/reordering, active/local removal, remembered fallback and non-resurrection, controlled-to-uncontrolled handoff, silent mount/refresh/fallback, and separate add-context behavior.
- Business impact: consumers can keep workspace/customer/settings/launch-request labels aligned with their committed application data context instead of showing a requested but unaccepted workspace. Documentation explicitly assigns data switching, persistence, and authorization to consumers; no authorization-bypass or security-enforcement claim is made.
- Review (repository root): `git diff --check` passed; focused source/docs diffs and `git status --short` confirmed the scoped implementation and preserved earlier work. No CHANGELOG.md edits, commits, publishing, generated source deliverables, or Angular edits from this session.
- Session: fresh isolated BUS-05 implementation session; no session ID exposed, no nested agents. Reads/edits/command working directories remained inside the repository. Read only the repository-local package skill; no external skills or temporary paths were accessed.
- Limitations / follow-ups: installed React 19/jsdom runtime coverage and package static checks; React-version/browser matrices and emitted declarations/artifact/installed-consumer verification remain BUS-09. No new BUS-05 blocker or follow-up found. BUS-06 remains pending for its own session.

### Task BUS-06: Dispatch nested sidebar actions to the correct item

Status: completed

Kind: defect

Priority: P1 — action-only child menus can execute the wrong callback or no action.

Suggested agent: React navigation engineer

Dependencies: BUS-05

Primary ownership: `packages/react/layouts/sidebar1/nav-menus.tsx`, focused navigation tests, navigation contract documentation.

Finding / References: `IMenuSubItem.onClick` (`nav-menus.tsx:19-24`) is exposed, but `SidebarMenuCollapsible` at lines 72-86 calls the parent callback. Real NavMenus interaction is not covered by existing mocked layout tests. Action-only hosts at lines 40-45 and 73-82 also omit explicit button type, risking enclosing-form submission.

Requirements:

1. Prefer child callback; retain parent dispatch only as a documented fallback when the child has none. Never call both for one activation.
2. Preserve URL/router navigation and mobile close behavior; action and group-toggle buttons must not submit enclosing forms.

Acceptance criteria: child precedence, parent fallback, no-handler case, URL children, keyboard/pointer activation and mobile closure work; enclosing-form submit spy stays untouched for navigation actions/toggles.

Verification: focused real NavMenus regression tests and shared implementation checks.

Completion evidence:

- Prerequisites: read shared execution rules and dependency evidence, including completed BUS-05; set BUS-06 in_progress before implementation. Preserved earlier React work and concurrent Angular changes. Only BUS-06 status/evidence was updated in this document.
- Changed: `packages/react/layouts/sidebar1/nav-menus.tsx` dispatches `(subItem.onClick ?? item.onClick)` with the child's title, preserving exactly one applicable callback. Native top-level/nested action hosts and group toggles explicitly use `type="button"`; URL host selection, href/to forwarding, active state, and Slot-composed mobile closure remain intact. Public JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document child precedence, parent fallback, migration from parent-only dispatch, no-handler behavior, link forwarding, mobile closure, and form safety. Added `packages/react/tests/nav-menus.test.tsx`.
- Reproduction before fix (working directory `packages/react`): initial fixture runs exposed missing TooltipProvider and ResizeObserver setup and unwrapped native focus; corrected the fixture without changing production code. Then `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/nav-menus.test.tsx` failed with **19 failed, 9 passed** (exit 1, no setup errors/warnings). Child callbacks were absent with both/child-only handlers, including URL children; top-level and nested actions each invoked the enclosing form submit spy once. Mobile action activation closed the real sheet but also submitted its form. Parent fallback, no-handler dispatch, and group-toggle form safety already passed; Radix supplied the toggle's type implicitly, now also explicit at the NavMenus call site.
- Verification after fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/nav-menus.test.tsx` passed **28 tests** (exit 0); `pnpm typecheck && pnpm lint` passed both commands (`tsc --noEmit --pretty false`; `eslint . --max-warnings 0`, exit 0). No production component/provider mocks or added dependencies.
- Coverage: StrictMode with real NavMenus, SidebarProvider, TooltipProvider, Radix Collapsible/Slot, Sidebar and mobile Sheet. Pointer/Enter/Space activation checks exact callback counts/title payloads for both/child-only/parent-only/neither handlers, toggles without callback dispatch, top-level/nested form safety and a genuine submit-button positive control. Mobile tests repeatedly open the actual dialog, keep it open while expanding groups, and verify closure for top-level actions/links, child actions/links, fallback and no-handler items with no submission. href- and to-consuming link adapters verify destinations, callback precedence/fallback/no-handler navigation, no default prevention, active state, and no button type leaking onto links.
- Review (repository root): `git diff --check` passed; focused source diff and full new-test review confirmed the minimal dispatch/type correction and meaningful runtime assertions. Earlier work was retained; no CHANGELOG.md edits, commits, publication, Angular edits, or generated source deliverables from this session.
- Session: separate BUS-06 implementation session; no session ID exposed and no nested agents. All file access and command working directories stayed inside the repository; read only the repository-local package skill, with no external skill or temporary path access.
- Limitations / follow-ups: installed React 19/jsdom coverage. Keyboard checks focus real native hosts, dispatch Enter/Space key events, and explicitly simulate the uncancelled native activation click because jsdom has no keyboard default-action engine; links use Enter, not Space. Router adapters test the public forwarding/composition contract rather than a full router/browser. Browser/assistive-technology/React-version matrices and emitted declarations/artifact/installed-consumer verification remain BUS-09. No unresolved BUS-06 blocker or follow-up found.

### Task BUS-07: Clear clipboard success when the latest copy fails

Status: completed

Kind: defect

Priority: P2 — stale success feedback can cause users to paste an earlier record/reference.

Suggested agent: React hook lifecycle engineer

Dependencies: BUS-06

Primary ownership: `packages/react/hooks/use-clipboard.tsx`, `packages/react/tests/lifecycle-reliability.test.tsx`.

Finding / References: latest-request catch in `useClipboard.copy` (`use-clipboard.tsx:34-48`) sets error without clearing copied or the prior reset timer. Existing lifecycle tests cover repeat success and stale rejection, not current failure following success.

Requirements: on latest failure clear copied and prior timer; retain stale-request protection and unmount cleanup; document mutually consistent success/error feedback.

Acceptance criteria: success A then failure B leaves copied false, B error, no pending reset; success C clears error with a fresh timer; stale failures cannot erase current success; existing cleanup tests pass.

Verification: `pnpm exec vitest run tests/lifecycle-reliability.test.tsx` and shared implementation checks.

Completion evidence:

- Prerequisites: read shared execution rules and dependency evidence, including completed BUS-06; set BUS-07 in_progress before implementation. Repository-local AGENTS.md search found none. Available tools/dependencies ran successfully with Node v26.7.0 and pnpm 11.23.0. Preserved earlier React work and concurrent Angular changes; only BUS-07 status/evidence changed in this document.
- Changed: `packages/react/hooks/use-clipboard.tsx` adds three statements inside the existing latest-request catch guard: cancel the prior reset timer, null its ref, and set copied false before recording the error. Public hook JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document mutually consistent success/error feedback, fresh success timers, retained pending feedback, stale-completion protection, and unmount cleanup. `packages/react/tests/lifecycle-reliability.test.tsx` adds failure/recovery and pending-completion coverage and strengthens the stale-failure timer assertions.
- Reproduction before fix (working directory `packages/react`): `pnpm exec vitest run tests/lifecycle-reliability.test.tsx` failed with **1 failed, 6 passed** (exit 1). The new success A / failure B / success C regression reported both defects using soft assertions: B left copied true and one reset timer pending, while exposing B's error. All other lifecycle cases passed before the fix.
- Verification after fix (working directory `packages/react`): `pnpm exec vitest run tests/lifecycle-reliability.test.tsx` passed **7 tests** (exit 0); `pnpm typecheck && pnpm lint` passed both commands (`tsc --noEmit --pretty false`; `eslint . --max-warnings 0`, exit 0).
- Coverage: latest failure clears copied and preserves the exact error with zero pending timers; subsequent success clears error and owns a fresh full-duration timer past the old deadline; stale failure preserves current success and its original reset deadline; stale success cannot overwrite the latest error or create a timer; pending success/failure after unmount creates no timers. Existing repeat-success/unmount cleanup and tag-picker blur-timer tests pass.
- Review (repository root): `git diff --check` passed; focused diff review of the hook, lifecycle tests, README, and llms.txt confirmed the small guarded reset and consistent documentation alongside preserved earlier changes. No CHANGELOG.md edits, commits, publication, Angular edits, or generated source deliverables from this session.
- Session: separate BUS-07 implementation session; no session ID exposed and no nested agents. All file access and command working directories remained inside the repository; read only the repository-local package skill, with no external skills or temporary paths accessed.
- Limitations / follow-ups: runtime verification uses installed React with jsdom, mocked clipboard writes, and fake timers. Browser clipboard permissions, React-version matrices, emitted declarations, artifact checks, and installed-consumer integration remain BUS-09. No unresolved BUS-07 blocker or new follow-up found.

### Task BUS-08: Provide accessible, configurable SimpleLayout loading feedback

Status: completed

Kind: improvement

Priority: P2 — loading currently leaves a blank main region with no status feedback.

Suggested agent: React layout UX engineer

Dependencies: BUS-07

Primary ownership: `packages/react/layouts/simple/index.tsx`, `packages/react/tests/simple-layout.test.tsx`, README and llms API notes.

Finding / References: `SimpleLayout` (`layouts/simple/index.tsx:217-220`) hides children when loading with no busy semantics or loading content. Existing tests cover navigation/classes/form safety only.

Requirements:

1. Add an optional loading-content slot and accessible default loading status; mark main busy while loading.
2. Preserve existing hide/unmount-children loading behavior and header/footer availability. Document lifecycle so consumers do not assume form state persists across loading.
3. Make default feedback localizable via the custom slot, with clear guidance for an accessible name/status.

Acceptance criteria: default status/busy region while loading, custom loading content, restored children/non-busy state after completion; current navigation behavior remains intact; emitted public prop documentation agrees.

Verification: `pnpm exec vitest run tests/simple-layout.test.tsx` and shared implementation checks.

Completion evidence:

- Prerequisites: read shared execution rules and dependency evidence, including completed BUS-07; set BUS-08 in_progress before implementation. Repository-local AGENTS.md search found none. Preserved earlier React work and concurrent Angular changes; only BUS-08 status/evidence changed in this document.
- Changed: `packages/react/layouts/simple/index.tsx` adds optional `loadingContent?: React.ReactNode`, a default “Loading…” paragraph with `role="status"` for null/undefined slots, and explicit main `aria-busy` true/false semantics. Separate conditional branches retain child unmount/remount behavior. Public props/component JSDoc, `packages/react/README.md`, and `packages/react/llms.txt` document slot replacement/localization, status text or accessible-name requirements, draft/form state lifecycle, and header/footer/navigation availability. `packages/react/tests/simple-layout.test.tsx` adds four focused cases alongside the existing two navigation tests.
- Reproduction before fix (working directory `packages/react`): `DEBUG_PRINT_LIMIT=0 pnpm exec vitest run tests/simple-layout.test.tsx` failed with **3 failed, 3 passed** (exit 1). Default/null-slot and localized-slot tests stopped at the missing main aria-busy assertion. The child lifecycle regression and both existing navigation tests already passed, establishing the behavior to retain.
- Verification after fix (working directory `packages/react`): `pnpm exec vitest run tests/simple-layout.test.tsx` passed **6 tests** (exit 0); `pnpm typecheck && pnpm lint` passed both commands (`tsc --noEmit --pretty false`; `eslint . --max-warnings 0`, exit 0).
- Coverage: default status and null/undefined fallback, custom localized named status replacing the default without duplication, hidden/unmounted children while loading, false/omitted loading restoring children and clearing busy/status feedback, initial loading avoiding child mount, effect cleanup and local draft reset on reloading, usable header/footer actions and mobile navigation during loading, and existing navigation/class/form-safety behavior. Uses real layout components with a link adapter, no production mocks or new dependencies.
- Review (repository root): `git diff --check` passed; focused implementation/test and README/llms diff review confirmed the minimal loading change and consistent public documentation alongside preserved earlier work. No CHANGELOG.md edits, commits, publication, Angular edits, or generated source deliverables from this session.
- Session: separate BUS-08 implementation session; no session ID exposed and no nested agents. All file access and command working directories stayed inside the repository; only the repository-local package skill was read, with no external skills or temporary paths accessed.
- Limitations / follow-ups: focused jsdom semantics/interaction/lifecycle coverage and package static checks passed; browser/assistive-technology announcement timing and React-version matrices were not exercised. Emitted declarations/JSDoc, staged documentation, artifact and installed-consumer verification remain assigned to BUS-09. No unresolved BUS-08 blocker or new follow-up found.

### Task BUS-09: Independently verify integrated behavior and installed package

Status: completed

Kind: investigation

Priority: P1 — separate review must verify completed claims and installed-consumer compatibility.

Suggested agent: Independent React integration reviewer (fresh session, not an implementation agent)

Dependencies: BUS-01, BUS-02, BUS-03, BUS-04, BUS-04A, BUS-05, BUS-06, BUS-07, BUS-08

Primary ownership: this task file, final focused review corrections only when necessary, verification outputs.

Finding / References: above tasks touch shared control chains and public layout props; source-only tests do not establish emitted typings/client boundaries or installed usability. `.github/workflows/test.yml:45-99` defines the existing React integration pipeline.

Requirements:

1. Inspect the entire diff and each acceptance criterion, public documentation/types, regression quality, and cross-control interaction. Correct verified regressions with focused tests; explicitly record any material scope expansion before implementing it.
2. Run shared final commands serially for artifact mutations, inspect generated relevant declarations and staged documentation, and verify a fresh tarball consumer.
3. Verify no CHANGELOG.md changes, no unintended generated/source changes, and all tasks have truthful completion evidence. Summarize coverage limitations and final recommendation.

Acceptance criteria: all nine implementation tasks (including discovered BUS-04A) satisfy their observable requirements; package tests/typecheck/lint and artifact/client/RSC/consumer checks pass; final task document is completed with reviewer evidence and no unresolved blockers.

Verification: shared final integration command list, `git diff --check`, `git status --short`, full task/evidence review. Do not assert an unavailable root-wide test passed.

Review scope / integration findings (recorded before corrective operations):

- Fresh BUS-09 reviewer read the entire plan/evidence and all tracked React diffs plus all six untracked React files (the internal selection-focus helper and five regression suites). Initial source review found no concrete implementation regression requiring a source edit. Concurrent Angular files/task are excluded and preserved.
- `pnpm test` passed 135 tests in 15 files; typecheck and lint passed. Initial `pnpm test:package` passed its 8 validator regressions but staging failed because the pre-existing ignored `packages/react/release/npm` was nonempty. Its declarations lack these changes. Preserve that old stage under ignored repo-local `tmp/bus09`, then rerun the exact package command to generate fresh evidence. Boundary/RSC commands inadvertently run before discovering this failure passed against old output and are explicitly **not** final evidence; rerun after a successful fresh stage.
- The Next.js example's current tsconfig aliases `@egose/shadcn-theme/*` to package source, and its site navigation/form showcases use affected components. Run its existing typecheck/lint/test/build checks as permitted by the plan. No example source edit is currently required. Older repository-local skill notes about copied example components/all-client output are stale; current scripts/source are authoritative.
- Prior tasks' references assigning browser/React-version matrices to BUS-09 overstate the agreed final command scope. Required runtime verification is installed React 19/jsdom plus fresh artifact/consumer checks. Real browser keyboard/default actions, assistive-technology announcements, clipboard permissions, and a React 18 runtime/type matrix remain limitations, not completed checks or hidden blockers under this plan.

Completion evidence:

- **Independent recommendation: approve; overall plan completed.** BUS-01..BUS-08 plus BUS-04A (nine implementation tasks) and BUS-09 (final review) are completed with evidence. All observable acceptance criteria below and the required final checks pass. No unresolved integration blocker or concrete source regression was found. BUS-09 changed only this task document; it corrected the evidence-scope ambiguity and recovered fresh artifact verification without changing implementation/public APIs. Prior implementation changes remain intact.
- **Session/prerequisites:** fresh independent final-review session, not a prior implementer; actual session ID is not exposed in the supplied task context, so none is invented. No nested agents. Repository-local AGENTS.md search found none. Read only the repository-local package skill, not external skills. Commands/file access remained project-local; temporary fixtures/logs/npm cache use ignored `tmp/bus09` after parent/ignore verification; consumer installation additionally uses repo-local pnpm store/cache settings. Node **v26.7.0**, pnpm **11.23.0**, package React/ReactDOM **19.2.7**, RHF **7.81.0**, jsdom **28.1.0**, TypeScript **6.0.3**. Root/package dependencies and the installed isolated fixture were present. Verified fixture React/ReactDOM/RHF and resolved sonner/TypeScript/Vite/Vitest/jsdom in fixture node_modules, so no prerequisite reinstall was needed. A first version probe tried sonner's unexported `package.json` subpath and failed with `ERR_PACKAGE_PATH_NOT_EXPORTED`; reading its installed manifest and resolving its public entry verified sonner **2.0.7** instead. This was a probe issue, not a missing dependency.
- **Complete change review:** inspected all **19 tracked modified React files and 6 untracked React files** (25 paths), including the entire new helper and all five new test files, plus full plan/history. Reviewed public prop/JSDoc/README/llms semantics, native hosts and form behavior, callback precedence, React forwardRef chains, object/callback cleanup/ref replacement, portal focus ownership, cmdk label/ID ownership, controlled context derivation/mode handoff, and loading unmount lifecycle. Tests use real RHF/Radix/cmdk controls, with documented jsdom shims; clipboard uses controlled promises/fake timers. No new public helper export, dependency, unrelated feature, or source correction was necessary.

Acceptance-criterion audit (all verified in the final 135-test package run, source review, and declarations/docs where applicable):

| Task    | Verified outcome / regression evidence reviewed                                                                                                                                                                                                                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BUS-01  | All omitted/false/true disabled cases block native activation while loading and restore only caller-permitted enabled state; original precedence reproduction is recorded; existing variants/asChild API retained.                                                                                                                                                                                               |
| BUS-02  | Disabled FormSelect cannot open/change; name contributes default/new selected IDs to FormData; required reaches trigger/native primitive; explicit/default labels target focusable controls; label and ID search, distinct duplicate-label records, strings, no-results recovery and clear emission are covered.                                                                                                 |
| BUS-03  | Empty/partial/refreshed options preserve ordered IDs; add/remove retains missing selections; hydrated/renamed labels replace fallbacks; mount/refresh emits nothing; controlled acceptance and external replacement/reordering/clear work.                                                                                                                                                                       |
| BUS-04  | All three real RHF controls pass setFocus, invalid-submit focus, onBlur validation/touched state and optional callback composition; internal portal opening/search/selection/Escape remains untouched until exit; outside dismissal, badge removal, native input handlers, ref detachment/React 19 cleanup, StrictMode and unmount cancellation pass. Shared select/popover and prior selection/date tests pass. |
| BUS-04A | Explicit/default requested IDs and independent same-name roots resolve combobox/label queries to the actual input; visible and cmdk labels retain correct control/ARIA relationships. Native label click forwarding is tested; focus default action is simulated explicitly in jsdom. Prior refresh/lifecycle tests pass.                                                                                        |
| BUS-05  | Initial non-first/first-of-multiple active, empty-to-loaded, external A-to-B, deferred/rejected/unhandled requests, latest metadata, removal/fallback/non-resurrection, uncontrolled selection and controlled-to-local handoff pass. Mount/refresh/fallback stay silent; existing empty-context coverage passes; docs assign authorization/data switching to consumers.                                          |
| BUS-06  | Child precedence, parent fallback, neither handler, top-level actions, URL children and href/to adapters dispatch correctly; mobile leaves close and group toggles remain open; action/toggle hosts do not submit forms, with a genuine submit positive control. Pointer and simulated Enter/Space activation pass; these are not browser keyboard-engine checks.                                                |
| BUS-07  | Success A then latest failure B leaves copied=false, exact B error and zero reset timers; success C clears error with a fresh timer; stale success/failure cannot overwrite current feedback; unmount/timer cleanup and existing tag-picker lifecycle pass.                                                                                                                                                      |
| BUS-08  | Default/null/undefined and localized custom loading slots, main busy true/false, restored children, actual child cleanup/remount/draft reset, initial-loading non-mount, and available header/footer/navigation pass. Emitted loadingContent/JSDoc agrees with README/llms.                                                                                                                                      |

Final command evidence (working directory **packages/react**, artifact mutations serial; all final executions exited **0**):

| Command                       | Exact final result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                   | **135 tests / 15 files passed** (Vitest 4.1.11).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `pnpm typecheck`              | `tsc --noEmit --pretty false` passed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `pnpm lint`                   | `eslint . --max-warnings 0` passed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `pnpm test:package`           | **8/8 validator regression tests**; fresh ESM/CJS/DTS build, selective boundary postprocessing, prepare-only staging/packing, then both stage-hook and final validators passed: **121 expanded export records, 240 runtime targets, 240 declaration targets, 2 ESM/CommonJS TypeScript consumers, 794 packed files** per validator. Counts include overlapping export patterns; there are **112 unique source entries / 224 physical declaration files**, not 121 unique modules. Validator actually loads native Node ESM/CJS targets, compiles condition-aware import consumers, and validates npm pack files. |
| `pnpm test:client-boundaries` | **2/2 regression tests**, **112 entries** checked in both formats: **85 client / 27 server-safe**. This is the rerun against fresh output.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `pnpm test:rsc`               | Fresh Next.js Server Component fixture build passed, rendered dialog-manager client barrel and verified server utility output. Script links the fresh `dist`, rather than installing the tarball; installed verification is separately below.                                                                                                                                                                                                                                                                                                                                                                    |
| `pnpm pack:package`           | Produced `.artifacts/egose-shadcn-theme-0.0.0-test.0.tgz`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `pnpm prepare:consumer`       | Recreated `.isolated-consumer` and installed the exact fresh tarball as **@egose/shadcn-theme@0.0.0-test.0**, with all four required peers and no source aliases.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `pnpm build:consumer`         | Installed-consumer TypeScript + Vite **8.2.2** production build passed; **2,030 modules transformed**, JS **328.96 kB / 105.63 kB gzip**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `pnpm test:consumer`          | **1 test / 1 file passed**, exercising public component/form/hook/utility/layout/dialog paths. This smoke test does not repeat every business-control regression against the tarball.                                                                                                                                                                                                                                                                                                                                                                                                                            |

- **Artifact retries, recorded rather than hidden:** initial package command failed on the pre-existing nonempty stage after 8 passing validator tests (`tmp/bus09/test-package.log`). Preserved that stage as `tmp/bus09/prior-release-npm`. The next run built/staged and passed its stage validator but the harness's **240,000 ms** timeout interrupted the second validator (`test-package-fresh.log`); no source/package validation defect was reported. Preserved that generated stage as `timed-out-release-npm`, reran the exact `pnpm test:package` with **600,000 ms** allowance, and obtained both successful validator results (`test-package-final.log`). No artifact writers ran concurrently. Earlier old-output boundary/RSC results are excluded from the final results above.
- **Declaration/shipped-document inspection:** read fresh declarations for all six form controls, native input/ref primitives, button, clipboard, both layout contracts and nested navigation docs. Confirmed `onBlur?: () => void`, button/input-specific `RefAttributes`, `loadingContent?: ReactNode`, controlled-active/unique-name context docs, handler ordering, and loading lifecycle guidance survive emission. One-off ignored `node <repo-root>/tmp/bus09/audit-artifact.mjs` (run from `packages/react`) passed: **28 changed-entry declarations** have ESM/CJS parity; all **224 physical declarations** omit internal helper APIs; **56 changed-entry runtime/type files** match the installed tarball byte-for-byte; README/llms match source/stage/installation; installed `lib/selection-focus` import is blocked by exports. The helper is bundled internally, outside tsup public entry directories, with no declaration dependency leak. Staged manifest retains expected conditional exports, peers, sideEffects=false and Apache-2.0 metadata; no placeholders/private/scripts/devDependencies leak. Read full staged README/llms.
- **Affected Next.js example:** current source aliases and imports justified the plan's conditional example checks. From `packages/react/@examples/nextjs`, serial `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all exited **0**. **94 tests / 11 files passed** (Vitest 3.2.7); Next.js **16.2.10** production build generated **104/104 static pages**. Logs: `tmp/bus09/nextjs-test.log`, `nextjs-build.log`. Non-failing output: Node experimental localStorage-unavailable warning in tests and Next workspace-root/multiple-lockfile warning in build. No example source correction was required.
- **Final path/status audit:** root `git diff --check` and `git diff --cached --check` passed; full `git status --short --untracked-files=all` and React path review show the intended 25 React paths plus this task, alongside unrelated ongoing Angular work/task. No staged changes; no newly unintended React source/generated deliverables. `git diff --exit-code` confirmed CHANGELOG.md and React/package-example/fixture lockfiles unchanged. `dist`, `release/npm`, `.artifacts`, `.isolated-consumer`, and `tmp/bus09` are ignored. The worktree is intentionally dirty; Angular changes were neither edited nor verified. No commits or publication. No root all-repository test was run or claimed.
- **Remaining verification limits:** installed React 19/jsdom and the available Node version only; React 18-compatible APIs/types were inspected, but no React 18 runtime/type matrix was executed. Focus/label default actions and native keyboard activation are simulated where jsdom lacks the browser engine; no browser/assistive-technology announcement, clipboard-permission, visual-layout or full router matrix was run. RSC checks build/render rather than browser hydration. These accurately scoped limits supersede prior evidence implying those matrices would be delivered by BUS-09; all required checks and acceptance criteria under this plan are complete.

## Coordinator completion audit

After the independent reviewer finished, the coordinator reread the complete task document and verified all ten task statuses are completed with Completion evidence, including the discovered BUS-04A follow-up. Final `git diff --check` and `git diff --exit-code -- CHANGELOG.md` passed. Concurrent Angular work remains outside this plan. No unresolved task or blocker remains.

The harness exposed these distinct session IDs to the coordinator (individual agents did not receive their own IDs). Sessions ran sequentially:

| Task    | Isolated sub-agent session       |
| ------- | -------------------------------- |
| BUS-01  | `ses_f201cfdc7ffeh2YPmHANqXfkxE` |
| BUS-02  | `ses_f201aa20cffeXjlMrbRFsxto1B` |
| BUS-03  | `ses_f2016ec04ffeZ5bG2GV5p4mOOg` |
| BUS-04  | `ses_f2014f896ffe0E2pKGWzjZYkJK` |
| BUS-04A | `ses_f200be622ffeqiTRv2FSHS1tcy` |
| BUS-05  | `ses_f20085219ffePa6rkwXA38zQBm` |
| BUS-06  | `ses_f2005685affe1UovF5199OK0vr` |
| BUS-07  | `ses_f2002073fffewkw5X255xHLGDd` |
| BUS-08  | `ses_f20004096ffeJj5AP2fqy1Ppvv` |
| BUS-09  | `ses_f1ffe0226ffeIvrMHAHHpUDDxf` |
