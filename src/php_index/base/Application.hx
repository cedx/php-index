package php_index.base;

#if js
import js.Browser.document;
#elseif php
import php.Const;
import php.Global;
import php.Locale;
#end

using StringTools;

/** The base class for applications. **/
abstract class Application {

	/** The unique instance of this application. **/
	public static var instance(get, null): Application;

	/** The application identifier. **/
	public final id: String;

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
	function new(id: String, name: String, version = Version.getPackageVersion()) {
		instance = this;
		this.id = id;
		this.name = name;
		this.version = version;
	}

	/** Gets the unique instance of this application. **/
	static inline function get_instance() return instance;

	#if (js || php)
	/** Gets the application language. **/
	inline function get_language() return #if js document.documentElement.lang #else Locale.getDefault() #end;

	/** Sets the application language. **/
	function set_language(value: String) {
		#if js
			return document.documentElement.lang = value;
		#else
			final locale = value.replace("-", "_");
			Global.setlocale(Const.LC_ALL, '$locale.UTF-8', locale, locale.split("_")[0]);
			Locale.setDefault(value);
			return value;
		#end
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
	public function set(value: Any) services.set(Type.getClassName(Type.getClass(value)), value);
}
