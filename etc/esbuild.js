import {env} from "node:process";
import {minifyHTMLLiteralsPlugin as minifyHtml} from "esbuild-plugin-minify-html-literals";

// Returns a value indicating whether the application runs in production mode.
const isProduction = () => env.NODE_ENV == "production";

/**
 * Returns the CSS settings.
 * @returns {import("esbuild").BuildOptions} The CSS settings.
 */
export function cssOptions() {
	return Object.assign(sharedOptions(isProduction()), {
		entryPoints: ["src/ui/index.css"],
		external: ["*.woff2"],
		outfile: "www/css/main.css",
		sourceRoot: new URL("../www/css/", import.meta.url).href
	});
}

/**
 * Returns the TypeScript settings.
 * @returns {import("esbuild").BuildOptions} The TypeScript settings.
 */
export function tsOptions() {
	const production = isProduction();
	return Object.assign(sharedOptions(production), {
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/client/index.ts"],
		format: "esm",
		outfile: "www/js/main.js",
		plugins: production ? [minifyHtml()] : [],
		sourceRoot: new URL("../www/js/", import.meta.url).href,
		treeShaking: production
	});
}

/**
 * Returns the shared settings.
 * @param {boolean} production Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} The shared settings.
 */
function sharedOptions(production) {
	return {
		bundle: true,
		legalComments: "none",
		minify: production,
		sourcemap: !production,
		sourcesContent: false
	};
}
