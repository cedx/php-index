package php_index.client;

import coconut.ui.Renderer;
import haxe.Resource;
import intl.Locale;
import js.Browser;
import php_index.base.Version;
using StringTools;
using haxe.io.Path;

/** Application entry point. **/
function main() {
	Browser.document.documentElement.dataset.version = Version.packageVersion;

	final supportedLanguages = Resource.listNames()
		.filter(res -> res.startsWith("locale."))
		.map(res -> res.substring(7).withoutExtension());

	final parts = Browser.navigator.language.split("-");
	final language = parts.length > 0 && supportedLanguages.contains(parts[0]) ? parts[0] : "en";
	Container.instance.set("locale", new Locale(language));

	final body = Browser.document.body;
	while (body.hasChildNodes()) body.removeChild(body.lastChild);
	// TODO Renderer.mount(body, "<Root/>");
}
