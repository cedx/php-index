import {LitElement, html} from "lit";

/**
 * The root view.
 */
export class Root extends LitElement {

	/**
	 * Creates a new root view.
	 */
	constructor() {
		super();
		const {hostname, pathname} = location;
		document.title = `${hostname} - ${pathname.length > 1 ? pathname.slice(-1) : pathname}`;
	}

	/**
	 * Renders this element.
	 */
	render() {
		return html`
			<header>
				<app-navbar></app-navbar>
			</header>

			<main>
				TODO
			</main>
		`;
	}
}

// Register the custom element.
customElements.define("app-root", Root);
