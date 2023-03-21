import {cp} from "node:fs/promises";
import {env} from "node:process";
import {deleteAsync} from "del";
import {build as esbuild} from "esbuild";
import {execa} from "execa";
import gulp from "gulp";
import config from "./jsconfig.json" assert {type: "json"};
import pkg from "./package.json" assert {type: "json"};
import {cssOptions, jsOptions} from "./etc/esbuild.js";

/** Builds the project. */
export const build = gulp.parallel(buildApp, buildAssets, buildTheme);

/** Builds the application. */
async function buildApp() {
	await exec("lit-localize", ["--config=etc/locale.json", "build"]);
	return esbuild(jsOptions());
}

/** Builds the assets. */
function buildAssets() {
	return Promise.all([
		cp("node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", "www/fonts/icons.woff2"),
		cp("node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", "www/js/vendor.js")
	]);
}

/** Builds the theme. */
function buildTheme() {
	return esbuild(cssOptions());
}

/** Deletes all generated files. */
export function clean() {
	return deleteAsync(["src/client/i18n", "var/**/*", "www/*.phar", "www/css", "www/fonts", "www/js"]);
}

/** Builds the redistributable package. */
export function dist(/** @type {gulp.TaskFunctionCallback} */ done) {
	env.NODE_ENV = "production";
	return build(done);
}

/** Extracts the localized messages. */
export function i18n() {
	return exec("lit-localize", ["--config=etc/locale.json", "extract"]);
}

/** Watches for file changes. */
export const watch = gulp.series(
	gulp.parallel(buildAssets, watchApp, watchTheme),
	serve
);

/** Watches for file changes in the application. */
async function watchApp() {
	await exec("lit-localize", ["--config=etc/locale.json", "build"]);
	const result = await esbuild({...jsOptions(), incremental: true});
	const compileApp = () => result.rebuild?.();
	gulp.watch("src/client/**/*.js", compileApp);
}

/** Watches for file changes in the theme. */
async function watchTheme() {
	const result = await esbuild({...cssOptions(), incremental: true});
	const compileTheme = () => result.rebuild?.();
	gulp.watch("src/ui/**/*.css", compileTheme);
}

/** The default task. */
export default gulp.series(
	clean,
	dist
);

/**
 * Runs the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {import("execa").Options} [options] The child process options.
 * @returns {import("execa").ExecaChildProcess} Resolves when the command is finally terminated.
 */
function exec(command, args = [], options = {}) {
	return execa(command, args, {preferLocal: true, stdio: "inherit", ...options});
}
