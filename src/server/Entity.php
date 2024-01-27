<?php namespace php_index;

/**
 * A reference to an entity on the file system.
 */
final readonly class Entity implements \JsonSerializable {

	/**
	 * The path of this file system entity.
	 */
	public string $path;

	/**
	 * Creates a new file system entity.
	 * @param string $path The path of this file system entity.
	 */
	function __construct(string $path) {
		$this->path = $path;
	}

	/**
	 * Lists the file system entities contained in the specified directory.
	 * @param string $directory The path to the directory to scan.
	 * @return self[] The file system entities contained in the specified directory.
	 */
	static function list(string $directory): array {
		$exclude = [basename($_SERVER["SCRIPT_FILENAME"]), "desktop.ini", "web.config", '$Recycle.Bin', '$RECYCLE.BIN'];
		if ($pharPath = \Phar::running(false)) $exclude[] = basename($pharPath);

		return array_map(fn(string $name) => new self("$directory/$name"), array_filter(
			scandir($directory),
			fn(string $name) => $name[0] != "." && !in_array($name, $exclude) && is_readable("$directory/$name")
		));
	}

	/**
	 * Gets the contents of this file system entity.
	 * @return string|null The contents of this file system entity.
	 */
	function contents(): ?string {
		return $this->type() == EntityType::directory ? null : (file_get_contents($this->path) ?: "");
	}

	/**
	 * Gets a value indicating whether this file system entity exists.
	 * @return bool `true` if this file system entity exists, otherwise `false`.
	 */
	function exists(): bool {
		return file_exists($this->path);
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @return \stdClass The map in JSON format corresponding to this object.
	 */
	function jsonSerialize(): \stdClass {
		return (object) [
			"modifiedAt" => $this->modifiedAt()->format("c"),
			"path" => basename($this->path),
			"size" => $this->size(),
			"type" => $this->type()
		];
	}

	/**
	 * Returns the media type corresponding to the specified path.
	 * @return string The media type corresponding to the specified path.
	 */
	function mediaType(): string {
		return match (strtolower(pathinfo($this->path, PATHINFO_EXTENSION))) {
			"cjs", "js", "mjs" => "text/javascript",
			"css" => "text/css",
			"gif" => "image/gif",
			"htm", "html" => "text/html",
			"jpeg", "jpg" => "image/jpeg",
			"json" => "application/json",
			"png" => "image/png",
			"svg" => "image/svg+xml",
			"webmanifest" => "application/manifest+json",
			"webp" => "image/webp",
			"woff2" => "font/woff2",
			default => "application/octet-stream"
		};
	}

	/**
	 * Gets the date of last modification.
	 * @return \DateTimeInterface The date of last modification.
	 */
	function modifiedAt(): \DateTimeInterface {
		$timestamp = (int) filemtime($this->path);
		return new \DateTimeImmutable("@$timestamp");
	}

	/**
	 * Gets the size in bytes of this file system entity.
	 * @return int The size in bytes of this file system entity.
	 */
	function size(): int {
		return $this->type() == EntityType::directory ? -1 : (int) @filesize($this->path);
	}

	/**
	 * Gets the type of this file system entity.
	 * @return EntityType The type of this file system entity.
	 */
	function type(): EntityType {
		return is_dir($this->path) ? EntityType::directory : EntityType::file;
	}
}
