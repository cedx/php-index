import console from "node:console";
import {cp, mkdtemp, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import process from "node:process";
import {parseArgs} from "node:util";
import {execa} from "execa";
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

	// Build the Phar archive.
	const output = resolve(positionals[0]);
	return execa("php", [join(root, "bin/php_index.php"), "--input", input, "--output", output].concat(values.compress ? ["--compress"] : []));
}

// Start the application.
main().catch(error => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
