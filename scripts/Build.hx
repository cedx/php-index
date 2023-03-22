//! --class-path src --define hxnodejs --library hxnodejs
import js.esbuild.Esbuild;
import sys.FileSystem;
import sys.io.File;
using haxe.io.Path;

/** Builds the project. **/
function main() {
	final debug = Sys.args().contains("--debug");
	for (app in ["client", "server"]) Sys.command('haxe ${debug ? "--debug --define source-map-content" : ""} build_$app.hxml');

	final bootstrap = Tools.captureCommand("lix", ["run", "bootstrap_bundle", "libpath"]);
	FileSystem.createDirectory("www/css");
	File.copy(Path.join([bootstrap, "fonts/bootstrap-icons.woff2"]), "www/css/icons.woff2");

	Tools.replaceInFile("src/php_index/ui/index.css", ~/".*\/css\/bootstrap.css"/, '"${Path.join([bootstrap, "css/bootstrap.css"])}"');
	Esbuild.build(Tools.buildOptions(debug));
}
