#!/usr/bin/env php
<?php
// Check the requirements.
if (!extension_loaded("phar")) {
	echo "Phar extension is not loaded.", PHP_EOL;
	exit(1);
}

if (!Phar::canWrite()) {
	echo "Phar extension does not support creating Phar archives.", PHP_EOL;
	exit(2);
}

// Parse the command line arguments.
$options = getopt("i:o:", ["input:", "output:"], $index);

$input = $options["i"] ?? ($options["input"] ?? null);
if (!$input || !is_dir($input)) {
	echo "You must provide a valid path to the input directory.", PHP_EOL;
	exit(3);
}

$output = $options["o"] ?? ($options["output"] ?? null);
if (!$output || !is_dir($output)) {
	echo "You must provide a valid path to the output directory.", PHP_EOL;
	exit(4);
}

// Create the PHAR archive.
$stub = <<<'EOF'
<?php
$rootPath = basename(__FILE__);
require "phar://$rootPath/src/server/index.php";
\PhpIndex\main();
__HALT_COMPILER();
EOF;

$phar = new Phar("$output/index.phar");
$phar->buildFromDirectory($input);
$phar->setStub($stub);
