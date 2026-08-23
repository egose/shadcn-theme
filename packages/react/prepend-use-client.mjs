import fs from 'fs/promises';
import glob from 'fast-glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directive = '"use client";';
const sourceDirectories = ['components', 'hooks', 'utils', 'layouts'];

function withoutClientDirective(content) {
  return content.replace(/["']use client["'];?\s*/g, '');
}

function runtimeReexports(content) {
  return [...content.matchAll(/\bexport\s+(?!type\b)(?:\*|\{[^}]*\})\s+from\s+["']([^"']+)["']/gs)].map(
    ([, specifier]) => specifier,
  );
}

function resolveSourceEntry(sourceEntry, specifier, sourceEntrySet) {
  if (!specifier.startsWith('.')) return undefined;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourceEntry), specifier));
  return [resolved, `${resolved}/index`].find((candidate) => sourceEntrySet.has(candidate));
}

export async function enforceClientBoundaries(rootDirectory = '.') {
  const sourceFiles = await glob(sourceDirectories.map((directory) => `${directory}/**/*.{ts,tsx}`), {
    cwd: rootDirectory,
  });
  const clientEntries = new Set();
  const sourceContents = new Map();
  const sourceEntries = sourceFiles.map((file) => file.replace(/\.(?:ts|tsx)$/, '')).sort();
  const sourceEntrySet = new Set(sourceEntries);

  for (const sourceFile of sourceFiles) {
    const content = await fs.readFile(path.join(rootDirectory, sourceFile), 'utf8');
    const sourceEntry = sourceFile.replace(/\.(?:ts|tsx)$/, '');
    sourceContents.set(sourceEntry, content);
    if (/^["']use client["'];/.test(content)) {
      clientEntries.add(sourceEntry);
    }
  }

  const requiredClientEntries = new Set(clientEntries);
  let foundClientReexport = true;
  while (foundClientReexport) {
    foundClientReexport = false;
    for (const [sourceEntry, content] of sourceContents) {
      if (requiredClientEntries.has(sourceEntry)) continue;
      const reexportsClientEntry = runtimeReexports(content).some((specifier) => {
        const target = resolveSourceEntry(sourceEntry, specifier, sourceEntrySet);
        return target && requiredClientEntries.has(target);
      });
      if (reexportsClientEntry) {
        requiredClientEntries.add(sourceEntry);
        foundClientReexport = true;
      }
    }
  }

  const unsafeClientReexports = [...requiredClientEntries].filter((entry) => !clientEntries.has(entry));
  if (unsafeClientReexports.length > 0) {
    throw new Error(
      `Client re-export entries must declare "use client": ${unsafeClientReexports.sort().join(', ')}`,
    );
  }

  const outputFiles = await glob('dist/**/*.{js,mjs}', { cwd: rootDirectory });

  for (const outputFile of outputFiles) {
    const outputPath = path.join(rootDirectory, outputFile);
    const entry = outputFile.replace(/^dist\//, '').replace(/\.(?:js|mjs)$/, '');
    const content = withoutClientDirective(await fs.readFile(outputPath, 'utf8'));
    await fs.writeFile(outputPath, clientEntries.has(entry) ? `${directive}\n${content}` : content);
  }

  return {
    clientEntries: [...clientEntries].sort(),
    sourceEntries,
    outputFiles: outputFiles.sort(),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await enforceClientBoundaries();
}
