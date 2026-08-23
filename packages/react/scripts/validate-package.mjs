import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const REQUIRED_METADATA = [
  'name',
  'version',
  'description',
  'license',
  'author',
  'repository',
  'sideEffects',
  'files',
  'exports',
  'dependencies',
  'peerDependencies',
  'engines',
  'publishConfig',
];

const normalize = (value) => value.split(path.sep).join('/');
const requireFromValidator = createRequire(import.meta.url);
const typescriptCli = requireFromValidator.resolve('typescript/bin/tsc');

async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(entryPath, base)));
    else files.push(normalize(path.relative(base, entryPath)));
  }
  return files;
}

function flattenTargets(value, conditions = []) {
  if (typeof value === 'string') return [{ conditions, target: value }];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([condition, target]) =>
    flattenTargets(target, [...conditions, condition]),
  );
}

function wildcardPattern(target) {
  const relativeTarget = target.replace(/^\.\//, '');
  const escaped = relativeTarget
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('(.*)');
  return new RegExp(`^${escaped}$`);
}

function concreteExports(exportsMap, files, errors) {
  const concrete = [];
  for (const [exportName, value] of Object.entries(exportsMap)) {
    const targets = flattenTargets(value);
    if (targets.length === 0) {
      errors.push(`${exportName}: export has no string targets`);
      continue;
    }

    const wildcard = exportName.includes('*');
    const substitutions = new Set(wildcard ? [] : ['']);
    for (const { target } of targets) {
      if (wildcard !== target.includes('*')) {
        errors.push(`${exportName}: wildcard shape does not match target ${target}`);
        continue;
      }
      if (wildcard) {
        const pattern = wildcardPattern(target);
        for (const file of files) {
          const match = pattern.exec(file);
          if (match) substitutions.add(match[1]);
        }
      }
    }
    if (wildcard && substitutions.size === 0) {
      errors.push(`${exportName}: wildcard export matches no files`);
    }

    for (const substitution of [...substitutions].sort()) {
      concrete.push({
        exportName: exportName.replaceAll('*', substitution),
        targets: targets.map(({ conditions, target }) => ({
          conditions,
          target: target.replaceAll('*', substitution),
        })),
      });
    }
  }
  return concrete;
}

function validateConditionalTypes(exportsMap, errors) {
  for (const [exportName, value] of Object.entries(exportsMap)) {
    if (exportName === './package.json') continue;
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${exportName}: runtime export must use import and require conditions`);
      continue;
    }
    if (Object.keys(value).join(',') !== 'import,require') {
      errors.push(`${exportName}: conditions must be ordered as import, require`);
    }
    for (const [condition, declarationExtension, runtimeExtension] of [
      ['import', '.d.mts', '.mjs'],
      ['require', '.d.ts', '.js'],
    ]) {
      const branch = value[condition];
      if (!branch || typeof branch !== 'object' || Array.isArray(branch)) {
        errors.push(`${exportName}: ${condition} must contain types and default conditions`);
        continue;
      }
      if (Object.keys(branch).join(',') !== 'types,default') {
        errors.push(`${exportName}: ${condition} conditions must be ordered as types, default`);
      }
      if (typeof branch.types !== 'string' || !branch.types.endsWith(declarationExtension)) {
        errors.push(`${exportName}: ${condition} types must target ${declarationExtension}`);
      }
      if (typeof branch.default !== 'string' || !branch.default.endsWith(runtimeExtension)) {
        errors.push(`${exportName}: ${condition} default must target ${runtimeExtension}`);
      }
    }
  }
}

function runNodeLoad(kind, absoluteTarget) {
  const isImport = kind === 'import';
  const expression = isImport
    ? 'await import(process.argv[1])'
    : 'require(process.argv[1])';
  const target = isImport ? pathToFileURL(absoluteTarget).href : absoluteTarget;
  return spawnSync(process.execPath, [
    ...(isImport ? ['--input-type=module'] : []),
    '--eval',
    expression,
    target,
  ], {
    encoding: 'utf8',
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
  });
}

async function compileTypeScriptConsumers(packageDir, packageData, exportsToValidate) {
  const consumerDirectory = await mkdtemp(path.join(os.tmpdir(), 'react-package-types-'));
  try {
    const installedPackage = path.join(consumerDirectory, 'node_modules', ...packageData.name.split('/'));
    await mkdir(path.dirname(installedPackage), { recursive: true });
    await symlink(packageDir, installedPackage, 'dir');

    const exportNames = [...new Set(
      exportsToValidate
        .map(({ exportName }) => exportName)
        .filter((exportName) => exportName !== './package.json'),
    )];
    const specifiers = exportNames.map((exportName) =>
      exportName === '.' ? packageData.name : `${packageData.name}${exportName.slice(1)}`,
    );
    const esmConsumer = specifiers.map((specifier) => `import '${specifier}';`).join('\n');
    const cjsConsumer = specifiers
      .map((specifier, index) => `import Export${index} = require('${specifier}');\nvoid Export${index};`)
      .join('\n');
    const esmPath = path.join(consumerDirectory, 'consumer.mts');
    const cjsPath = path.join(consumerDirectory, 'consumer.cts');
    await Promise.all([
      writeFile(esmPath, `${esmConsumer}\n`),
      writeFile(cjsPath, `${cjsConsumer}\n`),
    ]);

    return spawnSync(process.execPath, [
      typescriptCli,
      '--noEmit',
      '--pretty',
      'false',
      '--skipLibCheck',
      '--module',
      'Node16',
      '--moduleResolution',
      'Node16',
      '--target',
      'ES2022',
      esmPath,
      cjsPath,
    ], {
      cwd: consumerDirectory,
      encoding: 'utf8',
    });
  } finally {
    await rm(consumerDirectory, { recursive: true, force: true });
  }
}

function validatePackedFile(file, errors) {
  if (
    file === 'exports.json' ||
    (file.endsWith('.ts') && !file.endsWith('.d.ts')) ||
    file.endsWith('.tsx') ||
    /(^|\/)(scripts?|tests?|test-fixtures|node_modules)(\/|$)/.test(file) ||
    /(^|\/)(pnpm-lock\.yaml|package-lock\.json)$/.test(file)
  ) {
    errors.push(`npm pack leaked internal file: ${file}`);
  }

  const allowed =
    ['package.json', 'README.md', 'LICENSE', 'llms.txt'].includes(file) ||
    /(^|\/)[^/]+\.(js|mjs|d\.ts|d\.mts|map)$/.test(file);
  if (!allowed) errors.push(`npm pack contains unexpected file: ${file}`);
}

export async function validatePackage(packageDirectory, options = {}) {
  const packageDir = path.resolve(packageDirectory);
  const loadRuntime = options.loadRuntime !== false;
  const compileTypes = options.compileTypes !== false;
  const runPack = options.runPack !== false;
  const errors = [];
  const packageJsonPath = path.join(packageDir, 'package.json');
  if (!existsSync(packageJsonPath)) throw new Error(`Missing staged package.json: ${packageJsonPath}`);

  let packageData;
  try {
    packageData = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid staged package.json: ${error.message}`, { cause: error });
  }

  for (const field of REQUIRED_METADATA) {
    if (!(field in packageData) || packageData[field] === '' || packageData[field] === null) {
      errors.push(`missing required metadata: ${field}`);
    }
  }
  if (packageData.private === true) errors.push('staged package must not be private');
  if (packageData.publishConfig?.access !== 'public') {
    errors.push('publishConfig.access must be public');
  }
  if (/PLACEHOLDER/i.test(JSON.stringify(packageData))) {
    errors.push('package metadata contains a placeholder');
  }

  const files = await listFiles(packageDir);
  const exportsMap = packageData.exports;
  if (!exportsMap || typeof exportsMap !== 'object' || Array.isArray(exportsMap)) {
    errors.push('exports must be an object');
  }
  validateConditionalTypes(exportsMap || {}, errors);
  const exportsToValidate = concreteExports(exportsMap || {}, files, errors);
  const runtimeTargets = [];
  const requiredPackedTargets = new Set(['package.json', 'README.md', 'LICENSE']);

  for (const exported of exportsToValidate) {
    const conditionNames = new Set(exported.targets.flatMap(({ conditions }) => conditions));
    if (exported.exportName !== './package.json') {
      for (const requiredCondition of ['types', 'import', 'require']) {
        if (!conditionNames.has(requiredCondition)) {
          errors.push(`${exported.exportName}: missing ${requiredCondition} condition`);
        }
      }
    }

    for (const { conditions, target } of exported.targets) {
      if (!target.startsWith('./')) {
        errors.push(`${exported.exportName}: target must start with ./: ${target}`);
        continue;
      }
      const relativeTarget = target.slice(2);
      const absoluteTarget = path.resolve(packageDir, relativeTarget);
      if (!absoluteTarget.startsWith(`${packageDir}${path.sep}`) || !existsSync(absoluteTarget)) {
        errors.push(`${exported.exportName} [${conditions.join(',')}]: missing target ${target}`);
        continue;
      }
      requiredPackedTargets.add(relativeTarget);
      const runtimeCondition = conditions.find((condition) => condition === 'import' || condition === 'require');
      if (runtimeCondition && !conditions.includes('types')) {
        runtimeTargets.push({ ...exported, kind: runtimeCondition, absoluteTarget });
      }
      if (conditions.includes('types') && !/\.d\.(?:mts|cts|ts)$/.test(target)) {
        errors.push(`${exported.exportName}: types target is not a declaration: ${target}`);
      }
    }
  }

  if (loadRuntime) {
    for (const runtime of runtimeTargets) {
      const result = runNodeLoad(runtime.kind, runtime.absoluteTarget);
      if (result.status !== 0) {
        const output = (result.stderr || result.stdout || `exit ${result.status}`).trim();
        const lines = output.split('\n').map((line) => line.trim()).filter(Boolean);
        const detail =
          lines.find((line) =>
            /^(?:Error|TypeError|ReferenceError|SyntaxError)(?:\s|:|\[)/.test(line),
          ) || lines[0];
        errors.push(`${runtime.exportName} [${runtime.kind}] failed to load: ${detail}`);
      }
    }
  }

  if (compileTypes && packageData.name && exportsToValidate.length > 0) {
    const compiled = await compileTypeScriptConsumers(packageDir, packageData, exportsToValidate);
    if (compiled.status !== 0) {
      errors.push(
        `staged ESM/CommonJS TypeScript consumers failed to compile:\n${(compiled.stdout || compiled.stderr).trim()}`,
      );
    }
  }

  let packedFiles = [];
  if (runPack) {
    const packed = spawnSync(
      'npm',
      ['pack', '--dry-run', '--json', '--ignore-scripts'],
      {
        cwd: packageDir,
        encoding: 'utf8',
        env: {
          ...process.env,
          npm_config_audit: 'false',
          npm_config_fund: 'false',
          npm_config_update_notifier: 'false',
        },
      },
    );
    if (packed.status !== 0) {
      errors.push(`npm pack --dry-run failed: ${(packed.stderr || packed.stdout).trim()}`);
    } else {
      try {
        const result = JSON.parse(packed.stdout);
        packedFiles = result[0].files.map(({ path: file }) => file).sort();
      } catch (error) {
        errors.push(`could not parse npm pack --dry-run JSON: ${error.message}`);
      }
    }
  }

  const packedSet = new Set(packedFiles);
  for (const file of packedFiles) validatePackedFile(file, errors);
  for (const target of requiredPackedTargets) {
    if (runPack && !packedSet.has(target)) errors.push(`npm pack omitted required file: ${target}`);
  }

  const result = {
    exports: exportsToValidate.length,
    runtimeTargets: runtimeTargets.length,
    declarationTargets: exportsToValidate.reduce(
      (count, entry) => count + entry.targets.filter(({ conditions }) => conditions.includes('types')).length,
      0,
    ),
    packedFiles: packedFiles.length,
    typeScriptConsumers: compileTypes ? 2 : 0,
  };
  if (errors.length > 0) {
    throw new Error(
      `Package validation failed (${errors.length}):\n- ${errors.join('\n- ')}\n` +
        `Checked ${result.exports} exports, ${result.runtimeTargets} runtime targets, ` +
        `${result.declarationTargets} declarations, ${result.typeScriptConsumers} TypeScript consumers, ` +
        `and ${result.packedFiles} packed files.`,
    );
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const packageDirectory = process.argv[2] || 'dist';
  try {
    const result = await validatePackage(packageDirectory);
    console.log(
      `Validated ${result.exports} exports, ${result.runtimeTargets} runtime targets, ` +
        `${result.declarationTargets} declarations, ${result.typeScriptConsumers} TypeScript consumers, ` +
        `and ${result.packedFiles} packed files.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
