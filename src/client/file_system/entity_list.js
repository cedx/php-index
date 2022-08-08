import {Entity, EntityType} from "./entity.js";
import {LoadingStatus} from "../data/loading_status.js";
import {Sort, SortOrder} from "../data/sort.js";

/**
 * Represents a list of file system entities.
 */
export class EntityList {

	/**
	 * The list items.
	 * @type {Entity[]}
	 */
	items = [];

	/**
	 * The current sort.
	 * @type {Sort}
	 */
	sort = new Sort;

	/**
	 * The loading status.
	 * @type {LoadingStatus}
	 */
	status = LoadingStatus.loading;

	/**
	 * Fetches the list items.
	 * @returns {Promise<void>} Resolves when the list items have been loaded.
	 */
	async fetch() {
		try {
			this.status = LoadingStatus.loading;
			const response = await fetch("?listing");
			if (!response.ok) this.status = LoadingStatus.failed;
			else {
				const items = /** @type {import("./entity.js").EntityOptions[]} */ (await response.json());
				this.items = items.map(item => new Entity(item));
				this.orderBy("path");
				this.status = LoadingStatus.done;
			}
		}
		catch {
			this.status = LoadingStatus.failed;
		}
	}

	/**
	 * Sorts the list items.
	 * @param {string} attribute The sort attribute.
	 * @param {SortOrder} [order] The sort order.
	 */
	orderBy(attribute, order) {
		if (!order) order = this.sort.get(attribute) == SortOrder.asc ? SortOrder.desc : SortOrder.asc;
		this.sort = new Sort([[attribute, order]]);
		this.items = this.items.sort((x, y) => {
			switch (attribute) {
				case "path": {
					const areDirectories = x.type == EntityType.directory && y.type == EntityType.directory;
					const areFiles = x.type == EntityType.file && y.type == EntityType.file;
					return areDirectories || areFiles
						? Reflect.get(x, attribute).localeCompare(Reflect.get(y, attribute))
						: x.type == EntityType.directory ? -1 : 1;
				}
				default:
					return this.sort.compare(x, y);
			}
		});
	}
}
