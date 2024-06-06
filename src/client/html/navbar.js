import {msg} from "@lit/localize";
import {html} from "lit";
import {when} from "lit/directives/when.js";
import config from "../config.js";
import {Component} from "./component.js";

/**
 * The navigation bar.
 */
export class Navbar extends Component {

	/**
	 * Registers the component.
	 */
	static {
		customElements.define("app-navbar", this);
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 * @override
	 */
	render() {
		return html`
			<nav class="navbar navbar-expand-sm">
				<div class="container-fluid">
					<div class="navbar-brand d-flex align-items-center">
						<img alt="PHP Index" height="24" src="?file=favicon.svg" width="24"/>
						<span class="ms-2">${location.hostname}</span>
					</div>

					<div class="collapse navbar-collapse">
						<menu class="navbar-nav ms-auto">
							<theme-dropdown label=${msg("Theme")}></theme-dropdown>
							${when(config.phpInfo, () => html`
								<li class="nav-item" data-bs-title=${msg("PHP information")} data-bs-toggle="tooltip">
									<a class="nav-link pe-2" href="?phpinfo" target="_blank"><i class="icon icon-fill transform-scale-130">settings</i></a>
								</li>
							`)}
						</menu>
					</div>
				</div>
			</nav>
		`;
	}
}
