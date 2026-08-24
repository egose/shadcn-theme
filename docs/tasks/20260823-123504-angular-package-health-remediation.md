# Angular Package Health Remediation

Created: 2026-08-23 12:35:04 local time

Status: completed

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

Status: completed

Completion evidence:

- Changed: `packages/angular/validate-package.mjs`, `packages/angular/test/validate-package.test.mjs`, `packages/angular/test/fixtures/package-validator/`, `packages/angular/package.json`
- Verified: `pnpm --dir packages/angular test:package-validator` (11/11 passing; valid plain and `tw` staged fixtures each execute `npm pack --dry-run --json --ignore-scripts`)
- Verified: `node packages/angular/validate-package.mjs --workspace packages/angular --package packages/angular/dist --variant tw` (expected nonzero; detects missing `menu` path/output/export, invalid `./<project>/index.d.ts` targets, and plain-package imports in `tw` declarations)
- Verified: `pnpm exec prettier --check "packages/angular/validate-package.mjs" "packages/angular/test/validate-package.test.mjs" "packages/angular/test/fixtures/package-validator/**/*.{json,ts,md,mjs}" "packages/angular/package.json"` and `git diff --check`
- Result: staged project/config/path/output/export equality, target existence, variant identity, metadata/placeholders, leaked/internal files, and exact dry-run tarball contents are validated offline without publishing or registry access.
- Follow-up: ANGULAR-02

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

Status: completed

Resolution evidence (ANGULAR-FINAL independent review):

- The historical `menu` blocker is resolved in the current source: the project uses Angular CDK menu APIs and both serial release builds emitted `menu` and all other 70 manifest projects.
- Verified: `pnpm --dir packages/angular test:build-all` (6/6, including injected build failure cleanup, cycle reporting, metadata-derived targets, project-set equality, and top-level nonzero exit).
- Verified: `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-final.0` built all 71 projects exactly once for each variant, validated each complete stage, and produced both tarballs without publishing.
- Verified: `node packages/angular/validate-package.mjs --workspace packages/angular --package packages/angular/release/staged/plain --variant plain` and the equivalent `tw` command (71 projects and 287 packed files each; project/config/path/output/export sets and all targets valid).
- Result: every intended project, including `menu`, has valid runtime and declaration exports; injected failure behavior remains fail-fast and removes partial output.
- Follow-up: none.

Blocked evidence:

- Implemented: `publishable-projects.json` is the authoritative 71-project manifest; build membership, configuration checks, wrapper synchronization, dependency ordering, emitted-metadata export targets, aggregate failure handling, final export generation, and top-level exit status now derive from or validate against it.
- Changed: `packages/angular/build-all.mjs`, `packages/angular/publishable-projects.json`, `packages/angular/tsconfig.json`, `packages/angular/tsconfig.build.json`, `packages/angular/sync-project-wrappers.mjs`, `packages/angular/validate-package.mjs`, `packages/angular/test/build-all.test.mjs`, validator fixtures, and `packages/angular/package.json`.
- Verified: `pnpm --dir packages/angular test:build-all` (6/6 passing) and `pnpm --dir packages/angular test:package-validator` (11/11 passing).
- Blocker: `pnpm --dir packages/angular bundle` exits 1 after aggregating the sole failed project, `menu`, and removes partial `dist`; `projects/menu/src/lib/*.ts` imports the nonexistent `@spartan-ng/brain/menu` subpath, which `@spartan-ng/brain@1.1.1` does not export, causing TS2307 followed by Angular host-directive/module diagnostics.
- Acceptance impact: the requested public `menu` project cannot emit valid runtime/type exports without a separate menu API migration or a maintainer-approved removal; no staged package exists for ANGULAR-01 validation after the failed bundle.

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

Status: completed

Resolution evidence (ANGULAR-FINAL independent review):

