import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { readdir, rm } from 'node:fs/promises';
import fse from 'fs-extra';

const projectDir = './projects';
const tsconfigPath = path.resolve('./tsconfig.json');

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
}

buildAll().catch(console.error);
