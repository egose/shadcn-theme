import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';
import { buildAngularPackage, transformJavaScriptClasses, transformTailwindClassList } from '../build-all.mjs';
import { validateStagedAngularPackage } from '../validate-package.mjs';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function workspaceFixture() {
  const directory = await mkdtemp(path.join(tmpdir(), 'angular-variants-'));
  temporaryDirectories.push(directory);
  await cp(new URL('./fixtures/package-validator/workspace/', import.meta.url), directory, { recursive: true });
  return directory;
}

async function emitRepresentativeProject(workspace, project) {
  const output = path.join(workspace, 'dist', project);
  await mkdir(path.join(output, 'fesm2022'), { recursive: true });
  await mkdir(path.join(output, 'types'), { recursive: true });
  const dependency = project === 'alpha' ? 'beta' : 'alpha';
  await writeFile(
    path.join(output, `fesm2022/${project}.mjs`),
    `import '@egose/shadcn-theme-ng/${dependency}';\n` +
      `const render = { template: '<div class="flex tw:items-center sm:block"></div>' };\n` +
      `classes(() => 'relative tw:gap-2 hover:text-foreground');\n` +
      `export { render };\n//# sourceMappingURL=${project}.mjs.map\n`,
  );
  await writeFile(path.join(output, `fesm2022/${project}.mjs.map`), '{}\n');
  await writeFile(
    path.join(output, `types/${project}.d.ts`),
    `import '@egose/shadcn-theme-ng/${dependency}';\nexport declare const ${project}: true;\n`,
  );
  await writeFile(
    path.join(output, 'package.json'),
    `${JSON.stringify({
      exports: { '.': { types: `./types/${project}.d.ts`, default: `./fesm2022/${project}.mjs` } },
    })}\n`,
  );
}

async function finalizeStagedFixture(stage, variant) {
  const fixtureRoot = new URL('./fixtures/package-validator/staged/', import.meta.url);
  const exportsMap = JSON.parse(await readFile(path.join(stage, 'exports.json'), 'utf8'));
  await unlink(path.join(stage, 'exports.json'));
  await cp(new URL('LICENSE', fixtureRoot), path.join(stage, 'LICENSE'));
  await cp(new URL('README.md', fixtureRoot), path.join(stage, 'README.md'));
  const packageJson = JSON.parse(await readFile(new URL('package.json', fixtureRoot), 'utf8'));
  packageJson.name = variant === 'tw' ? '@egose/shadcn-theme-ng-tw' : '@egose/shadcn-theme-ng';
  packageJson.exports = exportsMap;
  await writeFile(path.join(stage, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
}

test('representative pagination, radio, and carousel classes render for both variants', () => {
  const classes =
    'flex tw:items-center justify-between px-4 group relative data-[disabled=true]:opacity-50 overflow-hidden';
  const plain = transformTailwindClassList(classes);
  assert.equal(
    plain,
    'flex items-center justify-between px-4 group relative data-[disabled=true]:opacity-50 overflow-hidden',
  );
  assert.doesNotMatch(plain, /(?:^|\s)tw:/);

  const prefixed = transformTailwindClassList(classes, 'tw');
  assert.equal(
    prefixed,
    'tw:flex tw:items-center tw:justify-between tw:px-4 tw:group tw:relative tw:data-[disabled=true]:opacity-50 tw:overflow-hidden',
  );
  assert(prefixed.split(/\s+/).every((token) => token.startsWith('tw:')));
});

test('JavaScript transformation is syntax-aware and leaves non-class strings unchanged', () => {
  const source = `const direction = 'relative'; const view = { template: '<div class="relative tw:flex"></div>' };`;
  const transformed = transformJavaScriptClasses(source, 'tw');
  assert.match(transformed, /direction = 'relative'/);
  assert.match(transformed, /class=\\"tw:relative tw:flex\\"/);
});

test('plain and tw artifacts stage independently with runtime and declaration identity', async () => {
  const workspace = await workspaceFixture();
  const stages = path.join(workspace, '..', 'stages');
  const buildProject = (root, project) => emitRepresentativeProject(root, project);

  await buildAngularPackage({ workspaceDir: workspace, stageDir: path.join(stages, 'plain'), buildProject });
  await buildAngularPackage({ workspaceDir: workspace, bundle: 'tw', stageDir: path.join(stages, 'tw'), buildProject });
  await finalizeStagedFixture(path.join(stages, 'plain'), 'plain');
  await finalizeStagedFixture(path.join(stages, 'tw'), 'tw');

  const plainRuntime = await readFile(path.join(stages, 'plain/alpha/fesm2022/alpha.mjs'), 'utf8');
  const twRuntime = await readFile(path.join(stages, 'tw/alpha/fesm2022/alpha.mjs'), 'utf8');
  const plainTypes = await readFile(path.join(stages, 'plain/alpha/types/alpha.d.ts'), 'utf8');
  const twTypes = await readFile(path.join(stages, 'tw/alpha/types/alpha.d.ts'), 'utf8');

  assert.match(plainRuntime, /@egose\/shadcn-theme-ng\/beta/);
  assert.doesNotMatch(plainRuntime, /tw:(?:flex|items-center|gap-2|relative)/);
  assert.match(twRuntime, /@egose\/shadcn-theme-ng-tw\/beta/);
  for (const utility of ['flex', 'items-center', 'sm:block', 'relative', 'gap-2', 'hover:text-foreground']) {
    assert(twRuntime.includes(`tw:${utility}`));
  }
  assert.match(plainTypes, /@egose\/shadcn-theme-ng\/beta/);
  assert.match(twTypes, /@egose\/shadcn-theme-ng-tw\/beta/);
  await assert.rejects(readFile(path.join(stages, 'plain/alpha/fesm2022/alpha.mjs.map')), /ENOENT/);
  await assert.rejects(readFile(path.join(stages, 'tw/alpha/fesm2022/alpha.mjs.map')), /ENOENT/);
  assert.doesNotMatch(plainRuntime, /sourceMappingURL/);
  assert.doesNotMatch(twRuntime, /sourceMappingURL/);
  await validateStagedAngularPackage({
    workspaceDir: workspace,
    packageDir: path.join(stages, 'plain'),
    variant: 'plain',
  });
  await validateStagedAngularPackage({ workspaceDir: workspace, packageDir: path.join(stages, 'tw'), variant: 'tw' });
});
