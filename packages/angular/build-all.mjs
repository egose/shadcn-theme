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

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const paths = tsconfig.compilerOptions?.paths || {};
  const prefix = '@egose/shadcn-theme-ng';
  const matchingKeys = Object.keys(paths).filter((key) => key.startsWith(prefix));
  const namesWithoutPrefix = matchingKeys.map((key) => key.replace(`${prefix}/`, ''));

  const exports = {};
  namesWithoutPrefix.forEach((name) => {
    if (!projects.includes(name)) return;

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
  const to = bundle ? `${bundle}:` : '';

  for (const file of tsFiles) {
    await replaceInFile(file, [['tw:', to]]);
  }
}

buildAll().catch(console.error);
