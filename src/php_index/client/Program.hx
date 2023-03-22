package php_index.client;

import coconut.ui.Renderer;
import haxe.Resource;
import intl.Locale;
import js.Browser;
import php_index.base.Version;
import turnwing.Manager;
import turnwing.provider.JsonProvider;
import turnwing.source.ResourceStringSource;
import turnwing.template.HaxeTemplate;
using StringTools;
using haxe.io.Path;
using php_index.client.ElementTools;

/** Application entry point. **/
function main() {
	Browser.document.documentElement.dataset.version = Version.packageVersion;

	final supportedLanguages = Resource.listNames()
		.filter(res -> res.startsWith("locale."))
		.map(res -> res.substring(7).withoutExtension());

	final parts = Browser.navigator.language.split("-");
	final language = parts.length > 0 && supportedLanguages.contains(parts[0]) ? parts[0] : "en";
	Container.instance.set("locale", new Locale(language));

	final provider = new JsonProvider<Messages>(new ResourceStringSource(lang -> 'locale.$lang.json'), new HaxeTemplate());
	new Manager<Messages>(provider)
		.get(language)
		.next(messages -> Container.instance.set("messages", messages))
		.handle(outcome -> switch outcome {
			case Failure(error):
				Browser.console.error(error.message);
			case Success(_):
				final body = Browser.document.body;
				body.removeChildren();
				// TODO Renderer.mount(body, "<Root/>");
		});
}
