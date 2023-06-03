package php_index.client.shell;

import js.Browser;

/** The navigation bar. **/
class Navbar extends View {

	/** Renders this view. **/
	function render() '
		<nav class="navbar navbar-dark navbar-expand-sm">
			<div class="container-fluid">
				<div class="navbar-brand">
					<span><img alt="" height=${24} src="?file=favicon.svg" width=${24}/></span>
					<span class="ms-2">${Browser.location.hostname}</span>
				</div>

				<div class="collapse navbar-collapse">
					<span class="navbar-text ms-auto">
						<Clock dateStyle=${Long} locale=${Container.instance.locale} timeout=${1_800}/>
					</span>
					<ul class="navbar-nav ms-3">
						<li class="nav-item">
							<div class="vr h-100 mx-2 text-white"/>
						</li>
						<Theme.ThemeSelector/>
					</ul>
				</div>
			</div>
		</nav>
	';
}
