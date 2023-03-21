package js.esbuild;

import js.lib.Promise;

/** Provides access to the [`esbuild`](https://esbuild.github.io) API. **/
@:jsRequire("esbuild")
extern class Esbuild {

	/** Builds the entry point files. **/
	static function build(options: Options.BuildOptions): Promise<Result.BuildResult>;

	/** Creates a build context. **/
	static function context(options: Options.BuildOptions): Promise<BuildContext>;
}

/** Represents a build context. **/
extern class BuildContext {

	/** Rebuilds the entry point files. **/
	function rebuild(): Promise<Result.BuildResult>;

	/** Starts the built-in web server. **/
	function serve(?options: Options.ServeOptions): Promise<Result.ServeResult>;

	/** Listens for changes on the file system and rebuilds whenever a file change invalidates the build. **/
	function watch(?options: Options.WatchOptions): Promise<Void>;
}
