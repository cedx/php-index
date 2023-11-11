package php_index.client.shell;

import js.Browser;

/** The root view. **/
class Root extends View {

	/** Value indicating whether the browser is online. **/
	@:state var isOnline: Bool = Browser.navigator.onLine;

	/** The localized messages. **/
	final messages = Container.instance.messages;

	/** Renders this view. **/
	function render() '
		<>
			<header>
				<Navbar/>
			</header>

			<main>
				<if ${!isOnline}>
					<div class="alert alert-danger border-end-0 border-start-0 mb-0 rounded-0">
						<i class="icon icon-fill fw-bold me-1">error</i> ${messages.offline()}
					</div>
				</if>

				<php_index.client.listing.Listing/>
			</main>
		</>
	';

	/** Method invoked after this view is mounted. **/
	override function viewDidMount()
		for (event in ["online", "offline"]) Browser.window.addEventListener(event, () -> isOnline = Browser.navigator.onLine);
}
