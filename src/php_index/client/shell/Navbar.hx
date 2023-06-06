package php_index.client.shell;

import js.Browser;

/** The navigation bar. **/
class Navbar extends View {

	/** Renders this view. **/
	function render() '
		<nav class="navbar navbar-expand-sm">
			<div class="container-fluid">
				<div class="navbar-brand">
					<span><img alt="" height=${24} src="?file=favicon.svg" width=${24}/></span>
					<span class="ms-2">${Browser.location.hostname}</span>
				</div>

				<div class="collapse navbar-collapse">
					<menu class="navbar-nav mb-0 ms-auto">
						<Theme.ThemeSelector/>
					</menu>
				</div>
			</div>
		</nav>
	';
}
