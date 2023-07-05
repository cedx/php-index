//! --class-path src --library tink_core
import php_index.base.Platform;
import sys.FileSystem;

/** Packages the project. **/
function main() {
	for (script in ["Clean", "Build", "Version"]) Sys.command('lix $script');
	Sys.command("git checkout -- src/php_index/ui/index.css");
	FileSystem.deleteFile("www/index.php");

	minifyFile("bin/php_index.js", Node);
	minifyFile("www/js/main.js", Browser);
	Sys.command("npx @cedx/php-minifier --mode=fast lib");
}

/** Minifies the specified `source` file. **/
private function minifyFile(source: String, ?destination: String, platform: Platform) Sys.command("npx", [
	"esbuild",
	"--allow-overwrite",
	"--legal-comments=none",
	"--log-level=warning",
	"--minify",
	'--outfile=${destination ?? source}',
	'--platform=$platform',
	source
]);
