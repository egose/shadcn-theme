import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const subpathsStart = '<!-- BEGIN GENERATED SUBPATHS -->';
const subpathsEnd = '<!-- END GENERATED SUBPATHS -->';

test('README subpaths and compatibility are derived from package contracts', async () => {
  const [manifest, packageJson, readme] = await Promise.all([
    readFile(path.join(workspace, 'publishable-projects.json'), 'utf8').then(JSON.parse),
    readFile(path.join(workspace, 'package.json'), 'utf8').then(JSON.parse),
    readFile(path.join(workspace, 'README.md'), 'utf8'),
  ]);
  const documented = [
    ...readme
      .slice(readme.indexOf(subpathsStart) + subpathsStart.length, readme.indexOf(subpathsEnd))
      .matchAll(/`([a-z0-9-]+)`/g),
  ].map((match) => match[1]);

  assert.deepEqual(documented, manifest);
  for (const [name, range] of Object.entries(packageJson.peerDependencies)) {
    assert.ok(readme.includes(`| \`${name}\``), `README is missing peer ${name}`);
    assert.ok(readme.includes(`\`${range}\``), `README is missing peer range ${range}`);
  }
});

test('project readmes never recommend publishing an internal project output', async () => {
  const manifest = JSON.parse(await readFile(path.join(workspace, 'publishable-projects.json'), 'utf8'));
  for (const project of manifest) {
    const readme = await readFile(path.join(workspace, 'projects', project, 'README.md'), 'utf8');
    assert.doesNotMatch(readme, /npm publish|cd\s+dist\/|Publishing the Library/i, project);
  }
});

test('remediated source APIs exclude the internal helper and public any', async () => {
  const files = [
    'projects/button/src/lib/button.ts',
    'projects/form-text-input/src/lib/form-text-input.ts',
    'projects/layout-simple/src/lib/layout.ts',
    'projects/layout-simple/src/lib/mobile-menu-group.ts',
    'projects/layout-simple/src/lib/sidebar.ts',
    'projects/layout-simple/src/lib/user-menu.ts',
  ];
  const sources = await Promise.all(files.map((file) => readFile(path.join(workspace, file), 'utf8')));
  assert.doesNotMatch(sources.join('\n'), /\bSpreadAttrsDirective\b|:\s*any\b|<any>/);

  const confirmationApi = await readFile(
    path.join(workspace, 'projects/confirmation-dialog/src/public-api.ts'),
    'utf8',
  );
  assert.match(confirmationApi, /EgConfirmationDiaglog/);
  const confirmationSource = await readFile(
    path.join(workspace, 'projects/confirmation-dialog/src/lib/confirmation-dialog.ts'),
    'utf8',
  );
  assert.match(confirmationSource, /@deprecated[^]*export type EgConfirmationDiaglog = EgConfirmationDialog/);
});
