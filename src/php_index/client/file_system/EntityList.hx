package php_index.client.file_system;

import php_index.base.data.Sort;
import php_index.base.io.FileSystemEntity;

/** Represents a list of file system entities. **/
class EntityList implements Model {

	/** The list items. **/
	@:editable var items: List<FileSystemEntity> = new List();

	/** The number of list items. **/
	@:computed var length: Int = items.length;

	/** The current sort. **/
	@:editable var sort: Sort = new Sort();

	/** The loading status. **/
	@:loaded var status: List<FileSystemEntity> = Container.instance.remote.index({listing: true}).next(list -> {
		items = list;
		orderBy("path");
		items;
	});

	/** Sorts the list of file system entities. **/
	public function orderBy(attribute: String, ?order: SortOrder) {
		if (order == null) order = sort[attribute].or(Desc) == Asc ? Desc : Asc;
		sort = new Sort().append(attribute, order);
		items = items.sort((x, y) -> switch attribute {
			case "path":
				final value = x.type == y.type ? Reflect.compare(x.path, y.path) : x.type == Directory ? -1 : 1;
				order == Asc ? value : -value;
			default:
				sort.compare(x, y);
		});
	}
}
