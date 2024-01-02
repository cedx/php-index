package php_index.client;

import haxe.Resource;
import intl.Locale;
import js.Browser;
import tink.Web;
import tink.web.proxy.Remote;
using StringTools;
using haxe.io.Path;

/** Provides a dependency container. **/
final class Container {

	/** The unique instance of this container. **/
	public static final instance = new Container();

	/** The current locale. **/
	public var locale(get, never): Locale;
		function get_locale() return get("locale").sure();

	/** The localized messages. **/
	public var messages(get, never): Messages;
		function get_messages() return get("messages").sure();

	/** The remote API client. **/
	public var remote(get, never): Remote<RemoteApi>;
		function get_remote() return get("remote").sure();

	/** The registered factories. **/
	final factories = new Map<String, () -> Any>();

	/** The registered services. **/
	final services = new Map<String, Any>();

	/** Creates a new container. **/
	function new() {
		final supportedLanguages = Resource.listNames()
			.filter(res -> res.startsWith("i18n."))
			.map(res -> res.substr(5).withoutExtension());

		final language = Browser.navigator.language.split("-").shift();
		set("locale", new Locale(language != null && supportedLanguages.contains(language) ? language : "en"));
		set("remote", Web.connect((Browser.location.href: RemoteApi)));
	}

	/** Gets a value indicating whether this container has a service registered with the specified `token`. **/
	public function exists(token: String)
		return factories.exists(token) || services.exists(token);

	/** Gets the service registered with the specified `token`. **/
	public function get<T>(token: String): Option<T> {
		if (!services.exists(token)) {
			if (!factories.exists(token)) return None;
			set(token, factories[token]());
		}

		return Some(services[token]);
	}

	/** Registers a service factory with this container. **/
	public function register<T>(token: String, factory: () -> T) {
		factories[token] = factory;
		return this;
	}

	/** Removes the service registered with the specified `token`. **/
	public function remove(token: String) {
		factories.remove(token);
		services.remove(token);
	}

	/** Registers a service instance with this container. **/
	public function set<T>(token: String, service: T) {
		services[token] = service;
		return this;
	}
}
