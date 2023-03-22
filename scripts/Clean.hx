import sys.FileSystem;
using Lambda;

/** Deletes all generated files. **/
function main() {
	["phar", "php"].map(ext -> 'www/index.$ext').filter(FileSystem.exists).iter(FileSystem.deleteFile);
	["lib", "res", "www/css", "www/fonts", "www/js"].filter(FileSystem.exists).iter(Tools.removeDirectory);
	Tools.cleanDirectory("var");
}
