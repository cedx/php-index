//! --class-path src --define hxnodejs --library hxnodejs
import Sys.*;
import haxe.Timer;
import js.glob_watcher.GlobWatcher.*;
import js.lib.Error;

/** Runs the script. **/
function main() {
	measureCommand("lix Build --debug");

	final srcDir = "src/directory_index";
	for (app in [/* TODO "client",*/ "server"]) watch(['$srcDir/base/**/*.hx', '$srcDir/$app/**/*.hx'], done -> measureCommand('haxe --debug $app.hxml', done));
}

/** Measures the time it takes to run the specified command. **/
private function measureCommand(cmd: String, ?callback: ?Error -> Void) {
	print('$cmd ');
	final timestamp = Timer.stamp();
	final exitCode = command(cmd);
	println('> ${Math.ceil(Timer.stamp() - timestamp)}s');
	if (callback != null) callback(exitCode == 0 ? null : new Error('The command exited with code $exitCode.'));
}
