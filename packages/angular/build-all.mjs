import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, readFile, readdir, rm, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { __unstable__loadDesignSystem } from 'tailwindcss';
import ts from 'typescript';

const PLAIN_PACKAGE = '@egose/shadcn-theme-ng';
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function getAllFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await getAllFiles(file)));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}

function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function compareProjectSets(errors, expected, actual, label) {
  const missing = setDifference(expected, actual);
  const unexpected = setDifference(actual, expected);
  if (missing.length) errors.push(`${label} is missing: ${missing.join(', ')}`);
  if (unexpected.length) errors.push(`${label} has unexpected entries: ${unexpected.join(', ')}`);
}

function projectsFromPaths(paths, targetForProject, errors, label) {
  const projects = new Set();
  for (const [alias, targets] of Object.entries(paths ?? {})) {
    if (!alias.startsWith(`${PLAIN_PACKAGE}/`)) continue;
    const name = alias.slice(PLAIN_PACKAGE.length + 1);
    projects.add(name);
    const expected = targetForProject(name);
    if (!Array.isArray(targets) || targets.length !== 1 || targets[0] !== expected) {
      errors.push(`${label} ${alias} must target ${expected}`);
    }
  }
  return projects;
}

export async function readPublishableProjects(workspaceDir = scriptDirectory) {
  const projects = await readJson(path.join(workspaceDir, 'publishable-projects.json'));
  if (!Array.isArray(projects) || projects.some((name) => typeof name !== 'string' || !name)) {
    throw new Error('publishable-projects.json must be a non-empty array of project names');
  }
  const unique = new Set(projects);
  if (unique.size !== projects.length) throw new Error('publishable-projects.json contains duplicate project names');
  const sorted = [...projects].sort();
  if (projects.some((name, index) => name !== sorted[index])) {
    throw new Error('publishable-projects.json must be sorted');
  }
  return projects;
}

export async function validateProjectMembership(workspaceDir = scriptDirectory) {
  const projects = await readPublishableProjects(workspaceDir);
  const expected = new Set(projects);
  const errors = [];
  const sourceEntries = await readdir(path.join(workspaceDir, 'projects'), { withFileTypes: true });
  const sourceProjects = new Set(sourceEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  const angular = await readJson(path.join(workspaceDir, 'angular.json'));
  const tsconfig = await readJson(path.join(workspaceDir, 'tsconfig.json'));
  const buildTsconfig = await readJson(path.join(workspaceDir, 'tsconfig.build.json'));

  compareProjectSets(errors, expected, sourceProjects, 'projects directory');
  compareProjectSets(errors, expected, new Set(Object.keys(angular.projects ?? {})), 'angular.json projects');
  compareProjectSets(
    errors,
    expected,
    projectsFromPaths(
      tsconfig.compilerOptions?.paths,
      (name) => `./projects/${name}/src/public-api.ts`,
      errors,
      'TypeScript path',
    ),
    'TypeScript paths',
  );
  compareProjectSets(
    errors,
    expected,
    projectsFromPaths(buildTsconfig.compilerOptions?.paths, (name) => `./dist/${name}`, errors, 'Build path'),
    'build TypeScript paths',
  );

  for (const project of projects) {
    for (const required of ['ng-package.json', 'src/public-api.ts']) {
      if (!existsSync(path.join(workspaceDir, 'projects', project, required))) {
        errors.push(`Project ${project} is missing ${required}`);
      }
    }
  }
  if (errors.length) throw new Error(`Angular project membership is invalid:\n- ${errors.join('\n- ')}`);
  return projects;
}

async function getProjectDependencies(workspaceDir, name, knownProjects) {
  const files = await getAllFiles(path.join(workspaceDir, 'projects', name, 'src'));
  const dependencies = new Set();
  const importPattern = /@egose\/shadcn-theme-ng\/([a-z0-9-]+)/g;
  for (const file of files.filter((candidate) => candidate.endsWith('.ts'))) {
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(importPattern)) {
      if (match[1] !== name && knownProjects.has(match[1])) dependencies.add(match[1]);
    }
  }
  return dependencies;
}

function findCycle(projects, dependencyMap) {
  const visited = new Set();
  const active = new Set();
  const stack = [];
  function visit(project) {
    visited.add(project);
    active.add(project);
    stack.push(project);
    for (const dependency of [...(dependencyMap.get(project) ?? [])].sort()) {
      if (!visited.has(dependency)) {
        const cycle = visit(dependency);
        if (cycle) return cycle;
      } else if (active.has(dependency)) {
        return [...stack.slice(stack.indexOf(dependency)), dependency];
      }
    }
    stack.pop();
    active.delete(project);
  }
  for (const project of [...projects].sort()) {
    if (!visited.has(project)) {
      const cycle = visit(project);
      if (cycle) return cycle;
    }
  }
}

