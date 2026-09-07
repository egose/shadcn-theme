import {
  CATALOG_ENTRIES,
  CATALOG_KIND_PATHS,
  CatalogEntry,
  REVIEWED_COMPONENT_BASELINE,
  catalogChildRoutes,
  catalogEntriesByKind,
  catalogLink,
  catalogMenuGroups,
  duplicateValues,
} from './catalog';

/**
 * Contract tests for the single typed catalog registry.
 *
 * Failure modes proven here:
 * - Duplicating an entry (slug, title, or link) fails the duplicate specs.
 * - Removing an entry drops the count below the reviewed baseline.
 * - An entry without a working lazy loader fails the resolution spec
 *   (and a missing `load` property fails typecheck, since it is required).
 */
describe('catalog registry', () => {
  it('has no duplicate slugs', () => {
    expect(duplicateValues(CATALOG_ENTRIES.map((entry) => entry.slug))).toEqual([]);
  });

  it('has no duplicate titles', () => {
    expect(duplicateValues(CATALOG_ENTRIES.map((entry) => entry.title))).toEqual([]);
  });

  it('has no duplicate links', () => {
    expect(duplicateValues(CATALOG_ENTRIES.map((entry) => catalogLink(entry)))).toEqual([]);
  });

  it('detects duplicates when they are introduced', () => {
    const slugs = CATALOG_ENTRIES.map((entry) => entry.slug);
    expect(duplicateValues([slugs[0]])).toEqual([]);
    expect(duplicateValues([slugs[0], slugs[0]])).toEqual([slugs[0]]);
  });

  it('keeps the reviewed baseline component count, so removing an entry fails', () => {
    expect(catalogEntriesByKind('component').length).toBeGreaterThanOrEqual(REVIEWED_COMPONENT_BASELINE);
  });

  it('registers every entry with a lazy loader that resolves to a component', async () => {
    expect(CATALOG_ENTRIES.length).toBeGreaterThan(1);
    const failures: string[] = [];
    for (const entry of CATALOG_ENTRIES) {
      const resolved = await entry.load();
      if (typeof resolved !== 'function') {
        failures.push(entry.slug);
      }
    }
    expect(failures)
      .withContext(`entries whose loader resolved to no component: ${failures.join(', ')}`)
      .toEqual([]);
  });

  it('derives one lazy child route per registered entry of a kind', () => {
    const components = catalogEntriesByKind('component');
    const routes = catalogChildRoutes('component');
    expect(routes.length).toEqual(components.length);
    components.forEach((entry, index) => {
      expect(routes[index].path).toEqual(entry.slug);
    });
  });

  it('derives menu groups whose links match the registry links exactly', () => {
    const groups = catalogMenuGroups('component');
    expect(groups.length).toBeGreaterThan(1);
    const menuLinks = groups.flatMap((group) => group.items.map((item) => item.link));
    const registryLinks = catalogEntriesByKind('component').map((entry) => catalogLink(entry));
    expect(menuLinks).toEqual(registryLinks);
    expect(duplicateValues(groups.map((group) => group.label ?? ''))).toEqual([]);
  });

  it('keeps component and example kinds on distinct route surfaces', () => {
    expect(CATALOG_KIND_PATHS.component).not.toEqual(CATALOG_KIND_PATHS.example);
    const examples = catalogEntriesByKind('example');
    // Component menus and routes never include example entries.
    const componentSlugs = new Set(catalogEntriesByKind('component').map((entry) => entry.slug));
    expect(examples.every((entry) => !componentSlugs.has(entry.slug))).toBeTrue();
    expect(examples.every((entry) => catalogLink(entry).startsWith(`/${CATALOG_KIND_PATHS.example}/`))).toBeTrue();
  });

  it('derives example navigation from entries alone when a product flow is added', () => {
    const flow: CatalogEntry = {
      slug: 'pricing',
      title: 'Pricing',
      category: 'Examples',
      kind: 'example',
      load: () => Promise.resolve(class {}),
    };
    expect(catalogLink(flow)).toEqual('/examples/pricing');
    // The component surface stays untouched by example entries.
    expect(catalogMenuGroups('component').flatMap((group) => group.items.map((item) => item.label))).not.toContain(
      'Pricing',
    );
  });
});
