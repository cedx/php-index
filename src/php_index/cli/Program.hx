package php_index.cli;

import php_index.base.Version;
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

	/** Compress the data. **/
	public var compress = false;

	/** Output usage information. **/
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
		if (help) return { Sys.println(Cli.getDoc(this)); Noise; };
		if (version) return { Sys.println(Version.getPackageVersion()); Noise; }

		final haxelibRun = Sys.getEnv("HAXELIB_RUN") == "1";
		final requiredArgs = 1;
		if (rest.length < requiredArgs || (haxelibRun && rest.length < requiredArgs + 1))
			return new Error(BadRequest, "You must provide the path of the output directory.");

		final output = rest[0].isAbsolute() ? rest[0] : Path.join([haxelibRun ? rest[rest.length - 1] : Sys.getCwd(), rest[0]]);
		FileSystem.createDirectory(output);
		buildDataFile(output);
		return Noise;
	}

	/** Builds the data file in the specified `destination` directory. **/
	function buildDataFile(destination: String) {
		final buildDir = Path.join([Tools.tempDirectory, Uuid.v4()]);
		final rootDir = Sys.programPath().directory();
		for (folder in ["lib", "www"]) Tools.copyDirectory(Path.join([rootDir, folder]), Path.join([buildDir, folder]));
		["index.phar", "index.php", "index.zip"].map(file -> Path.join([buildDir, 'www/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);

		final workingDirectory = Sys.getCwd();
		Sys.setCwd(buildDir);
		Tools.compress(["lib", "www"], Path.join([destination, "index.zip"]), compress ? 9 : 0);
		Sys.setCwd(workingDirectory);

		final inputFile = Path.join([rootDir, "www/index.php"]);
		final outputFile = Path.join([destination, "index.php"]);
		File.saveContent(outputFile, ~/const useDataFile = false/.replace(File.getContent(inputFile), "const useDataFile = true"));
	}
}
