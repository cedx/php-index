//! --class-path src --define hxnodejs --library hxnodejs --library tink_core
import haxe.Timer;
import js.browser_sync.BrowserSync;
import js.esbuild.Esbuild;
import js.glob_watcher.GlobWatcher;
import js.lib.Error as JsError;
import js.node.ChildProcess;
using tink.CoreApi;

/** Watches for file changes. **/
function main() {
	measureCommand("lix Build --debug");

	final host = "127.0.0.1:8000";
	ChildProcess.spawn("php", ["-S", host, "-t", "www"]);

	final browserSync = BrowserSync.create();
	browserSync.init({logLevel: Silent, notify: false, port: 8080, proxy: host});

	final srcDir = "src/php_index";
	for (app in ["client", "server"]) {
		final command = 'haxe --debug build_$app.hxml';
		GlobWatcher.watch(['$srcDir/base/**/*.hx', '$srcDir/$app/**/*.hx'], done -> {
			measureCommand(done, command);
			browserSync.reload();
		});
	}

	Promise.ofJsPromise(Esbuild.context(Tools.buildOptions(true))).handle(outcome -> switch outcome {
		case Failure(error): throw error;
		case Success(context): GlobWatcher.watch("src/**/*.css", done -> {
			final promise = Promise.ofJsPromise(context.rebuild()).next(_ -> browserSync.reload());
			measurePromise(done, 'esbuild $srcDir/ui/index.css', promise);
		});
	});
}

/** Measures the time it takes to run the specified `command`. **/
private function measureCommand(?done: Callback<Null<JsError>>, command: String) {
	Sys.print('$command ');
	final timestamp = Timer.stamp();
	switch Sys.command(command) == 0 ? Success(Noise) : Failure(new Error('The command "$command" failed.')) {
		case Failure(error): done != null ? done.invoke(error.toJsError()) : throw error;
		case Success(_): Sys.println('> ${Tools.formatDuration(Timer.stamp() - timestamp)}'); done?.invoke(null);
	}
}

/** Measures the time it takes to run the specified `promise`. **/
private function measurePromise(?done: Callback<Null<JsError>>, ?prompt: String, promise: Promise<Any>) {
	if (prompt != null) Sys.print('$prompt ');
	final timestamp = Timer.stamp();
	promise.handle(outcome -> switch outcome {
		case Failure(error): done != null ? done.invoke(error.toJsError()) : throw error;
		case Success(_): Sys.println('> ${Tools.formatDuration(Timer.stamp() - timestamp)}'); done?.invoke(null);
	});
}
