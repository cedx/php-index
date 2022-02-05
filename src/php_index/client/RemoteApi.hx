package php_index.client;

import php_index.base.FileSystemEntity;
using tink.CoreApi;

/** Defines the interface of the remote API. **/
interface RemoteApi {

	/** Fetches the directory listing or a resource embedded in the data file. **/
	@:get("/")
	function index(query: {?listing: Bool}): List<FileSystemEntity>;
}
