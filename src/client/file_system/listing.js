import {msg, str} from "@lit/localize";
import {html} from "lit";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";
import {getLocale} from "../locale.js";
import {EntityList} from "./entity_list.js";
import {EntityType} from "./entity.js";

/**
 * Displays the list of file system entities.
 */
export class Listing extends Component {

	/**
	 * The reactive properties.
	 * @type {import("lit").PropertyDeclarations}
	 */
	static properties = {
		entities: {state: true}
	};

	/**
	 * The byte units.
	 * @type {string[]}
	 * @readonly
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
	 * Creates a new entity list view.
	 */
	constructor() {
		super();

		/**
		 * The list of file system entities.
		 * @type {EntityList}
		 * @private
		 */
		this.entities = new EntityList;
	}

	/**
	 * Method invoked when this component is mounted.
	 */
	connectedCallback() {
		super.connectedCallback();
		document.title = `${location.hostname} - ${this.#path}`;
		this.entities.fetch();
	}

	/**
	 * Renders this component.
	 * @returns {import("lit").TemplateResult} The view template.
	 */
	render() {
		return html`
			<article id="listing">
				<section>
					<h2>${msg(str`Index of ${this.#path}`)}</h2>
				</section>

				<table class="table table-hover table-sticky table-striped">
					<thead>
						<tr>
							<th @onclick=${() => this.entities.orderBy("path")} scope="col">
								<span role="button">${msg("Name")} <i class="bi bi-${this.entities.sort.getIcon("path")}"></i></span>
							</th>
							<th class="text-end" @onclick=${() => this.entities.orderBy("size")} scope="col">
								<span role="button">${msg("Size")} <i class="bi bi-${this.entities.sort.getIcon("size")}"></i></span>
							</th>
							<th class="d-none d-sm-table-cell text-end" @onclick=${() => this.entities.orderBy("modifiedAt")} scope="col">
								<span role="button">${msg("Last modified")} <i class="bi bi-${this.entities.sort.getIcon("modifiedAt")}"></i></span>
							</th>
						</tr>
					</thead>
					<tbody>
						${when(this.#path.length > 1, () => html`
							<tr>
								<td colspan="2">
									<div class="text-truncate">
										<a href="..">
											<i class="bi bi-arrow-90deg-up me-1"></i> ${msg("Parent directory")}
										</a>
									</div>
								</td>
								<td class="d-none d-sm-table-cell"></td>
							</tr>
						`)}
						${this.entities.items.map(entity => html`
							<tr>
								<td>
									<div class="text-truncate">
										<a href=${entity.type == EntityType.file ? entity.path : `${entity.path}/`}>
											<i class="bi bi-${entity.icon} me-1"></i> ${entity.path}
										</a>
									</div>
								</td>
								<td class="text-end">
									${entity.type == EntityType.directory ? "&ndash;" : this.#formatBytes(entity.size)}
								</td>
								<td class="d-none d-sm-table-cell text-end">
									<time datetime=${entity.modifiedAt.toISOString()}>${this.#dateFormatter.format(entity.modifiedAt)}</time>
								</td>
							</tr>
						`)}
					</tbody>
				</table>
			</article>
		`;
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
}

// Register the component.
customElements.define("app-entitylist", Listing);
