package directory_index.client;

import js.Browser.document;

/** Sets the title of the current document. **/
class Title extends View {

	/** Value indicating whether to append the application name to the document title. **/
	@:tracked @:attribute var appendAppName: Bool = true;

	/** The text of the document title. **/
	@:tracked @:attribute var text: String = "";

	/** Renders this view. **/
	function render() return null;

	/** Method invoked each time after rendering. **/
	override function viewDidRender(firstTime: Bool)
		document.title = appendAppName ? '$text - ${Application.instance.name}' : text;
}
