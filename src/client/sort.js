/**
 * Specifies the direction of a sort parameter.
 * @enum {string}
 */
export const SortDirection = Object.freeze({

	/** The sort is ascending. */
	asc: "",

	/** The sort is descending. */
	desc: "-"
});

/**
 * Represents information relevant to the sorting of data items.
 * @extends {Map<string, string>}
 */
export class Sort extends Map {

	/**
	 * Creates a new sort from the specified string.
	 * @param {string} value A string representation of a sort.
	 * @returns {Sort} The sort corresponding to the specified string.
	 */
	static fromString(value) {
		return new this(!value ? [] : value.split(",").map(item => {
			const direction = item.charAt(0) == SortDirection.desc ? SortDirection.desc : SortDirection.asc;
			return [direction == SortDirection.asc ? item : item.slice(1), direction];
		}));
	}

	/**
	 * Gets the icon corresponding to the specified attribute.
	 * @param {string} attribute The sort attribute.
	 * @returns {string} The name of the icon corresponding
	 */
	getIcon(attribute) {
		switch (this.get(attribute)) {
			case SortDirection.asc: return "sort-down-alt";
			case SortDirection.desc: return "sort-up";
			default: return "filter";
		}
	}

	/**
	 * Returns a string representation of this object.
	 * @returns {string} The string representation of this object.
	 */
	toString() {
		return [...this.entries()].map(([attribute, direction]) => `${direction}${attribute}`).join(",");
	}
}
