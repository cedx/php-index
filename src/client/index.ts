import fetchProxy from "./fetch_proxy.js";

// Load the components.
import "./shell/navbar.js";
import {Shell} from "./shell/shell.js";

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")!.replaceWith(new Shell);
