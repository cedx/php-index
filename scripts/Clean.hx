//! --class-path src
import php_index.cli.Tools;
import sys.FileSystem;
using Lambda;

/** Runs the script. **/
function main() {
	if (exists("index.php")) deleteFile("index.php");
	["lib", "www/css", "www/fonts", "www/js"].filter(exists).iter(Tools.removeDirectory);
	FileSystem.cleanDirectory("var", ~/^\.gitkeep$/);
}
