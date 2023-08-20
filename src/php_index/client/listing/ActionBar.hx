package php_index.client.listing;

import js.Browser;
import js.html.Element;

/** An action bar located under the navigation bar. **/
class ActionBar extends View {

	/** The view children. **/
	@:children var elements: Children;

	/** The root element. **/
	@:ref final root: Element;

	/** Renders this view. **/
	function render() '
		<aside class="container-fluid" ref=$root>
			<div class="d-flex justify-content-between align-items-center">${...elements}</div>
		</aside>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		final navbarHeight = Std.parseInt(Browser.window.getComputedStyle(Browser.document.documentElement).getPropertyValue("--navbar-height"));
		final style = Browser.document.documentElement.style;
		style.setProperty("--main-offset", '${navbarHeight + root.offsetHeight}px');
		beforeUnmounting(() -> style.removeProperty("--main-offset"));
	}
}
