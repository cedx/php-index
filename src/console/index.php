<?php
/**
 * The bootstrap stub of the Phar archive.
 * @var string
 */
const stub = <<<'EOF'
<?php
// Register the class loader.
$pharPath = basename(__FILE__);
spl_autoload_register(function(string $class) use ($pharPath) {
	$parts = explode("\\", $class);
	array_shift($parts);
	include "phar://$pharPath/lib/".implode("/", $parts).".php";
});

// Start the application.
$controller = new \php_index\Controller;
try { $controller->handleRequest($_GET); }
catch (Throwable $e) {
	$code = $e->getCode();
	$controller->sendResponse($e->getMessage(), mediaType: "text/plain", status: $code >= 400 && $code < 600 ? $code : 500);
}

__HALT_COMPILER();
EOF;

/**
 * Application entry point.
 * @throws LogicException A command line argument is missing or invalid.
 * @throws RuntimeException The Phar archive could not be created.
 */
function main(): void {
	// Parse the command line arguments.
	$options = ["c" => "compress", "i:" => "input:", "o:" => "output:"];
	$values = getopt(implode(array_keys($options)), $options);

	// Check the requirements.
	if (!extension_loaded("phar")) throw new RuntimeException("Phar extension is not loaded.", 501);
	if (!Phar::canWrite()) throw new RuntimeException("Phar extension does not support creating Phar archives.", 501);

	/** @var string $input */
	$input = $values["i"] ?? ($values["input"] ?? "");
	if (!$input || !is_dir($input)) throw new LogicException("You must provide a valid path to the input directory.", 400);

	/** @var string $output */
	$output = $values["o"] ?? ($values["output"] ?? "");
	if (!$output || !is_dir(dirname($output))) throw new LogicException("You must provide a valid path to the output archive.", 400);

	// Create the Phar archive.
	$phar = new Phar($output);
	$phar->buildFromDirectory($input);
	$phar->setStub(stub);

	// Compress the Phar archive.
	$compress = isset($values["c"]) || isset($values["compress"]);
	if ($compress && Phar::canCompress(Phar::GZ)) $phar->compressFiles(Phar::GZ);
}
