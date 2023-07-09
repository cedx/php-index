//! --class-path src --library tink_core
import php_index.base.Platform;

/** Publishes the package. **/
function main() {
	Sys.command("npm publish");
	for (action in ["tag", "push origin"]) Sys.command('git $action v${Platform.packageVersion}');
}
