package directory_index.cli;

import directory_index.base.Version;
import php.Phar;
import sys.FileSystem;
import sys.io.File;

using Lambda;
using haxe.io.Path;

/** Build the PHP redistributable. **/
class Program {

	/** Output usage information. **/
	public var help = false;

	/** Output the version number. **/
	public var version = false;

	/** The root directory of this application. **/
	final basePath = Path.join([Sys.programPath().directory(), ".."]);

	/** Creates a new program. **/
	public function new() {}

	/** Application entry point. **/
	static function main() Cli.process(Sys.args(), new Program()).handle(Cli.exit);

	// Runs this command.
	@:defaultCommand
	public function run(): Promise<Noise> {
		if (help) { Cli.getDoc(this); return Noise; }
		if (version) { Version.getPackageVersion(); return Noise; }

		if (!Phar.canWrite()) return new Error(MethodNotAllowed, "Phar extension does not support creating Phar archives.");
		buildPhar();
		return Noise;
	}

	/** Builds the PHP archive. **/
	function buildPhar() {
		final buildDir = Path.join([basePath, "var/build"]);
		if (FileSystem.exists(buildDir)) removeDirectory(buildDir);
		["index.phar", "index.phar.gz"].map(file -> Path.join([basePath, 'var/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);

		for (folder in ["lib", "www"]) copyDirectory(Path.join([basePath, folder]), Path.join([buildDir, folder]));
		["index.phar", "index.php"].map(file -> Path.join([buildDir, 'www/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);
		["directory_index/cli", "tink/cli"].map(folder -> Path.join([buildDir, 'lib/$folder'])).iter(removeDirectory);

		final phar = new Phar(Path.join([basePath, "var/index.phar"]));
		phar.buildFromDirectory(buildDir);
		phar.setStub("<?php __HALT_COMPILER();");

		if (!Phar.canCompress()) File.copy(Path.join([basePath, "var/index.phar"]), Path.join([basePath, "www/index.phar"]));
		else {
			phar.compress(Phar.GZ);
			File.copy(Path.join([basePath, "var/index.phar.gz"]), Path.join([basePath, "www/index.phar"]));
		}
	}

	/** Recursively copies all files in the specified `source` directory to a given `destination` directory. **/
	function copyDirectory(source: String, destination: String) for (entry in FileSystem.readDirectory(source)) {
		final input = Path.join([source, entry]);
		final output = Path.join([destination, entry]);
		if (FileSystem.isDirectory(input)) copyDirectory(input, output);
		else {
			FileSystem.createDirectory(output.directory());
			File.copy(input, output);
		}
	}

	/** Recursively deletes the specified `directory`. **/
	function removeDirectory(directory: String) {
		for (entry in FileSystem.readDirectory(directory)) {
			final path = Path.join([directory, entry]);
			if (FileSystem.isDirectory(path)) removeDirectory(path);
			else FileSystem.deleteFile(path);
		}

		FileSystem.deleteDirectory(directory);
	}
}
