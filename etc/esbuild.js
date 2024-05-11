import {readFile} from "node:fs/promises";
import {EOL} from "node:os";
import {env} from "node:process";
import {minifyHTMLLiterals} from "minify-html-literals";

/**
 * Returns the build options of the client application.
 * @returns {import("esbuild").BuildOptions} The build options of the client application.
 */
export default function buildOptions() {
	const production = env.NODE_ENV == "production";
	return {
		bundle: true,
		conditions: production ? [] : ["development"],
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/client/index.js"],
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
 * Creates a plugin that minifies HTML markup inside template literal strings.
 * @returns {import("esbuild").Plugin} The newly created plugin.
 */
function minifyHtml() {
	return {
		name: minifyHtml.name,
		setup: build => build.onLoad({filter: /\.js$/i}, async ({path}) => {
			const contents = await readFile(path, "utf8");
			const {code, map} = minifyHTMLLiterals(contents) ?? {code: contents, map: null};
			return {
				contents: map ? `${code}${EOL}//# sourceMappingURL=${map.toUrl()}` : code,
				loader: "js"
			};
		})
	};
}
