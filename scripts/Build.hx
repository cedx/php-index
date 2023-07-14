//! --class-path src --define hxnodejs --define no-deprecation-warnings --library hxnodejs --library tink_core
import js.esbuild.Esbuild;
import js.node.ChildProcess;
import sys.FileSystem;
import sys.io.File;
using StringTools;
using haxe.io.Path;

/** Builds the project. **/
function main() {
	final debug = Sys.args().contains("--debug");
	for (file in ["build_client", "build_server", "run"]) Sys.command('haxe ${debug ? "--debug" : ""} $file.hxml');

	final bootstrap = ChildProcess.execSync("lix run bootstrap_bundle libpath", {encoding: "utf8"}).rtrim();
	FileSystem.createDirectory("www/fonts");
	File.copy(Path.join([bootstrap, "fonts/bootstrap-icons.woff2"]), "www/fonts/icons.woff2");
	Esbuild.build(Tools.buildOptions(debug));
}
