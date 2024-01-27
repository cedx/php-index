import {msg} from "@lit/localize";

/**
 * Defines the available color modes.
 */
export enum Theme {

	/**
	 * The theme is light.
	 */
	light = "light",

	/**
	 * The theme is dark.
	 */
	dark = "dark",

	/**
	 * The color mode is automatic.
	 */
	auto = "auto"
}

/**
 * Gets the icon corresponding to the specified theme.
 * @param theme The theme.
 * @returns The icon corresponding to the specified theme.
 */
export function themeIcon(theme: Theme): string {
	switch (theme) {
		case Theme.auto: return "tonality";
		case Theme.dark: return "dark_mode";
		case Theme.light: return "light_mode";
		default: return "";
	}
}

/**
 * Gets the label corresponding to the specified theme.
 * @param theme The theme.
 * @returns The label corresponding to the specified theme.
 */
export function themeLabel(theme: Theme): string {
	switch (theme) {
		case Theme.auto: return msg("Auto");
		case Theme.dark: return msg("Dark");
		case Theme.light: return msg("Light");
		default: return "";
	}
}
