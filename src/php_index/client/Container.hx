package php_index.client;

import haxe.Resource;
import haxe.exceptions.ArgumentException;
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
		inline function get_locale() return get("locale");

	/** The localized messages. **/
	public var messages(get, never): Messages;
		inline function get_messages() return get("messages");

	/** The remote API client. **/
	public var remote(get, never): Remote<RemoteApi>;
		inline function get_remote() return get("remote");

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

	/**
		Gets the service registered with the specified `token`.
		Throws an `ArgumentException` if there is no factory associated with the token.
	**/
	public function get<T>(token: String): T {
		if (!services.exists(token))
			if (factories.exists(token)) set(token, factories[token]());
			else {
				final type = Type.resolveClass(token);
				if (type != null) set(token, Type.createInstance(type, []));
				else throw new ArgumentException("token", 'There is no factory registered with the token "$token".');
			}

		return services[token];
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
