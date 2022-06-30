#!/usr/bin/env node
import {randomUUID} from "node:crypto";
import {cpSync, mkdirSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {program} from "commander";
import {execaSync} from "execa";
import pkg from "../package.json" assert {type: "json"};

// Parse the command line arguments.
program.name("php_index")
	.description("Build the PHP Index redistributable.")
	.version(pkg.version, "-v, --version")
	.argument("<directory>", "the path to the output directory")
	.parse();

// Populate the input folder.
const basePath = fileURLToPath(new URL("..", import.meta.url));
const input = join(tmpdir(), randomUUID());
["lib/server", "www"].forEach(folder => cpSync(join(basePath, folder), join(input, folder), {recursive: true}));
["index.phar", "index.php"].forEach(file => rmSync(join(input, `www/${file}`), {force: true}));

// Build the PHAR archive.
const [output] = program.args;
mkdirSync(output, {recursive: true});
execaSync("php", [join(basePath, "bin/php_index.php"), "--input", input, "--output", output]);
