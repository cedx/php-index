package directory_index.cli;

import haxe.crypto.Crc32;
import haxe.Exception;
import haxe.zip.Entry;
import haxe.zip.Writer;
import sys.FileSystem;
import sys.io.File;

using Lambda;
using StringTools;
using haxe.io.Path;
using haxe.zip.Tools;

/** Provides helper methods for console applications. **/
abstract class Tools {

	/** Captures the output of the specified `command`. **/
	public static function captureCommand(command: String, ?arguments: Array<String>) {
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
	public static function cleanDirectory(directory: String, ?exclude: EReg)
		for (entry in FileSystem.readDirectory(directory).filter(entry -> exclude == null || !exclude.match(entry))) {
			final path = Path.join([directory, entry]);
			if (FileSystem.isDirectory(path)) removeDirectory(path);
			else FileSystem.deleteFile(path);
		}

	/** Creates a ZIP archive from the specified file system entities. **/
	public static function compress(sources: Array<String>, destination: String) {
		final output = File.write(destination);
		final writer = new Writer(output);

		var entries: Array<Entry> = [];
		for (source in sources) entries = entries.concat(FileSystem.isDirectory(source) ? compressDirectory(source) : [compressFile(source)]);
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

	/** Gets the path to the system temporary directory. **/
	public static function getTempDirectory() {
		if (Sys.systemName() != "Windows") {
			for (name in ["TMPDIR", "TMP", "TEMP"]) {
				final path = Sys.getEnv(name);
				if (path != null) return path.length > 1 ? path.removeTrailingSlashes() : path;
			}

			return "/tmp";
		}

		for (name in ["TEMP", "TMP"]) {
			final path = Sys.getEnv(name);
			if (path != null) return path.length > 1 && !path.endsWith(":\\") ? path.removeTrailingSlashes() : path;
		}

		for (name in ["SystemRoot", "windir"]) {
			final path = Sys.getEnv(name);
			if (path != null) return '$path\\Temp';
		}

		return "C:\\Windows\\Temp";
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
	static function compressDirectory(directory: String) {
		var entries: Array<Entry> = [];
		for (entry in FileSystem.readDirectory(directory)) {
			final path = Path.join([directory, entry]);
			entries = entries.concat(FileSystem.isDirectory(path) ? compressDirectory(path) : [compressFile(path)]);
		}

		return entries;
	}

	/** Compresses the specified `file` in ZIP format. **/
	static function compressFile(file: String) {
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

		entry.compress(9);
		return entry;
	}
}