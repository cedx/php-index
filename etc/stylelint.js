/**
 * @type {import("stylelint").Config}
 */
export default {
	extends: "stylelint-config-standard-scss",
	rules: {
		"color-function-notation": ["modern", {ignore: ["with-var-inside"]}],
		"declaration-block-single-line-max-declarations": 2,
		"declaration-empty-line-before": "never",
		"media-feature-name-no-unknown": [true, {ignoreMediaFeatureNames: ["map"]}]
	}
}
