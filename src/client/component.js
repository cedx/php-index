import {LitElement} from "lit";

/**
 * The base class for custom elements.
 * @abstract
 */
export class Component extends LitElement {

	/**
	 * The component styles.
	 * @type {import("lit").CSSResultGroup}
	 */
	static styles = document.adoptedStyleSheets;

	/**
	 * Value indicating whether this component uses a shadow root.
	 * @type {boolean}
	 */
	#useShadowRoot;

	/**
	 * Creates a new custom element.
	 * @param {{shadowRoot?: boolean}} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super();
		this.#useShadowRoot = options.shadowRoot ?? false;
	}

	/**
	 * Returns the node into which this component should render.
	 * @returns {Element|ShadowRoot} The newly created render root.
	 * @protected
	 */
	createRenderRoot() {
		return this.#useShadowRoot ? super.createRenderRoot() : this;
	}
}
