/**
 * Defines the type of a file system entity.
 * @enum {string}
 */
export const FileSystemEntityType = Object.freeze({

	/**
	 * The file system entity is a directory.
	 */
	directory: "directory",

	/**
	 * The file system entity is a file.
	 */
	file: "file"
});

/**
 * A reference to an entity on the file system.
 */
export class FileSystemEntity {

	/**
	 * The icon mapping.
	 * @type {Map<string, string>}
	 * @readonly
	 */
	static #iconMapping = new Map([
		["avi", "video_file"],
		["bat", "terminal"],
		["bz2", "folder_zip"],
		["cjs", "js"],
		["cmd", "terminal"],
		["conf", "settings"],
		["config", "settings"],
		["css", "css"],
		["csv", "csv"],
		["doc", "description"],
		["docx", "description"],
		["exe", "binary"],
		["gif", "image"],
		["gz", "folder_zip"],
		["htm", "html"],
		["html", "html"],
		["hx", "code"],
		["hxml", "code"],
		["ico", "image"],
		["ini", "settings"],
		["jpeg", "image"],
		["jpg", "image"],
		["js", "js"],
		["json", "data_object"],
		["m4a", "audio_file"],
		["m4v", "video_file"],
		["md", "makdown"],
		["mjs", "js"],
		["mkv", "video_file"],
		["mov", "video_file"],
		["mp3", "audio_file"],
		["mp4", "video_file"],
		["odp", "slideshow"],
		["ods", "table"],
		["odt", "description"],
		["pdf", "description"],
		["phar", "folder_zip"],
		["php", "php"],
		["png", "image"],
		["ppt", "slideshow"],
		["pptx", "slideshow"],
		["ps1", "terminal"],
		["rar", "folder_zip"],
		["rtf", "description"],
		["sh", "terminal"],
		["svg", "image"],
		["tar", "folder_zip"],
		["txt", "description"],
		["wav", "audio_file"],
		["webp", "image"],
		["xls", "table"],
		["xlsx", "table"],
		["xml", "code"],
		["xz", "folder_zip"],
		["yaml", "code"],
		["yml", "code"],
		["zip", "folder_zip"]
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
	 * @type {FileSystemEntityType}
	 * @readonly
	 */
	type;

	/**
	 * Creates a new file system entity.
	 * @param {Partial<FileSystemEntityOptions>} options An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.modifiedAt = new Date(options.modifiedAt ?? Date.now());
		this.path = options.path ?? "";
		this.size = options.size ?? -1;
		this.type = options.type ?? FileSystemEntityType.file;
	}

	/**
	 * The icon corresponding to this file system entity.
	 * @type {string}
	 */
	get icon() {
		return this.type == FileSystemEntityType.directory
			? "folder"
			: FileSystemEntity.#iconMapping.get(this.path.split(".").pop()?.toLowerCase() ?? "") ?? "note";
	}
}

/**
 * Defines the options of an {@link FileSystemEntity} instance.
 * @typedef {object} FileSystemEntityOptions
 * @property {string} modifiedAt The date of last modification.
 * @property {string} path The path of this file system entity.
 * @property {number} size The size of this file system entity.
 * @property {FileSystemEntityType} type The type of this file system entity.
 */
