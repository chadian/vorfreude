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
      include: ['**/*.ts', '../src/**/*.ts'],
      exclude: ['**/*.test.ts'],
      tsconfigOverride: {
        types: ["chrome"],
        compilerOptions: {
          "lib": ["ESNext", "DOM"],
          inlineSources: false
        }
      }
    }),
    terser()
  ]
};
