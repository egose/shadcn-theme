import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { readdir, rm, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import fse from 'fs-extra';

const [, , bundle] = process.argv;

const projectDir = './projects';
const tsconfigPath = path.resolve('./tsconfig.json');

/**
 * Recursively get all files from a directory
 * @param {string} dir - directory path
 * @returns {Promise<string[]>} array of file paths
 */
async function getAllFiles(dir) {
  let files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getAllFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function getProjectDependencies(name, knownProjects, pkgName) {
  const srcDir = join(projectDir, name, 'src');
  const files = await getAllFiles(srcDir);
  const deps = new Set();
  const importRegex = new RegExp(`${pkgName}/([a-z0-9-]+)`, 'g');

  for (const file of files) {
    if (!file.endsWith('.ts')) continue;

    const content = await readFile(file, 'utf8');
    let match;

    while ((match = importRegex.exec(content))) {
      const dep = match[1];
      if (dep !== name && knownProjects.has(dep)) deps.add(dep);
    }
  }

  return deps;
}

async function sortProjectsForBuild(projects, pkgName) {
  const projectSet = new Set(projects);
  const dependencyMap = new Map();
  const inverseDependencyMap = new Map();

  for (const name of projects) {
    const deps = await getProjectDependencies(name, projectSet, pkgName);
    dependencyMap.set(name, deps);

    for (const dep of deps) {
      if (!inverseDependencyMap.has(dep)) inverseDependencyMap.set(dep, new Set());
      inverseDependencyMap.get(dep).add(name);
    }
  }

  const ready = projects.filter((name) => dependencyMap.get(name).size === 0).sort();
  const ordered = [];

  while (ready.length > 0) {
    const name = ready.shift();
    ordered.push(name);

    for (const dependent of inverseDependencyMap.get(name) ?? []) {
      const remaining = dependencyMap.get(dependent);
      remaining.delete(name);
      if (remaining.size === 0) {
        ready.push(dependent);
        ready.sort();
      }
    }
  }

  if (ordered.length === projects.length) return ordered;

  const remaining = projects.filter((name) => !ordered.includes(name)).sort();
  return [...ordered, ...remaining];
}

/**
 * Replace text in a file
 * @param {string} filePath - file path
 * @param {RegExp|string} searchValue - text or regex to search
 * @param {string} replaceValue - replacement text
 */
async function replaceInFile(filePath, replacements) {
  let content = await readFile(filePath, 'utf8');
  let updated = content;

  for (const [searchValue, replaceValue] of replacements) {
    const searchRegex =
      typeof searchValue === 'string'
        ? new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        : searchValue;
    updated = updated.replace(searchRegex, replaceValue);
  }

  if (updated !== content) {
    await writeFile(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

async function buildAll() {
  const entries = await readdir(projectDir, { withFileTypes: true });
  const projects = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  console.log('Angular projects:', projects);

  await rm('./dist', { recursive: true, force: true });
  await fse.ensureDir('./dist');

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const paths = tsconfig.compilerOptions?.paths || {};
  const pkgName = '@egose/shadcn-theme-ng';
  const matchingKeys = Object.keys(paths).filter((key) => key.startsWith(pkgName));
  const namesWithoutPrefix = matchingKeys.map((key) => key.replace(`${pkgName}/`, ''));
  const orderedNames = await sortProjectsForBuild(
    namesWithoutPrefix.filter((name) => projects.includes(name)),
    pkgName,
  );

  const exports = {};
  orderedNames.forEach((name) => {
    try {
      execSync(`pnpm ng build ${name}`);
      exports[`./${name}`] = {
        types: `./${name}/index.d.ts`,
        default: `./${name}/fesm2022/${name}.mjs`,
      };

      fse.writeFileSync('./dist/exports.json', Buffer.from(JSON.stringify(exports), 'utf-8'));
    } catch (error) {
      console.error(error);
      console.error(`Failed to build ${name}`);
    }
  });

  const allFiles = await getAllFiles('./dist');

  const tsFiles = allFiles.filter((f) => f.endsWith('.mjs'));
  const twPrefix = bundle ? `${bundle}:` : '';
  const newPkgName = bundle ? `${pkgName}-${bundle}` : pkgName;

  for (const file of tsFiles) {
    await replaceInFile(file, [
      ['tw:', twPrefix],
      [`'${pkgName}/`, `'${newPkgName}/`],
    ]);
  }
}

buildAll().catch(console.error);
