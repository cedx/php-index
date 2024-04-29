import {msg} from "@lit/localize";
import {Tooltip} from "bootstrap";
import {html} from "lit";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";

/**
 * The root component.
 */
export class Root extends Component {

	/**
	 * The reactive properties.
	 * @type {import("lit").PropertyDeclarations}
	 * @override
	 */
	static properties = {
		isOnline: {state: true}
	};

	/**
	 * Creates a new root component.
	 */
	constructor() {
		super();

		/**
		 * Value indicating whether the browser is online.
		 * @type {boolean}
		 * @private
		 */
		this.isOnline = navigator.onLine;
	}

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

		const updateOnlineStatus = () => this.isOnline = navigator.onLine;
		for (const event of ["online", "offline"]) addEventListener(event, updateOnlineStatus);

		// eslint-disable-next-line no-new
		new Tooltip(document.body, {container: document.body, selector: '[data-bs-toggle="tooltip"]', trigger: "hover"});
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 * @override
	 */
	render() {
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
