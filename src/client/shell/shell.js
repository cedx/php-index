import {html} from "lit";
import {Component} from "../component.js";

/**
 * The application shell.
 */
export class Shell extends Component {

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
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
customElements.define("app-shell", Shell);
