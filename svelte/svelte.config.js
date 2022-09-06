import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	transform: {
		'^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
	},

	kit: {
		adapter: adapter({
			fallback: 'index.html'
		})
	}
};

export default config;
