import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { componentsSection, formSection, realExamplesSection, widgetsSection } from './sections';

const root = path.resolve(__dirname, '..');
const sections = [componentsSection, formSection, widgetsSection, realExamplesSection];

function filesUnder(directory: string): string[] {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const file = `${directory}/${entry.name}`;
    return entry.isDirectory() ? filesUnder(file) : [file];
  });
}

function inventoryErrors(files: string[]): string[] {
  const errors: string[] = [];
  for (const file of files) {
    // Deliberate non-entry exclusions: tests, declarations, shared helpers, and
    // the existing shared showcase fixture. Real-flow internals are not entries.
    if (/\.(test|spec)\.tsx?$|\.d\.ts$/.test(file) || /\/(?:_shared|__tests__)\//.test(file)) continue;
    if (file === 'components/showcases/fixtures.ts') continue;
    let sectionName: string;
    let slug: string;
    if (file.startsWith('components/showcases/') && /\.tsx?$/.test(file)) {
      const match = /^components\/showcases\/([^/]+)\/([^/]+)\.tsx?$/.exec(file);
      if (!match) {
        errors.push(`${file}: unexpected showcase location; keep helpers in _shared/`);
        continue;
      }
      [, sectionName, slug] = match;
    } else {
      const match = /^components\/real-examples\/([^/]+)\/index\.tsx?$/.exec(file);
      if (!match) continue;
      sectionName = 'real-examples';
      slug = match[1];
    }
    const entry = sections.find((section) => section.name === sectionName)?.entries.find((item) => item.slug === slug);
    if (!entry || entry.route !== 'dynamic') {
      errors.push(`${file}: missing dynamic registry entry /${sectionName}/${slug}`);
    }
  }
  return errors;
}

describe('reverse example inventory', () => {
  it('registers every owned showcase module and real-example entry module', () => {
    const files = [...filesUnder('components/showcases'), ...filesUnder('components/real-examples')];
    expect(files.length).toBeGreaterThan(0);
    expect(inventoryErrors(files)).toEqual([]);
  });

  it('points each dynamic loader at its owned module, rather than an unrelated valid demo', async () => {
    for (const section of sections) {
      for (const entry of section.entries) {
        if (entry.route !== 'dynamic') continue;
        const stem =
          section.name === 'real-examples'
            ? `components/real-examples/${entry.slug}/index`
            : `components/showcases/${section.name}/${entry.slug}`;
        const file = ['.tsx', '.ts'].map((extension) => path.join(root, stem + extension)).find(fs.existsSync);
        expect(file, `${entry.url} owned implementation`).toBeDefined();
        const implementation = await import(/* @vite-ignore */ file!);
        expect((await entry.load()).default, `${entry.url} loader target`).toBe(implementation.default);
      }
    }
  }, 30000);

  it('rejects orphan showcase and real-example fixtures', () => {
    expect(
      inventoryErrors([
        'components/showcases/components/orphan-probe.tsx',
        'components/real-examples/orphan-probe/index.tsx',
      ]),
    ).toEqual([
      'components/showcases/components/orphan-probe.tsx: missing dynamic registry entry /components/orphan-probe',
      'components/real-examples/orphan-probe/index.tsx: missing dynamic registry entry /real-examples/orphan-probe',
    ]);
  });

  it('deliberately excludes helper/test modules without excluding ordinary example entries', () => {
    expect(
      inventoryErrors([
        'components/showcases/fixtures.ts',
        'components/showcases/_shared/helper.tsx',
        'components/showcases/components/button.test.tsx',
        'components/showcases/form/checkbox.spec.tsx',
        'components/showcases/form/types.d.ts',
        'components/real-examples/_shared/index.tsx',
        'components/real-examples/customers/components/index.tsx',
        'components/real-examples/customers/fixtures.ts',
        'components/real-examples/customers/customers.test.tsx',
      ]),
    ).toEqual([]);
    expect(inventoryErrors(['components/showcases/unknown/example.tsx'])).toHaveLength(1);
  });
});
