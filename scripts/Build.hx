import Sys.*;
import Tools.captureCommand;
import sys.FileSystem.*;
import sys.io.File.*;

using haxe.io.Path;

/** Runs the script. **/
function main() {
	final debug = args().contains("--debug") ? "--debug" : "";
	for (app in [/* TODO "cli", */ "client", "server"]) command('haxe $debug $app.hxml');

	final bootstrapDir = captureCommand("lix run bootstrap_bundle libpath");
	command('npx sass --load-path=$bootstrapDir src/directory_index/ui:www/css');
	copy('$bootstrapDir/js/bootstrap.bundle.min.js', "www/js/vendor.js");
}
