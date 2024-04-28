import {msg} from "@lit/localize";

/**
 * Defines the available color modes.
 * @enum {string}
 */
export const Theme = Object.freeze({

	/**
	 * The theme is light.
	 */
	light: "light",

	/**
	 * The theme is dark.
	 */
	dark: "dark",

	/**
	 * The color mode is automatic.
	 */
	auto: "auto"
});

/**
 * Gets the icon corresponding to the specified theme.
 * @param {Theme} theme The theme.
 * @returns {string} The icon corresponding to the specified theme.
 */
export function themeIcon(theme) {
	switch (theme) {
		case Theme.dark: return "dark_mode";
		case Theme.light: return "light_mode";
		default: return "tonality";
	}
}

/**
 * Gets the label corresponding to the specified theme.
 * @param {Theme} theme The theme.
 * @returns {string} The label corresponding to the specified theme.
 */
export function themeLabel(theme) {
	switch (theme) {
		case Theme.dark: return msg("Dark");
		case Theme.light: return msg("Light");
		default: return msg("Auto");
	}
}
