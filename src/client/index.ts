import {locales, setLocale} from "./locale.js";

// Register the components.
import "./html/components/action_bar.js";
import "./html/components/navbar.js";
import "./html/components/theme.js";
import "./html/views/listing.js";
import "./html/views/root.js";

// Start the application.
const [locale] = navigator.language.split("-");
await setLocale(locales.has(locale) ? locale : document.documentElement.lang);
document.getElementById("loader")?.replaceWith(document.createElement("app-root"));