- The historical `menu` blocker is resolved; fresh complete plain and `tw` builds now pass independently.
- Verified: `pnpm --dir packages/angular test:variants` (3/3), followed by fresh serial `prepare:release` and explicit validation of both 71-project/287-file stages.
- Artifact inspection: plain runtime/declarations contain no `@egose/shadcn-theme-ng-tw/` references; `tw` runtime/declarations contain no `@egose/shadcn-theme-ng/` references; neither stage contains `.map` files, `sourceMappingURL` references, or leaked `exports.json`.
- Representative classes: pagination, carousel, and radio-group artifacts contain no `tw:` utilities in plain output and use `tw:` for the corresponding required utilities in prefixed output. The review corrected malformed radio disabled variants before regenerating the candidates.
- Result: both variants satisfy package identity, class-prefix, declaration, source-map, independent staging, and package-validator criteria.
- Follow-up: none.

Blocked evidence:

- Implemented: AST-guided class transformation normalizes recognized Tailwind candidates to an unprefixed canonical form before emitting either plain or `tw:` classes; package self-imports are rewritten in both runtime and declarations.
- Implemented: invalidated ng-packagr source maps and their runtime references are intentionally excluded, with the policy documented in `packages/angular/README.md` and enforced by package validation.
- Implemented: `--stage <directory>` preserves independently inspectable variant output outside `dist`; focused tests stage plain and `tw` artifacts separately, verify representative template/runtime classes, declarations, package identity, and map exclusion, then run ANGULAR-01 validation against each stage.
- Changed: `packages/angular/build-all.mjs`, `packages/angular/validate-package.mjs`, `packages/angular/test/variants.test.mjs`, `packages/angular/test/validate-package.test.mjs`, `packages/angular/test/build-all.test.mjs`, `packages/angular/package.json`, `packages/angular/README.md`.
- Verified: `pnpm --dir packages/angular test:variants` (3/3 passing), `pnpm --dir packages/angular test:build-all` (6/6 passing), and `pnpm --dir packages/angular test:package-validator` (12/12 passing).
- Blocker: `pnpm --dir packages/angular bundle` exits 1 and removes partial `dist` because `@spartan-ng/brain@1.1.1` does not export `@spartan-ng/brain/menu`; therefore complete plain and `tw` tarballs cannot be generated and cannot pass ANGULAR-01 independently until ANGULAR-04 resolves the dependency contract.
- Acceptance impact: focused fixture evidence demonstrates the variant transformation, but acceptance criteria requiring complete real tarballs and independent ANGULAR-01 validation remain blocked.

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

Status: completed

Completion evidence:

- Changed: `packages/angular/package.json`, `packages/angular/pnpm-lock.yaml`, `packages/angular/dependency-contract.mjs`, `packages/angular/test/dependency-contract.test.mjs`, `packages/angular/test/isolated-consumers.mjs`, `packages/angular/validate-package.mjs`, `packages/angular/projects/menu/src/lib/*.ts`, and `packages/angular/projects/toggle-group/src/lib/hlm-toggle-group*.ts`.
- Contract: Angular/CDK `>=22.0.0 <23.0.0`, Spartan `>=1.1.1 <2.0.0`, ng-icons core `>=33.4.0 <34.0.0`, and RxJS `>=7.8.0 <8.0.0` are peers; implementation-owned icon sets, styling helpers, carousel integration, scrollbar, toaster, and `tslib` are dependencies; compiler, CLI, test, packaging, and Tailwind transformation tools remain development-only.
- Inventory: plain and `tw` emitted JavaScript/declarations contain 17 external package roots, all declared and checked by the staged package validator; the validator also rejects build-only packages in published dependencies/peers.
- Verified: `pnpm --dir packages/angular bundle` (71/71 projects, including `menu`); `pnpm --dir packages/angular verify:consumers` (serial plain and `tw` 71-project builds, exact package validation/packing, isolated strict npm installs of 429 packages each, `tsc --noEmit`, and production `ng build` for both variants; incompatible Angular 21 peer install fails with an npm peer diagnostic).
- Verified: `pnpm --dir packages/angular test:dependency-contract` (3/3), `test:build-all` (6/6), `test:package-validator` (12/12), `test:variants` (3/3), `pnpm --dir packages/angular install --frozen-lockfile`, targeted Prettier check, and `git diff --check`.
- Prior blocker resolution for integration: the public `menu` project now uses the compatible Angular CDK menu primitives instead of the nonexistent Spartan subpath, so the sole recorded ANGULAR-02/03 real-bundle blocker is resolved; their statuses remain unchanged for their owners to re-evaluate.
- Follow-up: ANGULAR-02 and ANGULAR-03 integration review; no ANGULAR-04 blocker remains.

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

