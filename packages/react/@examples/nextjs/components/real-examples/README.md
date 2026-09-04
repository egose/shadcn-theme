# Real examples

Real examples are full product flows (pricing and plan selection, customer
resource management, account and workspace settings, launch request) that
compose multiple package surfaces around a believable workflow.

## Directory convention

Every real example lives in its own directory, named after its registry slug:

```
components/real-examples/
  <slug>/
    index.tsx          # main surface — the component the registry loader resolves to
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
- Fixtures are deterministic: fixed ISO dates, stable IDs, varied text
  lengths, avatar/image fallbacks, and cases for zero-result and disabled
  states. See `_shared/fixtures.ts` for the conventions.
- Simulated backend behavior goes through `_shared/async-simulation.ts`
  (explicit pending/success/failure, fixed delays, no randomness, no network),
  and `_shared/example-state-toolbar.tsx` provides the catalog-only state
  switcher so every state is inspectable without a backend.
