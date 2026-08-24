import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const SELF_PACKAGES = ['@egose/shadcn-theme-ng', '@egose/shadcn-theme-ng-tw'];

export const BUILD_ONLY_PACKAGES = new Set([
  '@angular/build',
  '@angular/cli',
  '@angular/compiler',
  '@angular/compiler-cli',
  '@spartan-ng/cli',
  '@types/jasmine',
  'jasmine-core',
  'karma',
  'karma-chrome-launcher',
  'karma-coverage',
  'karma-jasmine',
  'karma-jasmine-html-reporter',
  'ng-packagr',
  'sonner',
  'tailwindcss',
  'tailwindcss-animate',
  'tw-animate-css',
  'typescript',
]);

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesBelow(file)));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}

function packageRoot(specifier) {
  return specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
}

export async function inventoryArtifactImports(packageDirectory) {
  const imports = new Map();
  const files = (await filesBelow(packageDirectory)).filter((file) => file.endsWith('.mjs') || file.endsWith('.d.ts'));
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    for (const imported of ts.preProcessFile(source, true, true).importedFiles) {
      const specifier = imported.fileName;
      if (specifier.startsWith('.') || SELF_PACKAGES.some((name) => specifier.startsWith(`${name}/`))) continue;
      const root = packageRoot(specifier);
      if (!imports.has(root)) imports.set(root, new Set());
      imports.get(root).add(specifier);
    }
  }
  return new Map([...imports].sort(([left], [right]) => left.localeCompare(right)));
}

export async function validateArtifactDependencyContract(packageDirectory, packageJson) {
  const imports = await inventoryArtifactImports(packageDirectory);
  const dependencies = new Set(Object.keys(packageJson.dependencies ?? {}));
  const peers = new Set(Object.keys(packageJson.peerDependencies ?? {}));
  const optionalPeers = new Set(
    Object.entries(packageJson.peerDependenciesMeta ?? {})
      .filter(([, metadata]) => metadata?.optional)
      .map(([name]) => name),
  );
  const declared = new Set([...dependencies, ...peers]);
  const errors = [];

  for (const [root, specifiers] of imports) {
    if (!declared.has(root)) errors.push(`Undeclared artifact import ${root}: ${[...specifiers].sort().join(', ')}`);
  }
  for (const name of dependencies) {
    if (peers.has(name)) errors.push(`${name} is declared as both a dependency and peer dependency`);
  }
  for (const name of optionalPeers) {
    if (!peers.has(name)) errors.push(`Optional peer metadata has no matching peer dependency: ${name}`);
  }
  for (const name of BUILD_ONLY_PACKAGES) {
    if (declared.has(name)) errors.push(`Build-only package is present in published metadata: ${name}`);
  }
  if (errors.length) throw new Error(`Angular dependency contract is invalid:\n- ${errors.join('\n- ')}`);
  return imports;
}
