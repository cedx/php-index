import {execFile} from "node:child_process";
import console from "node:console";
import {cp, mkdir, mkdtemp, readFile, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import process from "node:process";
import {parseArgs, promisify} from "node:util";
import pkg from "../../package.json" with {type: "json"};

/**
 * The usage information.
 */
const usage = `
Build the PHP Index redistributable.

Usage:
  php_index [options] <directory>

Arguments:
  directory       The path to the output directory.

Options:
  -c, --compress  Compress the Phar archive.
  -p, --phpinfo   Add a link to the PHP information.
  -h, --help      Display this help.
  -v, --version   Output the version number.
`;

/**
 * Application entry point.
 * @returns Resolves when the application is terminated.
 */
async function main(): Promise<unknown> {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		compress: {short: "c", type: "boolean", default: false},
		help: {short: "h", type: "boolean", default: false},
		phpinfo: {short: "p", type: "boolean", default: false},
		version: {short: "v", type: "boolean", default: false}
	}});

	// Print the usage.
	if (values.help || values.version) // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
		return console.log(values.version ? pkg.version : usage.trim());

	// Check the requirements.
	if (!positionals.length) throw Error("You must provide the path of the output directory.");

	// Populate the input folder.
	const root = join(__dirname, "..");
	const input = await mkdtemp(join(tmpdir(), "phpindex-"));
	for (const folder of ["lib", "www"]) await cp(join(root, folder), join(input, folder), {recursive: true});
	await rm(join(input, "www/index.php"));

	// Update the application configuration.
	const replaceInFile = async (file: string, search: RegExp, replace: string): Promise<void> =>
		writeFile(file, (await readFile(file, {encoding: "utf8"})).replace(search, replace));

	const isEnabled = values.phpinfo ? "true" : "false";
	await replaceInFile(join(input, "lib/config.json"), /"phpInfo":\s?[^,]+,/, `"phpInfo": ${isEnabled},`);
	await replaceInFile(join(input, "www/js/main.js"), /phpInfo:\s?[^,]+,/, `phpInfo: ${isEnabled},`);

	// Build the Phar archive.
	const output = resolve(positionals[0]);
	await mkdir(output, {recursive: true});

	const exec = promisify(execFile);
	return exec("php", [join(root, "bin/php_index.php"), "--input", input, "--output", output].concat(values.compress ? ["--compress"] : []));
}

// Start the application.
main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
