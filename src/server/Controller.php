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
		else if (isset($query["phpinfo"])) $this->sendPhpInfo();
		else $this->sendFile($query["file"] ?? "main.html");
	}

	/**
	 * Sends the specified response to the client.
	 * @param string $body The response body.
	 * @param string $mediaType The response MIME type.
	 * @param int $status The status code of the response.
	 */
	function sendResponse(string $body, string $mediaType = "application/octet-stream", int $status = 200): never {
		http_response_code($status);
		header("Content-Length: ".strlen($body));
		header("Content-Type: $mediaType");
		print $body;
		exit();
	}

	/**
	 * Sends the specified file to the client.
	 * @param string $path The relative path of the file to send.
	 * @throws \RuntimeException The requested file was not found.
	 */
	private function sendFile(string $path): void {
		if ($pharPath = \Phar::running(false)) $baseUri = "phar://" . basename($pharPath);
		else {
			$directory = dirname($_SERVER["SCRIPT_FILENAME"])."/..";
			$prefix = PHP_OS_FAMILY == "Windows" ? "/" : "";
			$baseUri = "file://$prefix" . strtr(realpath($directory) ?: $directory, ["\\" => "/"]);
		}

		$entity = new FileSystemEntity("$baseUri/www/$path");
		if ($entity->exists() && $entity->type() == FileSystemEntityType::file) $this->sendResponse($entity->contents(), $entity->mediaType());
		throw new \RuntimeException("The file '$path' is not found.", 404);
	}

	/**
	 * Sends the directory listing to the client.
	 */
	private function sendListing(): void {
		$exclude = [basename($_SERVER["SCRIPT_FILENAME"]), "desktop.ini", "web.config", '$Recycle.Bin', '$RECYCLE.BIN'];
		if ($pharPath = \Phar::running(false)) $exclude[] = basename($pharPath);

		$directory = dirname($_SERVER["SCRIPT_FILENAME"]);
		$entities = array_map(fn($name) => new FileSystemEntity("$directory/$name"), array_filter(
			scandir($directory) ?: [],
			fn($name) => $name[0] != "." && !in_array($name, $exclude) && is_readable("$directory/$name")
		));

		$this->sendResponse(json_encode(array_values($entities)) ?: "[]", mediaType: "application/json");
	}

	/**
	 * Sends the information about PHP's configuration.
	 * @throws \RuntimeException PHP information is not enabled.
	 */
	private function sendPhpInfo(): void {
		if (!(new Configuration)->phpInfo) throw new \RuntimeException("404 Not Found", 404);

		$replacements = [
			"</head>" => '<link rel="icon" href="?file=favicon.svg"/><link rel="stylesheet" href="?file=css/main.css"/></head>',
			"<body>" => '<body id="phpinfo">',
			"<table>" => '<table class="table table-sm table-striped">'
		];

		ob_start();
		phpinfo(INFO_GENERAL | INFO_CONFIGURATION | INFO_MODULES | INFO_ENVIRONMENT | INFO_VARIABLES);
		$output = strtr((string) @ob_get_clean(), $replacements);
		$this->sendResponse($output, mediaType: "text/html; charset=utf-8");
	}
}
