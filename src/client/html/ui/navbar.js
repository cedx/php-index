import {msg} from "@lit/localize";
import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";
import config from "../../config.js";

/**
 * The navigation bar.
 */
@customElement("app-navbar")
export class Navbar extends Component {

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
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
