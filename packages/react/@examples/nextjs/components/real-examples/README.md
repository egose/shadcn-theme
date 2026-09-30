# Real examples

Real examples are full product flows (pricing and plan selection, customer
resource management, account and workspace settings, launch request, support inbox) that
compose multiple package surfaces around a believable workflow.

## Directory convention

Every real example lives in its own directory, named after its registry slug:

```
components/real-examples/
  <slug>/
    index.tsx          # main surface — the component the registry loader resolves to
    use-<slug>-controller.ts # local state/actions when orchestration needs extraction
    components/…       # example-local components (only when the flow needs them)
    types.ts           # example-local domain types
    fixtures.ts        # example-local deterministic fixtures
    <slug>.test.tsx    # focused tests colocated with the flow
  _shared/             # domain-neutral blocks used by at least two examples
```

Rules:

- One example per directory. Cross-example code only lives in `_shared/` and
  only when at least two examples consume it. Everything else stays colocated
  with its single owner.
- Examples are imported individually through their registry `load()` entry in
  `lib/sections/real-examples.ts`. There is intentionally **no barrel
  `index.ts` for this directory** — each flow is its own chunk and must be
  importable and testable in isolation.
- Fixtures are deterministic: date-only calendar values or fixed UTC event timestamps, stable IDs, varied text
  lengths, avatar/image fallbacks, and cases for zero-result and disabled
  states. See `_shared/fixtures.ts` for the conventions.
- Simulated backend behavior goes through `_shared/async-simulation.ts`
  (explicit pending/success/failure, fixed delays, no randomness, no network),
  and `_shared/example-state-toolbar.tsx` provides the catalog-only state
  switcher so every state is inspectable without a backend.

## Feature boundaries

Keep domain decisions in the example. Customers uses
`use-customers-controller.ts` for records, debounced search, filters, page
clamping, mutations and logical focus destinations. Its entry composes tooling,
feedback and dialogs. `components/customer-list-view.tsx` renders controls and
pagination, passing the **same rows and action callbacks** to
`customer-table.tsx` and `customer-cards.tsx`. Those responsive views do not own
separate datasets, filtering or mutation policy. The name dialog owns its
short-lived input draft; the controller owns the operation and committed rows.

Settings uses `use-settings-session.ts` above switchable sections. These local
controllers are examples of state ownership, not a generic CRUD engine or a
global store. Keep package controls and domain-specific composition visible.

## Operation and session conventions

- Import `SimulatedOutcome` from `_shared/async-simulation.ts`. Call
  `simulate(payload, { outcome })` to use its **400 ms default delay**; specify
  `delayMs` only for an intentionally different delay. The simulator retains
  the supplied payload reference; the domain must capture an immutable input
  snapshot (clone mutable form values, or retain an immutable draft).
- Use `_shared/outcome-picker.tsx`'s `OutcomePicker` for catalog outcome
  controls. It has a visible label, a named single-choice group, keyboard
  navigation and a required success/failure selection. `operation` optionally
  distinguishes labels (settings uses “Simulate save success/failure”).
  Customers places this same control inside the retained add/rename dialog,
  so a reviewer can select success and retry without losing failed input.
- An operation captures its input and outcome **when invoked**. Changing the
  picker during pending affects the next attempt, not the in-flight one.
  Guard duplicate submissions, expose pending feedback and keep pending
  mutation dialogs from being dismissed. Business commits happen on success.
- **Launch request:** success commits a cloned submitted snapshot as the new
  RHF baseline/revision; newer pending edits stay live and unsaved. Failure
  keeps edits and the previous baseline. Confirmed discard restores the last
  saved snapshot. Calendar dates stay `YYYY-MM-DD` (clear → `null`); see the
  example app README's date contract. Required Project name/Launch summary reject
  trimmed-empty input without rewriting accepted whitespace. Local registered
  FormTextInput/FormTextarea compositions associate required/pattern errors with
  the actual Project name, Launch summary and Owner email controls. The launch-only
  calendar composition binds the RHF ref to a named required combobox, describes
  its error and treats trigger plus calendar portal as one blur boundary. No
  parent form-wrapper API extensions are assumed.
- **Settings:** each editable section has independent immutable drafts, saved
  snapshots and results, with a synchronous per-section duplicate-save guard. Pending saves can settle while another section is
  visible; newer edits remain unsaved. Failure retains the draft; discard
  restores that section's last saved snapshot. Deletion failure is persistent
  and retryable; successful deletion is terminal for this mounted session.
  Workspace and Billing saves belong to the workspace. First start wins between
  these saves and deletion: independent workspace saves may overlap, but all must
  settle before deletion can start; retry deletion explicitly (nothing is queued).
  Pending deletion blocks new workspace saves; failure re-enables them and success
  blocks them until a fresh session. Session-owned synchronous guards also reject
  retained/same-turn handlers. Disabled actions describe the reason. Cancellation
  and failure preserve drafts/baselines; after deletion those local drafts remain
  inspectable/discardable but cannot be persisted. Profile and editable Notifications
  are account-level and remain savable during/after deletion: mentions across the
  account's workspaces, product release updates and inbox digest frequency. The
  disabled Security alerts switch is informational workspace policy (applicable
  only to membership of an existing workspace), excluded from notification saves.
