import { execSync } from 'child_process';
import { readdir, rm } from 'node:fs/promises';
import fse from 'fs-extra';

const projectDir = './projects';

async function buildAll() {
  const entries = await readdir(projectDir, { withFileTypes: true });
  const projects = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  console.log('Angular projects:', projects);

  await rm('./dist', { recursive: true, force: true });

  const exports = {};
  projects.forEach((name) => {
    execSync(`pnpm ng build ${name}`);
    exports[`./${name}`] = {
      types: `./${name}/index.d.ts`,
      default: `./${name}/fesm2022/${name}.mjs`,
    };

    fse.writeFileSync('./dist/exports.json', Buffer.from(JSON.stringify(exports), 'utf-8'));
  });
}

buildAll().catch(console.error);
