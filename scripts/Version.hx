//! --class-path src
import php_index.base.Version;

/** Updates the version number in the sources. **/
function main()
	Tools.replaceInFile("package.json", ~/"version": "\d+(\.\d+){2}"/, '"version": "${Version.packageVersion}"');
