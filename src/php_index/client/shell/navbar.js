import {html} from "lit";
import {Component} from "../component.js";

/**
 * The navigation bar.
 */
export class Navbar extends Component {

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 */
	render() {
		return html`
			<nav class="navbar navbar-expand-sm bg-primary">
				<div class="container-fluid">
					<div class="navbar-brand d-flex align-items-center">
						<span><img alt="" height="24" src="?file=favicon.svg" width="24"/></span>
						<span class="ms-2">${location.hostname}</span>
					</div>

					<div class="collapse navbar-collapse">
						<ul class="navbar-nav ms-auto d-none d-sm-block">
							<theme-selector></theme-selector>
						</ul>
					</div>
				</div>
			</nav>
		`;
	}
}

// Register the component.
customElements.define("app-navbar", Navbar);
