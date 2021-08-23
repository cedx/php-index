package directory_index.client;

import directory_index.base.FileSystemEntity;
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

	/** The formatter used to format the file sizes. **/
	final sizeFormatter = new NumberFormat(Application.instance.language, {maximumFractionDigits: 2});

	/** The page title. **/
	final title = location.pathname.removeTrailingSlashes();

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
				<article id="listing">
					<if ${title.length > 0}>
						<h2 class="mb-2">${title}</h2>
					</if>

					<table class="table table-hover table-sticky table-striped">
						<thead>
							<tr>
								<th scope="col">Name</th>
								<th class="text-end" scope="col">Size</th>
								<th class="text-end" scope="col">Last modified</th>
							</tr>
						</thead>
						<tbody>
							<for ${entity in entities}>
								<tr>
									<td>
										<div class="text-truncate">
											<i class="bi bi-${entity.icon} me-1"/> ${entity.path}
										</div>
									</td>
									<td class="text-end">
										<if ${entity.type == Directory}>
											&ndash;
										<else>
											${formatSize(entity.size)}
										</if>
									</td>
									<td class="text-end">
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
	function sortList() {
		// TODO
		entities = entities.sort((x, y) -> {
			final areDirectories = x.type == Directory && y.type == Directory;
			final areFiles = x.type == File && y.type == File;
			areDirectories || areFiles ? Reflect.compare(x.path, y.path) : x.type == Directory ? -1 : 1;
		});
	}

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() http.get("?listing").handle(outcome -> switch outcome {
		case Failure(error):
			trace(error); // TODO
		case Success(response):
			entities = (Json.parse(response.body.toString()): Array<FileSystemEntity>);
			sortList();
	});
}
