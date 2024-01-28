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
