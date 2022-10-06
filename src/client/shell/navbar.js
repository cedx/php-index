import {html} from "lit";
import {Clock} from "./clock.js";
import {Component} from "../component.js";
import {getLocale} from "../locale.js";

/**
 * The navigation bar.
 */
export class Navbar extends Component {

	/**
	 * The clock controller.
	 * @type {Clock}
	 */
	#clock = new Clock(this, 60);

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 */
	render() {
		return html`
			<nav class="navbar navbar-dark">
				<div class="container-fluid">
					<div class="navbar-brand d-flex align-items-center">
						<span><img alt="" height="24" src="?file=favicon.svg" width="24"/></span>
						<span class="ms-2">${location.hostname}</span>
					</div>

					<ul class="navbar-nav d-none d-sm-block">
						<li class="nav-item">
							<span class="navbar-text text-capitalize-first">
								${this.#clock.value.toLocaleString(getLocale(), {dateStyle: "full"})}
							</span>
						</li>
					</ul>
				</div>
			</nav>
		`;
	}
}

// Register the component.
customElements.define("app-navbar", Navbar);
