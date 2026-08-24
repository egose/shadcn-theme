import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { assertSourceExports } from './source-exports.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('selected source entrypoints expose the APIs exercised by browser tests', async () => {
  await assertSourceExports(path.join(root, 'projects/form-text-input/src/public-api.ts'), ['EgFormTextInput']);
  await assertSourceExports(path.join(root, 'projects/utils/src/public-api.ts'), [
    'classes',
    'hlm',
    'provideSpartanHlm',
  ]);
});

test('a deliberately broken source export fixture fails the contract check', async () => {
  await assert.rejects(
    assertSourceExports(path.join(root, 'test/fixtures/source-exports/broken-public-api.ts'), ['ExpectedExport']),
    /does not export: ExpectedExport/,
  );
});
