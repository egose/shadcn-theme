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
  .option('otp', { type: 'string', describe: '2FA code for npm publish' })
  .option('context', {
    type: 'string',
    choices: ['react', 'angular'],
    demandOption: true,
    describe: 'Specify the framework context',
  }).argv;

const { version, major, minor, patch, context, otp } = argv;

const VER_PLACEHOLDER = '0.0.0-PLACEHOLDER';
const FIELD_PLACEHOLDER = 'PLACEHOLDER';
const ROOT_PACKAGE_JSON = 'package.json';
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
  const rootPackageData = parseJson(ROOT_PACKAGE_JSON);
  let packageData = parseJson(originalPackageJSON);
  if (!packageData.name) return;

  const targetVersion = await determineTargetVersion(packageData.name, { version, major, minor, patch });
  console.log(`target version ${targetVersion}`);

  const names = [packageData.name];
  if (_.isArray(packageData.additionalNames)) names.push(...packageData.additionalNames);

  const bundles = [''];
  if (_.isArray(packageData.bundles)) bundles.push(...packageData.bundles);

  _.forEach(bundles, (bundle) => {
    execSync(`cd ${PACKAGE_DIR} && pnpm bundle ${bundle}`);

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

    // `license` and `author` are sourced from the root package.json so the two
    // published packages stay in sync with the monorepo's license/authorship
    // without each per-package package.json having to duplicate the values.
    // Per-package values may be the literal string "PLACEHOLDER" (or absent).
    ['license', 'author'].forEach((field) => {
      const rootVal = rootPackageData[field];
      if (rootVal === undefined) return;
      const pkgVal = packageData[field];
      if (pkgVal === FIELD_PLACEHOLDER || pkgVal === undefined) {
        packageData[field] = rootVal;
      }
    });

    packageData = _.pick(packageData, [
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
    ]);

    // LICENSE lives at the repo root and is shared by both packages; README.md
    // and llms.txt are per-package. Fall back to the package dir for LICENSE in
    // case a per-package override exists, but prefer the root copy.
    [
      { file: 'LICENSE', preferRoot: true },
      { file: 'README.md', preferRoot: false },
      { file: 'llms.txt', preferRoot: false },
    ].forEach(({ file, preferRoot }) => {
      const dest = `${publishDir}/${file}`;
      const rootSrc = file; // repo root, cwd is repo root when publish.mjs runs
      const pkgSrc = `${PACKAGE_DIR}/${file}`;
      const src = preferRoot ? (fse.pathExistsSync(rootSrc) ? rootSrc : pkgSrc) : pkgSrc;

      try {
        execSync(`test -f "${src}" && cp "${src}" "${dest}"`, { stdio: 'inherit' });
      } catch (error) {
        // Ignore errors if the file does not exist
      }
    });

    _.forEach(names, (nm) => {
      const name = bundle ? `${nm}-${bundle}` : nm;
      const packageJSON = {
        ...packageData,
        name,
        publishConfig: {
          access: 'public',
        },
      };

      if (context === 'angular') {
        packageJSON.exports = parseJson(`${publishDir}/exports.json`);
      }

      console.log(packageJSON);

      writeJson(targetPackageJSON, packageJSON);

      // exports.json is an internal build artifact used above to populate the
      // Angular `exports` map; it must not ship to consumers.
      if (context === 'angular') {
        fse.removeSync(`${publishDir}/exports.json`);
      }
      let publishCmd = `cd ${publishDir} && npm publish --access public`;
      if (otp) {
        publishCmd += ` --otp ${otp}`;
      }

      console.log(`Executing: ${publishCmd}`);
      execSync(publishCmd, { stdio: 'inherit' });
    });
  });
}

main().catch(console.error);
