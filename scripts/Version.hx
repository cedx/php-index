//! --class-path src
import Tools.replaceInFile;
import directory_index.base.Version.*;

/** Runs the script. **/
function main() replaceInFile("package.json", ~/"version": "\d+(\.\d+){2}"/, '"version": "${getPackageVersion()}"');
