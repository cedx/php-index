/**
 * Fetches a resource from the network, returning a promise which is fulfilled once the response is available.
 */
export default new Proxy(fetch, {

	/**
	 * A trap for a `fetch()` call.
	 * @param target The target callable object.
	 * @param thisArg The `this` argument for the call.
	 * @param args The list of arguments for the call.
	 * @returns The server response.
	 */
	async apply(target: typeof fetch, thisArg: unknown, args: [RequestInfo|URL, RequestInit|undefined]): Promise<Response> {
		const [input, init] = args;
		const request = new Request(input, init);
		if (!request.headers.has("Accept")) request.headers.set("Accept", "application/json");
		if (request.body && !request.headers.has("Content-Type")) request.headers.set("Content-Type", "application/json");

		const response = (await Reflect.apply(target, thisArg, [request])) as Response;
		if (!response.ok) throw Object.assign(new Error(`${response.status} ${response.statusText}`), {name: "HttpError"});
		return response;
	}
});
