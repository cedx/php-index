//! --class-path src
import php_index.cli.Tools;
import sys.FileSystem;
using Lambda;

/** Runs the script. **/
function main() {
	if (FileSystem.exists("index.php")) FileSystem.deleteFile("index.php");
	["lib", "www/css", "www/fonts", "www/js"].filter(FileSystem.exists).iter(Tools.removeDirectory);
	Tools.cleanDirectory("var", ~/^\.gitkeep$/);
}
