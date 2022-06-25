/**
 * A reference to an entity on the file system.
 */
export class FileSystemEntity {

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
	 */
	modifiedAt;

	/**
	 * The path of this file system entity.
	 * @type {string}
	 */
	path = "";

	/**
	 * The size of this file system entity.
	 * @type {number}
	 */
	size = -1;

	/**
	 * The type of this file system entity.
	 * @type {string}
	 */
	type = FileSystemEntityType.file;

	/**
	 * Creates a new file system entity.
	 * @param {Record<string, any>} [json] An object providing values to initialize this instance.
	 */
	constructor(json = {}) {
		const {modifiedAt, path, size, type} = json;
		this.modifiedAt = typeof modifiedAt == "string" ? new Date(modifiedAt) : new Date;
		this.path = typeof path == "string" ? path : "";
		this.size = typeof size == "number" ? size : -1;
		this.type = Object.values(FileSystemEntityType).includes(type) ? type : FileSystemEntityType.file;
	}

	/**
	 * The icon corresponding to this file system entity.
	 * @type {string}
	 */
	get icon() {
		if (this.type == FileSystemEntityType.directory) return "folder-fill";
		const extension = this.path.split(".").pop()?.toLocaleLowerCase() ?? "";
		return FileSystemEntity.#iconMapping.has(extension) ? `file-earmark-${FileSystemEntity.#iconMapping.get(extension)}` : "file-earmark";
	}
}

/**
 * Defines the type of a file system entity.
 * @enum {string}
 */
export const FileSystemEntityType = Object.freeze({

	/** The file system entity is a directory. */
	directory: "directory",

	/** The file system entity is a file. */
	file: "file"
});
