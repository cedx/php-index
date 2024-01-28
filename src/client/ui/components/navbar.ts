import {msg} from "@lit/localize";
import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {Component} from "../component.js";

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
			<nav class="navbar navbar-expand-sm d-print-none">
				<div class="container-fluid">
					<div class="navbar-brand d-flex align-items-center">
						<img alt="PHP Index" height="24" src="?file=favicon.svg" width="24"/>
						<span class="ms-2">${location.hostname}</span>
					</div>

					<div class="collapse navbar-collapse">
						<menu class="navbar-nav ms-auto">
							<theme-dropdown label=${msg("Theme")}></theme-dropdown>
						</menu>
					</div>
				</div>
			</nav>
		`;
	}
}
