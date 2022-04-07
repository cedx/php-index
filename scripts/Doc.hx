//! --class-path src
import php_index.base.Version;
import php_index.cli.Tools;
import sys.FileSystem;
import sys.io.File;

/** Runs the script. **/
function main() {
	if (FileSystem.exists("docs")) Tools.removeDirectory("docs");

	for (app in ["cli", "client", "server"]) {
		Sys.command('haxe --define doc-gen --no-output --xml var/api.xml $app.hxml');
		Sys.command("lix", [
			"run", "dox",
			"--define", "description", "A PHP directory index generator, implemented in Haxe.",
			"--define", "source-path", "https://github.com/cedx/php-index.hx/blob/main/src",
			"--define", "themeColor", "0xffc105",
			"--define", "version", Version.packageVersion,
			"--define", "website", "https://github.com/cedx/php-index.hx",
			"--input-path", "var",
			"--output-path", 'docs/$app',
			"--title", "PHP Index",
			"--toplevel-package", 'php_index.$app'
		]);

		File.copy("www/favicon.ico", 'docs/$app/favicon.ico');
	}
}
