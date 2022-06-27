import {cp, readFile} from "node:fs/promises";
import {env} from "node:process";
import del from "del";
import {execa} from "execa";
import gulp from "gulp";

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
	await Promise.all([buildApp(), buildTheme()]);

	const args = ["--comments=false", "--config-file=etc/terser.json"];
	const css = ["bootstrap", "theme"].map(file => exec("cleancss", ["-O2", `--output=www/css/${file}.css`, `www/css/${file}.css`]));
	const js = ["js/bootstrap", "js/main" /*, "worker" */].map(file => exec("terser", [...args, `--output=www/${file}.js`, `www/${file}.js`]));
	return Promise.all([...css, ...js]);

	// TODO Worker
	//const {stdout} = await exec("git", ["rev-parse", "HEAD"], {stdio: "pipe"});
	//return appendFile("www/worker.js", `${os.EOL}// ${new Date().toISOString()} ${stdout}`);
}

/** Performs the static analysis of source code. */
export async function lint() {
	const sources = JSON.parse(await readFile("jsconfig.json", "utf8")).include;
	await exec("eslint", ["--config=etc/eslint.json", ...sources]);
	return exec("tsc", ["--project", "jsconfig.json"]);
}

/** Publishes the package in the registry. */
export async function publish() {
	const {version} = JSON.parse(await readFile("package.json", "utf8"));
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await exec("npm", ["publish", `--registry=${registry}`]);
	for (const command of [["tag"], ["push", "origin"]]) await exec("git", [...command, `v${version}`]);
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
