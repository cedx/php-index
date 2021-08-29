package directory_index.base;

import coconut.data.Model;
using haxe.io.Path;

/** A reference to an entity on the file system. **/
@:jsonParse(json -> new directory_index.base.FileSystemEntity(json))
@:jsonStringify(entity -> {
	modifiedAt: entity.modifiedAt,
	path: entity.path,
	size: entity.size,
	type: entity.type
})
class FileSystemEntity implements Model {

	/** The icon mapping. **/
	static final iconMapping = [
		"avi" => "play",
		"bat" => "binary",
		"bin" => "binary",
		"bz2" => "zip",
		"cmd" => "binary",
		"conf" => "code",
		"config" => "code",
		"css" => "code",
		"doc" => "richtext",
		"docx" => "richtext",
		"exe" => "binary",
		"gif" => "image",
		"gz" => "zip",
		"htm" => "code",
		"html" => "code",
		"hx" => "code",
		"hxml" => "code",
		"ico" => "image",
		"ini" => "code",
		"jpeg" => "image",
		"jpg" => "image",
		"js" => "code",
		"json" => "code",
		"m4a" => "music",
		"m4v" => "play",
		"md" => "text",
		"mkv" => "play",
		"mov" => "play",
		"mp3" => "music",
		"mp4" => "play",
		"odp" => "slides",
		"ods" => "spreadsheet",
		"odt" => "richtext",
		"pdf" => "pdf",
		"phar" => "zip",
		"php" => "code",
		"png" => "image",
		"ppt" => "slides",
		"pptx" => "slides",
		"ps1" => "binary",
		"rar" => "zip",
		"rtf" => "richtext",
		"sh" => "binary",
		"svg" => "image",
		"tar" => "zip",
		"txt" => "text",
		"wav" => "music",
		"xls" => "spreadsheet",
		"xlsx" => "spreadsheet",
		"xml" => "code",
		"xz" => "zip",
		"yaml" => "code",
		"yml" => "code",
		"zip" => "zip"
	];

	/** The icon corresponding to this file system entity. **/
	@:computed var icon: String = if (type == Directory) "folder-fill" else {
		final extension = path.extension().toLowerCase();
		iconMapping.exists(extension) ? 'file-earmark-${iconMapping[extension]}' : "file-earmark";
	};

	/** The date of last modification. **/
	@:constant var modifiedAt: Date = @byDefault Date.now();

	/** The path of this file system entity. **/
	@:constant var path: String;

	/** The size of this file system entity. **/
	@:constant var size: Int = @byDefault -1;

	/** The type of this file system entity. **/
	@:constant var type: FileSystemEntityType = @byDefault File;
}

/** Defines the type of a file system entity. **/
enum FileSystemEntityType {

	/** The file system entity is a directory. **/
	Directory;

	/** The file system entity is a file. **/
	File;
}
