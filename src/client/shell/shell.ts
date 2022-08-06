import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {Component} from "../component.js";

/**
 * The application shell.
 */
@customElement("app-shell")
export class Shell extends Component {

	/**
	 * Method invoked when this component is mounted.
	 */
	connectedCallback(): void {
		super.connectedCallback();
		const {hostname, pathname} = location;
		document.title = `${hostname} - ${pathname.length > 1 ? pathname.slice(0, -1) : pathname}`;
	}

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
