/**
 * Represents an attribute/order pair of a sort.
 * @typedef {[string, SortOrder]} SortEntry
 */

/**
 * Specifies the order of a sort parameter.
 * @enum {string}
 */
export const SortOrder = Object.freeze({

	/** The sort is ascending. */
	asc: "ASC",

	/** The sort is descending. */
	desc: "DESC"
});

/**
 * Represents information relevant to the sorting of data items.
 */
export class Sort {

	/**
	 * The list of attribute/order pairs.
	 * @type {SortEntry[]}
	 */
	#attributes;

	/**
	 * Creates new sort.
	 * @param {SortEntry[]} [attributes] The list of attributes to be sorted.
	 */
	constructor(attributes = []) {
		this.#attributes = attributes;
	}

	/**
	 * The number of attributes.
	 * @type {number}
	 */
	get length() {
		return this.#attributes.length;
	}

	/**
	 * Creates a new sort from the specified string.
	 * @param {string} value A string representing a sort.
	 * @returns {Sort} The sort corresponding to the specified string.
	 */
	static parse(value) {
		return new this((value ? value.split(",") : []).map(item => {
			const order = item.startsWith("-") ? SortOrder.desc : SortOrder.asc;
			return [order == SortOrder.asc ? item : item.slice(1), order];
		}));
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this sort.
	 * @returns {IterableIterator<SortEntry>} An iterator over the attribute/order pairs.
	 */
	*[Symbol.iterator]() {
		for (const item of this.#attributes) yield item;
	}

	/**
	 * Appends the specified attribute to this sort.
	 * @param {string} attribute The attribute name.
	 * @param {SortOrder} order The sort order.
	 * @returns {this} This instance.
	 */
	append(attribute, order) {
		this.remove(attribute);
		this.#attributes.push([attribute, order]);
		return this;
	}

	/**
	 * Gets the attribute/order pair at the specified index.
	 * @param {number} index The position in this sort.
	 * @returns {SortEntry|null} The attribute/order pair at the specified index, or `null` if it doesn't exist.
	 */
	at(index) {
		return this.#attributes[index] ?? null;
	}

	/**
	 * Compares the specified objects, according to the current sort attributes.
	 * @param {object} x The first object to compare.
	 * @param {object} y The second object to compare.
	 * @returns {number} A value indicating the relationship between the two objects.
	 */
	compare(x, y) {
		for (const [attribute, order] of this.#attributes) {
			const xAttr = Reflect.get(x, attribute);
			const yAttr = Reflect.get(y, attribute);
			const value = xAttr > yAttr ? 1 : (xAttr < yAttr ? -1 : 0);
			if (value) return order == SortOrder.asc ? value : -value;
		}

		return 0;
	}

	/**
	 * Gets the order associated with the specified attribute.
	 * @param {string} attribute The attribute name.
	 * @returns {SortOrder|null} The order associated with the specified attribute, or `null` if the attribute doesn't exist.
	 */
	get(attribute) {
		for (const [key, order] of this.#attributes) if (key == attribute) return order;
		return null;
	}

	/**
	 * Gets the name of the icon corresponding to the specified attribute.
	 * @param {string} attribute The attribute name.
	 * @returns {string} The icon corresponding to the specified attribute.
	 */
	getIcon(attribute) {
		switch (this.get(attribute)) {
			case SortOrder.asc: return "sort-down-alt";
			case SortOrder.desc: return "sort-up";
			default: return "filter";
		}
	}

	/**
	 * Returns a value indicating whether the specified attribute exists in this sort.
	 * @param {string} attribute The attribute name.
	 * @returns {boolean} `true` if the specified attribute exists in this sort, otherwise `false`.
	 */
	has(attribute) {
		return this.#attributes.some(([key]) => key == attribute);
	}

	/**
	 * Gets the index of the specified attribute in the underlying list.
	 * @param {string} attribute The attribute name.
	 * @returns {number} The index of the specified attribute, or `-1` if the attribute is not found.
	 */
	indexOf(attribute) {
		for (const [index, [key]] of this.#attributes.entries()) if (key == attribute) return index;
		return -1;
	}

	/**
	 * Prepends the specified attribute to this sort.
	 * @param {string} attribute The attribute name.
	 * @param {SortOrder} order The sort order.
	 * @returns {this} This instance.
	 */
	prepend(attribute, order) {
		this.remove(attribute);
		this.#attributes.unshift([attribute, order]);
		return this;
	}

	/**
	 * Removes the specified attribute from this sort.
	 * @param {string} attribute The attribute name.
	 */
	remove(attribute) {
		this.#attributes = this.#attributes.filter(([key]) => key != attribute);
	}

	/**
	 * Sets the order of the specified attribute.
	 * @param {string} attribute The attribute name.
	 * @param {SortOrder} order The sort order.
	 * @returns {this} This instance.
	 */
	set(attribute, order) {
		for (const [index, [key]] of this.#attributes.entries()) if (key == attribute) {
			this.#attributes[index] = [key, order];
			return this;
		}

		return this.append(attribute, order);
	}

	/**
	 * Returns a string representation of this object.
	 * @returns {string} The string representation of this object.
	 */
	toString() {
		return this.#attributes.map(item => `${item[1] == SortOrder.asc ? "" : "-"}${item[0]}`).join(",");
	}
}