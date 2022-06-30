import {Navbar} from "./navbar.js";
import {Root} from "./root.js";

/**
 * The list of all custom elements.
 * @type {Array<[string, CustomElementConstructor]>}
 */
const components = [
	["navbar", Navbar],
	["root", Root]
];

// Start the application.
for (const [key, value] of components) customElements.define(`app-${key}`, value);
addEventListener("DOMContentLoaded", () => document.body.querySelector(".loader")?.replaceWith(new Root));
