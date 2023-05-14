import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/chrome/background.ts',
  output: {
    file: './chrome/background.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      include: ['./src/**/*.ts'],
      exclude: ['./src/**/*.test.ts'],
      tsconfigOverride: {
        types: ['chrome'],
        compilerOptions: {
          lib: ['ESNext', 'DOM'],
          inlineSources: false
        }
      }
    }),
    terser()
  ]
};
