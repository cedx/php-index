import {configureLocalization, type LocaleModule} from "@lit/localize";
import * as french from "./i18n/fr.js";

/**
 * The map of supported locales.
 */
export const locales = new Map<string, LocaleModule>([
	["fr", french]
]);

/**
 * Gets or sets the active locale.
 */
export const {getLocale, setLocale} = configureLocalization({
	loadLocale: locale => locales.has(locale) ? Promise.resolve(locales.get(locale)!) : Promise.reject(new Error(`Locale "${locale}" not found.`)),
	sourceLocale: "en",
	targetLocales: ["fr"]
});
