/**
 * Defines the type of a file system entity.
 * @enum {string}
 */
export const EntityType = Object.freeze({

	/** The file system entity is a directory. */
	directory: "directory",

	/** The file system entity is a file. */
	file: "file"
});

/**
 * A reference to an entity on the file system.
 */
export class Entity {

	/**
	 * The icon mapping.
	 * @type {Map<string, string>}
	 */
	static #iconMapping = new Map([
		["avi", "play"],
		["bat", "binary"],
		["bin", "binary"],
		["bz2", "zip"],
		["cmd", "binary"],
		["conf", "code"],
		["config", "code"],
		["css", "code"],
		["doc", "richtext"],
		["docx", "richtext"],
		["exe", "binary"],
		["gif", "image"],
		["gz", "zip"],
		["htm", "code"],
		["html", "code"],
		["hx", "code"],
		["hxml", "code"],
		["ico", "image"],
		["ini", "code"],
		["jpeg", "image"],
		["jpg", "image"],
		["js", "code"],
		["json", "code"],
		["m4a", "music"],
		["m4v", "play"],
		["md", "text"],
		["mkv", "play"],
		["mov", "play"],
		["mp3", "music"],
		["mp4", "play"],
		["odp", "slides"],
		["ods", "spreadsheet"],
		["odt", "richtext"],
		["pdf", "pdf"],
		["phar", "zip"],
		["php", "code"],
		["png", "image"],
		["ppt", "slides"],
		["pptx", "slides"],
		["ps1", "binary"],
		["rar", "zip"],
		["rtf", "richtext"],
		["sh", "binary"],
		["svg", "image"],
		["tar", "zip"],
		["txt", "text"],
		["wav", "music"],
		["xls", "spreadsheet"],
		["xlsx", "spreadsheet"],
		["xml", "code"],
		["xz", "zip"],
		["yaml", "code"],
		["yml", "code"],
		["zip", "zip"]
	]);

	/**
	 * The date of last modification.
	 * @type {Date}
	 * @readonly
	 */
	modifiedAt;

	/**
	 * The path of this file system entity.
	 * @type {string}
	 * @readonly
	 */
	path;

	/**
	 * The size of this file system entity.
	 * @type {number}
	 * @readonly
	 */
	size;

	/**
	 * The type of this file system entity.
	 * @type {EntityType}
	 * @readonly
	 */
	type;

	/**
	 * Creates a new file system entity.
	 * @param {EntityOptions} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.modifiedAt = new Date(options.modifiedAt ?? Date.now());
		this.path = options.path ?? "";
		this.size = options.size ?? -1;
		this.type = options.type ?? EntityType.file;
	}

	/**
	 * The icon corresponding to this file system entity.
	 * @type {string}
	 */
	get icon() {
		if (this.type == EntityType.directory) return "folder-fill";
		const extension = this.path.split(".").pop()?.toLowerCase() ?? "";
		return Entity.#iconMapping.has(extension) ? `file-earmark-${Entity.#iconMapping.get(extension)}` : "file-earmark";
	}
}

/**
 * Defines the options of a {@link Entity} instance.
 * @typedef {object} EntityOptions
 * @property {string} [modifiedAt] The date of last modification.
 * @property {string} [path] The path of this file system entity.
 * @property {number} [size] The size of this file system entity.
 * @property {EntityType} [type] The type of this file system entity.
 */
