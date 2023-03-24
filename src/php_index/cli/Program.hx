package php_index.cli;

import php_index.base.Version;
import sys.FileSystem;
import sys.io.File;
import uuid.Uuid;
using Lambda;
using StringTools;
using haxe.io.Path;

/** Build the PHP Index redistributable. **/
final class Program {

	/** Compress the PHAR archive. **/
	public var compress = false;

	/** Display this help. **/
	public var help = false;

	/** Output the version number. **/
	public var version = false;

	/** Creates a new program. **/
	public function new() {}

	/** Application entry point. **/
	static function main() Cli.process(Sys.args(), new Program()).handle(Cli.exit);

	/** <directory> : The path to the output directory. **/
	@:defaultCommand
	public function run(rest: Rest<String>): Promise<Noise> {
		if (help || version) {
			Sys.println(version ? Version.packageVersion : Cli.getDoc(this));
			return Noise;
		}

		// Check the requirements.
		final haxelibRun = Sys.getEnv("HAXELIB_RUN") == "1";
		final requiredArgs = haxelibRun ? 2 : 1;
		if (rest.length < requiredArgs) return new Error(BadRequest, "You must provide the path of the output directory.");

		// Populate the input folder.
		final basePath = Path.join([Sys.programPath().directory(), #if js ".." #else "." #end]);
		final input = Path.join([tempDirectory(), Uuid.v4()]);
		["lib", "www"].iter(folder -> copyDirectory(Path.join([basePath, folder]), Path.join([input, folder])));
		["index.phar", "index.php"].map(file -> 'www/$file').filter(FileSystem.exists).iter(FileSystem.deleteFile);

		// Build the PHAR archive.
		final output = rest[0].isAbsolute() ? rest[0] : Path.join([haxelibRun ? rest[rest.length - 1] : Sys.getCwd(), rest[0]]);
		FileSystem.createDirectory(output);
		Sys.command("php", [Path.join([basePath, "bin/php_index.php"]), "--input", input, "--output", output].concat(compress ? ["--compress"] : []));
		return Noise;
	}

	/** Recursively copies all files in the specified `source` directory to a given `destination` directory. **/
	static function copyDirectory(source: String, destination: String) for (entry in FileSystem.readDirectory(source)) {
		final input = Path.join([source, entry]);
		final output = Path.join([destination, entry]);
		if (FileSystem.isDirectory(input)) copyDirectory(input, output);
		else {
			FileSystem.createDirectory(output.directory());
			File.copy(input, output);
		}
	}

	/** Gets the path to the operating system directory for temporary files. **/
	static function tempDirectory() {
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
			if (path != null) return '${path.removeTrailingSlashes()}\\Temp';
		}

		return "C:\\Windows\\Temp";
	}
}