Status: completed

Completion evidence:

- Changed: `scripts/publish.mjs`, `packages/angular/test/release.test.mjs`, `packages/angular/package.json`, `packages/angular/README.md`, `.gitignore`
- Security: all npm/pnpm/node invocations use argument arrays, explicit `cwd`, and `shell: false`; OTP remains one opaque argument and is never included in release logs; only a confirmed npm `E404`/not-found response selects the initial-version path.
- Atomic release: plain and `tw` builds are staged, validated, and packed serially before either exact tarball can be passed to `npm publish`; every child-process/build/validation/pack/publish or top-level CLI failure propagates nonzero.
- Verified: `pnpm --dir packages/angular test:release` (5/5 passing, including absolute working directories and disabled shells, shell-like OTP opacity/redaction, confirmed package absence versus missing npm/authentication/network/timeout/registry/unknown/malformed responses, second-variant atomic publish prevention, two-tarball prepare-only output, and CLI nonzero failure).
- Verified: `pnpm --dir packages/angular test:package-validator` (12/12), `pnpm --dir packages/angular test:variants` (3/3), and `pnpm --dir packages/angular test:build-all` (6/6).
- Verified: `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-05.1` (two serial 71-project builds; both staged packages validated with 287 packed files; no publish calls).
- Packed artifacts: `egose-shadcn-theme-ng-0.0.0-angular-05.1.tgz` SHA-256 `72af365c7f9df8c44979f0c70cbe592ed52cc5b666a655dddc6b2a8b9f8826ac`; `egose-shadcn-theme-ng-tw-0.0.0-angular-05.1.tgz` SHA-256 `fa55c1664a44e3797ab83ab4fe2f113fa5b02080908bad9395f025d583a505cc` (generated under ignored `packages/angular/release/`, not committed).
- React regression verification: `node scripts/publish.mjs --context react --version 0.0.0-test.0 --prepare-only` and `pnpm --dir packages/react validate:package` (120 exports, 238 runtime targets, 238 declarations, 2 TypeScript consumers, 784 packed files).
- Verified: `pnpm exec prettier --check "scripts/publish.mjs" "packages/angular/test/release.test.mjs" "packages/angular/package.json" "packages/angular/README.md"` and `git diff --check`.
- Follow-up: ANGULAR-10; move production publication to protected CI with npm trusted publishing/OIDC.

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

Status: completed

Completion evidence:

