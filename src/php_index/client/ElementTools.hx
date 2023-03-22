package php_index.client;

import js.Browser;
import js.html.Element;
import js.lib.Promise as JsPromise;

/** Provides static extensions for HTML elements. **/
abstract class ElementTools {

	/** Gets the transition duration of the specified `element`, in milliseconds. **/
	public static function getTransitionDuration(element: Element) {
		final style = Browser.window.getComputedStyle(element);

		var transitionDelay = Std.parseFloat(style.transitionDelay.split(",")[0]);
		if (Math.isNaN(transitionDelay) || transitionDelay < 0) transitionDelay = 0;

		var transitionDuration = Std.parseFloat(style.transitionDuration.split(",")[0]);
		if (Math.isNaN(transitionDuration) || transitionDuration < 0) transitionDuration = 0;

		return Std.int((transitionDelay + transitionDuration) * 1000);
	}

	/** Removes all child nodes from the specified `element`. **/
	public static function removeChildren(element: Element)
		while (element.hasChildNodes()) element.removeChild(element.lastChild);

	/** Invokes a `callback` function when the specified `element` has finished all its animations. **/
	public static function waitForAnimations(element: Element, callback: Callback<Noise>) {
		final promise = JsPromise.allSettled(element.getAnimations().map(animation -> animation.finished));
		return Promise.ofJsPromise(promise).next(_ -> { callback.invoke(Noise); Noise; }).eager();
	}
}
