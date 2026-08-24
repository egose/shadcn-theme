#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateArtifactDependencyContract } from './dependency-contract.mjs';

const PLAIN_PACKAGE = '@egose/shadcn-theme-ng';
const VARIANTS = new Map([
  ['plain', PLAIN_PACKAGE],
  ['tw', `${PLAIN_PACKAGE}-tw`],
]);
const ROOT_FILES = new Set(['LICENSE', 'README.md', 'package.json']);
const REQUIRED_METADATA = [
  'name',
  'version',
  'description',
  'license',
  'author',
  'sideEffects',
  'repository',
  'engines',
  'exports',
];
const SUBPATHS_START = '<!-- BEGIN GENERATED SUBPATHS -->';
const SUBPATHS_END = '<!-- END GENERATED SUBPATHS -->';

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read JSON ${file}: ${error.message}`);
  }
}

async function filesBelow(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await filesBelow(path.join(directory, entry.name), relative)));
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files.sort();
}

function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function compareSets(errors, canonical, actual, label) {
  const missing = setDifference(canonical, actual);
  const unexpected = setDifference(actual, canonical);
  if (missing.length) errors.push(`${label} is missing: ${missing.join(', ')}`);
  if (unexpected.length) errors.push(`${label} has unexpected entries: ${unexpected.join(', ')}`);
}

function projectNameFromExport(key) {
  return /^\.\/([^/]+)$/.exec(key)?.[1];
}

function documentedSubpaths(readme, errors) {
  const start = readme.indexOf(SUBPATHS_START);
  const end = readme.indexOf(SUBPATHS_END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push('README.md must contain the generated subpath markers');
    return new Set();
  }
  return new Set(
    [...readme.slice(start + SUBPATHS_START.length, end).matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]),
  );
}

function validateReadme(errors, readme, projects, exportsMap, packageJson) {
  compareSets(errors, projects, documentedSubpaths(readme, errors), 'README documented subpaths');

  const documentedImports = [...readme.matchAll(/from\s+['"](@egose\/shadcn-theme-ng(?:-tw)?)\/([^'"]+)['"]/g)];
  if (!documentedImports.length) errors.push('README.md must contain canonical package imports');
  for (const [, packageName, project] of documentedImports) {
    if (!VARIANTS.has(packageName === PLAIN_PACKAGE ? 'plain' : packageName === `${PLAIN_PACKAGE}-tw` ? 'tw' : '')) {
      errors.push(`README.md contains unsupported package import: ${packageName}/${project}`);
    }
    if (!exportsMap[`./${project}`]) errors.push(`README.md import does not resolve: ${packageName}/${project}`);
  }

  for (const [name, range] of Object.entries(packageJson.peerDependencies ?? {})) {
    if (!readme.includes(`\`${name}\``) || !readme.includes(`\`${range}\``)) {
      errors.push(`README.md does not document peer ${name} at ${range}`);
    }
  }
}

function validatePackFiles(expectedFiles, output) {
  let result;
  try {
    result = JSON.parse(output);
  } catch (error) {
    throw new Error(`npm pack returned invalid JSON: ${error.message}`);
  }
  const packed = new Set((result[0]?.files ?? []).map(({ path: file }) => file));
  const expected = new Set(expectedFiles);
  const missing = setDifference(expected, packed);
  const unexpected = setDifference(packed, expected);
  if (missing.length || unexpected.length) {
    const details = [];
    if (missing.length) details.push(`missing: ${missing.join(', ')}`);
    if (unexpected.length) details.push(`unexpected: ${unexpected.join(', ')}`);
    throw new Error(`npm pack file list differs from staged files (${details.join('; ')})`);
  }
}

