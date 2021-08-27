package directory_index.cli;

import directory_index.base.Version;
import php.PharData;
import sys.FileSystem;
import sys.io.File;

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
		// TODO if (!Phar.canWrite()) return new Error(MethodNotAllowed, "Phar extension does not support creating Phar archives.");

		buildPhar();
		return Noise;
	}

	/** TODO Builds the PHP archive. **/
	function buildPhar() {
		final buildDir = Path.join([basePath, "var/build"]);
		for (folder in ["lib", "www"]) copyDirectory(Path.join([basePath, folder]), Path.join([buildDir, folder]));
		FileSystem.deleteFile(Path.join([buildDir, "www/index.php"]));

		final phar = new PharData("var/index.zip");
		trace(phar.buildFromDirectory(buildDir));
		//phar.setStub("<?php __HALT_COMPILER();");
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
}
