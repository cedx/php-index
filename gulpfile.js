import {cp} from "node:fs/promises";
import {join} from "node:path";
import {env} from "node:process";
import browserSync from "browser-sync";
import {deleteAsync} from "del";
import esbuild from "esbuild";
import {$} from "execa";
import gulp from "gulp";
import replace from "gulp-replace";
import phpMinifier from "@cedx/php-minifier";
import pkg from "./package.json" with {type: "json"};
import {clientOptions, consoleOptions} from "./etc/esbuild.js";
import compileSass from "./etc/sass.js";

// Deploys the assets.
export async function assets() {
	await $`lit-localize --config=etc/locale.json build`;
	const fontsource = "node_modules/@fontsource-variable/material-symbols-rounded/files";
	return cp(join(fontsource, "material-symbols-rounded-latin-fill-normal.woff2"), "www/fonts/icons.woff2");
}

// Builds the project.
export async function build() {
	await assets();
	await esbuild.build(clientOptions());
	return compileSass();
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*", "www/css", "www/fonts", "www/js"]);
}

// Builds the command line interface.
export const cli = gulp.series(
	async function cliJs() {
		await esbuild.build(consoleOptions());
		return $`git update-index --chmod=+x bin/php_index.cjs`;
	},
	function cliPhp() {
		const production = env.NODE_ENV == "production";
		let stream = gulp.src("src/server/**/*.php", {read: !production});
		if (production) stream = stream.pipe(phpMinifier({mode: "fast"}));
		return stream.pipe(gulp.dest("lib"));
	},
	function cliConfig() {
		return cp("src/server/config.json", "lib/config.json");
	}
);

// Packages the project.
export const dist = gulp.series(
	function init(done) { env.NODE_ENV = "production"; done(); },
	build,
	cli
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
	await build();
	await $`tsc --project .`;
	await $`eslint --config=etc/eslint.config.js gulpfile.js etc src`;
	await $`stylelint --config=etc/stylelint.js src/ui/**/*.scss`;
	return $`vendor/bin/phpstan analyse --configuration=etc/phpstan.php --memory-limit=256M`;
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
export function version() {
	return gulp.src(["composer.json", "src/server/config.json"], {base: "."})
		.pipe(replace(/"version": "\d+(\.\d+){2}"/, `"version": "${pkg.version}"`))
		.pipe(gulp.dest("."));
}

// Watches for file changes.
export async function watch() {
	await build();

	const browser = browserSync.create();
	const context = await esbuild.context(clientOptions());
	const host = "127.0.0.1:8000";
	void $({stdio: "inherit"})`php -S ${host} -t www`;

	gulp.watch("src/client/**/*.ts", async function buildClient() {
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

	await new Promise(resolve => setTimeout(resolve, 1_000));
	browser.init({logLevel: "silent", notify: false, port: 8080, proxy: host});
}

// The default task.
export default gulp.series(
	clean,
	version,
	dist
);
