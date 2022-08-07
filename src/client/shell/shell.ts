import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {Component} from "../component.js";

/**
 * The application shell.
 */
@customElement("app-shell")
export class Shell extends Component {

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	render(): TemplateResult {
		return html`
			<header>
				<app-navbar></app-navbar>
			</header>

			<main>
				<app-entitylist></app-entitylist>
			</main>
		`;
	}
}
