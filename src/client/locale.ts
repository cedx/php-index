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
	loadLocale: async locale => locales.get(locale)!,
	sourceLocale: "en",
	targetLocales: ["fr"]
});
