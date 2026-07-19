import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const projectsDir = path.join(rootDir, 'projects');
const libsUiDir = path.join(rootDir, 'libs', 'ui');
const angularJsonPath = path.join(rootDir, 'angular.json');
const tsconfigPath = path.join(rootDir, 'tsconfig.json');
const tsconfigBuildPath = path.join(rootDir, 'tsconfig.build.json');
const buildSupportProjectNames = ['icon'];

const preservedExistingProjectNames = new Set([
  'accordion',
  'alert',
  'badge',
  'basic-alert',
  'button',
  'checkbox',
  'confirmation-dialog',
  'form-checkbox',
  'form-date-picker',
  'form-field',
  'form-field-simple',
  'form-searchable-multiselect',
  'form-select',
  'form-text-input',
  'form-textarea',
  'icon',
  'label',
  'layout-simple',
  'menu',
  'searchable-multiselect',
  'sheet',
  'sonner',
  'spinner',
  'switch',
  'utils',
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return;
  fs.writeFileSync(filePath, content, 'utf8');
}

function overwriteFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyDirectory(sourceDir, targetDir) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function toPascalCase(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function packageJsonTemplate() {
  return {
    name: '',
    version: '0.0.1',
    peerDependencies: {
      '@angular/common': '^22.0.0',
      '@angular/core': '^22.0.0',
      '@spartan-ng/brain': '^1.1.1',
    },
    dependencies: {
      tslib: '^2.3.0',
    },
    sideEffects: false,
  };
}

function readmeTemplate(name) {
  const title = toPascalCase(name);

  return `# ${title}

This project was generated using [Angular CLI](https://github.com/angular/angular-cli).

## Building

To build the library, run:

\`\`\`bash
ng build ${name}
\`\`\`
`;
}

function ngPackageTemplate(name) {
  return {
    $schema: '../../node_modules/ng-packagr/ng-package.schema.json',
    dest: `../../dist/${name}`,
    lib: {
      entryFile: 'src/public-api.ts',
    },
  };
}

function tsconfigLibTemplate() {
  return `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/lib",
    "rootDir": "../../",
    "declaration": true,
    "declarationMap": true,
    "types": []
  },
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.spec.ts"]
}
`;
}

function tsconfigLibProdTemplate() {
  return `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/lib",
    "declaration": true,
    "declarationMap": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.spec.ts"],
  "angularCompilerOptions": {
    "compilationMode": "partial"
  }
}
`;
}

function tsconfigSpecTemplate() {
  return `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.ts"]
}
`;
}

function publicApiTemplate(name, indexSource) {
  const moduleBase = `Hlm${toPascalCase(name)}`;

  return `/*
 * Public API Surface of ${name}
 */

import { NgModule } from '@angular/core';

${indexSource.trim()}

@NgModule({
  imports: [...${moduleBase}Imports],
  exports: [...${moduleBase}Imports],
})
export class ${moduleBase}Module {}
`;
}

function angularProjectConfig(name) {
  return {
    projectType: 'library',
    root: `projects/${name}`,
    sourceRoot: `projects/${name}/src`,
    prefix: 'lib',
    architect: {
      build: {
        builder: '@angular/build:ng-packagr',
        configurations: {
          production: {
            tsConfig: `projects/${name}/tsconfig.lib.prod.json`,
          },
          development: {
            tsConfig: `projects/${name}/tsconfig.lib.json`,
          },
        },
        defaultConfiguration: 'production',
      },
      test: {
        builder: '@angular/build:karma',
        options: {
          tsConfig: `projects/${name}/tsconfig.spec.json`,
        },
      },
    },
  };
}

const allProjectNames = fs
  .readdirSync(projectsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const libsUiNames = fs
  .readdirSync(libsUiDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const mirroredProjectNames = libsUiNames.filter((name) => !preservedExistingProjectNames.has(name));
const missingProjectNames = mirroredProjectNames.filter((name) => !allProjectNames.includes(name));

for (const name of allProjectNames) {
  const projectRoot = path.join(projectsDir, name);
  overwriteFile(path.join(projectRoot, 'tsconfig.lib.json'), tsconfigLibTemplate());
  overwriteFile(path.join(projectRoot, 'tsconfig.lib.prod.json'), tsconfigLibProdTemplate());
  overwriteFile(path.join(projectRoot, 'tsconfig.spec.json'), tsconfigSpecTemplate());
}

for (const name of missingProjectNames) {
  const projectRoot = path.join(projectsDir, name);
  ensureDir(path.join(projectRoot, 'src'));

  const pkgJson = packageJsonTemplate();
  pkgJson.name = name;

  writeJson(path.join(projectRoot, 'package.json'), pkgJson);
  writeJson(path.join(projectRoot, 'ng-package.json'), ngPackageTemplate(name));
  writeFileIfMissing(path.join(projectRoot, 'README.md'), readmeTemplate(name));
  overwriteFile(path.join(projectRoot, 'tsconfig.lib.json'), tsconfigLibTemplate());
  overwriteFile(path.join(projectRoot, 'tsconfig.lib.prod.json'), tsconfigLibProdTemplate());
  overwriteFile(path.join(projectRoot, 'tsconfig.spec.json'), tsconfigSpecTemplate());
}

for (const name of mirroredProjectNames) {
  const projectRoot = path.join(projectsDir, name);
  const libsUiRoot = path.join(libsUiDir, name, 'src');
  const libsUiLibRoot = path.join(libsUiRoot, 'lib');
  const projectSrcRoot = path.join(projectRoot, 'src');
  const projectLibRoot = path.join(projectSrcRoot, 'lib');
  const indexSource = fs.readFileSync(path.join(libsUiRoot, 'index.ts'), 'utf8');

  fs.rmSync(projectLibRoot, { recursive: true, force: true });
  copyDirectory(libsUiLibRoot, projectLibRoot);
  overwriteFile(path.join(projectSrcRoot, 'public-api.ts'), publicApiTemplate(name, indexSource));
}

const publishableProjectNames = fs
  .readdirSync(projectsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const mirroredBuildNames = [...libsUiNames.filter((name) => publishableProjectNames.includes(name)), ...buildSupportProjectNames].sort();

const angularJson = readJson(angularJsonPath);
for (const name of publishableProjectNames) {
  if (!angularJson.projects[name]) {
    angularJson.projects[name] = angularProjectConfig(name);
  }
}
writeJson(angularJsonPath, angularJson);

const tsconfig = readJson(tsconfigPath);
tsconfig.compilerOptions ??= {};
tsconfig.compilerOptions.paths ??= {};

for (const key of Object.keys(tsconfig.compilerOptions.paths)) {
  if (key.startsWith('@egose/shadcn-theme-ng/')) {
    delete tsconfig.compilerOptions.paths[key];
  }
}

for (const name of mirroredBuildNames) {
  tsconfig.compilerOptions.paths[`@egose/shadcn-theme-ng/${name}`] = [`./projects/${name}/src/public-api.ts`];
}

const tsconfigBuild = {
  extends: './tsconfig.json',
  compilerOptions: {
    paths: Object.fromEntries(
      mirroredBuildNames.map((name) => [`@egose/shadcn-theme-ng/${name}`, [`./dist/${name}`]]),
    ),
  },
};

writeJson(tsconfigBuildPath, tsconfigBuild);

const references = tsconfig.references ?? [];
const referencePaths = new Set(references.map((reference) => reference.path));

for (const name of publishableProjectNames) {
  const libPath = `./projects/${name}/tsconfig.lib.json`;
  const specPath = `./projects/${name}/tsconfig.spec.json`;

  if (!referencePaths.has(libPath)) {
    references.push({ path: libPath });
    referencePaths.add(libPath);
  }

  if (!referencePaths.has(specPath)) {
    references.push({ path: specPath });
    referencePaths.add(specPath);
  }
}

tsconfig.references = references;
writeJson(tsconfigPath, tsconfig);

console.log(`Normalized ${allProjectNames.length} existing project tsconfigs.`);
console.log(`Created ${missingProjectNames.length} missing project wrappers.`);
console.log(`Synced ${mirroredProjectNames.length} mirrored UI project wrappers.`);
