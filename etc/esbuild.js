import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {EOL} from "node:os";
import {env} from "node:process";
import {minifyHTMLLiterals} from "minify-html-literals";

/**
 * Returns the build options of the client application.
 * @returns {import("esbuild").BuildOptions} Thebuild options of the client application.
 */
export function clientOptions() {
	const production = env.NODE_ENV == "production";
	return {
		bundle: true,
		conditions: production ? [] : ["development"],
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/client/index.ts"],
		format: "esm",
		legalComments: "none",
		minify: production,
		outfile: "www/js/main.js",
		plugins: production ? [minifyHtmlLiterals()] : [],
		sourcemap: !production,
		sourceRoot: new URL("../www/js/", import.meta.url).href,
		sourcesContent: false,
		treeShaking: production
	};
}

/**
 * Returns the build options of the console application.
 * @returns {import("esbuild").BuildOptions} The build options of the console application.
 */
export function consoleOptions() {
	const production = env.NODE_ENV == "production";
	return {
		banner: {js: "#!/usr/bin/env node"},
		bundle: true,
		conditions: production ? [] : ["development"],
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/console/main.ts"],
		legalComments: "none",
		minify: production,
		outfile: "bin/php_index.cjs",
		platform: "node",
		treeShaking: production
	};
}

/**
 * Creates a plugin that minifies HTML markup inside template literal strings.
 * @returns {import("esbuild").Plugin} The newly created plugin.
 */
function minifyHtmlLiterals() {
	return {
		name: minifyHtmlLiterals.name,
		setup: build => {
			/** @type {Map<string, {hash: string, output: import("esbuild").OnLoadResult}>} */
			const cache = new Map();
			build.onLoad({filter: /\.[jt]s$/i}, async ({path}) => {
				const contents = await readFile(path, "utf8");
				const hash = createHash("md5").update(contents).digest("hex");

				let entry = cache.get(path);
				if (!entry || entry.hash != hash) {
					const {code, map} = minifyHTMLLiterals(contents) ?? {code: contents, map: null};
					entry = {hash, output: {
						contents: map ? `${code}${EOL}//# sourceMappingURL=${map.toUrl()}` : code,
						loader: /\.ts$/i.test(path) ? "ts" : "js"
					}};

					cache.set(path, entry);
				}

				return entry.output;
			});
		}
	};
}
