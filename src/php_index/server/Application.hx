package php_index.server;

import haxe.Log;
import php.Global;
import php.SuperGlobal._SERVER;
import php_index.base.Application as BaseApplication;
import tink.http.Response.OutgoingResponse;
import tink.http.containers.PhpContainer;
import tink.web.routing.Context;
import tink.web.routing.Router;
using haxe.io.Path;

/** The server application. **/
class Application extends BaseApplication {

	/** The unique instance of this application. **/
	public static var instance(get, never): Application;

	/** The root directory of this application. **/
	public final basePath = Path.join([Sys.programPath().directory(), ".."]);

	/** Creates a new server application. **/
	function new() super("io.belin.phpIndex", "PHP Index");

	/** Gets the unique instance of this application. **/
	static inline function get_instance() return cast BaseApplication.instance;

	/** Application entry point. **/
	static function main() {
		Log.trace = (value, ?infos) -> Global.error_log(Log.formatOutput(value, infos));
		new Application().run();
	}

	/** Runs this application. **/
	public function run() {
		final mountLevel = Path.directory(_SERVER["PHP_SELF"]).split("/").length - 1;
		final router = new Router<Root>(new Root());
		PhpContainer.inst.run(request -> router.route(Context.ofRequest(request).sub(mountLevel)).recover(error -> {
			if (error.code == InternalError) trace(error);
			OutgoingResponse.reportError(error);
		}));
	}
}
