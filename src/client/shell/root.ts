import {msg} from "@lit/localize";
import {html, type TemplateResult} from "lit";
import {customElement, state} from "lit/decorators.js";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";

/**
 * The root component.
 */
@customElement("app-root")
export class Root extends Component {

	/**
	 * Value indicating whether the browser is online.
	 */
	@state() isOnline = navigator.onLine;

	/**
	 * Method invoked when this component is connected.
	 */
	connectedCallback(): void {
		super.connectedCallback();
		for (const event of ["online", "offline"]) addEventListener(event, () => this.isOnline = navigator.onLine);
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
				${when(!this.isOnline, () => html`
					<div class="alert alert-danger border-end-0 border-start-0 mb-0 rounded-0">
						<i class="icon icon-fill fw-bold me-1">error</i> ${msg("The network is inaccessible. Check your connection.")}
					</div>
				`)}

				<app-listing></app-listing>
			</main>
		`;
	}
}
