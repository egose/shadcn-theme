# Angular Dependency Security Policy

Last reviewed: 2026-08-23

Owner: Angular package maintainers

## CI Policy

- Pull requests run GitHub dependency review and reject newly introduced high or critical advisories.
- `pnpm audit:production` audits the Angular workspace production graph and fails at high severity. This is the release threshold because dependencies and automatically installed peers can reach consumers.
- The full development audit remains visible below. Build-only findings do not pass into either published tarball and are reviewed monthly or when an owning direct dependency releases a fix, whichever comes first.

## Runtime And Consumer Triage

The 2026-08-23 baseline production audit reported two high findings. Both were in `fast-uri@3.1.3` through `@ng-icons/core > @angular-devkit/schematics` and `@schematics/angular`; the affected parser is consumer schematics tooling, not browser runtime code. They are nevertheless in the automatic peer-install graph, so they are remediated rather than accepted.

| Advisories                                   | Classification   | Affected surface                                         | Reachability                                                                                           | Resolution                                                         |
| -------------------------------------------- | ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `GHSA-v2hh-gcrm-f6hx`, `GHSA-7p8r-x3mc-p8w7` | consumer tooling | `@ng-icons/core` peer schematics installed for consumers | Reachable only when schematics parse attacker-controlled URI data; absent from emitted package runtime | `fast-uri@3.1.5` override pending upstream Angular devkit adoption |

No high or critical advisory was found in emitted browser runtime dependencies. `pnpm audit:production` passes after the override.

## Temporary Override

| Package          | Owner                       | Upstream issue                                                                                                      | Expiry criteria                                                                                                            | Required tests                                                                                              |
| ---------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `fast-uri@3.1.5` | Angular package maintainers | [fastify/fast-uri GHSA-7p8r-x3mc-p8w7](https://github.com/fastify/fast-uri/security/advisories/GHSA-7p8r-x3mc-p8w7) | Remove when all `@ng-icons/core`/Angular devkit paths resolve `fast-uri >=3.1.5` without an override; review by 2026-09-23 | frozen install, `audit:production`, dependency-contract tests, both package bundles, and isolated consumers |

The override stays on the patched 3.x line required by the current `ajv` dependency and does not change its declared semver contract.

## Accepted Build And Example Findings

These findings are accepted until 2026-09-23. Owner: Angular package maintainers. Rationale: every path is development-only, is absent from both npm tarballs, and is reachable only while running trusted local/CI build, test, dev-server, schematic, or example inputs. The package build and isolated-consumer tests remain required. A finding must be escalated immediately if it appears in `pnpm audit --prod`, a packed artifact, or an untrusted-input CI path.

| Advisories                                                                                                                               | Dependency         | Classification      | Affected surface and reachability                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `GHSA-554w-wpv2-vw27`, `GHSA-5gfm-wpxj-wjgq`, `GHSA-2328-f5f3-gj25`, `GHSA-q67f-28xg-22rw`, `GHSA-5m6q-g25r-mvwx`, `GHSA-ppp5-5v6c-4jwp` | `node-forge`       | build-tool          | Optional Spartan/Nx webpack development server; not started by package build or tests                             |
| `GHSA-3ppc-4f35-3m26`, `GHSA-7r86-cg39-jmmj`, `GHSA-23c5-xmqv-rm74`                                                                      | `minimatch`        | build-tool, example | Karma/Nx file matching over repository-controlled paths                                                           |
| `GHSA-7gcc-r8m5-44qm`                                                                                                                    | `koa`              | build-tool          | Optional Spartan/Nx module-federation development tooling; no shipped server                                      |
| `GHSA-25h7-pfq9-p65f`, `GHSA-rf6f-7fwh-wjgh`                                                                                             | `flatted`          | build-tool, example | Karma logging/configuration over repository-controlled data                                                       |
| `GHSA-677m-j7p3-52f9`, `GHSA-2m8v-j782-fhvr`                                                                                             | `socket.io-parser` | build-tool, example | Karma test-runner transport on CI/local loopback                                                                  |
| `GHSA-c2c7-rcm5-vvqj`                                                                                                                    | `picomatch`        | build-tool, example | Karma, ts-morph, and Nx matching over repository-controlled paths                                                 |
| `GHSA-j3q9-mxjg-w52f`                                                                                                                    | `path-to-regexp`   | build-tool, example | Angular CLI MCP server dependency; no package runtime route handling                                              |
| `GHSA-r5fr-rjxr-66jc`                                                                                                                    | `lodash`           | build-tool, example | Karma/Nx tooling; package code does not invoke `_.template`                                                       |
| `GHSA-w7jw-789q-3m8p`, `GHSA-395f-4hp3-45gv`                                                                                             | `shell-quote`      | build-tool          | Optional Spartan/Nx webpack editor launcher; not invoked by package CI                                            |
| `GHSA-ph9p-34f9-6g65`                                                                                                                    | `tmp`              | build-tool, example | Karma/Nx temporary files with repository-controlled options                                                       |
| `GHSA-96hv-2xvq-fx4p`                                                                                                                    | `ws`               | build-tool, example | Karma and optional webpack development-server transport; no shipped server                                        |
| `GHSA-xv26-6w52-cph6`                                                                                                                    | `websocket-driver` | build-tool          | Optional Spartan/Nx webpack development server; not started by package CI                                         |
| `GHSA-xcpc-8h2w-3j85`                                                                                                                    | `adm-zip`          | build-tool          | Optional Spartan/Nx module-federation type tooling over repository-controlled artifacts                           |
| `GHSA-3jxr-9vmj-r5cp`, `GHSA-mh99-v99m-4gvg`, `GHSA-rgw5-rvv9-x895`                                                                      | `brace-expansion`  | build-tool, example | Karma, ts-morph, and Nx glob expansion over repository-controlled patterns                                        |
| `GHSA-r635-g3xr-vw7x`                                                                                                                    | `engine.io`        | build-tool, example | Karma test-runner transport on CI/local loopback                                                                  |
| `GHSA-gcfj-64vw-6mp9`                                                                                                                    | `axios`            | build-tool          | Spartan/Nx module-federation and workspace tooling; no emitted runtime import                                     |
| `GHSA-mwp4-54f8-5fhr`                                                                                                                    | `ip-address`       | build-tool, example | Angular CLI MCP server dependency; no package runtime address parsing                                             |
| `GHSA-5p4m-2wfm-xmqj`                                                                                                                    | `js-yaml`          | build-tool          | Spartan/Nx lint and webpack configuration over repository-controlled files                                        |
| `GHSA-w3rx-r6r6-pgpr`, `GHSA-5p2g-fcmc-qvqq`                                                                                             | `image-size`       | build-tool, example | Angular/ng-packagr Less processing; this workspace does not feed untrusted image files to Less                    |
| `GHSA-28wg-ghj8-5hjv`, `GHSA-2v37-7h3g-55p8`                                                                                             | `nanoid`           | build-tool          | Angular/ng-packagr PostCSS processing; vulnerable custom/non-secure generator APIs are not called by package code |

There are no accepted shipped-runtime findings and no untriaged high or critical findings in the Angular lock domain as of the review date.
