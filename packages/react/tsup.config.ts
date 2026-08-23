import type { Options } from 'tsup';

export const tsup: Options = {
  entry: ['components', 'hooks', 'utils', 'layouts'],
  format: ['cjs', 'esm'],
  target: 'es2017',
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'react-hook-form', 'sonner'],
};
