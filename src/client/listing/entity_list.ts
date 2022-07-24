import {FileSystemEntity, FileSystemEntityOptions, FileSystemEntityType} from "./file_system_entity.js";
import {Sort, SortOrder} from "../sort.js";

/**
 * Defines the status of a load.
 */
export enum LoadingStatus {

	/** The loading is in progress. */
	loading,

	/** The loading has failed. */
	failed,

	/** The loading is done. */
	done
}

/**
 * Represents a list of file system entities.
 */
export class EntityList {

	/**
	 * The list items.
	 */
	items: FileSystemEntity[] = [];

	/**
	 * The current sort.
	 */
	sort = new Sort;

	/**
	 * The loading status.
	 */
	status = LoadingStatus.loading;

	/**
	 * Fetches the list items.
	 * @returns Resolves when the list items have been loaded.
	 */
	async fetch(): Promise<void> {
		this.status = LoadingStatus.loading;
		const response = await fetch("?listing");
		if (!response.ok) this.status = LoadingStatus.failed;
		else {
			const items = JSON.parse(await response.json()) as FileSystemEntityOptions[]; // TODO try catch
			this.items = items.map(item => new FileSystemEntity(item));
			this.status = LoadingStatus.done;
			this.orderBy("path");
		}
	}

	/**
	 * Sorts the list items.
	 */
	orderBy(attribute: string, direction?: SortOrder) {
		if (!direction) direction = this.sort.has(attribute) && this.sort.get(attribute) == SortOrder.asc ? SortOrder.desc : SortOrder.asc;
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
