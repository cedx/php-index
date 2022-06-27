import {Navbar} from "./navbar.js";
import {Root} from "./root.js";

// Register the custom elements.
const components = new Map([
	["navbar", Navbar],
	["root", Root]
]);

for (const [key, value] of components)
	customElements.define(`app-${key}`, value);

// Start the application.
addEventListener("DOMContentLoaded", () => {
	const {body} = document;
	while (body.lastChild) body.removeChild(body.lastChild);
	body.appendChild(new Root);
});
