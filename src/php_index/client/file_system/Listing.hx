package php_index.client.file_system;

import intl.SimpleUnit;
import js.Browser;

/** Displays the list of file system entities. **/
class Listing extends View {

	/** The byte units. **/
	final byteUnits: Array<SimpleUnit> = [Byte, Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte];

	/** The list of file system entities. **/
	@:state var entities: EntityList = new EntityList();

	/** The localized messages. **/
	final messages: Messages = Container.instance.messages;

	/** The current path. **/
	final path = Browser.location.pathname.length > 1
		? Browser.location.pathname.substring(0, Browser.location.pathname.length - 1)
		: Browser.location.pathname;

	/** The view corresponding to the file listing. **/
	function listing(attr: {}) '
		<div>
		</div>
	';

	/** Renders this view. **/
	function render() '
		<article id="listing">
			<section class=${{"border-bottom": entities.length > 0}}>
				<h3 class="mb-0">${messages.indexOf(path)}</h3>
			</section>
		</article>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount()
		Browser.document.title = '${Browser.location.hostname} - $path';
}
