import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { enforceClientBoundaries } from '../prepend-use-client.mjs';

const { clientEntries, sourceEntries } = await enforceClientBoundaries();
const clientEntrySet = new Set(clientEntries);
const representativeClientEntries = [
  'components/form/textarea',
  'components/widgets/dialog-manager/index',
  'components/widgets/dialog-manager/context',
  'hooks/use-mobile',
  'layouts/simple/index',
];
const representativeServerEntries = [
  'components/form/types',
  'components/widgets/dialog-manager/types',
  'layouts/simple/types',
  'utils/date',
  'utils/time',
  'utils/ui',
];

for (const entry of representativeClientEntries) {
  assert(clientEntrySet.has(entry), `${entry} must declare its client boundary in source`);
}
for (const entry of representativeServerEntries) {
  assert(!clientEntrySet.has(entry), `${entry} must remain server-safe`);
}

for (const entry of sourceEntries) {
  for (const extension of ['js', 'mjs']) {
    const content = await readFile(path.join('dist', `${entry}.${extension}`), 'utf8');
    const directiveCount = (content.match(/["']use client["'];/g) ?? []).length;
    assert.equal(
      directiveCount,
      clientEntrySet.has(entry) ? 1 : 0,
      `${entry}.${extension} has an invalid client directive count`,
    );
    if (clientEntrySet.has(entry)) assert.match(content, /^"use client";\n/);
  }
}

for (const extension of ['d.mts', 'd.ts']) {
  const textareaTypes = await readFile(`dist/components/form/textarea.${extension}`, 'utf8');
  const simpleLayoutTypes = await readFile(`dist/layouts/simple/index.${extension}`, 'utf8');
  assert.doesNotMatch(textareaTypes, /\bany\b/, `FormTextarea ${extension} declarations must not expose any`);
  assert.match(textareaTypes, /FormTextareaInputProps/);
  assert.match(textareaTypes, /React[^.]*\.Ref<HTMLTextAreaElement>/);
  assert.match(simpleLayoutTypes, /SimpleLayoutProps/);
  assert.match(simpleLayoutTypes, /MenuItem/);
  assert.match(simpleLayoutTypes, /UserMenuSection/);
}

console.log(
  `Validated selective client boundaries for all ${sourceEntries.length} entries in ESM and CommonJS ` +
    `(${clientEntries.length} client, ${sourceEntries.length - clientEntries.length} server-safe).`,
);
