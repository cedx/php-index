package php_index.server;

import haxe.Log;
import php.Global;
import php.SuperGlobal;
import tink.http.Response.OutgoingResponse;
import tink.http.containers.PhpContainer;
import tink.web.routing.Context;
import tink.web.routing.Router;
using haxe.io.Path;

/** Application entry point. **/
function main() {
	Log.trace = (value, ?infos) -> Global.error_log(Log.formatOutput(value, infos));

	final depth = Path.directory(SuperGlobal._SERVER["PHP_SELF"]).split("/").length - 1;
	final router = new Router<Root>(new Root());
	PhpContainer.inst.run(request -> router.route(Context.ofRequest(request).sub(depth)).recover(error -> {
		if (Std.int(error.code / 100) == 5) trace(error);
		OutgoingResponse.reportError(error);
	}));
}
