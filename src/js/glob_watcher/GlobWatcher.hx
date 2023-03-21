package js.glob_watcher;

import haxe.extern.EitherType;
import js.lib.Error;

/** Watches for file changes. **/
@:jsRequire("glob-watcher")
extern class GlobWatcher {

	/** Watches globs and executes a function upon change. **/
	@:selfCall
	@:overload(function(globs: EitherType<String, Array<String>>, options: GlobWatcherOptions, callback: (?Error -> Void) -> Void): Void {})
	static function watch(globs: EitherType<String, Array<String>>, callback: (?Error -> Void) -> Void): Void;
}

/** Defines the options of the `GlobWatcher.watch` method. **/
typedef GlobWatcherOptions = {

	/** Value indicating whether to ignore the triggering of the callback function at startup. **/
	var ?ignoreInitial: Bool;
}
