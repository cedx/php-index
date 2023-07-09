package php_index.client;

import coconut.ui.Renderer;
import js.Browser;
import php_index.base.Platform;
import turnwing.Manager;
import turnwing.provider.JsonProvider;
import turnwing.source.ResourceStringSource;
import turnwing.template.HaxeTemplate;

/** Application entry point. **/
function main() {
	final container = Container.instance;

	final root = Browser.document.documentElement;
	root.dataset.version = Platform.packageVersion;
	root.lang = container.locale.language;

	final provider = new JsonProvider<Messages>(new ResourceStringSource(lang -> 'locale.$lang.json'), new HaxeTemplate());
	new Manager<Messages>(provider)
		.get(container.locale.language)
		.next(messages -> container.set("messages", messages))
		.handle(outcome -> switch outcome {
			case Failure(error):
				Browser.console.error(error.message);
			case Success(_):
				final body = Browser.document.body;
				while (body.hasChildNodes()) body.removeChild(body.lastChild);
				Renderer.mount(body, "<php_index.client.shell.Root/>");
		});
}
