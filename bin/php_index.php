#!/usr/bin/env php
<?php
// Load the dependencies.
require __DIR__ . "/../src/console/index.php";

// Start the application.
try { main(); }
catch (Throwable $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}
