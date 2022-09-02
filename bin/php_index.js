#!/usr/bin/env node
import console from "node:console";
import {randomUUID} from "node:crypto";
import {cpSync, mkdirSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import {parseArgs} from "node:util";
import {execaSync} from "execa";
import pkg from "../package.json" assert {type: "json"};

// The usage information.
const usage = `
Build the PHP Index redistributable.

Usage:
  php_index [options] <directory>

Arguments:
  directory      The path to the output directory.

Options:
  -h, --help     Display this help.
  -v, --version  Output the version number.
`;

// Start the application.
try {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		help: {short: "h", type: "boolean"},
		version: {short: "v", type: "boolean"}
	}});

	// Print the usage.
	if (values.help || values.version) {
		console.log(values.help ? usage.trim() : pkg.version);
		process.exit();
	}

	// Check the requirements.
	if (!positionals.length) throw "Required argument 'directory' is missing.";

	// Populate the input folder.
	const basePath = fileURLToPath(new URL("..", import.meta.url));
	const input = join(tmpdir(), randomUUID());
	["src/server", "www"].forEach(folder => cpSync(join(basePath, folder), join(input, folder), {recursive: true}));
	["index.phar", "index.php"].forEach(file => rmSync(join(input, `www/${file}`), {force: true}));

	// Build the PHAR archive.
	const [output] = positionals;
	mkdirSync(output, {recursive: true});
	execaSync("php", [join(basePath, "bin/php_index.php"), "--input", input, "--output", output]);
}
catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
