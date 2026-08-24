import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';
import _ from 'lodash';
import fse from 'fs-extra';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const VER_PLACEHOLDER = '0.0.0-PLACEHOLDER';
const FIELD_PLACEHOLDER = 'PLACEHOLDER';
const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLISH_FIELDS = [
  'version',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'license',
  'author',
  'sideEffects',
  'files',
  'repository',
  'dependencies',
  'peerDependencies',
  'release',
  'engines',
  'main',
  'module',
  'types',
  'exports',
];

const parseJson = (file) => JSON.parse(fse.readFileSync(file, 'utf8'));
const writeJson = (file, object) => fse.writeFileSync(file, `${JSON.stringify(object, null, 2)}\n`, 'utf8');

export function runProcess(command, args, options = {}) {
  return spawnSync(command, args, { encoding: 'utf8', ...options, shell: false });
}

function resultError(command, result) {
  if (result.error) return result.error;
  const detail = result.stderr?.trim();
  return new Error(`${command} exited with status ${result.status}${detail ? `: ${detail}` : ''}`);
}

function runChecked(run, command, args, options = {}) {
  const result = run(command, args, options);
  if (result.error || result.status !== 0) throw resultError(command, result);
  return result;
}

export function classifyNpmViewFailure(result) {
  const output = `${result.stderr ?? ''}\n${result.stdout ?? ''}`;
  if (result.error?.code === 'ENOENT') return 'npm-unavailable';
  if (/(?:E401|E403|unauthori[sz]ed|forbidden|authentication|access token|log in)/i.test(output)) {
    return 'authentication';
  }
  if (/(?:ETIMEDOUT|ESOCKETTIMEDOUT|timed? out)/i.test(output) || result.error?.code === 'ETIMEDOUT') {
    return 'timeout';
  }
  if (/(?:ENETUNREACH|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|network)/i.test(output)) return 'network';
  if (/(?:^|\s)E404(?:\s|$)/m.test(output) && /(?:404 Not Found|is not in this registry)/i.test(output)) {
    return 'package-absent';
  }
  if (/(?:E5\d\d|registry)/i.test(output)) return 'registry';
  return 'unknown';
}

export function isConfirmedPackageAbsence(result) {
  return classifyNpmViewFailure(result) === 'package-absent';
}

export async function determineTargetVersion(packageName, options = {}, run = runProcess, cwd = REPOSITORY_ROOT) {
  let { version, major, minor, patch } = options;
  if (version) {
    if (version.startsWith('v')) version = version.substring(1);
    if (!semver.valid(version)) throw new Error(`Invalid semver version provided: ${version}`);
    return version;
  }

  if (!major && !minor && !patch) patch = true;
  const result = run('npm', ['view', packageName, 'version', '--json'], { cwd, encoding: 'utf8', shell: false });
  let currentVersion = '0.0.0';
  if (result.error || result.status !== 0) {
    const failure = classifyNpmViewFailure(result);
    if (failure !== 'package-absent') {
      const error = resultError('npm view', result);
      error.message = `npm view failed (${failure}): ${error.message}`;
      throw error;
    }
  } else {
    let response;
    try {
      response = JSON.parse(result.stdout);
    } catch (error) {
      throw new Error(`npm view returned malformed JSON: ${error.message}`);
    }
    if (typeof response !== 'string' || !semver.valid(response)) {
      throw new Error(`npm view returned an invalid package version: ${JSON.stringify(response)}`);
    }
    currentVersion = response;
  }

  if (major) return semver.inc(currentVersion, 'major');
  if (minor) return semver.inc(currentVersion, 'minor');
  return semver.inc(currentVersion, 'patch');
}

function publishedMetadata(source, rootPackageData, targetVersion) {
  const packageData = _.cloneDeep(source);
  for (const field of ['version', 'dependencies', 'peerDependencies']) {
    if (_.isString(packageData[field])) {
      if (packageData[field] === VER_PLACEHOLDER) packageData[field] = targetVersion;
    } else if (_.isPlainObject(packageData[field])) {
      for (const key of Object.keys(packageData[field])) {
        if (packageData[field][key] === VER_PLACEHOLDER) packageData[field][key] = targetVersion;
      }
    }
  }
  for (const field of ['license', 'author']) {
    if (packageData[field] === FIELD_PLACEHOLDER || packageData[field] === undefined) {
      packageData[field] = rootPackageData[field];
    }
  }
  return _.pick(packageData, PUBLISH_FIELDS);
}

function copyPackageFiles(rootDir, packageDir, destination) {
  for (const { file, preferRoot } of [
    { file: 'LICENSE', preferRoot: true },
    { file: 'README.md', preferRoot: false },
    { file: 'llms.txt', preferRoot: false },
  ]) {
    const rootSource = path.join(rootDir, file);
    const packageSource = path.join(packageDir, file);
    const source = preferRoot && fse.pathExistsSync(rootSource) ? rootSource : packageSource;
    if (fse.pathExistsSync(source)) fse.copyFileSync(source, path.join(destination, file));
  }
}

function packageManifest(metadata, name, exportsMap) {
  return {
    ...metadata,
    name,
    publishConfig: { access: 'public' },
    ...(exportsMap ? { exports: exportsMap } : {}),
  };
}

