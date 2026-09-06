// ANGEX-07 example consumer boundary: source aliases, dependency contract,
// import hygiene, and Tailwind prefix semantics for the standard example.
//
// Run: `pnpm --dir packages/angular test:example-boundary`
// Wired into `.github/workflows/test.yml` alongside the other targeted
// Angular source tests.
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  PLAIN_PACKAGE,
  aliasTarget,
  readSourceOfTruth,
  renderGeneratedModule,
  renderPathsBlock,
} from '../@examples/standard/scripts/sync-example-aliases.mjs';

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const example = path.join(workspace, '@examples/standard');
const exampleSource = path.join(example, 'src');

async function filesBelow(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.angular') continue;
    if (entry.isDirectory()) files.push(...(await filesBelow(file, extensions)));
    else if (entry.isFile() && extensions.some((extension) => file.endsWith(extension))) files.push(file);
  }
  return files.sort();
}

function extractStaticImports(source) {
  return [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

test('example aliases are generated from publishable-projects.json and target source', async () => {
  const projects = await readSourceOfTruth(workspace);
  assert(projects.includes('menu'), 'menu must be a publishable project');

  const tsconfig = await readFile(path.join(example, 'tsconfig.json'), 'utf8');
  const anchor = '"paths": {';
  const start = tsconfig.indexOf(anchor);
  assert.notEqual(start, -1, 'example tsconfig.json must declare source aliases');
  const expectedBlock = renderPathsBlock(projects);
  assert(tsconfig.includes(expectedBlock), 'example tsconfig paths are stale: run `pnpm sync:aliases`');

  // Every alias must resolve to package source, never to stale dist output.
  for (const project of projects) {
    assert(tsconfig.includes(`"${PLAIN_PACKAGE}/${project}": ["${aliasTarget(project)}"]`));
    assert(!tsconfig.includes(`"./dist/${project}"`), `alias for ${project} must not consume stale dist`);
  }

  const generated = await readFile(path.join(exampleSource, 'app', 'example-subpaths.generated.ts'), 'utf8');
  assert.equal(generated, renderGeneratedModule(projects), 'generated subpath module is stale: run `pnpm sync:aliases`');
});

test('example source respects the public import boundary', async () => {
  const projects = new Set(await readSourceOfTruth(workspace));
  const files = await filesBelow(exampleSource, ['.ts', '.html', '.css']);
  assert(files.length > 0, 'example source scan found no files');
  const violations = [];
  for (const file of files) {
    const relative = path.relative(example, file);
    if (relative === path.join('app', 'example-subpaths.generated.ts')) continue;
    const source = await readFile(file, 'utf8');
    for (const specifier of extractStaticImports(source)) {
      if (specifier === PLAIN_PACKAGE) {
        violations.push(`${relative}: bare package root import (use an explicit public subpath)`);
        continue;
      }
      if (specifier === `${PLAIN_PACKAGE}-tw` || specifier.startsWith(`${PLAIN_PACKAGE}-tw/`)) {
        violations.push(`${relative}: variant package import ${specifier} (tarball consumers only)`);
        continue;
      }
      if (specifier.startsWith(`${PLAIN_PACKAGE}/`)) {
        const subpath = specifier.slice(PLAIN_PACKAGE.length + 1);
        const [project, ...rest] = subpath.split('/');
        if (!projects.has(project)) {
          violations.push(`${relative}: unregistered package subpath ${specifier}`);
        } else if (rest.length > 0) {
          violations.push(`${relative}: private deep import ${specifier} (use the public subpath)`);
        }
        continue;
      }
      if (/(^|\/)dist\//.test(specifier) || specifier.includes('/src/lib')) {
        violations.push(`${relative}: private build/source import ${specifier}`);
        continue;
      }
      if (specifier.includes('node_modules') || specifier.includes('/projects/')) {
        violations.push(`${relative}: source reach-through ${specifier} (use the public subpath alias)`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test('example manifest declares every directly imported third-party package', async () => {
  const manifest = JSON.parse(await readFile(path.join(example, 'package.json'), 'utf8'));
  const declaredRuntime = new Set(Object.keys(manifest.dependencies ?? {}));
  const declaredDev = new Set(Object.keys(manifest.devDependencies ?? {}));
  const declared = new Set([...declaredRuntime, ...declaredDev]);

  const files = await filesBelow(exampleSource, ['.ts']);
  const importedRoots = new Set();
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    for (const specifier of extractStaticImports(source)) {
      if (specifier.startsWith('.') || specifier.startsWith(PLAIN_PACKAGE)) continue;
      const root = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
      importedRoots.add(root);
    }
  }
  // @angular/core/testing ships inside @angular/core; every other root is its own contract entry.
  const required = [...importedRoots].filter((root) => root !== '@angular/core/testing');
  assert(required.length > 0, 'example source scan found no third-party imports');
  const missing = required.filter((root) => !declared.has(root));
  assert.deepEqual(missing, [], 'direct imports missing from the example manifest');

  // Runtime imports belong in dependencies (application convention); the
  // framework, icons, Spartan, and ngx runtime surface must not hide in devDependencies.
  for (const root of ['@angular/common', '@angular/core', '@angular/forms', '@angular/platform-browser', '@angular/router', '@ng-icons/core', '@ng-icons/lucide', '@ng-icons/tabler-icons', '@spartan-ng/brain', 'ngx-scrollbar', 'ngx-sonner']) {
    assert(importedRoots.has(root), `expected the example to import ${root} directly`);
    assert(declaredRuntime.has(root), `${root} is a runtime import and belongs in dependencies`);
  }
  assert(declaredRuntime.has('rxjs'), 'rxjs belongs in dependencies as the Angular runtime peer');
  assert(declaredRuntime.has('tslib'), 'tslib belongs in dependencies (importHelpers)');
});

test('source-mode Tailwind scanning keeps the tw prefix without dist input', async () => {
  const styles = await readFile(path.join(exampleSource, 'styles.css'), 'utf8');
  assert.match(styles, /@import 'tailwindcss' prefix\(tw\)/);
  assert.match(styles, /@import 'tw-animate-css' prefix\(tw\)/);
  assert.match(styles, /@source "\.\.\/\.\.\/\.\.\/projects"/, 'source mode must scan package source');
  assert.doesNotMatch(styles, /@source[^;]*dist/, 'source mode must not scan stale dist output');
  for (const match of styles.matchAll(/@apply\s+([^;]+);/g)) {
    for (const token of match[1].trim().split(/\s+/)) {
      assert.match(token, /^tw:/, `source-mode utility must keep the tw: prefix: ${token}`);
    }
  }
});

test('isolated consumers prove representative example imports against both tarballs', async () => {
  const consumers = await readFile(path.join(workspace, 'test', 'isolated-consumers.mjs'), 'utf8');
  assert.match(consumers, /\['plain', 'tw'\]/, 'isolated consumers must stage both variants');
  for (const subpath of ['button', 'menu', 'dialog', 'carousel', 'form-text-input', 'layout-simple', 'sonner', 'sheet', 'table', 'tabs', 'input']) {
    assert(consumers.includes(`/${subpath}`), `isolated consumer must exercise representative subpath ${subpath}`);
  }
  assert.match(consumers, /tw:inline-flex/, '-tw consumer must assert retained tw: classes');
  assert.match(consumers, /inline-flex/, 'plain consumer must assert unprefixed output');
  assert(consumers.includes('styles.css'), 'isolated consumer must verify Tailwind scanning through a built stylesheet');
});
