//! --class-path src
import Sys.*;
import php_index.base.Version.*;
import sys.FileSystem.*;
import sys.io.File.*;

using DateTools;
using Lambda;

/** Runs the script. **/
function main() {
	for (script in ["Clean", "Version", "Build"]) command('lix $script');
	["css/main.css", "js/main.js", "worker.js"].map(file -> 'www/$file.map').filter(exists).iter(deleteFile);

	command("npx cleancss -O2 --output=www/css/main.css www/css/main.css");
	for (file in ["js/main.js", "worker.js"]) command('npx terser --comments=false --config-file=etc/terser.json --output=www/$file www/$file');

	final output = append("www/worker.js");
	output.writeString('\n// ${Date.now().format("%F %T")} $gitCommitHash');
	output.close();
}
