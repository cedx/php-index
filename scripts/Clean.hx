import Tools.cleanDirectory;
import Tools.removeDirectory;
import sys.FileSystem.*;

using Lambda;

/** Runs the script. **/
function main() {
	if (exists("index.php")) deleteFile("index.php");
	["lib", "www/css", "www/fonts", "www/js"].filter(exists).iter(removeDirectory);
	cleanDirectory("var");
}
