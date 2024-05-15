<?php namespace php_index;

/**
 * Provides access to the application configuration.
 */
final readonly class Configuration {

	/**
	 * Value indicating whether to enable information about PHP's configuration.
	 */
	public bool $phpInfo;

	/**
	 * The application version number.
	 */
	public string $version;

	/**
	 * Creates a new configuration.
	 */
	function __construct() {
		$config = json_decode(file_get_contents(__DIR__."/config.json") ?: "{}", flags: JSON_THROW_ON_ERROR);
		$this->phpInfo = $config->phpInfo ?? false;
		$this->version = $config->version ?? phpversion();
	}
}
