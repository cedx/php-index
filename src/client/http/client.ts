/**
 * Performs HTTP requests.
 */
export class HttpClient {

	/**
	 * The base URL of the remote service.
	 */
	readonly baseUrl: URL;

	/**
	 * Creates a new HTTP client.
	 * @param baseUrl The base URL of the remote service.
	 */
	constructor(baseUrl: string = document.baseURI) {
		this.baseUrl = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
	}

	/**
	 * Performs a DELETE request.
	 * @param url The URL of the resource to fetch.
	 * @param options The request options.
	 * @returns The server response.
	 */
	delete(url: URL|string, options?: RequestInit): Promise<Response> {
		return this.#fetch("DELETE", url, null, options);
	}

	/**
	 * Performs a GET request.
	 * @param url The URL of the resource to fetch.
	 * @param options The request options.
	 * @returns The server response.
	 */
	get(url: URL|string, options?: RequestInit): Promise<Response> {
		return this.#fetch("GET", url, null, options);
	}

	/**
	 * Performs a PATCH request.
	 * @param url The URL of the resource to fetch.
	 * @param body The request body.
	 * @param options The request options.
	 * @returns The server response.
	 */
	patch(url: URL|string, body: unknown, options?: RequestInit): Promise<Response> {
		return this.#fetch("PATCH", url, body, options);
	}

	/**
	 * Performs a POST request.
	 * @param url The URL of the resource to fetch.
	 * @param body The request body.
	 * @param options The request options.
	 * @returns The server response.
	 */
	post(url: URL|string, body: unknown, options?: RequestInit): Promise<Response> {
		return this.#fetch("POST", url, body, options);
	}

	/**
	 * Performs a PUT request.
	 * @param url The URL of the resource to fetch.
	 * @param body The request body.
	 * @param options The request options.
	 * @returns The server response.
	 */
	put(url: URL|string, body: unknown, options?: RequestInit): Promise<Response> {
		return this.#fetch("PUT", url, body, options);
	}

	/**
	 * Performs a custom HTTP request.
	 * @param method The HTTP method.
	 * @param url The URL of the resource to fetch.
	 * @param body The request body.
	 * @param options The request options.
	 * @returns The server response.
	 */
	async #fetch(method: string, url: URL|string, body: unknown, options: RequestInit = {}): Promise<Response> {
		const headers = new Headers(options.headers);
		if (!headers.has("accept")) headers.set("accept", "application/json");

		if (body) {
			const [mediaType] = (headers.get("content-type") ?? "").split(";");
			if (!mediaType || mediaType == "text/plain") headers.set("content-type", "application/json");

			const ok = typeof body == "string" || body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams;
			if (!ok) body = JSON.stringify(body);
		}

		const response = await fetch(new URL(url, this.baseUrl), {
			...options,
			method,
			headers,
			body: body as BodyInit|null
		});

		if (!response.ok) throw Object.assign(new Error(`${response.status} ${response.statusText}`), {name: "HttpError", response});
		return response;
	}
}
