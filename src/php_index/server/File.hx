package php_index.server;

import haxe.io.Mime;
import php.Global;
import tink.Url;

using StringTools;
using haxe.io.Path;

/** A reference to a file on the file system. **/
class File {

	/** The base URI of the file system. **/
	static final baseUri: Url =
		#if !debug "phar://index.zip/" #else 'file:${Sys.systemName() == "Windows" ? "/" : ""}//${Application.instance.basePath}/' #end;

	/** The MIME type of this file. **/
	public var mimeType(get, never): Mime;

	/** The path of this file. **/
	public final path: String;

	/** The URI of this file. **/
	public var uri(get, never): Url;

	/** Creates a new file. **/
	public function new(path: String) this.path = path.normalize();

	/** Gets the MIME type of this file. **/
	function get_mimeType() return switch path.extension().toLowerCase() {
		case "css": TextCss;
		case "html": TextHtml;
		case "js": ApplicationJavascript;
		case "svg": "image/svg+xml";
		case "woff2": "font/woff2";
		default: ApplicationOctetStream;
	};

	/** Gets the URI of this file. **/
	inline function get_uri() return baseUri.resolve(path);

	/** Gets a value indicating whether this file exists. **/
	public inline function exists() return Global.is_file(uri);

	/** Gets the content of this file. **/
	public inline function getContent(): String return Global.file_get_contents(uri);

	/** Gets the size of this file. **/
	public inline function getSize(): Int return Global.filesize(uri);
}