export async function validateStagedAngularPackage({ workspaceDir, packageDir, variant }) {
  const expectedPackageName = VARIANTS.get(variant);
  if (!expectedPackageName) throw new Error(`Variant must be one of: ${[...VARIANTS.keys()].join(', ')}`);

  const workspace = path.resolve(workspaceDir);
  const staged = path.resolve(packageDir);
  const errors = [];
  const manifest = await readJson(path.join(workspace, 'publishable-projects.json'));
  const sourceProjects = new Set(manifest);
  if (!sourceProjects.size) errors.push('Canonical source project set is empty');
  if (!Array.isArray(manifest) || sourceProjects.size !== manifest.length) {
    errors.push('publishable-projects.json must contain unique project names');
  }
  const sourceEntries = await readdir(path.join(workspace, 'projects'), { withFileTypes: true });
  const projectDirectories = new Set(sourceEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  compareSets(errors, sourceProjects, projectDirectories, 'project directories');
  for (const project of sourceProjects) {
    for (const required of ['ng-package.json', 'src/public-api.ts']) {
      if (!existsSync(path.join(workspace, 'projects', project, required))) {
        errors.push(`Source project ${project} is missing ${required}`);
      }
    }
  }

  const angular = await readJson(path.join(workspace, 'angular.json'));
  const angularProjects = new Set(Object.keys(angular.projects ?? {}));
  compareSets(errors, sourceProjects, angularProjects, 'angular.json projects');

  const tsconfig = await readJson(path.join(workspace, 'tsconfig.json'));
  const pathProjects = new Set();
  for (const [alias, targets] of Object.entries(tsconfig.compilerOptions?.paths ?? {})) {
    if (!alias.startsWith(`${PLAIN_PACKAGE}/`)) continue;
    const name = alias.slice(PLAIN_PACKAGE.length + 1);
    pathProjects.add(name);
    const expectedTarget = `./projects/${name}/src/public-api.ts`;
    if (!Array.isArray(targets) || targets.length !== 1 || targets[0] !== expectedTarget) {
      errors.push(`TypeScript path ${alias} must target ${expectedTarget}`);
    }
  }
  compareSets(errors, sourceProjects, pathProjects, 'TypeScript paths');

  const packageJsonPath = path.join(staged, 'package.json');
  const packageJson = await readJson(packageJsonPath);
  for (const field of REQUIRED_METADATA) {
    if (packageJson[field] === undefined || packageJson[field] === null || packageJson[field] === '') {
      errors.push(`package.json is missing metadata field: ${field}`);
    }
  }
  if (packageJson.name !== expectedPackageName) {
    errors.push(`Package name must be ${expectedPackageName}, found ${packageJson.name ?? '<absent>'}`);
  }

  const exportsMap = packageJson.exports && typeof packageJson.exports === 'object' ? packageJson.exports : {};
  const exportProjects = new Set();
  for (const [key, target] of Object.entries(exportsMap)) {
    const name = projectNameFromExport(key);
    if (!name) {
      errors.push(`Unexpected export key: ${key}`);
      continue;
    }
    exportProjects.add(name);
    if (!target || typeof target !== 'object') {
      errors.push(`Export ${key} must define types and default targets`);
      continue;
    }
    for (const condition of ['types', 'default']) {
      const relativeTarget = target[condition];
      if (typeof relativeTarget !== 'string' || !relativeTarget.startsWith('./')) {
        errors.push(`Export ${key} has invalid ${condition} target`);
      } else if (!existsSync(path.join(staged, relativeTarget))) {
        errors.push(`Export ${key} ${condition} target does not exist: ${relativeTarget}`);
      }
    }
  }
  compareSets(errors, sourceProjects, exportProjects, 'package exports');

  const readme = await readFile(path.join(staged, 'README.md'), 'utf8');
  validateReadme(errors, readme, sourceProjects, exportsMap, packageJson);

  for (const project of sourceProjects) {
    const projectReadme = await readFile(path.join(workspace, 'projects', project, 'README.md'), 'utf8');
    if (/npm publish|cd\s+dist\/|Publishing the Library/i.test(projectReadme)) {
      errors.push(`projects/${project}/README.md instructs publishing an internal build directory`);
    }
  }

  const stagedEntries = await readdir(staged, { withFileTypes: true });
  const outputProjects = new Set(stagedEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  compareSets(errors, sourceProjects, outputProjects, 'staged project outputs');
  if (existsSync(path.join(staged, 'exports.json'))) errors.push('Staged package leaks exports.json');

  const stagedFiles = await filesBelow(staged);
  for (const required of ROOT_FILES) {
    if (!stagedFiles.includes(required)) errors.push(`Staged package is missing required file: ${required}`);
  }
  const unexpectedFiles = [];
  for (const file of stagedFiles) {
    const [project, ...restParts] = file.split('/');
    if (ROOT_FILES.has(file)) continue;
    if (!sourceProjects.has(project)) {
      unexpectedFiles.push(file);
      continue;
    }
    const rest = restParts.join('/');
    const allowed =
      rest === 'package.json' ||
      rest === 'README.md' ||
      rest === `fesm2022/${project}.mjs` ||
      (rest.startsWith('types/') && rest.endsWith('.d.ts'));
    if (!allowed) unexpectedFiles.push(file);
  }
  if (unexpectedFiles.length) errors.push(`Unexpected package files: ${unexpectedFiles.join(', ')}`);

  const selfImportPattern = /@egose\/shadcn-theme-ng(?:-tw)?(?=\/)/g;
  for (const file of stagedFiles.filter((name) => name.endsWith('.mjs') || name.endsWith('.d.ts'))) {
    const content = await readFile(path.join(staged, file), 'utf8');
    if (file.endsWith('.mjs') && /sourceMappingURL=/.test(content)) {
      errors.push(`${file} references an excluded source map`);
    }
    for (const match of content.matchAll(selfImportPattern)) {
      if (match[0] !== expectedPackageName) {
        errors.push(`${file} contains wrong package identity ${match[0]}; expected ${expectedPackageName}`);
      }
    }
    const authoredDeclaration = content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^.*static ɵ.*$/gm, '')
      .replace(/\b(?:_angular_core|i0)\.Type<any>/g, 'unknown')
      .replace(/readonly any\[\]/g, 'readonly unknown[]');
    if (file.endsWith('.d.ts') && /\bany\b/.test(authoredDeclaration)) {
      errors.push(`${file} contains avoidable public any`);
    }
    if (file.endsWith('.d.ts') && /\bSpreadAttrsDirective\b/.test(content)) {
      errors.push(`${file} exposes internal SpreadAttrsDirective`);
    }
  }

  if (sourceProjects.has('confirmation-dialog')) {
    const declarationTarget = exportsMap['./confirmation-dialog']?.types;
    const declaration = declarationTarget && (await readFile(path.join(staged, declarationTarget), 'utf8'));
    if (declaration && !/\bEgConfirmationDialog\b/.test(declaration)) {
      errors.push('confirmation-dialog declaration is missing EgConfirmationDialog');
    }
    if (declaration && !/@deprecated[^]*\bEgConfirmationDiaglog\b/.test(declaration)) {
      errors.push('confirmation-dialog declaration is missing the deprecated EgConfirmationDiaglog migration alias');
    }
  }

  for (const file of stagedFiles.filter((name) => name === 'package.json' || name.endsWith('/package.json'))) {
    const content = await readFile(path.join(staged, file), 'utf8');
    if (/PLACEHOLDER/i.test(content)) errors.push(`${file} contains a placeholder`);
  }

  try {
    await validateArtifactDependencyContract(staged, packageJson);
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length) throw new Error(`Angular package validation failed:\n- ${errors.join('\n- ')}`);

  const packed = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: staged,
    encoding: 'utf8',
    env: { ...process.env, npm_config_update_notifier: 'false' },
  });
  if (packed.status !== 0) {
    throw new Error(`npm pack --dry-run failed (${packed.status}): ${packed.stderr.trim()}`);
  }
  validatePackFiles(stagedFiles, packed.stdout);
  return { packageName: expectedPackageName, projects: sourceProjects.size, files: stagedFiles.length };
}

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    if (!key?.startsWith('--') || argv[index + 1] === undefined) {
      throw new Error('Usage: node validate-package.mjs --workspace <dir> --package <dir> --variant <plain|tw>');
    }
    options[key.slice(2)] = argv[index + 1];
  }
  if (!options.workspace || !options.package || !options.variant) {
    throw new Error('Usage: node validate-package.mjs --workspace <dir> --package <dir> --variant <plain|tw>');
  }
  return { workspaceDir: options.workspace, packageDir: options.package, variant: options.variant };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await validateStagedAngularPackage(parseArguments(process.argv.slice(2)));
    console.log(`Validated ${result.packageName}: ${result.projects} projects, ${result.files} packed files`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
