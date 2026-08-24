import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { determineTargetVersion, runRelease } from '../../../scripts/publish.mjs';

const temporaryDirectories = [];
const publishScript = fileURLToPath(new URL('../../../scripts/publish.mjs', import.meta.url));

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

function processResult(status = 0, stdout = '', stderr = '', error) {
  return { status, stdout, stderr, error };
}

async function releaseFixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'angular-release-'));
  temporaryDirectories.push(root);
  const packageDir = path.join(root, 'packages/angular');
  await mkdir(packageDir, { recursive: true });
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ license: 'Apache-2.0', author: 'Test Author' }));
  await writeFile(path.join(root, 'LICENSE'), 'license\n');
  await writeFile(path.join(packageDir, 'README.md'), 'readme\n');
  await writeFile(path.join(packageDir, 'validate-package.mjs'), '');
  await writeFile(
    path.join(packageDir, 'package.json'),
    JSON.stringify({
      name: '@egose/shadcn-theme-ng',
      version: '0.0.0-PLACEHOLDER',
      description: 'fixture',
      license: 'PLACEHOLDER',
      author: 'PLACEHOLDER',
      bundles: ['tw'],
    }),
  );
  return { root, packageDir };
}

function releaseRunner(calls, { failVariant } = {}) {
  return (command, args, options) => {
    calls.push({ command, args: [...args], cwd: options.cwd, options: { ...options } });
    if (command === 'pnpm') {
      const stage = args[args.indexOf('--stage') + 1];
      fs.mkdirSync(stage, { recursive: true });
      fs.writeFileSync(path.join(stage, 'exports.json'), JSON.stringify({}));
      return processResult();
    }
    if (command === process.execPath) {
      const variant = args[args.indexOf('--variant') + 1];
      return variant === failVariant ? processResult(1, '', 'injected validation failure') : processResult();
    }
    if (command === 'npm' && args[0] === 'pack') {
      const manifest = JSON.parse(fs.readFileSync(path.join(options.cwd, 'package.json'), 'utf8'));
      const filename = `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`;
      const destination = args[args.indexOf('--pack-destination') + 1];
      fs.writeFileSync(path.join(destination, filename), 'tarball');
      return processResult(0, JSON.stringify([{ filename }]));
    }
    return processResult();
  };
}

test('only a confirmed npm E404 starts at the initial version', async () => {
  const lookupCalls = [];
  const absent = (command, args, options) => {
    lookupCalls.push({ command, args, options });
    return processResult(1, '', 'npm error code E404\nnpm error 404 Not Found - is not in this registry');
  };
  assert.equal(await determineTargetVersion('@scope/new', {}, absent), '0.0.1');
  assert.deepEqual(lookupCalls[0].args, ['view', '@scope/new', 'version', '--json']);
  assert.equal(lookupCalls[0].options.shell, false);
  assert(path.isAbsolute(lookupCalls[0].options.cwd));

  for (const [stderr, classification] of [
    ['npm error code E401 unauthorized', 'authentication'],
    ['npm error code ETIMEDOUT network timeout', 'timeout'],
    ['npm error code ENETUNREACH network unavailable', 'network'],
    ['npm error code E500 registry unavailable', 'registry'],
    ['npm error code E404 authentication policy denied', 'authentication'],
    ['npm error code E404\nnpm error 404 Not Found\nnpm error Access token expired', 'authentication'],
    ['unexpected npm failure', 'unknown'],
  ]) {
    await assert.rejects(
      determineTargetVersion('@scope/pkg', {}, () => processResult(1, '', stderr)),
      new RegExp(`npm view failed \\(${classification}\\)`),
    );
  }
  const missingNpm = Object.assign(new Error('spawn npm ENOENT'), { code: 'ENOENT' });
  await assert.rejects(
    determineTargetVersion('@scope/pkg', {}, () => processResult(null, '', '', missingNpm)),
    /npm view failed \(npm-unavailable\)/,
  );
  await assert.rejects(
    determineTargetVersion('@scope/pkg', {}, () => processResult(0, 'not-json')),
    /malformed JSON/,
  );
  await assert.rejects(
    determineTargetVersion('@scope/pkg', {}, () => processResult(0, 'null')),
    /invalid package version/,
  );
});

test('a failed second variant validates before publish and prevents both publish calls', async () => {
  const { root } = await releaseFixture();
  const calls = [];
  await assert.rejects(
    runRelease(
      { context: 'angular', version: '1.2.3', otp: 'unused' },
      { rootDir: root, run: releaseRunner(calls, { failVariant: 'tw' }), log: () => {} },
    ),
    /injected validation failure/,
  );
  assert.equal(calls.filter(({ command, args }) => command === 'npm' && args[0] === 'publish').length, 0);
});

test('prepare-only creates two inspectable tarballs without publishing', async () => {
  const { root } = await releaseFixture();
  const calls = [];
  const prepared = await runRelease(
    { context: 'angular', version: '1.2.3', prepareOnly: true },
    { rootDir: root, run: releaseRunner(calls), log: () => {} },
  );
  assert.equal(prepared.length, 2);
  assert.deepEqual(
    prepared.map(({ name }) => name),
    ['@egose/shadcn-theme-ng', '@egose/shadcn-theme-ng-tw'],
  );
  for (const item of prepared) {
    assert.equal(await readFile(item.tarball, 'utf8'), 'tarball');
    assert.equal(JSON.parse(await readFile(path.join(item.stageDir, 'package.json'), 'utf8')).name, item.name);
  }
  assert.equal(calls.filter(({ command, args }) => command === 'npm' && args[0] === 'publish').length, 0);
});

test('shell-like OTP remains one opaque argument and is absent from logs', async () => {
  const { root } = await releaseFixture();
  const calls = [];
  const logs = [];
  const otp = '123456; $(touch /tmp/never) "secret"';
  await runRelease(
    { context: 'angular', version: '1.2.3', otp },
    { rootDir: root, run: releaseRunner(calls), log: (message) => logs.push(message) },
  );
  const publishes = calls.filter(({ command, args }) => command === 'npm' && args[0] === 'publish');
  assert.equal(publishes.length, 2);
  for (const publish of publishes) {
    assert.equal(publish.args.at(-2), '--otp');
    assert.equal(publish.args.at(-1), otp);
    assert.equal(publish.args.filter((argument) => argument === otp).length, 1);
  }
  for (const call of calls) {
    assert(path.isAbsolute(call.cwd));
    assert.equal(call.options?.shell, false);
  }
  assert(!logs.join('\n').includes(otp));
  assert(!logs.join('\n').includes('touch /tmp/never'));
});

test('the release CLI exits nonzero on failure', () => {
  const result = spawnSync(
    process.execPath,
    [publishScript, '--context', 'angular', '--version', 'not-a-semver', '--prepare-only'],
    { encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid semver version/);
});
