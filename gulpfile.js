import {cp} from "node:fs/promises";
import {env} from "node:process";
import {promisify} from "node:util";
import del from "del";
import {execa} from "execa";
import gulp from "gulp";
import config from "./jsconfig.json" assert {type: "json"};
import pkg from "./package.json" assert {type: "json"};

/** Builds the project. */
export const build = gulp.parallel(
	buildApp,
	buildTheme
);

/** Builds the application. */
function buildApp() {
	return Promise.all([
		cp("node_modules/bootstrap/dist/js/bootstrap.bundle.js", "www/js/bootstrap.js"),
		exec("rollup", ["--config=etc/rollup.js", "--silent"])
	]);
}

/** Builds the theme. */
function buildTheme() {
	return Promise.all([
		cp("node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", "www/fonts/icons.woff2"),
		exec("sass", ["--load-path=node_modules", "--no-source-map", "lib/ui/bootstrap:www/css"]),
		exec("stylus", ["--out", "www/css", "--quiet", "lib/ui/theme/theme.styl"])
	]);
}

/** Deletes all generated files and reset any saved state. */
export function clean() {
	return del(["var/**/*", "www/*.phar", "www/css", "www/fonts", "www/js"]);
}

/** Builds the redistributable package. */
export async function dist() {
	env.NODE_ENV = "production";
	await promisify(build)();

	const args = ["--comments=false", "--config-file=etc/terser.json"];
	const css = ["bootstrap", "theme"].map(file => exec("cleancss", ["-O2", `--output=www/css/${file}.css`, `www/css/${file}.css`]));
	const js = ["js/bootstrap", "js/main"].map(file => exec("terser", [...args, `--output=www/${file}.js`, `www/${file}.js`]));
	return Promise.all([...css, ...js]);
}

/** Performs the static analysis of source code. */
export async function lint() {
	await exec("eslint", ["--config=etc/eslint.json", ...config.include]);
	return exec("tsc", ["--project", "jsconfig.json"]);
}

/** Publishes the package in the registry. */
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await exec("npm", ["publish", `--registry=${registry}`]);
	for (const command of [["tag"], ["push", "origin"]]) await exec("git", [...command, `v${pkg.version}`]);
}

/** Starts the development server. */
export function serve() {
	return exec("php", ["-S", "localhost:8080", "-t", "www"]);
}

/** Watches for file changes. */
export const watch = gulp.series(
	build,
	gulp.parallel(serve, watchApp, watchTheme)
);

/** Watches for file changes in the application. */
function watchApp() {
	const compileApp = () => exec("rollup", ["--config=etc/rollup.js", "--silent"]);
	gulp.watch("lib/client/**/*.js", compileApp);
}

/** Watches for file changes in the theme. */
function watchTheme() {
	const compileTheme = () => exec("stylus", ["--out", "www/css", "--quiet", "lib/ui/theme/theme.styl"]);
	gulp.watch("lib/ui/**/*.styl", compileTheme);
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
