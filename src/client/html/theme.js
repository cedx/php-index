import {msg} from "@lit/localize";
import {html} from "lit";
import {when} from "lit/directives/when.js";
import {Component} from "./component.js";

/**
 * Defines the available color modes.
 * @enum {string}
 */
export const Theme = Object.freeze({

	/**
	 * The theme is light.
	 */
	light: "light",

	/**
	 * The theme is dark.
	 */
	dark: "dark",

	/**
	 * The color mode is automatic.
	 */
	auto: "auto"
});

/**
 * A dropdown menu for switching the color mode.
 */
export class ThemeDropdown extends Component {

	/**
	 * The reactive properties.
	 * @type {import("lit").PropertyDeclarations}
	 * @override
	 */
	static properties = {
		label: {},
		theme: {state: true}
	};

	/**
	 * The media query used to check the system theme.
	 * @type {MediaQueryList}
	 * @readonly
	 */
	#mediaQuery = matchMedia("(prefers-color-scheme: dark)");

	/**
	 * Creates a new theme dropdown.
	 */
	constructor() {
		super();
		const theme = /** @type {Theme|null} */ (localStorage.getItem("theme"));

		/**
		 * The label of the dropdown menu.
		 * @type {string}
		 */
		this.label = "";

		/**
		 * The current theme.
		 * @type {Theme}
		 * @private
		 */
		this.theme = theme && /** @type {string[]} */ (Object.values(Theme)).includes(theme) ? theme : Theme.auto;
	}

	/**
	 * Registers the component.
	 */
	static {
		customElements.define("theme-dropdown", this);
	}

	/**
	 * Method invoked when this component is connected.
	 * @override
	 */
	connectedCallback() {
		super.connectedCallback();
		this.#applyTheme();
		this.#mediaQuery.addEventListener("change", this);
	}

	/**
	 * Method invoked when this component is disconnected.
	 * @override
	 */
	disconnectedCallback() {
		this.#mediaQuery.removeEventListener("change", this);
		super.disconnectedCallback();
	}

	/**
	 * Handles the events.
	 */
	handleEvent() {
		this.#applyTheme();
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult}emplateResult} The view template.
	 * @protected
	 * @override
	 */
	render() {
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
	#applyTheme() {
		const theme = this.theme == Theme.auto ? (this.#mediaQuery.matches ? Theme.dark : Theme.light) : this.theme;
		document.documentElement.dataset.bsTheme = theme;
	}

	/**
	 * Changes the current theme.
	 * @param {Theme} theme The new theme.
	 */
	#changeTheme(theme) {
		if (theme != this.theme) {
			localStorage.setItem("theme", this.theme = theme);
			this.#applyTheme();
		}
	}
}

/**
 * Gets the icon corresponding to the specified theme.
 * @param {Theme} theme The theme.
 * @returns {string} The icon corresponding to the specified theme.
 */
export function themeIcon(theme) {
	switch (theme) {
		case Theme.dark: return "dark_mode";
		case Theme.light: return "light_mode";
		default: return "tonality";
	}
}

/**
 * Gets the label corresponding to the specified theme.
 * @param {Theme} theme The theme.
 * @returns {string} The label corresponding to the specified theme.
 */
export function themeLabel(theme) {
	switch (theme) {
		case Theme.dark: return msg("Dark");
		case Theme.light: return msg("Light");
		default: return msg("Auto");
	}
}
