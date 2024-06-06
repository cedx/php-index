import {msg} from "@lit/localize";
import {html} from "lit";
import {when} from "lit/directives/when.js";
import {Component} from "./component.js";

/**
 * A component that shows up when an HTTP request starts, and hides when all concurrent HTTP requests are completed.
 */
export class OfflineIndicator extends Component {

	/**
	 * The reactive properties.
	 * @type {import("lit").PropertyDeclarations}
	 * @override
	 */
	static properties = {
		isOnline: {state: true}
	};

	/**
	 * Creates a new offline indicator.
	 */
	constructor() {
		super({shadowRoot: true});

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
		customElements.define("offline-indicator", this);
	}

	/**
	 * Method invoked when this component is connected.
	 * @override
	 */
	connectedCallback() {
		super.connectedCallback();
		for (const event of ["online", "offline"]) addEventListener(event, this);
	}

	/**
	 * Method invoked when this component is disconnected.
	 * @override
	 */
	disconnectedCallback() {
		for (const event of ["online", "offline"]) removeEventListener(event, this);
		super.disconnectedCallback();
	}

	/**
	 * Handles the events.
	 */
	handleEvent() {
		this.isOnline = navigator.onLine;
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 * @override
	 */
	render() {
		return when(!this.isOnline, () => html`
			<slot>
				<div class="alert alert-danger border-end-0 border-start-0 mb-0 rounded-0">
					<i class="icon icon-fill fw-bold me-1">error</i> ${msg("The network is inaccessible.")}
					<span class="d-none d-sm-inline">${msg("Check your connection.")}</span>
				</div>
			</slot>
		`);
	}
}
