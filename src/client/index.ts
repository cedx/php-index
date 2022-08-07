import fetchProxy from "./fetch_proxy.js";
import {locales, setLocale} from "./locale.js";

// Load the components.
import "./listing/entity_list_view.js";
import "./shell/navbar.js";
import {Shell} from "./shell/shell.js";

// Set the locale.
const [locale] = navigator.language.split("-");
setLocale(locales.has(locale) ? locale : document.documentElement.lang);

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")!.replaceWith(new Shell);
