import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { afterEach, test } from 'node:test';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validatePackage } from './validate-package.mjs';

const fixture = fileURLToPath(new URL('../test-fixtures/package-valid', import.meta.url));
const temporaryDirectories = [];

async function copyFixture() {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'react-package-validator-'));
  temporaryDirectories.push(temporaryDirectory);
  await cp(fixture, temporaryDirectory, { recursive: true });
  return temporaryDirectory;
}

async function editPackage(directory, edit) {
  const packagePath = path.join(directory, 'package.json');
  const packageData = JSON.parse(await readFile(packagePath, 'utf8'));
  edit(packageData);
  await writeFile(packagePath, `${JSON.stringify(packageData, null, 2)}\n`);
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

test('accepts a valid staged package including wildcard exports and npm files', async () => {
  const directory = await copyFixture();
  const result = await validatePackage(directory);
  assert.deepEqual(result, {
    exports: 3,
    runtimeTargets: 4,
    declarationTargets: 4,
    packedFiles: 11,
    typeScriptConsumers: 2,
  });
});

test('rejects a missing runtime target', async () => {
  const directory = await copyFixture();
  await rm(path.join(directory, 'features/alpha.mjs'));
  await assert.rejects(validatePackage(directory), /missing target \.\/features\/alpha\.mjs/);
});

test('rejects a missing declaration target', async () => {
  const directory = await copyFixture();
  await rm(path.join(directory, 'entry.d.mts'));
  await assert.rejects(validatePackage(directory), /missing target \.\/entry\.d\.mts/);
});

test('rejects ESM declarations exposed to a CommonJS TypeScript consumer', async () => {
  const directory = await copyFixture();
  await editPackage(directory, (packageData) => {
    packageData.exports['.'].require.types = './entry.d.mts';
  });
  await assert.rejects(
    validatePackage(directory),
    (error) =>
      /require types must target \.d\.ts/.test(error.message) &&
      /staged ESM\/CommonJS TypeScript consumers failed to compile/.test(error.message) &&
      /TS1471/.test(error.message),
  );
});

test('rejects a runtime target that Node cannot load', async () => {
  const directory = await copyFixture();
  await writeFile(path.join(directory, 'entry.mjs'), "import './missing-dependency.mjs';\n");
  await assert.rejects(
    validatePackage(directory),
    /\. \[import\] failed to load: Error \[ERR_MODULE_NOT_FOUND\]/,
  );
});

test('rejects placeholder metadata', async () => {
  const directory = await copyFixture();
  await editPackage(directory, (packageData) => {
    packageData.version = '0.0.0-PLACEHOLDER';
  });
  await assert.rejects(validatePackage(directory), /metadata contains a placeholder/);
});

test('rejects missing required metadata', async () => {
  const directory = await copyFixture();
  await editPackage(directory, (packageData) => {
    delete packageData.license;
  });
  await assert.rejects(validatePackage(directory), /missing required metadata: license/);
});

test('rejects internal files included by npm pack', async () => {
  const directory = await copyFixture();
  await writeFile(path.join(directory, 'internal.ts'), 'export const secret = true;\n');
  await editPackage(directory, (packageData) => packageData.files.push('internal.ts'));
  await assert.rejects(validatePackage(directory), /npm pack leaked internal file: internal\.ts/);
});
