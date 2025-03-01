import { execSync } from 'child_process';
import _ from 'lodash';
import fse from 'fs-extra';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

let { tag } = argv;
if (!tag) throw Error('tag not supplied');

if (tag.startsWith('v')) tag = tag.substring(1);
console.log(`target tag ${tag}`);

const VER_PLACEHOLDER = '0.0.0-PLACEHOLDER';
const PACKAGE_DIR = 'package';
const PUBLISH_DIR = 'dist';

const parseJson = (dir) => {
  const content = fse.readFileSync(dir).toString('utf-8');
  return JSON.parse(content);
};

const writeJson = (dir, object) => {
  fse.writeFileSync(dir, Buffer.from(JSON.stringify(object, null, 2), 'utf-8'));
};

function main() {
  execSync(`cd ${PACKAGE_DIR} && pnpm bundle`);

  const publishDir = `${PACKAGE_DIR}/${PUBLISH_DIR}`;
  const originalPackageJSON = `${PACKAGE_DIR}/package.json`;
  const targetPackageJSON = `${publishDir}/package.json`;
  let packageData = parseJson(originalPackageJSON);

  ['version', 'dependencies', 'peerDependencies'].forEach((type) => {
    if (!packageData[type]) return;

    if (_.isString(packageData[type])) {
      if (packageData[type] === VER_PLACEHOLDER) packageData[type] = tag;
    } else if (_.isPlainObject(packageData[type])) {
      _.each(packageData[type], (val, key) => {
        if (val === VER_PLACEHOLDER) packageData[type][key] = tag;
      });
    }
  });

  if (!packageData.name) return;
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

main();
