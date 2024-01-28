<?php namespace php_index;

use php_index\io\{FileSystemEntity, FileSystemEntityType};

/**
 * Responds to client requests.
 */
final class Controller {

	/**
	 * Handles the client requests.
	 * @param array<string, string> $query The query string.
	 */
	function handleRequest(array $query): void {
		if (isset($query["listing"])) $this->sendListing();
		else if ($path = trim($query["file"] ?? "main.html")) $this->sendFile($path);
		else $this->sendResponse("The file path is required.", mediaType: "text/plain", status: 422);
	}

	/**
	 * Sends the specified response to the client.
	 * @param string $body The response body.
	 * @param string $mediaType The response MIME type.
	 * @param int $status The status code of the response.
	 */
	function sendResponse(string $body, string $mediaType = "application/octet-stream", int $status = 200): void {
		http_response_code($status);
		header("Content-Length: ".strlen($body));
		header("Content-Type: $mediaType");
		print $body;
	}

	/**
	 * Sends the specified file to the client.
	 * @param string $path The relative path of the file to send.
	 */
	private function sendFile(string $path): void {
		if ($pharPath = \Phar::running(false)) $baseUri = "phar://" . basename($pharPath);
		else {
			$prefix = PHP_OS_FAMILY == "Windows" ? "/" : "";
			$baseUri = "file://$prefix" . str_replace("\\", "/", realpath(dirname($_SERVER["SCRIPT_FILENAME"])."/.."));
		}

		$entity = new FileSystemEntity("$baseUri/www/$path");
		if ($entity->exists() && $entity->type() == FileSystemEntityType::file) $this->sendResponse($entity->contents(), mediaType: $entity->mediaType());
		else $this->sendResponse("The file '$path' is not found.", mediaType: "text/plain", status: 404);
	}

	/**
	 * Sends the directory listing to the client.
	 */
	private function sendListing(): void {
		$exclude = [basename($_SERVER["SCRIPT_FILENAME"]), "desktop.ini", "web.config", '$Recycle.Bin', '$RECYCLE.BIN'];
		if ($pharPath = \Phar::running(false)) $exclude[] = basename($pharPath);

		$directory = dirname($_SERVER["SCRIPT_FILENAME"]);
		$entities = array_map(fn(string $name) => new FileSystemEntity("$directory/$name"), array_filter(
			scandir($directory),
			fn(string $name) => $name[0] != "." && !in_array($name, $exclude) && is_readable("$directory/$name")
		));

		$this->sendResponse(json_encode(array_values($entities)) ?: "[]", mediaType: "application/json");
	}
}
