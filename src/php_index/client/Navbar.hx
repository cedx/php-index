package php_index.client;

import haxe.Timer;
import js.Browser;
import js.lib.Date;
import js.lib.intl.DateTimeFormat;

using DateTools;

/** The navigation bar. **/
class Navbar extends View {

	/** The current date. **/
	@:state var date = "";

	/** The formatter used to format the current date. **/
	final dateFormatter = new DateTimeFormat(Application.instance.language, cast {dateStyle: "full"});

	/** Renders this view. **/
	function render() '
		<nav class="bg-primary d-print-none navbar navbar-dark navbar-expand-lg fixed-top shadow user-select-none">
			<div class="container-fluid">
				<div class="d-flex align-items-center">
					<span class="navbar-brand">
						<img alt="" src="?file=img/navbar_logo.svg"/>
					</span>
					<span class="navbar-brand">
						${Browser.location.hostname}
					</span>
				</div>

				<span class="d-none d-sm-block navbar-text text-capitalize-first">
					${date}
				</span>
			</div>
		</nav>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		final timer = new Timer(Std.int(1.hours()));
		date = dateFormatter.format(new Date());
		timer.run = () -> date = dateFormatter.format(new Date());
		beforeUnmounting(timer.stop);
	}
}