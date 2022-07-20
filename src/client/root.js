import {html} from "lit";
import {BaseElement} from "./base_element.js";

/**
 * The root view.
 */
export class Root extends BaseElement {

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
	 * @returns {import("lit").TemplateResult}
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
