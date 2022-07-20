package php_index.base;

#if js
import js.Browser;
import js.lib.intl.NumberFormat as NumberFormatter;
#elseif php
import php.Locale;
import php.NumberFormatter;
#end

using Lambda;
using StringTools;

/** The base class for applications. **/
abstract class Application {

	/** The unique instance of this application. **/
	public static var instance(default, null): Application;

	#if (js || php)
	/** The component providing data formatting methods. **/
	public var formatter(get, null): {
		currency: NumberFormatter,
		decimal: NumberFormatter,
		percent: NumberFormatter
	};
	#end

	/** The application identifier. **/
	public final id: String;

	#if js
	/** Value indicating whether this application is standalone. **/
	public var isStandalone(get, never): Bool;
	#end

	#if (js || php)
	/** The application language. **/
	public var language(get, set): String;
	#end

	/** The application name. **/
	public final name: String;

	/** The application version. **/
	public final version: String;

	/** The registered services. **/
	final services: Map<String, Any> = [];

	/** Creates a new application. **/
	function new(id: String, name: String, ?version: String) {
		instance = this;
		this.id = id;
		this.name = name;
		this.version = version != null ? version : Version.packageVersion;
	}

	#if (js || php)
	/** Gets the component providing data formatting methods. **/
	function get_formatter() {
		if (formatter == null) formatter = {
			currency: new NumberFormatter(language, #if js {currency: "EUR", style: Currency} #else NumberFormatter.CURRENCY #end),
			decimal: new NumberFormatter(language, #if js {style: Decimal} #else NumberFormatter.DECIMAL #end),
			percent: new NumberFormatter(language, #if js {style: Percent} #else NumberFormatter.PERCENT #end)
		};

		return formatter;
	}
	#end

	#if js
	/** Gets a value indicating whether this application is standalone. **/
	function get_isStandalone() return ["fullscreen", "minimal-ui", "standalone"]
		.exists(displayMode -> Browser.window.matchMedia('(display-mode: $displayMode)').matches);
	#end

	#if (js || php)
	/** Gets the application language. **/
	function get_language()
		return #if js Browser.document.documentElement.lang #else Locale.getDefault() #end;

	/** Sets the application language. **/
	function set_language(value: String) {
		formatter = null;
		#if js return Browser.document.documentElement.lang = value; #else Locale.setDefault(value); return value; #end
	}
	#end

	/** Gets a value indicating whether this application has a service registered with the specified `type`. **/
	public function exists<T>(type: Class<T>) return services.exists(Type.getClassName(type));

	/** Gets the service registered with the specified `type`. **/
	public function get<T>(type: Class<T>): Null<T> {
		if (!exists(type)) set(Type.createInstance(type, []));
		return services.get(Type.getClassName(type));
	}

	/** Removes the service registered with the specified `type`. **/
	public function remove<T>(type: Class<T>) services.remove(Type.getClassName(type));

	/** Registers a service with this application. **/
	public function set<T>(?type: Class<T>, value: Any)
		services.set(Type.getClassName(type != null ? type : Type.getClass(value)), value);
}
