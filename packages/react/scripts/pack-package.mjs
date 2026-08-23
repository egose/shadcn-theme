import assert from 'node:assert/strict';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = fileURLToPath(new URL('..', import.meta.url));
const distDirectory = path.join(packageDirectory, 'dist');
const artifactDirectory = path.join(packageDirectory, '.artifacts');

await rm(artifactDirectory, { recursive: true, force: true });
await mkdir(artifactDirectory, { recursive: true });

const packed = spawnSync(
  'npm',
  ['pack', '--json', '--ignore-scripts', '--pack-destination', artifactDirectory],
  {
    cwd: distDirectory,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_audit: 'false',
      npm_config_fund: 'false',
      npm_config_update_notifier: 'false',
    },
  },
);
assert.equal(packed.status, 0, `${packed.stdout}\n${packed.stderr}`.trim());

const artifacts = (await readdir(artifactDirectory)).filter((file) => file.endsWith('.tgz'));
assert.equal(artifacts.length, 1, `Expected one packed artifact, found: ${artifacts.join(', ')}`);
console.log(path.join(artifactDirectory, artifacts[0]));
