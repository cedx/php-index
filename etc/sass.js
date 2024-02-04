import {mkdir, writeFile} from "node:fs/promises";
import {EOL} from "node:os";
import {env} from "node:process";
import {compileAsync} from "sass-embedded";

/**
 * Compiles the style sheet.
 * @returns {Promise<void>} Resolves when the style sheet has been compiled.
 */
export default async function compileSass() {
	const production = env.NODE_ENV == "production";
	const {css, sourceMap} = await compileAsync("src/ui/index.scss", {
		loadPaths: ["node_modules"],
		sourceMap: !production,
		style: production ? "compressed" : "expanded"
	});

	await mkdir("www/css", {recursive: true});
	if (sourceMap) await writeFile("www/css/main.css.map", JSON.stringify(sourceMap));
	return writeFile("www/css/main.css", sourceMap ? `${css}${EOL}/*# sourceMappingURL=main.css.map */` : css);
}
