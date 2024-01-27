import {Dropdown} from "bootstrap";
import {customElement, property, state} from "lit/decorators.js";
import {html, type TemplateResult} from "lit";
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
	 * The icon of the dropdown menu.
	 */
	@state() private icon = themeIcon(Theme.auto);

	/**
	 * Method invoked after the first rendering.
	 */
	protected override firstUpdated(): void {
		// eslint-disable-next-line no-new
		new Dropdown(this.renderRoot.querySelector(".dropdown-toggle")!);
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
		return html`
			<li class="nav-item dropdown">
				<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
					<i class="icon icon-fill">${this.icon}</i>
					${when(this.label, () => html`<span class="ms-1">${this.label}</span>`)}
				</a>
				<ul class="dropdown-menu dropdown-menu-end">
					<theme-selector @change=${this.#handleChange}></theme-selector>
				</ul>
			</li>
		`;
	}

	/**
	 * Handles the theme changes.
	 * @param event The dispatched event.
	 */
	#handleChange(event: CustomEvent<Theme>): void {
		this.icon = themeIcon(event.detail);
	}
}

/**
 * A component for switching the color mode.
 */
@customElement("theme-selector")
export class ThemeSelector extends Component {

	/**
	 * The current theme.
	 */
	@state() private theme;

	/**
	 * The media query used to check the system theme.
	 */
	readonly #mediaQuery = matchMedia("(prefers-color-scheme: dark)");

	/**
	 * Creates a new theme selector.
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
		this.#applyTheme();
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult[] {
		return Object.values(Theme).map(theme => html`
			<li>
				<button class="dropdown-item d-flex align-items-center justify-content-between" @click=${() => this.#changeTheme(theme)}>
					<span><i class="icon icon-fill me-1">${themeIcon(theme)}</i> ${themeLabel(theme)}</span>
					${when(theme == this.theme, () => html`<i class="icon ms-2">check</i>`)}
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
		if (theme != this.theme) {
			localStorage.setItem("theme", this.theme = theme);
			this.#applyTheme();
		}
	}
}
