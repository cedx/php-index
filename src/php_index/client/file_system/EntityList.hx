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
		if (order == null) order = sort[attribute].or(Asc) == Asc ? Desc : Asc;
		sort = new Sort().append(attribute, order);
		items = items.sort((x, y) -> switch attribute {
			case "path": -1;
			default: sort.compare(x, y);
		});

		/* TODO
		if (order == null) order = if (sort.exists(attribute)) sort[attribute] == Asc ? Desc : Asc else Asc;
		items = items.sort((x, y) -> {
			final field1 = Reflect.getProperty(x, attribute);
			final field2 = Reflect.getProperty(y, attribute);
			final value = switch attribute {
				case "modifiedAt":
					Reflect.compare((field1: Date).getTime(), (field2: Date).getTime());
				case "path":
					final areDirectories = x.type == Directory && y.type == Directory;
					final areFiles = x.type == File && y.type == File;
					if (areDirectories || areFiles) Reflect.compare(field1, field2) else x.type == Directory ? -1 : 1;
				default:
					Reflect.compare(field1, field2);
			}

			order == Asc ? value : -value;
		});*/
	}
}
