import {cp, mkdir} from "node:fs/promises";
import {join} from "node:path";
import {env} from "node:process";
import browserSync from "browser-sync";
import {deleteAsync} from "del";
import esbuild from "esbuild";
import {$} from "execa";
import gulp from "gulp";
import pkg from "./package.json" with {type: "json"};
import {clientOptions, consoleOptions} from "./etc/esbuild.js";
import compileSass from "./etc/sass.js";

// Deploys the assets.
export async function assets() {
	await $`lit-localize --config=etc/locale.json build`;
	await mkdir("www/css", {recursive: true});
	const fontsource = "node_modules/@fontsource-variable/material-symbols-rounded/files";
	return cp(join(fontsource, "material-symbols-rounded-latin-fill-normal.woff2"), "www/fonts/icons.woff2");
}

// Builds the project.
export async function build() {
	const production = env.NODE_ENV == "production";
	await assets();
	await esbuild.build(clientOptions(production));
	await esbuild.build(consoleOptions(production));
	return compileSass(production);
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*", "www/css", "www/fonts", "www/js"]);
}

// Packages the project.
export function dist() {
	env.NODE_ENV = "production";
	return build();
}

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

	// eslint-disable-next-line prefer-arrow-callback
	gulp.watch("src/client/**/*.ts", {ignoreInitial: false}, async function js(done) {
		await buildContext.rebuild();
		browser.reload();
		done();
	});

	// eslint-disable-next-line prefer-arrow-callback
	gulp.watch("src/ui/**/*.scss", {ignoreInitial: false}, async function css(done) {
		await compileSass();
		browser.reload();
		done();
	});

	await new Promise(resolve => setTimeout(resolve, 1_000));
	browser.init({logLevel: "silent", notify: false, port: 8080, proxy: host});
}

// The default task.
export default gulp.series(
	clean,
	dist
);
