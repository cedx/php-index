import haxe.Exception;
import haxe.io.Path.*;
import sys.FileSystem.*;
import sys.io.File.*;

using StringTools;

/** Captures the output of the specified `command`. **/
function captureCommand(command: String, ?arguments: Array<String>) {
	#if nodejs
		final process = js.node.ChildProcess.spawnSync(command, arguments, {encoding: "utf8", shell: arguments == null});
		return process.status == 0 ? process.stdout.trim() : throw new Exception(process.stderr.trim());
	#else
		final process = new sys.io.Process(command, arguments);
		final success = process.exitCode() == 0;
		final output = (success ? process.stdout.readAll() : process.stderr.readAll()).toString().trim();
		process.close();
		return success ? output : throw new Exception(output);
	#end
}

/** Recursively deletes all files in the specified `directory`. **/
function cleanDirectory(directory: String) for (entry in readDirectory(directory).filter(entry -> entry != ".gitkeep")) {
	final path = join([directory, entry]);
	if (isDirectory(path)) removeDirectory(path);
	else deleteFile(path);
}

/** Recursively deletes the specified `directory`. **/
function removeDirectory(directory: String) {
	cleanDirectory(directory);
	deleteDirectory(directory);
}

/** Replaces in the specified `file` the substring which the `pattern` matches with the given `replacement`. **/
function replaceInFile(file: String, pattern: EReg, replacement: String)
	saveContent(file, pattern.replace(getContent(file), replacement));
