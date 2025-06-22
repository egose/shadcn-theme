import fs from 'fs/promises';
import glob from 'fast-glob';

const distDir = './dist';

async function prependUseClient() {
  const files = await glob([`${distDir}/**/*.cjs`, `${distDir}/**/*.js`]);

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');

    // Remove any existing "use client"; directives
    content = content.replace(/"use client";/g, '');

    // Prepend "use client"; at the top
    content = `"use client";\n${content}`;

    await fs.writeFile(file, content);
  }
}

prependUseClient().catch(console.error);
