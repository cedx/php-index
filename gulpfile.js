import {cp, mkdir} from "node:fs/promises";
import {join} from "node:path";
import {env} from "node:process";
import browserSync from "browser-sync";
import {deleteAsync} from "del";
import esbuild from "esbuild";
import {$} from "execa";
import gulp from "gulp";
import phpMinifier from "@cedx/php-minifier";
import pkg from "./package.json" with {type: "json"};
import {clientOptions, consoleOptions} from "./etc/esbuild.js";
import compileSass from "./etc/sass.js";

// Returns a value indicating whether the application runs in production mode.
const isProduction = () => env.NODE_ENV == "production";

// Deploys the assets.
export async function assets() {
	await $`lit-localize --config=etc/locale.json build`;
	await mkdir("www/css", {recursive: true});
	const fontsource = "node_modules/@fontsource-variable/material-symbols-rounded/files";
	return cp(join(fontsource, "material-symbols-rounded-latin-fill-normal.woff2"), "www/fonts/icons.woff2");
}

// Builds the project.
export async function build() {
	await assets();
	await esbuild.build(clientOptions(isProduction()));
	return compileSass(isProduction());
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*", "www/css", "www/fonts", "www/js"]);
}

// Builds the command line interface.
export const cli = gulp.series(
	async function cliJs() {
		await esbuild.build(consoleOptions(isProduction()));
		return $`git update-index --chmod=+x bin/php_index.cjs`;
	},
	function cliPhp() {
		let stream = gulp.src("src/server/**/*.php", {read: !isProduction()});
		if (isProduction()) stream = stream.pipe(phpMinifier({mode: "fast"}));
		return stream.pipe(gulp.dest("lib"));
	}
);

// Builds the documentation.
export async function doc() {
	for (const file of ["CHANGELOG.md", "LICENSE.md"]) await cp(file, `docs/${file.toLowerCase()}`);
}

// Extracts the localizable strings.
export function i18n() {
	return $`lit-localize --config=etc/locale.json extract`;
}

// Performs the static analysis of source code.
export async function lint() {
	await $`tsc --project tsconfig.json`;
	return $`eslint --config=etc/eslint.cjs gulpfile.js src`;
}

// Publishes the package.
export async function publish() {
	for (const action of [["tag"], ["push", "origin"]]) await $`git ${action} v${pkg.version}`;
}

// Watches for file changes.
export async function watch() {
	await assets();

	const browser = browserSync.create();
	const buildContext = await esbuild.context(clientOptions());
	const host = "127.0.0.1:8000";
	$`php -S ${host} -t www`; // eslint-disable-line @typescript-eslint/no-unused-expressions

	const buildJs = async () => { await buildContext.rebuild(); browser.reload(); };
	gulp.watch("src/client/**/*.ts", {ignoreInitial: false}, buildJs);

	const buildCss = async () => { await compileSass(); browser.reload(); };
	gulp.watch("src/ui/**/*.scss", {ignoreInitial: false}, buildCss);

	await new Promise(resolve => setTimeout(resolve, 1_000));
	browser.init({logLevel: "silent", notify: false, port: 8080, proxy: host});
}

// The default task.
export default gulp.series(
	function init(done) { env.NODE_ENV = "production"; done(); },
	clean,
	build,
	cli
);
