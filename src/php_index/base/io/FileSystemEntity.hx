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
		"avi" => "video_file",
		"bat" => "terminal",
		"bz2" => "folder_zip",
		"cjs" => "js",
		"cmd" => "terminal",
		"conf" => "settings",
		"config" => "settings",
		"css" => "css",
		"csv" => "csv",
		"doc" => "description",
		"docx" => "description",
		"exe" => "binary",
		"gif" => "image",
		"gz" => "folder_zip",
		"htm" => "html",
		"html" => "html",
		"hx" => "code",
		"hxml" => "code",
		"ico" => "image",
		"ini" => "settings",
		"jpeg" => "image",
		"jpg" => "image",
		"js" => "js",
		"json" => "data_object",
		"m4a" => "audio_file",
		"m4v" => "video_file",
		"md" => "makdown",
		"mjs" => "js",
		"mkv" => "video_file",
		"mov" => "video_file",
		"mp3" => "audio_file",
		"mp4" => "video_file",
		"odp" => "slideshow",
		"ods" => "table",
		"odt" => "description",
		"pdf" => "description",
		"phar" => "folder_zip",
		"php" => "php",
		"png" => "image",
		"ppt" => "slideshow",
		"pptx" => "slideshow",
		"ps1" => "terminal",
		"rar" => "folder_zip",
		"rtf" => "description",
		"sh" => "terminal",
		"svg" => "image",
		"tar" => "folder_zip",
		"txt" => "description",
		"wav" => "audio_file",
		"webp" => "image",
		"xls" => "table",
		"xlsx" => "table",
		"xml" => "code",
		"xz" => "folder_zip",
		"yaml" => "code",
		"yml" => "code",
		"zip" => "folder_zip"
	];

	#if php
	/** The contents of this file system entity. **/
	public var contents(get, never): Chunk;
		function get_contents(): Chunk return type == Directory ? Chunk.EMPTY : Global.file_get_contents(path);

	/** Value indicating whether this file system entity exists. **/
	public var exists(get, never): Bool;
		inline function get_exists() return Global.file_exists(path);
	#end

	/** The icon corresponding to this file system entity. **/
	@:computed var icon: String = type == Directory ? "folder" : (iconMapping[path.extension().toLowerCase()] ?? "note");

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
