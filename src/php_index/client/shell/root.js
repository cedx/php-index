import {html} from "lit";
import {Component} from "../component.js";

/**
 * The root component.
 */
export class Root extends Component {

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 */
	render() {
		return html`
			<header>
				<app-navbar></app-navbar>
			</header>

			<main>
				<app-listing></app-listing>
			</main>
		`;
	}
}

// Register the component.
customElements.define("app-root", Root);
