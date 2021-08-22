import Sys.*;
import Tools.captureCommand;
import sys.FileSystem.*;
import sys.io.File.*;

using haxe.io.Path;

/** Runs the script. **/
function main() {
	final debug = args().contains("--debug") ? "--debug" : "";
	for (app in [/* TODO "cli", "client", */ "server"]) command('haxe $debug $app.hxml');

	final bootstrapDir = captureCommand("lix run bootstrap_bundle libpath");
	for (file in ["css/bootstrap.min.css", "js/bootstrap.bundle.min.js"]) {
		final directory = file.directory();
		createDirectory('www/$directory');
		copy('$bootstrapDir/$file', 'www/$directory/vendor.${file.extension()}');
	}
}
