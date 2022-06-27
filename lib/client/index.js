import {Navbar} from "./navbar.js";
import {Root} from "./root.js";

// Register the custom elements.
customElements.define("app-navbar", Navbar);
customElements.define("app-root", Root);

// Start the application.
addEventListener("DOMContentLoaded", () => {
	const {body} = document;
	while (body.lastChild) body.removeChild(body.lastChild);
	body.appendChild(new Root);
});
