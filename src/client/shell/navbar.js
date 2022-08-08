import {html} from "lit";
import {ClockController} from "./clock_controller.js";
import {Component} from "../component.js";
import {getLocale} from "../locale.js";

/**
 * The navigation bar.
 */
export class Navbar extends Component {

	/**
	 * The clock controller.
	 * @type {ClockController}
	 */
	#clock = new ClockController(this, 60);

	/**
	 * The date format.
	 * @type {Intl.DateTimeFormat}
	 */
	#dateFormatter = new Intl.DateTimeFormat(getLocale(), {dateStyle: "full"});

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 */
	render() {
		return html`
			<nav class="navbar navbar-dark">
				<div class="container-fluid">
					<div class="navbar-brand d-flex align-items-center">
						<span><i class="bi bi-card-list"></i></span>
						<span class="ms-2">${location.hostname}</span>
					</div>

					<span class="d-none d-sm-block navbar-text text-capitalize-first">
						${this.#dateFormatter.format(this.#clock.value)}
					</span>
				</div>
			</nav>
		`;
	}
}

// Register the component.
customElements.define("app-navbar", Navbar);
