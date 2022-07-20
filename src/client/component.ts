import {type CSSResultGroup, LitElement} from "lit";

/**
 * The base class for custom elements.
 */
export abstract class Component extends LitElement {

	/**
	 * The component styles.
	 */
	static styles: CSSResultGroup = document.adoptedStyleSheets;

	/**
	 * Value indicating whether this component uses a shadow root.
	 */
	readonly #useShadowRoot: boolean;

	/**
	 * Creates a new custom element.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: {shadowRoot?: boolean} = {}) {
		super();
		this.#useShadowRoot = options.shadowRoot ?? false;
	}

	/**
	 * Returns the node into which this component should render.
	 * @returns The newly created render root.
	 */
	protected createRenderRoot(): Element|ShadowRoot {
		return this.#useShadowRoot ? super.createRenderRoot() : this;
	}
}
