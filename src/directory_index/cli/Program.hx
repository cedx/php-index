package directory_index.cli;

import directory_index.base.Version;
// TODO import php.Phar;
// TODO import php.PharData;
import sys.FileSystem;
import sys.io.File;
import tink.Cli;
import tink.cli.Rest;
import uuid.Uuid;

using Lambda;
using haxe.io.Path;
using tink.CoreApi;

/** Build the PHP redistributable. **/
class Program {

	/** Compress the data file. **/
	public var compress = false;

	/** Output usage information. **/
	public var help = false;

	/** Output the version number. **/
	public var version = false;

	/** The root directory of this application. **/
	final basePath = Sys.programPath().directory();

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
		buildDataFile();
		return Noise;
	}

	/** Builds the data file. **/
	function buildDataFile() {
		final buildDir = Path.join([Tools.getTempDirectory(), Uuid.v4()]);
		for (folder in ["lib", "www"]) Tools.copyDirectory(Path.join([basePath, folder]), Path.join([buildDir, folder]));
		["index.php", "index.zip"].map(file -> Path.join([buildDir, 'www/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);

		final previousCwd = Sys.getCwd();
		Sys.setCwd(buildDir);
		Tools.compress(["lib", "www"], Path.join([basePath, 'www/index.zip']), compress ? 9 : 0);
		Sys.setCwd(previousCwd);
	}

	/** Builds the data file. **/
	/*
	function buildPhar() {
		final buildDir = Path.join([basePath, "var/build"]);
		if (FileSystem.exists(buildDir)) Tools.removeDirectory(buildDir);
		["index.phar", "index.phar.gz"].map(file -> Path.join([basePath, 'var/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);

		for (folder in ["lib", "www"]) Tools.copyDirectory(Path.join([basePath, folder]), Path.join([buildDir, folder]));
		["index.phar", "index.php"].map(file -> Path.join([buildDir, 'www/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);
		["directory_index/cli", "tink/cli"].map(folder -> Path.join([buildDir, 'lib/$folder'])).iter(Tools.removeDirectory);

		final phar = new Phar(Path.join([basePath, "var/index.phar"]));
		phar.buildFromDirectory(buildDir);
		phar.setStub("<?php __HALT_COMPILER();");

		if (!Phar.canCompress()) File.copy(Path.join([basePath, "var/index.phar"]), Path.join([basePath, "www/index.phar"]));
		else {
			phar.compress(Phar.GZ);
			File.copy(Path.join([basePath, "var/index.phar.gz"]), Path.join([basePath, "www/index.phar"]));
		}
	}*/

	/** Builds the data file. **/
	/*
	function buildPharData() {
		final buildDir = Path.join([basePath, "var/build"]);
		if (FileSystem.exists(buildDir)) Tools.removeDirectory(buildDir);
		["index.phar", "index.phar.gz"].map(file -> Path.join([basePath, 'var/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);

		for (folder in ["lib", "www"]) Tools.copyDirectory(Path.join([basePath, folder]), Path.join([buildDir, folder]));
		["index.phar", "index.php"].map(file -> Path.join([buildDir, 'www/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);
		["directory_index/cli", "tink/cli"].map(folder -> Path.join([buildDir, 'lib/$folder'])).iter(Tools.removeDirectory);

		final phar = new PharData(Path.join([basePath, "var/index.zip"]));
		phar.buildFromDirectory(buildDir);

		if (!Phar.canCompress()) File.copy(Path.join([basePath, "var/index.zip"]), Path.join([basePath, "www/index.phar"]));
		else {
			phar.compressFiles(Phar.GZ);
			File.copy(Path.join([basePath, "var/index.zip"]), Path.join([basePath, "www/index.phar"]));
		}
	}*/
}
