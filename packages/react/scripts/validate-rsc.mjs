import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = fileURLToPath(new URL('..', import.meta.url));
const fixtureDirectory = path.join(packageDirectory, 'test-fixtures/rsc-consumer');
const exampleModules = path.join(packageDirectory, '@examples/nextjs/node_modules');
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'shadcn-theme-rsc-'));

try {
  await cp(fixtureDirectory, temporaryDirectory, { recursive: true });
  await mkdir(path.join(temporaryDirectory, 'node_modules/@egose'), { recursive: true });
  await mkdir(path.join(temporaryDirectory, 'node_modules/@types'), { recursive: true });
  await symlink(path.join(packageDirectory, 'dist'), path.join(temporaryDirectory, 'node_modules/@egose/shadcn-theme'), 'dir');
  for (const dependency of ['next', 'react', 'react-dom']) {
    await symlink(path.join(exampleModules, dependency), path.join(temporaryDirectory, 'node_modules', dependency), 'dir');
  }
  await symlink(
    path.join(packageDirectory, 'node_modules/typescript'),
    path.join(temporaryDirectory, 'node_modules/typescript'),
    'dir',
  );
  for (const dependency of ['node', 'react']) {
    await symlink(
      path.join(packageDirectory, `node_modules/@types/${dependency}`),
      path.join(temporaryDirectory, `node_modules/@types/${dependency}`),
      'dir',
    );
  }

  const nextBin = path.join(exampleModules, 'next/dist/bin/next');
  const build = spawnSync(process.execPath, [nextBin, 'build', temporaryDirectory, '--webpack'], {
    cwd: temporaryDirectory,
    encoding: 'utf8',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  });
  assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`.trim());

  const html = await readFile(path.join(temporaryDirectory, 'out/index.html'), 'utf8');
  const renderedHtml = html.replace(/<!--.*?-->/g, '');
  assert.match(renderedHtml, /server-safe rounded p-2/);
  assert.match(renderedHtml, /duration:1\.5/);
  assert.match(renderedHtml, /same-day:true/);
  console.log(
    'Built a Next.js Server Component against the staged package, rendered the dialog-manager client barrel, ' +
      'and verified server-rendered utility output.',
  );
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
