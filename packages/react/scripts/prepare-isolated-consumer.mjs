import assert from 'node:assert/strict';
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = fileURLToPath(new URL('..', import.meta.url));
const fixtureDirectory = path.join(packageDirectory, 'test-fixtures/isolated-consumer');
const consumerDirectory = path.join(packageDirectory, '.isolated-consumer');
const artifactDirectory = path.join(packageDirectory, '.artifacts');
const artifacts = (await readdir(artifactDirectory)).filter((file) => file.endsWith('.tgz'));

assert.equal(artifacts.length, 1, 'Run pnpm pack:package before preparing the isolated consumer');

const fixturePackageJson = await readFile(path.join(fixtureDirectory, 'package.json'), 'utf8');
const fixtureTsconfig = await readFile(path.join(fixtureDirectory, 'tsconfig.json'), 'utf8');
assert.doesNotMatch(fixturePackageJson, /@egose\/shadcn-theme/, 'Fixture dependencies must not alias package source');
assert.doesNotMatch(fixtureTsconfig, /(?:paths|baseUrl)/, 'Fixture TypeScript config must not define aliases');

await rm(consumerDirectory, { recursive: true, force: true });
await cp(fixtureDirectory, consumerDirectory, {
  recursive: true,
  filter: (source) => !['node_modules', 'dist'].includes(path.basename(source)),
});

const packageJsonPath = path.join(consumerDirectory, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const tarball = path.join(artifactDirectory, artifacts[0]);
packageJson.dependencies['@egose/shadcn-theme'] = `file:${tarball}`;
await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const install = spawnSync(
  'pnpm',
  ['install', '--offline', '--ignore-workspace', '--config.lockfile=false', '--ignore-scripts'],
  { cwd: consumerDirectory, encoding: 'utf8' },
);
assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`.trim());

const installedPackageJson = JSON.parse(
  await readFile(path.join(consumerDirectory, 'node_modules/@egose/shadcn-theme/package.json'), 'utf8'),
);
assert.equal(installedPackageJson.version, '0.0.0-test.0');
const requiredPeers = ['react', 'react-dom', 'react-hook-form', 'sonner'];
assert.deepEqual(Object.keys(installedPackageJson.peerDependencies ?? {}).sort(), requiredPeers);
for (const peer of requiredPeers) {
  assert(packageJson.dependencies[peer], `Consumer must install the ${peer} peer dependency`);
}
console.log(`Installed ${installedPackageJson.name}@${installedPackageJson.version} from ${tarball}`);
