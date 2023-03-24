//! --class-path src
import php_index.base.Version;

/** Publishes the package. **/
function main() {
	Sys.command("npm publish");
	for (action in ["tag", "push origin"]) Sys.command('git $action v${Version.packageVersion}');
}
