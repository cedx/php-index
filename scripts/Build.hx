//! --class-path src --define hxnodejs --library hxnodejs
import js.esbuild.Esbuild;
using haxe.io.Path;

/** Builds the project. **/
function main() {
	final debug = Sys.args().contains("--debug");
	for (app in ["client", "server"]) Sys.command('haxe ${debug ? "--debug --define source-map-content" : ""} build_$app.hxml');

	/* TODO
	final bootstrap = Tools.captureCommand("lix", ["run", "bootstrap_bundle", "libpath"]);
	Sys.command("lix run mc2it_theme copy --fonts --img www");
	Tools.replaceInFile("src/php_index/ui/index.css", ~/".*\/css\/bootstrap.css"/, '"${Path.join([theme, "css/bootstrap.css"])}"');
	Esbuild.build(Tools.buildOptions(debug));
	*/
}
