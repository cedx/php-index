import {css, LitElement, type CSSResultGroup} from "lit";

/**
 * The base class for custom elements.
 */
export abstract class Component extends LitElement {

	/**
	 * The component styles.
	 */
	static styles: CSSResultGroup = [document.adoptedStyleSheets, css`
		:host { contain: content; }
	`];

	/**
	 * Value indicating whether this component uses a shadow root.
	 */
	readonly #useShadowRoot: boolean;

	/**
	 * Creates a new custom element.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: Partial<{shadowRoot: boolean}> = {}) {
		super();
		this.#useShadowRoot = options.shadowRoot ?? false;
	}

	/**
	 * Returns the node into which this component should render.
	 * @returns The newly created render root.
	 */
	protected createRenderRoot(): DocumentFragment|HTMLElement {
		return this.#useShadowRoot ? super.createRenderRoot() : this;
	}
}
