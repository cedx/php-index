/** @import {CSSResultGroup} from "lit" */
import {css, LitElement} from "lit";

/**
 * The base class for custom elements.
 * @abstract
 */
export class Component extends LitElement {

	/**
	 * The component styles.
	 * @type {CSSResultGroup}
	 * @override
	 */
	static styles = [document.adoptedStyleSheets, css`
		:host { contain: content; }
	`];

	/**
	 * Value indicating whether this component uses a shadow root.
	 * @type {boolean}
	 * @readonly
	 */
	#useShadowRoot;

	/**
	 * Creates a new custom element.
	 * @param {Partial<{shadowRoot: boolean}>} options An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super();
		this.#useShadowRoot = options.shadowRoot ?? false;
	}

	/**
	 * Returns the node into which this component should render.
	 * @returns {DocumentFragment|HTMLElement} The newly created render root.
	 * @protected
	 * @override
	 */
	createRenderRoot() {
		return this.#useShadowRoot ? super.createRenderRoot() : this;
	}
}
