package php_index.client;

import js.Browser;

/** The navigation bar. **/
class Navbar extends View {

	/** Renders this view. **/
	function render() '
		<nav class="navbar navbar-dark">
			<div class="container-fluid">
				<div class="navbar-brand">
					<span><img alt="" height=${24} src="?file=favicon.svg" width=${24}/></span>
					<span class="ms-2">${Browser.location.hostname}</span>
				</div>

				<div class="d-none d-sm-block navbar-text">
					<Clock dateStyle=${Full} locale=${Container.instance.locale} timeout=${1_800}/>
				</div>
			</div>
		</nav>
	';
}
