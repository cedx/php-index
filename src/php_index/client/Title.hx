package php_index.client;

import js.Browser.document;

/** Sets the title of the current document. **/
class Title extends View {

	/** The text of the document title. **/
	@:tracked @:attribute var text: String = "";

	/** Renders this view. **/
	function render() return null;

	/** Method invoked each time after rendering. **/
	override function viewDidRender(firstTime: Bool) document.title = text;
}
