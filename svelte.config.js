// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter(),

		alias: {
			$lib: 'src/lib',
			$components: 'src/lib/components',
			$stores: 'src/lib/stores',
			$utils: 'src/lib/utils',
			$server: 'src/lib/server'
		},

		csrf: {
			checkOrigin: true
		}
	}
};

export default config;
