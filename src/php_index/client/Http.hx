package php_index.client;

import haxe.io.Mime.ApplicationJson;
import js.html.URLSearchParams;
import tink.Url;
import tink.http.Client;
import tink.http.Fetch.CompleteResponse;
import tink.http.Header;
import tink.http.Method;

#if tink_json
import tink.Json;
#else
import haxe.Json;
#end

#if tink_multipart
import haxe.extern.EitherType;
import js.html.File;
import js.html.FormData;
import tink.multipart.Multipart;
#end

using tink.CoreApi;
using tink.io.Source;

/** Performs HTTP requests. **/
class Http {

	/** The base URL of the remote API endpoint. **/
	final baseUrl: Url;

	/** Creates a new HTTP client. **/
	public function new(baseUrl: Url, ?options: HttpOptions) {
		this.baseUrl = baseUrl;
		if (options != null) {
			if (options.onFetch != null) onFetch = options.onFetch;
			if (options.onFetched != null) onFetched = options.onFetched;
		}
	}

	/** Performs a `DELETE` request. **/
	public inline function delete(url: String, ?headers: Array<HeaderField>) return fetch(DELETE, url, headers);

	/** Performs a `GET` request. **/
	public inline function get(url: String, ?headers: Array<HeaderField>) return fetch(GET, url, headers);

	/** Method invoked before the HTTP request is made. **/
	public dynamic function onFetch() {}

	/** Method invoked after the HTTP response has been received. **/
	public dynamic function onFetched() {}

	/** Performs a `PATCH` request. **/
	public inline function patch(url: String, ?body: Any, ?headers: Array<HeaderField>) return fetch(PATCH, url, body, headers);

	/** Performs a `POST` request. **/
	public inline function post(url: String, ?body: Any, ?headers: Array<HeaderField>) return fetch(POST, url, body, headers);

	/** Performs a `PUT` request. **/
	public inline function put(url: String, ?body: Any, ?headers: Array<HeaderField>) return fetch(PUT, url, body, headers);

	/** Fetches the resource corresponding to the specified request. **/
	function fetch(method: Method, url: String, ?body: Any, ?headers: Array<HeaderField>): Promise<CompleteResponse> {
		var header = new Header(headers);
		if (header.get(ACCEPT).length == 0) header = header.concat([new HeaderField(ACCEPT, ApplicationJson)]);

		var source: IdealSource;
		switch body {
			case null: source = Source.EMPTY;
			case data if (Std.isOfType(data, URLSearchParams)):
				header = header.concat([new HeaderField(CONTENT_TYPE, "application/x-www-form-urlencoded")]);
				source = Std.string(data);
			#if tink_multipart
			case data if (Std.isOfType(data, FormData)):
				header = header.concat([new HeaderField(CONTENT_TYPE, "multipart/form-data")]);
				source = serializeForm(data);
			#end
			case data:
				header = header.concat([new HeaderField(CONTENT_TYPE, ApplicationJson)]);
				source = Std.isOfType(data, String) ? (data: String) : Json.stringify(data);
		}

		onFetch();
		final options = {body: source, headers: [for (item in header) item], method: method};
		return Client.fetch(baseUrl.resolve(url), options).all().map(outcome -> {
			onFetched();
			outcome;
		});
	}

	#if tink_multipart
	/** Serializes the specified form data. **/
	function serializeForm(form: FormData) {
		final builder = new Multipart();
		form.forEach((value: EitherType<String, File>, name: String) -> switch Std.downcast(value, File) {
			case null: builder.addValue(name, value);
			case file: builder.addFile(name, file.name, file.type, Source.ofJsFile(name, file).idealize(_ -> Source.EMPTY));
		});

		return builder.toIdealSource();
	}
	#end
}

/** Defines the options of an `Http` instance. **/
typedef HttpOptions = {

	/** Method invoked before the HTTP request is made. **/
	var ?onFetch: () -> Void;

	/** Method invoked after the HTTP response has been received. **/
	var ?onFetched: () -> Void;
}
