//! --class-path src --define hxnodejs --define no-deprecation-warnings --library hxnodejs --library tink_core
import js.esbuild.Esbuild;
import sys.FileSystem;
import sys.io.File;
using StringTools;
using haxe.io.Path;

/** Builds the project. **/
function main() {
	final debug = Sys.args().contains("--debug");
	for (file in ["build_client", "build_server", "run"]) Sys.command('haxe ${debug ? "--debug" : ""} $file.hxml');

	final fontsource = "node_modules/@fontsource-variable/material-symbols-rounded/files";
	FileSystem.createDirectory("www/fonts");
	File.copy(Path.join([fontsource, "material-symbols-rounded-latin-fill-normal.woff2"]), "www/fonts/material_symbols.woff2");
	Esbuild.build(Tools.buildOptions(debug));
}
