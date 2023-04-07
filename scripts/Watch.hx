//! --class-path src --define hxnodejs --library hxnodejs --library tink_core
import haxe.Timer;
import js.esbuild.Esbuild;
import js.glob_watcher.GlobWatcher;
import js.lib.Error as JsError;
import js.node.ChildProcess;
using tink.CoreApi;

/** Watches for file changes. **/
function main() {
	measureCommand("lix Build --debug");
	ChildProcess.spawn("php", ["-S", "127.0.0.1:8080", "-t", "www"], {stdio: Inherit});

	final srcDir = "src/php_index";
	for (app in ["client", "server"]) {
		final command = 'haxe --debug build_$app.hxml';
		GlobWatcher.watch(['$srcDir/base/**/*.hx', '$srcDir/$app/**/*.hx'], done -> measureCommand(done, command));
	}

	Promise.ofJsPromise(Esbuild.context(Tools.buildOptions(true))).handle(outcome -> switch outcome {
		case Failure(error): throw error;
		case Success(context): GlobWatcher.watch("src/**/*.css", done -> measureCallback(done, "esbuild ui/index.css", context.rebuild));
	});
}

/** Measures the time it takes to run the specified `callback` function. **/
private function measureCallback(?done: Callback<Null<JsError>>, ?prompt: String, callback: Callback<Noise>) try {
	if (prompt != null) Sys.print('$prompt ');
	final timestamp = Timer.stamp();
	callback.invoke(Noise);
	Sys.println('> ${Tools.formatDuration(Timer.stamp() - timestamp)}');
	done?.invoke(null);
} catch (e) { done?.invoke(new JsError(e.message)) ?? throw e; }

/** Measures the time it takes to run the specified `command`. **/
private function measureCommand(?done: Callback<Null<JsError>>, command: String, ?arguments: Array<String>) {
	Sys.print('${[command].concat(arguments ?? []).join(" ")} ');
	final timestamp = Timer.stamp();
	final error = Sys.command(command, arguments) == 0 ? null : new JsError('The command "$command" failed.');
	if (error != null) done?.invoke(error) ?? throw error;
	else {
		Sys.println('> ${Tools.formatDuration(Timer.stamp() - timestamp)}');
		done?.invoke(null);
	}
}
