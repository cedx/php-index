package directory_index.client;

import haxe.Timer;
import js.Browser.location;
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
						<img alt="" height=${24} src="?file=img/logo_light.svg" width=${97}/>
					</span>
					<span class="navbar-brand">
						${location.hostname}
					</span>
				</div>

				<span class="ms-auto navbar-text text-capitalize-first d-none d-xl-inline-block">
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
