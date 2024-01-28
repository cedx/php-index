import {minifyHTMLLiteralsPlugin as minifyHtml} from "esbuild-plugin-minify-html-literals";

/**
 * Returns the build options of the client application.
 * @param {boolean} [production] Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} Thebuild options of the client application.
 */
export function clientOptions(production = false) {
	return {
		bundle: true,
		conditions: production ? [] : ["development"],
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/client/index.ts"],
		format: "esm",
		legalComments: "none",
		minify: production,
		outfile: "www/js/main.js",
		plugins: production ? [minifyHtml()] : [],
		sourceRoot: new URL("../www/js/", import.meta.url).href,
		sourcemap: !production,
		sourcesContent: false,
		treeShaking: production
	};
}

/**
 * Returns the build options of the console application.
 * @param {boolean} [production] Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} The build options of the console application.
 */
export function consoleOptions(production = false) {
	return {
		banner: {js: "#!/usr/bin/env node"},
		bundle: true,
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/console/main.ts"],
		legalComments: "none",
		minify: production,
		platform: "node",
		outfile: "bin/php_index.cjs",
		treeShaking: production
	};
}
