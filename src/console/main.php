<?php
/**
 * Application entry point.
 * @throws LogicException A required command line argument is missing.
 * @throws RuntimeException The Phar archive could not be created.
 */
function main(): void {
	// Parse the command line arguments.
	$options = ["c" => "compress", "i:" => "input:", "o:" => "output:"];
	$values = getopt(implode(array_keys($options)), $options);

	// Check the requirements.
	if (!extension_loaded("phar")) throw new RuntimeException("Phar extension is not loaded.", 501);
	if (!Phar::canWrite()) throw new RuntimeException("Phar extension does not support creating Phar archives.", 501);

	$input = $values["i"] ?? ($values["input"] ?? "");
	if (!$input || !is_dir($input)) throw new LogicException("You must provide a valid path to the input directory.", 400);

	$output = $values["o"] ?? ($values["output"] ?? "");
	if (!$output || !is_dir($output)) throw new LogicException("You must provide a valid path to the output directory.", 400);

	$stub = file_get_contents(__DIR__ . "/stub.php");
	if (!$stub) throw new RuntimeException("Unable to load the bootstrap stub of the Phar archive.", 500);

	// Create the Phar archive.
	$phar = new Phar("$output/index.phar");
	$phar->buildFromDirectory($input);
	$phar->setStub($stub);

	// Compress the Phar archive.
	$compress = isset($values["c"]) || isset($values["compress"]);
	if ($compress && Phar::canCompress(Phar::GZ)) $phar->compressFiles(Phar::GZ);
}
