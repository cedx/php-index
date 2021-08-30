package php_index.base;

using StringTools;

/** Represents information relevant to the sorting of data items. **/
@:forward(clear, exists, get, keyValueIterator, keys, remove, set)
abstract Sort(Map<String, SortDirection>) from Map<String, SortDirection> to Map<String, SortDirection> {

	/** Creates a new sort. **/
	public function new(?attributes: Map<String, SortDirection>) this = attributes != null ? attributes : [];

	/** Gets the icon corresponding the specified attribute. **/
	public function getIcon(attribute: String) return switch this.get(attribute) {
		case Asc: "sort-down-alt";
		case Desc: "sort-up";
		default: "filter";
	};

	/** Creates a new sort from the specified string. **/
	@:from static function ofString(value: String)
		return new Sort(value == null || value.length == 0 ? [] : [for (item in value.split(",")) {
			final direction = item.charAt(0) == "-" ? Desc : Asc;
			final attribute = direction == Asc ? item : item.substring(1);
			attribute.urlDecode() => direction;
		}]);

	/** Gets the direction corresponding to the specified attribute. **/
	@:arrayAccess inline function read(attribute: String) return this.get(attribute);

	/** Returns a string representation of this object. **/
	@:to function toString()
		return [for (attribute => direction in this) (direction == Asc ? "" : "-") + attribute.urlEncode()].join(",");

	/** Sets the direction of the specified attribute. **/
	@:arrayAccess inline function write(attribute: String, direction: SortDirection) {
		this.set(attribute, direction);
		return direction;
	}
}

/** Specifies the direction of a sort parameter. **/
#if tink_sql
typedef SortDirection = tink.sql.OrderBy.Order;
#else
enum SortDirection { Asc; Desc; }
#end
