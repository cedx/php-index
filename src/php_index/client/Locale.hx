package php_index.client;

/** Provides the localization table. **/
interface Locale {
	function emptyDirectory(): String;
	function error(): String;
	function indexOf(directory: String): String;
	function loading(): String;
	function modifiedAt(): String;
	function name(): String;
	function parentDirectory(): String;
	function size(): String;
}
