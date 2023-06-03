package php_index.base;

/** Defines the compilation target. **/
enum abstract Platform(String) {

	/** The code is intended for a browser. **/
	var Browser = "browser";

	/** The code is intended for Node.js. **/
	var Node = "node";
}
