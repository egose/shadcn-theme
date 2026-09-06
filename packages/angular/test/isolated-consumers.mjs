import { spawnSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, cwd, { capture = false, expectFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_update_notifier: 'false' },
    stdio: capture || expectFailure ? 'pipe' : 'inherit',
  });
  if (result.error) throw result.error;
  if (!expectFailure && result.status !== 0) throw new Error(`${command} ${args.join(' ')} exited ${result.status}`);
  if (expectFailure && result.status === 0) throw new Error(`${command} ${args.join(' ')} unexpectedly succeeded`);
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
}

function releaseDirectory() {
  const index = process.argv.indexOf('--release-dir');
  if (index === -1 || !process.argv[index + 1]) {
    throw new Error('Usage: node test/isolated-consumers.mjs --release-dir <prepared-release-directory>');
  }
  return path.resolve(workspace, process.argv[index + 1]);
}

async function preparedTarball(directory, variant) {
  const stage = path.join(directory, 'staged', variant);
  const manifest = JSON.parse(await readFile(path.join(stage, 'package.json'), 'utf8'));
  const filename = `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`;
  const tarball = path.join(directory, filename);
  await access(tarball);
  return { packageName: manifest.name, tarball };
}

async function writeConsumer(directory, packageName, tarball) {
  await mkdir(path.join(directory, 'src'), { recursive: true });
  const dependencies = {
    [packageName]: `file:${tarball}`,
    '@angular/cdk': '22.1.3',
    '@angular/common': '22.1.3',
    '@angular/compiler': '22.1.3',
    '@angular/core': '22.1.3',
    '@angular/forms': '22.1.3',
    '@angular/platform-browser': '22.1.3',
    '@angular/platform-server': '22.1.3',
    '@angular/router': '22.1.3',
    '@ng-icons/core': '35.0.1',
    '@spartan-ng/brain': '1.3.2',
    rxjs: '7.8.2',
  };
  const devDependencies = {
    '@angular/build': '22.1.5',
    '@angular/cli': '22.1.5',
    '@angular/compiler-cli': '22.1.3',
    '@tailwindcss/postcss': '^4.1.13',
    tailwindcss: '4.3.3',
    typescript: '6.0.3',
  };
  await writeFile(
    path.join(directory, 'package.json'),
    `${JSON.stringify({ private: true, scripts: { build: 'ng build --configuration production', render: 'node src/render.mjs', typecheck: 'tsc --noEmit' }, dependencies, devDependencies }, null, 2)}\n`,
  );
  await writeFile(
    path.join(directory, 'angular.json'),
    `${JSON.stringify(
      {
        version: 1,
        projects: {
          consumer: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: {
                  browser: 'src/main.ts',
                  tsConfig: 'tsconfig.json',
                  index: 'src/index.html',
                  styles: ['src/styles.css'],
                },
                configurations: {
                  production: {
                    // Critical-CSS inlining moves above-fold rules into
                    // index.html; keep styles in the emitted stylesheet so the
                    // ANGEX-07 prefix-identity assertions below read one artifact.
                    optimization: { scripts: true, styles: { minify: true, inlineCritical: false }, fonts: true },
                    outputHashing: 'all',
                    sourceMap: false,
                  },
                },
                defaultConfiguration: 'production',
              },
            },
          },
        },
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    path.join(directory, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: 'ES2022',
          module: 'preserve',
          moduleResolution: 'bundler',
          experimentalDecorators: true,
          useDefineForClassFields: false,
          lib: ['ES2022', 'dom'],
        },
        angularCompilerOptions: { strictTemplates: true },
        files: ['src/main.ts'],
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(path.join(directory, 'src/index.html'), '<app-root></app-root>\n');
  // ANGEX-07: the consumer stylesheet scans the exact installed tarball so the
  // production build proves Tailwind scanning and prefix semantics for each
  // variant independently (plain: unprefixed utilities; -tw: retained tw:).
  const isTw = packageName.endsWith('-tw');
  await writeFile(
    path.join(directory, 'src/styles.css'),
    `@import "tailwindcss"${isTw ? ' prefix(tw)' : ''};\n@source "../node_modules/${packageName}";\n`,
  );
  await writeFile(path.join(directory, '.postcssrc.json'), `${JSON.stringify({ plugins: { '@tailwindcss/postcss': {} } }, null, 2)}\n`);
  await writeFile(
    path.join(directory, 'src/render.mjs'),
    `import '@angular/compiler';
import assert from 'node:assert/strict';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { HlmButtonModule } from '${packageName}/button';

class App {}
Component({
  selector: 'app-root',
  standalone: true,
  imports: [HlmButtonModule],
  template: '<button hlmBtn>Installed package button</button>',
})(App);

const html = await renderApplication(
  (context) =>
    bootstrapApplication(App, { providers: [provideZonelessChangeDetection(), provideServerRendering()] }, context),
  {
    document: '<!doctype html><html><body><app-root></app-root></body></html>',
    url: 'http://localhost/',
    allowedHosts: ['localhost'],
  },
);
const button = /<button[^>]*class="([^"]*)"[^>]*>Installed package button<\\/button>/.exec(html);
assert(button, 'installed button did not render');
const classes = button[1].split(/\\s+/);
assert(classes.includes('${packageName.endsWith('-tw') ? 'tw:inline-flex' : 'inline-flex'}'));
assert.equal(classes.includes('${packageName.endsWith('-tw') ? 'inline-flex' : 'tw:inline-flex'}'), false);
console.log('Rendered installed ${packageName} button with expected class identity');
`,
  );
  await writeFile(
    path.join(directory, 'src/main.ts'),
    `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HlmButtonModule } from '${packageName}/button';
