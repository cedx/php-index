//! --class-path src --define hxnodejs --define no-deprecation-warnings --library hxnodejs
import js.esbuild.Esbuild;
import sys.FileSystem;
import sys.io.File;
using haxe.io.Path;

/** Builds the project. **/
function main() {
	final debug = Sys.args().contains("--debug");
	for (file in ["build_client", "build_server", "run"]) Sys.command('haxe ${debug ? "--debug" : ""} $file.hxml');

	final bootstrap = Tools.captureCommand("lix", ["run", "bootstrap_bundle", "libpath"]);
	FileSystem.createDirectory("www/fonts");
	File.copy(Path.join([bootstrap, "fonts/bootstrap-icons.woff2"]), "www/fonts/icons.woff2");

	Tools.replaceInFile("src/php_index/ui/index.css", ~/".*\/css\/bootstrap.css"/, '"${Path.join([bootstrap, "css/bootstrap.css"])}"');
	Esbuild.build(Tools.buildOptions(debug));
}
