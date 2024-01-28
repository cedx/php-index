<?php
// Register the class loader.
spl_autoload_register(function(string $class) {
	$parts = explode("\\", $class);
	array_shift($parts);
	include __DIR__."/../src/server/".implode("/", $parts).".php";
});

// Start the application.
$controller = new \php_index\Controller;
try { $controller->handleRequest($_GET); }
catch (Throwable $e) {
	$code = $e->getCode();
	$controller->sendResponse($e->getMessage(), mediaType: "text/plain", status: $code >= 400 && $code < 600 ? $code : 500);
}
