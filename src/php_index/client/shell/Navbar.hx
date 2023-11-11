package php_index.client.shell;

import js.Browser;

/** The navigation bar. **/
class Navbar extends View {

	/** The localized messages. **/
	final messages = Container.instance.messages;

	/** Renders this view. **/
	function render() '
		<nav class="navbar navbar-expand-sm">
			<div class="container-fluid">
				<div class="navbar-brand">
					<img height=${24} src="?file=favicon.svg" width=${24}/>
					<span class="ms-2">${Browser.location.hostname}</span>
				</div>

				<div class="collapse navbar-collapse">
					<menu class="navbar-nav ms-auto">
						<Theme.ThemeDropdown label=${messages.theme()}/>
					</menu>
				</div>
			</div>
		</nav>
	';
}
