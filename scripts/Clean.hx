import Tools.cleanDirectory;
import Tools.removeDirectory;
import sys.FileSystem.*;

using Lambda;

/** Runs the script. **/
function main() {
	if (exists("index.php")) deleteFile("index.php");
	for (directory in ["lib", "www/css", "www/js"]) if (exists(directory)) removeDirectory(directory);
	cleanDirectory("var");
}
