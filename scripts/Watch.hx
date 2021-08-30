//! --class-path src --define hxnodejs --library hxnodejs
import Sys.*;
import haxe.Timer;
import js.glob_watcher.GlobWatcher.*;
import js.lib.Error;
import js.node.ChildProcess;
import php_index.cli.Tools.*;

/** Runs the script. **/
function main() {
	measureCommand("lix Build --debug");
	ChildProcess.spawn("php", ["-S", "localhost:8080", "-t", "www"], {stdio: Inherit});

	final srcDir = "src/php_index";
	for (app in ["client", "server"]) watch(['$srcDir/base/**/*.hx', '$srcDir/$app/**/*.hx'], done -> measureCommand('haxe --debug $app.hxml', done));

	final loadPath = captureCommand("lix run bootstrap_bundle libpath");
	watch('$srcDir/ui/**/*.scss', done -> measureCommand('npx sass --load-path=$loadPath $srcDir/ui:www/css', done));
}

/** Measures the time it takes to run the specified command. **/
private function measureCommand(cmd: String, ?callback: ?Error -> Void) {
	print('$cmd ');
	final timestamp = Timer.stamp();
	final exitCode = command(cmd);
	println('> ${Math.ceil(Timer.stamp() - timestamp)}s');
	if (callback != null) callback(exitCode == 0 ? null : new Error('The command exited with code $exitCode.'));
}
