package php_index.base.io;

import coconut.data.Model;
import haxe.io.Mime;
using DateTools;
using haxe.io.Path;

#if php
import php.Global;
import tink.Chunk;
#end

/** A reference to an entity on the file system. **/
@:jsonParse(json -> new php_index.base.io.FileSystemEntity(json))
@:jsonStringify(entity -> {
	modifiedAt: entity.modifiedAt,
	path: haxe.io.Path.withoutDirectory(entity.path),
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

	#if php
	/** The contents of this file system entity. **/
	public var contents(get, never): Chunk;
		function get_contents(): Chunk return type == Directory ? Chunk.EMPTY : Global.file_get_contents(path);

	/** Value indicating whether this file system entity exists. **/
	public var exists(get, never): Bool;
		function get_exists() return Global.file_exists(path);
	#end

	/** The icon corresponding to this file system entity. **/
	@:computed var icon: String = if (type == Directory) "folder-fill" else {
		final extension = path.extension().toLowerCase();
		iconMapping.exists(extension) ? 'file-earmark-${iconMapping[extension]}' : "file-earmark";
	}

	/** The MIME type of this file system entity. **/
	@:computed var mediaType: Mime = type == Directory ? "inode/directory" : switch path.extension().toLowerCase() {
		case "css": TextCss;
		case "html": TextHtml;
		case "js": TextJavascript;
		case "svg": "image/svg+xml";
		case "woff2": "font/woff2";
		default: ApplicationOctetStream;
	}

	/** The date of last modification. **/
	#if js
	@:constant var modifiedAt: Date = @byDefault Date.now();
	#else
	public var modifiedAt(get, never): Date;
		function get_modifiedAt() return Date.fromTime(Global.filemtime(path).seconds());
	#end

	/** The path of this file system entity. **/
	@:constant var path: String;

	/** The size in bytes of this file system entity. **/
	#if js
	@:constant var size: Int = @byDefault -1;
	#else
	public var size(get, never): Int;
		function get_size() return type == Directory ? -1 : Global.filesize(path);
	#end

	/** The type of this file system entity. **/
	#if js
	@:constant var type: FileSystemEntityType = @byDefault File;
	#else
	public var type(get, never): FileSystemEntityType;
		function get_type() return Global.is_dir(path) ? Directory : File;
	#end
}

/** Defines the type of a file system entity. **/
enum FileSystemEntityType {

	/** The file system entity is a directory. **/
	Directory;

	/** The file system entity is a file. **/
	File;
}
