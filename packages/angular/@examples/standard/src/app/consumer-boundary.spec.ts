// ANGEX-07 source-mode consumer boundary: proves the generated alias set
// resolves every public subpath (including `menu`) against package source.
// Import-boundary hygiene (no private src/lib, dist, node_modules, or
// unregistered subpaths) is enforced statically by
// packages/angular/test/example-consumer-boundary.test.mjs.
import { EXAMPLE_PUBLIC_MODULES, EXAMPLE_PUBLIC_SUBPATHS } from './example-subpaths.generated';

describe('ANGEX-07 source-mode consumer boundary', () => {
  it('resolves menu and every other public visual subpath without a stale alias list', () => {
    expect(EXAMPLE_PUBLIC_SUBPATHS).toContain('menu');
    const failures: string[] = [];
    for (const subpath of EXAMPLE_PUBLIC_SUBPATHS) {
      const module = EXAMPLE_PUBLIC_MODULES[subpath] as Record<string, unknown> | undefined;
      if (!module || Object.keys(module).length === 0) {
        failures.push(`@egose/shadcn-theme-ng/${subpath}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
