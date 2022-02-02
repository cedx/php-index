//! --class-path src
import php_index.base.Version;
import php_index.cli.Tools;

/** Runs the script. **/
function main()
	Tools.replaceInFile("package.json", ~/"version": "\d+(\.\d+){2}"/, '"version": "${Version.packageVersion}"');
