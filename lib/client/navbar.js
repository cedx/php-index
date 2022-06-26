import {html} from "lit";
import {BaseElement} from "./base_element.js";
import {ClockController} from "./clock_controller.js";

/**
 * The navigation bar.
 */
export class Navbar extends BaseElement {

	/**
	 * The clock controller.
	 * @type {ClockController}
	 */
	#clock = new ClockController(this, 3_600);

	/**
	 * The date format.
	 * @type {Intl.DateTimeFormat}
	 */
	#dateFormatter = new Intl.DateTimeFormat("fr", {dateStyle: "full"}); // TODO language

	/**
	 * Renders this element.
	 * @returns {import("lit").TemplateResult}
	 */
	render() {
		return html`
			<nav class="bg-primary d-print-none navbar navbar-dark fixed-top shadow user-select-none">
				<div class="container-fluid">
					<div class="d-flex align-items-center">
						<span class="navbar-brand">
							<img alt="" src="?file=img/navbar_logo.svg"/>
						</span>
						<span class="navbar-brand">
							${location.hostname}
						</span>
					</div>

					<span class="d-none d-sm-block navbar-text text-capitalize-first">
						${this.#dateFormatter.format(this.#clock.value)}
					</span>
				</div>
			</nav>
		`;
	}
}

// Register the custom element.
customElements.define("app-navbar", Navbar);
