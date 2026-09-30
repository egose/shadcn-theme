import { describe, expect, it } from 'vitest';

import type { ExampleSection } from './example-registry';
import { componentsSection, formSection, realExamplesSection, widgetsSection } from './sections';
import { listCatalog } from './example-registry';

import ComponentsPage from '../app/components/[slug]/page';
import FormPage from '../app/form/[slug]/page';
import RealExamplesPage from '../app/real-examples/[slug]/page';

const sections: ExampleSection[] = [componentsSection, formSection, widgetsSection, realExamplesSection];

const allEntries = sections.flatMap((section) => section.entries);

describe('example registry', () => {
  it('discovers the support inbox and derives its primitive reverse links', () => {
    const inbox = listCatalog(realExamplesSection, sections).find(
      (entry) => entry.url === '/real-examples/support-inbox',
    )!;
    expect(inbox.capabilities).toContain('Per-ticket drafts');
    for (const slug of ['resizable', 'scroll-area', 'sheet', 'item']) {
      expect(inbox.related.some((link) => link.url === `/components/${slug}`)).toBe(true);
      const primitive = listCatalog(componentsSection, sections).find((entry) => entry.url === `/components/${slug}`)!;
      expect(primitive.related).toContainEqual({ title: 'Support Inbox', url: '/real-examples/support-inbox' });
    }
  });

  it('retains not-found handling for unknown dynamic slugs', async () => {
    for (const Page of [ComponentsPage, FormPage, RealExamplesPage]) {
      await expect(Page({ params: Promise.resolve({ slug: 'not-a-real-slug' }) })).rejects.toThrow(
        'NEXT_HTTP_ERROR_FALLBACK;404',
      );
    }
  });

  it('keeps discovery capabilities nonempty and distinct when supplied', () => {
    for (const entry of allEntries) {
      const capabilities = entry.capabilities ?? [];
      expect(new Set(capabilities).size, entry.url).toBe(capabilities.length);
      for (const capability of capabilities) expect(capability.trim().length, entry.url).toBeGreaterThan(0);
    }
  });

  it('has no duplicate URLs across the whole catalog', () => {
    const urls = allEntries.map((e) => e.url);
    expect(new Set(urls).size, `duplicate URLs: ${urls.filter((u, i) => urls.indexOf(u) !== i).join(', ')}`).toBe(
      urls.length,
    );
  });

  it('has no duplicate titles within a section', () => {
    for (const section of sections) {
      const titles = section.entries.map((e) => e.title);
      expect(new Set(titles).size, `duplicate titles in ${section.name}`).toBe(titles.length);
    }
  });

  it('has no duplicate slugs within a section', () => {
    for (const section of sections) {
      const slugs = section.entries.map((e) => e.slug);
      expect(new Set(slugs).size, `duplicate slugs in ${section.name}`).toBe(slugs.length);
    }
  });

  it('gives every entry a non-empty description', () => {
    for (const e of allEntries) {
      expect(e.description.trim().length, `${e.url} description`).toBeGreaterThan(0);
    }
  });

  it('derives every URL from its section base and entry slug', () => {
    for (const section of sections) {
      for (const e of section.entries) {
        expect(e.url).toBe(`${section.base}/${e.slug}`);
        expect(e.url.startsWith(`${section.base}/`)).toBe(true);
      }
    }
  });

  for (const section of sections) {
    describe(`/${section.name}`, () => {
      it('every registry entry maps to a dynamic implementation or a dedicated static route', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const appDir = path.resolve(__dirname, '..', 'app', section.name);
        for (const e of section.entries) {
          const hasStaticRoute = fs.existsSync(path.join(appDir, e.slug, 'page.tsx'));
          expect(
            e.route === 'dynamic' || hasStaticRoute,
            `${e.url} needs a loader or a static route under app/${section.name}/${e.slug}/`,
          ).toBe(true);
        }
      });

      it('declares every dynamic slug exactly once via the entry route kind', () => {
        const fromEntries = section.entries.filter((e) => e.route === 'dynamic').map((e) => e.slug);
        expect(section.dynamicSlugs).toEqual(fromEntries);
      });

      it('no slug is both dynamic and a dedicated static route', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const appDir = path.resolve(__dirname, '..', 'app', section.name);
        for (const slug of section.dynamicSlugs) {
          expect(
            fs.existsSync(path.join(appDir, slug, 'page.tsx')),
            `slug "${slug}" is registered dynamically but also has a static route`,
          ).toBe(false);
        }
      });

      it('every dynamic loader resolves to a component module', async () => {
        for (const e of section.entries) {
          if (e.route !== 'dynamic') continue;
          const loaded = await e.load();
          expect(typeof loaded.default, `loader for ${e.url}`).toBe('function');
        }
      }, 30000);
    });
  }
});