export function orderProjects(projects, dependencyMap) {
  const remaining = new Map(projects.map((project) => [project, new Set(dependencyMap.get(project) ?? [])]));
  const dependents = new Map();
  for (const [project, dependencies] of remaining) {
    for (const dependency of dependencies) {
      if (!remaining.has(dependency)) throw new Error(`${project} depends on unknown project ${dependency}`);
      if (!dependents.has(dependency)) dependents.set(dependency, new Set());
      dependents.get(dependency).add(project);
    }
  }
  const ready = projects.filter((project) => remaining.get(project).size === 0).sort();
  const ordered = [];
  while (ready.length) {
    const project = ready.shift();
    ordered.push(project);
    for (const dependent of [...(dependents.get(project) ?? [])].sort()) {
      const dependencies = remaining.get(dependent);
      dependencies.delete(project);
      if (dependencies.size === 0) {
        ready.push(dependent);
        ready.sort();
      }
    }
  }
  if (ordered.length !== projects.length) {
    const cycle = findCycle(
      projects.filter((project) => !ordered.includes(project)),
      remaining,
    );
    throw new Error(`Angular project dependency cycle: ${cycle?.join(' -> ') ?? 'unknown cycle'}`);
  }
  return ordered;
}

const tailwindDesignSystem = await __unstable__loadDesignSystem(`
  @theme {
    --breakpoint-sm: 40rem;
    --breakpoint-md: 48rem;
    --breakpoint-lg: 64rem;
    --breakpoint-xl: 80rem;
    --breakpoint-2xl: 96rem;
    --color-*: initial;
    --spacing-*: initial;
  }
`);

function isTailwindCandidate(token) {
  const canonical = token.replace(/^tw:/, '');
  return /^(?:group|peer)(?:\/[\w-]+)?$/.test(canonical) || tailwindDesignSystem.parseCandidate(canonical).length > 0;
}

export function transformTailwindClassList(value, bundle = '') {
  return value.replace(/\S+/g, (token) => {
    const canonical = token.replace(/^tw:/, '');
    if (!isTailwindCandidate(token)) return token;
    return bundle ? `${bundle}:${canonical}` : canonical;
  });
}

function transformTemplateClasses(template, bundle) {
  return template.replace(/(\bclass\s*=\s*)(["'])([\s\S]*?)\2/g, (_match, attribute, quote, classes) => {
    return `${attribute}${quote}${transformTailwindClassList(classes, bundle)}${quote}`;
  });
}

function propertyName(node) {
  if (node && (ts.isIdentifier(node) || ts.isStringLiteral(node))) return node.text;
}

function callName(node) {
  if (ts.isIdentifier(node.expression)) return node.expression.text;
}

export function transformJavaScriptClasses(source, bundle = '', fileName = 'artifact.mjs') {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const replacements = [];

  function visit(node, classContext = false, templateContext = false) {
    if (ts.isStringLiteralLike(node)) {
      let updated = node.text;
      if (templateContext) updated = transformTemplateClasses(updated, bundle);
      else if (classContext || /(?:^|\s)tw:/.test(updated)) updated = transformTailwindClassList(updated, bundle);
      if (updated !== node.text) {
        replacements.push({ start: node.getStart(sourceFile), end: node.getEnd(), value: JSON.stringify(updated) });
      }
      return;
    }

    if (ts.isCallExpression(node) && ['classes', 'hlm', 'cva'].includes(callName(node))) {
      ts.forEachChild(node.expression, (child) => visit(child));
      for (const argument of node.arguments) visit(argument, true);
      return;
    }

    if (ts.isPropertyAssignment(node)) {
      const name = propertyName(node.name);
      visit(node.initializer, classContext || name === 'class', name === 'template');
      return;
    }

    ts.forEachChild(node, (child) => visit(child, classContext, templateContext));
  }

  visit(sourceFile);
  let transformed = source;
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    transformed = `${transformed.slice(0, replacement.start)}${replacement.value}${transformed.slice(replacement.end)}`;
  }
  return transformed;
}

