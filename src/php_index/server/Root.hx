package php_index.server;

import haxe.io.Mime;
import php.Global;
import php.Syntax;
import php_index.base.FileSystemEntity;
import php_index.base.RemoteApi;
import sys.FileSystem;
import tink.Json;
import tink.http.Response.OutgoingResponse;
using StringTools;
using haxe.io.Path;

/** The root controller. **/
class Root implements RemoteApi {

	/** Creates a new root controller. **/
	public function new() {}

	/** Fetches the directory listing or a resource embedded in the data file. **/
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
		final exclude = [Sys.programPath().withoutDirectory(), "web.config"];
		final pharPath: String = Syntax.staticCall("Phar", "running", false);
		if (pharPath.length > 0) exclude.push(pharPath.withoutDirectory());

		final entities = [];
		final entries = FileSystem.readDirectory(Sys.programPath().directory())
			.filter(entry -> entry.charAt(0) != "." && !exclude.contains(entry) && Global.is_readable(entry));

		for (entry in entries) {
			final type = FileSystem.isDirectory(entry) ? Directory : File;
			entities.push(new FileSystemEntity({
				modifiedAt: Date.fromTime(Global.filemtime(entry) * 1000),
				path: entry,
				size: type == File ? Global.filesize(entry) : -1,
				type: type
			}));
		}

		return Success(OutgoingResponse.blob(Json.stringify(entities), Mime.ApplicationJson));
	}
}
