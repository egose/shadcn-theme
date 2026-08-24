import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const selectedProjects = [
  'form-text-input',
  'form-textarea',
  'form-select',
  'form-checkbox',
  'form-date-picker',
  'form-searchable-multiselect',
  'utils',
  'layout-simple',
  'dropdown-menu',
  'radio-group',
];
const projects = process.argv.slice(2);
const targets = projects.length ? projects : selectedProjects;

async function startHydrationServer() {
  const cwd = new URL('..', import.meta.url);
  const hydrationProjects = ['utils', 'label', 'input', 'form-field', 'form-text-input'];

  for (const project of hydrationProjects) {
    const build = spawnSync('pnpm', ['exec', 'ng', 'build', project], {
      cwd,
      stdio: 'inherit',
      shell: false,
    });
    if (build.error) throw build.error;
    if (build.status !== 0) throw new Error(`Failed to build ${project} for the Angular SSR hydration fixture`);
  }

  const exports = Object.fromEntries(
    hydrationProjects.map((project) => [
      `./${project}`,
      {
        types: `./${project}/types/${project}.d.ts`,
        default: `./${project}/fesm2022/${project}.mjs`,
      },
    ]),
  );
  const dist = new URL('../dist/', import.meta.url);
  mkdirSync(dist, { recursive: true });
  writeFileSync(
    new URL('package.json', dist),
    `${JSON.stringify({ name: '@egose/shadcn-theme-ng', type: 'module', exports }, null, 2)}\n`,
  );
  const packageScope = new URL('node_modules/@egose/', dist);
  const packageLink = new URL('shadcn-theme-ng', packageScope);
  mkdirSync(packageScope, { recursive: true });
  rmSync(packageLink, { force: true, recursive: true });
  symlinkSync('../..', packageLink, 'dir');

  const server = spawn('node', ['test/form-hydration-server.mjs'], {
    cwd,
    stdio: ['ignore', 'pipe', 'inherit'],
    shell: false,
  });
  const lines = createInterface({ input: server.stdout });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out starting the Angular SSR hydration fixture')), 30000);
    server.once('error', reject);
    server.once('exit', (code) => reject(new Error(`Angular SSR hydration fixture exited with status ${code}`)));
    lines.on('line', (line) => {
      if (!line.startsWith('ANGULAR_07_SSR_READY=')) return;
      clearTimeout(timeout);
      resolve();
    });
  });

  lines.close();
  return server;
}

for (const project of targets) {
  if (!selectedProjects.includes(project)) {
    console.error(`No focused test suite is configured for ${project}. Choose: ${selectedProjects.join(', ')}`);
    process.exit(1);
  }

  const hydrationServer = project === 'form-text-input' ? await startHydrationServer() : undefined;
  const result = spawnSync(
    'pnpm',
    ['exec', 'ng', 'test', project, '--watch=false', '--browsers=ChromeHeadless', '--progress=false'],
    {
      cwd: new URL('..', import.meta.url),
      stdio: 'inherit',
      shell: false,
    },
  );
  hydrationServer?.kill('SIGTERM');
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
