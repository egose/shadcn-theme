import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildAngularPackage, orderProjects, validateProjectMembership } from '../build-all.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.join(testDirectory, '..');
const fixtureWorkspace = path.join(testDirectory, 'fixtures/package-validator/workspace');
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function workspaceFixture() {
  const directory = await mkdtemp(path.join(tmpdir(), 'angular-build-all-'));
  temporaryDirectories.push(directory);
  await cp(fixtureWorkspace, directory, { recursive: true });
  return directory;
}

async function emitProject(workspace, project, declaration = `types/${project}.d.ts`) {
  const output = path.join(workspace, 'dist', project);
  await mkdir(path.join(output, path.dirname(declaration)), { recursive: true });
  await mkdir(path.join(output, 'fesm2022'), { recursive: true });
  await writeFile(path.join(output, declaration), `export declare const ${project}: string;\n`);
  await writeFile(path.join(output, `fesm2022/${project}.mjs`), `export const value = 'tw:${project}';\n`);
  await writeFile(
    path.join(output, 'package.json'),
    `${JSON.stringify({
      exports: { '.': { types: `./${declaration}`, default: `./fesm2022/${project}.mjs` } },
    })}\n`,
  );
}

test('the authoritative workspace project set includes menu everywhere', async () => {
  const projects = await validateProjectMembership(packageDirectory);
  assert.equal(projects.length, 71);
  assert(projects.includes('menu'));
});

test('dependency ordering is deterministic', () => {
  const dependencies = new Map([
    ['app', new Set(['zeta', 'alpha'])],
    ['zeta', new Set()],
    ['alpha', new Set()],
    ['other', new Set()],
  ]);
  assert.deepEqual(orderProjects(['zeta', 'other', 'app', 'alpha'], dependencies), ['alpha', 'other', 'zeta', 'app']);
});

test('dependency cycles report the cycle instead of appending projects', () => {
  const dependencies = new Map([
    ['alpha', new Set(['beta'])],
    ['beta', new Set(['alpha'])],
  ]);
  assert.throws(() => orderProjects(['beta', 'alpha'], dependencies), /alpha -> beta -> alpha/);
});

test('a failed project aggregates diagnostics and removes partial output', async () => {
  const workspace = await workspaceFixture();
  const calls = [];
  await assert.rejects(
    buildAngularPackage({
      workspaceDir: workspace,
      buildProject: async (root, project) => {
        calls.push(project);
        if (project === 'beta') throw new Error('injected failure');
        await emitProject(root, project);
      },
    }),
    (error) => {
      assert(error instanceof AggregateError);
      assert.match(error.message, /Failed to build 1 Angular project/);
      assert.match(error.errors[0].message, /beta: injected failure/);
      return true;
    },
  );
  assert.deepEqual(calls, ['alpha', 'beta']);
  await assert.rejects(readFile(path.join(workspace, 'dist', 'exports.json')), /ENOENT/);
});

test('exports use validated ng-packagr metadata and are written after all builds', async () => {
  const workspace = await workspaceFixture();
  const result = await buildAngularPackage({
    workspaceDir: workspace,
    buildProject: async (root, project) => {
      await emitProject(root, project, project === 'alpha' ? 'types/public-alpha.d.ts' : `types/${project}.d.ts`);
    },
  });
  assert.deepEqual(result.projects, ['alpha', 'beta']);
  assert.deepEqual(JSON.parse(await readFile(path.join(workspace, 'dist/exports.json'), 'utf8')), {
    './alpha': {
      types: './alpha/types/public-alpha.d.ts',
      default: './alpha/fesm2022/alpha.mjs',
    },
    './beta': {
      types: './beta/types/beta.d.ts',
      default: './beta/fesm2022/beta.mjs',
    },
  });
});

test('top-level errors exit nonzero', async () => {
  const workspace = await workspaceFixture();
  await writeFile(path.join(workspace, 'publishable-projects.json'), '{}');
  const script = path.join(workspace, 'build-all.mjs');
  await cp(path.join(packageDirectory, 'build-all.mjs'), script);
  await symlink(path.join(packageDirectory, 'node_modules'), path.join(workspace, 'node_modules'), 'dir');
  const result = spawnSync(process.execPath, [script], { cwd: workspace, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /publishable-projects\.json must be a non-empty array/);
});
