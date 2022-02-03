//! --class-path src --define hxnodejs --library hxnodejs --library tink_core
import haxe.Timer;
import js.glob_watcher.GlobWatcher.watch;
import js.lib.Error;
import js.node.ChildProcess;
import php_index.cli.Tools;
import tink.core.Callback;

/** Runs the script. **/
function main() {
	measureCommand("lix Build --debug");
	ChildProcess.spawn("php", ["-S", "localhost:8080", "-t", "www"], {stdio: Inherit});

	final srcDir = "src/php_index";
	watch('$srcDir/cli/**/*.hx', done -> measureCommand("haxe --debug cli.hxml", done));
	for (app in ["client", "server"]) watch(['$srcDir/base/**/*.hx', '$srcDir/$app/**/*.hx'], done -> measureCommand('haxe --debug $app.hxml', done));

	final loadPath = Tools.captureCommand("lix run bootstrap_bundle libpath");
	watch('$srcDir/ui/**/*.scss', done -> measureCommand('npx sass --load-path=$loadPath $srcDir/ui:www/css', done));
}

/** Measures the time it takes to run the specified command. **/
private function measureCommand(cmd: String, ?callback: Callback<Null<Error>>) {
	Sys.print('$cmd ');
	final timestamp = Timer.stamp();
	final exitCode = Sys.command(cmd);
	Sys.println('> ${Math.ceil(Timer.stamp() - timestamp)}s');
	if (callback != null) callback.invoke(exitCode == 0 ? null : new Error('The command exited with code $exitCode.'));
}
