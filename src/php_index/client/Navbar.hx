package php_index.client;

import haxe.Timer;
import intl.DateFormat;
import js.Browser;
using DateTools;

/** The navigation bar. **/
class Navbar extends View {

	/** The current date. **/
	@:state var date = "";

	/** The formatter used to format the current date. **/
	final dateFormatter = new DateFormat(Browser.navigator.language, {dateStyle: Full});

	/** Converts the first letter of the specified string to upper case. **/
	function capitalize(value: String) return value.charAt(0).toUpperCase() + value.substring(1);

	/** Renders this view. **/
	function render() '
		<nav class="navbar navbar-dark">
			<div class="container-fluid">
				<div class="navbar-brand">
					<span><img alt="" height=${24} src="?file=favicon.svg" width=${24}/></span>
					<span class="ms-2">${Browser.location.hostname}</span>
				</div>

				<div class="d-none d-sm-block navbar-text">
					${date}
				</div>
			</div>
		</nav>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		final timer = new Timer(Std.int(1.hours()));
		date = capitalize(dateFormatter.format(Date.now()));
		timer.run = () -> date = capitalize(dateFormatter.format(Date.now()));
		beforeUnmounting(timer.stop);
	}
}
