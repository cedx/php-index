package php_index.server;

import haxe.io.Mime;
import php.Global;
import php.Phar;
import php_index.base.io.FileSystemEntity;
import sys.FileSystem;
import tink.Json;
import tink.Url;
import tink.http.Response.OutgoingResponse;
using StringTools;
using haxe.io.Path;

/** The root controller. **/
class Root {

	/** Creates a new root controller. **/
	public function new() {}

	/** Fetches the directory listing or a resource embedded in the data file. **/
	@:get("/")
	public function index(query: {?file: String, ?listing: Bool}) {
		if (query.listing != null) return sendListing();
		final path = query.file?.trim() ?? "main.html";
		return path.length > 0 ? sendFile(path) : Failure(new Error(UnprocessableEntity, "The file path is required."));
	}

	/** Sends the specified file to the client. **/
	function sendFile(path: String) {
		final pharPath = Phar.running(false);
		final baseUri: Url = pharPath.length > 0
			? 'phar://${pharPath.withoutDirectory()}/'
			: 'file:${Sys.systemName() == "Windows" ? "/" : ""}//${Path.join([Sys.programPath().directory(), ".."])}/';

		final file = new FileSystemEntity({path: baseUri.resolve('www/$path')});
		return file.exists && file.type == File
			? Success(OutgoingResponse.blob(file.contents, file.mediaType))
			: Failure(new Error(NotFound, 'The file "$path" is not found.'));
	}

	/** Sends the directory listing to the client. **/
	function sendListing() {
		final exclude = [Sys.programPath().withoutDirectory(), "desktop.ini", "web.config", "$Recycle.Bin", "$RECYCLE.BIN"];
		final pharPath = Phar.running(false);
		if (pharPath.length > 0) exclude.push(pharPath.withoutDirectory());

		final basePath = Sys.programPath().directory();
		final entities = FileSystem.readDirectory(basePath)
			.filter(entry -> entry.charAt(0) != "." && !exclude.contains(entry) && Global.is_readable(Path.join([basePath, entry])))
			.map(entry -> new FileSystemEntity({path: Path.join([basePath, entry])}));

		return Success(OutgoingResponse.blob(Json.stringify(entities), Mime.ApplicationJson));
	}
}
