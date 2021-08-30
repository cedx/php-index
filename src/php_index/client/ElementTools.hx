package php_index.client;

import js.Browser.window;
import js.html.Element;

/** Provides static extensions for HTML elements. **/
abstract class ElementTools {

	/** Removes all child nodes from the specified `element`. **/
	public static function empty(element: Element)
		while (element.firstChild != null) element.removeChild(element.lastChild);

	/** Gets the transition duration of the specified `element`, in milliseconds. **/
	public static function getTransitionDuration(element: Element) {
		final style = window.getComputedStyle(element);

		var transitionDelay = Std.parseFloat(style.transitionDelay.split(",")[0]);
		if (Math.isNaN(transitionDelay) || transitionDelay < 0) transitionDelay = 0;

		var transitionDuration = Std.parseFloat(style.transitionDuration.split(",")[0]);
		if (Math.isNaN(transitionDuration) || transitionDuration < 0) transitionDuration = 0;

		return Std.int((transitionDelay + transitionDuration) * 1000);
	}
}
