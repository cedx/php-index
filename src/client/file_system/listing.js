import {msg, str} from "@lit/localize";
import {html} from "lit";
import {classMap} from "lit/directives/class-map.js";
import {choose} from "lit/directives/choose.js";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";
import {LoadingState} from "../data/loading_state.js";
import {Sort, SortOrder} from "../data/sort.js";
import {getLocale} from "../locale.js";
import {Entity, EntityType} from "./entity.js";

/**
 * Displays the list of file system entities.
 */
export class Listing extends Component {

	/**
	 * The reactive properties.
	 * @type {import("lit").PropertyDeclarations}
	 */
	static properties = {
		_entities: {state: true},
		_loading: {state: true},
		_sort: {state: true}
	};

	/**
	 * The byte units.
	 * @type {string[]}
	 */
	static #byteUnits = ["", "K", "M", "G", "T", "P", "E"];

	/**
	 * The formatter used to format the file sizes.
	 * @type {Intl.NumberFormat}
	 */
	#byteFormatter = new Intl.NumberFormat(getLocale(), {maximumFractionDigits: 2});

	/**
	 * The formatter used to format the modification dates.
	 * @type {Intl.DateTimeFormat}
	 */
	#dateFormatter = new Intl.DateTimeFormat(getLocale(), {dateStyle: "medium", timeStyle: "short"});

	/**
	 * The current path.
	 * @type {string}
	 */
	#path = location.pathname.length > 1 ? location.pathname.slice(0, -1) : location.pathname;

	/**
	 * Creates a new listing.
	 */
	constructor() {
		super();

		/**
		 * The list of file system entities.
		 * @type {Entity[]}
		 * @private
		 */
		this._entities = [];

		/**
		 * The loading status.
		 * @type {LoadingState}
		 * @private
		 */
		this._loading = LoadingState.loading;

		/**
		 * The current sort.
		 * @type {Sort}
		 * @private
		 */
		this._sort = new Sort;
	}

	/**
	 * The view corresponding to the file listing.
	 * @type {import("lit").TemplateResult}
	 */
	get listing() {
		return html`
			<table class="table table-hover table-sticky table-striped mb-0">
				<thead>
					<tr>
						<th @click=${() => this.#orderBy("path")} scope="col">
							<span role="button">${msg("Name")} <i class="bi bi-${this._sort.getIcon("path")}"></i></span>
						</th>
						<th class="text-end" @click=${() => this.#orderBy("size")} scope="col">
							<span role="button">${msg("Size")} <i class="bi bi-${this._sort.getIcon("size")}"></i></span>
						</th>
						<th class="d-none d-sm-table-cell text-end" @click=${() => this.#orderBy("modifiedAt")} scope="col">
							<span role="button">${msg("Last modified")} <i class="bi bi-${this._sort.getIcon("modifiedAt")}"></i></span>
						</th>
					</tr>
				</thead>
				<tbody>
					${when(this.#path.length > 1, () => html`
						<tr>
							<td colspan="2">
								<div class="text-truncate">
									<a href="..">
										<i class="bi bi-arrow-90deg-up me-2"></i>${msg("Parent directory")}
									</a>
								</div>
							</td>
							<td class="d-none d-sm-table-cell"></td>
						</tr>
					`)}
					${this._entities.map(entity => html`
						<tr>
							<td>
								<div class="text-truncate">
									<a href=${entity.type == EntityType.file ? entity.path : `${entity.path}/`}>
										<i class="bi bi-${entity.icon} me-2"></i>${entity.path}
									</a>
								</div>
							</td>
							<td class="text-end">
								${entity.type == EntityType.directory ? html`&ndash;` : this.#formatBytes(entity.size)}
							</td>
							<td class="d-none d-sm-table-cell text-end">
								<time datetime=${entity.modifiedAt.toISOString()}>${this.#dateFormatter.format(entity.modifiedAt)}</time>
							</td>
						</tr>
					`)}
				</tbody>
			</table>
		`;
	}

	/**
	 * Method invoked when this component is mounted.
	 */
	connectedCallback() {
		super.connectedCallback();
		document.title = `${location.hostname} - ${this.#path}`;
		this.#fetchEntities();
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 */
	render() {
		return html`
			<article id="listing">
				<section class=${classMap({"border-bottom": this._entities.length})}>
					<h3 class="mb-0">${msg(str`Index of ${this.#path}`)}</h3>
				</section>

				${choose(this._loading, [
					[LoadingState.loading, () => html`
						<section class="pt-0">
							<div class="alert alert-info d-flex align-items-center mb-0">
								<div class="spinner-border spinner-border-sm"></div>
								<div class="ms-2">${msg("Loading the directory entries...")}</div>
							</div>
						</section>
					`],
					[LoadingState.failed, () => html`
						<section class="pt-0">
							<div class="alert alert-danger d-flex align-items-center mb-0">
								<i class="bi bi-exclamation-circle-fill"></i>
								<div class="ms-2">${msg("An error occurred while fetching the directory entries.")}</div>
							</div>
						</section>
					`],
					[LoadingState.done, () => this._entities.length ? this.listing : html`
						<section class="pt-0">
							<div class="alert alert-warning d-flex align-items-center mb-0">
								<i class="bi bi-exclamation-triangle-fill"></i>
								<div class="ms-2">${msg("This directory is empty.")}</div>
							</div>
						</section>
					`]
				])}
			</article>
		`;
	}

	/**
	 * Fetches the list items.
	 * @returns {Promise<void>} Resolves when the list items have been fetched.
	 */
	async #fetchEntities() {
		this._loading = LoadingState.loading;

		try {
			const response = await fetch("?listing");
			const items = /** @type {import("./entity.js").EntityOptions[]} */ (await response.json());
			this._entities = items.map(item => new Entity(item));
			this.#orderBy("path");
			this._loading = LoadingState.done;
		}
		catch {
			this._loading = LoadingState.failed;
		}
	}

	/**
	 * Formats the specified size.
	 * @param {number} bytes The size being formatted.
	 * @returns {string} The formatted sized.
	 */
	#formatBytes(bytes) {
		let index = 0;
		while (bytes > 1024 && index < Listing.#byteUnits.length) {
			bytes /= 1024;
			index++;
		}

		return this.#byteFormatter.format(bytes) + Listing.#byteUnits[index];
	}

	/**
	 * Sorts the list items.
	 * @param {string} attribute The sort attribute.
	 * @param {SortOrder} [order] The sort order.
	 */
	#orderBy(attribute, order) {
		order ??= this._sort.get(attribute) == SortOrder.asc ? SortOrder.desc : SortOrder.asc;
		this._sort = new Sort([[attribute, order]]);
		this._entities.sort((x, y) => {
			switch (attribute) {
				case "path":
					const value = x.type == y.type ? x.path.localeCompare(y.path) : x.type == EntityType.directory ? -1 : 1;
					return order == SortOrder.asc ? value : -value;
				default:
					return this._sort.compare(x, y);
			}
		});
	}
}

// Register the component.
customElements.define("app-listing", Listing);
