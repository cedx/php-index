#if nodejs
import js.esbuild.Options.BuildOptions;
import js.html.URL;
import js.lib.RegExp;
import php_index.base.Platform;
#end
import sys.FileSystem;
import sys.io.File;
using DateTools;
using haxe.io.Path;

#if nodejs
/** Returns the build settings. **/
function buildOptions(debug = false): BuildOptions return {
	bundle: true,
	entryPoints: ["src/php_index/ui/index.css"],
	external: ["*.webp", "*.woff2"],
	legalComments: None,
	minify: !debug,
	outfile: "www/css/main.css",
	plugins: [haxelibResolver],
	sourcemap: debug
};

/** Resolves `haxelib://` imports. **/
private final haxelibResolver = {
	name: "haxelib",
	setup: build -> {
		final cache = new Map<String, String>();
		build.onResolve({filter: new RegExp("^haxelib://")}, args -> {
			final uri = new URL(args.path);
			if (!cache.exists(uri.hostname)) cache[uri.hostname] = Platform.resolveLibrary(uri.hostname);
			{path: Path.join([cache[uri.hostname], uri.pathname.substr(1)])};
		});
	}
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
