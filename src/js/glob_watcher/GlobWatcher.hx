package js.glob_watcher;

import haxe.extern.EitherType;
import js.lib.Error;

/** Watches for file changes. **/
@:jsRequire("glob-watcher")
extern class GlobWatcher {

	/** Watches globs and executes a function upon change. **/
	@:selfCall
	static function watch(globs: EitherType<String, Array<String>>, callback: (?Error -> Void) -> Void): Void;
}
