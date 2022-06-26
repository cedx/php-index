import {env} from "node:process";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import minifyHtmlLiterals from "rollup-plugin-minify-html-literals";

/** @type {import("rollup").RollupOptions} */
export default {
	input: "lib/client/index.js",
	output: {
		file: "www/js/main.js",
		format: "es",
	},
	plugins: env.NODE_ENV == "production"
		? [nodeResolve(), minifyHtmlLiterals()]
		: [nodeResolve({exportConditions: ["development"]})]
};
