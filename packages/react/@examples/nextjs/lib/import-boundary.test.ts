import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Dependency-boundary guard (NEXTEX-04).
 *
 * This app is a source-integration playground: package imports use the
 * `@egose/shadcn-theme/*` specifier scheme (mapped to parent source via
 * tsconfig paths), example-local imports use the `@/*` alias or short
 * relative paths, and every other bare specifier must be a dependency
 * declared in this app's `package.json`.
 *
 * Forbidden:
 * - relative imports that reach a `node_modules` directory;
 * - relative imports that escape this example directory (e.g. deep
 *   `../../../../..` parent-source paths).
 */

const EXAMPLE_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIRS = ['app', 'components', 'lib'];
const IMPORT_RE = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]/g;

function collectSourceFiles(): string[] {
  const files: string[] = [];
  for (const dir of SOURCE_DIRS) {
    const stack = [path.join(EXAMPLE_ROOT, dir)];
    while (stack.length > 0) {
      const current = stack.pop()!;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
      }
    }
  }
  return files;
}

function collectImports() {
  const imports: Array<{ file: string; specifier: string }> = [];
  for (const file of collectSourceFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(IMPORT_RE)) {
      const specifier = match[1] ?? match[2];
      if (specifier) imports.push({ file: path.relative(EXAMPLE_ROOT, file), specifier });
    }
  }
  return imports;
}

describe('example import boundary', () => {
  const imports = collectImports();
  const relativeImports = imports.filter(({ specifier }) => specifier.startsWith('.'));

  it('scans at least one source file and finds relative imports to guard', () => {
    expect(collectSourceFiles().length).toBeGreaterThan(0);
    expect(relativeImports.length).toBeGreaterThan(0);
  });

  it('has no relative import reaching a node_modules directory', () => {
    const offenders = relativeImports.filter(({ specifier }) => specifier.split('/').includes('node_modules'));
    expect(offenders).toEqual([]);
  });

  it('has no relative import escaping the example root into parent package source', () => {
    const offenders = relativeImports.filter(({ file, specifier }) => {
      const resolved = path.resolve(EXAMPLE_ROOT, path.dirname(file), specifier);
      const rel = path.relative(EXAMPLE_ROOT, resolved);
      return rel.startsWith('..');
    });
    expect(offenders).toEqual([]);
  });

  it('uses the documented package specifier convention for theme imports', () => {
    // Every parent-theme import must use the single public scheme.
    const themeImports = imports.filter(({ specifier }) => specifier.startsWith('@egose/shadcn-theme'));
    expect(themeImports.length).toBeGreaterThan(0);
    for (const { specifier } of themeImports) {
      expect(specifier).toMatch(/^@egose\/shadcn-theme\/(components\/(ui|form|widgets)|hooks|utils|layouts)(\/|$)/);
    }
  });
});
