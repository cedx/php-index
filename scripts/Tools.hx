import sys.FileSystem;
import sys.io.File;
using DateTools;
using haxe.io.Path;

#if js
import js.esbuild.Options.BuildOptions;

/** Returns the build settings. **/
function buildOptions(debug = false): BuildOptions return {
	bundle: true,
	entryPoints: ["src/php_index/ui/index.css"],
	external: ["*.woff2"],
	legalComments: None,
	minify: !debug,
	outfile: "www/css/main.css",
	sourcemap: debug
};
#end

/** Recursively deletes all files in the specified `directory`. **/
function cleanDirectory(directory: String) for (entry in FileSystem.readDirectory(directory).filter(entry -> entry != ".gitkeep")) {
	final path = Path.join([directory, entry]);
	FileSystem.isDirectory(path) ? removeDirectory(path) : FileSystem.deleteFile(path);
}

/** Formats the specified `duration` in seconds. **/
function formatDuration(duration: Float) {
	final operand = Math.pow(10, 3);
	final timestamp = Math.round(duration * operand) / operand;

	final seconds = Std.int(timestamp);
	final milliseconds = Std.int((timestamp - seconds).seconds());
	return seconds > 1 ? '${seconds}s ${milliseconds}ms' : '${milliseconds}ms';
}

/** Recursively deletes the specified `directory`. **/
function removeDirectory(directory: String) {
	cleanDirectory(directory);
	FileSystem.deleteDirectory(directory);
}

/** Replaces in the specified `file` the substring which the `pattern` matches with the given `replacement`. **/
function replaceInFile(file: String, pattern: EReg, replacement: String)
	File.saveContent(file, pattern.replace(File.getContent(file), replacement));