- **Customers:** name input is frozen while pending. Failure retains the
  dialog draft and focuses its input; cancel discards only that draft. Archive
  failure closes confirmation, retains feedback and allows retry from the
  row. Settlement restores a usable opener, then Search, then the persistent
  result region if the list is hidden. Focus is checked after attempting the
  opener because responsive table/card switches can leave it connected but hidden.
  Empty intentionally clears the actual
  dataset and filters; first-add creates the first record.
- **Pricing:** confirmation captures the selected plan. Failure leaves the
  current plan unchanged and exposes retryable feedback. Success commits the
  plan and focuses the result if the opener becomes disabled; failure/cancel
  restore a usable opener with the same result-region fallback.
- **Support inbox:** `use-support-inbox-controller.ts` owns tickets, selection,
  per-ticket drafts/results and one guarded pending operation. List filtering
  retains the selected conversation, with explicit outside-filter feedback.
  Pending locks that ticket's draft and all mutations; navigation, Sheet close
  and other tickets' drafts remain available. Send captures trimmed input and
  outcome, appends one fixed-time message on success and clears only its draft.
  Failure retains input/results for retry. Resolve/reopen commits only on
  success and never deletes drafts. Resolved conversations require reopening
  to reply; historical read-only conversations disallow both actions. The
  shared outcome picker moves inside the mobile Sheet so retries are reachable.
  An action keeps focus on its enabled local result while the submit control is
  disabled, preventing the mobile focus scope from losing its destination.
  Settlement restores reply/result focus only while that view is active and
  focus has not moved elsewhere. Sheet close restores its row opener, then
  Search if filtering/resolution removed the row, then the persistent heading.
- **Session lifetime:** one mounted example is one local session. Catalog
  Loading/Error previews can unmount product views but retain session state
  and pending operations. Settings section navigation does the same. Pricing
  Empty and all Support inbox states are previews; Customers Empty is the explicit dataset reset described
  above. Returning to Loaded does not restore customer fixtures. A real
  example unmount/reload discards the session; remount starts from fixtures,
  including resetting deletion. Simulation timers are not cancelled on
  unmount, but they do not persist data or update a new mounted session.

Colocated real-control tests cover recovery, pending snapshots, navigation,
focus destinations and shared customer pagination. Shared tooling tests cover
outcome-picker keyboard/selection behavior and the default delay. These are
source-integration/jsdom checks; browser layout/focus and cross-timezone
hydration checks are separate integration gates, not performance evidence.

## Support inbox browser review (EXB-08)

The repository task file `docs/tasks/20260926-164231-nextjs-business-experience-followup.md`
contains the independent review's browser matrix, corrections, final gates and
coverage limits. Keep the following checklist for future changes.

The inbox uses the current Resizable `orientation` / `"35%"` and `"65%"`
sizes, list bounds of 25–50%, two bounded ScrollAreas and semantic Item rows.
Only one responsive detail view is active: desktop panels at 1024px+, otherwise
a full-width mobile Sheet (capped at `max-w-xl` on tablets). The layout snapshot
is mobile on the server and updates from `matchMedia` after hydration. Fixtures
and message text/time output are timezone-independent; initials are local text.

Required browser checks, **not proven by jsdom**:

- At desktop widths, drag and keyboard-adjust the named separator to both
  limits. Confirm list and conversation scroll independently, the composer
  remains reachable, and the long reference wraps without horizontal overflow.
- At 320px and 768px, open SUP-101, scroll all nine messages, send/retry a reply,
  and verify the newest appended reply can be reached. History does not force
  a scroll-to-bottom. Check the ten-row list's final/read-only tickets too.
- At 200% zoom or equivalent narrow/short viewports, the Sheet deliberately
  permits outer vertical scrolling once its detail reaches its minimum height;
  verify nested history scroll, outcome controls, composer and Close remain
  reachable. Check actual mobile virtual-keyboard sizing separately if available.
- After Sheet animations, test close/Escape to the opener and resolve under
  the Open filter → close to Search. Test pending close and changing tickets
  without late settlement stealing focus; verify focus trapping by Tab/Shift+Tab.
- Cross the 1024px breakpoint with a draft and with the Sheet open. The desktop
  view keeps the selected ticket/draft and closing Sheet returns focus to Search;
  returning to mobile retains the previous open intent until explicitly closed.
  Confirm there is no hidden modal overlay, stranded focus or hydration warning.

The colocated tests stub `matchMedia` and `ResizeObserver` only to exercise real
controls and lifecycle paths. They establish operation counts, draft isolation,
failure recovery, preview retention and logical focus destinations, not browser
geometry, separator interaction, touch scrolling or animation behavior.
