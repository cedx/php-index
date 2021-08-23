package directory_index.client;

/** The root view. **/
class Root extends View {

	/** Renders this view. **/
	function render() '
		<div>
			<header>
				<Navbar/>
			</header>

			<main>
				<article>
					<table class="table table-sticky table-striped">
						<thead>
							<tr>
								<th></th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td></td>
								<td></td>
								<td></td>
							</tr>
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
