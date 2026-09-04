import { readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const cwd = fileURLToPath(new URL('.', import.meta.url));
const rootDir = fileURLToPath(new URL('../..', import.meta.url));

function artifact(id, packageName, variant) {
  return {
    id,
    packageName,
    stageDir: `release/${id}`,
    requireTarball: true,
    publishAccess: 'public',

    build({ cwd, stageDir, runner }) {
      runner.run('pnpm', ['bundle', '--stage', stageDir], { cwd });
    },

    async manifestOverlay({ stageDir }) {
      const exportsPath = join(stageDir, 'exports.json');
      const exports = JSON.parse(await readFile(exportsPath, 'utf8'));

      // The validator rejects this intermediate build file.
      await rm(exportsPath);

      return { exports };
    },

    validate({ cwd, stageDir, runner }) {
      runner.run(
        process.execPath,
        [join(cwd, 'validate-package.mjs'), '--workspace', cwd, '--package', stageDir, '--variant', variant],
        { cwd },
      );
    },
  };
}

export default {
  cwd,
  rootDir,
  allowPrivateTemplate: true,
  packageFiles: ['README.md', 'llms.txt'],
  rootFiles: ['LICENSE'],
  access: 'public',
  artifacts: [artifact('plain', '@egose/shadcn-theme-ng', 'plain'), artifact('tw', '@egose/shadcn-theme-ng-tw', 'tw')],
};
