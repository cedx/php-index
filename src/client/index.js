import fetchProxy from "./fetch_proxy.js";
import {locales, setLocale} from "./locale.js";

// Load the components.
import "./file_system/listing.js";
import "./shell/navbar.js";
import {Root} from "./shell/root.js";

// Set the locale.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")?.replaceWith(new Root);
