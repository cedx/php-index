package php_index.base.data;

import coconut.data.List;
using Lambda;
using StringTools;

#if tink_sql
import tink.sql.OrderBy.Order;
#end

/** Represents information relevant to the sorting of data items. **/
@:forward(iterator, keyValueIterator, length, toArray)
abstract Sort(List<Named<SortOrder>>) from List<Named<SortOrder>> to List<Named<SortOrder>> {

	/** Creates a new sort. **/
	public function new(?attributes: List<Named<SortOrder>>) this = attributes != null ? attributes : new List();

	/** Appends the specified attribute to this sort. **/
	public function append(attribute: String, order: SortOrder): Sort
		return this.filter(item -> item.name != attribute).append(new Named(attribute, order));

	/** Gets the attribute/order pair at the specified index. **/
	public inline function at(index: Int) return this.get(index);

	/** Compares the specified objects, according to the current sort attributes. **/
	public function compare(x: Any, y: Any) {
		for (item in this) {
			final value = Reflect.compare(Reflect.getProperty(x, item.name), Reflect.getProperty(y, item.name));
			if (value != 0) return item.value == Asc ? value : -value;
		}

		return 0;
	}

	/** Returns a value indicating whether the specified attribute exists in this sort. **/
	public function exists(attribute: String) return this.exists(item -> item.name == attribute);

	/** Gets the order associated with the specified attribute. **/
	@:arrayAccess public function get(attribute: String)
		return this.first(item -> item.name == attribute).map(item -> item.value);

	/** Gets the name of the icon corresponding to the specified attribute. **/
	public function getIcon(attribute: String) return switch get(attribute).orNull() {
		case Asc: "sort-down-alt";
		case Desc: "sort-up";
		default: "filter";
	}

	/** Gets the index of the specified attribute in the underlying list, or `-1` if the attribute is not found. **/
	public function indexOf(attribute: String) return Lambda.findIndex(this, item -> item.name == attribute);

	/** Creates a new sort from the specified string. **/
	@:from static inline function ofString(value: String) return Sort.parse(value);

	/** Creates a new sort from the specified string. **/
	public static function parse(value: String)
		return new Sort(value == null || value.length == 0 ? null : [for (item in value.split(",")) {
			final order = item.startsWith("-") ? Desc : Asc;
			final attribute = order == Asc ? item : item.substring(1);
			new Named(attribute, order);
		}]);

	/** Prepends the specified attribute to this sort. **/
	public function prepend(attribute: String, order: SortOrder): Sort
		return this.filter(item -> item.name != attribute).prepend(new Named(attribute, order));

	/** Removes the specified attribute from this sort. **/
	public function remove(attribute: String): Sort
		return this.filter(item -> item.name != attribute);

	/** Sets the order of the specified attribute. **/
	@:arrayAccess public function set(attribute: String, order: SortOrder): Sort
		return exists(attribute) ? this.replace(item -> item.name == attribute, item -> new Named(item.name, order)) : append(attribute, order);

	/** Returns a string representation of this object. **/
	@:to public function toString() return [for (item in this) '${item.value == Asc ? "" : "-"}${item.name}'].join(",");
}

/** Specifies the order of a sort parameter. **/
#if tink_sql
typedef SortOrder = Order;
#else
enum SortOrder {

	/** The sort is ascending. **/
	Asc;

	/** The sort is descending. **/
	Desc;
}
#end
