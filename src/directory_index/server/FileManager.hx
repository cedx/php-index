package directory_index.server;

import haxe.io.Mime;
import php.Const;
import php.Global;
import php.Syntax;
import tink.Url;

using StringTools;
using haxe.io.Path;

/** Manages the file system entities. **/
class FileManager {

	/** The base URI of the file system. **/
	final baseUri: Url = {
		final path = #if debug Application.instance.basePath #else Path.join([Const.__DIR__, "index.phar"]) #end.replace("\\", "/") + "/www/";
		trace(path);
		final uri = path.split("/").map(StringTools.urlEncode).join("/");
		trace(uri);
		#if debug "file://" #else "phar://" #end + (Sys.systemName() == "Windows" ? '/$uri' : uri);
	}

	/** Creates a new file manager. **/
	public function new() {}

	/** Gets a value indicating whether the specified file exists. **/
	public function exists(path: String) return Global.is_file(getUri(path));

	/** Gets the MIME type of the specified file. **/
	public function getMimeType(path: String) return switch path.extension() {
		case "css": TextCss;
		case "html": TextHtml;
		case "js": ApplicationJavascript;
		case "woff": "font/woff";
		default: ApplicationOctetStream;
	};

	/** Gets the size of the specified file. **/
	public function getSize(path: String) return Global.filesize(getUri(path));

	/** Gets the URI corresponding to the specified file.**/
	public function getUri(path: String) return baseUri.resolve(path);

	/** Sends the specified file to the browser. **/
	public function sendFile(path: String) {
		trace(baseUri.toString());
		Global.header('Content-Length: ${getSize(path)}');
		Global.header('Content-Type: ${getMimeType(path)}');
		Syntax.code("readfile({0})", getUri(path).toString());
	}
}
