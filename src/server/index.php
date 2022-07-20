<?php namespace PhpIndex;

/**
 * Returns the MIME type corresponding to the specified path.
 * @param string $path The path of a file system entity.
 * @return string The MIME type corresponding to the specified path.
 */
function getMimeType(string $path): string {
	return match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
		"css" => "text/css",
		"gif" => "image/gif",
		"htm", "html" => "text/html",
		"jpeg", "jpg" => "image/jpeg",
		"js" => "application/javascript",
		"json" => "application/json",
		"png" => "image/png",
		"svg" => "image/svg+xml",
		"webmanifest" => "application/manifest+json",
		"woff2" => "font/woff2",
		default => "application/octet-stream"
	};
}

/**
 * Application entry point.
 */
function main(): void {
	if (isset($_GET["listing"])) sendListing();
	else {
		$path = trim($_GET["file"] ?? "main.html");
		if ($path) sendFile($path);
		else sendResponse("The file path is required.", mimeType: "text/plain", status: 422);
	}
}

/**
 * Sends the specified file to the client.
 * @param string $path The path of the file to send.
 */
function sendFile(string $path): void {
	if ($pharPath = \Phar::running(false)) {
		$basePath = basename($pharPath);
		$baseUri = "phar://$basePath";
	}
	else {
		$basePath = str_replace("\\", "/", realpath(dirname($_SERVER["SCRIPT_FILENAME"])."/.."));
		$prefix = PHP_OS_FAMILY == "Windows" ? "/" : "";
		$baseUri = "file://$prefix$basePath";
	}

	$file = "$baseUri/www/$path";
	if (!is_file($file)) sendResponse("The file '$path' is not found.", mimeType: "text/plain", status: 404);
	else sendResponse(file_get_contents($file), mimeType: getMimeType($file));
}

/**
 * Sends the directory listing to the client.
 */
function sendListing(): void {
	$exclude = [basename($_SERVER["SCRIPT_FILENAME"]), "web.config"];
	if ($pharPath = \Phar::running(false)) $exclude[] = basename($pharPath);

	$basePath = dirname($_SERVER["SCRIPT_FILENAME"]);
	$entries = array_values(array_filter(
		scandir($basePath),
		fn(string $entry) => $entry[0] != "." && !in_array($entry, $exclude) && is_readable("$basePath/$entry")
	));

	$entities = array_map(function(string $entry) use ($basePath) {
		$path = "$basePath/$entry";
		$isDirectory = is_dir($path);
		return (object) [
			"modifiedAt" => (new \DateTime("@".filemtime($path)))->format("c"),
			"path" => $entry,
			"size" => $isDirectory ? -1 : filesize($path),
			"type" => $isDirectory ? "directory" : "file",
		];
	}, $entries);

	sendResponse(json_encode($entities, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

/**
 * Sends the specified response to the client.
 * @param string $body The response body.
 * @param string $mimeType The response MIME type.
 * @param int $status The status code of the response.
 */
function sendResponse(string $body, string $mimeType = "application/json", int $status = 200): void {
	http_response_code($status);
	header("Content-Length: ".strlen($body));
	header("Content-Type: $mimeType");
	print $body;
}
