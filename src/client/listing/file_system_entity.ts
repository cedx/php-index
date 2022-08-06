/**
 * Defines the type of a file system entity.
 */
export enum FileSystemEntityType {

	/** The file system entity is a directory. */
	directory = "directory",

	/** The file system entity is a file. */
	file = "file"
}

/**
 * A reference to an entity on the file system.
 */
export class FileSystemEntity {

	/**
	 * The icon mapping.
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
	 */
	readonly modifiedAt: Date;

	/**
	 * The path of this file system entity.
	 */
	readonly path: string;

	/**
	 * The size of this file system entity.
	 */
	readonly size: number;

	/**
	 * The type of this file system entity.
	 */
	readonly type: FileSystemEntityType;

	/**
	 * Creates a new file system entity.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: FileSystemEntityOptions = {}) {
		this.modifiedAt = new Date(options.modifiedAt ?? Date.now());
		this.path = options.path ?? "";
		this.size = options.size ?? -1;
		this.type = options.type ?? FileSystemEntityType.file;
	}

	/**
	 * The icon corresponding to this file system entity.
	 */
	get icon(): string {
		if (this.type == FileSystemEntityType.directory) return "folder-fill";
		const extension = this.path.split(".").pop()?.toLowerCase() ?? "";
		return FileSystemEntity.#iconMapping.has(extension) ? `file-earmark-${FileSystemEntity.#iconMapping.get(extension)}` : "file-earmark";
	}
}

/**
 * Defines the options of a {@link FileSystemEntity} instance.
 */
export interface FileSystemEntityOptions {

	/** The date of last modification. */
	modifiedAt?: string;

	/** The path of this file system entity. */
	path?: string;

	/** The size of this file system entity. */
	size?: number;

	/** The type of this file system entity. */
	type?: FileSystemEntityType;
}
