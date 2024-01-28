import console from "node:console";
import {cp, mkdtemp, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import process from "node:process";
import {parseArgs} from "node:util";
import {execa} from "execa";
import pkg from "../../package.json" with {type: "json"};
import usage from "./usage.js";

/**
 * Application entry point.
 * @returns The application exit code.
 */
async function main(): Promise<number> {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		compress: {short: "c", type: "boolean", default: false},
		help: {short: "h", type: "boolean", default: false},
		version: {short: "v", type: "boolean", default: false}
	}});

	// Print the usage.
	if (values.help || values.version) { // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
		console.log(values.version ? pkg.version : usage.trim());
		return 0;
	}

	// Check the requirements.
	if (!positionals.length) {
		console.error("You must provide the path of the output directory.");
		return 1;
	}

	// Populate the input folder.
	const root = join(__dirname, "..");
	const input = await mkdtemp(join(tmpdir(), "phpindex-"));
	for (const folder of ["src/server", "www"]) await cp(join(root, folder), join(input, folder), {recursive: true});
	await rm(join(input, "www/index.php"));

	// Build the Phar archive.
	const output = resolve(positionals[0]);
	await execa("php", [join(root, "bin/php_index.php"), "--input", input, "--output", output].concat(values.compress ? ["--compress"] : []));
	return 0;
}

// Start the application.
main().then(exitCode => process.exitCode = exitCode, error => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
