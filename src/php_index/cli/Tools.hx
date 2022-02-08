package php_index.cli;

import haxe.crypto.Crc32;
import haxe.zip.Entry;
import haxe.zip.Writer;
import sys.FileSystem;
import sys.io.File;
using Lambda;
using StringTools;
using haxe.io.Path;
using haxe.zip.Tools;

#if tink_core
import #if nodejs js.node.ChildProcess #else sys.io.Process #end;
using tink.CoreApi;
#end

/** Provides helper methods for console applications. **/
abstract class Tools {

	/** The path to the operating system directory for temporary files. **/
	public static var tempDirectory(get, null): String;

	/** Gets the path to the operating system directory for temporary files. **/
	static function get_tempDirectory() {
		if (tempDirectory == null) tempDirectory = getTempDirectory();
		return tempDirectory;
	}

	#if tink_core
	/** Captures the output of the specified `command`. **/
	public static function captureCommand(command: String, ?arguments: Array<String>) {
		#if nodejs
			final process = ChildProcess.spawnSync(command, arguments, {encoding: "utf8", shell: arguments == null});
			return process.status == 0 ? Success(process.stdout.trim()) : Failure(new Error(process.stderr));
		#else
			final process = new Process(command, arguments);
			final outcome = process.exitCode() == 0
				? Success(process.stdout.readAll().toString().trim())
				: Failure(new Error(process.stderr.readAll().toString()));

			process.close();
			return outcome;
		#end
	}
	#end

	/** Recursively deletes all files in the specified `directory`. **/
	public static function cleanDirectory(directory: String, ?exclude: EReg)
		for (entry in FileSystem.readDirectory(directory).filter(entry -> exclude == null || !exclude.match(entry))) {
			final path = Path.join([directory, entry]);
			if (FileSystem.isDirectory(path)) removeDirectory(path);
			else FileSystem.deleteFile(path);
		}

	/** Creates a ZIP archive from the specified file system entities. **/
	public static function compress(sources: Array<String>, destination: String, level = 9) {
		final output = File.write(destination);
		final writer = new Writer(output);

		var entries: Array<Entry> = [];
		for (source in sources) entries = entries.concat(FileSystem.isDirectory(source) ? compressDirectory(source, level) : [compressFile(source, level)]);
		writer.write(entries.list());
		output.close();
	}

	/** Recursively copies all files in the specified `source` directory to a given `destination` directory. **/
	public static function copyDirectory(source: String, destination: String) for (entry in FileSystem.readDirectory(source)) {
		final input = Path.join([source, entry]);
		final output = Path.join([destination, entry]);
		if (FileSystem.isDirectory(input)) copyDirectory(input, output);
		else {
			FileSystem.createDirectory(output.directory());
			File.copy(input, output);
		}
	}

	/** Recursively deletes the specified `directory`. **/
	public static function removeDirectory(directory: String) {
		cleanDirectory(directory);
		FileSystem.deleteDirectory(directory);
	}

	/** Replaces in the specified `file` the substring which the `pattern` matches with the given `replacement`. **/
	public static function replaceInFile(file: String, pattern: EReg, replacement: String)
		File.saveContent(file, pattern.replace(File.getContent(file), replacement));

	/** Compresses the content of the specified `directory` in ZIP format. **/
	static function compressDirectory(directory: String, level = 9) {
		var entries: Array<Entry> = [];
		for (entry in FileSystem.readDirectory(directory)) {
			final path = Path.join([directory, entry]);
			entries = entries.concat(FileSystem.isDirectory(path) ? compressDirectory(path, level) : [compressFile(path, level)]);
		}

		return entries;
	}

	/** Compresses the specified `file` in ZIP format. **/
	static function compressFile(file: String, level = 9) {
		final bytes = File.getBytes(file);
		final entry: Entry = {
			compressed: false,
			crc32: Crc32.make(bytes),
			data: bytes,
			dataSize: bytes.length,
			fileName: file,
			fileSize: bytes.length,
			fileTime: FileSystem.stat(file).mtime
		};

		if (level > 0) entry.compress(level);
		return entry;
	}

	/** Gets the path to the operating system directory for temporary files. **/
	static function getTempDirectory() {
		if (Sys.systemName() != "Windows") {
			for (name in ["TMPDIR", "TMP", "TEMP"]) {
				final path = Sys.getEnv(name);
				if (path != null) return path.length > 1 ? path.removeTrailingSlashes() : path;
			}

			return "/tmp";
		}

		for (name in ["TMP", "TEMP"]) {
			final path = Sys.getEnv(name);
			if (path != null) return path.length > 1 && !path.endsWith(":\\") ? path.removeTrailingSlashes() : path;
		}

		for (name in ["SystemRoot", "windir"]) {
			final path = Sys.getEnv(name);
			if (path != null) return '$path\\Temp';
		}

		return "C:\\Windows\\Temp";
	}
}
