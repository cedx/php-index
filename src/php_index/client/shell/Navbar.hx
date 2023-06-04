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
					<span class="navbar-text ms-auto">
						<Clock dateStyle=${Full} locale=${Container.instance.locale} timeout=${1_800}/>
					</span>
				</div>
			</div>
		</nav>
	';
}
