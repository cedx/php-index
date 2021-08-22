import Tools.replaceInFile;
import directory_index.base.Version.*;

/** Runs the script. **/
function main() {
	replaceInFile("package.json", ~/"version": "\d+(\.\d+){2}"/, '"version": "${getPackageVersion()}"');
	replaceInFile("www/main.html", ~/(href|src)="(css|js)\/(.+)\?[\da-f]+"/g, '$$1="$$2/$$3?${getGitCommitHash()}"');
}
