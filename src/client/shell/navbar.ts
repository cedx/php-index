import {html, type TemplateResult} from "lit";
import {msg} from "@lit/localize";
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
	protected render(): TemplateResult {
		return html`
			<nav class="navbar navbar-expand-sm">
				<div class="container-fluid">
					<div class="navbar-brand">
						<img alt="PHP Index" height="24" src="?file=favicon.svg" width="24"/>
						<span class="ms-2">${location.hostname}</span>
					</div>

					<div class="collapse navbar-collapse">
						<menu class="navbar-nav ms-auto">
							<!-- TODO <Theme.ThemeDropdown .label=${msg("Theme")}/> -->
						</menu>
					</div>
				</div>
			</nav>
		`;
	}
}
