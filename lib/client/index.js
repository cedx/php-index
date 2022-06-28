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

// Register the custom elements.
for (const [key, value] of components)
	customElements.define(`app-${key}`, value);

// Start the application.
addEventListener("DOMContentLoaded", () =>
	document.body.querySelector(".loader")?.replaceWith(new Root)
);
