package php_index.client.listing;

import php_index.base.data.Sort;
import php_index.base.io.FileSystemEntity;
using StringTools;

/** Represents a list of file system entities. **/
class EntityList implements Model {

	/** The list items. **/
	@:observable var items: List<FileSystemEntity> = @byDefault new List();

	/** The number of list items. **/
	@:computed var length: Int = items.length;

	/** The size in bytes of the largest file in this list. **/
	@:computed var maxFileSize: Int = items.fold((item, result) -> item.size > result ? item.size : result, 0);

	/** The current sort. **/
	@:observable var sort: Sort = @byDefault new Sort();

	/** Fetches the list items. **/
	@:transition(return items)
	function fetch()
		return Container.instance.remote.index({listing: true}).next(list -> @patch {items: List.fromArray(list)});

	/** Filters the list items. **/
	public function filter(query: String) {
		query = query.toLowerCase();
		return query.length > 0 ? items.filter(item -> item.path.toLowerCase().contains(query)) : items;
	}

	/** Sorts the list of file system entities. **/
	@:transition
	function orderBy(attribute: String, ?order: SortOrder) {
		if (order == null) order = sort[attribute].or(Desc) == Asc ? Desc : Asc;
		final sort = new Sort().append(attribute, order);
		return {
			sort: sort,
			items: items.sort((x, y) -> switch attribute {
				case "path":
					final value = if (x.type == y.type) Reflect.compare(x.path, y.path) else x.type == Directory ? -1 : 1;
					order == Asc ? value : -value;
				case _:
					sort.compare(x, y);
			})
		};
	}
}
