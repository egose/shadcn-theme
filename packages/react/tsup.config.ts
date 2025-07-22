import type { Options } from 'tsup';
import type { Plugin } from 'esbuild';

const prependUseClient = (): Plugin => ({
  name: 'prepend-use-client',
  setup(build) {
    build.onLoad({ filter: /\.(ts|tsx|js|jsx)$/ }, async (args) => {
      const fs = await import('fs/promises');
      const source = await fs.readFile(args.path, 'utf8');
      const useClientDirective = `"use client";\n`;

      // Avoid duplicating if it's already there
      if (source.startsWith(useClientDirective)) {
        return;
      }

      return {
        contents: `${useClientDirective}${source}`,
        loader: args.path.endsWith('.ts')
          ? 'ts'
          : args.path.endsWith('.tsx')
            ? 'tsx'
            : args.path.endsWith('.jsx')
              ? 'jsx'
              : 'js',
      };
    });
    build.onEnd(async () => {
      const outdir = build.initialOptions.outdir || 'dist';
      const { default: glob } = await import('fast-glob');

      const outputFiles = await glob(`${outdir}/**/*`);

      //   for (const file of outputFiles) {
      //     const content = await fs.readFile(file, 'utf8');
      //     console.log('content', content);

      //     if (!content.startsWith('"use client";')) {
      //       await fs.writeFile(file, `"use client";\n${content}`);
      //     }
      //   }
    });
  },
});

export const tsup: Options = {
  entry: ['components', 'hooks', 'lib', 'layouts'],
  format: ['cjs', 'esm'],
  target: 'es2017',
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'react-hook-form'],
  esbuildPlugins: [prependUseClient()],
};
