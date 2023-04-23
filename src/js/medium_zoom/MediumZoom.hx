package js.medium_zoom;

import haxe.Constraints.Function;
import haxe.extern.EitherType;
import js.html.AddEventListenerOptions;
import js.html.Element;
import js.html.EventListener;
import js.html.NodeList;
import js.html.TemplateElement;
import js.lib.Promise;

/** Provides a zoom effect for a selection of images. **/
@:native("mediumZoom")
extern class MediumZoom {

	/** Attaches a zoom effect to a selection of images. **/
	@:selfCall
	@:overload(function(selector: ZoomSelector, ?options: ZoomOptions): Zoom {})
	static function zoom(?options: ZoomOptions): Zoom;
}

/** Handles the zoom effect. **/
extern class Zoom {

	/** Attaches the images to the zoom. **/
	function attach(...selectors: ZoomSelector): Zoom;

	/** Extends the zoom with the provided options merged with the current ones. **/
	function clone(?options: ZoomOptions): Zoom;

	/** Closes the zoom. **/
	function close(): Promise<Zoom>;

	/** Releases the images from the zoom. **/
	function detach(...selectors: ZoomSelector): Zoom;

	/** Returns the zoom images. **/
	function getImages(): Array<Element>;

	/** Returns the zoom options. **/
	function getOptions(): ZoomOptions;

	/** Returns the current zoomed image. **/
	function getZoomedImage(): Element;

	/** Unregisters an event handler. **/
	function off(type: ZoomEvent, listener: EitherType<Function, EventListener>, ?options: EitherType<Bool, AddEventListenerOptions>): Zoom;

	/** Opens the zoom. **/
	function open(?options: ZoomOpenOptions): Promise<Zoom>;

	/** Registers an event handler on each target of the zoom. **/
	function on(type: ZoomEvent, listener: EitherType<Function, EventListener>, ?options: EitherType<Bool, AddEventListenerOptions>): Zoom;

	/** Toggles the zoom. **/
	function toggle(?options: ZoomOpenOptions): Promise<Zoom>;

	/** Updates the options. **/
	function update(options: ZoomOptions): Zoom;
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

/** Enumeration of events emitted by the zoom. **/
enum abstract ZoomEvent(String) to String {

	/** Fired immediately when the close method is called. **/
	var Close = "close";

	/** Fired when the zoom out has finished being animated. **/
	var Closed = "closed";

	/** Fired when the detach method is called. **/
	var Detach = "detach";

	/** Fired immediately when the open method is called. **/
	var Open = "open";

	/** Fired when the zoom has finished being animated. **/
	var Opened = "opened";

	/** Fired when the update method is called. **/
	var Update = "update";
}

/** Defines the options of the `Zoom.open()` method. **/
typedef ZoomOpenOptions = {

	/** The target of the zoom. **/
	var ?target: Element;
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
