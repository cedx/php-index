package php_index.client;

import php_index.base.io.FileSystemEntity;

/** Defines the interface of the remote API. **/
interface RemoteApi {

	/** Fetches the directory listing. **/
	@:get("/")
	function index(query: {listing: Bool}): Array<FileSystemEntity>;
}
