package php_index.client;

import coconut.ui.Children;
import coconut.ui.View;
import js.Browser;
import js.html.Element;
import js.html.MetaElement;
using Lambda;
using StringTools;

/** A heading that sets the document title. **/
class PageTitle extends View {

	/** The application name. **/
	@:tracked @:state var applicationName: String = {
		final isStandalone = ["fullscreen", "minimal-ui", "standalone", "tabbed"].exists(mode -> Browser.window.matchMedia('(display-mode: $mode)').matches);
		isStandalone ? "" : cast(Browser.document.head.querySelector("meta[name='application-name']"), MetaElement).content;
	}

	/** The view children. **/
	@:children var elements: Children = [];

	/** The root element. **/
	@:ref final root: Element;

	/** The text of the page title. **/
	@:tracked @:attribute final text = "";

	/** Renders this view. **/
	function render() '
		<div ref=${root}>${...elements}</div>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		final onAppInstalled = () -> applicationName = "";
		Browser.window.addEventListener("appinstalled", onAppInstalled);
		beforeUnmounting(() -> Browser.window.removeEventListener("appinstalled", onAppInstalled));
	}

	/** Method invoked after each rendering. **/
	override function viewDidRender(firstTime: Bool) {
		final title = if (text.length > 0) text else root.textContent.length > 0 ? root.textContent : "";
		Browser.document.title = applicationName.length > 0 ? '$title - $applicationName' : title;
	}
}
