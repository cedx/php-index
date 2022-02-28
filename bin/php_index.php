#!/usr/bin/env php
<?php declare(strict_types=1);

// Check the requirements.
if (!extension_loaded("phar")) {
	echo "Phar extension is not loaded.", PHP_EOL;
	exit(1);
}

if (!Phar::canWrite()) {
	echo "Phar extension does not support creating Phar archives.", PHP_EOL;
	exit(2);
}

// Check the command line arguments.
$options = getopt("ci:o:", ["compress", "input:", "output:"], $index);

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
<?php declare(strict_types=1);

// Setup the class loader.
$rootPath = basename(__FILE__);
spl_autoload_register(fn($class) => include "phar://$rootPath/lib/".str_replace("\\", "/", $class).".php");

// Start the application.
\php\Boot::__hx__init();
\php_index\server\Application::main();
\haxe\EntryPoint::run();

__HALT_COMPILER();
EOF;

$phar = new Phar("$output/index.phar");
$phar->buildFromDirectory($input);
$phar->setStub($stub);

// Compress the PHAR archive.
$compress = $options["c"] ?? ($options["compress"] ?? null);
if ($compress !== null && Phar::canCompress(Phar::GZ)) $phar->compressFiles(Phar::GZ);