- Changed: `packages/angular/test/setup.ts`, `packages/angular/test/run-library-tests.mjs`, `packages/angular/test/source-exports.mjs`, `packages/angular/test/source-exports.test.mjs`, `packages/angular/test/fixtures/source-exports/broken-public-api.ts`, `packages/angular/projects/form-text-input/src/lib/form-text-input.spec.ts`, `packages/angular/projects/utils/src/lib/utils.spec.ts`, `packages/angular/@examples/standard/src/app/app.spec.ts`, package scripts, and Angular README test commands.
- Coverage: focused form binding and explicit-ID hydration stability; browser/server class management; real `MutationObserver`, animation-frame settling, and teardown; stable example shell/router behavior; source-level public exports kept separate from staged artifact validation.
- Failure proof: deliberately broken form binding and resource-leak fixtures are rejected by shared browser assertions; the deliberately broken public-API fixture is rejected by the source export contract test.
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:libraries` (2 source contracts, 3 form tests, and 3 utils tests passing serially in Chrome Headless 151).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:library form-text-input` (targeted 3/3 passing).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular/@examples/standard run test:ci` (2/2 passing in Chrome Headless 151).
- Result: targeted `test:library <name>`, aggregate `test:libraries`, source-only `test:source-exports`, and example `test:ci` commands are non-watching and CI-suitable; no browser process, timer, observer, or subscription kept either run alive.
- Follow-up: ANGULAR-07 and ANGULAR-08 can extend the shared setup with the remaining production regressions.

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

Status: completed

Resolved independent review blocker (ANGULAR-FINAL):

- The earlier hydration test only compared generated IDs. The current test now consumes markup produced by Node `renderApplication`, verifies its `ngh` hydration marker, hydrates it in Chrome with `provideClientHydration`, and proves that Angular reuses the server-rendered input node without changing ID, label, hint, or ARIA relationships.
- Independently verified: the focused test passed with Angular reporting 3 components and 21 nodes hydrated, 0 components skipped.

Completion evidence:

- Changed: all six form wrappers and focused specs; shared application-scoped `HlmFormIdGenerator`; narrow checkbox, date-picker, select-trigger, label, and searchable-multiselect forwarding needed to reach the actual interactive controls; ANGULAR-06 library test selection.
- Behavior: wrapper-only disabled locks and reactive-form disabled state are combined without competing writes to the CVA `disabled` input; explicit/generated IDs now align controls, labels, and active error/hint descriptions; generated IDs replay deterministically for fresh server/client application injectors using `APP_ID` plus an application-scoped sequence.
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:library form-text-input form-textarea form-select form-checkbox form-date-picker form-searchable-multiselect` (13/13 passing).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:libraries` (2/2 source contracts and 16/16 browser tests passing serially).
- Verified: `pnpm --dir packages/angular bundle` (71/71 projects), targeted Prettier check, and `git diff --check`.
- Follow-up: none.

Completion evidence (independent-review closure):

- Changed: `packages/angular/test/form-hydration-server.mjs`, `packages/angular/test/run-library-tests.mjs`, `packages/angular/projects/form-text-input/src/lib/form-text-input.spec.ts`, `packages/angular/projects/input/src/lib/hlm-input.ts`, all six form-wrapper templates, and Angular test dependencies/lockfile.
- SSR/hydration proof: the focused runner builds the representative wrapper and its source dependencies, starts a Node `renderApplication` server with hydration metadata, and Chrome hydrates that exact markup with the same application ID. The test asserts the server `ngh` marker, generated ID format, control/label/hint ARIA alignment, exact server input-node reuse, and unchanged identity after hydration; Angular reports 3 components and 21 nodes hydrated with 0 skipped.
- Warning cleanup: removed stale `@let cid` declarations from all six wrappers; the focused and aggregate builds report no NG8112 warning for these templates.
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:library form-text-input form-textarea form-select form-checkbox form-date-picker form-searchable-multiselect` (13/13 passing, including real Node SSR/browser hydration).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:libraries` (2/2 source contracts and 22/22 browser tests passing serially).
- Verified: `pnpm --dir packages/angular bundle` (71/71 projects).
- Follow-up: none; the ANGULAR-FINAL hydration blocker is resolved.

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

Status: completed

Completion evidence:

- Changed: `packages/angular/projects/utils/src/lib/utils.ts`, `packages/angular/projects/utils/src/lib/utils.spec.ts`, `packages/angular/projects/layout-simple/src/lib/layout.ts`, `packages/angular/projects/layout-simple/src/lib/layout.spec.ts`, `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu.ts`, `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu-sub.ts`, `packages/angular/projects/dropdown-menu/src/lib/hlm-dropdown-menu.spec.ts`, `packages/angular/projects/radio-group/src/lib/hlm-radio.ts`, `packages/angular/projects/radio-group/src/lib/hlm-radio.spec.ts`, and `packages/angular/test/run-library-tests.mjs`.
- Runtime: class reconciliation now observes only managed hosts through injected-`DOCUMENT`, per-document state and document-owned browser APIs; teardown disconnects/rebinds observers and cancels pending animation frames. Layout subscriptions use `takeUntilDestroyed`, dropdown timers use `DestroyRef`, and radio labels are matched by exact `htmlFor` values without selector interpolation.
- Instrumentation: a 100-element unrelated class-mutation fixture triggers the document-wide baseline observer while producing zero package observer callbacks; separate iframe documents create and release independent observers.
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:library utils layout-simple dropdown-menu radio-group` (9/9 passing).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular run test:libraries` (2/2 source contracts and 22/22 browser tests passing serially).
- Verified: `pnpm --dir packages/angular bundle` (71/71 projects).
- Follow-up: none.

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

Status: completed

Completion evidence:

- Changed: `packages/angular/README.md`, 36 per-project READMEs that contained publish boilerplate, `projects/form-text-input/src/{public-api.ts,lib/form-text-input.ts}`, `projects/button/src/lib/button.ts`, `projects/layout-simple/src/lib/{layout,user-menu,sidebar,mobile-menu-group}.ts`, `projects/confirmation-dialog/src/{public-api.ts,lib/confirmation-dialog.ts}`, `packages/angular/validate-package.mjs`, `packages/angular/test/{public-api.test.mjs,validate-package.test.mjs}`, validator fixtures, and `packages/angular/package.json`.
- Public contract: the README's 71-subpath section is checked against `publishable-projects.json`; peer ranges and tested Angular 22.0.7/CDK 22.0.5/Spartan 1.1.1 compatibility, transitive runtime dependencies, canonical imports, and exact plain/`tw:` class semantics now match staged metadata and behavior.
- API migration: removed the unused public `SpreadAttrsDirective`; replaced avoidable public `any` in the button/layout APIs with `TemplateRef<unknown>`, `object`, `string`, and `MenuItem`; introduced `EgConfirmationDialog` while preserving `EgConfirmationDiaglog` as a declaration-visible deprecated type/value alias until the next major release.
- Verified: `pnpm --dir packages/angular test:public-api` (3/3), `test:source-exports` (2/2), and `test:package-validator` (15/15); validator regressions cover documentation drift, unresolved documented imports, internal publish instructions, leaked helpers, and avoidable authored declaration `any`.
- Verified: `pnpm --dir packages/angular bundle` (71/71); `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-09.0` (both serial 71-project builds, both exact staged packages validated and packed); explicit plain and `tw` validation each passed with 71 projects and 287 packed files.
- Packed artifacts: `egose-shadcn-theme-ng-0.0.0-angular-09.0.tgz` SHA-256 `86ad49f4a35a70e7c626d8c8926ad706b3a5f9805a4c23d284e492eb7bc879a2`; `egose-shadcn-theme-ng-tw-0.0.0-angular-09.0.tgz` SHA-256 `5990b1fecd91de8c227ffdbc8003e1ee607b158f0e91fb9a1a608261fb3144a5` (ignored generated output under `packages/angular/release/`).
- Verified: targeted Prettier check and `git diff --check`; no React source/config or `CHANGELOG.md` changes.
- Follow-up: none.

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

Status: completed

Completion evidence:

- Changed: `.github/workflows/test.yml`, `.github/actions/setup-npm/action.yml`, `.github/workflows/deploy-nextjs.yml`, `.github/workflows/deploy-angular.yml`, `.github/workflows/pre-commit.yml`, and `packages/angular/test/isolated-consumers.mjs`.
- CI contract: pull requests and pushes use frozen root/framework lockfiles; React retains its package/example setup; Angular runs separately named project-set, targeted source/variant/dependency, package-validator regression, release-script, serial release preparation, preserved-stage validation, exact-tarball consumer, and final lockfile checks.
- Isolation: the release helper serially preserves `release/staged/{plain,tw}` and both exact tarballs; each tarball is installed with strict peer resolution into a fresh `/tmp` application with no TypeScript path aliases or monorepo ancestry, then imports core button, form input, dialog overlay, simple layout, carousel, sonner, and menu entrypoints and runs strict type-check plus an optimized production build.
- Failure coverage: `test:build-all`, `test:package-validator`, `test:dependency-contract`, and `test:variants` reject missing project/export sets, absent export targets, wrong package identity, undeclared runtime imports, and variant class regressions before consumers run.
- Verified: `pnpm install --frozen-lockfile`; `pnpm --dir packages/angular install --frozen-lockfile`; `pnpm --dir packages/react/@examples/nextjs install --frozen-lockfile` (all lockfiles unchanged by this task).
- Verified: `pnpm --dir packages/angular test:build-all` (6/6), `test:package-validator` (15/15), `test:release` (5/5), `test:dependency-contract` (3/3), `test:public-api` (3/3), and `test:variants` (3/3).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular test:libraries` (2/2 source contracts and 22/22 focused browser tests).
- Verified: `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-10.0`; explicit plain and `tw` `validate:package` runs each passed with 71 projects and 287 packed files; `pnpm --dir packages/angular verify:consumers --release-dir release` installed 429 packages per isolated consumer, passed both strict type-checks and both production builds, and confirmed incompatible required peers fail installation.
- Packed artifacts: `egose-shadcn-theme-ng-0.0.0-angular-10.0.tgz` SHA-256 `7cd5176629778f5530a4889410efa4234cd6f9a27e474cfd14d3b0d4e3710307`; `egose-shadcn-theme-ng-tw-0.0.0-angular-10.0.tgz` SHA-256 `622354787570c08a0029bb654563302bcda1b91b6d1273755e6ebd504e99f9e6` (ignored generated output under `packages/angular/release/`).
- Verified: Actionlint 1.7.12 with ShellCheck integration disabled, targeted Prettier, and `git diff --check`; no `CHANGELOG.md`, React source/config, or lockfile edits.
- Follow-up: none.

