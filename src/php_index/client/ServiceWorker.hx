package php_index.client;

import js.Browser.self;
import js.html.ExtendableEvent;
import js.html.FetchEvent;
import js.html.ServiceWorkerGlobalScope;
import js.lib.Promise;
import php_index.base.Application as BaseApplication;
import tink.Url;

/** The service worker. **/
class ServiceWorker extends BaseApplication {

	/** The files to be cached. **/
	final resources = [
		"favicon.svg",
		"css/main.css",
		"fonts/icons.woff2",
		"img/loader_logo.svg",
		"img/navbar_logo.svg",
		"js/main.js",
		"js/vendor.js"
	];

	/** Creates a new service worker. **/
	function new() super("io.belin.php_index", "PHP Index");

	/** Application entry point. **/
	static function main() new ServiceWorker().run();

	/** Runs this worker. **/
	public function run() {
		final eventHandlers = ["activate" => onActivate, "fetch" => onFetch, "install" => onInstall];
		for (event => handler in eventHandlers) self.addEventListener(event, handler);
	}

	/** Method invoked when this worker is activated. **/
	function onActivate(event: ExtendableEvent)
		event.waitUntil(cast(self, ServiceWorkerGlobalScope).clients.claim());

	/** Method invoked when a resource is fetched. **/
	function onFetch(event: FetchEvent) event.respondWith(self.caches.match(event.request)
		.then(response -> response != null ? Promise.resolve(response) : self.fetch(event.request)));

	/** Method invoked when this worker is installed. **/
	function onInstall(event: ExtendableEvent) {
		final baseHref = self.location.pathname;
		cast(self, ServiceWorkerGlobalScope).skipWaiting();
		event.waitUntil(self.caches.delete('$id:$baseHref')
			.then(_ -> self.caches.open('$id:$baseHref'))
			.then(cache -> cache.addAll([baseHref].concat(resources.map(file -> '$baseHref?file=$file')))));
	}
}
