import Sys.*;
import Tools.captureCommand;
import sys.FileSystem.*;
import sys.io.File.*;

/** Runs the script. **/
function main() {
	final debug = args().contains("--debug") ? "--debug" : "";
	for (app in ["cli", "client", "server"]) command('haxe $debug $app.hxml');

	final bootstrapDir = captureCommand("lix run bootstrap_bundle libpath");
	command('npx sass --load-path=$bootstrapDir src/directory_index/ui:www/css');

	createDirectory("www/fonts");
	copy('$bootstrapDir/fonts/bootstrap-icons.woff2', "www/fonts/icons.woff2");
	copy('$bootstrapDir/js/bootstrap.bundle.min.js', "www/js/vendor.js");
}
