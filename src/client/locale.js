/** @import {LocaleModule} from "@lit/localize" */
import {configureLocalization} from "@lit/localize";
import * as french from "./i18n/fr.js";

/**
 * The map of supported locales.
 * @type {Map<string, LocaleModule>}
 */
export const locales = new Map([
	["fr", french]
]);

/**
 * Gets or sets the active locale.
 */
export const {getLocale, setLocale} = configureLocalization({
	loadLocale: locale => locales.has(locale)
		? Promise.resolve(/** @type {LocaleModule} */ (locales.get(locale)))
		: Promise.reject(Error(`Locale "${locale}" not found.`)),
	sourceLocale: "en",
	targetLocales: ["fr"]
});
