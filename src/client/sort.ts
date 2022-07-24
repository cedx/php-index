/**
 * Represents an attribute/order pair of a sort.
 */
export type SortEntry = [string, SortOrder];

/**
 * Specifies the order of a sort parameter.
 */
export enum SortOrder {

	/** The sort is ascending. */
	asc = "ASC",

	/** The sort is descending. */
	desc = "DESC"
}

/**
 * Represents information relevant to the sorting of data items.
 */
export class Sort {

	/**
	 * The list of attribute/order pairs.
	 */
	#attributes: SortEntry[];

	/**
	 * Creates new sort.
	 * @param attributes The list of attributes to be sorted.
	 */
	constructor(attributes?: SortEntry[]) {
		this.#attributes = attributes ?? [];
	}

	/**
	 * The number of attributes.
	 */
	get length(): number {
		return this.#attributes.length;
	}

	/**
	 * Creates a new sort from the specified string.
	 * @param value A string representing a sort.
	 * @returns The sort corresponding to the specified string.
	 */
	static parse(value: string): Sort {
		return new this((value ? value.split(",") : []).map(item => {
			const order = item.startsWith("-") ? SortOrder.desc : SortOrder.asc;
			return [order == SortOrder.asc ? item : item.slice(1), order];
		}));
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this sort.
	 * @returns An iterator over the attribute/order pairs.
	 */
	*[Symbol.iterator](): IterableIterator<SortEntry> {
		for (const item of this.#attributes) yield item;
	}

	/**
	 * Appends the specified attribute to this sort.
	 * @param attribute The attribute name.
	 * @param order The sort order.
	 * @returns This instance.
	 */
	append(attribute: string, order: SortOrder): this {
		this.remove(attribute);
		this.#attributes.push([attribute, order]);
		return this;
	}

	/**
	 * Gets the attribute/order pair at the specified index.
	 * @param index The position in this sort.
	 * @returns The attribute/order pair at the specified index, or `null` if it doesn't exist.
	 */
	at(index: number): SortEntry|null {
		return this.#attributes[index] ?? null;
	}

	/**
	 * Compares the specified objects, according to the current sort attributes.
	 * @param x The first object to compare.
	 * @param y The second object to compare.
	 * @returns A value indicating the relationship between the two objects.
	 */
	compare(x: object, y: object): number {
		for (const [attribute, order] of this.#attributes) {
			const attributeOfX = Reflect.get(x, attribute); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
			const attributeOfY = Reflect.get(y, attribute); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

			let value = 0;
			if (typeof attributeOfX == "string" && typeof attributeOfY == "string") value = attributeOfX.localeCompare(attributeOfY);
			else value = attributeOfX == attributeOfY ? 0 : (attributeOfX > attributeOfY ? 1 : -1);
			if (value) return order == SortOrder.asc ? value : -value;
		}

		return 0;
	}

	/**
	 * Gets the order associated with the specified attribute.
	 * @param attribute The attribute name.
	 * @returns The order associated with the specified attribute, or `null` if the attribute doesn't exist.
	 */
	get(attribute: string): SortOrder|null {
		for (const [key, order] of this.#attributes) if (key == attribute) return order;
		return null;
	}

	/**
	 * Gets the name of the icon corresponding to the specified attribute.
	 * @param attribute The attribute name.
	 * @returns The icon corresponding to the specified attribute.
	 */
	getIcon(attribute: string): string {
		switch (this.get(attribute)) {
			case SortOrder.asc: return "sort-down-alt";
			case SortOrder.desc: return "sort-up";
			default: return "filter";
		}
	}

	/**
	 * Returns a value indicating whether the specified attribute exists in this sort.
	 * @param attribute The attribute name.
	 * @returns `true` if the specified attribute exists in this sort, otherwise `false`.
	 */
	has(attribute: string): boolean {
		return this.#attributes.some(([key]) => key == attribute);
	}

	/**
	 * Gets the index of the specified attribute in the underlying list.
	 * @param attribute The attribute name.
	 * @returns The index of the specified attribute, or `-1` if the attribute is not found.
	 */
	indexOf(attribute: string): number {
		for (const [index, [key]] of this.#attributes.entries()) if (key == attribute) return index;
		return -1;
	}

	/**
	 * Prepends the specified attribute to this sort.
	 * @param attribute The attribute name.
	 * @param order The sort order.
	 * @returns This instance.
	 */
	prepend(attribute: string, order: SortOrder): this {
		this.remove(attribute);
		this.#attributes.unshift([attribute, order]);
		return this;
	}

	/**
	 * Removes the specified attribute from this sort.
	 * @param attribute The attribute name.
	 */
	remove(attribute: string): void {
		this.#attributes = this.#attributes.filter(([key]) => key != attribute);
	}

	/**
	 * Sets the order of the specified attribute.
	 * @param attribute The attribute name.
	 * @param order The sort order.
	 * @returns this This instance.
	 */
	set(attribute: string, order: SortOrder): this {
		for (const [index, [key]] of this.#attributes.entries()) if (key == attribute) {
			this.#attributes[index] = [key, order];
			return this;
		}

		return this.append(attribute, order);
	}

	/**
	 * Returns a string representation of this object.
	 * @returns The string representation of this object.
	 */
	toString(): string {
		return this.#attributes.map(item => `${item[1] == SortOrder.asc ? "" : "-"}${item[0]}`).join(",");
	}
}
