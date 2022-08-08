import {FileSystemEntity, FileSystemEntityType} from "./file_system_entity.js";
import {Sort, SortOrder} from "../sort.js";

/**
 * Defines the status of a loading.
 * @enum {number}
 */
export const LoadingStatus = Object.freeze({

	/** The loading is in progress. */
	loading: 0,

	/** The loading has failed. */
	failed: 1,

	/** The loading is done. */
	done: 2
});

/**
 * Represents a list of file system entities.
 */
export class EntityList {

	/**
	 * The list items.
	 * @type {FileSystemEntity[]}
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
		this.status = LoadingStatus.loading;
		const response = await fetch("?listing");
		if (!response.ok) this.status = LoadingStatus.failed;
		else {
			const items = /** @type {import("./file_system_entity.js").FileSystemEntityOptions[]} */ (await response.json()); // TODO try catch
			this.items = items.map(item => new FileSystemEntity(item));
			this.status = LoadingStatus.done;
			this.orderBy("path");
		}
	}

	/**
	 * Sorts the list items.
	 * @param {string} attribute TODO
	 * @param {SortOrder} [direction] TODO
	 */
	orderBy(attribute, direction) {
		if (!direction) direction = this.sort.get(attribute) == SortOrder.asc ? SortOrder.desc : SortOrder.asc;
		this.sort = new Sort([[attribute, direction]]);
		this.items = this.items.sort((x, y) => {
			switch (attribute) {
				case "path":
					const areDirectories = x.type == FileSystemEntityType.directory && y.type == FileSystemEntityType.directory;
					const areFiles = x.type == FileSystemEntityType.file && y.type == FileSystemEntityType.file;
					return areDirectories || areFiles
						? Reflect.get(x, attribute).localeCompare(Reflect.get(y, attribute))
						: x.type == FileSystemEntityType.directory ? -1 : 1;
				default:
					return this.sort.compare(x, y);
			}
		});
	}
}