Completion evidence (ANGULAR-FINAL installed-runtime closure):

- Changed: `packages/angular/test/isolated-consumers.mjs` now installs `@angular/platform-server` only in each temporary consumer and runs a minimal Node `renderApplication` check against the package imported from the exact tarball.
- Verified: both fresh consumers rendered an installed `HlmButtonModule` button and asserted the runtime class identity: plain includes `inline-flex` and excludes `tw:inline-flex`; prefixed includes `tw:inline-flex` and excludes unprefixed `inline-flex`.
- Verified: the same fresh consumers passed strict peer installation, `tsc --noEmit`, and optimized production builds before runtime rendering; the incompatible Angular 21 installation still failed with a peer diagnostic.
- Integration defect fixed: the standard example used removed `@ng-icons/lucide` export `lucideGithub`; replacing it with current export `lucideCode` restored `pnpm --dir packages/angular/@examples/standard test:ci` (2/2).

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

Status: completed

Completion evidence:

- Changed: `packages/angular/package.json`, `packages/angular/@examples/standard/package.json`, `packages/angular/pnpm-workspace.yaml`, `packages/angular/pnpm-lock.yaml`, `packages/angular/SECURITY.md`, compatibility assertions/documentation, and the existing Angular path in `.github/workflows/test.yml`.
- Remediation: upgraded direct Angular tooling to 22.1.x, Spartan to 1.3.2, ng-packagr to 22.1.1, and ng-icons to 35.0.1 before applying the documented `fast-uri@3.1.5` override. The override has an owner, upstream advisory, 2026-09-23 review deadline, removal criteria, and required regression checks.
- Audit: the baseline contained 43 high and 2 critical records. After direct upgrades and the override, `pnpm audit --prod --audit-level high` reports no known vulnerabilities. The remaining full-lock audit contains 37 high and 2 critical records (34 unique advisories), all development-only; `packages/angular/SECURITY.md` classifies every advisory by build-tool/example/consumer/runtime surface and records owner, rationale, reachability, and review date. No high/critical shipped-runtime advisory remains.
- CI: pull requests run pinned `actions/dependency-review-action` with `fail-on-severity: high`; the Angular job runs the high-threshold production audit after frozen installation. Existing React steps and behavior are unchanged.
- Verified: `pnpm --dir packages/angular install --frozen-lockfile`; `pnpm --dir packages/angular audit:production` (zero advisories); full `pnpm audit --json` triage (37 high, 2 critical, all dev-only).
- Verified: `pnpm --dir packages/angular test:dependency-contract` (3/3), `test:build-all` (6/6), `test:package-validator` (15/15), `test:public-api` (3/3), `test:variants` (3/3), and `test:release` (5/5).
- Verified: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular test:libraries` (2/2 source contracts and 22/22 browser tests).
- Verified: `pnpm --dir packages/angular bundle` (71/71 projects); `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-sec-01.0` (both variants, 71 projects and 287 packed files each); `pnpm --dir packages/angular verify:consumers --release-dir release` (both fresh consumers installed 319 packages with zero npm vulnerabilities, type-checked, and production-built; incompatible peers rejected).
- Packed artifacts: `egose-shadcn-theme-ng-0.0.0-angular-sec-01.0.tgz` SHA-256 `65b712938e19f737a9b5de1c64f737fefe0557d01140cc0a2d309c157cf75c5f`; `egose-shadcn-theme-ng-tw-0.0.0-angular-sec-01.0.tgz` SHA-256 `6bebfbe3f023e8f7685d077eac52de33f9c5225e552761901c0dd5190d5b0df8` (ignored generated output under `packages/angular/release/`).
- Verified: `ASDF_ACTIONLINT_VERSION=1.7.12 actionlint -shellcheck=`, targeted Prettier, and `git diff --check`; `CHANGELOG.md`, React sources/configuration, and non-Angular lockfiles are unchanged by this task.
- Follow-up: remove the `fast-uri` override when upstream Angular devkit dependency paths resolve a patched release; review all accepted build-only findings by 2026-09-23.

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

Status: completed

Prior independent review evidence (superseded by the closure below):

- Assigned agent/session: independent package review on 2026-08-23 local time; prior completion notes and pre-existing generated artifacts were not used as evidence.
- Checkout constraint: the candidate implementation existed as uncommitted work, so discarding it for a literal clean checkout would not review the requested candidate. The current dirty worktree was preserved, `pnpm --dir packages/angular install --frozen-lockfile` reported the workspace already up to date, and all release stages/tarballs were freshly replaced by the prepare-only command.
- Small defects corrected during review: `packages/angular/README.md` now names the tested Spartan version as `1.3.2`; `projects/radio-group/src/lib/hlm-radio-indicator.ts` fixes two malformed `group-data-[disabled=true]` utilities so the prefixed transform emits valid `tw:group-data-[disabled=true]:...` tokens.
- Prepared without publishing: `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-final.0` completed two serial 71-project builds, exact stage validation, and packing. No `npm publish` command ran.
- Packed artifact: `egose-shadcn-theme-ng-0.0.0-angular-final.0.tgz`, 178788 bytes, SHA-256 `a3957c0137c28b057cce419ab53fcecbea186ac710617fef2a792762a896c9ac`, 287 files.
- Packed artifact: `egose-shadcn-theme-ng-tw-0.0.0-angular-final.0.tgz`, 180162 bytes, SHA-256 `94695f959d1640af97fbbf89620898891a9127dd28a5a80980c041f5e7d406ea`, 287 files.
- Metadata/artifacts: both candidates use version `0.0.0-angular-final.0`, Apache-2.0 root license content, author `Junmin Ahn`, correct package names, 71 exact exports with existing runtime/declaration targets, complete declared runtime dependencies/peers, and no placeholders, credential patterns, cross-variant self-imports, source maps, source-map references, or leaked `exports.json`.
- Isolated consumers: `pnpm --dir packages/angular verify:consumers --release-dir release` installed each exact tarball with strict peer resolution into fresh `/tmp` applications (319 packages, zero vulnerabilities each), then passed strict `tsc --noEmit` and optimized production builds (plain 283.86 kB, `tw` 285.18 kB); an Angular 21 installation failed with the expected peer diagnostic.
- Source component verification: `CHROME_BIN=~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell pnpm --dir packages/angular test:libraries` passed 2 source-contract and 22 focused browser tests covering representative source component rendering, form behavior, deterministic ID replay, server-platform DOM behavior, and lifecycle cleanup. One initial aggregate run had a transient Chrome spec-loader failure at `dropdown-menu`; the isolated suite and a complete aggregate rerun both passed.
- Release safety: `pnpm --dir packages/angular test:release` passed 5/5, including opaque/redacted shell-like OTP handling, registry failure classification, second-variant failure preventing both publishes, prepare-only two-tarball output, absolute `cwd`/`shell: false`, and CLI nonzero failure. `test:build-all` passed 6/6 fail-fast cases.
- Additional verification: `test:package-validator` 15/15, `test:variants` 3/3, `test:dependency-contract` 3/3, `test:public-api` 3/3, `audit:production` zero known vulnerabilities, exact root-license comparison for both stages, and `git diff --check` passed.
- Blocker: exact-tarball consumers currently stop after strict type-check and optimized compilation; they do not execute or render either installed package. The source hydration check does not perform actual Angular SSR plus browser hydration. Therefore representative installed plain/`tw` rendering and the ANGULAR-07 server-render-plus-hydration criterion remain unverified.
- Result: packaging, metadata, dependency, identity, prefix, source-map, fail-fast, atomicity, credential-safety, and source component checks pass, but ANGULAR-FINAL cannot complete while the P1 hydration/render integration gap remains.
- Follow-up: add a fresh-consumer runtime harness that server-renders and hydrates representative components from each exact tarball, asserts no hydration diagnostics, and checks plain versus `tw:` DOM classes; then rerun ANGULAR-FINAL.

Completion evidence (resumed independent review):

- Hydration closure: independently inspected and ran the real Node `renderApplication` plus Chrome `provideClientHydration` path. Server markup contained Angular hydration metadata; Chrome reported 3 components and 21 nodes hydrated with 0 skipped; the original input node was reused and generated ID, label, hint, and `aria-describedby` relationships stayed identical.
- Installed runtime closure: extended the temporary consumer harness to server-render `HlmButtonModule` from each exact installed tarball. Both renders produced the expected text and variant-specific class (`inline-flex` only for plain, `tw:inline-flex` only for `tw`).
- Fresh source/component gates: `test:build-all` 6/6, `test:package-validator` 15/15, `test:variants` 3/3, `test:dependency-contract` 3/3, `test:public-api` 3/3, `test:release` 5/5, `test:libraries` 2/2 source contracts plus 22/22 browser tests, standard example `test:ci` 2/2, and production audit zero known vulnerabilities.
- Fresh release: `pnpm --dir packages/angular prepare:release --version 0.0.0-angular-final.1` completed two serial 71-project builds, validation, and packing without publishing.
- Packed artifact: `egose-shadcn-theme-ng-0.0.0-angular-final.1.tgz`, 178976 bytes, SHA-256 `7f7e626676e592497f7d770a7f9aa608b96bf23d18c6b0a10e6c4f39b71a2ac5`, 287 files.
- Packed artifact: `egose-shadcn-theme-ng-tw-0.0.0-angular-final.1.tgz`, 180310 bytes, SHA-256 `372c04d84c1155a2e1bc91c0066eb4fd692395c834736074471e9c88a73f2df2`, 287 files.
- Exact artifact validation: both stages contain the correct name/version/license/author, 71 valid runtime/declaration exports, complete dependency metadata, correct plain/`tw` self-identity and representative classes, and no placeholders, credentials, source maps/references, leaked `exports.json`, or unexpected files.
- Exact consumer verification: each tarball installed 321 packages with strict peer resolution and zero vulnerabilities in a fresh `/tmp` application, passed strict type-check and optimized production build (plain 283.86 kB, `tw` 285.18 kB), then passed installed-package SSR rendering; Angular 21 remained correctly rejected.
- Result: all ANGULAR-FINAL acceptance criteria pass and no Angular P0/P1 task remains incomplete or blocked. Generated `dist`, release stages, and tarballs remain ignored and uncommitted.
- Follow-up: none.

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

## Overall Completion Evidence

- Completed: all 12 task items are `completed`; no P0/P1 item remains pending or blocked.
- Final review: `test:build-all` 6/6, `test:package-validator` 15/15, `test:variants` 3/3, `test:dependency-contract` 3/3, `test:public-api` 3/3, and `test:release` 5/5 passed.
- Browser verification: `test:libraries` passed 2/2 source contracts and 22/22 focused browser tests, including real Node SSR plus browser hydration; the standard example `test:ci` passed 2/2.
- Supply-chain verification: `pnpm --dir packages/angular install --frozen-lockfile` passed and `pnpm --dir packages/angular audit:production` reported no known vulnerabilities.
- Final plain artifact: `egose-shadcn-theme-ng-0.0.0-angular-final.1.tgz`, 178976 bytes, SHA-256 `7f7e626676e592497f7d770a7f9aa608b96bf23d18c6b0a10e6c4f39b71a2ac5`.
- Final prefixed artifact: `egose-shadcn-theme-ng-tw-0.0.0-angular-final.1.tgz`, 180310 bytes, SHA-256 `372c04d84c1155a2e1bc91c0066eb4fd692395c834736074471e9c88a73f2df2`.
- Artifact and consumer result: both 71-project/287-file candidates passed exact-package validation, strict isolated installation, type-checking, production builds, and installed-package SSR rendering without publication.
- Scope check: `git diff --check` passed; `CHANGELOG.md`, React source/configuration, generated `dist`, release stages, and tarballs were not added to the tracked change set.

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
