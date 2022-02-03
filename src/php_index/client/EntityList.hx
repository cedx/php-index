package php_index.client;

import php_index.base.FileSystemEntity;
import php_index.base.Sort;
import tink.Json;

/** Represents a list of file system entities. **/
class EntityList implements Model {

	/** The function that fetches the list items. **/
	@:constant var fetch: () -> Promise<List<FileSystemEntity>> = () -> Application.instance.get(Http).get("?listing").next(response -> {
		items = (Json.parse(response.body.toString()): List<FileSystemEntity>);
		orderBy("path");
		items;
	});

	/** The list items. **/
	@:editable var items: List<FileSystemEntity> = new List();

	/** The current sort. **/
	@:editable var sort: Sort = new Sort();

	/** The loading status. **/
	@:loaded var status: List<FileSystemEntity> = fetch();

	/** Sorts the list of file system entities. **/
	public function orderBy(attribute: String, ?direction: SortDirection) {
		if (direction == null) direction = if (sort.exists(attribute)) sort[attribute] == Asc ? Desc : Asc else Asc;
		sort = [attribute => direction];
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

			direction == Asc ? value : -value;
		});
	}
}
