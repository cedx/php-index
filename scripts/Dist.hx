import Sys.*;
import sys.FileSystem.*;

using Lambda;

/** Runs the script. **/
function main() {
	for (script in ["Clean", "Version", "Build"]) command('lix $script');
	["css/main.css", "js/main.js"].map(file -> 'www/$file.map').filter(exists).iter(deleteFile);
	command("npx cleancss -O2 --output=www/css/main.css www/css/main.css");
	command("npx terser --comments=false --config-file=etc/terser.json --output=www/js/main.js www/js/main.js");
}
