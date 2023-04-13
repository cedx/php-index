package php_index.cli;

import php_index.base.Version;
import sys.FileSystem;
import sys.io.File;
import uuid.Uuid;
using Lambda;
using StringTools;
using haxe.io.Path;

#if java
import java.lang.System;
#elseif nodejs
import js.node.Os;
#elseif php
import php.Global;
#end

/**
	Build the PHP Index redistributable.

	> php_index [flags] <directory>
**/
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

	/** directory : The path to the output directory. **/
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
		final input = Path.join([systemTempDirectory(), Uuid.v4()]);
		["lib", "www"].iter(folder -> copyDirectory(Path.join([basePath, folder]), Path.join([input, folder])));
		["index.phar", "index.php"].map(file -> 'www/$file').filter(FileSystem.exists).iter(FileSystem.deleteFile);

		// Build the PHAR archive.
		final output = rest[0].isAbsolute() ? rest.shift() : Path.join([haxelibRun ? rest.pop() : Sys.getCwd(), rest.shift()]);
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

	/** Gets the path to the system temporary directory. **/
	static #if (java || nodejs || php) inline #end function systemTempDirectory(): String {
		#if java
			return System.getProperty("java.io.tmpdir");
		#elseif nodejs
			return Os.tmpdir();
		#elseif php
			return Global.sys_get_temp_dir();
		#else
			function getEnv(name: String) {
				final value = Sys.getEnv(name);
				return value != null ? Some(value) : None;
			}

			return switch Sys.systemName() {
				case "Windows":
					final path = getEnv("TMP").orTry(getEnv("TEMP")).or(getEnv("SystemRoot").orTry(getEnv("windir")).sure() + "\\Temp");
					path.length > 1 && !path.endsWith(":\\") ? path.removeTrailingSlashes() : path;
				default:
					final path = getEnv("TMPDIR").orTry(getEnv("TMP")).orTry(getEnv("TEMP")).or("/tmp");
					path.length > 1 ? path.removeTrailingSlashes() : path;
			}
		#end
	}
}
