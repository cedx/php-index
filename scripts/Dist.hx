//! --class-path src --library tink_core
import php_index.base.Platform;
import sys.FileSystem;

/** Packages the project. **/
function main() {
	for (script in ["Clean", "Build", "Version"]) Sys.command('lix $script');
	Sys.command("git checkout -- src/php_index/ui/index.css");
	FileSystem.deleteFile("www/index.php");

	minifyFile("www/js/main.js");
	Sys.command("npx @cedx/php-minifier --mode=fast lib");

	final cli = "bin/php_index.js";
	minifyFile(cli, Node);
	Sys.command('git update-index --chmod=+x $cli');
	if (Sys.systemName() != "Windows") Sys.command('chmod +x $cli');
}

/** Minifies the specified `source` file. **/
private function minifyFile(source: String, ?destination: String, platform = Platform.Browser) Sys.command("npx", [
	"esbuild",
	"--allow-overwrite",
	"--legal-comments=none",
	"--log-level=warning",
	"--minify",
	'--outfile=${destination ?? source}',
	'--platform=$platform',
	source
]);
