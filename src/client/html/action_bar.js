/** @import {TemplateResult} from "lit" */
import {html} from "lit";
import {Component} from "./component.js";

/**
 * An action bar located under the navigation bar.
 */
export class ActionBar extends Component {

	/**
	 * Creates a new action bar.
	 */
	constructor() {
		super({shadowRoot: true});
	}

	/**
	 * Registers the component.
	 */
	static {
		customElements.define("action-bar", this);
	}

	/**
	 * Method invoked when this component is disconnected.
	 * @override
	 */
	disconnectedCallback() {
		document.documentElement.style.removeProperty("--main-offset");
		super.disconnectedCallback();
	}

	/**
	 * Method invoked after the first rendering.
	 * @protected
	 * @override
	 */
	firstUpdated() {
		const {documentElement} = document;
		const navbarHeight = parseInt(getComputedStyle(documentElement).getPropertyValue("--navbar-height"));
		documentElement.style.setProperty("--main-offset", `${navbarHeight + this.offsetHeight}px`);
	}

	/**
	 * Renders this component.
	 * @returns {TemplateResult} The view template.
	 * @protected
	 * @override
	 */
	render() {
		return html`
			<aside class="container-fluid">
				<slot class="d-flex justify-content-between align-items-center"></slot>
			</aside>
		`;
	}
}
