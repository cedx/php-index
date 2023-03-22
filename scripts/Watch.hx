//! --class-path src --define hxnodejs --library hxnodejs --library tink_core
import haxe.Timer;
import js.esbuild.Esbuild;
import js.glob_watcher.GlobWatcher;
import js.lib.Error as JsError;
using tink.CoreApi;

/** Watches for file changes. **/
function main() {
	measureCommand("lix Build --debug");

	final srcDir = "src/php_index";
	for (app in ["client", "server"]) {
		final command = 'haxe --debug --define source-map-content build_$app.hxml';
		GlobWatcher.watch(['$srcDir/base/**/*.hx', '$srcDir/$app/**/*.hx'], done -> measureCommand(done, command));
	}

	/* TODO
	Esbuild.context(Tools.buildOptions(true))
		.then(context -> GlobWatcher.watch("src/**\/*.css", done -> measureCallback(done, "esbuild ui/index.css", context.rebuild))); */

	Sys.command("php -S 127.0.0.1:8080 -t www");
}

/** Measures the time it takes to run the specified `callback` function. **/
private function measureCallback(?done: Callback<Null<JsError>>, ?prompt: String, callback: Callback<Noise>) try {
	if (prompt != null) Sys.print('$prompt ');
	final timestamp = Timer.stamp();
	callback.invoke(Noise);
	Sys.println('> ${Tools.formatDuration(Timer.stamp() - timestamp)}');
	if (done != null) done.invoke(null);
} catch (e) { done != null ? done.invoke(new JsError(e.message)) : throw e; }

/** Measures the time it takes to run the specified `command`. **/
private function measureCommand(?done: Callback<Null<JsError>>, command: String, ?arguments: Array<String>) {
	Sys.print('${[command].concat(arguments != null ? arguments : []).join(" ")} ');
	final timestamp = Timer.stamp();
	final error = Sys.command(command, arguments) == 0 ? null : new JsError('The command "$command" failed.');
	if (error != null) done != null ? done.invoke(error) : throw error;
	else {
		Sys.println('> ${Tools.formatDuration(Timer.stamp() - timestamp)}');
		if (done != null) done.invoke(null);
	}
}
