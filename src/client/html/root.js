/** @import {TemplateResult} from "lit" */
import {Tooltip} from "bootstrap";
import {html} from "lit";
import {Component} from "./component.js";

/**
 * The root component.
 */
export class Root extends Component {

	/**
	 * Registers the component.
	 */
	static {
		customElements.define("app-root", this);
	}

	/**
	 * Method invoked when this component is connected.
	 * @override
	 */
	connectedCallback() {
		super.connectedCallback();
		// eslint-disable-next-line no-new
		new Tooltip(document.body, {container: document.body, selector: '[data-bs-toggle="tooltip"]', trigger: "hover"});
	}

	/**
	 * Renders this component.
	 * @returns {TemplateResult} The view template.
	 * @protected
	 * @override
	 */
	render() {
		return html`
			<header>
				<app-navbar></app-navbar>
			</header>

			<main>
				<offline-indicator></offline-indicator>
				<app-listing></app-listing>
			</main>
		`;
	}
}
