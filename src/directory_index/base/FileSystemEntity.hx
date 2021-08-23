package directory_index.base;

import coconut.data.Model;
using haxe.io.Path;

/** A reference to an entity on the file system. **/
@:jsonParse(json -> new directory_index.base.io.FileSystemEntity(json))
@:jsonStringify(entity -> {
	path: entity.path,
	size: entity.size,
	type: entity.type
})
class FileSystemEntity implements Model {

	/** The icon corresponding to this file system entity. **/
	@:computed var icon: String = "file-earmark" + switch path.extension() {
		case "bz2": "-zip";
		case "gz": "-zip";
		case "htm": "-code";
		case "html": "-code";
		case "rar": "-zip";
		case "xz": "-zip";
		case "zip": "-zip";
		default: "";
	};

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
