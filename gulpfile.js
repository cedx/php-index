import {cp} from "node:fs/promises";
import {join} from "node:path";
import {env} from "node:process";
import browserSync from "browser-sync";
import {deleteAsync} from "del";
import esbuild from "esbuild";
import {$} from "execa";
import gulp from "gulp";
import pkg from "./package.json" with {type: "json"};
import esbuildOptions from "./etc/esbuild.js";

// Copies the assets.
export async function assets() {
	const fontsource = "node_modules/@fontsource-variable/material-symbols-rounded/files";
	return cp(join(fontsource, "material-symbols-rounded-latin-fill-normal.woff2"), "www/fonts/icons.woff2");
}

// Builds the project.
export async function build() {
	const production = env.NODE_ENV == "production";
	await assets();
	await esbuild.build(esbuildOptions(production));
	return $`sass --load-path=node_modules --no-source-map --style=${production ? "compressed" : "expanded"} src/ui/index.scss www/css/main.css`;
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
	const host = "127.0.0.1:8000";
	$`php -S ${host} -t www`; // eslint-disable-line @typescript-eslint/no-unused-expressions

	const browser = browserSync.create();
	const context = await esbuild.context(esbuildOptions(false));
	browser.init({logLevel: "silent", notify: false, port: 8080, proxy: host});

	// eslint-disable-next-line prefer-arrow-callback
	gulp.watch("src/client/**/*.ts", {ignoreInitial: false}, async function buildApp(done) {
		await context.rebuild();
		browser.reload();
		done();
	});

	// eslint-disable-next-line prefer-arrow-callback
	gulp.watch("src/ui/**/*.scss", {ignoreInitial: false}, async function buildTheme(done) {
		await $`sass --load-path=node_modules --source-map --style=expanded src/ui/index.scss www/css/main.css`;
		browser.reload();
		done();
	});
}

// The default task.
export default gulp.series(
	clean,
	dist
);
