import fetchProxy from "./fetch_proxy.js";
import {Shell} from "./shell.js";

// Load the components.
import "./navbar.js";

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")!.replaceWith(new Shell);
