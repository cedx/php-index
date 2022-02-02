//! --class-path src
import php_index.base.Version;
import sys.FileSystem;
import sys.io.File;
using DateTools;
using Lambda;

/** Runs the script. **/
function main() {
	for (script in ["Clean", "Version", "Build"]) Sys.command('lix $script');
	["css/main.css", "js/main.js", "worker.js"].map(file -> 'www/$file.map').filter(FileSystem.exists).iter(FileSystem.deleteFile);

	Sys.command("npx cleancss -O2 --output=www/css/main.css www/css/main.css");
	for (file in ["js/main.js", "worker.js"]) Sys.command('npx terser --comments=false --config-file=etc/terser.json --output=www/$file www/$file');

	final output = File.append("www/worker.js");
	output.writeString('\n// ${Date.now().format("%F %T")} ${Version.gitCommitHash}');
	output.close();
}
