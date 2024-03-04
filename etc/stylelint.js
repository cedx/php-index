/**
 * @type {import("stylelint").Config}
 */
export default {
	extends: "stylelint-config-standard-scss",
	rules: {
		"declaration-block-single-line-max-declarations": 2,
		"declaration-empty-line-before": "never",
		"media-feature-name-no-unknown": [true, {ignoreMediaFeatureNames: ["map"]}]
	}
}
