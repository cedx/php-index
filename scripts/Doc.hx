//! --class-path src
import Sys.*;
import php_index.base.Version.*;
import php_index.cli.Tools.*;
import sys.FileSystem.*;
import sys.io.File.*;

/** Runs the script. **/
function main() {
	if (exists("docs/api")) removeDirectory("docs/api");

	final version = getPackageVersion();
	for (app in ["cli", "client", "server"]) {
		command('haxe --define doc-gen --no-output --xml var/api.xml $app.hxml');
		command("lix", [
			"run", "dox",
			"--define", "description", "A PHP directory index generator, implemented in Haxe.",
			"--define", "source-path", "https://github.com/cedx/php-index.hx/blob/main/src",
			"--define", "themeColor", "0xffc105",
			"--define", "version", version,
			"--define", "website", "https://github.com/cedx/php-index.hx",
			"--input-path", "var",
			"--output-path", 'docs/api/$app',
			"--title", "PHP Index",
			"--toplevel-package", 'php_index.$app'
		]);

		copy("www/favicon.ico", 'docs/api/$app/favicon.ico');
	}
}
