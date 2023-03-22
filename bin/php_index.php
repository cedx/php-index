#!/usr/bin/env php
<?php
$stub = <<<'EOF'
<?php
$rootPath = basename(__FILE__);
require "phar://$rootPath/src/php_index/server/index.php";
\php_index\main();
__HALT_COMPILER();
EOF;

try {
	// Check the requirements.
	if (!extension_loaded("phar")) throw new RuntimeException("Phar extension is not loaded.", 1);
	if (!Phar::canWrite()) throw new RuntimeException("Phar extension does not support creating Phar archives.", 2);

	// Parse the command line arguments.
	$options = getopt("i:o:", ["input:", "output:"]) ?: [];
	$input = $options["i"] ?? ($options["input"] ?? null);
	if (!$input || !is_dir($input)) throw new RuntimeException("You must provide a valid path to the input directory.", 3);
	$output = $options["o"] ?? ($options["output"] ?? null);
	if (!$output || !is_dir($output)) throw new RuntimeException("You must provide a valid path to the output directory.", 4);

	// Create the PHAR archive.
	$phar = new Phar("$output/index.phar");
	$phar->buildFromDirectory($input);
	$phar->setStub($stub);
	exit(0);
}
catch (Throwable $e) {
	echo $e->getMessage(), PHP_EOL;
	exit($e->getCode() ?: 5);
}
