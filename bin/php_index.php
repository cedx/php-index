#!/usr/bin/env php
<?php
$stub = <<<'EOF'
<?php
$rootPath = basename(__FILE__);
spl_autoload_register(fn($class) => include "phar://$rootPath/lib/".str_replace("\\", "/", $class).".php");
\php\Boot::__hx__init();
\php_index\server\_Program\Program_Fields_::main();
\haxe\EntryPoint::run();
__HALT_COMPILER();
EOF;

try {
	// Check the requirements.
	if (!extension_loaded("phar")) throw new RuntimeException("Phar extension is not loaded.", 501);
	if (!Phar::canWrite()) throw new RuntimeException("Phar extension does not support creating Phar archives.", 501);

	// Parse the command line arguments.
	$options = getopt("ci:o:", ["compress", "input:", "output:"]) ?: [];
	$input = $options["i"] ?? ($options["input"] ?? "");
	if (!$input || !is_dir($input)) throw new RuntimeException("You must provide a valid path to the input directory.", 400);
	$output = $options["o"] ?? ($options["output"] ?? "");
	if (!$output || !is_dir($output)) throw new RuntimeException("You must provide a valid path to the output directory.", 400);

	// Create the PHAR archive.
	$phar = new Phar("$output/index.phar");
	$phar->buildFromDirectory($input);
	$phar->setStub($stub);

	// Compress the PHAR archive.
	$compress = isset($options["c"]) || isset($options["compress"]);
	if ($compress && Phar::canCompress(Phar::GZ)) $phar->compressFiles(Phar::GZ);
	exit(0);
}
catch (Throwable $e) {
	$code = $e->getCode();
	echo $e->getMessage(), PHP_EOL;
	exit($code >= 400 && $code < 600 ? $code : 500);
}
