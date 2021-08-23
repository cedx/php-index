package directory_index.client;

import directory_index.base.FileSystemEntity;
import directory_index.base.Sort;
import js.Browser.location;
import js.lib.intl.DateTimeFormat;
import js.lib.intl.NumberFormat;
import tink.Json;

using haxe.io.Path;
using js.lib.Date;

/** The root view. **/
class Root extends View {

	/** The byte units. **/
	final byteMapping = ["", "K", "M", "G", "T", "P"];

	/** The formatter used to format the modification dates. **/
	final dateFormatter = new DateTimeFormat(Application.instance.language, cast {dateStyle: "medium", timeStyle: "short"});

	/** The list of file system entities. **/
	@:state var entities: List<FileSystemEntity> = new List<FileSystemEntity>();

	/** The HTTP client. **/
	final http = Application.instance.get(Http);

	/** The current path. **/
	final path = location.pathname.removeTrailingSlashes();

	/** The formatter used to format the file sizes. **/
	final sizeFormatter = new NumberFormat(Application.instance.language, {maximumFractionDigits: 2});

	/** The current sort. **/
	var sort = new Sort();

	/** Formats the specified size. **/
	function formatSize(bytes: Float) {
		var index = 0;
		while (bytes > 1000) {
			bytes /= 1000;
			index++;
		}

		return sizeFormatter.format(bytes) + byteMapping[index];
	}

	/** Renders this view. **/
	function render() '
		<div>
			<header>
				<Navbar/>
			</header>

			<main>
				<Title appendAppName=${false} text=${location.hostname + " - " + (path.length == 0 ? "/" : path)}/>

				<article id="listing">
					<if ${path.length > 0}>
						<h2 class="mb-2">${path}</h2>
					</if>

					<table class="table table-hover table-sticky table-striped">
						<thead>
							<tr>
								<th onclick=${sortList("path")} scope="col">
									<span role="button">Name <i class="bi bi-${sort.getIcon('path')}"/></span>
								</th>
								<th class="text-end" onclick=${sortList("size")} scope="col">
									<span role="button">Size <i class="bi bi-${sort.getIcon('size')}"/></span>
								</th>
								<th class="d-none d-sm-table-cell text-end" onclick=${sortList("modifiedAt")} scope="col">
									<span role="button">Last modified <i class="bi bi-${sort.getIcon('modifiedAt')}"/></span>
								</th>
							</tr>
						</thead>
						<tbody>
							<if ${path.length > 0}>
								<tr>
									<td colSpan=${2}>
										<div class="text-truncate">
											<a href="..">
												<i class="bi bi-arrow-90deg-up me-2"/>Parent directory
											</a>
										</div>
									</td>
									<td class="d-none d-sm-table-cell"></td>
								</tr>
							</if>
							<for ${entity in entities}>
								<tr>
									<td>
										<div class="text-truncate">
											<a href=${entity.type == File ? entity.path : entity.path.addTrailingSlash()}>
												<i class="bi bi-${entity.icon} me-2"/>${entity.path}
											</a>
										</div>
									</td>
									<td class="text-end">
										<if ${entity.type == Directory}>
											&ndash;
										<else>
											${formatSize(entity.size)}
										</if>
									</td>
									<td class="d-none d-sm-table-cell text-end">
										${dateFormatter.format(entity.modifiedAt.fromHaxeDate())}
									</td>
								</tr>
							</for>
						</tbody>
					</table>
				</article>
			</main>
		</div>
	';

	/** Sorts the list of file system entities. **/
	function sortList(attribute: String) {
		sort = sort.exists(attribute) ? [attribute => (sort[attribute] == Asc ? Desc : Asc)] : [attribute => Asc];
		entities = entities.sort((x, y) -> {
			final field1 = Reflect.getProperty(x, attribute);
			final field2 = Reflect.getProperty(y, attribute);

			final value = switch attribute {
				case "modifiedAt":
					Reflect.compare((field1: Date).getTime(), (field2: Date).getTime());
				case "path":
					final areDirectories = x.type == Directory && y.type == Directory;
					final areFiles = x.type == File && y.type == File;
					areDirectories || areFiles ? Reflect.compare(x.path, y.path) : x.type == Directory ? -1 : 1;
				default:
					Reflect.compare(field1, field2);
			}

			sort[attribute] == Asc ? value : -value;
		});
	}

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() http.get("?listing").handle(outcome -> switch outcome {
		case Failure(error):
			trace(error); // TODO
		case Success(response):
			entities = (Json.parse(response.body.toString()): Array<FileSystemEntity>);
			sortList("path");
	});
}
