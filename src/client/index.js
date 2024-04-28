import config from "./config.js";
import {locales, setLocale} from "./locale.js";

// Register the components.
import "./html/ui/action_bar.js";
import "./html/ui/listing.js";
import "./html/ui/navbar.js";
import "./html/ui/root.js";
import "./html/ui/theme_dropdown.js";

// Start the application.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);
document.documentElement.dataset.version = config.version;
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
