package php_index.client;

import haxe.Resource;
import js.Browser;
import php_index.base.Application as BaseApplication;
import tink.Web;
import tink.http.clients.JsFetchClient;
import tink.web.proxy.Remote;
import turnwing.Manager;
import turnwing.provider.JsonProvider;
import turnwing.source.ResourceStringSource;
import turnwing.template.HaxeTemplate;
using StringTools;
using coconut.ui.Renderer;
using haxe.io.Path;
using php_index.client.ElementTools;

/** The client application. **/
final class Application extends BaseApplication {

	/** The unique instance of this application. **/
	public static var instance(get, never): Application;

	/** The localization component. **/
	public var locale(default, null): Locale;

	/** The remote API client. **/
	public final remote: Remote<RemoteApi> =
		Web.connect((Browser.location.href: RemoteApi), {client: new JsFetchClient()});

	/** The languages supported by this application. **/
	public final supportedLanguages = Resource.listNames()
		.filter(res -> res.startsWith("locale."))
		.map(res -> res.substring(7).withoutExtension());

	/** Creates a new client application. **/
	function new() {
		super("io.belin.phpIndex", "PHP Index");
		final parts = Browser.navigator.language.split("-");
		if (parts.length > 0 && parts[0].length > 0 && supportedLanguages.contains(parts[0])) language = parts[0];
	}

	/** Gets the unique instance of this application. **/
	static inline function get_instance() return cast BaseApplication.instance;

	/** Application entry point. **/
	static function main() new Application().run();

	/** Runs this application. **/
	public function run() prepareLocales().handle(outcome -> switch outcome {
		case Failure(error):
			Browser.console.error(error.message);
		case Success(_):
			final body = Browser.document.body;
			body.empty();
			body.mount("<Root/>");
			Browser.window.addEventListener("load", () -> Browser.navigator.serviceWorker.register("?file=worker.js"));
	});

	/** Initializes the localization. **/
	function prepareLocales() {
		final manager = new Manager<Locale>(new JsonProvider<Locale>(new ResourceStringSource(lang -> 'locale.$lang.json'), new HaxeTemplate()));
		return manager.prepare([language]).next(_ -> locale = manager.language(language)).noise();
	}
}
