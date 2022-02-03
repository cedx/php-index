package php_index.base;

import tink.http.Response.OutgoingResponse;
using tink.CoreApi;

/** Defines the interface of the remote API. **/
interface RemoteApi {

	/** Fetches the directory listing or a resource embedded in the data file. **/
	@:get("/")
	function index(query: {?file: String, ?listing: Bool}): Outcome<OutgoingResponse, Error>;
}
