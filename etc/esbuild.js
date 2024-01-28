import {minifyHTMLLiteralsPlugin as minifyHtml} from "esbuild-plugin-minify-html-literals";

/**
 * Returns the build options of the client application.
 * @param {boolean} [production] Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} Thebuild options of the client application.
 */
export function clientOptions(production = false) {
	return Object.assign(esbuildOptions(production), {
		conditions: production ? [] : ["development"],
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/client/index.ts"],
		outfile: "www/js/main.js",
		plugins: production ? [minifyHtml()] : [],
		sourceRoot: new URL("../www/js/", import.meta.url).href,
		sourcemap: !production,
		sourcesContent: false
	});
}

/**
 * Returns the build options of the console application.
 * @param {boolean} [production] Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} The build options of the console application.
 */
export function consoleOptions(production = false) {
	return Object.assign(esbuildOptions(production), {
		banner: {js: "#!/usr/bin/env node"},
		entryPoints: ["src/console/main.ts"],
		platform: "node",
		outfile: "bin/php_index.js"
	});
}

/**
 * Returns the build options.
 * @param {boolean} production Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} The build options.
 */
function esbuildOptions(production) {
	return {
		bundle: true,
		format: "esm",
		legalComments: "none",
		minify: production,
		treeShaking: production
	};
}
