import {locales, setLocale} from "./locale.js";

// Register the components.
import "./html/components/action_bar.js";
import "./html/components/listing.js";
import "./html/components/navbar.js";
import "./html/components/root.js";
import "./html/components/theme.js";

// Set the locale.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);

// Start the application.
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
