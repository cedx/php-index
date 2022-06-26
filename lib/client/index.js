export * from "./navbar.js";

// Start the application.
import {Root} from "./root.js";
addEventListener("DOMContentLoaded", () => {
	const {body} = document;
	while (body.lastChild) body.removeChild(body.lastChild);
	body.appendChild(new Root);
});
