import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateStagedAngularPackage } from '../validate-package.mjs';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(testDir, 'fixtures/package-validator');
const validator = path.join(testDir, '../validate-package.mjs');
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function fixture(variant = 'plain') {
  const directory = await mkdtemp(path.join(tmpdir(), 'angular-package-validator-'));
  temporaryDirectories.push(directory);
  const workspace = path.join(directory, 'workspace');
  const staged = path.join(directory, 'staged');
  await cp(path.join(fixtureDir, 'workspace'), workspace, { recursive: true });
  await cp(path.join(fixtureDir, 'staged'), staged, { recursive: true });
  if (variant === 'tw') {
    const packageFile = path.join(staged, 'package.json');
    const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));
    packageJson.name = '@egose/shadcn-theme-ng-tw';
    await writeFile(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);
    for (const file of ['alpha/fesm2022/alpha.mjs', 'alpha/types/alpha.d.ts']) {
      const target = path.join(staged, file);
      await writeFile(
        target,
        (await readFile(target, 'utf8')).replaceAll('@egose/shadcn-theme-ng/', '@egose/shadcn-theme-ng-tw/'),
      );
    }
  }
  return { workspaceDir: workspace, packageDir: staged, variant };
}

async function expectFailure(options, message) {
  const result = spawnSync(
    process.execPath,
    [validator, '--workspace', options.workspaceDir, '--package', options.packageDir, '--variant', options.variant],
    { encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0, 'validator CLI should exit nonzero');
  assert.match(result.stderr, message);
}

test('valid plain fixture passes', async () => {
  const result = await validateStagedAngularPackage(await fixture());
  assert.deepEqual(result, { packageName: '@egose/shadcn-theme-ng', projects: 2, files: 11 });
});

test('valid tw fixture passes independently', async () => {
  const result = await validateStagedAngularPackage(await fixture('tw'));
  assert.deepEqual(result, { packageName: '@egose/shadcn-theme-ng-tw', projects: 2, files: 11 });
});

test('missing project output fails', async () => {
  const options = await fixture();
  await rm(path.join(options.packageDir, 'beta'), { recursive: true });
  await expectFailure(options, /staged project outputs is missing: beta/);
});

test('wrong runtime package identity fails', async () => {
  const options = await fixture('tw');
  const runtime = path.join(options.packageDir, 'alpha/fesm2022/alpha.mjs');
  await writeFile(runtime, (await readFile(runtime, 'utf8')).replace('-tw/', '/'));
  await expectFailure(options, /alpha\.mjs contains wrong package identity/);
});

test('wrong declaration package identity fails', async () => {
  const options = await fixture('tw');
  const declaration = path.join(options.packageDir, 'alpha/types/alpha.d.ts');
  await writeFile(declaration, (await readFile(declaration, 'utf8')).replace('-tw/', '/'));
  await expectFailure(options, /alpha\.d\.ts contains wrong package identity/);
});

test('absent export target fails', async () => {
  const options = await fixture();
  await unlink(path.join(options.packageDir, 'alpha/types/alpha.d.ts'));
  await expectFailure(options, /types target does not exist/);
});

test('source maps and stale source-map references are rejected', async () => {
  const options = await fixture();
  const runtime = path.join(options.packageDir, 'alpha/fesm2022/alpha.mjs');
  await writeFile(runtime, `${await readFile(runtime, 'utf8')}\n//# sourceMappingURL=alpha.mjs.map\n`);
  await writeFile(`${runtime}.map`, '{}\n');
  await expectFailure(
    options,
    /Unexpected package files: alpha\/fesm2022\/alpha\.mjs\.map[\s\S]*references an excluded source map/,
  );
});

test('missing TypeScript path fails', async () => {
  const options = await fixture();
  const tsconfigFile = path.join(options.workspaceDir, 'tsconfig.json');
  const tsconfig = JSON.parse(await readFile(tsconfigFile, 'utf8'));
  delete tsconfig.compilerOptions.paths['@egose/shadcn-theme-ng/beta'];
  await writeFile(tsconfigFile, JSON.stringify(tsconfig));
  await expectFailure(options, /TypeScript paths is missing: beta/);
});

test('missing Angular project fails', async () => {
  const options = await fixture();
  const angularFile = path.join(options.workspaceDir, 'angular.json');
  const angular = JSON.parse(await readFile(angularFile, 'utf8'));
  delete angular.projects.beta;
  await writeFile(angularFile, JSON.stringify(angular));
  await expectFailure(options, /angular\.json projects is missing: beta/);
});

test('missing package export fails', async () => {
  const options = await fixture();
  const packageFile = path.join(options.packageDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));
  delete packageJson.exports['./beta'];
  await writeFile(packageFile, JSON.stringify(packageJson));
  await expectFailure(options, /package exports is missing: beta/);
});

test('documented subpaths and imports must resolve from the staged package', async () => {
  const options = await fixture();
  const readmeFile = path.join(options.packageDir, 'README.md');
  await writeFile(readmeFile, (await readFile(readmeFile, 'utf8')).replace('`alpha`, `beta`', '`alpha`, `missing`'));
  await expectFailure(
    options,
    /README documented subpaths is missing: beta[\s\S]*README documented subpaths has unexpected entries: missing/,
  );
});

test('avoidable any and internal helpers are rejected from declarations', async () => {
  const options = await fixture();
  const declaration = path.join(options.packageDir, 'alpha/types/alpha.d.ts');
  await writeFile(
    declaration,
    `${await readFile(declaration, 'utf8')}\nexport declare class SpreadAttrsDirective { attrs: any; }\n`,
  );
  await expectFailure(options, /contains avoidable public any[\s\S]*exposes internal SpreadAttrsDirective/);
});

test('per-project readmes cannot instruct publishing internal outputs', async () => {
  const options = await fixture();
  await writeFile(path.join(options.workspaceDir, 'projects/alpha/README.md'), 'Run npm publish from cd dist/alpha.\n');
  await expectFailure(options, /projects\/alpha\/README\.md instructs publishing an internal build directory/);
});

test('npm dry-run file list must exactly match the staged package', async () => {
  const options = await fixture();
  const packageFile = path.join(options.packageDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));
  packageJson.files = ['alpha'];
  await writeFile(packageFile, JSON.stringify(packageJson));
  await expectFailure(options, /npm pack file list differs from staged files \(missing: beta\//);
});

test('placeholder, leaked exports file, absent metadata, and unexpected file fail', async () => {
  const options = await fixture();
  const packageFile = path.join(options.packageDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));
  delete packageJson.license;
  packageJson.description = 'PLACEHOLDER';
  await writeFile(packageFile, JSON.stringify(packageJson));
  await writeFile(path.join(options.packageDir, 'exports.json'), '{}');
  await writeFile(path.join(options.packageDir, 'alpha/internal.js'), 'export {};');
  await expectFailure(
    options,
    /missing metadata field: license[\s\S]*leaks exports\.json[\s\S]*Unexpected package files[\s\S]*contains a placeholder/,
  );
});
