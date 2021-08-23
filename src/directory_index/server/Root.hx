package directory_index.server;

import directory_index.base.FileSystemEntity;
import haxe.io.Mime.ApplicationJson;
import php.Global;
import php.SuperGlobal._SERVER;
import sys.FileSystem;
import tink.Json;
import tink.http.Response.OutgoingResponse;

using StringTools;
using haxe.io.Path;

/** The root controller. **/
class Root {

	/** Creates a new root controller. **/
	public function new() {}

	/** Handles the requests. **/
	@:get("/")
	public function index(query: {?file: String, ?listing: Bool}) {
		if (query.listing != null) return sendListing();
		final path = query.file != null ? query.file.trim() : "main.html";
		return path.length > 0 ? sendFile(path) : Failure(new Error(UnprocessableEntity, "The file path is required."));
	}

	/** Sends the specified file to the client. **/
	function sendFile(path: String) {
		final file = new File('www/$path');
		return file.exists()
			? Success(OutgoingResponse.blob(file.getContent(), file.mimeType))
			: Failure(new Error(NotFound, 'The file "$path" is not found.'));
	}

	/** Sends the directory listing to the client. **/
	function sendListing() {
		final entities = [];
		final exclude = [Path.withoutDirectory(_SERVER["PHP_SELF"]), "index.phar", "web.config"];

		for (entity in FileSystem.readDirectory(Sys.getCwd()).filter(item -> item.charAt(0) != "." && !exclude.contains(item))) {
			final type = FileSystem.isDirectory(entity) ? Directory : File;
			entities.push(new FileSystemEntity({
				modifiedAt: Date.fromTime(Global.filemtime(entity) * 1000),
				path: entity,
				size: type == File ? Global.filesize(entity) : -1,
				type: type
			}));
		}

		return Success(OutgoingResponse.blob(Json.stringify(entities), ApplicationJson));
	}
}
