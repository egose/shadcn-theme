## Publish Package

Releases use `@repo-toolkit/publish-package` (`^0.31.0`, see
`node_modules/@repo-toolkit/publish-package/README.md`) via the per-package
configs below. The toolkit resolves the target version from the npm registry,
substitutes `0.0.0-PLACEHOLDER` / `PLACEHOLDER`, copies `README.md` + `llms.txt`
(package) and `LICENSE` (repo root), validates, `npm pack`s, then
`npm publish --access public`.

### Configs

| Package                                   | Config                                |
| ----------------------------------------- | ------------------------------------- |
| React (`@egose/shadcn-theme`)             | `packages/react/publish.config.mjs`   |
| Angular (`@egose/shadcn-theme-ng`, `-tw`) | `packages/angular/publish.config.mjs` |

- `packages/react/publish.config.mjs`: one artifact (`release` → `@egose/shadcn-theme`,
  `stageDir: release/npm`, `preserveSourceFiles: true`). Build: `pnpm bundle` in
  `packages/react`, then `cp dist → stageDir`. Validate:
  `node scripts/validate-package.mjs <stageDir>`. `requireTarball: true`.
- `packages/angular/publish.config.mjs`: two artifacts —
  `plain` → `@egose/shadcn-theme-ng` (`release/plain`) and
  `tw` → `@egose/shadcn-theme-ng-tw` (`release/tw`). Build:
  `pnpm bundle [--stage <stageDir>]` (`tw` appends the `tw` bundle arg;
  plain strips the `tw:` prefix, `tw` keeps it).
  `manifestOverlay` reads `exports.json` into `exports` and deletes the file.
  Validate: `node validate-package.mjs --workspace <cwd> --package <stageDir> --variant plain|tw`.
  Both: `requireTarball: true`.
- Both configs set `cwd`, `rootDir` (repo root), `allowPrivateTemplate: true`
  (source manifests are `"private": true` templates; the generated manifest never
  carries `private`), `packageFiles: ['README.md', 'llms.txt']`,
  `rootFiles: ['LICENSE']`, `access/publishAccess: 'public'`.

### Local prerequisites

- Node `>= 20`, `bash` on `PATH`, `pnpm` installed; `make install` (root +
  `packages/react` + `packages/angular` + `@examples/*`).
- `npm login` against the target registry (`npm whoami` must succeed for a real
  publish; auth/network/5xx failures are fatal, only a confirmed `E404`
  package-absence starts from `0.0.0`).
- 2FA: pass `--otp <code>`; the toolkit forwards it via `npm_config_otp` env
  (never argv) and redacts it from errors.

### Commands

```sh
# React — patch bump
pnpm exec repo-toolkit-publish-package --config packages/react/publish.config.mjs --bump patch

# Angular — same bump publishes BOTH @egose/shadcn-theme-ng and @egose/shadcn-theme-ng-tw
pnpm exec repo-toolkit-publish-package --config packages/angular/publish.config.mjs --bump patch

# Explicit version (one leading `v` stripped, strict semver)
pnpm exec repo-toolkit-publish-package --config packages/react/publish.config.mjs --version 1.2.3

# Major / minor variants
pnpm exec repo-toolkit-publish-package --config packages/angular/publish.config.mjs --bump major

# 2FA publish
pnpm exec repo-toolkit-publish-package --config packages/react/publish.config.mjs --bump patch --otp 123456

# Safe rehearsal: stage + build + manifest + validate + pack, NO `npm publish`
# (stages retained under release/<id>/ for inspection)
pnpm exec repo-toolkit-publish-package --config packages/react/publish.config.mjs --bump patch --prepare-only
pnpm exec repo-toolkit-publish-package --config packages/angular/publish.config.mjs --version 1.2.3 --prepare-only

# npm-side rehearsal: still invokes `npm publish --dry-run`
pnpm exec repo-toolkit-publish-package --config packages/react/publish.config.mjs --version 1.2.3 --dry-run

# Additional options
pnpm exec repo-toolkit-publish-package --config packages/react/publish.config.mjs --bump patch --npm-tag beta --registry https://registry.npmjs.org --provenance
```

Flag mapping (`--help` is canonical): `--config`, `--cwd`, `--root-dir`,
`--version` (alias `--tag`) ⨯ mutually exclusive with `--bump major|minor|patch`,
`--npm-tag`, `--publish-dir`, `--preserve-publish-dir`, `--version-placeholder`
(default `0.0.0-PLACEHOLDER`), `--package-files/--include-package-file`,
`--root-files/--include-root-file`, `--build-command` (unused here — configs use
`build()` hooks), `--skip-build`, `--access`, `--registry`, `--otp`,
`--provenance`, `--dry-run` vs `--prepare-only` (see above), `--publish-access`,
`--allow-private-template`.

Version selection (one of): explicit `--version` → registry `--bump` via
`npm view <name> version --json` (+ bump, `0.0.0` base only on confirmed absence)
→ else `package.json.version` (fails here because source is the placeholder, so
always pass one of the first two).

### JavaScript API (`@repo-toolkit/publish-package`)

```ts
import { publishPackage, preparePackageArtifacts } from '@repo-toolkit/publish-package';

// Same effect as the CLI bump flow, without a config file:
await publishPackage({
  cwd: 'packages/react',
  rootDir: '.',
  bump: 'patch',
  packageFiles: ['README.md', 'llms.txt'],
  rootFiles: ['LICENSE'],
  allowPrivateTemplate: true,
  prepareOnly: true, // or dryRun: true to forward --dry-run to npm publish
});

// Inspect without publishing (returns PreparedPackageArtifact[] with stageDir/tarballPath)
await preparePackageArtifacts({ cwd: 'packages/angular', bump: 'patch' });
```

Other public helpers (re-exported from the package root): `createPublishPackageJson`
(manifest rewrite: placeholder → version, root `author`/`license`/`bugs`/`engines`/
`repository` fallback, `publishConfig.access` injection),
`resolvePublishPackagePlan` / `resolvePublishPackagePlanAsync` (registry bump needs
the async entry + a capturing runner), `inferNpmTag`, `normalizeVersion`,
`parseFlags`, `loadConfigFile` / `resolveConfigPath`, `resolveCliOptions`,
`defaultProcessRunner` (+ `ProcessRunner`/`CapturingProcessRunner` for injection),
`applyManifestOverlay` (+ `OVERLAY_DENIED_FIELDS`: `private`, `scripts`,
`devDependencies`, `packageManager`), `validateSourceManifest` /
`validateRootManifest`, shared constants (`DEPENDENCY_FIELDS`,
`DEFAULT_VERSION_PLACEHOLDER`, `DEFAULT_PUBLISH_DIR`, `DEFAULT_PACKAGE_FILES`,
`DEFAULT_ROOT_FILES`, `DEFAULT_ACCESS`, `DEFAULT_PUBLISH_FILES_FIELD`).

Artifact recipe shape (`publish.config.mjs`, JS config required for hooks):
`{ id, packageName, stageDir?, build?, manifestOverlay?, validate?, requireTarball?,
preserveSourceFiles?, publishAccess? }` — hooks receive
`{ cwd, rootDir, stageDir, version, artifactId, packageName, runner }` and throwing
fails the artifact; all artifacts finish prepare+pack before the first
`npm publish`, so any failure publishes nothing.
