import {writeFile} from "node:fs/promises";
import {EOL} from "node:os";
import {compileAsync} from "sass-embedded";

/**
 * Compiles the style sheet.
 * @param {boolean} production Value indicating whether the application runs in production mode.
 * @returns {Promise<void>} Resolves when the style sheet has been compiled.
 */
export default async function compileSass(production = false) {
	const {css, sourceMap} = await compileAsync("src/ui/index.scss", {
		loadPaths: ["node_modules"],
		sourceMap: !production,
		style: production ? "compressed" : "expanded"
	});

	if (sourceMap) await writeFile("www/css/main.css.map", JSON.stringify(sourceMap));
	return writeFile("www/css/main.css", sourceMap ? `${css}${EOL}//# sourceMappingURL=main.css.map` : css);
}
