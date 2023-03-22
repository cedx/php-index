import haxe.crypto.Md5;
import sys.FileSystem;
import sys.io.File;
using haxe.io.Path;

/** Packages the project. **/
function main() {
	for (script in ["Clean", "Build", "Version"]) Sys.command('lix $script');
	Sys.command("git checkout -- src/php_index/ui/index.css");

	final bundle = "www/js/main.js";
	Sys.command('npx esbuild --allow-overwrite --legal-comments=none --log-level=warning --minify --outfile=$bundle $bundle');

	for (type in ["css", "js"]) {
		final input = 'www/$type/main.$type';
		final output = "main".withExtension('${Md5.encode(File.getContent(input))}.$type');
		FileSystem.rename(input, 'www/$type/$output');
		Tools.replaceInFile("www/index.html", new EReg('main(\\.[a-f\\d]+)?\\.$type', "g"), output);
	}
}
