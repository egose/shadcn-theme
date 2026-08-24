import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { afterEach, test } from 'node:test';
import os from 'node:os';
import path from 'node:path';

import { enforceClientBoundaries } from '../prepend-use-client.mjs';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

test('enforces source-declared client boundaries in ESM and CommonJS only', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'react-client-boundaries-'));
  temporaryDirectories.push(directory);
  await mkdir(path.join(directory, 'hooks'), { recursive: true });
  await mkdir(path.join(directory, 'utils'), { recursive: true });
  await mkdir(path.join(directory, 'dist/hooks'), { recursive: true });
  await mkdir(path.join(directory, 'dist/utils'), { recursive: true });
  await writeFile(path.join(directory, 'hooks/use-value.ts'), '"use client";\nexport const value = 1;\n');
  await writeFile(path.join(directory, 'utils/value.ts'), 'export const value = 1;\n');

  for (const extension of ['js', 'mjs']) {
    await writeFile(path.join(directory, `dist/hooks/use-value.${extension}`), 'export const value = 1;\n');
    await writeFile(path.join(directory, `dist/utils/value.${extension}`), '"use client";\nexport const value = 1;\n');
  }

  await enforceClientBoundaries(directory);

  for (const extension of ['js', 'mjs']) {
    assert.match(await readFile(path.join(directory, `dist/hooks/use-value.${extension}`), 'utf8'), /^"use client";\n/);
    assert.doesNotMatch(await readFile(path.join(directory, `dist/utils/value.${extension}`), 'utf8'), /use client/);
  }
});

test('rejects a barrel that re-exports a client entry without its own boundary', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'react-client-barrel-'));
  temporaryDirectories.push(directory);
  await mkdir(path.join(directory, 'components/dialog'), { recursive: true });
  await mkdir(path.join(directory, 'dist/components/dialog'), { recursive: true });
  await writeFile(path.join(directory, 'components/dialog/client.ts'), '"use client";\nexport const client = true;\n');
  await writeFile(path.join(directory, 'components/dialog/index.ts'), "export { client } from './client';\n");

  await assert.rejects(
    enforceClientBoundaries(directory),
    /Client re-export entries must declare "use client": components\/dialog\/index/,
  );
});
