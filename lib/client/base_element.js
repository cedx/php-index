import {LitElement} from "lit";

/**
 * The base class for custom elements without shadow root.
 */
export class BaseElement extends LitElement {

	/**
	 * Creates the component's shadow root.
	 * @returns {Element|ShadowRoot} The newly created shadow root.
	 */
	createRenderRoot() {
		return this;
	}
}
