package js.browser_sync;

import haxe.extern.EitherType;

/** Keeps multiple browsers and devices in sync. **/
@:jsRequire("browser-sync")
extern class BrowserSync {

	/** Value indicating whether this instance is running. **/
	final active: Bool;

	/** The name of this instance. **/
	final name: String;

	/** Value indicating whether this instance is paused. **/
	final paused: Bool;

	/** Creates a new instance. **/
	static function create(?name: String): BrowserSync;

	/** Closes any running server, stops file watching and exits the current process. **/
	function exit(): Void;

	/** Starts the service. **/
	function init(?options: BrowserSyncOptions): BrowserSync;

	/** Shows a notification in the browser. **/
	function notify(message: String, ?timeout: Int): Void;

	/** Pauses the file watchers. **/
	function pause(): Void;

	/** Reloads the browser. **/
	function reload(?files: EitherType<String, Array<String>>): Void;

	/** Resumes the file watchers. **/
	function resume(): Void;
}

/** Defines the options of a `BrowserSync` instance. **/
typedef BrowserSyncOptions = {

	/** The current working directory. **/
	var ?cwd: String;

	/** Mirrors clicks, form inputs and scrolls to all other devices. **/
	var ?ghostMode: EitherType<Bool, GhostOptions>;

	/** Value indicating whether to log connections. **/
	var ?logConnections: Bool;

	/** Value indicating whether to log information about changed files. **/
	var ?logFileChanges: Bool;

	/** The log level. **/
	var ?logLevel: LogLevel;

	/** The console logging prefix. **/
	var ?logPrefix: String;

	/** Value indicating whether to log the snippet to the console. **/
	var ?logSnippet: Bool;

	/** Value indicating whether to enable the pop-over notifications. **/
	var ?notify: Bool;

	/** Value indicating which URL to open when the service starts. **/
	var ?open: EitherType<Bool, OpenTarget>;

	/** The specific port to use. **/
	var ?port: Int;

	/** An existing host to proxy. **/
	var ?proxy: EitherType<String, ProxyOptions>;
}

/** Defines the ghost options related to the forms. **/
typedef FormsOptions = {

	/** Value indicating whether to sync the text inputs **/
	var ?inputs: Bool;

	/** Value indicating whether to sync the form submissions. **/
	var ?submit: Bool;

	/** Value indicating whether to sync the checkboxes and radio buttons.  **/
	var ?toggles: Bool;
}

/** Defines the ghost options. **/
typedef GhostOptions = {

	/** Value indicating whether to mirror the clicks. **/
	var ?clicks: Bool;

	/** Value indicating whether to mirror the forms. **/
	var ?forms: EitherType<Bool, FormsOptions>;

	/** Value indicating whether to mirror the scrolling. **/
	var ?scroll: Bool;
}

/** Defines the log level. **/
enum abstract LogLevel(String) to String {
	var Debug = "debug";
	var Info = "info";
	var Silent = "silent";
	var Warn = "warn";
}

/** Defines which URL to open when the service starts. **/
enum abstract OpenTarget(String) to String {
	var External = "external";
	var Local = "local";
	var Tunnel = "tunnel";
	var Ui = "ui";
	var UiExternal = "ui-external";
}

/** Defines the proxy options. **/
typedef ProxyOptions = {

	/** The target host. **/
	var ?target: String;

	/** Value indicating whether to proxy websockets. **/
	var ?ws: Bool;
}
