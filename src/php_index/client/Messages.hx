package php_index.client;

/** Provides the translation table. **/
interface Messages {
	function auto(): String;
	function dark(): String;
	function directories(): String;
	function directory(): String;
	function emptyDirectory(): String;
	function error(): String;
	function file(): String;
	function files(): String;
	function indexOf(directory: String): String;
	function light(): String;
	function loading(): String;
	function modifiedAt(): String;
	function name(): String;
	function offline(): String;
	function parentDirectory(): String;
	function size(): String;
}