function packStage(run, stageDir, releaseDir) {
  const result = runChecked(run, 'npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', releaseDir], {
    cwd: stageDir,
    encoding: 'utf8',
    shell: false,
  });
  let response;
  try {
    response = JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`npm pack returned malformed JSON: ${error.message}`);
  }
  const filename = response[0]?.filename;
  if (typeof filename !== 'string' || path.basename(filename) !== filename) {
    throw new Error('npm pack did not return a safe tarball filename');
  }
  const tarball = path.join(releaseDir, filename);
  if (!fse.pathExistsSync(tarball)) throw new Error(`npm pack did not create ${tarball}`);
  return tarball;
}

async function prepareAngular({ rootDir, packageDir, source, metadata, targetVersion, run, log }) {
  const releaseDir = path.join(packageDir, 'release');
  const stagesDir = path.join(releaseDir, 'staged');
  fse.removeSync(releaseDir);
  fse.ensureDirSync(stagesDir);
  const prepared = [];

  for (const bundle of ['', ...(_.isArray(source.bundles) ? source.bundles : [])]) {
    const variant = bundle || 'plain';
    const name = bundle ? `${source.name}-${bundle}` : source.name;
    const stageDir = path.join(stagesDir, variant);
    const bundleArgs = ['bundle'];
    if (bundle) bundleArgs.push(bundle);
    bundleArgs.push('--stage', stageDir);
    log(`Preparing ${name}`);
    runChecked(run, 'pnpm', bundleArgs, { cwd: packageDir, stdio: 'inherit', shell: false });

    const exportsMap = parseJson(path.join(stageDir, 'exports.json'));
    fse.removeSync(path.join(stageDir, 'exports.json'));
    copyPackageFiles(rootDir, packageDir, stageDir);
    writeJson(path.join(stageDir, 'package.json'), packageManifest(metadata, name, exportsMap));
    runChecked(
      run,
      process.execPath,
      [
        path.join(packageDir, 'validate-package.mjs'),
        '--workspace',
        packageDir,
        '--package',
        stageDir,
        '--variant',
        variant,
      ],
      { cwd: rootDir, stdio: 'inherit', shell: false },
    );
    const tarball = packStage(run, stageDir, releaseDir);
    prepared.push({ name, stageDir, tarball, targetVersion });
  }
  return prepared;
}

function prepareReact({ rootDir, packageDir, source, metadata, run }) {
  const publishDir = path.join(packageDir, 'dist');
  const prepared = [];
  const names = [source.name, ...(_.isArray(source.additionalNames) ? source.additionalNames : [])];
  for (const bundle of ['', ...(_.isArray(source.bundles) ? source.bundles : [])]) {
    const bundleArgs = ['bundle'];
    if (bundle) bundleArgs.push(bundle);
    runChecked(run, 'pnpm', bundleArgs, { cwd: packageDir, stdio: 'inherit', shell: false });
    copyPackageFiles(rootDir, packageDir, publishDir);
    for (const baseName of names) {
      const name = bundle ? `${baseName}-${bundle}` : baseName;
      writeJson(path.join(publishDir, 'package.json'), packageManifest(metadata, name));
      prepared.push({ name, stageDir: publishDir });
    }
  }
  return prepared;
}

export async function runRelease(options, dependencies = {}) {
  const rootDir = path.resolve(dependencies.rootDir ?? REPOSITORY_ROOT);
  const run = dependencies.run ?? runProcess;
  const log = dependencies.log ?? console.log;
  const packageDir = path.join(rootDir, 'packages', options.context);
  const source = parseJson(path.join(packageDir, 'package.json'));
  if (!source.name) throw new Error(`${packageDir}/package.json has no package name`);
  const rootPackageData = parseJson(path.join(rootDir, 'package.json'));
  const targetVersion = await determineTargetVersion(source.name, options, run, rootDir);
  const metadata = publishedMetadata(source, rootPackageData, targetVersion);
  log(`Target version ${targetVersion}`);

  const prepared =
    options.context === 'angular'
      ? await prepareAngular({ rootDir, packageDir, source, metadata, targetVersion, run, log })
      : prepareReact({ rootDir, packageDir, source, metadata, run });

  if (options.prepareOnly) {
    for (const item of prepared) log(`Prepared ${item.name}${item.tarball ? ` at ${item.tarball}` : ''}`);
    return prepared;
  }

  for (const item of prepared) {
    const args = ['publish', item.tarball ?? item.stageDir, '--access', 'public'];
    if (options.otp) args.push('--otp', options.otp);
    log(`Publishing ${item.name}${options.otp ? ' with OTP authentication' : ''}`);
    runChecked(run, 'npm', args, { cwd: rootDir, stdio: 'inherit', shell: false });
  }
  return prepared;
}

function parseArguments(argv) {
  return yargs(argv)
    .version(false)
    .option('version', { type: 'string', describe: 'Explicit semver version to set' })
    .option('major', { type: 'boolean', default: false })
    .option('minor', { type: 'boolean', default: false })
    .option('patch', { type: 'boolean', default: false })
    .option('otp', { type: 'string', describe: '2FA code for npm publish' })
    .option('prepare-only', {
      type: 'boolean',
      default: false,
      describe: 'Build, validate, and pack without publishing',
    })
    .option('context', {
      type: 'string',
      choices: ['react', 'angular'],
      demandOption: true,
      describe: 'Specify the framework context',
    })
    .strict()
    .parseSync();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await runRelease(parseArguments(hideBin(process.argv)));
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