import { HlmCarouselModule } from '${packageName}/carousel';
import { HlmDialogModule } from '${packageName}/dialog';
import { EgFormTextInput } from '${packageName}/form-text-input';
import { HlmInput } from '${packageName}/input';
import { EgLayoutSimple } from '${packageName}/layout-simple';
import { HlmMenuModule } from '${packageName}/menu';
import { HlmSheetModule } from '${packageName}/sheet';
import { HlmToasterModule } from '${packageName}/sonner';
import { HlmTableModule } from '${packageName}/table';
import { HlmTabsModule } from '${packageName}/tabs';

const linkedSurface = [HlmCarouselModule, HlmDialogModule, EgFormTextInput, HlmInput, EgLayoutSimple, HlmSheetModule, HlmTableModule, HlmTabsModule, HlmToasterModule];
void linkedSurface;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HlmButtonModule, HlmMenuModule],
  template: '<button hlmBtn>Button</button><hlm-menu><button hlmMenuItem>Item</button></hlm-menu>',
})
class App {}

bootstrapApplication(App);
`,
  );
}

async function assertConsumerStyles(consumer, packageName) {
  const browserDirectory = path.join(consumer, 'dist', 'consumer', 'browser');
  const entries = await readdir(browserDirectory);
  const stylesheets = entries.filter((entry) => entry.endsWith('.css'));
  assert(stylesheets.length > 0, `isolated ${packageName} consumer emitted no stylesheet`);
  const css = (
    await Promise.all(stylesheets.map((entry) => readFile(path.join(browserDirectory, entry), 'utf8')))
  ).join('\n');
  if (packageName.endsWith('-tw')) {
    assert(css.includes('tw\\:inline-flex'), `isolated ${packageName} stylesheet lost the tw: prefix identity`);
    assert(!css.includes('.inline-flex'), `isolated ${packageName} stylesheet leaked unprefixed utilities`);
  } else {
    assert(css.includes('.inline-flex'), `isolated ${packageName} stylesheet lost unprefixed utilities`);
    assert(!css.includes('tw:'), `isolated ${packageName} stylesheet leaked tw: utilities`);
  }
  console.log(`Verified isolated ${packageName} stylesheet prefix identity`);
}

const preparedRelease = releaseDirectory();
const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'shadcn-theme-ng-consumers-'));
try {
  for (const variant of ['plain', 'tw']) {
    const { packageName, tarball } = await preparedTarball(preparedRelease, variant);
    const consumer = path.join(temporaryRoot, variant, 'consumer');
    await writeConsumer(consumer, packageName, tarball);
    run('npm', ['install', '--strict-peer-deps', '--ignore-scripts'], consumer);
    run('npm', ['run', 'typecheck'], consumer);
    run('npm', ['run', 'build'], consumer);
    await assertConsumerStyles(consumer, packageName);
    run('npm', ['run', 'render'], consumer);
    console.log(`Verified isolated ${packageName} consumer`);
  }

  const incompatiblePeer = path.join(temporaryRoot, 'incompatible-peer');
  await mkdir(incompatiblePeer);
  const { tarball: plainTarball } = await preparedTarball(preparedRelease, 'plain');
  await writeFile(
    path.join(incompatiblePeer, 'package.json'),
    `${JSON.stringify(
      {
        private: true,
        dependencies: { '@angular/core': '21.2.14', '@egose/shadcn-theme-ng': `file:${plainTarball}` },
      },
      null,
      2,
    )}\n`,
  );
  const diagnostic = run('npm', ['install', '--strict-peer-deps', '--ignore-scripts'], incompatiblePeer, {
    expectFailure: true,
  });
  if (!/(ERESOLVE|peer)/i.test(diagnostic))
    throw new Error(`Incompatible peer install had no peer diagnostic:\n${diagnostic}`);
  console.log('Verified incompatible required peers fail with an npm peer-dependency diagnostic');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
