//! --class-path src --library tink_core
import php_index.cli.Tools;
import sys.FileSystem;
import sys.io.File;

/** Runs the script. **/
function main() {
	final debug = Sys.args().contains("--debug") ? "--debug" : "";
	for (app in ["cli", "client", "server"]) Sys.command('haxe $debug $app.hxml');

	final bootstrapDir = Tools.captureCommand("lix run bootstrap_bundle libpath").sure();
	Sys.command('npx sass --load-path=$bootstrapDir src/php_index/ui:www/css');

	FileSystem.createDirectory("www/fonts");
	File.copy('$bootstrapDir/fonts/bootstrap-icons.woff2', "www/fonts/icons.woff2");
	File.copy('$bootstrapDir/js/bootstrap.bundle.min.js', "www/js/vendor.js");
}
