#!/usr/bin/env php
<?php declare(strict_types=1);

// Check the requirements.
if (!Phar::canWrite()) {
	fwrite(STDERR, "Phar extension does not support creating Phar archives.");
	exit(1);
}

// Check the command line arguments.
$options = getopt("ci:o:", ["compress", "input:", "output:"], $index);

$input = $options["i"] ?? ($options["input"] ?? null);
if (!$input || !is_dir($input)) {
	fwrite(STDERR, "You must provide the path of the input directory.");
	exit(2);
}

$output = $options["o"] ?? ($options["output"] ?? null);
if (!$output || !is_dir($output)) {
	fwrite(STDERR, "You must provide the path of the output directory.");
	exit(3);
}

// Create the PHAR archive.
$stub = <<<'EOT'
<?php declare(strict_types=1);

// Setup the class loader.
$rootPath = (new SplFileInfo(__DIR__))->getBasename();
spl_autoload_register(fn($class) => include "phar://$rootPath/lib/".str_replace("\\", "/", $class).".php");

// Start the application.
\php\Boot::__hx__init();
\php_index\server\Application::main();
\haxe\EntryPoint::run();

__HALT_COMPILER();
EOT;

$phar = new Phar("$output/index.phar");
$phar->buildFromDirectory($input);
$phar->setStub($stub);

// Compress the PHAR archive.
$compress = $options["c"] ?? ($options["compress"] ?? null);
if ($compress !== null && Phar::canCompress(Phar::GZ)) $phar->compressFiles(Phar::GZ);
