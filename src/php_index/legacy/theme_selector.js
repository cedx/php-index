import {msg} from "@lit/localize";
import {html} from "lit";
import {Component} from "../component.js";

/**
 * Defines the available color modes.
 * @enum {string}
 */
export const Theme = Object.freeze({

	/**
	 * The color mode is automatic.
	 */
	auto: "auto",

	/**
	 * The theme is dark.
	 */
	dark: "dark",

	/**
	 * The theme is light.
	 */
	light: "light"
});

/**
 * A dropdown menu that allows to switch the theme mode.
 */
export class ThemeSelector extends Component {

	/**
	 * The reactive properties.
	 * @type {import("lit").PropertyDeclarations}
	 */
	static properties = {
		theme: {}
	};

	/**
	 * Creates a new theme selector.
	 */
	constructor() {
		super();

		/**
		 * The current theme.
		 * @type {Theme}
		 */
		this.theme = localStorage.getItem("") ?? Theme.auto;
	}

	/**
	 * The user's preferred theme.
	 */
	get preferredTheme() {
		return matchMedia("(prefers-color-scheme: dark)").matches ? Theme.dark : Theme.light;
	}

	/**
	 * Method invoked when this component is connected.
	 */
	connectedCallback() {
		super.connectedCallback();
		document.documentElement.dataset.bsTheme = this.theme;
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 * @protected
	 */
	render() {
		return html`
			<li class="nav-item dropdown">
				<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
					<i class="bi bi-brightness-high-fill"></i>
				</a>
				<ul class="dropdown-menu dropdown-menu-end">
					<li>
						<button class="dropdown-item d-flex align-items-center" @click=${this.#changeTheme} type="button" value=${Theme.light}>
							<i class="bi bi-brightness-high-fill me-2"></i> ${msg("Light")}
						</button>
					</li>
					<li>
						<button class="dropdown-item d-flex align-items-center" @click=${this.#changeTheme} type="button" value=${Theme.dark}>
							<i class="bi bi-moon-stars-fill me-2"></i> ${msg("Dark")}
						</button>
					</li>
					<li>
						<button class="dropdown-item d-flex align-items-center" @click=${this.#changeTheme} type="button" value=${Theme.auto}>
							<i class="bi bi-circle-half me-2"></i> ${msg("Auto")}
						</button>
					</li>
				</ul>
			</li>
		`;
	}

	/**
	 * Changes the current theme.
	 * @param {Event} event The dispatched event.
	 */
	#changeTheme(event) {
		const theme = /** @type {HTMLSelectElement} */ (event.target).value;
		this._pagination = new Pagination({...this._pagination, pageSize});
		container.get(localStorage).setObject("pageSize", pageSize);
	}
}

// Register the component.
customElements.define("theme-selector", ThemeSelector);
