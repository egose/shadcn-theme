import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('package quality command boundaries', () => {
  it('keeps source tests and artifact validation independently runnable', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts.test).toBe('vitest run');
    expect(packageJson.scripts['test:package']).toContain('test:package-validator');
    expect(packageJson.scripts['test:package']).toContain('prepare:package');
    expect(packageJson.scripts['test:package']).toContain('validate:package');
    expect(packageJson.scripts).not.toHaveProperty('build');
  });
});
