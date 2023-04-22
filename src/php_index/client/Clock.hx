package php_index.client;

import coconut.ui.View;
import haxe.Timer;
import intl.DateFormat;
import intl.Locale;
import js.Browser;
import js.Lib;
using DateTools;

/** Displays the current date and/or time. **/
class Clock extends View {

	/** The date style. **/
	@:attribute final dateStyle: Null<DateFormatStyle> = null;

	/** The locale used to format the clock display. **/
	@:attribute final locale: Locale = {
		final language = Browser.document.documentElement.lang;
		language.length > 0 ? language : Browser.navigator.language;
	}

	/** The timer delay, in seconds. **/
	@:attribute final timeout = 1.0;

	/** The time style. **/
	@:attribute final timeStyle: Null<DateFormatStyle> = null;

	/** The clock value. **/
	@:state var value = "";

	/** Renders this view. **/
	function render() '<>${value}</>';

	/** Updates this view. **/
	function update(formatter: DateFormat) {
		final now = formatter.format(Date.now());
		value = now.charAt(0).toUpperCase() + now.substring(1);
	}

	/** Method invoked after this view is mounted. **/
	override function viewDidMount() {
		final formatter = new DateFormat(locale, {dateStyle: dateStyle ?? Lib.undefined, timeStyle: timeStyle ?? Lib.undefined});
		update(formatter);

		final timer = new Timer(Std.int(timeout.seconds()));
		timer.run = () -> update(formatter);
		beforeUnmounting(timer.stop);
	}
}
