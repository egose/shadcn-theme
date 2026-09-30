import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { exampleDir, readInventory, validateInventory } from './check-inventory.mjs';
import { readCatalogSource } from './catalog-source.mjs';

const inventory = await readInventory();
const source = await readFile(path.join(exampleDir, 'src/app/catalog/catalog.ts'), 'utf8');

test('actual publishable inventory accounts for every visual project and all five workflows', () => {
  assert.match(validateInventory(inventory), /87 publishable projects = 86 component demos/);
  assert.deepEqual(
    inventory.entries.filter((entry) => entry.kind === 'example').map((entry) => entry.slug),
    ['pricing', 'team-management', 'settings', 'support-inbox', 'signup-flow'],
  );
});

for (const kind of ['component', 'example']) {
  for (const defect of ['missing', 'extra', 'duplicate']) {
    test(`${kind} catalog ${defect} is rejected`, () => {
      const changed = structuredClone(inventory);
      const index = changed.entries.findIndex((entry) => entry.kind === kind);
      if (defect === 'missing') changed.entries.splice(index, 1);
      if (defect === 'extra')
        changed.entries.push({ ...changed.entries[index], slug: 'orphan', title: 'Orphan', link: '/orphan' });
      if (defect === 'duplicate') changed.entries.push(changed.entries[index]);
      assert.throws(() => validateInventory(changed), /missing|extra|duplicate|baseline/);
    });
    test(`${kind} feature directory ${defect} is rejected`, () => {
      const changed = structuredClone(inventory);
      const directories = changed.featureDirectories[kind];
      if (defect === 'missing') directories.pop();
      if (defect === 'extra') directories.push('orphan');
      if (defect === 'duplicate') directories.push(directories[0]);
      assert.throws(() => validateInventory(changed), /missing|extra|duplicate/);
    });
  }
}

for (const field of ['projects', 'projectDirectories']) {
  for (const defect of ['missing', 'extra', 'duplicate']) {
    test(`${field} ${defect} is rejected without silent exclusions`, () => {
      const changed = structuredClone(inventory);
      if (defect === 'missing') changed[field].shift();
      if (defect === 'extra') changed[field].push('new-project');
      if (defect === 'duplicate') changed[field].push(changed[field][0]);
      assert.throws(() => validateInventory(changed), /missing|extra|duplicate/);
    });
  }
}

test('a newly published project requires a demo even if both package inventories agree', () => {
  const changed = structuredClone(inventory);
  changed.projects.push('new-project');
  changed.projectDirectories.push('new-project');
  assert.throws(() => validateInventory(changed), /component catalog: missing \[new-project\]/);
});

test('utils exemption requires nonvisual test evidence and cannot acquire a silently excluded demo', () => {
  const changed = structuredClone(inventory);
  changed.exemptionFiles.utils = false;
  assert.throws(() => validateInventory(changed), /Missing nonvisual coverage for utils/);
  changed.exemptionFiles.utils = true;
  changed.featureDirectories.component.push('utils');
  assert.throws(() => validateInventory(changed), /extra \[utils\]/);
});

test('missing route source is rejected even when directory membership agrees', () => {
  const changed = structuredClone(inventory);
  changed.routeFiles['/examples/signup-flow'] = false;
  assert.throws(() => validateInventory(changed), /Missing route source.*signup-flow/);
});

test('AST parser handles metadata before kind, reordered fields, comments, quotes and multiline loaders', () => {
  const changed = source
    .replace(
      "slug: 'pricing',\n    title: 'Pricing',\n    category: 'Product Flows',\n    kind: 'example',",
      '"kind": "example", /* metadata may move freely */\n category: "Product Flows",\n title: `Pricing`,\n slug: "pricing",',
    )
    .replace('export const CATALOG_ENTRIES: CatalogEntry[] = [', 'export const CATALOG_ENTRIES = ([')
    .replace(
      '];\n\nexport function catalogEntriesByKind',
      '] as const satisfies readonly CatalogEntry[]);\n\nexport function catalogEntriesByKind',
    );
  assert.notEqual(changed, source);
  assert.deepEqual(readCatalogSource(changed), readCatalogSource(source));
});

for (const [label, before, after, error] of [
  ['duplicate slug', "slug: 'pricing'", "slug: 'button'", /loader|duplicate/],
  ['duplicate property', "slug: 'pricing'", "slug: 'pricing', slug: 'pricing'", /duplicate property/],
  ['duplicate title', "title: 'Pricing'", "title: 'Button'", /duplicate/],
  ['missing metadata', "kind: 'example',", '', /kind must be/],
  ['dynamic metadata', "title: 'Pricing'", 'title: getTitle()', /literal string/],
  ['spread entry', "slug: 'pricing'", "...extra, slug: 'pricing'", /unsupported property/],
  ['unknown kind', "kind: 'example'", "kind: 'workflow'", /unknown kind/],
  ['wrong loader', '../pages/examples/pricing/pricing', '../pages/examples/settings/settings', /loader must import/],
  ['dynamic loader', "import('../pages/examples/pricing/pricing')", 'import(modulePath)', /literal string/],
  [
    'missing loader',
    "load: () => import('../pages/examples/pricing/pricing').then((m) => m.PricingExamplePage),",
    '',
    /load must/,
  ],
  ['lower than business baseline', 'REVIEWED_EXAMPLE_BASELINE = 5', 'REVIEWED_EXAMPLE_BASELINE = 6', /below baseline/],
]) {
  test(`AST parser fails closed on ${label}`, () => {
    assert(source.includes(before), `test mutation target absent: ${before}`);
    assert.throws(() => readCatalogSource(source.replace(before, after)), error);
  });
}
