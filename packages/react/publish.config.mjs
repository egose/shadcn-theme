import { cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const cwd = fileURLToPath(new URL('.', import.meta.url));
const rootDir = fileURLToPath(new URL('../..', import.meta.url));

export default {
  cwd,
  rootDir,
  allowPrivateTemplate: true,
  packageFiles: ['README.md', 'llms.txt'],
  rootFiles: ['LICENSE'],
  access: 'public',
  artifacts: [
    {
      id: 'release',
      packageName: '@egose/shadcn-theme',
      stageDir: 'release/npm',
      preserveSourceFiles: true,
      publishAccess: 'public',
      requireTarball: true,

      async build({ cwd, stageDir, runner }) {
        runner.run('pnpm', ['bundle'], { cwd });
        await cp(join(cwd, 'dist'), stageDir, {
          recursive: true,
          dereference: false,
        });
      },

      validate({ cwd, stageDir, runner }) {
        runner.run(process.execPath, [join(cwd, 'scripts/validate-package.mjs'), stageDir], {
          cwd,
        });
      },
    },
  ],
};
