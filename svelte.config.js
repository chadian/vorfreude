import adapter from "sveltekit-adapter-chrome-extension";
import preprocess from 'svelte-preprocess';

// this is used for static settings.html page in the `chrome` folder
const settingsHtmlSHA = 'sha256-6b7Hu5jX9wMdcwZnkWBaMem1YaFeXzlqjsJMxYHZAbw=';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  transform: {
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
  },

  kit: {
    csp: {
      mode: 'hash',
      directives: {
        'script-src': ['self', settingsHtmlSHA],
        'object-src': ['self'],
      }
    },
    appDir: 'app',
    adapter: adapter({
      pages: 'chrome',
      assets: 'chrome',
      fallback: 'index.html'
    }),
    prerender: {
      enabled: true,
      entries: ['/']
    }
  }
};

export default config;
