#!/usr/bin/env node
import {execFile} from "node:child_process";
import console from "node:console";
import {cp, mkdir, mkdtemp, readFile, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {dirname, join, resolve} from "node:path";
import {exit} from "node:process";
import {parseArgs, promisify} from "node:util";
import pkg from "../package.json" with {type: "json"};

// The usage information.
const usage = `
Build the PHP Index redistributable.

Usage:
  npx @cedx/php-index [options] [phar]

Arguments:
  phar            The path to the output Phar archive.

Options:
  -c, --compress  Compress the Phar archive.
  -p, --phpinfo   Add a link to the PHP information.
  -h, --help      Display this help.
  -v, --version   Output the version number.
`;

try {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		compress: {short: "c", type: "boolean", default: false},
		help: {short: "h", type: "boolean", default: false},
		phpinfo: {short: "p", type: "boolean", default: false},
		version: {short: "v", type: "boolean", default: false}
	}});

	// Print the usage.
	if (values.help || values.version) {
		console.log(values.version ? pkg.version : usage.trim());
		exit();
	}

	// Populate the input folder.
	const root = join(import.meta.dirname, "..");
	const input = await mkdtemp(join(tmpdir(), "phpindex-"));
	for (const folder of ["lib", "www"]) await cp(join(root, folder), join(input, folder), {recursive: true});
	await rm(join(input, "www/index.php"));

	// Update the application configuration.
	const replaceInFile = async (/** @type {string} */ file, /** @type {RegExp} */ search, /** @type {string} */ replace) =>
		writeFile(file, (await readFile(file, {encoding: "utf8"})).replace(search, replace));

	const isEnabled = values.phpinfo ? "true" : "false";
	await replaceInFile(join(input, "lib/config.json"), /"phpInfo":\s?[^,]+,/, `"phpInfo": ${isEnabled},`);
	await replaceInFile(join(input, "www/js/main.js"), /phpInfo:\s?[^,]+,/, `phpInfo: ${isEnabled},`);

	// Build the Phar archive.
	const output = resolve(positionals.length ? positionals[0] : "index.phar");
	await mkdir(dirname(output), {recursive: true});

	const exec = promisify(execFile);
	await exec("php", [join(root, "bin/php_index.php"), "--input", input, "--output", output].concat(values.compress ? ["--compress"] : []));
}
catch (error) {
	console.error(error instanceof Error ? error.message : error);
	exit(1);
}
