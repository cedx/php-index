import {appendFile, readFile} from "node:fs/promises";
import os from "node:os";
import del from "del";
import {execa} from "execa";
import gulp from "gulp";

/** Builds the project. */
/*
export const build = gulp.series(
	// TODO
);*/

/** Deletes all generated files and reset any saved state. */
export function clean() {
	return del(["var/**/*", "www/*.{js,phar}", "www/css", "www/fonts", "www/js"]);
}

/** Builds the redistributable package. */
export async function dist() {
	for (const script of ["www/js/main.js", "www/worker.js"])
		await exec("terser", ["--comments=false", "--config-file=etc/terser.json", `--output=${script}`, script]);

	await exec("cleancss", ["-O2", "--output=www/css/main.css", "www/css/main.css"]);
	await del("www/**/*.map");

	const {stdout: gitCommitHash} = await exec("git", ["rev-parse", "HEAD"], {stdio: "pipe"});
	return appendFile("www/worker.js", `${os.EOL}// ${new Date().toISOString()} ${gitCommitHash}`);
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

/** Watches for file changes. */
/*
export const watch = gulp.series(
	// TODO
);*/

/** The default task. */
export default gulp.series(
	clean,
	//build,
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
