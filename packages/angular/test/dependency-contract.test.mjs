import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';
import {
  BUILD_ONLY_PACKAGES,
  inventoryArtifactImports,
  validateArtifactDependencyContract,
} from '../dependency-contract.mjs';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function fixture(runtimeSource, declarationSource = '') {
  const directory = await mkdtemp(path.join(tmpdir(), 'angular-dependencies-'));
  temporaryDirectories.push(directory);
  await mkdir(path.join(directory, 'entry/fesm2022'), { recursive: true });
  await mkdir(path.join(directory, 'entry/types'), { recursive: true });
  await writeFile(path.join(directory, 'entry/fesm2022/entry.mjs'), runtimeSource);
  await writeFile(path.join(directory, 'entry/types/entry.d.ts'), declarationSource);
  return directory;
}

test('inventories bare runtime and declaration imports without matching comments', async () => {
  const directory = await fixture(
    `import '@angular/core';\nexport { cva } from 'class-variance-authority';\n// import 'not-a-package'\n`,
    `import type { ClassValue } from 'clsx';\nimport('@spartan-ng/brain/menu');\n`,
  );
  const imports = await inventoryArtifactImports(directory);
  assert.deepEqual([...imports.keys()], ['@angular/core', '@spartan-ng/brain', 'class-variance-authority', 'clsx']);
});

test('rejects undeclared imports and build-only published packages', async () => {
  const directory = await fixture(`import '@angular/core';\nimport 'clsx';\n`);
  await assert.rejects(
    validateArtifactDependencyContract(directory, {
      dependencies: { typescript: '^6.0.0' },
      peerDependencies: { '@angular/core': '^22.0.0' },
    }),
    /Undeclared artifact import clsx[\s\S]*Build-only package is present in published metadata: typescript/,
  );
});

test('real package metadata classifies the tested compatibility contract', async () => {
  const workspace = path.resolve(new URL('..', import.meta.url).pathname);
  const packageJson = JSON.parse(
    await (await import('node:fs/promises')).readFile(path.join(workspace, 'package.json'), 'utf8'),
  );
  const imports = await validateArtifactDependencyContract(path.join(workspace, 'dist'), packageJson);
  assert.deepEqual(
    [...imports.keys()],
    [
      '@angular/cdk',
      '@angular/common',
      '@angular/core',
      '@angular/forms',
      '@angular/router',
      '@ng-icons/core',
      '@ng-icons/lucide',
      '@ng-icons/tabler-icons',
      '@spartan-ng/brain',
      'class-variance-authority',
      'clsx',
      'embla-carousel',
      'embla-carousel-angular',
      'ngx-scrollbar',
      'ngx-sonner',
      'rxjs',
      'tailwind-merge',
    ],
  );
  assert.deepEqual(packageJson.peerDependencies, {
    '@angular/cdk': '>=22.0.0 <23.0.0',
    '@angular/common': '>=22.0.0 <23.0.0',
    '@angular/core': '>=22.0.0 <23.0.0',
    '@angular/forms': '>=22.0.0 <23.0.0',
    '@angular/router': '>=22.0.0 <23.0.0',
    '@ng-icons/core': '>=35.0.1 <36.0.0',
    '@spartan-ng/brain': '>=1.3.2 <2.0.0',
    rxjs: '>=7.8.0 <8.0.0',
  });
  assert.deepEqual(packageJson.dependencies, {
    '@ng-icons/lucide': '^35.0.1',
    '@ng-icons/tabler-icons': '^35.0.1',
    'class-variance-authority': '^0.7.0',
    clsx: '^2.1.1',
    'embla-carousel': '>=8.0.0 <9.0.0',
    'embla-carousel-angular': '^22.0.0',
    'ngx-scrollbar': '^19.1.5',
    'ngx-sonner': '^3.1.0',
    'tailwind-merge': '^3.6.0',
    tslib: '^2.3.0',
  });
  assert([...BUILD_ONLY_PACKAGES].every((name) => packageJson.dependencies?.[name] === undefined));
});
