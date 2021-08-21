package directory_index.server;

import directory_index.base.Application as BaseApplication;
import haxe.Log;
import haxe.http.HttpStatus;
import php.Global;
import php.SuperGlobal._GET;

using StringTools;
using haxe.io.Path;

/** The server application. **/
class Application extends BaseApplication {

	/** The unique instance of this application. **/
	public static var instance(get, never): Application;

	/** The root directory of this application. **/
	public final basePath = Sys.programPath().directory();

	/** Creates a new server application. **/
	function new() super("io.belin.directory_index", "Directory Index");

	/** Application entry point. **/
	static function main() {
		Log.trace = (value, ?infos) -> Global.error_log(Log.formatOutput(value, infos));

		final httpStatus = new Application().run();
		if (httpStatus != OK) Global.http_response_code(httpStatus);
	}

	/** Gets the unique instance of this application. **/
	static inline function get_instance() return cast BaseApplication.instance;

	/** Runs this application. **/
	public function run(): HttpStatus {
		final path = Global.empty(_GET["file"]) ? "index.html" : _GET["file"].trim();
		if (path.length == 0) return BadRequest;

		final manager = get(FileManager);
		if (!manager.exists(path)) return NotFound;

		manager.sendFile(path);
		return OK;
	}
}
