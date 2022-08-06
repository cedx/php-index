import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {ClockController} from "./clock_controller.js";
import {Component} from "../component.js";

/**
 * The navigation bar.
 */
@customElement("app-navbar")
export class Navbar extends Component {

	/**
	 * The clock controller.
	 */
	#clock = new ClockController(this, 60);

	/**
	 * The date format.
	 */
	#dateFormatter = new Intl.DateTimeFormat(navigator.language, {dateStyle: "full"});

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	render(): TemplateResult {
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
