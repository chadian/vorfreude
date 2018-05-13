'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require("rollup-plugin-json");

module.exports = function(defaults) {
  let app = new GlimmerApp(defaults, {
    storeConfigInMeta: true,
    rollup: {
      plugins: [
        resolve({ jsnext: true, module: true, main: true }),
        commonjs(),
        json()
      ]
    }
  });

  return app.toTree();
};
