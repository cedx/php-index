import {msg} from "@lit/localize";
import {Tooltip} from "bootstrap";
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
	@state() private isOnline = navigator.onLine;

	/**
	 * Method invoked when this component is connected.
	 */
	override connectedCallback(): void {
		super.connectedCallback();
		const updateOnlineStatus = (): boolean => this.isOnline = navigator.onLine;
		for (const event of ["online", "offline"]) addEventListener(event, updateOnlineStatus);

		// eslint-disable-next-line no-new
		new Tooltip(document.body, {container: document.body, selector: '[data-bs-toggle="tooltip"]', trigger: "hover"});
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
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
