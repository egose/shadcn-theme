// ANGEX-08 deployment smoke checks for the GitHub Pages routing contract.
//
// Routing contract: every registered route is prerendered to static HTML at
// build time (angular.json `prerender: true`, discovered from the Router
// config which is derived from the typed catalog registry), so deep links
// load directly with a 200. The redirect roots (`/`, `/components`) and
// unknown URLs are served from shell copies materialized at deploy time
// (`index.html`, `components/index.html`, `404.html` ← `index.csr.html`);
// the client router then redirects or renders the intentional not-found page.
//
// This script derives every expected URL from the single typed registry
// (`src/app/catalog/catalog.ts`) — there is no second slug list here. It
// serves the production build output with GitHub-Pages-like semantics
// (directory index files, `404.html` fallback) and asserts over HTTP:
//   - `/` → 200 (shell boots, client router redirects into the gallery)
//   - every registry component route → 200 with its prerendered page title
//   - the first `example`-kind entry too, once Wave 4 adds one (skipped until
//     then — the derivation already covers the `examples/` surface)
//   - unknown component and root URLs → Pages-style 404 serving the fallback
//     shell (which boots the SPA; wildcard rendering itself is covered by the
//     Karma `wildcard recovery` suite)
//   - reverse check: every prerendered route directory maps back to a
//     registry slug, so stale output cannot hide
//
// Run: `pnpm smoke:deploy [--dist <dir>]` (default `dist/angular/browser`).
// Used by `.github/workflows/deploy-angular.yml` after the fallback copies,
// before the Pages deploy step.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogFile = path.join(exampleDir, 'src', 'app', 'catalog', 'catalog.ts');

const args = process.argv.slice(2);
const distFlag = args.indexOf('--dist');
const browserDir = path.resolve(
  exampleDir,
  distFlag === -1 ? path.join('dist', 'angular', 'browser') : args[distFlag + 1],
);

// Canonical registry entry shape (one entry per line in catalog.ts):
//   { slug: 'menu', title: 'Menu', category: 'Overlays', kind: 'component', load: ... },
const ENTRY_PATTERN =
  /\{\s*slug:\s*'([^']+)'\s*,\s*title:\s*'([^']+)'\s*,\s*category:\s*'[^']*'\s*,\s*kind:\s*'(component|example)'/g;

function readRegistry(source) {
  const entries = [...source.matchAll(ENTRY_PATTERN)].map((match) => ({
    slug: match[1],
    title: match[2],
    kind: match[3],
  }));
  const baseline = Number(source.match(/REVIEWED_COMPONENT_BASELINE\s*=\s*(\d+)/)?.[1] ?? NaN);
  assert(entries.length > 0, `smoke: parsed no catalog entries from ${catalogFile} (pattern drift?)`);
  assert(
    Number.isInteger(baseline),
    `smoke: could not read REVIEWED_COMPONENT_BASELINE from ${catalogFile}`,
  );
  const components = entries.filter((entry) => entry.kind === 'component');
  assert(
    components.length >= baseline,
    `smoke: parsed ${components.length} component entries, below baseline ${baseline} (pattern drift?)`,
  );
  return entries;
}

const KIND_PATHS = { component: 'components', example: 'examples' };
const linkFor = (entry) => `/${KIND_PATHS[entry.kind]}/${entry.slug}`;

// Minimal GitHub Pages semantics: exact file, then directory index, then the
// 404.html fallback shell (served with a 404 status, like Pages).
async function readResponse(server, routePath) {
  const response = await fetch(new URL(routePath, server.url));
  return { status: response.status, body: await response.text() };
}

function createPagesLikeServer(root) {
  const server = http.createServer(async (request, response) => {
    const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = urlPath.replace(/^\/+/, '').replace(/\0/g, '');
    const candidates = [
      path.join(root, relative),
      path.join(root, relative, 'index.html'),
    ];
    for (const candidate of candidates) {
      if (!candidate.startsWith(root)) continue;
      try {
        const body = await readFile(candidate, 'utf8');
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end(body);
        return;
      } catch {
        // Try the next candidate.
      }
    }
    try {
      const fallback = await readFile(path.join(root, '404.html'), 'utf8');
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(fallback);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
  return server;
}

async function prerenderedRouteDirs(root) {
  const found = [];
  for (const kindPath of Object.values(KIND_PATHS)) {
    let slugs = [];
    try {
      slugs = await readdir(path.join(root, kindPath));
    } catch {
      continue;
    }
    for (const slug of slugs) {
      try {
        await readFile(path.join(root, kindPath, slug, 'index.html'), 'utf8');
        found.push(`/${kindPath}/${slug}`);
      } catch {
        // Not a prerendered route directory; ignored (assets use files, not dirs).
      }
    }
  }
  return found;
}

async function main() {
  const catalogSource = await readFile(catalogFile, 'utf8');
  const entries = readRegistry(catalogSource);
  console.log(`smoke: registry yields ${entries.length} routes (no second slug list).`);

  const server = createPagesLikeServer(browserDir);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const pages = { url: `http://127.0.0.1:${port}` };
  try {
    const failures = [];
    const check = (name, condition, detail = '') => {
      console.log(`${condition ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
      if (!condition) failures.push(name);
    };

    // Deployed root serves the shell (client router redirects into the gallery).
    const root = await readResponse(pages, '/');
    check('deployed root loads', root.status === 200 && root.body.includes('<app-root'), `HTTP ${root.status}`);

    // Every registry component route loads its prerendered page directly.
    for (const entry of entries.filter((candidate) => candidate.kind === 'component')) {
      const response = await readResponse(pages, linkFor(entry));
      check(
        `deep link ${linkFor(entry)} loads`,
        response.status === 200 && response.body.includes(`>${entry.title}</h2>`),
        `HTTP ${response.status}`,
      );
    }

    // One real example once Wave 4 adds an `example`-kind entry; until then
    // the derivation stays ready and this step explicitly skips.
    const firstExample = entries.find((entry) => entry.kind === 'example');
    if (firstExample) {
      const response = await readResponse(pages, linkFor(firstExample));
      check(
        `example deep link ${linkFor(firstExample)} loads`,
        response.status === 200 && response.body.includes(`>${firstExample.title}</h2>`),
        `HTTP ${response.status}`,
      );
    } else {
      console.log('SKIP no example-kind registry entries yet (Wave 4 will extend this check automatically)');
    }

    // Unknown URLs recover through the Pages fallback shell, which boots the
    // SPA so the tested root/child wildcards render the not-found page.
    for (const unknown of ['/components/not-a-demo', '/not-a-route']) {
      const response = await readResponse(pages, unknown);
      check(
        `unknown URL ${unknown} recovers via fallback shell`,
        response.status === 404 && response.body.includes('<app-root'),
        `HTTP ${response.status}`,
      );
    }

    // Reverse check: no prerendered route directory without a registry entry.
    const registryLinks = new Set(entries.map(linkFor));
    const orphans = (await prerenderedRouteDirs(browserDir)).filter((route) => !registryLinks.has(route));
    check('prerendered output matches the registry exactly', orphans.length === 0, orphans.join(', '));

    assert.equal(failures.length, 0, `deployment smoke failures: ${failures.join('; ')}`);
    console.log(`smoke: ${entries.length} registry routes verified against production build output.`);
  } finally {
    server.close();
  }
}

await main();
