package js.esbuild;

import haxe.DynamicAccess;
import haxe.extern.EitherType;

/** The JavaScript constructs that can be dropped. **/
enum abstract Drop(String) from String to String {

	/** Removes all `console` calls from the output. **/
	var Console = "console";

	/** Removes all `debugger` statements from the output. **/
	var Debugger = "debugger";
}

/** The output format for the generated JavaScript files. **/
enum abstract Format(String) from String to String {

	/** Removes all `console` calls from the output. **/
	var CommonJsModule = "cjs";

	/** Removes all `debugger` statements from the output. **/
	var EcmaScriptModule = "esm";

	/** Removes all `debugger` statements from the output. **/
	var ImmediatelyInvokedFunction = "iife";
}

/** Defines how legal comments are preserved in the output files. **/
enum abstract LegalComments(String) from String to String {

	/** Move all legal comments to the end of the file. **/
	var Eof = "eof";

	/** Move all legal comments to a `.LEGAL.txt` file but to not link to them. **/
	var External = "external";

	/** Preserve all legal comments. **/
	var Inline = "inline";

	/** Move all legal comments to a `.LEGAL.txt` file and link to them with a comment. **/
	var Linked = "linked";

	/** Do not preserve any legal comments. **/
	var None = "none";
}

/** Defines how a source map is generated. **/
enum abstract Sourcemap(String) from String to String {

	/** A combination of `Inline` and `External`. **/
	var Both = "both";

	/** The source map is generated into a separate `.js.map` file. The `.js` output file does not contain a special comment that points to it. **/
	var External = "external";

	/** The source map is appended to the end of the `.js` output file as a `base64` payload. **/
	var Inline = "inline";

	/** The source map is generated into a separate `.js.map` file. The `.js` output file contains a special comment that points to it. **/
	var Linked = "linked";
}

/** Defines the build options. **/
typedef BuildOptions = CommonOptions & {

	/** Value indicating whether to bundle the entry points. **/
	var ?bundle: Bool;

	/** Controls how the `exports` field in `package.json` is interpreted. **/
	var ?conditions: Array<String>;

	/** Controls the file names of the output files corresponding to each entry point. **/
	var ?entryNames: String;

	/** The files that each serve as an input to the bundling algorithm. **/
	var ?entryPoints: EitherType<Array<String>, DynamicAccess<String>>;

	/** Marks files or packages as external to exclude them from the build. **/
	var ?external: Array<String>;

	/** Sets the output directory for the build operation. **/
	var ?outdir: String;

	/** Sets the output file name for the build operation. **/
	var ?outfile: String;

	/** The plugins injecting code into various parts of the build process. **/
	var ?plugins: Array<Plugin>;
}

/** Defines the common options. **/
typedef CommonOptions = {

	/** Edits the source code before building to drop certain constructs. **/
	var ?drop: Array<Drop>;

	/** Sets the output format for the generated JavaScript files. **/
	var ?format: Format;

	/** Specifies how legal comments are preserved in the output files. **/
	var ?legalComments: LegalComments;

	/** Value indicating whether the generated code will be minified instead of pretty-printed. **/
	var ?minify: Bool;

	/** Value indicating whether to generate source maps. **/
	var ?sourcemap: EitherType<Bool, Sourcemap>;
}

/** Defines the options of the `BuildContext.serve` method. **/
typedef ServeOptions = {

	/** The host that the server will listen to. **/
	var ?host: String;

	/** The port that the server will listen to. **/
	var ?port: Int;

	/** A directory of extra content to serve. **/
	var ?servedir: String;
}

/** Defines the options of the `BuildContext.watch` method. **/
typedef WatchOptions = {}
