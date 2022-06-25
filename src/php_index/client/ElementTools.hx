package php_index.client;

import js.Browser.window;
import js.html.Element;

/** Provides static extensions for HTML elements. **/
abstract class ElementTools {

	/** Removes all child nodes from the specified `element`. **/
	public static function empty(element: Element)
		while (element.firstChild != null) element.removeChild(element.lastChild);
}