async function transformArtifacts(directory, bundle) {
  const packageName = bundle ? `${PLAIN_PACKAGE}-${bundle}` : PLAIN_PACKAGE;
  for (const file of await getAllFiles(directory)) {
    if (file.endsWith('.map')) {
      await unlink(file);
      continue;
    }
    if (!file.endsWith('.mjs') && !file.endsWith('.d.ts')) continue;
    const content = await readFile(file, 'utf8');
    let updated = content.replaceAll(`${PLAIN_PACKAGE}/`, `${packageName}/`);
    if (file.endsWith('.mjs')) {
      updated = transformJavaScriptClasses(updated.replace(/^\/\/# sourceMappingURL=.*$/gm, ''), bundle, file);
    }
    if (updated !== content) await writeFile(file, updated, 'utf8');
  }
}

function resolveOutputTarget(project, metadata, condition) {
  const target = metadata.exports?.['.']?.[condition] ?? (condition === 'types' ? metadata.typings : metadata.module);
  if (typeof target !== 'string' || !target) {
    throw new Error(`${project} output package.json has no ${condition} entry`);
  }
  return `./${path.posix.join(project, target.replace(/^\.\//, ''))}`;
}

function defaultBuildProject(workspaceDir, project) {
  const result = spawnSync('pnpm', ['ng', 'build', project], { cwd: workspaceDir, encoding: 'utf8', stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`pnpm ng build ${project} exited with status ${result.status}`);
}

export async function buildAngularPackage({
  workspaceDir = scriptDirectory,
  bundle = '',
  stageDir,
  buildProject = defaultBuildProject,
} = {}) {
  if (bundle && bundle !== 'tw') throw new Error('Angular bundle must be empty or tw');
  const projects = await validateProjectMembership(workspaceDir);
  const knownProjects = new Set(projects);
  const dependencyMap = new Map();
  for (const project of projects) {
    dependencyMap.set(project, await getProjectDependencies(workspaceDir, project, knownProjects));
  }
  const orderedProjects = orderProjects(projects, dependencyMap);
  const distDirectory = path.join(workspaceDir, 'dist');
  await rm(distDirectory, { recursive: true, force: true });

  const failures = [];
  for (const project of orderedProjects) {
    try {
      await buildProject(workspaceDir, project);
    } catch (error) {
      failures.push(new Error(`${project}: ${error.message}`, { cause: error }));
    }
  }
  if (failures.length) {
    await rm(distDirectory, { recursive: true, force: true });
    throw new AggregateError(failures, `Failed to build ${failures.length} Angular project(s)`);
  }

  const exportsMap = {};
  const outputErrors = [];
  for (const project of projects) {
    try {
      const metadata = await readJson(path.join(distDirectory, project, 'package.json'));
      const types = resolveOutputTarget(project, metadata, 'types');
      const runtime = resolveOutputTarget(project, metadata, 'default');
      for (const target of [types, runtime]) {
        if (!existsSync(path.join(distDirectory, target))) throw new Error(`missing emitted target ${target}`);
      }
      exportsMap[`./${project}`] = { types, default: runtime };
    } catch (error) {
      outputErrors.push(new Error(`${project}: ${error.message}`, { cause: error }));
    }
  }
  if (outputErrors.length) {
    await rm(distDirectory, { recursive: true, force: true });
    throw new AggregateError(outputErrors, `Invalid output for ${outputErrors.length} Angular project(s)`);
  }

  await transformArtifacts(distDirectory, bundle);
  await writeFile(path.join(distDirectory, 'exports.json'), `${JSON.stringify(exportsMap, null, 2)}\n`);
  if (stageDir) {
    const stagedDirectory = path.resolve(workspaceDir, stageDir);
    if (stagedDirectory === distDirectory || stagedDirectory.startsWith(`${distDirectory}${path.sep}`)) {
      throw new Error('Variant stage directory must be outside dist');
    }
    await rm(stagedDirectory, { recursive: true, force: true });
    await cp(distDirectory, stagedDirectory, { recursive: true });
  }
  return { projects: orderedProjects, exports: exportsMap };
}

function parseCliArguments(argv) {
  const options = { bundle: '' };
  for (let index = 0; index < argv.length; index++) {
    if (argv[index] === '--stage') {
      if (!argv[index + 1]) throw new Error('--stage requires a directory');
      options.stageDir = argv[++index];
    } else if (!options.bundle) options.bundle = argv[index];
    else throw new Error(`Unexpected argument: ${argv[index]}`);
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await buildAngularPackage(parseCliArguments(process.argv.slice(2)));
    console.log(`Built ${result.projects.length} Angular projects`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
