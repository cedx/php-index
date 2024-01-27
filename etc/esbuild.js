import {minifyHTMLLiteralsPlugin as minifyHtml} from "esbuild-plugin-minify-html-literals";

/**
 * Returns the build options.
 * @param {boolean} production Value indicating whether the application runs in production mode.
 * @returns {import("esbuild").BuildOptions} The build options.
 */
export default function esbuildOptions(production = false) {
	return {
		bundle: true,
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
