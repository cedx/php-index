import "urlpattern-polyfill";
import {fetchProxy} from "./fetch_proxy.js";
import {locales, setLocale} from "./locale.js";

// Register the application components.
import "./shell/navbar.js";
import "./shell/root.js";

// Set the locale.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
