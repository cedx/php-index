import {cp, readFile, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {env} from "node:process";
import {setTimeout} from "node:timers/promises";
import browserSync from "browser-sync";
import {deleteAsync} from "del";
import esbuild from "esbuild";
import {$} from "execa";
import gulp from "gulp";
import pkg from "./package.json" with {type: "json"};
import buildOptions from "./etc/esbuild.js";
import compileSass from "./etc/sass.js";

// Builds the project.
export async function build() {
	const fontsource = "node_modules/@fontsource-variable/material-symbols-rounded/files";
	await cp(join(fontsource, "material-symbols-rounded-latin-fill-normal.woff2"), "www/fonts/icons.woff2");
	await $`lit-localize --config=etc/locale.json build`;
	await esbuild.build(buildOptions());
	return compileSass();
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*", "www/css", "www/fonts", "www/js"]);
}

// Builds the command line interface.
export async function cli() {
	if (env.NODE_ENV == "production") await $`php_minifier --mode=fast src/server lib`;
	else await cp("src/server", "lib", {recursive: true});
	return cp("src/server/config.json", "lib/config.json");
}

// Packages the project.
export async function dist() {
	env.NODE_ENV = "production";
	await build();
	return cli();
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
	await $`eslint --config=etc/eslint.config.js gulpfile.js bin src`;
	await $`lit-analyzer src/client/html/**/*.js`
	await $`stylelint --config=etc/stylelint.js src/ui/**/*.scss`;
	return $`php vendor/bin/phpstan analyse --configuration=etc/phpstan.php --memory-limit=256M --verbose`;
}

// Publishes the package.
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await $`npm publish --registry=${registry}`;
	for (const action of [["tag"], ["push", "origin"]]) await $`git ${action} v${pkg.version}`;
}

// Starts the development server.
export async function serve() {
	await doc();
	return $({stdio: "inherit"})`mkdocs serve --config-file=etc/mkdocs.yaml`;
}

// Updates the version number in the sources.
export async function version() {
	for (const file of ["composer.json", "src/server/config.json"])
		await writeFile(file, (await readFile(file, "utf8")).replace(/"version": "\d+(\.\d+){2}"/, `"version": "${pkg.version}"`));
}

// Watches for file changes.
export async function watch() {
	await build();
	const browser = browserSync.create();
	const context = await esbuild.context(buildOptions());

	gulp.watch("src/client/**/*.js", async function buildClient() {
		await context.rebuild();
		browser.reload();
	});

	gulp.watch("src/server/**/*.php", function buildServer(done) {
		browser.reload();
		done();
	});

	gulp.watch("src/ui/**/*.scss", async function buildStyleSheet() {
		await compileSass();
		browser.reload();
	});

	const host = "127.0.0.1:8000";
	void $({stdio: "inherit"})`php -S ${host} -t www`;
	await setTimeout(1_000);
	browser.init({logLevel: "silent", notify: false, port: 8080, proxy: host});
}

// The default task.
export default gulp.series(
	clean,
	version,
	dist
);
