/** Packages the project. **/
function main() {
	for (script in ["Clean", "Build", "Version"]) Sys.command('lix $script');
	Sys.command("git checkout -- src/php_index/ui/index.css");

	final bundle = "www/js/main.js";
	Sys.command('npx esbuild --allow-overwrite --legal-comments=none --log-level=warning --minify --outfile=$bundle $bundle');
	Sys.command("npx gulp --gulpfile=scripts/Dist.mjs");

	final cli = "bin/php_index.js";
	Sys.command('npx esbuild --allow-overwrite --legal-comments=none --log-level=warning --minify --outfile=$cli --platform=node $cli');
	Sys.command('git update-index --chmod=+x $cli');
	if (Sys.systemName() != "Windows") Sys.command('chmod +x $cli');
}
