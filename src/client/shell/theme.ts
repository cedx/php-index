import {customElement, property, state} from "lit/decorators.js";
import {html, type TemplateResult} from "lit";
import {Component} from "../component.js";
import {Theme, themeIcon, themeLabel} from "../theme.js";

/**
 * A dropdown menu for switching the color mode.
 */
@customElement("theme-dropdown")
export class ThemeDropdown extends Component {

}

/**
 * A component for switching the color mode.
 */
@customElement("theme-selector")
export class ThemeSelector extends Component {

	/**
	 * The label of the dropdown menu.
	 */
	@property() label = "";

	/**
	 * The current theme.
	 */
	@state() theme = Theme.auto;

	/**
	 * The media query used to check the system theme.
	 */
	readonly #mediaQuery = matchMedia("(prefers-color-scheme: dark)");

	/**
	 * Method invoked when this component is connected.
	 */
	connectedCallback(): void {
		super.connectedCallback();

		const theme = localStorage.getItem("theme") as Theme|null;
		this.theme = theme && Object.values(Theme).includes(theme) ? theme : Theme.auto;
		this.#applyTheme();
		this.#mediaQuery.addEventListener("change", this.#applyTheme);
	}

	/**
	 * Method invoked when this component is disconnected.
	 */
	disconnectedCallback(): void {
		this.#mediaQuery.removeEventListener("change", this.#applyTheme);
		super.disconnectedCallback();
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected render(): TemplateResult[] {
		return Object.values(Theme).map(theme => html`
			<li>
				<button class="dropdown-item d-flex align-items-center justify-content-between" @click=${() => this.#changeTheme(theme)}>
					<span><i class="icon icon-fill me-1">${themeIcon(theme)}</i> ${themeLabel(theme)}</span>
					<if ${theme == this.theme}><i class="icon ms-2">check</i></if>
				</button>
			</li>
		`);
	}

	/**
	 * Applies the theme to the document.
	 */
	#applyTheme(): void {
		document.documentElement.dataset.bsTheme = this.theme == Theme.auto ? (this.#mediaQuery.matches ? Theme.dark : Theme.light) : this.theme;
		this.dispatchEvent(new CustomEvent("change", {detail: this.theme}));
	}

	/**
	 * Changes the current theme.
	 */
	#changeTheme(theme: Theme): void {
		localStorage.setItem("theme", this.theme = theme);
		this.#applyTheme();
	}
}
