import fetchProxy from "./fetch.js";
import {locales, setLocale} from "./locale.js";

// Load the components.
import "./file_system/listing.js";
import "./shell/navbar.js";
import "./shell/root.js";
import "./shell/theme_selector.js";

// Set the locale.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
