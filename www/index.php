<?php
use php_index\Controller;
require __DIR__."/../vendor/autoload.php";

// Start the application.
$controller = new Controller;
try { $controller->handleRequest($_GET); }
catch (Throwable $e) {
	$code = $e->getCode();
	$controller->sendResponse($e->getMessage(), mediaType: "text/plain", status: $code >= 400 && $code < 600 ? $code : 500);
}
