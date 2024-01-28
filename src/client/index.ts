import "urlpattern-polyfill";
import {fetchProxy} from "./http/fetch_proxy.js";
import {locales, setLocale} from "./locale.js";

// Register the components.
import "./ui/components/action_bar.js";
import "./ui/components/listing.js";
import "./ui/components/navbar.js";
import "./ui/components/root.js";
import "./ui/components/theme.js";

// Set the locale.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);

// Start the application.
window.fetch = fetchProxy;
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
