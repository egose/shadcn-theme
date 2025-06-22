import { execSync } from 'child_process';
import semver from 'semver';
import _ from 'lodash';
import fse from 'fs-extra';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .version(false) // disable yargs' default --version boolean flag
  .option('version', {
    type: 'string',
    describe: 'Explicit semver version to set',
  })
  .option('major', { type: 'boolean', default: false })
  .option('minor', { type: 'boolean', default: false })
  .option('patch', { type: 'boolean', default: false })
  .option('context', {
    type: 'string',
    choices: ['react', 'angular'],
    demandOption: true,
    describe: 'Specify the framework context',
  }).argv;

const { version, major, minor, patch, context } = argv;

const VER_PLACEHOLDER = '0.0.0-PLACEHOLDER';
const PACKAGE_DIR = `packages/${context}`;
const PUBLISH_DIR = 'dist';

const parseJson = (dir) => {
  const content = fse.readFileSync(dir).toString('utf-8');
  return JSON.parse(content);
};

const writeJson = (dir, object) => {
  fse.writeFileSync(dir, Buffer.from(JSON.stringify(object, null, 2), 'utf-8'));
};

async function determineTargetVersion(packageName, { version, major, minor, patch } = {}) {
  if (version) {
    if (version.startsWith('v')) version = version.substring(1);
    if (!semver.valid(version)) {
      throw new Error(`Invalid semver version provided: ${version}`);
    }

    return version;
  }

  if (!major && !minor && !patch) {
    patch = true;
  }

  let currentVersion = '0.0.0';

  try {
    const stdout = execSync(`npm show ${packageName} version`, { encoding: 'utf-8' }).trim();
    if (semver.valid(stdout)) {
      currentVersion = stdout;
    }
  } catch (err) {
    // Assume package not published yet; fallback to 0.0.0
  }

  let newVersion;

  if (major) {
    newVersion = semver.inc(currentVersion, 'major');
  } else if (minor) {
    newVersion = semver.inc(currentVersion, 'minor');
  } else if (patch) {
    newVersion = semver.inc(currentVersion, 'patch');
  }

  return newVersion;
}

async function main() {
  const publishDir = `${PACKAGE_DIR}/${PUBLISH_DIR}`;
  const originalPackageJSON = `${PACKAGE_DIR}/package.json`;
  const targetPackageJSON = `${publishDir}/package.json`;
  let packageData = parseJson(originalPackageJSON);
  if (!packageData.name) return;

  const targetVersion = await determineTargetVersion(packageData.name, { version, major, minor, patch });
  console.log(`target version ${targetVersion}`);

  execSync(`cd ${PACKAGE_DIR} && pnpm bundle`);

  ['version', 'dependencies', 'peerDependencies'].forEach((type) => {
    if (!packageData[type]) return;

    if (_.isString(packageData[type])) {
      if (packageData[type] === VER_PLACEHOLDER) packageData[type] = targetVersion;
    } else if (_.isPlainObject(packageData[type])) {
      _.each(packageData[type], (val, key) => {
        if (val === VER_PLACEHOLDER) packageData[type][key] = targetVersion;
      });
    }
  });

  const names = [packageData.name];
  if (_.isArray(packageData.additionalNames)) names.push(...packageData.additionalNames);

  packageData = _.pick(packageData, [
    'version',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'license',
    'author',
    'sideEffects',
    'repository',
    'dependencies',
    'peerDependencies',
    'publishConfig',
    'release',
    'engines',
    'main',
    'module',
    'types',
    'exports',
  ]);

  ['LICENSE', 'README.md'].forEach((file) => {
    const src = `${PACKAGE_DIR}/${file}`;
    const dest = `${publishDir}/${file}`;

    try {
      execSync(`test -f "${src}" && cp "${src}" "${dest}"`, { stdio: 'inherit' });
    } catch (error) {
      // Ignore errors if the file does not exist
    }
  });

  _.forEach(names, (name) => {
    const packageJSON = {
      ...packageData,
      name,
    };

    console.log(packageJSON);

    writeJson(targetPackageJSON, packageJSON);
    execSync(`cd ${publishDir} && npm publish --access public`);
  });
}

main().catch(console.error);
