#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {program} from "commander";

// Parse the command line arguments.
const {version} = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
program.name("php_index")
	.description("Build the PHP Index redistributable.")
	.version(version, "-v, --version")
	.argument("<directory>", "the path to the output directory")
	.parse();

// Start the application.
// TODO
