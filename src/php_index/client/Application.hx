package php_index.client;

import js.Browser;
import php_index.base.Application as BaseApplication;

using coconut.ui.Renderer;
using php_index.client.ElementTools;

/** The client application. **/
class Application extends BaseApplication {

	/** The unique instance of this application. **/
	public static var instance(get, never): Application;

	/** Creates a new client application. **/
	function new() {
		super("io.belin.php_index", "PHP Index");
		set(new Http(Browser.location.href));

		final parts = Browser.navigator.language.split("-");
		if (parts.length > 0 && parts[0].length > 0) language = parts[0];
	}

	/** Application entry point. **/
	static function main() new Application().run();

	/** Gets the unique instance of this application. **/
	static inline function get_instance() return cast BaseApplication.instance;

	/** Runs this application. **/
	public function run() {
		final body = Browser.document.body;
		body.empty();
		body.mount("<Root/>");
	}
}
