//! --class-path src
import Sys.*;
import php_index.base.Version.*;
import php_index.cli.Tools.*;

/** Runs the script. **/
function main() {
	command("lix Dist");
	for (action in ["tag", "push origin"]) command('git $action v${getPackageVersion()}');

	command("lix Dist");
	compress(["CHANGELOG.md", "LICENSE.md", "README.md", "haxelib.json", "lib", "run.n", "src", "www"], "var/haxelib.zip");
	command("haxelib submit var/haxelib.zip");

	final tag = 'v${getPackageVersion()}';
	for (action in ["tag", "push origin"]) command('git $action $tag');
}
