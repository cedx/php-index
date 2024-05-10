import config from "./config.js";
import {locales, setLocale} from "./locale.js";

// Register the components.
import "./html/action_bar.js";
import "./html/listing.js";
import "./html/navbar.js";
import "./html/offline_indicator.js";
import "./html/root.js";
import "./html/theme.js";

// Start the application.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);
document.documentElement.dataset.version = config.version;
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
