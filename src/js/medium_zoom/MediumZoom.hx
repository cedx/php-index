package js.medium_zoom;

import haxe.extern.EitherType;
import js.html.Element;
import js.html.NodeList;
import js.html.TemplateElement;

/** Provides a zoom effect for a selection of images. **/
@:native("mediumZoom")
extern class MediumZoom {

	/** Attaches a zoom effect to a selection of images. **/
	@:selfCall
	@:overload(function(selector: ZoomSelector, ?options: ZoomOptions): Void {})
	static function zoom(?options: ZoomOptions): Void;
}

/** Defines the position and size of the zoom container. **/
typedef ZoomContainer = {
	var ?bottom: Int;
	var ?height: Int;
	var ?left: Int;
	var ?right: Int;
	var ?top: Int;
	var ?width: Int;
}

/** Defines the options of the `MediumZoom.zoom()` method. **/
typedef ZoomOptions = {

	/** The background of the overlay. **/
	var ?background: String;

	/** The viewport to render the zoom in. **/
	var ?container: Null<EitherType<String, EitherType<Element, ZoomContainer>>>;

	/** The space outside the zoomed image. **/
	var ?margin: Int;

	/** The number of pixels to scroll to close the zoom. **/
	var ?scrollOffset: Int;

	/** The template element to display on zoom. **/
	var ?template: Null<EitherType<String, TemplateElement>>;
}

/** Specifies which images are attached to the zoom. **/
typedef ZoomSelector = EitherType<String, EitherType<Element, EitherType<Array<Element>, NodeList>>>;
