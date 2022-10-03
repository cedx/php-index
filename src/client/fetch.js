/**
 * Fetches a resource from the network, returning a promise which is fulfilled once the response is available.
 * @type {typeof fetch}
 */
export default new Proxy(fetch, {

	/**
	 * A trap for a `fetch()` call.
	 * @param {typeof fetch} target The target callable object.
	 * @param {unknown} thisArg The `this` argument for the call.
	 * @param {[RequestInfo|URL, RequestInit|undefined]} args The list of arguments for the call.
	 * @returns {Promise<Response>} The server response.
	 */
	async apply(target, thisArg, args) {
		const request = new Request(...args);
		if (!request.headers.has("Accept")) request.headers.set("Accept", "application/json");

		if (["PATCH", "POST", "PUT"].includes(request.method)) {
			const [mimeType] = (request.headers.get("Content-Type") ?? "").split(";");
			if (!mimeType || mimeType == "text/plain") request.headers.set("Content-Type", "application/json");
		}

		const response = /** @type {Response} */ (await Reflect.apply(target, thisArg, [request]));
		if (!response.ok) throw Object.assign(new Error, {name: "HttpError", request, response});
		return response;
	}
});
