import {env} from "node:process";
import nodeResolve from "@rollup/plugin-node-resolve";
import minifyHtmlLiterals from "rollup-plugin-minify-html-literals";

// Value indicating whether the application runs in production mode.
const production = env.NODE_ENV == "production";

/** @type {import("rollup").RollupOptions} */
export default {
	treeshake: production,
	input: "lib/client/index.js",
	output: {
		file: "www/js/main.js",
		format: "esm",
	},
	plugins: production
		? [nodeResolve(), minifyHtmlLiterals()]
		: nodeResolve({exportConditions: ["development"]})
};
