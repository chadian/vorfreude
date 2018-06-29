import typescript from 'rollup-plugin-typescript2';
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./background.ts",
  output: {
    file: "background.js",
    format: "iife"
  },
  plugins: [
    commonjs(),
    typescript({
      rollupCommonJSResolveHack: true,
      include: ['**/*.ts', '../src/**/*.ts'],
      tsconfigOverride: {
        types: ["chrome"],
        compilerOptions: {
          "lib": ["es2015", "DOM"],
          inlineSources: false
        }
      }
    }),
    terser()
  ]
};
