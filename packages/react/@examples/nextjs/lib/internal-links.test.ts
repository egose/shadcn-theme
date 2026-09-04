import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

import { componentsSection, formSection, realExamplesSection, widgetsSection } from './sections';

const root = path.resolve(__dirname, '..');

/** Static routes that exist outside the registry (catalog home, section indexes). */
const KNOWN_LOCAL_ROUTES = new Set(['/']);

const registryUrls = new Set(
  [componentsSection, formSection, widgetsSection, realExamplesSection].flatMap((section) => [
    section.base,
    ...section.entries.map((e) => e.url),
  ]),
);

function listSources(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSources(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

const sourceFiles = [...listSources(path.join(root, 'app')), ...listSources(path.join(root, 'components'))];

/** Collect string-literal hrefs: href="...", href='...', and href={'...'} variants. */
function staticHrefs(source: string): string[] {
  return [...source.matchAll(/href=\{?\s*["'`]([^"'`{}]+)["'`]\s*\}?/g)].map((m) => m[1]);
}

describe('internal links', () => {
  it('no example source links to a dead internal /docs route', () => {
    for (const file of sourceFiles) {
      const text = fs.readFileSync(file, 'utf8');
      expect(text, path.relative(root, file)).not.toMatch(/href=\{?\s*["'`]\/docs(\/|["'`])/);
    }
  });

  it('every hardcoded internal href resolves to a registry URL or known route', () => {
    const unresolved: string[] = [];
    for (const file of sourceFiles) {
      for (const href of staticHrefs(fs.readFileSync(file, 'utf8'))) {
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) continue;
        if (!registryUrls.has(href) && !KNOWN_LOCAL_ROUTES.has(href)) {
          unresolved.push(`${path.relative(root, file)} -> ${href}`);
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  it('retains no inactive prototype modules', () => {
    expect(fs.existsSync(path.join(root, 'app', 'layout2.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'components', 'code.tsx'))).toBe(false);
  });

  it('no example source uses a blocking alert() for outcomes', () => {
    for (const file of sourceFiles) {
      const text = fs.readFileSync(file, 'utf8');
      expect(text, path.relative(root, file)).not.toMatch(/(^|[^.\w])alert\(/);
    }
  });
});
