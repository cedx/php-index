import {msg, str} from "@lit/localize";
import {html, type TemplateResult} from "lit";
import {customElement, state} from "lit/decorators.js";
import {classMap} from "lit/directives/class-map.js";
import {choose} from "lit/directives/choose.js";
import {when} from "lit/directives/when.js";
import {Component} from "../component.js";
import {getLocale} from "../../locale.js";
import {Sort, SortOrder} from "../../data/sort.js";
import {FileSystemEntity, type FileSystemEntityOptions, FileSystemEntityType as FseType} from "../../io/file_system_entity.js";
import {LoadingState} from "../../net/loading_state.js";

/**
 * Displays the list of file system entities.
 */
@customElement("app-listing")
export class Listing extends Component {

	/**
	 * The byte units.
	 */
	private static readonly byteUnits = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"];

	/**
	 * The list of file system entities.
	 */
	@state() private entities: FileSystemEntity[] = [];

	/**
	 * The current filter.
	 */
	@state() private filter = "";

	/**
	 * The loading state.
	 */
	@state() private loading = LoadingState.loading;

	/**
	 * The current sort.
	 */
	@state() private sort = new Sort();

	/**
	 * The formatter used to format the dates.
	 */
	readonly #formatter = new Intl.DateTimeFormat(getLocale(), {dateStyle: "medium", timeStyle: "short"});

	/**
	 * The current path.
	 */
	readonly #path = location.pathname.length > 1 ? location.pathname.replace(/\/$/, "") : location.pathname;

	/**
	 * The view corresponding to the file listing.
	 */
	get listing(): TemplateResult {
		return html`
			<table class="table table-hover table-sticky table-striped mb-0">
				<thead>
					<tr>
						<th @click=${() => this.#orderBy("path")} scope="col">
							<span role="button">${msg("Name")} <i class="icon">${this.sort.getIcon("path")}</i></span>
						</th>
						<th @click=${() => this.#orderBy("size")} scope="col">
							<span role="button">${msg("Size")} <i class="icon">${this.sort.getIcon("size")}</i></span>
						</th>
						<th class="d-none d-sm-table-cell" @click=${() => this.#orderBy("modifiedAt")} scope="col">
							<span role="button">${msg("Last modified")} <i class="icon">${this.sort.getIcon("modifiedAt")}</i></span>
						</th>
					</tr>
				</thead>
				<tbody>
					${when(this.#path.length > 1, () => html`
						<tr>
							<td>
								<div class="text-truncate">
									<a href="..">
										<i class="icon fs-5 me-2 text-secondary">drive_folder_upload</i>${msg("Parent directory")}
									</a>
								</div>
							</td>
							<td></td>
							<td class="d-none d-sm-table-cell"></td>
						</tr>
					`)}
					${this.entities.map(entity => html`
						<tr>
							<td>
								<div class="text-truncate">
									<a href=${entity.type == FseType.file ? entity.path : `${entity.path}/`}>
										<i class="icon fs-5 me-2 ${classMap({"icon-fill": entity.type == FseType.directory, "text-secondary": entity.type == FseType.file, "text-warning": entity.type == FseType.directory})}">${entity.icon}</i>${entity.path}
									</a>
								</div>
							</td>
							<td>
								${when(entity.type == FseType.directory, () => html`&ndash;`, () => html`
									<div class="px-1" style="background: linear-gradient(90deg, rgb(22 88 152 / 15%) ${Math.round((entity.size / this.maxFileSize) * 100)}%, transparent 0)">
										${this.#formatBytes(entity.size)}
									</div>
								`)}

								${entity.type == FseType.directory ? html`&ndash;` : html``}
							</td>
							<td class="d-none d-sm-table-cell">
								<time datetime=${entity.modifiedAt.toISOString()}>${this.#formatter.format(entity.modifiedAt)}</time>
							</td>
						</tr>
					`)}
				</tbody>
			</table>
		`;
	}

	/**
	 * The size in bytes of the largest file in this listing.
	 */
	get maxFileSize(): number {
		return this.entities.reduce((size, entity) => entity.size > size ? entity.size : size, 0);
	}

	/**
	 * Method invoked when this component is connected.
	 */
	override connectedCallback(): void {
		super.connectedCallback();
		document.title = `${location.hostname} - ${this.#path}`;
		void this.#fetchEntities();
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
		return html`
			<article>
				<section class="border-bottom">
					<h4 class="mb-0">${msg(str`Index of ${this.#path}`)}</h4>
				</section>

				${choose(this.loading, [
					[LoadingState.loading, () => html`
						<section>
							<div class="alert alert-info mb-0">
								<div class="spinner-border spinner-border-sm me-1"></div> ${msg("Loading the directory entries...")}
							</div>
						</section>
					`],
					[LoadingState.failed, () => html`
						<section>
							<div class="alert alert-danger mb-0">
								<i class="icon icon-fill fw-bold me-1">error</i> ${msg("An error occurred while fetching the directory entries.")}
							</div>
						</section>
					`],
					[LoadingState.done, () => this.entities.length ? this.listing : html`
						<section>
							<div class="alert alert-warning mb-0">
								<i class="icon icon-fill fw-bold me-1">warning</i> ${msg("This directory is empty.")}
							</div>
						</section>
					`]
				])}
			</article>
		`;
	}

	/**
	 * Fetches the file system entities.
	 * @returns Resolves when the entities have been fetched.
	 */
	async #fetchEntities(): Promise<void> {
		this.loading = LoadingState.loading;

		try {
			const response = await fetch("?listing");
			if (!response.ok) this.loading = LoadingState.failed;
			else {
				const list = await response.json() as FileSystemEntityOptions[];
				this.entities = list.map(item => new FileSystemEntity(item));
				this.loading = LoadingState.done;
				this.#orderBy("path");
			}
		}
		catch {
			this.loading = LoadingState.failed;
		}
	}

	/**
	 * Formats the specified size.
	 * @returns The friendly formatted size.
	 */
	#formatBytes(bytes: number): string {
		let index = 0;
		while (bytes >= 1_024 && index < Listing.byteUnits.length) {
			bytes /= 1_024;
			index++;
		}

		return bytes.toLocaleString(getLocale(), {
			maximumFractionDigits: 2,
			style: "unit",
			unit: Listing.byteUnits[index]
		});
	}

	/**
	 * Sorts the list items.
	 * @param attribute The sort attribute.
	 * @param order The sort order.
	 */
	#orderBy(attribute: string, order?: SortOrder): void {
		order ??= (this.sort.get(attribute) ?? SortOrder.desc) == SortOrder.asc ? SortOrder.desc : SortOrder.asc;
		this.sort = new Sort().append(attribute, order);
		this.entities = this.entities.sort((x, y) => {
			switch (attribute) {
				case "path": {
					const value = x.type == y.type ? x.path.localeCompare(y.path, getLocale()) : x.type == FseType.directory ? -1 : 1;
					return order == SortOrder.asc ? value : -value;
				}
				default:
					return this.sort.compare(x, y);
			}
		});
	}

	/**
	 * Resets the form.
	 * @param event The dispatched event.
	 */
	#resetForm(event: Event): void {
		event.preventDefault();
	}

	/**
	 * Submits the form.
	 * @param event The dispatched event.
	 */
	#submitForm(event: Event): void {
		event.preventDefault();
	}
}
