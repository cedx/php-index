import {localized, msg, str} from "@lit/localize";
import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {Component} from "../component.js";

/**
 * Displays the list of file system entities.
 */
@customElement("app-entitylist")
@localized()
export class EntityListView extends Component {

	/**
	 * The current path.
	 */
	#path = location.pathname.length > 1 ? location.pathname.slice(0, -1) : location.pathname;

	/**
	 * Method invoked when this component is mounted.
	 */
	connectedCallback(): void {
		super.connectedCallback();
		// TODO fetch
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	render(): TemplateResult {
		return html`
			<article>
				<section>
					<h2>${msg(str`Index of ${this.#path}`)}</h2>
				</section>
			</article>
		`;
	}
}
