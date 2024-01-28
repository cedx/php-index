import {html, type TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import {Component} from "../component.js";

/**
 * An action bar located under the navigation bar.
 */
@customElement("action-bar")
export class ActionBar extends Component {

	/**
	 * Creates a new action bar.
	 */
	constructor() {
		super({shadowRoot: true});
	}

	/**
	 * Method invoked when this component is disconnected.
	 */
	override disconnectedCallback(): void {
		document.documentElement.style.removeProperty("--main-offset");
		super.disconnectedCallback();
	}

	/**
	 * Method invoked after the first rendering.
	 */
	protected override firstUpdated(): void {
		const {documentElement} = document;
		const navbarHeight = Number.parseInt(getComputedStyle(documentElement).getPropertyValue("--navbar-height"));
		const {offsetHeight} = this.renderRoot.firstElementChild as HTMLElement;
		documentElement.style.setProperty("--main-offset", `${navbarHeight + offsetHeight}px`);
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
		return html`
			<aside class="container-fluid">
				<slot class="d-flex justify-content-between align-items-center"></slot>
			</aside>
		`;
	}
}
