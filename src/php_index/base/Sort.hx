package php_index.base;

#if tink_sql
import tink.sql.OrderBy.Order;
#end

/** Represents information relevant to the sorting of data items. **/
@:forward(clear, exists, keyValueIterator, keys, remove)
abstract Sort(Map<String, SortDirection>) from Map<String, SortDirection> to Map<String, SortDirection> {

	/** Creates a new sort. **/
	public function new(?attributes: Map<String, SortDirection>) this = attributes != null ? attributes : [];

	/** Gets the icon corresponding the specified attribute. **/
	public function getIcon(attribute: String) return switch this[attribute] {
		case Asc: "sort-down-alt";
		case Desc: "sort-up";
		default: "filter";
	};

	/** Creates a new sort from the specified string. **/
	@:from static function ofString(value: String)
		return new Sort(value == null || value.length == 0 ? [] : [for (item in value.split(",")) {
			final direction = item.charAt(0) == Desc ? Desc : Asc;
			final attribute = direction == Asc ? item : item.substring(1);
			attribute => direction;
		}]);

	/** Gets the direction corresponding to the specified attribute. **/
	@:arrayAccess inline function read(attribute: String) return this[attribute];

	/** Returns a string representation of this object. **/
	@:to public function toString() return [for (attribute => direction in this) '$direction$attribute'].join(",");

	/** Sets the direction of the specified attribute. **/
	@:arrayAccess inline function write(attribute: String, direction: SortDirection) return this[attribute] = direction;
}

/** Specifies the direction of a sort parameter. **/
enum abstract SortDirection(String) from String {

	/** The sort is ascending. **/
	var Asc = "";

	/** The sort is descending. **/
	var Desc = "-";

	#if tink_sql
	/** Converts this value to an SQL order. **/
	@:to function toSqlOrder() return this == Desc ? Order.Desc : Order.Asc;
	#end
}
