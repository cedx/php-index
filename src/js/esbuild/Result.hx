package js.esbuild;

/** Represents a `Esbuild.build` result. **/
typedef BuildResult = {}

/** Represents a `BuildContext.serve` result. **/
typedef ServeResult = {

	/** The host that the server is listening to. **/
	var host: String;

	/** The port that the server is listening to. **/
	var port: Int;
}
