import {Dropdown} from "bootstrap";
import {html, type TemplateResult} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";
import {Theme, themeIcon, themeLabel} from "../theme.js";

/**
 * A dropdown menu for switching the color mode.
 */
@customElement("theme-dropdown")
export class ThemeDropdown extends Component {

	/**
	 * The label of the dropdown menu.
	 */
	@property() label = "";

	/**
	 * The current theme.
	 */
	@state() private theme;

	/**
	 * The media query used to check the system theme.
	 */
	readonly #mediaQuery = matchMedia("(prefers-color-scheme: dark)");

	/**
	 * Creates a new theme dropdown.
	 */
	constructor() {
		super();
		const theme = localStorage.getItem("theme") as Theme|null;
		this.theme = theme && Object.values(Theme).includes(theme) ? theme : Theme.auto;
	}

	/**
	 * Method invoked when this component is connected.
	 */
	override connectedCallback(): void {
		super.connectedCallback();
		this.#mediaQuery.addEventListener("change", this.#applyTheme);
	}

	/**
	 * Method invoked when this component is disconnected.
	 */
	override disconnectedCallback(): void {
		this.#mediaQuery.removeEventListener("change", this.#applyTheme);
		super.disconnectedCallback();
	}

	/**
	 * Method invoked after the first rendering.
	 */
	protected override firstUpdated(): void {
		// eslint-disable-next-line no-new
		new Dropdown(this.renderRoot.querySelector(".dropdown-toggle")!);
		this.#applyTheme();
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
		return html`
			<li class="nav-item dropdown">
				<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
					<i class="icon icon-fill">${themeIcon(this.theme)}</i>
					${when(this.label, () => html`<span class="ms-1">${this.label}</span>`)}
				</a>
				<ul class="dropdown-menu dropdown-menu-end">
					${Object.values(Theme).map(theme => html`
						<li>
							<button class="dropdown-item d-flex align-items-center justify-content-between" @click=${() => this.#changeTheme(theme)}>
								<span><i class="icon icon-fill me-1">${themeIcon(theme)}</i> ${themeLabel(theme)}</span>
								${when(theme == this.theme, () => html`<i class="icon ms-2">check</i>`)}
							</button>
						</li>
					`)}
				</ul>
			</li>
		`;
	}

	/**
	 * Applies the theme to the document.
	 */
	#applyTheme(): void {
		document.documentElement.dataset.bsTheme = this.theme == Theme.auto ? (this.#mediaQuery.matches ? Theme.dark : Theme.light) : this.theme;
	}

	/**
	 * Changes the current theme.
	 */
	#changeTheme(theme: Theme): void {
		if (theme != this.theme) {
			localStorage.setItem("theme", this.theme = theme);
			this.#applyTheme();
		}
	}
}
