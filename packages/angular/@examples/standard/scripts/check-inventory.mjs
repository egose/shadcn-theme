import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCatalogSource } from './catalog-source.mjs';

export const exampleDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The only exemption is nonvisual, and its evidence must continue to exist.
export const NONVISUAL_PROJECTS = { utils: 'src/app/utils-usage.spec.ts' };

async function directories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  assert(!entries.some((entry) => entry.isSymbolicLink()), `Unexpected symlink in ${directory}`);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function readInventory() {
  const workspace = path.resolve(exampleDir, '../..');
  const registry = readCatalogSource(await readFile(path.join(exampleDir, 'src/app/catalog/catalog.ts'), 'utf8'));
  return {
    ...registry,
    projects: JSON.parse(await readFile(path.join(workspace, 'publishable-projects.json'), 'utf8')),
    projectDirectories: await directories(path.join(workspace, 'projects')),
    featureDirectories: Object.fromEntries(
      await Promise.all(
        Object.entries(registry.kindPaths).map(async ([kind, folder]) => [
          kind,
          await directories(path.join(exampleDir, 'src/app/pages', folder)),
        ]),
      ),
    ),
    routeFiles: Object.fromEntries(
      await Promise.all(
        registry.entries.map(async (entry) => [
          entry.link,
          await isFile(path.resolve(exampleDir, 'src/app/catalog', `${entry.module}.ts`)),
        ]),
      ),
    ),
    exemptionFiles: Object.fromEntries(
      await Promise.all(
        Object.entries(NONVISUAL_PROJECTS).map(async ([slug, file]) => [
          slug,
          await isFile(path.join(exampleDir, file)),
        ]),
      ),
    ),
  };
}

function names(values, label) {
  assert(Array.isArray(values) && values.length > 0, `${label} must be a nonempty array`);
  assert(
    values.every((value) => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value)),
    `${label}: invalid names`,
  );
  assert.equal(new Set(values).size, values.length, `${label}: duplicate names`);
}

function same(expected, actual, label) {
  const missing = expected.filter((name) => !actual.includes(name));
  const extra = actual.filter((name) => !expected.includes(name));
  assert(
    missing.length === 0 && extra.length === 0,
    `${label}: missing [${missing.join(', ')}]; extra [${extra.join(', ')}]`,
  );
}

export function validateInventory(inventory) {
  const { entries, projects, projectDirectories, featureDirectories, routeFiles, exemptionFiles } = inventory;
  names(projects, 'publishable projects');
  names(projectDirectories, 'project directories');
  same(projects, projectDirectories, 'project directories');
  names(
    entries.map((entry) => entry.slug),
    'catalog',
  );
  for (const field of ['title', 'link'])
    assert.equal(new Set(entries.map((entry) => entry[field])).size, entries.length, `catalog: duplicate ${field}`);
  assert(
    entries.every((entry) => Object.hasOwn(inventory.kindPaths, entry.kind)),
    'Unknown catalog kind',
  );
  const exemptions = Object.keys(NONVISUAL_PROJECTS);
  for (const slug of exemptions) {
    assert(projects.includes(slug), `Obsolete nonvisual exemption: ${slug}`);
    assert(exemptionFiles[slug], `Missing nonvisual coverage for ${slug}`);
  }
  same(
    projects.filter((slug) => !exemptions.includes(slug)),
    entries.filter((entry) => entry.kind === 'component').map((entry) => entry.slug),
    'component catalog',
  );
  for (const kind of Object.keys(inventory.kindPaths)) {
    const slugs = entries.filter((entry) => entry.kind === kind).map((entry) => entry.slug);
    assert(slugs.length >= inventory.baselines[kind], `${kind} count below reviewed baseline`);
    names(featureDirectories[kind], `${kind} directories`);
    same(slugs, featureDirectories[kind], `${kind} directories`);
  }
  for (const entry of entries) assert(routeFiles[entry.link], `Missing route source for ${entry.link}`);
  return `${projects.length} publishable projects = ${entries.filter((entry) => entry.kind === 'component').length} component demos + utils (nonvisual); ${featureDirectories.example.length} business workflows`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`inventory: PASS — ${validateInventory(await readInventory())}`);
}
