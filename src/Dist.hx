//! --class-path src --library tink_core
import sys.FileSystem;

/** Packages the project. **/
function main() {
	for (script in ["Clean", "Build", "Version"]) Sys.command('lix $script');
	if (FileSystem.exists("www/index.php")) FileSystem.deleteFile("www/index.php");

	minifyFile("bin/php_index.js", true);
	minifyFile("www/js/main.js", false);
	Sys.command("git update-index --chmod=+x bin/php_index.js");
	Sys.command("npx @cedx/php-minifier --mode=fast lib");
}

/** Minifies the specified source file. **/
private function minifyFile(source: String, ?destination: String, isNode = false) Sys.command("npx", [
	"esbuild",
	"\"--banner:js=#!/usr/bin/env node\"",
	"--legal-comments=none",
	"--log-level=warning",
	"--minify",
	'--outfile=${destination ?? source}',
	'--platform=${isNode ? "node" : "browser"}',
	source
]);
