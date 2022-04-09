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

/** Build the PHP Index redistributable. **/
final class Program {

	/** Compress the data. **/
	public var compress = false;

	/** Output usage information. **/
	public var help = false;

	/** Generate a PHAR archive. **/
	public var phar = false;

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

		final haxelibRun = Sys.getEnv("HAXELIB_RUN") == "1";
		final requiredArgs = 1;
		if (rest.length < requiredArgs || (haxelibRun && rest.length < requiredArgs + 1))
			return new Error(BadRequest, "You must provide the path of the output directory.");

		final output = rest[0].isAbsolute() ? rest[0] : Path.join([haxelibRun ? rest[rest.length - 1] : Sys.getCwd(), rest[0]]);
		FileSystem.createDirectory(output);

		final basePath = Sys.programPath().directory();
		final input = Path.join([Tools.tempDirectory, Uuid.v4()]);
		for (folder in ["lib", "www"]) Tools.copyDirectory(Path.join([basePath, folder]), Path.join([input, folder]));
		["index.phar", "index.php", "index.zip"].map(file -> Path.join([input, 'www/$file'])).filter(FileSystem.exists).iter(FileSystem.deleteFile);
		return phar ? buildPharArchive(input, output) : buildZipArchive(input, output);
	}

	/** Builds the PHAR archive from the specified `input` directory to a given `output` directory. **/
	function buildPharArchive(input: String, output: String) {
		final arguments = [Path.join([Sys.programPath().directory(), "bin/php_index.php"]), "--input", input, "--output", output];
		if (compress) arguments.push("--compress");
		return Sys.command("php", arguments) == 0 ? Success(Noise) : Failure(new Error("An error occurred while creating the PHAR archive."));
	}

	/** Builds the ZIP archive from the specified `input` directory to a given `output` directory. **/
	function buildZipArchive(input: String, output: String) {
		final workingDirectory = Sys.getCwd();
		Sys.setCwd(input);
		Tools.compress(["lib", "www"], Path.join([output, "index.zip"]), compress ? 9 : 0);
		Sys.setCwd(workingDirectory);

		final inputFile = Path.join([Sys.programPath().directory(), "www/index.php"]);
		final outputFile = Path.join([output, "index.php"]);
		File.saveContent(outputFile, ~/const useDataFile = false/.replace(File.getContent(inputFile), "const useDataFile = true"));
		return Success(Noise);
	}
}
