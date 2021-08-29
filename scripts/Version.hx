//! --class-path src
import directory_index.base.Version.*;
import directory_index.cli.Tools.*;

/** Runs the script. **/
function main()
	replaceInFile("package.json", ~/"version": "\d+(\.\d+){2}"/, '"version": "${getPackageVersion()}"');
